import { StatusCodes } from "http-status-codes";

class BaseError extends Error {
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status_code: this.statusCode,
      action: this.action,
    };
  }
}

export class InternalServerError extends BaseError {
  constructor({ cause, statusCode, message, name, action }) {
    super(message || "Um erro interno nao esperado aconteceu", {
      cause,
    });

    this.name = name || "InternalServerError";
    this.action = action || "Entre em contato com o suporte!";

    this.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

export class MethodNotAllowedError extends BaseError {
  constructor() {
    super("Metodo nao permitido para esse endpoint.");

    this.name = "MethodNotAllowedError";
    this.action =
      "Verifique se o metodo HTTP enviado e valido para esse endpoint.";
    this.statusCode = StatusCodes.METHOD_NOT_ALLOWED;
  }
}

export class ServiceError extends BaseError {
  constructor({ cause, message }) {
    super(message || "Servico indisponivel no momento.", {
      cause,
    });

    this.name = "ServiceError";
    this.action = "Verifique se o servico esta disponivel";
    this.statusCode = StatusCodes.SERVICE_UNAVAILABLE;
  }
}

export class ValidationError extends BaseError {
  constructor({ cause, message, action }) {
    super(message || "Servico indisponivel no momento.", {
      cause,
    });

    this.name = "ValidationError";
    this.action = action || "Ajuste os dados enviados e tente novamente";
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
