"use client";

import { DashboardLayout } from "@/components/Layout";
import Link from "next/link";
import { ArrowRight, FileText, Settings, PlusCircle } from "lucide-react";

export default function Home() {
  return (
    <DashboardLayout title="Vue d'ensemble">
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Bienvenue sur votre Espace de Veille</h2>
        <p style={{ color: "var(--text-muted)" }}>Générez vos rapports hebdomadaires SIF automatisés avec l'IA.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "1rem", color: "var(--primary)" }}>
            <PlusCircle size={32} />
          </div>
          <h3 style={{ marginBottom: "0.5rem" }}>Nouveau Rapport</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", flex: 1 }}>
            Générez le rapport de cette semaine en analysant les médias et Twitter.
          </p>
          <Link href="/reports/new" className="btn btn-primary" style={{ width: "fit-content" }}>
            Démarrer <ArrowRight size={18} />
          </Link>
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "1rem", color: "#8b5cf6" }}>
            <Settings size={32} />
          </div>
          <h3 style={{ marginBottom: "0.5rem" }}>Paramètres IA</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", flex: 1 }}>
            Configurez votre clé Gemini, vos mots-clés et ajustez les prompts.
          </p>
          <Link href="/settings" className="btn btn-outline" style={{ width: "fit-content" }}>
            Configurer <ArrowRight size={18} />
          </Link>
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "1rem", color: "#10b981" }}>
            <FileText size={32} />
          </div>
          <h3 style={{ marginBottom: "0.5rem" }}>Archives</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", flex: 1 }}>
            Consultez les précédents rapports générés et sauvegardés sur Supabase.
          </p>
          <Link href="/reports" className="btn btn-outline" style={{ width: "fit-content" }}>
            Voir l'historique <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "1rem" }}>Activité récente</h3>
        <div style={{
          padding: "3rem",
          textAlign: "center",
          color: "var(--text-muted)",
          backgroundColor: "var(--background)",
          borderRadius: "var(--radius-md)"
        }}>
          Aucun rapport généré pour le moment. Commencez par configurer l'IA ou créer votre premier rapport.
        </div>
      </div>
    </DashboardLayout>
  );
}
