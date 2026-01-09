test("GET to /api/v1/status should be return status code 200", async () => {
    const response = await fetch("http://localhost:3000/api/v1/status")
    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body.updated_at).toBeDefined()

    const parsedUpdatedAt = new Date(body.updated_at).toISOString()
    expect(body.updated_at).toEqual(parsedUpdatedAt)
    expect(body.dependencies.database.version).toEqual("16.0")
    expect(body.dependencies.database.max_connections).toEqual(expect.any(Number))
})
