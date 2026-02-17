import migrationRunner from 'node-pg-migrate'
import { join } from "node:path"
import database from 'infra/database'

export default async function migrations(request, response) {
    const allowedMethods = ["GET", "POST"]
    if (!allowedMethods.includes(request.method)) {
        return response.status(405).json({
            error: `Method "${request.method}" not Allowed`
        })
    }


    let dbClient;
    try {
        dbClient = await database.getNewClient()
        const defaultMigrations = {
            dbClient: dbClient,
            dir: join("infra", "migrations"),
            direction: "up",
            verbose: true,
            migrationsTable: "pgmigrations",
            dryRun: true
        }

        if (request.method === 'GET') {
            const pedingMigrations = await migrationRunner(defaultMigrations)

            return response.status(200).json(pedingMigrations)
        }

        if (request.method === 'POST') {
            const migratedMigrations = await migrationRunner({
                ...defaultMigrations,
                dryRun: false
            })

            return response.status(migratedMigrations.length > 0 ? 201 : 200).json(migratedMigrations)
        }

    } catch (error) {
        console.error(error)
        throw error
    } finally {
        await dbClient.end()
    }
}

