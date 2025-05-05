"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Header } from "@/components/Header";

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
        <button className="mb-6 px-4 py-2 bg-[#948979] text-[#222831] rounded hover:bg-[#b8aa96] transition">
          Enviar novo documento
        </button>
      </section>
    </main>
  );
}
