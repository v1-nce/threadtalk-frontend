import type { Metadata } from "next";
import React from "react";
import { AuthProvider } from "../hooks/AuthProvider";
import Navbar from "../components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ThreadTalk",
  description: "ThreadTalk",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
