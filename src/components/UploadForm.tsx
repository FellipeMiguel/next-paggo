"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { getSession, signOut } from "next-auth/react";

type UploadFormProps = {
  onUploadSuccess?: () => void;
};

export function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setError(null);
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Selecione um arquivo antes de enviar.");
      return;
    }
    setStatus("uploading");

    try {
      const session = await getSession();
      const token = session?.user?.accessToken;
      if (!token) {
        setError("Token de acesso não encontrado.");
        signOut();
        return;
      }

      const form = new FormData();
      form.append("file", file);

      const res = await fetch("http://localhost:3001/ocr/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || res.statusText);
      }

      setStatus("success");
      setFile(null);
      onUploadSuccess && onUploadSuccess();
    } catch (err: any) {
      setError(err.message || "Erro ao enviar arquivo.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-[#393E46] rounded">
      <label className="block mb-2 text-[#DFD0B8]">Selecione imagem (JPG/PNG ≤5 MB)</label>
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileChange}
        className="block mb-4 w-full text-sm text-[#948979]"
      />
      <button
        type="submit"
        disabled={status === "uploading"}
        className="px-4 py-2 bg-[#948979] text-[#222831] rounded hover:bg-[#b8aa96] transition disabled:opacity-50"
      >
        {status === "uploading" ? "Enviando..." : "Enviar"}
      </button>
      {status === "success" && (<p className="mt-3 text-green-400">Upload realizado com sucesso!</p>)}
      {status === "error" && error && (<p className="mt-3 text-red-400">Erro: {error}</p>)}
    </form>
  );
}