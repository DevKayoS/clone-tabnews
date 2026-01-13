import database from "infra/database.js"
import { version } from "react"

export default async function status(request, response) {
    const updatedAt = new Date().toISOString()

    const databaseName = process.env.POSTGRES_DB
    const result = await database.query({
        text: `
            SELECT 
                current_setting('server_version') as version,
                current_setting('max_connections')::int as max_connections,
                count(*)::int as used_connections,
                current_setting('max_connections')::int - count(*) as free_connections
            FROM pg_stat_activity
            WHERE datname = $1
        `,
        values: [databaseName]
    });

    response.status(200).json({
        updated_at: updatedAt,
        dependencies: {
            database: {
                version: result.rows[0].version,
                max_connections: result.rows[0].max_connections,
                opened_connections: result.rows[0].used_connections,
                free_connections: result.rows[0].free_connections,
            }
        }
    })
}


