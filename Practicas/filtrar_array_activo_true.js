function filtrarActivos(usuarios) {
  return usuarios.filter(usuario => usuario.activo === true);
}
