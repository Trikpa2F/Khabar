"use client";

import { FileText, BarChart as BarChartIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type ReportType = "media" | "social" | "both";

interface Article {
    title: string;
    source: string;
    link: string;
    pubDate: string;
    synthesis: string;
}

export interface TwitterData {
    synthesis: string;
    mentions: number;
    retweets: number;
    likes: number;
    replies: number;
}

export interface MetaData {
    synthesis: string;
}

export interface LinkedInData {
    synthesis: string;
    posts: number;
    reactions: number;
    comments: number;
    shares: number;
}

export interface SocialData {
    twitter: TwitterData;
    meta: MetaData;
    linkedin: LinkedInData;
}

interface ReportViewerProps {
    reportType: ReportType;
    dateRange: { start: string; end: string };
    mediaArticles: Article[];
    islamArticles: Article[];
    socialAnalysis: SocialData;
}

export default function ReportViewer({ reportType, dateRange, mediaArticles, islamArticles, socialAnalysis }: ReportViewerProps) {
    const handleCopyToCanva = () => {
        const text = `
=== ANALYSE RÉSEAUX SOCIAUX ===

[ TWITTER / X ]
Mentions: ${socialAnalysis.twitter.mentions}
Retweets: ${socialAnalysis.twitter.retweets}
Likes: ${socialAnalysis.twitter.likes}
Réponses: ${socialAnalysis.twitter.replies}

Synthèse :
${socialAnalysis.twitter.synthesis}

[ META (FACEBOOK / INSTAGRAM) ]
Synthèse :
${socialAnalysis.meta.synthesis}

[ LINKEDIN ]
Posts: ${socialAnalysis.linkedin.posts}
Réactions: ${socialAnalysis.linkedin.reactions}
Commentaires: ${socialAnalysis.linkedin.comments}
Partages: ${socialAnalysis.linkedin.shares}

Synthèse :
${socialAnalysis.linkedin.synthesis}
        `.trim();
        navigator.clipboard.writeText(text);
        alert("Texte copié ! Vous pouvez le coller dans Canva.");
    };
    // Dummy chart data for UI
    const chartData = [
        { name: "S1", retombees: 1 },
        { name: "S2", retombees: 6 },
        { name: "S3", retombees: 1 },
        { name: "S4", retombees: 0 },
        { name: "S5", retombees: 1 },
        { name: "S6", retombees: 1 }
    ];

    const renderPrintArticles = (articles: Article[]) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {articles.map((article, i) => (
                <div key={i} style={{ fontSize: "1.1rem" }}>
                    <div style={{ color: "#004b7c", fontWeight: "700", marginBottom: "0.5rem" }}>
                        {new Date(article.pubDate).toLocaleDateString()} {article.title}
                    </div>
                    <div style={{ color: "#007fb5", fontWeight: "600", marginBottom: "0.2rem" }}>
                        Source : <a href={article.link} style={{ textDecoration: "underline" }}>{article.source}</a>
                    </div>
                    <div style={{ lineHeight: "1.6", color: "#333" }}>
                        {article.synthesis}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* PAGE 1: Couverture */}
            <div className="report-page card" style={{ minHeight: "1122px", padding: "4rem", backgroundColor: "#007fb5", color: "white", position: "relative", overflow: "hidden", margin: "0 auto", width: "100%", maxWidth: "794px" }}>
                <h1 style={{ fontSize: "4.5rem", textTransform: "uppercase", fontWeight: "800", marginBottom: "2rem", lineHeight: "1.05", marginTop: "4rem" }}>
                    VEILLE HEBDOMADAIRE<br />DES RETOMBÉES MÉDIAS<br />ET RÉSEAUX SOCIAUX
                </h1>
                <p style={{ fontSize: "1.8rem", fontWeight: "600", textAlign: "right", marginTop: "2rem" }}>
                    Du {dateRange.start || "X"} au {dateRange.end || "Y"}
                </p>
                <div style={{ position: "absolute", bottom: "4rem", left: "4rem", display: "flex", alignItems: "center", gap: "1rem", zIndex: 10 }}>
                    <div style={{ width: "100px", height: "100px", borderRadius: "50%", border: "6px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    </div>
                    <span style={{ fontSize: "5rem", fontWeight: "700" }}>SIF</span>
                </div>
                <div style={{ position: "absolute", bottom: "-300px", right: "-300px", width: "1000px", height: "1000px", borderRadius: "50%", border: "100px solid white", opacity: "1" }}></div>
            </div>

            {/* PAGE 2: ACTUALITÉS ONG */}
            {(reportType === "media" || reportType === "both") && mediaArticles && mediaArticles.length > 0 && (
                <div className="report-page card" style={{ minHeight: "1122px", padding: "4rem", backgroundColor: "white", margin: "0 auto", width: "100%", maxWidth: "794px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "4px solid #007fb5", paddingBottom: "1rem", marginBottom: "3rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "#007fb5" }}>
                            <FileText size={48} />
                            <h2 style={{ fontSize: "3rem", textTransform: "uppercase", fontWeight: "800", margin: 0 }}>ACTUALITÉS ONG</h2>
                        </div>
                        <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "#007fb5" }}>
                            Du {dateRange.start} au {dateRange.end}
                        </div>
                    </div>
                    {renderPrintArticles(mediaArticles)}
                </div>
            )}

            {/* PAGE 3: ACTUALITÉS ISLAM EN FRANCE */}
            {(reportType === "media" || reportType === "both") && islamArticles && islamArticles.length > 0 && (
                <div className="report-page card" style={{ minHeight: "1122px", padding: "4rem", backgroundColor: "white", margin: "0 auto", width: "100%", maxWidth: "794px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "4px solid #007fb5", paddingBottom: "1rem", marginBottom: "3rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "#007fb5" }}>
                            <FileText size={48} />
                            <h2 style={{ fontSize: "2.4rem", textTransform: "uppercase", fontWeight: "800", margin: 0 }}>ACTUALITÉS NATIONALES</h2>
                        </div>
                        <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "#007fb5" }}>
                            Du {dateRange.start} au {dateRange.end}
                        </div>
                    </div>
                    {renderPrintArticles(islamArticles)}
                </div>
            )}

            {/* PAGE 4: ANALYSE QUANTITATIVE */}
            {(reportType === "social" || reportType === "both") && (
                <div className="report-page card" style={{ minHeight: "1122px", padding: "4rem", backgroundColor: "white", margin: "0 auto", width: "100%", maxWidth: "794px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "4px solid #007fb5", paddingBottom: "1rem", marginBottom: "3rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "#007fb5" }}>
                            <BarChartIcon size={48} />
                            <h2 style={{ fontSize: "2.8rem", textTransform: "uppercase", fontWeight: "800", margin: 0 }}>Analyse quantitative</h2>
                        </div>
                        <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "#007fb5" }}>
                            Du {dateRange.start} au {dateRange.end}
                        </div>
                    </div>

                    <div style={{ backgroundColor: "#007fb5", color: "white", padding: "1.5rem 2rem", fontSize: "1.2rem", marginBottom: "4rem" }}>
                        <ul>
                            <li>Nous avons eu {mediaArticles && mediaArticles.length > 0 ? mediaArticles.length : "plusieurs"} retombées presse concernant notre association.</li>
                            <li>L'actualité générale compte {islamArticles && islamArticles.length > 0 ? islamArticles.length : "plusieurs"} retombées thématiques.</li>
                        </ul>
                    </div>

                    <h3 style={{ textAlign: "center", fontSize: "1.4rem", marginBottom: "2rem" }}>Évolution des retombées médias par période</h3>

                    <div style={{ height: "400px", width: "100%" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                                <YAxis label={{ value: 'Nombre de retombées', angle: -90, position: 'insideLeft' }} />
                                <Tooltip />
                                <Bar dataKey="retombees" fill="#007fb5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* PAGE 5: RÉSEAUX SOCIAUX */}
            {(reportType === "social" || reportType === "both") && (
                <div className="report-page card" style={{ minHeight: "1122px", padding: "4rem", backgroundColor: "white", margin: "0 auto", width: "100%", maxWidth: "794px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "4px solid #007fb5", paddingBottom: "1rem", marginBottom: "2rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "#007fb5" }}>
                            <FileText size={48} />
                            <h2 style={{ fontSize: "2.5rem", textTransform: "uppercase", fontWeight: "800", margin: 0 }}>Rapport de veille réseaux sociaux</h2>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                            <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "#007fb5" }}>
                                Du {dateRange.start} au {dateRange.end}
                            </div>
                            <button className="btn btn-outline btn-sm no-print" onClick={handleCopyToCanva} style={{ fontSize: "0.8rem", padding: "0.2rem 0.5rem" }}>
                                Copier pour Canva
                            </button>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                        {socialAnalysis.twitter.synthesis && (
                            <div style={{ borderLeft: "4px solid #1DA1F2", paddingLeft: "1.5rem" }}>
                                <h3 style={{ fontSize: "1.4rem", color: "#1DA1F2", marginBottom: "0.5rem", fontWeight: "700" }}>Twitter / X</h3>
                                <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem" }}>
                                    <span style={{ fontSize: "0.9rem", color: "#555" }}><strong>{socialAnalysis.twitter.mentions}</strong> Mentions</span>
                                    <span style={{ fontSize: "0.9rem", color: "#555" }}><strong>{socialAnalysis.twitter.retweets}</strong> Retweets</span>
                                    <span style={{ fontSize: "0.9rem", color: "#555" }}><strong>{socialAnalysis.twitter.likes}</strong> Likes</span>
                                    <span style={{ fontSize: "0.9rem", color: "#555" }}><strong>{socialAnalysis.twitter.replies}</strong> Réponses</span>
                                </div>
                                <div style={{ lineHeight: "1.6", fontSize: "1.05rem", whiteSpace: "pre-wrap" }}>
                                    {socialAnalysis.twitter.synthesis}
                                </div>
                            </div>
                        )}

                        {socialAnalysis.meta.synthesis && (
                            <div style={{ borderLeft: "4px solid #1877F2", paddingLeft: "1.5rem" }}>
                                <h3 style={{ fontSize: "1.4rem", color: "#1877F2", marginBottom: "0.5rem", fontWeight: "700" }}>Meta (Facebook / Instagram)</h3>
                                <div style={{ lineHeight: "1.6", fontSize: "1.05rem", whiteSpace: "pre-wrap" }}>
                                    {socialAnalysis.meta.synthesis}
                                </div>
                            </div>
                        )}

                        {socialAnalysis.linkedin.synthesis && (
                            <div style={{ borderLeft: "4px solid #0A66C2", paddingLeft: "1.5rem" }}>
                                <h3 style={{ fontSize: "1.4rem", color: "#0A66C2", marginBottom: "0.5rem", fontWeight: "700" }}>LinkedIn</h3>
                                <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem" }}>
                                    <span style={{ fontSize: "0.9rem", color: "#555" }}><strong>{socialAnalysis.linkedin.posts}</strong> Posts</span>
                                    <span style={{ fontSize: "0.9rem", color: "#555" }}><strong>{socialAnalysis.linkedin.reactions}</strong> Réactions</span>
                                    <span style={{ fontSize: "0.9rem", color: "#555" }}><strong>{socialAnalysis.linkedin.comments}</strong> Commentaires</span>
                                    <span style={{ fontSize: "0.9rem", color: "#555" }}><strong>{socialAnalysis.linkedin.shares}</strong> Partages</span>
                                </div>
                                <div style={{ lineHeight: "1.6", fontSize: "1.05rem", whiteSpace: "pre-wrap" }}>
                                    {socialAnalysis.linkedin.synthesis}
                                </div>
                            </div>
                        )}

                        {!socialAnalysis.twitter.synthesis && !socialAnalysis.meta.synthesis && !socialAnalysis.linkedin.synthesis && (
                            <div style={{ backgroundColor: "#f3f4f6", padding: "2rem", color: "#666", textAlign: "center", borderRadius: "8px" }}>
                                Aucune analyse réseaux sociaux disponible pour cette période.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
