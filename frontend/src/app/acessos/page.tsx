"use client";

import Image from "next/image";
import styles from "../nova-nota/novaNota.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LoginLocation {
    ip: string;
    city: string;
    region: string;
    country: string;
    timezone: string;
    latitude: number;
    longitude: number;
    loginDateTime: string;
}

export default function AcessosPage() {
    const [loginHistory, setLoginHistory] = useState<LoginLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchLoginHistory = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/auth/my-login-history-token", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        localStorage.removeItem("token");
                        router.push("/login");
                        return;
                    }
                    setError("Erro ao buscar histórico de acessos.");
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                setLoginHistory(data);
            } catch (err) {
                setError("Erro de comunicação com a API.");
            } finally {
                setLoading(false);
            }
        };

        fetchLoginHistory();
    }, [router]);

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    const formatDateTime = (dateTimeString: string) => {
        return new Date(dateTimeString).toLocaleString('pt-BR');
    };

    const getLocationDisplay = (location: LoginLocation) => {
        const parts = [];
        if (location.city) parts.push(location.city);
        if (location.region) parts.push(location.region);
        if (location.country) parts.push(location.country);
        return parts.length > 0 ? parts.join(", ") : "Localização desconhecida";
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
                </div>
                <button className={styles.button} style={{ width: 90, height: 32, fontSize: 15, marginRight: 16, textAlign: 'center' }} onClick={logout}>Sair</button>
            </nav>

            {/* Espaço para não sobrepor a navbar fixa */}
            <div style={{ height: 48 }}></div>

            <div className={styles.box} style={{ width: 600, minHeight: 400 }}>
                <div className={styles.logoImgArea}>
                    <Image src="/smart_notes_logo1.jpeg" alt="Smart Notes Logo" width={160} height={120} priority />
                </div>
                <h2 style={{ color: '#fff', marginBottom: 24 }}>Histórico de Acessos</h2>

                {loading ? (
                    <div style={{ color: '#fff' }}>Carregando histórico...</div>
                ) : error ? (
                    <div style={{ color: 'red' }}>{error}</div>
                ) : loginHistory.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: 32, color: '#fff' }}>
                        <p style={{ fontSize: 18 }}>Nenhum acesso registrado ainda.</p>
                    </div>
                ) : (
                    <div style={{ width: '100%', maxHeight: 400, overflowY: 'auto' }}>
                        <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
                            {loginHistory.map((access, index) => (
                                <li key={index} style={{
                                    background: '#fff',
                                    color: '#222',
                                    borderRadius: 8,
                                    marginBottom: 16,
                                    padding: 16,
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                                                📍 {getLocationDisplay(access)}
                                            </div>
                                            <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
                                                🌐 IP: {access.ip}
                                            </div>
                                            {access.timezone && (
                                                <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
                                                    🕐 Fuso: {access.timezone}
                                                </div>
                                            )}
                                            {access.latitude && access.longitude && (
                                                <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
                                                    📍 Coordenadas: {access.latitude.toFixed(4)}, {access.longitude.toFixed(4)}
                                                </div>
                                            )}
                                            <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
                                                ⏰ Acesso em: {formatDateTime(access.loginDateTime)}
                                            </div>
                                        </div>
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