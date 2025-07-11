"use client";

import Image from "next/image";
import styles from "./novaNota.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Note {
  name: string;
  content: string;
}

export default function NotePage() {
  const router = useRouter();
  const [note, setNote] = useState<Note>({ name: "", content: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const validateSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/check-session", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, },
        });
        if (!response.ok) {
          console.error("Sessão inválida ou expirada");
          router.push("/login");
        }
      } catch (error) {
        console.error("Falha na comunicação com a API", error);
        router.push("/login");
      }
    };
    validateSession();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.logoImgArea}>
          <Image src="/smart_notes_logo1.jpeg" alt="Smart Notes Logo" width={160} height={120} priority />
        </div>
        <input
          className={styles.input}
          value={note.name}
          onChange={e => setNote({ ...note, name: e.target.value })}
          placeholder="Digite o nome da nota"
        />
        <a onClick={logout}>Sair</a>
      </div>
    </div>
  );
}