import database from "infra/database";
import { join } from "node:path";
import { runner as migrationRunner } from "node-pg-migrate";

function defaultMigrationsBody(dbClient) {
  return {
    dbClient: dbClient,
    dir: join("infra", "migrations"),
    direction: "up",
    log: () => { },
    migrationsTable: "pgmigrations",
    dryRun: true,
  };
}

export async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const defaultMigrations = defaultMigrationsBody(dbClient);
    const pedingMigrations = await migrationRunner(defaultMigrations);

    return pedingMigrations;
  } finally {
    await dbClient?.end();
  }
}

export async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrations = defaultMigrationsBody(dbClient);
    const migratedMigrations = await migrationRunner({
      ...defaultMigrations,
      dryRun: false,
    });

    return migratedMigrations;
  } finally {
    await dbClient?.end();
  }
}
