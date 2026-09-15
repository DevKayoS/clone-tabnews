import { StatusCodes } from "http-status-codes";
import { createRouter } from "next-connect";
import { controllerHandler } from "utils/controllerHandler";
import { listPendingMigrations, runPendingMigrations } from "models/migrator";

const router = createRouter();
router.get(getHandler);
router.post(postHandler);

export default router.handler(controllerHandler.errorHandler);

async function getHandler(request, response) {
  const pedingMigrations = await listPendingMigrations();
  return response.status(StatusCodes.OK).json(pedingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await runPendingMigrations();
  const statusCode =
    migratedMigrations.length > 0 ? StatusCodes.CREATED : StatusCodes.OK;

  return response.status(statusCode).json(migratedMigrations);
}
