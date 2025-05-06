"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="geiantialiased bg-[#222831]">
        <SessionProvider>{children}</SessionProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
