"use client";

import { DashboardLayout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { Save, Check } from "lucide-react";

export default function Settings() {
    const [apiKey, setApiKey] = useState("");
    const [keywords, setKeywords] = useState("Secours Islamique France, SIF, aide humanitaire, urgence Soudan");
    const [islamKeywords, setIslamKeywords] = useState("Islam en France, musulmans, mosquée");
    const [newsPrompt, setNewsPrompt] = useState("Fais une courte synthèse très factuelle de cet article en 2 phrases, en te concentrant sur les informations essentielles relatives à l'association ou aux thèmes humanitaires. Adopte un ton neutre et de type presse.");
    const [socialPrompt, setSocialPrompt] = useState("Analyse ces tweets/posts. Dégage les thèmes principaux dominants, le ton général (est-il polarisé, positif, négatif ?) et génère une 'Synthèse générale' sous forme de paragraphes rédigés. Identifie s'il y a des exemples marquants ou clivants.");

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Load from local storage
        const storedKey = localStorage.getItem("gemini_api_key");
        const storedKeywords = localStorage.getItem("sif_keywords");
        const storedIslamKeywords = localStorage.getItem("sif_islam_keywords");
        const storedNewsPrompt = localStorage.getItem("sif_news_prompt");
        const storedSocialPrompt = localStorage.getItem("sif_social_prompt");

        if (storedKey) setApiKey(storedKey);
        if (storedKeywords) setKeywords(storedKeywords);
        if (storedIslamKeywords) setIslamKeywords(storedIslamKeywords);
        if (storedNewsPrompt) setNewsPrompt(storedNewsPrompt);
        if (storedSocialPrompt) setSocialPrompt(storedSocialPrompt);
    }, []);

    const handleSave = () => {
        localStorage.setItem("gemini_api_key", apiKey);
        localStorage.setItem("sif_keywords", keywords);
        localStorage.setItem("sif_islam_keywords", islamKeywords);
        localStorage.setItem("sif_news_prompt", newsPrompt);
        localStorage.setItem("sif_social_prompt", socialPrompt);

        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <DashboardLayout title="Paramètres IA & Veille">
            <div style={{ maxWidth: "800px" }}>

                <div className="card" style={{ marginBottom: "2rem" }}>
                    <h3 style={{ marginBottom: "1rem", color: "var(--primary)", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
                        Configuration API
                    </h3>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1rem", fontSize: "0.9rem" }}>
                        Votre clé API est stockée uniquement sur votre navigateur (local storage).
                    </p>
                    <div className="form-group">
                        <label className="form-label">Clé API Google Gemini</label>
                        <input
                            type="password"
                            className="form-control"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                        />
                    </div>
                </div>

                <div className="card" style={{ marginBottom: "2rem" }}>
                    <h3 style={{ marginBottom: "1rem", color: "var(--primary)", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
                        Requêtes Média (Google News)
                    </h3>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1rem", fontSize: "0.9rem" }}>
                        Configurez les mots-clés utilisés pour récupérer l'actualité de la semaine. Le rapport séparera l'actualité de l'ONG et l'actualité générale sur l'Islam en France.
                    </p>
                    <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                        <label className="form-label">1. Mots-clés pour l'association (SIF, etc.)</label>
                        <textarea
                            className="form-control"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            rows={2}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">2. Mots-clés pour l'actualité générale (Islam en France, etc.)</label>
                        <textarea
                            className="form-control"
                            value={islamKeywords}
                            onChange={(e) => setIslamKeywords(e.target.value)}
                            rows={2}
                        />
                    </div>
                </div>

                <div className="card" style={{ marginBottom: "2rem" }}>
                    <h3 style={{ marginBottom: "1rem", color: "var(--primary)", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
                        Gabarits de Prompts (IA)
                    </h3>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1rem", fontSize: "0.9rem" }}>
                        Ce texte guidera l'IA dans la génération de ses synthèses pour respecter la ligne éditoriale du rapport. L'IA ciblée est Gemini 3.0 Flash.
                    </p>

                    <div className="form-group">
                        <label className="form-label">Prompt : Synthèse courte d'un article média</label>
                        <textarea
                            className="form-control"
                            value={newsPrompt}
                            onChange={(e) => setNewsPrompt(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="form-group" style={{ marginTop: "1.5rem" }}>
                        <label className="form-label">Prompt : Synthèse & Analyse des Réseaux Sociaux</label>
                        <textarea
                            className="form-control"
                            value={socialPrompt}
                            onChange={(e) => setSocialPrompt(e.target.value)}
                            rows={5}
                        />
                    </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <button className="btn btn-primary" onClick={handleSave}>
                        <Save size={18} /> Sauvegarder les paramètres
                    </button>

                    {saved && (
                        <span style={{ color: "var(--success)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "500" }}>
                            <Check size={18} /> Sauvegardé avec succès
                        </span>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
}
