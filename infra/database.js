import { Client } from 'pg'

export default {
    query: async (queryObject) => {
        const client = new Client({
            host: 'localhost',
            port: '5432',
            password: 'local_pass',
            user: 'postgres',
            database: 'postgres'
        })

        await client.connect()
        const result = await client.query(queryObject)
        await client.end()

        return result
    }
};
