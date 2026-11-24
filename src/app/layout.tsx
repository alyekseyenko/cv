import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Vadym Alyekseyenko · Applied AI & Automation Engineer",
  description:
    "Applied AI & Automation Engineer. Governed ERP read replicas, dbt semantic layers, read-only MCP tools, n8n workflows, and production web apps. Remote EU / US.",
  openGraph: {
    title: "Vadym Alyekseyenko · Applied AI & Automation Engineer",
    description:
      "Production ERP data platforms, AI workflows, CRM systems, and field apps. 5M+ governed rows, 80+ production workflows, open-source builds.",
    type: "profile",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} min-h-screen antialiased`}
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
