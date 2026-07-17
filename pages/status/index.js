import useSWR from "swr";
import fetchAPI from "utils/fetchData";

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <Database />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  })

  let updatedAtText = isLoading ? "Carregando..." : new Date(data.updated_at).toLocaleString("pt-br");

  return (
    <>
      <div>Ultima Atualizacao: {updatedAtText}</div>
    </>
  );
}


function Database() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  })

  console.log(data)
  let databaseStatusInfo = "Carregando..."

  if (!isLoading && data) {
    const databaseInfo = data.dependencies.database
    databaseStatusInfo = (
      <>
        <div>Versão: {databaseInfo.version}</div>
        <div>Conexões abertas: {databaseInfo.opened_connections}</div>
        <div>Conexões máximas: {databaseInfo.max_connections}</div>
      </>
    )
  }

  return (
    <>
      <h1>Database</h1>
      {databaseStatusInfo}
    </>
  )

}
