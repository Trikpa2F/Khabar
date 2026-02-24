import { DashboardLayout } from "@/components/Layout";
import ReportBuilder from "@/components/ReportBuilder";

export default function NewReport() {
    return (
        <DashboardLayout title="Nouveau Rapport de Veille">
            <ReportBuilder />
        </DashboardLayout>
    );
}
