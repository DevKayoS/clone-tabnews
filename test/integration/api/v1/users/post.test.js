import { StatusCodes } from "http-status-codes";
import orchestrator from "test/orchestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllService();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "johndoe",
          email: "johndoe@gmail.com",
          password: "senha123",
        }),
      });

      const responseBody = await response.json();

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "johndoe",
        email: "johndoe@gmail.com",
        password: "senha123",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toEqual(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With duplicated `email`", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "johndoeduplicado",
          email: "johndoeduplicado@gmail.com",
          password: "senha123",
        }),
      });

      const responseBody = await response.json();

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "johndoeduplicado",
        email: "johndoeduplicado@gmail.com",
        password: "senha123",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toEqual(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Johndoeduplicado2",
          email: "Johndoeduplicado@gmail.com",
          password: "senha123",
        }),
      });

      const responseBody2 = await response2.json();
      expect(response2.status).toBe(StatusCodes.BAD_REQUEST);

      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "O email informado ja esta sendo utilizado",
        action: "Utilize outro email para realizar o cadastro",
        status_code: StatusCodes.BAD_REQUEST,
      });
    });

    test("With duplicated `username`", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "johndoeduplicadoUsername",
          email: "johndoeduplicadoUsername@gmail.com",
          password: "senha123",
        }),
      });

      const responseBody = await response.json();

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "johndoeduplicadoUsername",
        email: "johndoeduplicadoUsername@gmail.com",
        password: "senha123",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toEqual(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "johndoeduplicadoUsername",
          email: "johndoeduplicadoUsernameDuplicado@gmail.com",
          password: "senha123",
        }),
      });

      const responseBody2 = await response2.json();
      expect(response2.status).toBe(StatusCodes.BAD_REQUEST);

      expect(responseBody2).toEqual({
        name: "ValidationError",
        message: "O username informado ja esta sendo utilizado",
        action: "Utilize outro username para realizar o cadastro",
        status_code: StatusCodes.BAD_REQUEST,
      });
    });
  });
});
