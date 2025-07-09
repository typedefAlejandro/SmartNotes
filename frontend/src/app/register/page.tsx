"use client";

import Image from "next/image";
import styles from "./register.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

    const register = async () => {
        if (password !== confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }
        const res = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        if (res.ok) {
            alert("Cadastro realizado com sucesso!");
            router.push("/login");
        } else {
            const data = await res.json().catch(() => ({}));
            alert(data.message || "Erro ao cadastrar!");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <div className={styles.logoImgArea}>
                    <Image src="/smart_notes_logo1.jpeg" alt="Smart Notes Logo" width={160} height={120} priority />
                </div>
                <input
                    className={styles.input}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Digite seu email"
                />
                <input
                    className={styles.input}
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                />
                <input
                    className={styles.input}
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                />
                <button className={styles.button} onClick={register}>Cadastrar</button>
                <div className={styles.linkArea}>
                    Já tem uma conta?
                    <a className={styles.link} onClick={() => router.push("/login")}>Faça login aqui!</a>
                </div>
            </div>
        </div>
    );
} 