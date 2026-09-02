import { MethodNotAllowedError } from "infra/errors";

export function onNoMatchHandler(request, response) {
  const onNoMatchError = new MethodNotAllowedError();
  return response.status(onNoMatchError.statusCode).json(onNoMatchError);
}
