"use client";

import { DashboardLayout } from "@/components/Layout";
import { FileText, ArrowRight, Loader2, Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export default function Archives() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data, error } = await supabase
                    .from('reports')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data) setReports(data);
            } catch (err) {
                console.error("Erreur lors de la récupération des rapports:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <DashboardLayout title="Archives des Rapports">
            {loading ? (
                <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
                    <Loader2 size={48} className="animate-spin" style={{ margin: "0 auto 1rem", color: "var(--primary)" }} />
                    <p>Chargement des archives...</p>
                </div>
            ) : reports.length === 0 ? (
                <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                    <FileText size={64} style={{ margin: "0 auto 1.5rem", color: "var(--border)" }} />
                    <h2 style={{ marginBottom: "1rem", color: "var(--text)" }}>Vos rapports sauvegardés</h2>
                    <p style={{ maxWidth: "500px", margin: "0 auto 2rem" }}>
                        L'intégration Supabase est configurée mais aucun rapport n'a été trouvé.
                    </p>
                    <Link href="/reports/new" className="btn btn-primary">
                        Créer votre premier rapport <ArrowRight size={18} />
                    </Link>
                </div>
            ) : (
                <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
                    {reports.map((report) => (
                        <div key={report.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                                <div style={{ padding: "0.5rem 1rem", backgroundColor: "var(--secondary)", color: "var(--primary)", borderRadius: "var(--radius-xl)", fontSize: "0.85rem", fontWeight: "600" }}>
                                    {report.report_type === 'media' && "Médias"}
                                    {report.report_type === 'social' && "Réseaux Sociaux"}
                                    {report.report_type === 'both' && "Complet (Médias + Réseaux)"}
                                </div>
                                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                                    <Calendar size={14} /> {formatDate(report.created_at)}
                                </div>
                            </div>
                            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                                Rapport de Veille
                            </h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "1.5rem", flex: 1 }}>
                                Période : {report.date_start} au {report.date_end}
                            </p>
                            <Link href={`/reports/${report.id}`} className="btn btn-outline" style={{ display: "flex", justifyContent: "center" }}>
                                Ouvrir le rapport <ArrowRight size={18} />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
