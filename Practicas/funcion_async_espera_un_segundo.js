function esperar() {
  return new Promise(resolve => setTimeout(() => resolve('Listo'), 1000));
}

async function obtenerResultado() {
  return await esperar();
}
