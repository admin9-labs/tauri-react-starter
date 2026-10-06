import { AppShell } from "@/components/layout/AppShell";
import { ComponentsPage } from "@/pages/ComponentsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { useHashRoute } from "./useHashRoute";

export function App() {
  const { hash, route } = useHashRoute();
  return (
    <AppShell activeHash={hash}>
      {route === "components" ? <ComponentsPage /> : <DashboardPage />}
    </AppShell>
  );
}
