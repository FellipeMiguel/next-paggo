"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";

type UploadFormProps = {
  onUploadSuccess?: () => void;
};

export function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

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
      toast.error("Selecione um arquivo antes de enviar.");
      return;
    }
    if (!documentName.trim()) {
      setError("Defina um nome para o documento.");
      toast.error("Defina um nome para o documento.");
      return;
    }
    setStatus("uploading");
    setProgress(0);

    try {
      const session = await getSession();
      const token = session?.user?.accessToken;
      if (!token) {
        setError("Token de acesso não encontrado.");
        toast.error("Token de acesso não encontrado.");
        signOut();
        return;
      }

      const form = new FormData();
      form.append("name", documentName);
      form.append("file", file);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL não definido");
      }

      // Realiza o upload sem atribuir a variável desnecessária
      await axios.post(`${apiUrl}/ocr/upload`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentage);
        },
      });

      setStatus("success");
      toast.success("Upload realizado com sucesso!");
      setFile(null);
      setPreviewUrl(null);
      setDocumentName("");
      onUploadSuccess?.();
    } catch (err: unknown) {
      let errorMessage = "Erro ao enviar arquivo.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        errorMessage = errorObj.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
      setStatus("error");
      toast.error(errorMessage);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-4 bg-[#393E46] rounded text-center"
    >
      <label className="block mb-2 text-[#DFD0B8] font-semibold">
        Selecione a Imagem do Documento para o Pagguino analisar (JPG/PNG ≤ 5MB)
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
            <p className="text-sm text-[#DFD0B8] font-semibold">
              Pré-visualização:
            </p>
            <Image
              src={previewUrl}
              alt="Pré-visualização da imagem"
              width={192}
              height={192}
              className="mt-2 w-48 h-48 object-cover border rounded shadow mx-auto"
            />
          </div>

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

      {status === "uploading" && (
        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {status === "success" && (
        <p className="mt-3 text-green-400">
          Upload do arquivo realizado com sucesso!
        </p>
      )}
      {status === "error" && error && (
        <p className="mt-3 text-red-400">Erro: {error}</p>
      )}
    </form>
  );
}
