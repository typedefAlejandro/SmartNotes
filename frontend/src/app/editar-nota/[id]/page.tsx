"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../../nova-nota/novaNota.module.css";

export default function EditarNotaPage() {
    const router = useRouter();
    const { id } = useParams();
    const [note, setNote] = useState({ title: "", content: "", userId: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        const fetchNote = async () => {
            try {
                // Buscar userId
                const sessionRes = await fetch("http://localhost:8080/api/auth/check-session", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!sessionRes.ok) {
                    localStorage.removeItem("token");
                    router.push("/login");
                    return;
                }
                const sessionData = await sessionRes.json();
                // Buscar nota
                const noteRes = await fetch(`http://localhost:8080/api/notes/title?userId=${sessionData.userId}&title=`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!noteRes.ok) {
                    setError("Erro ao buscar nota.");
                    setLoading(false);
                    return;
                }
                const notes = await noteRes.json();
                const found = notes.find((n: any) => n.id == id);
                if (!found) {
                    setError("Nota não encontrada.");
                    setLoading(false);
                    return;
                }
                setNote(found);
            } catch (err) {
                setError("Erro de comunicação com a API.");
            } finally {
                setLoading(false);
            }
        };
        fetchNote();
    }, [router, id]);

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        try {
            // Buscar userId se não estiver presente
            let userId = note.userId;
            if (!userId) {
                const sessionRes = await fetch("http://localhost:8080/api/auth/check-session", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (sessionRes.ok) {
                    const sessionData = await sessionRes.json();
                    userId = sessionData.userId;
                }
            }
            const res = await fetch("http://localhost:8080/api/notes/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...note, id, userId }),
            });
            if (!res.ok) {
                alert("Erro ao salvar a nota.");
                return;
            }
            router.push("/");
        } catch (err) {
            alert("Erro ao salvar a nota.");
        }
    };

    return (
        <div className={styles.container}>
            {/* Navbar fina e fixa no topo */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 100,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.92) 60%, rgba(255,255,255,0.7) 100%)',
                padding: '8px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
                <div style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
                    <button className={styles.button} style={{ width: 90, height: 32, fontSize: 15, textAlign: 'center' }} onClick={() => router.push('/')}>Ver Notas</button>
                    <button className={styles.button} style={{ width: 132, height: 32, fontSize: 15, textAlign: 'center' }} onClick={() => router.push('/acessos')}>Verificar Acessos</button>
                </div>
                <button className={styles.button} style={{ width: 90, height: 32, fontSize: 15, marginRight: 16, textAlign: 'center' }} onClick={logout}>Sair</button>
            </nav>
            {/* Espaço para não sobrepor a navbar fixa */}
            <div style={{ height: 48 }}></div>
            <div className={styles.box}>
                <h2 style={{ color: '#fff', marginBottom: 24 }}>Editar Nota</h2>
                {loading ? (
                    <div style={{ color: '#fff' }}>Carregando nota...</div>
                ) : error ? (
                    <div style={{ color: 'red' }}>{error}</div>
                ) : (
                    <>
                        <input
                            className={styles.input}
                            value={note.title}
                            onChange={e => setNote({ ...note, title: e.target.value })}
                            placeholder="Digite o nome da nota"
                        />
                        <input
                            className={styles.input}
                            value={note.content}
                            onChange={e => setNote({ ...note, content: e.target.value })}
                            placeholder="Digite o conteúdo da nota"
                        />
                        <button className={styles.button} onClick={handleSave}>Salvar</button>
                    </>
                )}
            </div>
        </div>
    );
} 