import useSWR from "swr";
import fetchAPI from "utils/fetchData";

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  })

  console.log(data)
  let updatedAtText = isLoading ? "Carregando..." : new Date(data.updated_at).toLocaleString("pt-br");

  return (
    <>
      <div>Ultima Atualizacao: {updatedAtText}</div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
