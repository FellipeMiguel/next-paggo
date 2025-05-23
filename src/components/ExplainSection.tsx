"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

type ExplainSectionProps = {
  docId: number;
};

type Message = {
  question: string;
  answer: string;
};

export function ExplainSection({ docId }: ExplainSectionProps) {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleExplain() {
    setLoading(true);
    setError("");

    try {
      const token = session?.user?.accessToken;
      if (!token) {
        throw new Error("Token de acesso não encontrado.");
      }

      const numericId = Number(docId);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL não definido");
      }

      const response = await axios.post(
        `${apiUrl}/ocr/explain`,
        { id: numericId, query },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: { explanation: string } = response.data;
      setMessages((prevMessages) => [
        ...prevMessages,
        { question: query, answer: data.explanation },
      ]);
      setQuery("");
    } catch (err: unknown) {
      let errorMessage = "Erro ao obter explicação.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        errorMessage = errorObj.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 p-4 border rounded bg-[#393E46]">
      <h3 className="text-lg font-bold mb-2">Chat de Explicação</h3>

      <div
        ref={chatContainerRef}
        className="h-60 overflow-y-auto border rounded bg-[#222831] p-3"
      >
        {messages.length === 0 ? (
          <p className="text-sm text-[#DFD0B8]">
            Envie uma pergunta à Pagguinho sobre o documento.
          </p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <p className="text-[#DFD0B8] font-bold">Você:</p>
              <p className="text-sm text-[#DFD0B8]">{msg.question}</p>
              <p className="text-[#DFD0B8] font-bold mt-1">Pagguinho:</p>
              <p className="text-sm text-[#DFD0B8]">{msg.answer}</p>
            </div>
          ))
        )}
      </div>

      <textarea
        className="w-full p-2 border rounded mt-2"
        placeholder="Digite sua pergunta..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleExplain();
          }
        }}
      />
      <button
        onClick={handleExplain}
        disabled={loading || !query.trim()}
        className="px-4 py-2 bg-[#948979] text-[#222831] rounded hover:bg-[#b8aa96] transition disabled:opacity-50 mt-2"
      >
        {loading ? "Consultando..." : "Enviar"}
      </button>
      {error && <p className="mt-2 text-red-400">{error}</p>}
    </div>
  );
}
