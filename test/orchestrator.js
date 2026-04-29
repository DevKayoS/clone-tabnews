import retry from "async-retry";

async function waitForAllService() {
  await waitWebServer();
}

async function waitWebServer() {
  return await retry(
    async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        throw Error();
      }
    },
    {
      retries: 100,
      maxTimeout: 1000,
    },
  );
}

const orchestrator = {
  waitForAllService,
}

export default orchestrator 
