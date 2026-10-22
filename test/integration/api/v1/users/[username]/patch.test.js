import { StatusCodes } from "http-status-codes";
import password from "models/password";
import orchestrator from "test/orchestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllService();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With nonexists `username`", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/usuarioinexistente",
        {
          method: "PATCH",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      expect(response.status).toBe(StatusCodes.NOT_FOUND);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado nao foi encontrado no sistema.",
        action: "Verifique se o username esta digitado corretamente",
        status_code: StatusCodes.NOT_FOUND,
      });
    });

    test("With duplicated `username`", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
          email: "user1@gmail.com",
          password: "senha123",
        }),
      });

      expect(user1Response.status).toBe(StatusCodes.CREATED);

      const user2Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user2",
          email: "user2@gmail.com",
          password: "senha123",
        }),
      });

      expect(user2Response.status).toBe(StatusCodes.CREATED);

      const response = await fetch("http://localhost:3000/api/v1/users/user2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user2",
        }),
      });

      const responseBody = await response.json();

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O username informado ja esta sendo utilizado",
        action: "Utilize outro username para realizar esta operacao",
        status_code: StatusCodes.BAD_REQUEST,
      });
    });

    test("With duplicated `email`", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user3",
          email: "user3@gmail.com",
          password: "senha123",
        }),
      });

      expect(user1Response.status).toBe(StatusCodes.CREATED);

      const user2Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user4",
          email: "user4@gmail.com",
          password: "senha123",
        }),
      });

      expect(user2Response.status).toBe(StatusCodes.CREATED);

      const response = await fetch("http://localhost:3000/api/v1/users/user3", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "user4@gmail.com",
        }),
      });

      const responseBody = await response.json();

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O email informado ja esta sendo utilizado",
        action: "Utilize outro email para realizar esta operacao",
        status_code: StatusCodes.BAD_REQUEST,
      });
    });

    test("With unique `username`", async () => {
      const unique1Response = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "unique1",
            email: "unique1@gmail.com",
            password: "senha123",
          }),
        },
      );

      expect(unique1Response.status).toBe(StatusCodes.CREATED);

      const unique2Response = await fetch(
        "http://localhost:3000/api/v1/users/unique1",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "unique2",
          }),
        },
      );

      expect(unique2Response.status).toBe(StatusCodes.OK);

      const responseBody = await unique2Response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "unique2",
        email: "unique1@gmail.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toEqual(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With unique `email`", async () => {
      const unique1Response = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "uniqueemail",
            email: "uniqueemail1@gmail.com",
            password: "senha123",
          }),
        },
      );

      expect(unique1Response.status).toBe(StatusCodes.CREATED);

      const unique2Response = await fetch(
        "http://localhost:3000/api/v1/users/uniqueemail",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "uniqueemail2@gmail.com",
          }),
        },
      );

      expect(unique2Response.status).toBe(StatusCodes.OK);

      const responseBody = await unique2Response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "uniqueemail",
        email: "uniqueemail2@gmail.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toEqual(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With new `password`", async () => {
      const unique1Response = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "uniquepassword",
            email: "uniquepassword@gmail.com",
            password: "senha123",
          }),
        },
      );

      expect(unique1Response.status).toBe(StatusCodes.CREATED);

      const unique2Response = await fetch(
        "http://localhost:3000/api/v1/users/uniquepassword",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: "teste123",
          }),
        },
      );

      expect(unique2Response.status).toBe(StatusCodes.OK);

      const responseBody = await unique2Response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "uniquepassword",
        email: "uniquepassword@gmail.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toEqual(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      expect(responseBody.updated_at > responseBody.created_at).toBe(true);

      const correctPasswordMatch = await password.compare(
        "teste123",
        responseBody.password,
      );

      expect(correctPasswordMatch).toBe(true);

      const incorrectPasswordMatch = await password.compare(
        "senha123",
        responseBody.password,
      );

      expect(incorrectPasswordMatch).toBe(false);
    });
  });
});
