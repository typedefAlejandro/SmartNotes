"use client";

import Image from "next/image";
import styles from "./login.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: ""
  });
  const router = useRouter();

  // Função para validar email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para validar todos os campos
  const validateFields = () => {
    const newErrors = {
      email: "",
      password: "",
      general: ""
    };

    // Validação de campos vazios
    if (!email.trim()) {
      newErrors.email = "O campo email é obrigatório";
    } else if (!validateEmail(email)) {
      newErrors.email = "Digite um email válido";
    }

    if (!password.trim()) {
      newErrors.password = "O campo senha é obrigatório";
    } else if (password.length < 4) {
      newErrors.password = "A senha deve ter no mínimo 4 dígitos";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const login = async () => {
    // Validar campos antes de fazer login
    if (!validateFields()) {
      return;
    }

    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/");
    } else {
      setErrors(prev => ({
        ...prev,
        general: "Email ou senha inválidos!"
      }));
    }
  };

  // Limpar erro quando o usuário começar a digitar
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: "" }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.logoImgArea}>
          <Image src="/smart_notes_logo1.jpeg" alt="Smart Notes Logo" width={160} height={120} priority />
        </div>

        <input
          className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
          value={email}
          onChange={handleEmailChange}
          placeholder="Digite seu email"
        />
        {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}

        <input
          className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Digite sua senha"
        />
        {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}

        {errors.general && <div className={styles.errorMessage}>{errors.general}</div>}

        <button className={styles.button} onClick={login}>Login</button>
        <div className={styles.linkArea}>
          Ainda não tem uma conta?
          <a className={styles.link} onClick={() => router.push("/register")}>Cadastre-se aqui!</a>
        </div>
      </div>
    </div>
  );
}
