import { StatusCodes } from "http-status-codes";
import database from "infra/database";
import orchestrator from "test/orchestrator.js";


beforeAll(async () => {
  await orchestrator.waitForAllService();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      await database.query({
        text: "INSERT INTO users (username, email, password) values ($1, $2, $3);",
        values: ['kayosilva', 'kayo-silva@gmail.com', "senha123"]
      })

      const users = await database.query("SELECT * FROM users;")
      console.log(users.rows)

      const response = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
        },
      );

      expect(response.status).toBe(StatusCodes.CREATED);
    });
  });
});
