import { InternalServerError } from "infra/errors";

export function onErrorHandler(error, request, response) {
  const publicObjectError = new InternalServerError({
    cause: error,
  });

  return response.status(publicObjectError.statusCode).json(publicObjectError);
}

