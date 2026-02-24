"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, FileText, Settings, Search, PlusCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { label: "Tableau de bord", href: "/", icon: LayoutDashboard },
        { label: "Créer un rapport", href: "/reports/new", icon: PlusCircle },
        { label: "Archives", href: "/reports", icon: FileText },
        { label: "Paramètres IA", href: "/settings", icon: Settings },
    ];

    return (
        <div className="sidebar">
            <div style={{ padding: "2rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "1.2rem" }}>
                    K
                </div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--primary)" }}>Khabar</h2>
            </div>
            <nav style={{ padding: "1.5rem 1rem", flex: 1 }}>
                <ul style={{ listStyle: "none" }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href} style={{ marginBottom: "0.5rem" }}>
                                <Link
                                    href={item.href}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        padding: "0.75rem 1rem",
                                        borderRadius: "var(--radius-md)",
                                        backgroundColor: isActive ? "var(--secondary)" : "transparent",
                                        color: isActive ? "var(--primary)" : "var(--text-muted)",
                                        fontWeight: isActive ? "600" : "500",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div style={{ padding: "1.5rem", borderTop: "1px solid var(--border)", fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center" }}>
                Veille Hebdomadaire &copy; 2026
            </div>
        </div>
    );
}

export function TopNav({ title }: { title: string }) {
    return (
        <div className="top-nav">
            <h1 style={{ fontSize: "1.4rem" }}>{title}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ position: "relative" }}>
                    <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="form-control"
                        style={{ paddingLeft: "36px", width: "250px", borderRadius: "var(--radius-xl)" }}
                    />
                </div>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", fontWeight: "600" }}>
                    YM
                </div>
            </div>
        </div>
    );
}

export function DashboardLayout({ children, title }: { children: ReactNode; title: string }) {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <TopNav title={title} />
                <div className="content-area">
                    {children}
                </div>
            </div>
        </div>
    );
}
