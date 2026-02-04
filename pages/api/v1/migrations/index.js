import migrationRunner from 'node-pg-migrate'

export default async function migrations(request, response) {
    const migrations = await migrationRunner({

    })
    response.status(200).json([{}])
}


