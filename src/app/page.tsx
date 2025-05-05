"use client";

import { AuthButton } from "@/components/AuthButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/dashboard");
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
