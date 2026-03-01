import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidePanel } from "@/components/layout/SidePanel";

import { AuthProvider } from "@/components/auth/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Trackr | OKR Management",
  description: "Professional OKR tracking for consultants and organizations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white text-text-primary h-screen overflow-hidden`}>
        <AuthProvider>
          <div className="flex flex-col h-full">
            <Header />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-auto relative bg-white">
                {children}
              </main>
              <SidePanel />
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
