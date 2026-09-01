import { onErrorHandler } from "./onErrorHandler";
import { onNoMatchHandler } from "./onNoMatchHandler";

export const controllerHandler = {
  errorHandler: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler

  }
}
