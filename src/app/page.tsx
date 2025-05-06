"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthButton } from "@/components/AuthButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (session) {
    return null;
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#222831]">
      <motion.div
        className="bg-[#393E46] text-[#DFD0B8] p-10 rounded-2xl shadow-2xl text-center space-y-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide">
          Bem-vindo ao Pagguinho
        </h1>
        <p className="text-lg md:text-xl">
          Faça login para acessar a melhor experiência de OCR!
        </p>
        <AuthButton />
      </motion.div>
    </main>
  );
}