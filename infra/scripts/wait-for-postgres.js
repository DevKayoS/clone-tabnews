const { exec } = require("node:child_process")

function checkPostgres() {
    exec("docker exec postgres-dev pg_isready --host localhost", (error, stdout, stderr) => {
        if (!stdout.includes("accepting connections")) {
            process.stdout.write(".")
            checkPostgres()
            return
        }

        console.log("\nPostgres pronto para conexoes\n")

    })

}

process.stdout.write("Aguardando Postgres aceitar conexoes!")

checkPostgres()
