export const routes = {
  dashboard: "#/dashboard",
  components: "#/components",
} as const;

export type AppRoute = "dashboard" | "components";

export function getRouteFromHash(hash: string): AppRoute {
  return hash === routes.components ? "components" : "dashboard";
}
