import orchestrator from "test/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllService();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);
      const body = await response.json();

      const parsedUpdatedAt = new Date(body.updated_at).toISOString();
      expect(body.updated_at).toEqual(parsedUpdatedAt);

      const majorVersion = body.dependencies.database.version.split(".")[0];
      expect(majorVersion).toEqual("16");

      expect(body.dependencies.database.max_connections).toEqual(
        expect.any(Number),
      );
      expect(body.dependencies.database.opened_connections).toEqual(1);
    });
  });
});
