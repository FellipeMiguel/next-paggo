"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

type ExplainSectionProps = {
  docId: number;
};

export function ExplainSection({ docId }: ExplainSectionProps) {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleExplain() {
    setLoading(true);
    setError("");
    setExplanation("");

    try {
      const token = session?.user?.accessToken;
      if (!token) {
        throw new Error("Token de acesso não encontrado.");
      }

      const numericId = Number(docId);

      const res = await fetch("http://localhost:3001/ocr/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id: numericId, query }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "Erro na requisição");
      }

      const data: { explanation: string } = await res.json();
      setExplanation(data.explanation);
    } catch (err: any) {
      setError(err.message || "Erro ao obter explicação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 p-4 border rounded bg-[#393E46]">
      <h3 className="text-lg font-bold mb-2">Solicitar explicação</h3>
      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder="Digite sua pergunta..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={handleExplain}
        disabled={loading || !query.trim()}
        className="px-4 py-2 bg-[#948979] text-[#222831] rounded hover:bg-[#b8aa96] transition disabled:opacity-50"
      >
        {loading ? "Consultando..." : "Obter Explicação"}
      </button>
      {error && <p className="mt-2 text-red-400">{error}</p>}
      {explanation && (
        <div className="mt-2 p-2 border rounded bg-[#222831]">
          <p className="text-sm text-[#DFD0B8]">
            <strong>Explicação:</strong>
          </p>
          <p className="text-sm text-[#DFD0B8]">{explanation}</p>
        </div>
      )}
    </div>
  );
}