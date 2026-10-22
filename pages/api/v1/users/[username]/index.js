import { StatusCodes } from "http-status-codes";
import { createRouter } from "next-connect";
import { controllerHandler } from "utils/controllerHandler";
import user from "models/user.js";

const router = createRouter();
router.get(getHandler);
router.patch(patchHandler);

export default router.handler(controllerHandler.errorHandler);

async function getHandler(request, response) {
  const result = await user.findOneByUsename(request.query.username);
  return response.status(StatusCodes.OK).json(result);
}

async function patchHandler(request, response) {
  const result = await user.update(request.query.username, request.body);
  return response.status(StatusCodes.OK).json(result);
}
