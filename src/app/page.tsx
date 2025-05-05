"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthButton } from "@/components/AuthButton";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redireciona para a dashboard após a renderização caso a sessão exista.
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  // Se houver sessão, o redirecionamento está sendo gerenciado no useEffect
  if (session) {
    return null;
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#222831]">
      <div className="bg-[#393E46] text-[#DFD0B8] p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Bem-vindo ao Paggo OCR</h1>
        <p className="mb-6 text-[#948979]">Faça login para continuar</p>
        <AuthButton />
      </div>
    </main>
  );
}