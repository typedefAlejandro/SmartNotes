"use client";

import Image from "next/image";
import styles from "./register.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
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
            confirmPassword: "",
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

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "O campo confirmação de senha é obrigatório";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "As senhas não coincidem";
        }

        setErrors(newErrors);
        return !newErrors.email && !newErrors.password && !newErrors.confirmPassword;
    };

    const register = async () => {
        // Validar campos antes de fazer registro
        if (!validateFields()) {
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
            setErrors(prev => ({
                ...prev,
                general: data.message || "Erro ao cadastrar!"
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
        // Limpar erro de confirmação se as senhas agora coincidem
        if (errors.confirmPassword && e.target.value === confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: "" }));
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        if (errors.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: "" }));
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

                <input
                    className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Confirme sua senha"
                />
                {errors.confirmPassword && <div className={styles.errorMessage}>{errors.confirmPassword}</div>}

                {errors.general && <div className={styles.errorMessage}>{errors.general}</div>}

                <button className={styles.button} onClick={register}>Cadastrar</button>
                <div className={styles.linkArea}>
                    Já tem uma conta?
                    <a className={styles.link} onClick={() => router.push("/login")}>Faça login aqui!</a>
                </div>
            </div>
        </div>
    );
} 