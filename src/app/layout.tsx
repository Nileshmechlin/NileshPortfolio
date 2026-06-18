import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nilesh Vijay | Full Stack Dev, GoHighLevel & AI Automation Engineer",
  description: "Professional portfolio of Nilesh Vijay. Specialist in React/Node.js custom SaaS, GoHighLevel agency snap systems, and automated AI agents using n8n and Zapier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="grid-mesh"></div>
        <div className="ambient-glow glow-1"></div>
        <div className="ambient-glow glow-2"></div>
        <div className="ambient-glow glow-3"></div>
        {children}
      </body>
    </html>
  );
}
