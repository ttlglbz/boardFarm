import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import ClientLayout from "./components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BoardFarm",
  description: "Distributed Render Farm",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="h-full dark" suppressHydrationWarning>
      <body className={`${inter.className} h-full antialiased bg-white dark:bg-gray-900`}>
        <ClientLayout session={session}>{children}</ClientLayout>
      </body>
    </html>
  );
} 