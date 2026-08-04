import { createRouter } from "next-connect"
import { StatusCodes } from "http-status-codes";
import database from "infra/database.js";
import { InternalServerError, MethodNotAllowedError } from "infra/errors";

const router = createRouter()

router.get(getHandler)

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler
})

function onErrorHandler(error, request, response) {
  const publicObjectError = new InternalServerError({
    cause: error,
  });

  return response.status(publicObjectError.statusCode).json(publicObjectError);
}

function onNoMatchHandler(request, response) {
  const onNoMatchError = new MethodNotAllowedError()
  return response.status(onNoMatchError.statusCode).json(onNoMatchError)
}

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseName = process.env.POSTGRES_DB;
  const result = await database.query({
    text: `
            SELECT 
                split_part(current_setting('server_version'), ' ', 1) as version,
                current_setting('max_connections')::int as max_connections,
                count(*)::int as used_connections,
                current_setting('max_connections')::int - count(*) as free_connections
            FROM pg_stat_activity
            WHERE datname = $1
        `,
    values: [databaseName],
  });

  response.status(StatusCodes.OK).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: result.rows[0].version,
        max_connections: result.rows[0].max_connections,
        opened_connections: result.rows[0].used_connections,
        free_connections: result.rows[0].free_connections,
      },
    },
  });
}


