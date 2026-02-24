"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, RefreshCw, Loader2, Save, Printer, PlusCircle, FileText, BarChart as BarChartIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import ReportViewer from "./ReportViewer";

type ReportType = "media" | "social" | "both";

interface Article {
    title: string;
    source: string;
    link: string;
    pubDate: string;
    synthesis: string;
    selected?: boolean; // Pour la sélection des médias
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
    // Ajouts futurs possibles
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

export default function ReportBuilder() {
    const [step, setStep] = useState(1);
    const [reportType, setReportType] = useState<ReportType>("both");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });

    // Settings from local storage
    const [apiKey, setApiKey] = useState("");
    const [keywords, setKeywords] = useState("");
    const [islamKeywords, setIslamKeywords] = useState("");
    const [newsPrompt, setNewsPrompt] = useState("");
    const [socialPrompt, setSocialPrompt] = useState("");

    // Media State
    const [mediaGenerating, setMediaGenerating] = useState(false);
    const [mediaArticles, setMediaArticles] = useState<Article[]>([]);
    const [islamArticles, setIslamArticles] = useState<Article[]>([]);

    // Social State
    const [socialGenerating, setSocialGenerating] = useState(false);

    // New Social Inputs
    const [socialInputs, setSocialInputs] = useState({
        twitter: "",
        meta: "",
        linkedin: ""
    });

    // New Social Analysis State
    const [socialAnalysis, setSocialAnalysis] = useState<SocialData>({
        twitter: { synthesis: "", mentions: 0, retweets: 0, likes: 0, replies: 0 },
        meta: { synthesis: "" },
        linkedin: { synthesis: "", posts: 0, reactions: 0, comments: 0, shares: 0 }
    });

    useEffect(() => {
        setApiKey(localStorage.getItem("gemini_api_key") || "");
        setKeywords(localStorage.getItem("sif_keywords") || "Secours Islamique France");
        setIslamKeywords(localStorage.getItem("sif_islam_keywords") || "Islam en France, musulmans");
        setNewsPrompt(localStorage.getItem("sif_news_prompt") || "Fais une courte synthèse très factuelle de cet article en 2 phrases.");
        setSocialPrompt(localStorage.getItem("sif_social_prompt") || "Analyse ces données sociales.");
    }, []);

    const generateWithGemini = async (prompt: string, expectJson: boolean = false) => {
        if (!apiKey) throw new Error("Veuillez configurer votre clé API Gemini dans les paramètres.");

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.2,
                    responseMimeType: expectJson ? "application/json" : "text/plain"
                }
            })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error?.message || "Erreur de l'API Gemini");
        }
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    };

    const processFeed = async (query: string): Promise<Article[]> => {
        const queryParams = new URLSearchParams();
        queryParams.append("q", query);
        if (dateRange.start) queryParams.append("start", dateRange.start);
        if (dateRange.end) queryParams.append("end", dateRange.end);

        const res = await fetch(`/api/news?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Erreur lors de la récupération des actualités");
        const data = await res.json();

        const articlesData: Article[] = data.articles;

        return await Promise.all(
            articlesData.map(async (art) => {
                try {
                    const prompt = `Voici un titre d'article et potentiellement son origine :\nTitre : ${art.title}\nSource : ${art.source}\nDate : ${art.pubDate}\n\nInstructions : ${newsPrompt}`;
                    const synth = await generateWithGemini(prompt, false);
                    return { ...art, synthesis: synth, selected: true };
                } catch (e) {
                    const errorMessage = e instanceof Error ? e.message : "Erreur inconnue";
                    console.error("Erreur Gemini pour l'article", art.title, e);
                    return { ...art, synthesis: `Erreur: ${errorMessage}`, selected: true };
                }
            })
        );
    };

    const handleFetchMedia = async () => {
        setMediaGenerating(true);
        try {
            const [sifResults, islamResults] = await Promise.all([
                processFeed(keywords),
                processFeed(islamKeywords)
            ]);
            setMediaArticles(sifResults);
            setIslamArticles(islamResults);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Erreur inconnue");
        } finally {
            setMediaGenerating(false);
        }
    };

    const handleAnalyzeSocial = async () => {
        setSocialGenerating(true);
        try {
            const jsonPromptTemplate = `
Analyse les données fournies pour le réseau social en question.
Tu dois renvoyer STRICTEMENT un objet JSON valide avec les clés attendues.

Si les données fournies sont manquantes ou insuffisantes, invente 0 pour les chiffres et met "Rien à signaler" pour la synthèse. Ne renvoie AUCUN autre texte que le JSON.
            `;

            const results = { ...socialAnalysis };

            if (socialInputs.twitter) {
                const twPrompt = `${jsonPromptTemplate}\nDonnées Twitter/X : ${socialInputs.twitter}\nStructure JSON attendue :\n{ "synthesis": "ta synthèse factuelle incluant thèmes et ton", "mentions": 10, "retweets": 5, "likes": 50, "replies": 2 }`;
                const twRes = await generateWithGemini(twPrompt, true);
                results.twitter = JSON.parse(twRes);
            }

            if (socialInputs.meta) {
                const metaPrompt = `${jsonPromptTemplate}\nDonnées Meta (FB/Insta) : ${socialInputs.meta}\nStructure JSON attendue :\n{ "synthesis": "ta synthèse incluant thèmes, ton et réactions" }`;
                const metaRes = await generateWithGemini(metaPrompt, true);
                results.meta = JSON.parse(metaRes);
            }

            if (socialInputs.linkedin) {
                const inPrompt = `${jsonPromptTemplate}\nDonnées LinkedIn : ${socialInputs.linkedin}\nStructure JSON attendue :\n{ "synthesis": "ta synthèse incluant publications, sujets dominants", "posts": 5, "reactions": 100, "comments": 20, "shares": 10 }`;
                const inRes = await generateWithGemini(inPrompt, true);
                results.linkedin = JSON.parse(inRes);
            }

            setSocialAnalysis(results);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Erreur inconnue lors de l'analyse (le JSON retourné par l'IA est peut être mal formaté)");
        } finally {
            setSocialGenerating(false);
        }
    };

    // Dummy chart data for UI rendering based on screenshot request
    const chartData = [
        { name: "S1", retombees: 1 },
        { name: "S2", retombees: 6 },
        { name: "S3", retombees: 1 },
        { name: "S4", retombees: 0 },
        { name: "S5", retombees: 1 },
        { name: "S6", retombees: 1 }
    ];

    const renderArticleGroup = (articles: Article[], editList: Article[], setList: (list: Article[]) => void) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {articles.map((article, idx) => (
                <div key={idx} style={{
                    padding: "1rem",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    opacity: article.selected === false ? 0.5 : 1
                }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                        <input
                            type="checkbox"
                            checked={article.selected !== false}
                            onChange={(e) => {
                                const newArticles = [...editList];
                                newArticles[idx].selected = e.target.checked;
                                setList(newArticles);
                            }}
                            style={{ marginTop: "0.4rem", width: "1.2rem", height: "1.2rem", cursor: "pointer" }}
                        />
                        <div style={{ flex: 1 }}>
                            <h4 style={{ color: "var(--primary)", marginBottom: "0.25rem" }}>{article.title}</h4>
                            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>{article.source} - {new Date(article.pubDate).toLocaleDateString()}</div>
                            <textarea
                                className="form-control"
                                value={article.synthesis}
                                onChange={(e) => {
                                    const newArticles = [...editList];
                                    newArticles[idx].synthesis = e.target.value;
                                    setList(newArticles);
                                }}
                                rows={4}
                            />
                            <a href={article.link} target="_blank" rel="noreferrer" style={{ fontSize: "0.85rem", color: "var(--primary)", display: "inline-block", marginTop: "0.5rem" }}>Lire l'article original</a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

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
        <div className="report-builder">
            {/* Stepper Progress */}
            <div style={{ display: "flex", marginBottom: "2rem", gap: "1rem" }} className="no-print">
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} style={{
                        flex: 1,
                        height: "8px",
                        backgroundColor: s <= step ? "var(--primary)" : "var(--border)",
                        borderRadius: "4px",
                        transition: "all 0.3s"
                    }} />
                ))}
            </div>

            {step === 1 && (
                <div className="card no-print">
                    <h2 style={{ marginBottom: "1.5rem" }}>1. Configuration du Rapport</h2>

                    <div className="form-group">
                        <label className="form-label">Type de Rapport</label>
                        <div style={{ display: "flex", gap: "1rem" }}>
                            {(["media", "social", "both"] as ReportType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setReportType(type)}
                                    className={`btn ${reportType === type ? "btn-primary" : "btn-outline"}`}
                                    style={{ flex: 1 }}
                                >
                                    {type === "media" && "Médias Uniquement"}
                                    {type === "social" && "Réseaux Sociaux Uniquement"}
                                    {type === "both" && "Complet (Médias + Réseaux)"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group" style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                        <div style={{ flex: 1 }}>
                            <label className="form-label">Date de début</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="form-label">Date de fin</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            />
                        </div>
                    </div>

                    {!apiKey && (
                        <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "8px" }}>
                            Attention : Votre clé API Gemini n'est pas configurée. Vous ne pourrez pas générer d'analyses.
                        </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => setStep((reportType === "social") ? 3 : 2)}
                            disabled={!dateRange.start || !dateRange.end}
                        >
                            Suivant <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (reportType === "media" || reportType === "both") && (
                <div className="card no-print">
                    <h2 style={{ marginBottom: "1.5rem" }}>2. Veille Médias (Google News)</h2>

                    {mediaArticles.length === 0 && islamArticles.length === 0 ? (
                        <div style={{ padding: "3rem", textAlign: "center", border: "1px dashed var(--border)", borderRadius: "var(--radius-md)" }}>
                            <button className="btn btn-primary" onClick={handleFetchMedia} disabled={mediaGenerating}>
                                {mediaGenerating ? <><Loader2 className="animate-spin" size={18} /> Scraping et Analyse en cours...</> : <><RefreshCw size={18} /> Lancer la recherche Google News</>}
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div style={{ marginBottom: "2rem" }}>
                                <h3 style={{ marginBottom: "1rem", color: "#004b7c", paddingBottom: "0.5rem", borderBottom: "2px solid #007fb5" }}>Retombées Association</h3>
                                {mediaArticles.length > 0 ? renderArticleGroup(mediaArticles, mediaArticles, setMediaArticles) : <p className="text-muted">Aucun article trouvé.</p>}
                            </div>
                            <div style={{ marginBottom: "2rem" }}>
                                <h3 style={{ marginBottom: "1rem", color: "#004b7c", paddingBottom: "0.5rem", borderBottom: "2px solid #007fb5" }}>Actualités Nationales (Islam en France)</h3>
                                {islamArticles.length > 0 ? renderArticleGroup(islamArticles, islamArticles, setIslamArticles) : <p className="text-muted">Aucun article trouvé.</p>}
                            </div>
                        </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
                        <button className="btn btn-outline" onClick={() => setStep(1)}><ArrowLeft size={18} /> Retour</button>
                        <button
                            className="btn btn-primary"
                            onClick={() => setStep(reportType === "media" ? 4 : 3)}
                            disabled={mediaArticles.length === 0 && islamArticles.length === 0}
                        >
                            Suivant <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (reportType === "social" || reportType === "both") && (
                <div className="card no-print">
                    <h2 style={{ marginBottom: "1.5rem" }}>3. Analyse Réseaux Sociaux</h2>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                        Collez ci-dessous les données brutes pour chaque réseau. L'IA analysera les réseaux renseignés.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                        <div className="form-group">
                            <label className="form-label" style={{ color: "var(--primary)" }}>Données Twitter / X</label>
                            <textarea
                                className="form-control"
                                rows={6}
                                placeholder="Collez les tweets, les hashtags, les stats ici..."
                                value={socialInputs.twitter}
                                onChange={(e) => setSocialInputs({ ...socialInputs, twitter: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ color: "var(--primary)" }}>Données Meta (FB/Insta)</label>
                            <textarea
                                className="form-control"
                                rows={6}
                                placeholder="Collez les posts, commentaires, stats ici..."
                                value={socialInputs.meta}
                                onChange={(e) => setSocialInputs({ ...socialInputs, meta: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ color: "var(--primary)" }}>Données LinkedIn</label>
                            <textarea
                                className="form-control"
                                rows={6}
                                placeholder="Collez les publications, engagement, sujets ici..."
                                value={socialInputs.linkedin}
                                onChange={(e) => setSocialInputs({ ...socialInputs, linkedin: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        className="btn btn-outline"
                        onClick={handleAnalyzeSocial}
                        disabled={(!socialInputs.twitter && !socialInputs.meta && !socialInputs.linkedin) || socialGenerating}
                        style={{ marginBottom: "1.5rem" }}
                    >
                        {socialGenerating ? <><Loader2 className="animate-spin" size={18} /> Analyse en cours...</> : <><RefreshCw size={18} /> Générer le rapport IA</>}
                    </button>

                    {(socialAnalysis.twitter.synthesis || socialAnalysis.meta.synthesis || socialAnalysis.linkedin.synthesis) && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {socialAnalysis.twitter.synthesis && (
                                <div className="form-group">
                                    <label className="form-label">Synthèse IA Twitter/X (Modifiable)</label>
                                    <textarea
                                        className="form-control"
                                        rows={4}
                                        value={socialAnalysis.twitter.synthesis}
                                        onChange={(e) => setSocialAnalysis({
                                            ...socialAnalysis,
                                            twitter: { ...socialAnalysis.twitter, synthesis: e.target.value }
                                        })}
                                    />
                                </div>
                            )}
                            {socialAnalysis.meta.synthesis && (
                                <div className="form-group">
                                    <label className="form-label">Synthèse IA Meta (Modifiable)</label>
                                    <textarea
                                        className="form-control"
                                        rows={4}
                                        value={socialAnalysis.meta.synthesis}
                                        onChange={(e) => setSocialAnalysis({
                                            ...socialAnalysis,
                                            meta: { ...socialAnalysis.meta, synthesis: e.target.value }
                                        })}
                                    />
                                </div>
                            )}
                            {socialAnalysis.linkedin.synthesis && (
                                <div className="form-group">
                                    <label className="form-label">Synthèse IA LinkedIn (Modifiable)</label>
                                    <textarea
                                        className="form-control"
                                        rows={4}
                                        value={socialAnalysis.linkedin.synthesis}
                                        onChange={(e) => setSocialAnalysis({
                                            ...socialAnalysis,
                                            linkedin: { ...socialAnalysis.linkedin, synthesis: e.target.value }
                                        })}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
                        <button className="btn btn-outline" onClick={() => setStep(reportType === "social" ? 1 : 2)}><ArrowLeft size={18} /> Retour</button>
                        <button className="btn btn-primary" onClick={() => setStep(4)} disabled={!socialAnalysis}>
                            Visualiser le Rapport PDF <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }} className="no-print">
                        <button className="btn btn-outline" onClick={() => setStep(3)}><ArrowLeft size={18} /> Éditer</button>
                        <button className="btn btn-outline" onClick={async () => {
                            try {
                                const { supabase } = await import('@/utils/supabase');
                                const reportData = {
                                    report_type: reportType,
                                    date_start: dateRange.start,
                                    date_end: dateRange.end,
                                    media_articles: mediaArticles,
                                    islam_articles: islamArticles,
                                    social_analysis: socialAnalysis,
                                    created_at: new Date().toISOString()
                                };
                                const { error } = await supabase.from('reports').insert([reportData]);
                                if (error) throw error;
                                alert("Rapport sauvegardé avec succès dans Supabase !");
                            } catch (error) {
                                alert("Erreur lors de la sauvegarde Supabase (vérifiez vos clés dans .env.local).");
                            }
                        }}><Save size={18} /> Sauvegarder (Supabase)</button>
                        <button className="btn btn-primary" onClick={() => window.print()}><Printer size={18} /> Exporter PDF</button>
                    </div>

                    <ReportViewer
                        reportType={reportType}
                        dateRange={dateRange}
                        mediaArticles={mediaArticles.filter(a => a.selected !== false)}
                        islamArticles={islamArticles.filter(a => a.selected !== false)}
                        socialAnalysis={socialAnalysis}
                    />

                </div>
            )}
        </div>
    );
}
