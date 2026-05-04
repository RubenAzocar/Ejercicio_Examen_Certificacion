function agruparPorCategoria(array) {
  return array.reduce((acc, item) => {
    const categoria = item.categoria;
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(item);
    return acc;
  }, {});
}
