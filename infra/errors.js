import { StatusCodes } from "http-status-codes"

export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Um erro interno nao esperado aconteceu", {
      cause,
    })

    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte!";
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status_code: this.statusCode,
      action: this.action
    }
  }

}
