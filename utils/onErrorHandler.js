import { InternalServerError } from "infra/errors";

export function onErrorHandler(error, request, response) {
  const publicObjectError = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });

  console.error(publicObjectError);

  return response.status(publicObjectError.statusCode).json(publicObjectError);
}

