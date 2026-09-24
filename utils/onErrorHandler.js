import { InternalServerError } from "infra/errors";

export function onErrorHandler(error, request, response) {
  const publicObjectError = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
    message: error.message,
    action: error.action,
    name: error.name,
  });

  if (publicObjectError.name == "InternalServerError") {
    console.error(publicObjectError);
  }

  return response.status(publicObjectError.statusCode).json(publicObjectError);
}
