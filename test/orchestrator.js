import retry from "async-retry"

async function waitForAllService() {
    await waitWebServer();
}

async function waitWebServer() {
    return await retry(async (bail, tryNumber) => {
        console.log(tryNumber)
        const response = await fetch("http://localhost:3000/api/v1/status");
        await response.json();
    }, {
        retries: 100,
        maxTimeout: 1000
    })
}

export default {
    waitForAllService,
}
