import { BaseError, InternalServerError } from "infra/errors";

export function onErrorHandler(error, request, response) {
  if (error instanceof BaseError && !(error instanceof InternalServerError)) {
    return response.status(error.statusCode).json(error);
  }

  const publicObjectError = new InternalServerError({
    cause: error,
  });

  console.error(publicObjectError);

  return response.status(publicObjectError.statusCode).json(publicObjectError);
}
