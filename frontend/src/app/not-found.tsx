"use client";

import styles from "./nova-nota/novaNota.module.css";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();
    return (
        <div className={styles.container}>
            <div className={styles.box} style={{ width: 400, minHeight: 200, textAlign: 'center' }}>
                <h2 style={{ color: '#fff', marginBottom: 24 }}>404 - Página não encontrada</h2>
                <p style={{ color: '#fff', fontSize: 18, marginBottom: 32 }}>
                    esqueceu o que ia acessar? que tal anotar isso?
                </p>
                <button className={styles.button} onClick={() => router.push('/nova-nota')}>Criar Nota</button>
            </div>
        </div>
    );
} 