import database from "infra/database.js"
import { version } from "react"

export default async function status(request, response) {
    const updatedAt = new Date().toISOString()


    const result = await database.query(`
        SELECT 
            current_setting('server_version') as version,
            current_setting('max_connections')::int as max_connections,
            (SELECT count(*) FROM pg_stat_activity) as used_connections,
            current_setting('max_connections')::int - (SELECT count(*) FROM pg_stat_activity) as free_connections
    `);

    response.status(200).json({
        updated_at: updatedAt,
        dependencies: {
            database: {
                version: result.rows[0].version,
                max_connections: result.rows[0].max_connections,
                used_connections: result.rows[0].used_connections,
                free_connections: result.rows[0].free_connections
            }
        }
    })
}


