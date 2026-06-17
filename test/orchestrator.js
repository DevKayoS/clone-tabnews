import retry from "async-retry";
import database from "infra/database";

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

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public");
}

const orchestrator = {
  waitForAllService,
  clearDatabase,
};

export default orchestrator;
