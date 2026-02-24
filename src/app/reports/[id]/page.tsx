"use client";

import { DashboardLayout } from "@/components/Layout";
import { ArrowLeft, Printer, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import ReportViewer from "@/components/ReportViewer";

export default function ArchivedReport({ params }: { params: { id: string } }) {
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const { data, error } = await supabase
                    .from('reports')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (error) throw error;
                if (data) setReport(data);
            } catch (err) {
                console.error("Erreur de récupération:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [params.id]);

    if (loading) {
        return (
            <DashboardLayout title="Chargement du rapport...">
                <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
                    <Loader2 size={48} className="animate-spin" style={{ margin: "0 auto 1rem", color: "var(--primary)" }} />
                    <p>Récupération de l'archive...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!report) {
        return (
            <DashboardLayout title="Rapport introuvable">
                <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                    <h2 style={{ marginBottom: "1rem", color: "var(--text)" }}>Archive introuvable</h2>
                    <p style={{ marginBottom: "2rem" }}>Ce rapport n'existe pas ou a été supprimé.</p>
                    <Link href="/reports" className="btn btn-primary">
                        <ArrowLeft size={18} /> Retour aux archives
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title={`Archive du ${new Date(report.created_at).toLocaleDateString()}`}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }} className="no-print">
                    <Link href="/reports" className="btn btn-outline">
                        <ArrowLeft size={18} /> Retour
                    </Link>
                    <button className="btn btn-primary" onClick={() => window.print()}>
                        <Printer size={18} /> Exporter PDF
                    </button>
                </div>

                <ReportViewer
                    reportType={report.report_type}
                    dateRange={{ start: report.date_start, end: report.date_end }}
                    mediaArticles={report.media_articles || []}
                    islamArticles={report.islam_articles || []}
                    socialAnalysis={report.social_analysis || ""}
                />
            </div>
        </DashboardLayout>
    );
}
