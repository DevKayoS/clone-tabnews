import migrationRunner from 'node-pg-migrate'
import { join } from "node:path"

export default async function migrations(request, response) {

    let migrations
    if (request.method === 'GET') {
        migrations = await migrationRunner({
            databaseUrl: process.env.DATABASE_URL,
            dryRun: true,
            dir: join("infra", "migrations"),
            direction: "up",
            verbose: true,
            migrationsTable: "pgmigrations"
        })
        return response.status(200).json(migrations)
    }

    if (request.method === 'POST') {
        migrations = await migrationRunner({
            databaseUrl: process.env.DATABASE_URL,
            dryRun: false,
            dir: join("infra", "migrations"),
            direction: "up",
            verbose: true,
            migrationsTable: "pgmigrations"
        })

        console.log("migrations executadas")

        return response.status(200).json(migrations)

    }

    return response.status(405).json({
        status: false,
        code: 405,
        msg: 'Method not Allowed'
    })
}


