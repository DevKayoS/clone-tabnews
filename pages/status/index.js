function CapsLock(propriedades) {
  console.log(propriedades);
  return <h1>{propriedades.texto.toUpperCase()}</h1>
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <CapsLock texto="esse texto vai ficar em caixa alta" />
    </>
  );
}
