import { StatusCodes } from "http-status-codes";
import { createRouter } from "next-connect";
import { controllerHandler } from "utils/controllerHandler";
import user from "models/user.js";

const router = createRouter();
router.post(postHandler);

export default router.handler(controllerHandler.errorHandler);

async function postHandler(request, response) {
  const userInputValues = request.body;
  const newUser = await user.create(userInputValues);

  return response.status(StatusCodes.CREATED).json(newUser);
}
