import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khabar - Tableau de Bord",
  description: "Générateur de rapports de veille hebdomadaire avec l'IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
