import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Document Intelligence Platform",
  description: "Upload contracts, insurance documents, or legal agreements to analyze, search, query, and annotate structures interactively.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased text-slate-100 bg-[#0b0f19]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
