export default async function fetchAPI(key) {
  const response = await fetch(key);
  const body = await response.json();
  return body;
}
