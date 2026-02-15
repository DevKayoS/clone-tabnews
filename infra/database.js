import { Client } from 'pg'

export default {
    query: async (queryObject) => {
        const client = new Client({
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            password: process.env.POSTGRES_PASSWORD,
            user: process.env.POSTGRES_USER,
            database: process.env.POSTGRES_DB,
            ssl: getSSLvalues(),
        })

        try {
            await client.connect()
            const result = await client.query(queryObject)
            return result
        } catch (error) {
            console.error(error)
            throw error
        } finally {
            await client.end()

        }
    }
};

function getSSLvalues() {
    if (process.env.POSTGRES_CA) {
        return {
            ca: process.env.POSTGRES_CA
        }
    }

    return process.env.NODE_ENV === 'production' ? true : false
}
