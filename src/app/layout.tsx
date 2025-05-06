"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
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
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}