import { StatusCodes } from "http-status-codes";
import orchestrator from "test/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllService();
});

describe("POST /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "POST"
      });


      const responseBody = await response.json();

      expect(response.status).toBe(StatusCodes.METHOD_NOT_ALLOWED);
      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Metodo nao permitido para esse endpoint.",
        action: "Verifique se o metodo HTTP enviado e valido para esse endpoint.",
        status_code: StatusCodes.METHOD_NOT_ALLOWED
      })
    });
  });
});
