export const routes = {
  dashboard: "#/dashboard",
  records: "#/records",
  components: "#/components",
  record: (id: string) => `#/records/${id}`,
} as const;

export type AppRoute = "dashboard" | "records" | "record-detail" | "components";

export function getRecordIdFromHash(hash: string): string | null {
  const match = /^#\/records\/([^/]+)$/.exec(hash);
  return match?.[1] ?? null;
}

export function getRouteFromHash(hash: string): AppRoute {
  if (getRecordIdFromHash(hash)) {
    return "record-detail";
  }

  if (hash === routes.records) {
    return "records";
  }

  if (hash === routes.components) {
    return "components";
  }

  return "dashboard";
}
