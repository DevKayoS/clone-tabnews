test("GET to /api/v1/status should be return status code 200", async () => {
    const response = await fetch("http://localhost:3000/api/v1/status")
    expect(response.status).toBe(200)
    const body = await response.json()

    const parsedUpdatedAt = new Date(body.updated_at).toISOString()
    expect(body.updated_at).toEqual(parsedUpdatedAt)

    const majorVersion = body.dependencies.database.version.split('.')[0]
    expect(majorVersion).toEqual("16")

    expect(body.dependencies.database.max_connections).toEqual(expect.any(Number))
    expect(body.dependencies.database.opened_connections).toEqual(1)
})
