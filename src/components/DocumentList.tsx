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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Função para buscar os documentos com paginação e pesquisa via backend
  const fetchDocuments = async (page: number, search: string) => {
    setLoading(true);
    try {
      if (!session?.user?.accessToken) {
        setError("Token de acesso não encontrado.");
        setLoading(false);
        return;
      }

      // Monta os parâmetros de query
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      if (search) {
        queryParams.append("search", search);
      }

      const res = await fetch(`http://localhost:3001/ocr/list?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });

      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.message || "Erro na requisição");
      }

      const data = await res.json();
      setDocuments(data.documents);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar documentos");
    } finally {
      setLoading(false);
    }
  };

  // Chama a função toda vez que o usuário, refreshKey, currentPage ou searchTerm mudar
  useEffect(() => {
    fetchDocuments(currentPage, searchTerm);
  }, [session, refreshKey, currentPage, searchTerm]);

  // Atualiza o termo de pesquisa e reseta para a página 1
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (loading) return <p>Carregando documentos...</p>;
  if (error) return <p className="text-red-400">Erro: {error}</p>;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Histórico de Documentos</h2>

      {/* Barra de pesquisa */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Pesquisar documento..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded w-full"
        />
      </div>

      {documents.length === 0 ? (
        <p>Nenhum documento encontrado.</p>
      ) : (
        <>
          {/* Renderiza os documentos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="w-full p-6 border rounded bg-[#393E46]">
                <p>
                  <strong>Nome:</strong> {doc.name || "Sem nome"}
                </p>
                <p>
                  <strong>Data:</strong> {new Date(doc.createdAt).toLocaleString()}
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

          {/* Controles de paginação */}
          <div className="mt-4 flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 border rounded ${
                  currentPage === pageNum ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
        </>
      )}
    </div>
  );
}