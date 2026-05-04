async function obtenerUsuarios() {
  const respuesta = await fetch('/api/users');
  const datos = await respuesta.json();
  return datos;
}
