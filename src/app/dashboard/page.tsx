"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Header } from "@/components/Header";
import { UploadForm } from "@/components/UploadForm";
import { DocumentList } from "@/components/DocumentList";
import { Footer } from "@/components/Footer";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.replace("/");
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Carregando...</p>;
  if (!session) return null;

  return (
    <>
      <main className="min-h-screen bg-[#222831] text-[#DFD0B8]">
        <Header />
        <section className="max-w-5xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">Seus Documentos</h2>
          <UploadForm
            onUploadSuccess={() => setRefreshKey((prev) => prev + 1)}
          />
          <DocumentList refreshKey={refreshKey} />
        </section>
      </main>
      <Footer />
    </>
  );
}
