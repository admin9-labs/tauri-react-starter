import { getRecordIdFromHash, getRouteFromHash, routes } from "@/app/routes";

describe("routes", () => {
  it("resolves dashboard, records, and record detail routes", () => {
    expect(getRouteFromHash(routes.dashboard)).toBe("dashboard");
    expect(getRouteFromHash(routes.records)).toBe("records");
    expect(getRouteFromHash(routes.components)).toBe("components");
    expect(getRouteFromHash(routes.record("abc"))).toBe("record-detail");
    expect(getRecordIdFromHash(routes.record("abc"))).toBe("abc");
  });

  it("falls unknown hashes back to dashboard", () => {
    expect(getRouteFromHash("#/settings")).toBe("dashboard");
  });
});
