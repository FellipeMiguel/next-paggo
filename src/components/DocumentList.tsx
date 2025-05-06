"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ExplainSection } from "./ExplainSection";
import { motion, AnimatePresence } from "framer-motion";
import { PulseLoader } from "react-spinners";
import { jsPDF } from "jspdf";

interface Document {
  id: number;
  name: string;
  fileUrl: string;
  text: string;
  createdAt: string;
  interactions?: string;
}

type DocumentListProps = {
  refreshKey: number;
};

export function DocumentList({ refreshKey }: DocumentListProps) {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchDocuments = async (page: number, search: string) => {
    setLoading(true);
    try {
      if (!session?.user?.accessToken) {
        setError("Token de acesso não encontrado.");
        setLoading(false);
        return;
      }

      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      if (search) {
        queryParams.append("search", search);
      }

      const res = await fetch(
        `http://localhost:3001/ocr/list?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

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

  useEffect(() => {
    fetchDocuments(currentPage, searchTerm);
  }, [session, refreshKey, currentPage, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

const downloadDocument = (doc: Document) => {
  const pdf = new jsPDF();  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  let yPosition = margin;

  const addTextWithPageBreak = (textLines: string[]) => {
    textLines.forEach((line) => {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += 10;
    });
  };

  pdf.setFontSize(16);
  pdf.text(`Nome: ${doc.name || "Sem nome"}`, margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.text(`Data: ${new Date(doc.createdAt).toLocaleString()}`, margin, yPosition);
  yPosition += 10;

  pdf.text(`Arquivo: ${doc.fileUrl}`, margin, yPosition);
  yPosition += 10;

  pdf.text("Texto Extraído:", margin, yPosition);
  yPosition += 10;
  const extractedLines = pdf.splitTextToSize(doc.text, pageWidth - 2 * margin);
  addTextWithPageBreak(extractedLines);

  if (yPosition > pageHeight - margin) {
    pdf.addPage();
    yPosition = margin;
  }
  pdf.text("Interações:", margin, yPosition);
  yPosition += 10;
  const interactionsText = doc.interactions ?? "Sem interações";
  const interactionLines = pdf.splitTextToSize(interactionsText, pageWidth - 2 * margin);
  addTextWithPageBreak(interactionLines);

  pdf.save(`${doc.name || "documento"}.pdf`);
};

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Histórico de Documentos</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Pesquisar documento..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded w-full"
        />
      </div>

      {error && <p className="text-red-400">Erro: {error}</p>}

      {loading ? (
        <div className="flex items-center justify-center">
          <PulseLoader color="#948979" size={15} margin={5} />
        </div>
      ) : documents.length === 0 ? (
        <p>Nenhum documento encontrado.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  className="w-full p-6 border rounded bg-[#393E46]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
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
                  <button
                    onClick={() => downloadDocument(doc)}
                    className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 transition-colors"
                  >
                    Download PDF
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="mt-4 flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === pageNum
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}

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