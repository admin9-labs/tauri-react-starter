import { getRouteFromHash, routes } from "@/app/routes";

describe("routes", () => {
  it("resolves dashboard and components routes", () => {
    expect(getRouteFromHash(routes.dashboard)).toBe("dashboard");
    expect(getRouteFromHash(routes.components)).toBe("components");
  });
  it("falls unknown hashes back to dashboard", () => {
    expect(getRouteFromHash("#/settings")).toBe("dashboard");
  });
});
