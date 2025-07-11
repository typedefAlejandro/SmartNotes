"use client";

import Image from "next/image";
import styles from "./nova-nota/novaNota.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const fetchNotes = async () => {
      try {
        const sessionRes = await fetch("http://localhost:8080/api/auth/check-session", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!sessionRes.ok) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        const sessionData = await sessionRes.json();
        const userId = sessionData.userId;
        const notesRes = await fetch(`http://localhost:8080/api/notes/title?userId=${userId}&title=`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!notesRes.ok) {
          if (notesRes.status === 401 || notesRes.status === 403) {
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
          setError("Erro ao buscar notas.");
          setLoading(false);
          return;
        }
        const notesData = await notesRes.json();
        setNotes(notesData);
      } catch (err) {
        setError("Erro de comunicação com a API.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
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
        <button className={styles.button} style={{ width: 90, height: 32, fontSize: 15, marginLeft: 16, textAlign: 'center' }} onClick={() => router.push('/nova-nota')}>Nova Nota</button>
        <button className={styles.button} style={{ width: 90, height: 32, fontSize: 15, marginRight: 16, textAlign: 'center' }} onClick={logout}>Sair</button>
      </nav>
      {/* Espaço para não sobrepor a navbar fixa */}
      <div style={{ height: 48 }}></div>
      <div className={styles.box} style={{ width: 400, minHeight: 400 }}>
        <div className={styles.logoImgArea}>
          <Image src="/smart_notes_logo1.jpeg" alt="Smart Notes Logo" width={160} height={120} priority />
        </div>
        <h2 style={{ color: '#fff', marginBottom: 24 }}>Minhas Notas</h2>
        {loading ? (
          <div style={{ color: '#fff' }}>Carregando notas...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : notes.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 32, color: '#fff' }}>
            <p style={{ fontSize: 18, marginBottom: 24 }}>Quer começar? crie uma anotação</p>
            <button className={styles.button} onClick={() => router.push('/nova-nota')}>Criar</button>
          </div>
        ) : (
          <div style={{ width: '100%' }}>
            <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
              {notes.map(note => (
                <li key={note.id} style={{ background: '#fff', color: '#222', borderRadius: 8, marginBottom: 16, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{note.title}</div>
                    <div style={{ marginBottom: 8 }}>{note.content}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>Criada em: {new Date(note.createdAt).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => router.push(`/editar-nota/${note.id}`)} style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Editar nota">
                      <svg width="20" height="20" fill="#8b61c2" viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm2.92.92l9.13-9.13 1.83 1.83-9.13 9.13H5.92v-1.83zm13.06-12.19a1.003 1.003 0 0 0-1.42 0l-1.34 1.34 3.75 3.75 1.34-1.34a1.003 1.003 0 0 0 0-1.42l-2.33-2.33z" />
                      </svg>
                    </button>
                    <button onClick={async () => {
                      if (!confirm('Tem certeza que deseja deletar esta nota?')) return;
                      const token = localStorage.getItem('token');
                      const res = await fetch(`http://localhost:8080/api/notes/delete?id=${note.id}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      if (res.ok) {
                        setNotes(notes.filter(n => n.id !== note.id));
                      } else {
                        alert('Erro ao deletar a nota.');
                      }
                    }} style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Deletar nota">
                      <svg width="20" height="20" fill="#c22" viewBox="0 0 24 24">
                        <path d="M3 6h18v2H3V6zm2 3h14v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9zm3 2v9h2v-9H8zm4 0v9h2v-9h-2zM9 4V2h6v2h5v2H4V4h5z" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
