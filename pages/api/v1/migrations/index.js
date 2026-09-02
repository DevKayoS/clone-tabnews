import { runner as migrationRunner } from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";
import { StatusCodes } from "http-status-codes";
import { createRouter } from "next-connect";
import { controllerHandler } from "utils/controllerHandler";

const router = createRouter();
router.get(getHandler);
router.post(postHandler);

export default router.handler(controllerHandler.errorHandler);

function defaultMigrationsBody(dbClient) {
  return {
    dbClient: dbClient,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
    dryRun: true,
  };
}

async function getHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrations = defaultMigrationsBody(dbClient);
    const pedingMigrations = await migrationRunner(defaultMigrations);
    return response.status(StatusCodes.OK).json(pedingMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrations = defaultMigrationsBody(dbClient);
    const migratedMigrations = await migrationRunner({
      ...defaultMigrations,
      dryRun: false,
    });

    return response
      .status(
        migratedMigrations.length > 0 ? StatusCodes.CREATED : StatusCodes.OK,
      )
      .json(migratedMigrations);
  } finally {
    await dbClient.end();
  }
}
