import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from "./clientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Next.js Starter",
  description: "A starter template for Next.js projects",
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProvider> 
            {children}
        </ClientProvider>
      </body>
    </html>
  );
}
