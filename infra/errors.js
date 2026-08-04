import { StatusCodes } from "http-status-codes";

class BaseError extends Error {
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status_code: this.statusCode,
      action: this.action,
    }
  }
}


export class InternalServerError extends BaseError {
  constructor({ cause }) {
    super("Um erro interno nao esperado aconteceu", {
      cause,
    });

    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte!";
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}


export class MethodNotAllowedError extends BaseError {
  constructor() {
    super("Metodo nao permitido para esse endpoint.")

    this.name = "MethodNotAllowedError"
    this.action = "Verifique se o metodo HTTP enviado e valido para esse endpoint."
    this.statusCode = StatusCodes.METHOD_NOT_ALLOWED
  }
}
