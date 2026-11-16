(function (global) {
  function esProductoValido(producto) {
    return producto &&
      typeof producto.nombre === "string" &&
      Number.isFinite(Number(producto.precio));
  }

  function normalizarCodigo(codigo) {
    return String(codigo || "").trim().toLocaleUpperCase();
  }

  global.LimzaCatalogUtils = Object.freeze({
    esProductoValido,
    normalizarCodigo
  });
})(window);
