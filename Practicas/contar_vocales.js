function contarVocales(texto) {
  let count = 0;
  const vocales = "aeiouáéíóúüAEIOUÁÉÍÓÚÜ";

  for (let letra of texto) {
    if (vocales.includes(letra)) {
      count++;
    }
  }
  return count;
}
