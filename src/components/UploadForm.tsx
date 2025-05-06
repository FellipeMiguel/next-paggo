"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { getSession, signOut } from "next-auth/react";

type UploadFormProps = {
  onUploadSuccess?: () => void;
};

export function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setError(null);
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Selecione um arquivo antes de enviar.");
      return;
    }
    if (!documentName.trim()) {
      setError("Defina um nome para o documento.");
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
      form.append("name", documentName);
      form.append("file", file);

      const res = await fetch("http://localhost:3001/ocr/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || res.statusText);
      }

      setStatus("success");
      setFile(null);
      setPreviewUrl(null);
      setDocumentName(""); // Reseta o campo nome após o upload
      onUploadSuccess && onUploadSuccess();
    } catch (err: any) {
      setError(err.message || "Erro ao enviar arquivo.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-[#393E46] rounded text-center">
      <label className="block mb-2 text-[#DFD0B8] font-semibold">
        Selecione uma imagem (JPG/PNG ≤ 5MB)
      </label>
      
      <div className="flex justify-center">
        <label className="cursor-pointer px-4 py-2 bg-[#948979] text-[#222831] rounded hover:bg-[#b8aa96] transition">
          Escolher Arquivo
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {previewUrl && (
        <>
          <div className="mt-4 text-center">
            <p className="text-sm text-[#DFD0B8] font-semibold">Pré-visualização:</p>
            <img
              src={previewUrl}
              alt="Pré-visualização da imagem"
              className="mt-2 w-48 h-48 object-cover border rounded shadow mx-auto"
            />
          </div>

          {/* Input para o nome do documento, exibido somente se houver um arquivo */}
          <div className="mt-4">
            <input
              type="text"
              className="block mx-auto w-full max-w-xs p-2 border rounded"
              placeholder="Nome do Documento"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={status === "uploading" || !documentName.trim() || !file}
        className="mt-4 px-4 py-2 bg-[#00ADB5] text-white rounded hover:bg-[#008C9E] transition disabled:opacity-50"
      >
        {status === "uploading" ? "Enviando..." : "Enviar Documento"}
      </button>

      {status === "success" && (
        <p className="mt-3 text-green-400">Upload realizado com sucesso!</p>
      )}
      {status === "error" && error && (
        <p className="mt-3 text-red-400">Erro: {error}</p>
      )}
    </form>
  );
}