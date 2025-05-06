"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ExplainSection } from "./ExplainSection";

interface Document {
  id: number;
  name: string;
  fileUrl: string;
  text: string;
  createdAt: string;
}

type DocumentListProps = {
  refreshKey: number;
};

export function DocumentList({ refreshKey }: DocumentListProps) {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        if (!session?.user?.accessToken) {
          setError("Token de acesso não encontrado.");
          return;
        }
        const res = await fetch("http://localhost:3001/ocr/list", {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        });

        if (!res.ok) {
          const errorBody = await res.json();
          throw new Error(errorBody.message || "Erro na requisição");
        }

        const data = await res.json();
        setDocuments(data);
      } catch (error: any) {
        setError(error.message || "Erro ao carregar documentos");
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [session, refreshKey]);

  if (loading) return <p>Carregando documentos...</p>;
  if (error) return <p className="text-red-400">Erro: {error}</p>;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Histórico de Documentos</h2>
      {documents.length === 0 ? (
        <p>Nenhum documento encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="w-full p-6 border rounded bg-[#393E46]">
              <p>
                <strong>Nome:</strong> {doc.name || "Sem nome"}
              </p>
              <p>
                <strong>Data:</strong>{" "}
                {new Date(doc.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Arquivo:</strong> {doc.fileUrl}
              </p>
              <p>
                <strong>Texto Extraído:</strong>
                <br /> {doc.text}
              </p>
              <ExplainSection docId={doc.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}