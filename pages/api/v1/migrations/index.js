import migrationRunner from 'node-pg-migrate'
import { join } from "node:path"
import database from 'infra/database'

export default async function migrations(request, response) {
    console.log("teste testador")
    const dbClient = await database.getNewClient()
    const defaultMigrations = {
        dbClient: dbClient,
        dir: join("infra", "migrations"),
        direction: "up",
        verbose: true,
        migrationsTable: "pgmigrations"
    }

    if (request.method === 'GET') {
        const pedingMigrations = await migrationRunner({
            ...defaultMigrations,
            dryRun: true
        })

        await dbClient.end()
        return response.status(200).json(pedingMigrations)
    }

    if (request.method === 'POST') {
        const migratedMigrations = await migrationRunner({
            ...defaultMigrations,
            dryRun: false
        })

        await dbClient.end()
        return response.status(migratedMigrations.length > 0 ? 201 : 200).json(migratedMigrations)
    }

    return response.status(405).json({
        status: false,
        code: 405,
        msg: 'Method not Allowed'
    })
}


