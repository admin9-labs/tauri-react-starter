import { AppShell } from "@/components/layout/AppShell";
import { getRecordIdFromHash } from "@/app/routes";
import { ComponentsPage } from "@/pages/ComponentsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { RecordDetailPage } from "@/pages/RecordDetailPage";
import { RecordsPage } from "@/pages/RecordsPage";

import { useHashRoute } from "./useHashRoute";

export function App() {
  const { hash, route } = useHashRoute();
  const recordId = getRecordIdFromHash(hash);

  return (
    <AppShell activeHash={hash}>
      {route === "record-detail" && recordId ? (
        <RecordDetailPage key={recordId} recordId={recordId} />
      ) : null}
      {route === "records" ? <RecordsPage /> : null}
      {route === "components" ? <ComponentsPage /> : null}
      {route === "dashboard" ? <DashboardPage /> : null}
    </AppShell>
  );
}
