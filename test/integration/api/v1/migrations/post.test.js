import database from "infra/database"

async function cleanDatabase() {
    await database.query("drop schema public cascade; create schema public;")
}

beforeAll(cleanDatabase);


test("POST to /api/v1/migrations should be return 200", async () => {
    const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "POST"
    })

    const responseBody = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(responseBody)).toBe(true)
    expect(responseBody.length).toBeGreaterThan(0)


    const migrationsInDb = await verifyMigrations()
    expect(responseBody.length).toBe(migrationsInDb)
    expect(migrationsInDb).toBeGreaterThan(0)
})


async function verifyMigrations() {
    const verify = await database.query("SELECT * FROM pgmigrations;")
    return verify.rows.length
}
