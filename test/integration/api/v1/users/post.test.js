import { StatusCodes } from "http-status-codes";
import orchestrator from "test/orchestrator.js";
import { version as uuidVersion } from "uuid"

beforeAll(async () => {
  await orchestrator.waitForAllService();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: 'johndoe',
            email: 'johndoe@gmail.com',
            password: 'senha123'
          })
        },
      );

      const responseBody = await response.json();

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: 'johndoe',
        email: 'johndoe@gmail.com',
        password: 'senha123',
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at
      })

      expect(uuidVersion(responseBody.id)).toEqual(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

    });
  });
});
