"use client";

import Image from "next/image";
import styles from "./novaNota.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Note {
  title: string;
  content: string;
  userId: number | null;
}

export default function NotePage() {
  const router = useRouter();
  const [note, setNote] = useState<Note>({ title: "", content: "", userId: null });

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
        const data = await response.json();
        setNote(prev => ({ ...prev, userId: data.userId }));
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

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/api/notes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(note),
      });
      if (!response.ok) console.error("Erro ao salvar a nota");
      await response.json();
      alert("Nota salva com sucesso!");
      setNote({ title: "", content: "", userId: null });
    } catch (error) {
      console.error("Erro ao salvar a nota:", error);
      alert("Erro ao salvar a nota. Tente novamente.");
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
        <a className={styles.logout} onClick={logout}>Sair</a>
      </div>
    </div>
  );
}