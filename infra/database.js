import { Client } from 'pg'



function getSSLvalues() {
    if (process.env.POSTGRES_CA) {
        return {
            ca: process.env.POSTGRES_CA
        }
    }

    return process.env.NODE_ENV === 'production' ? true : false
}

async function getNewClient() {
    const client = new Client({
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        password: process.env.POSTGRES_PASSWORD,
        user: process.env.POSTGRES_USER,
        database: process.env.POSTGRES_DB,
        ssl: getSSLvalues(),
    })

    await client.connect()
    return client
}

async function query(queryObject) {
    let client;

    try {
        client = await getNewClient();

        const result = await client.query(queryObject)
        return result
    } catch (error) {
        console.error(error)
        throw error
    } finally {
        await client.end()

    }
}

export default {
    query,
    getNewClient,
}
