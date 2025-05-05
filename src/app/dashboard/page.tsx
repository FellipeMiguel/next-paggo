"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Header } from "@/components/Header";
import { UploadForm } from "@/components/UploadForm";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Carregando...</p>;
  if (!session) {
    router.replace("/");
    return null;
  }

  return (
    <main className="min-h-screen bg-[#222831] text-[#DFD0B8]">
      <Header />
      <section className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Seus documentos</h2>
        <UploadForm />

        {/* Aqui virá a listagem dos documentos */}
      </section>
    </main>
  );
}
