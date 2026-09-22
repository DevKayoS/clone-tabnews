import { InternalServerError, ValidationError } from "infra/errors";

export function onErrorHandler(error, request, response) {
  if (error instanceof ValidationError) {
    return response.status(error.statusCode).json(error);
  }

  const publicObjectError = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });

  console.error(publicObjectError);

  return response.status(publicObjectError.statusCode).json(publicObjectError);
}
