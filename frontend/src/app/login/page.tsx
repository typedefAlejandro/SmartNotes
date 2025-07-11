"use client";

import Image from "next/image";
import styles from "./login.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      alert("Login feito!");
      router.push("/nova-nota");
    } else {
      alert("Email ou senha inválidos!");
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
        <button className={styles.button} onClick={login}>Login</button>
        <div className={styles.linkArea}>
          Ainda não tem uma conta?
          <a className={styles.link} onClick={() => router.push("/register")}>Cadastre-se aqui!</a>
        </div>
      </div>
    </div>
  );
}
