"use client";

import { useSession } from "next-auth/react";
import { AuthButton } from "./AuthButton";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-[#222831] text-[#DFD0B8] shadow">
      <h1 className="text-xl font-bold">
        {session?.user?.name
          ? `Olá, ${session.user.name.split(" ")[0]}!`
          : "Paggo OCR"}
      </h1>
      <AuthButton />
    </header>
  );
}
