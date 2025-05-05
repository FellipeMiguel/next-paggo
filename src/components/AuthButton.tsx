"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-[#DFD0B8]">Carregando...</p>;
  }

  if (session) {
    return (
      <button
        className="bg-[#DFD0B8] text-[#222831] font-semibold px-6 py-3 rounded hover:bg-[#cfc0a6] transition cursor-pointer"
        onClick={() => signOut()}
      >
        Logout
      </button>
    );
  }

  return (
    <button
      className="bg-[#DFD0B8] text-[#222831] font-semibold px-6 py-3 rounded hover:bg-[#cfc0a6] transition cursor-pointer"
      onClick={() => signIn("google")}
    >
      Login com Google
    </button>
  );
}
