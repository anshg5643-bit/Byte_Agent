import type { Metadata } from "next";
import { Literata, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toast } from "@/components/Toast";

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ByteAgent — Autonomous Tabular Intelligence Agent | Society Byte",
  description:
    "Autonomous multi-agent workspace for tabular data analysis, DuckDB sandboxing, persistent semantic domain memory, and dynamic metric synthesis. Society Byte College Task.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${literata.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-body bg-surface text-on-surface">
        <AppProvider>
          <Header />
          <main className="w-full pt-20 bg-surface flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}
