"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="geiantialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
