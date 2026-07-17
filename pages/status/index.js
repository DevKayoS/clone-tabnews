import useSWR from "swr";
import fetchAPI from "utils/fetchData";

export default function StatusPage() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  return (
    <>
      <h1>Status</h1>
      <UpdatedAt data={data} isLoading={isLoading} />
      <Database data={data} isLoading={isLoading} />
    </>
  );
}

function UpdatedAt({ isLoading, data }) {
  let updatedAtText = isLoading
    ? "Carregando..."
    : new Date(data.updated_at).toLocaleString("pt-br");

  return (
    <>
      <div>Ultima Atualizacao: {updatedAtText}</div>
    </>
  );
}

function Database({ isLoading, data }) {
  let databaseStatusInfo = "Carregando...";

  if (!isLoading && data) {
    const databaseInfo = data.dependencies.database;
    databaseStatusInfo = (
      <>
        <div>Versão: {databaseInfo.version}</div>
        <div>Conexões abertas: {databaseInfo.opened_connections}</div>
        <div>Conexões máximas: {databaseInfo.max_connections}</div>
      </>
    );
  }

  return (
    <>
      <h1>Database</h1>
      {databaseStatusInfo}
    </>
  );
}
