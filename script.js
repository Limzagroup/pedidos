// ID de tu Google Sheet
const ID_HOJA = "1hk5ioEV2_DNMSmJddyRmlcdjC2aJ0Eudg1dKfeDOp20";

// Correo donde recibirás las órdenes
const CORREO_NOTIFICACION = "limzagroup0@gmail.com";
const HOJA_PRODUCTOS = "Productos";
const HOJA_MULTIMARCAS = "MULTIMARCAS";
const HOJA_CEBRA = "cebra";
const HOJA_PEDIDOS = "Pedidos";
const HOJA_VENDEDORES = "VENDEDORES";
const VALORES_NO_DISPONIBLES = new Set(["no", "no publicar", "agotado", "falso", "false", "0"]);
const LOGO_PDF_BASE64 = "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";

function normalizarTexto(valor, valorPorDefecto) {
  if (valor === null || valor === undefined) {
    return valorPorDefecto;
  }

  const texto = String(valor).trim();
  return texto || valorPorDefecto;
}

function convertirNumero(valor, valorPorDefecto) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : valorPorDefecto;
}

function escaparHtml(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizarEncabezadoProductos(valor) {
  return String(valor || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function buscarCorreoVendedor(ss, nombreVendedor) {
  const hoja = ss.getSheetByName(HOJA_VENDEDORES);
  if (!hoja) {
    Logger.log(`No se encontró la pestaña «${HOJA_VENDEDORES}»; no se enviará copia al vendedor.`);
    return "";
  }

  const ultimaFila = hoja.getLastRow();
  const ultimaColumna = hoja.getLastColumn();
  if (!ultimaFila || !ultimaColumna) {
    Logger.log(`La pestaña «${HOJA_VENDEDORES}» está vacía; no se enviará copia al vendedor.`);
    return "";
  }

  const filas = hoja.getRange(1, 1, ultimaFila, ultimaColumna).getDisplayValues();
  let filaEncabezados = -1;
  let columnaNombre = -1;
  let columnaCorreo = -1;
  const aliasNombre = ["vendedor", "nombre", "nombre vendedor", "nombre del vendedor", "nombre completo", "nombre y apellido", "nombres y apellidos", "asesor", "asesor comercial"];
  const aliasCorreo = ["correo", "email", "e mail", "correo electronico", "email vendedor"];

  for (let i = 0; i < Math.min(filas.length, 10); i += 1) {
    const encabezados = filas[i].map(normalizarEncabezadoProductos);
    columnaNombre = encabezados.findIndex((encabezado) => aliasNombre.includes(encabezado));
    columnaCorreo = encabezados.findIndex((encabezado) => aliasCorreo.includes(encabezado));
    if (columnaNombre >= 0 && columnaCorreo >= 0) {
      filaEncabezados = i;
      break;
    }
  }

  if (filaEncabezados < 0) {
    Logger.log(`No se encontraron columnas de nombre y correo reconocibles en «${HOJA_VENDEDORES}».`);
    return "";
  }

  const nombreBuscado = normalizarEncabezadoProductos(nombreVendedor);
  const coincidencias = filas
    .slice(filaEncabezados + 1)
    .filter((fila) => normalizarEncabezadoProductos(fila[columnaNombre]) === nombreBuscado)
    .map((fila) => String(fila[columnaCorreo] || "").trim().toLowerCase())
    .filter((correo) => correo);
  const correos = [...new Set(coincidencias)];

  if (correos.length !== 1 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correos[0])) {
    Logger.log(correos.length > 1
      ? `Hay varios correos asociados al vendedor «${nombreVendedor}» en «${HOJA_VENDEDORES}».`
      : `No se encontró un correo válido para el vendedor «${nombreVendedor}» en «${HOJA_VENDEDORES}».`);
    return "";
  }

  return correos[0];
}

function esVendedorRegistrado(ss, nombreVendedor) {
  const hoja = ss.getSheetByName(HOJA_VENDEDORES);
  if (!hoja) {
    throw new Error(`No se encontró la pestaña «${HOJA_VENDEDORES}».`);
  }

  const ultimaFila = hoja.getLastRow();
  const ultimaColumna = hoja.getLastColumn();
  if (!ultimaFila || !ultimaColumna) return false;

  const filas = hoja.getRange(1, 1, ultimaFila, ultimaColumna).getDisplayValues();
  const aliasNombre = ["vendedor", "nombre", "nombre vendedor", "nombre del vendedor", "nombre completo", "nombre y apellido", "nombres y apellidos", "asesor", "asesor comercial"];
  let filaEncabezados = -1;
  let columnaNombre = -1;

  for (let i = 0; i < Math.min(filas.length, 10); i += 1) {
    columnaNombre = filas[i]
      .map(normalizarEncabezadoProductos)
      .findIndex((encabezado) => aliasNombre.includes(encabezado));
    if (columnaNombre >= 0) {
      filaEncabezados = i;
      break;
    }
  }

  if (filaEncabezados < 0) {
    throw new Error(`No se encontró una columna de nombre de vendedor en «${HOJA_VENDEDORES}».`);
  }

  const nombreBuscado = normalizarEncabezadoProductos(nombreVendedor);
  return Boolean(nombreBuscado) && filas
    .slice(filaEncabezados + 1)
    .some((fila) => normalizarEncabezadoProductos(fila[columnaNombre]) === nombreBuscado);
}

function encontrarEncabezadosProductos(filaEncabezados) {
  const alias = {
    codigo: ["codigo", "codigo producto", "sku"],
    producto: ["producto", "nombre", "nombre producto", "articulo"],
    precio: ["precio", "precio venta", "precio de venta", "precio venta general", "precio de venta general", "precio general"],
    marca: ["marca", "categoria", "categoria producto"],
    publicacion: ["publicacion", "publicado", "disponible"]
  };
  const encabezados = filaEncabezados.map(normalizarEncabezadoProductos);
  const columnas = {};
  Object.keys(alias).forEach((campo) => {
    columnas[campo] = encabezados.findIndex((encabezado) => alias[campo].includes(encabezado));
  });

  return columnas.codigo >= 0 && columnas.producto >= 0 && columnas.precio >= 0
    ? columnas
    : null;
}

function encontrarEncabezadosCebra(filaEncabezados) {
  const encabezados = filaEncabezados.map(normalizarEncabezadoProductos);
  const columnas = {
    codigo: encabezados.findIndex((encabezado) => encabezado === "codigo"),
    producto: encabezados.findIndex((encabezado) => encabezado === "descripcion"),
    precio: encabezados.findIndex((encabezado) => encabezado === "precio usd"),
    empaque: encabezados.findIndex((encabezado) => encabezado === "empaque"),
    imagen: encabezados.findIndex((encabezado) =>
      ["imagen", "url imagen", "image", "url image"].includes(encabezado)
    ),
    subcategoria: encabezados.findIndex((encabezado) =>
      ["subcategoria", "sub categoria", "familia", "tipo producto"].includes(encabezado)
    ),
    publicacion: encabezados.findIndex((encabezado) =>
      ["publicacion", "publicado", "disponible"].includes(encabezado)
    ),
    marca: -1,
  };

  return columnas.codigo >= 0 && columnas.producto >= 0 && columnas.precio >= 0
    ? columnas
    : null;
}

function doGet(e) {
  if (e && e.parameter && e.parameter.action === "validarVendedor") {
    try {
      const ss = SpreadsheetApp.openById(ID_HOJA);
      const nombre = String(e.parameter.nombre || "").trim();
      const registrado = esVendedorRegistrado(ss, nombre);
      return ContentService.createTextOutput(JSON.stringify({
        exito: true,
        registrado,
        mensaje: registrado ? "" : "El vendedor no está registrado en la pestaña VENDEDORES."
      })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      Logger.log("Error al validar vendedor: " + err.toString());
      return ContentService.createTextOutput(JSON.stringify({
        exito: false,
        registrado: false,
        mensaje: "No se pudo verificar el vendedor en la hoja VENDEDORES."
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  if (e && e.parameter && e.parameter.action === "tasaUSDT") {
    let resultado;
    try {
      resultado = obtenerTasaUsdtManual();
    } catch (err) {
      const detalle = err && err.message ? String(err.message) : String(err);
      Logger.log("Error al leer la tasa USDT manual de la hoja Multimarcas: " + detalle);
      resultado = { exito: false, mensaje: detalle };
    }

    const callback = String(e.parameter.callback || "");
    if (/^[A-Za-z_$][A-Za-z0-9_$]{0,80}$/.test(callback)) {
      const datosJson = JSON.stringify(resultado).replace(/</g, "\\u003c");
      return ContentService.createTextOutput(`${callback}(${datosJson});`)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return ContentService.createTextOutput(JSON.stringify(resultado))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (e && e.parameter && e.parameter.action === "imagenesPdf") {
    try {
      return ContentService.createTextOutput(JSON.stringify(obtenerImagenesPdf(e.parameter.ids)))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      Logger.log("Error al preparar miniaturas del catálogo: " + err.toString());
      return ContentService.createTextOutput(JSON.stringify({
        exito: false,
        mensaje: "No se pudieron preparar las miniaturas del catálogo."
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  if (e && e.parameter && e.parameter.action === "catalogo") {
    try {
      return ContentService.createTextOutput(JSON.stringify(obtenerCatalogo()))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ exito: false, mensaje: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("Portal de Pedidos de LIMZA GROUP");
}

function obtenerImagenesPdf(idsParametro) {
  const ids = [...new Set(String(idsParametro || "").split(",").map((id) => id.trim()).filter(Boolean))];
  if (ids.length > 4 || ids.some((id) => !/^[A-Za-z0-9_-]{1,200}$/.test(id))) {
    throw new Error("La solicitud de miniaturas contiene IDs inválidos o excede el límite permitido.");
  }

  const cache = CacheService.getScriptCache();
  const imagenes = {};
  const faltantes = [];
  ids.forEach((id) => {
    try {
      const archivo = DriveApp.getFileById(id);
      const acceso = archivo.getSharingAccess();
      if (acceso !== DriveApp.Access.ANYONE && acceso !== DriveApp.Access.ANYONE_WITH_LINK) {
        faltantes.push(id);
        return;
      }

      const cacheKey = `catalogo-thumbnail:${id}:${archivo.getLastUpdated().getTime()}`;
      const imagenEnCache = cache.get(cacheKey);
      if (imagenEnCache) {
        imagenes[id] = imagenEnCache;
        return;
      }

      const miniatura = archivo.getThumbnail();
      if (!miniatura) {
        faltantes.push(id);
        return;
      }

      const tipoContenido = miniatura.getContentType();
      if (!/^image\/(?:jpeg|png|webp|gif)$/i.test(tipoContenido)) {
        faltantes.push(id);
        return;
      }

      const imagenDataUrl = `data:${tipoContenido};base64,${Utilities.base64Encode(miniatura.getBytes())}`;
      imagenes[id] = imagenDataUrl;
      if (imagenDataUrl.length <= 90000) {
        cache.put(cacheKey, imagenDataUrl, 21600);
      }
    } catch (err) {
      Logger.log(`No se pudo preparar la miniatura ${id}; se usará el servicio actual: ${err.toString()}`);
      faltantes.push(id);
    }
  });

  return { exito: true, imagenes, faltantes };
}

function obtenerTasaUsdtManual() {
  const ss = SpreadsheetApp.openById(ID_HOJA);
  const hoja = ss.getSheetByName(HOJA_MULTIMARCAS);
  if (!hoja) {
    throw new Error(`No se encontró la pestaña "${HOJA_MULTIMARCAS}" en el archivo de Google Sheets.`);
  }

  const valorCelda = hoja.getRange("G1").getValue();
  const textoTasa = String(valorCelda).trim();
  const tasa = typeof valorCelda === "number"
    ? valorCelda
    : Number(textoTasa.includes(",")
      ? textoTasa.replace(/\./g, "").replace(",", ".")
      : textoTasa);

  if (!Number.isFinite(tasa) || tasa <= 0) {
    throw new Error(`La celda ${HOJA_MULTIMARCAS}!G1 debe contener una tasa USDT numérica mayor que cero.`);
  }

  return { exito: true, tasa };
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ exito: false, mensaje: "No se recibieron datos del pedido." }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const datos = JSON.parse(e.postData.contents);
    const resultado = guardarPedido(datos);

    return ContentService.createTextOutput(JSON.stringify(resultado))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ exito: false, mensaje: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function obtenerCatalogo() {
  try {
    const ss = SpreadsheetApp.openById(ID_HOJA);
    let hojaProductos = ss.getSheetByName(HOJA_PRODUCTOS);
    const hojaCebra = ss.getSheetByName(HOJA_CEBRA);

    if (!hojaProductos) {
      hojaProductos = ss.getSheets().find((posibleHoja) => {
        if (posibleHoja.getName() === HOJA_CEBRA) return false;
        const ultimaColumna = posibleHoja.getLastColumn();
        const filasARevisar = Math.min(posibleHoja.getLastRow(), 10);
        if (!ultimaColumna || !filasARevisar) return false;
        const filas = posibleHoja.getRange(1, 1, filasARevisar, ultimaColumna).getValues();
        return filas.some((fila) => encontrarEncabezadosProductos(fila));
      });
    }

    if (!hojaProductos) {
      throw new Error(`No se encontró la hoja de productos ni una pestaña con los encabezados Código, Producto y Precio de venta. La pestaña actual no debe llamarse necesariamente «${HOJA_PRODUCTOS}».`);
    }

    if (!hojaCebra) {
      throw new Error(`No se encontró la pestaña adicional «${HOJA_CEBRA}» en el archivo de Google Sheets.`);
    }

    return leerProductosDeHoja(hojaProductos, "General")
      .concat(leerProductosDeHoja(hojaCebra, "CEBRA", encontrarEncabezadosCebra));
  } catch (err) {
    Logger.log("Error al leer productos: " + err.toString());
    throw new Error("No se pudo leer la hoja de productos: " + err.message);
  }
}

function leerProductosDeHoja(hoja, categoriaPorDefecto, encontrarEncabezados = encontrarEncabezadosProductos) {
  const ultimaFila = hoja.getLastRow();
  const ultimaColumna = hoja.getLastColumn();
  if (ultimaFila === 0 || ultimaColumna === 0) return [];

  const filas = hoja.getRange(1, 1, ultimaFila, ultimaColumna).getValues();
  let indiceEncabezados = -1;
  let columnas = null;
  const filasARevisar = Math.min(filas.length, 10);

  for (let i = 0; i < filasARevisar; i += 1) {
    columnas = encontrarEncabezados(filas[i]);
    if (columnas) {
      indiceEncabezados = i;
      break;
    }
  }

  if (!columnas || indiceEncabezados < 0) {
    const encabezadosRequeridos = encontrarEncabezados === encontrarEncabezadosCebra
      ? "Código, Descripción y Precio USD"
      : "Código, Producto y Precio de venta";
    throw new Error(`No se encontraron los encabezados ${encabezadosRequeridos} en la pestaña «${hoja.getName()}» dentro de las primeras 10 filas.`);
  }

  const catalogo = [];
  for (let i = indiceEncabezados + 1; i < filas.length; i += 1) {
    const fila = filas[i];
    const nombre = normalizarTexto(fila[columnas.producto], "");
    if (!nombre) continue;

    const disponibilidadValor = columnas.publicacion >= 0
      ? fila[columnas.publicacion]
      : "";
    const disponibilidad = String(disponibilidadValor ?? "").trim();
    const valorDisponibilidad = disponibilidad.toLowerCase();

    catalogo.push({
      id: `${hoja.getSheetId()}-${i + 1}`,
      codigo: String(normalizarTexto(fila[columnas.codigo], `ART-${i + 1}`)),
      nombre: String(nombre),
      precio: convertirNumero(fila[columnas.precio], 0),
      empaque: columnas.empaque >= 0
        ? normalizarTexto(fila[columnas.empaque], "")
        : "",
      imagen: columnas.imagen >= 0
        ? normalizarTexto(fila[columnas.imagen], "")
        : "",
      subcategoria: columnas.subcategoria >= 0
        ? normalizarTexto(fila[columnas.subcategoria], "")
        : "",
      categoria: columnas.marca >= 0
        ? normalizarTexto(fila[columnas.marca], categoriaPorDefecto)
        : categoriaPorDefecto,
      disponible: !(valorDisponibilidad && VALORES_NO_DISPONIBLES.has(valorDisponibilidad))
    });
  }

  return catalogo;
}

function obtenerFilaEncabezadosPedidos(hojaPedidos) {
  const ultimaFila = hojaPedidos.getLastRow();
  if (ultimaFila === 0) {
    hojaPedidos.appendRow([
      "Nº Orden",
      "Fecha y Hora",
      "Vendedor",
      "Nombre del Cliente",
      "RIF del Cliente",
      "Detalle de Productos",
      "Total ($)",
      "Estado"
    ]);
    hojaPedidos.setFrozenRows(1);
    return 1;
  }

  const filasARevisar = Math.min(ultimaFila, 10);
  const primerasCeldas = hojaPedidos.getRange(1, 1, filasARevisar, 1).getDisplayValues();
  for (let i = 0; i < primerasCeldas.length; i += 1) {
    const encabezado = String(primerasCeldas[i][0] || "")
      .toLowerCase()
      .replace(/[º°]/g, "o")
      .trim();
    if (encabezado === "no orden" || encabezado === "numero de orden") {
      return i + 1;
    }
  }

  throw new Error("No se encontró el encabezado «Nº Orden» en las primeras 10 filas de la hoja Pedidos.");
}

function generarNumeroOrden(hojaPedidos, filaEncabezados) {
  const ultimaFila = hojaPedidos.getLastRow();
  let mayorNumero = 300;

  if (ultimaFila > filaEncabezados) {
    const ordenes = hojaPedidos
      .getRange(filaEncabezados + 1, 1, ultimaFila - filaEncabezados, 1)
      .getDisplayValues();

    ordenes.forEach((fila) => {
      const coincidencia = String(fila[0] || "").match(/^ORD-(\d+)$/i);
      if (coincidencia) {
        mayorNumero = Math.max(mayorNumero, Number(coincidencia[1]));
      }
    });
  }

  return "ORD-" + String(mayorNumero + 1).padStart(4, "0");
}

function prepararColumnaEstadoPedido(hojaPedidos, filaEncabezados) {
  const celdaEstado = hojaPedidos.getRange(filaEncabezados, 8);
  const encabezadoEstado = String(celdaEstado.getValue() || "").trim();
  if (encabezadoEstado && encabezadoEstado !== "Estado") {
    throw new Error(`La columna H de la fila ${filaEncabezados} ya contiene "${encabezadoEstado}". Libera esa columna para agregar el estado del pedido.`);
  }

  if (!encabezadoEstado) {
    celdaEstado.setValue("Estado");
  }
}

function guardarPedido(datos) {
  let bloqueo = null;
  try {
    if (!datos || typeof datos !== "object") {
      return { exito: false, mensaje: "La estructura del pedido es inválida." };
    }

    const items = Array.isArray(datos.itemsDetalle) ? datos.itemsDetalle.filter(Boolean) : [];
    if (!items.length) {
      return { exito: false, mensaje: "No se recibieron productos para procesar el pedido." };
    }

    const zona = datos.zona === null || datos.zona === undefined ? "" : datos.zona;
    if (
      typeof zona !== "string" ||
      zona.length > 40 ||
      (zona.trim() !== "" && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]{2,40}$/.test(zona.trim()))
    ) {
      return { exito: false, mensaje: "La zona debe tener hasta 40 caracteres y contener solo letras, números y espacios." };
    }

    const textoPermitido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]*$/;
    const clientePedido = datos.cliente;
    const vendedorPedido = datos.vendedor;
    const comentario = datos.comentario === null || datos.comentario === undefined ? "" : datos.comentario;
    if (
      typeof clientePedido !== "string" ||
      clientePedido.length > 60 ||
      clientePedido.trim().length < 6 ||
      !textoPermitido.test(clientePedido.trim()) ||
      typeof vendedorPedido !== "string" ||
      vendedorPedido.length > 40 ||
      vendedorPedido.trim().length < 6 ||
      !textoPermitido.test(vendedorPedido.trim()) ||
      typeof comentario !== "string" ||
      comentario.length > 100 ||
      !textoPermitido.test(comentario.trim())
    ) {
      return { exito: false, mensaje: "Cliente, vendedor y comentarios solo pueden contener letras, números y espacios, respetando sus límites." };
    }

    const ss = SpreadsheetApp.openById(ID_HOJA);
    if (!esVendedorRegistrado(ss, vendedorPedido)) {
      return { exito: false, mensaje: "El vendedor no está registrado en la pestaña VENDEDORES. Verifica el nombre antes de enviar el pedido." };
    }

    const rifPedido = datos.rif === null || datos.rif === undefined ? "" : datos.rif;
    if (
      typeof rifPedido !== "string" ||
      rifPedido.length > 11 ||
      (rifPedido.trim() !== "" && rifPedido.trim() !== "N/A" && !/^[VEJGPC]-\d{6,9}$/i.test(rifPedido.trim()))
    ) {
      return { exito: false, mensaje: "El RIF debe tener uno de los prefijos V-, E-, J-, G-, P- o C- seguido de 6 a 9 dígitos." };
    }

    bloqueo = LockService.getScriptLock();
    bloqueo.waitLock(30000);

    const hoja = ss.getSheetByName(HOJA_PEDIDOS) || ss.insertSheet(HOJA_PEDIDOS);
    const filaEncabezados = obtenerFilaEncabezadosPedidos(hoja);
    prepararColumnaEstadoPedido(hoja, filaEncabezados);

    const fechaRegistro = new Date();
    const correlativo = generarNumeroOrden(hoja, filaEncabezados);
    const vendedor = normalizarTexto(datos.vendedor, "Sin vendedor");
    const cliente = normalizarTexto(datos.cliente, "Cliente no especificado");
    const rif = normalizarTexto(datos.rif, "Sin RIF");
    const resumenTexto = normalizarTexto(datos.resumenTexto, "Pedido sin detalle");
    const totalDolares = convertirNumero(datos.totalDolares, 0);

    const filaNuevoPedido = filaEncabezados + 1;
    hoja.insertRowsBefore(filaNuevoPedido, 1);
    hoja.getRange(filaNuevoPedido, 1, 1, 8).setValues([[
      correlativo,
      fechaRegistro,
      vendedor,
      cliente,
      rif,
      resumenTexto,
      totalDolares,
      "Pendiente"
    ]]);
    bloqueo.releaseLock();
    bloqueo = null;

    let estadoComprobantePrincipal = "fallo";
    try {
      enviarComprobantePDF(datos, correlativo, fechaRegistro);
      estadoComprobantePrincipal = "enviado";
    } catch (err) {
      Logger.log("Error al enviar comprobante PDF: " + err.toString());
    }

    let estadoCopiaVendedor = "no_encontrado";
    try {
      const correoVendedor = buscarCorreoVendedor(ss, vendedor);
      if (correoVendedor) {
        enviarComprobantePDF(datos, correlativo, fechaRegistro, {
          destinatario: correoVendedor,
          incluirCamposOperativos: false,
          sufijoArchivo: "Vendedor"
        });
        estadoCopiaVendedor = "enviado";
      }
    } catch (err) {
      estadoCopiaVendedor = "fallo";
      Logger.log("Error al enviar la copia del pedido al vendedor: " + err.toString());
    }

    return {
      exito: true,
      mensaje: "Pedido procesado.",
      estadoComprobantePrincipal,
      estadoCopiaVendedor
    };
  } catch (err) {
    Logger.log("Error al guardar pedido: " + err.toString());
    return { exito: false, mensaje: err.toString() };
  } finally {
    if (bloqueo && bloqueo.hasLock()) {
      bloqueo.releaseLock();
    }
  }
}

function enviarComprobantePDF(datos, correlativo, fecha, opciones = {}) {
  const items = Array.isArray(datos.itemsDetalle) ? datos.itemsDetalle.filter((item) => item && item.nombre) : [];
  if (!items.length) {
    return;
  }

  const filasTabla = [];

  items.forEach((item) => {
    const codigo = escaparHtml(normalizarTexto(item.codigo, "N/A"));
    const categoria = escaparHtml(normalizarTexto(item.categoria, "General"));
    const nombre = escaparHtml(normalizarTexto(item.nombre, "Producto sin nombre"));
    const empaque = escaparHtml(normalizarTexto(item.empaque, ""));
    const cantidad = Math.max(convertirNumero(item.cantidad, 0), 0);
    const precio = Math.max(convertirNumero(item.precio, 0), 0);
    const subtotal = (precio * cantidad).toFixed(2);

    filasTabla.push(`
      <tr style="page-break-inside: avoid; break-inside: avoid;">
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: bold; color: #475569;">
          ${codigo}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #1e293b;">
          ${categoria} - ${nombre}${empaque ? ` (${empaque})` : ""}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-align: center; font-weight: bold; color: #0f172a;">
          ${cantidad}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-align: center; color: #0f172a;">&nbsp;</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-align: center; color: #0f172a; white-space: nowrap;">
          $${precio.toFixed(2)}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-align: center; font-weight: bold; color: #0f172a;">
          $${subtotal}
        </td>
      </tr>
    `);
  });

  const cliente = escaparHtml(normalizarTexto(datos.cliente, "Cliente no especificado"));
  const zona = escaparHtml(normalizarTexto(datos.zona, ""));
  const vendedor = escaparHtml(normalizarTexto(datos.vendedor, "Sin vendedor"));
  const rif = escaparHtml(normalizarTexto(datos.rif, "Sin RIF"));
  const comentario = String(datos.comentario ?? "").trim().slice(0, 100);
  const bloqueComentario = comentario
    ? `
        <div style="width: 100%; box-sizing: border-box; background-color: #fff8e8; border-left: 4px solid #f28c00; border-radius: 4px; padding: 10px 12px; margin: 18px 0 0; font-size: 12px; line-height: 1.5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          <strong>Comentario:</strong> ${escaparHtml(comentario)}
        </div>
      `
    : "";
  const totalDolares = convertirNumero(datos.totalDolares, 0).toFixed(2);
  const bloqueDatosDespacho = opciones.incluirCamposOperativos === false
    ? ""
    : `
        <div style="width: 100%; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; margin-bottom: 14px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 11px; color: #0f172a;">
            <tr>
              <td style="width: 33.33%; padding: 6px; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;"><strong>Picking:</strong> <span style="display: inline-block; width: 13px; height: 13px; border: 1px solid #0f172a; vertical-align: middle;">&nbsp;</span></td>
              <td style="width: 33.33%; padding: 6px; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;"><strong>№ Bulto:</strong></td>
              <td style="width: 33.33%; padding: 6px; border-bottom: 1px solid #e2e8f0;"><strong>№ Pedido:</strong></td>
            </tr>
            <tr>
              <td style="padding: 6px; border-right: 1px solid #e2e8f0;"><strong>№ Nota:</strong></td>
              <td style="padding: 6px; border-right: 1px solid #e2e8f0;"><strong>№ Guía caja:</strong></td>
              <td style="padding: 6px;"><strong>№ Guía transporte:</strong></td>
            </tr>
          </table>
        </div>
      `;
  const encabezadoTablaProductos = `
    <thead bgcolor="#e2e8f0" style="background: #e2e8f0; background-color: #e2e8f0; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
      <tr bgcolor="#e2e8f0" style="background: #e2e8f0; background-color: #e2e8f0; -webkit-print-color-adjust: exact; print-color-adjust: exact;">
        <td bgcolor="#e2e8f0" style="background: #e2e8f0; background-color: #e2e8f0; -webkit-print-color-adjust: exact; print-color-adjust: exact; color: #0f172a; padding: 8px 12px; text-align: left; font-size: 11px; font-weight: bold; width: 13%;">CÓDIGO</td>
        <td bgcolor="#e2e8f0" style="background: #e2e8f0; background-color: #e2e8f0; -webkit-print-color-adjust: exact; print-color-adjust: exact; color: #0f172a; padding: 8px 12px; text-align: left; font-size: 11px; font-weight: bold; width: 38%;">PRODUCTO</td>
        <td bgcolor="#e2e8f0" style="background: #e2e8f0; background-color: #e2e8f0; -webkit-print-color-adjust: exact; print-color-adjust: exact; color: #0f172a; padding: 8px 12px; text-align: center; font-size: 11px; font-weight: bold; width: 9%;">CANTIDAD</td>
        <td bgcolor="#e2e8f0" style="background: #e2e8f0; background-color: #e2e8f0; -webkit-print-color-adjust: exact; print-color-adjust: exact; color: #0f172a; padding: 8px 12px; text-align: center; font-size: 11px; font-weight: bold; width: 10%;">EXISTENCIA</td>
        <td bgcolor="#e2e8f0" style="background: #e2e8f0; background-color: #e2e8f0; -webkit-print-color-adjust: exact; print-color-adjust: exact; color: #0f172a; padding: 8px 12px; text-align: center; font-size: 11px; font-weight: bold; width: 13%;">PRECIO UND</td>
        <td bgcolor="#e2e8f0" style="background: #e2e8f0; background-color: #e2e8f0; -webkit-print-color-adjust: exact; print-color-adjust: exact; color: #0f172a; padding: 8px 12px; text-align: center; font-size: 11px; font-weight: bold; width: 17%;">SUBTOTAL</td>
      </tr>
    </thead>
  `;
  const tablaProductos = `
    <div style="width: 100%; box-sizing: border-box; margin-bottom: 25px; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden;">
      <table style="width: 100%; border-collapse: separate; border-spacing: 0; table-layout: fixed; page-break-inside: auto; break-inside: auto;">
        ${encabezadoTablaProductos}
        <tbody>
          ${filasTabla.join("")}
        </tbody>
      </table>
    </div>
  `;

  const plantillaHtml = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @page { size: letter portrait; margin: 25px; }
          thead { display: table-header-group; }
          tbody { display: table-row-group; }
          tr { page-break-inside: avoid; break-inside: avoid; }
        </style>
      </head>
      <body style="font-family: Arial, sans-serif; color: #1e293b; padding: 0; margin: 0;">
        <div style="border-bottom: 3px solid #f28c00; padding-bottom: 12px; margin-bottom: 16px;">
          <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
            <tr>
              <td style="width: 73%; vertical-align: top; padding: 0;">
                <h2 style="margin: 0; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Orden de Pedido</h2>
                <div style="font-size: 13px; color: #64748b; margin-top: 5px;">
                  <strong>Nº Orden:</strong> ${escaparHtml(correlativo)} &nbsp;|&nbsp;
                  <strong>Fecha:</strong> ${escaparHtml(fecha.toLocaleString())}
                </div>
              </td>
              <td style="width: 27%; height: 55px; vertical-align: top; padding: 0; text-align: right;">
                <img src="data:image/jpeg;base64,${LOGO_PDF_BASE64}" alt="Limza Group" style="display: block; width: 110px; height: auto; margin-left: auto;">
              </td>
            </tr>
          </table>
        </div>

        ${bloqueDatosDespacho}

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 15px; margin-bottom: 20px; font-size: 14px; line-height: 1.6;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 45%; padding: 0 0 4px; vertical-align: top; word-wrap: break-word;"><strong style="white-space: nowrap;">Cliente:</strong>&nbsp;${cliente}</td>
              <td style="width: 55%; padding: 0 0 4px; text-align: right; white-space: nowrap; vertical-align: top;">
                <strong>Zona:</strong>
                <span style="display: inline-block; width: 220px; height: 24px; line-height: 20px; box-sizing: border-box; border: 1px solid #cbd5e1; border-radius: 6px; padding: 1px 8px; text-align: left; vertical-align: top;">${zona || "&nbsp;"}</span>
              </td>
            </tr>
          </table>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 45%; padding: 0; vertical-align: top; word-wrap: break-word;"><strong style="white-space: nowrap;">RIF del cliente:</strong>&nbsp;${rif}</td>
              <td style="width: 55%; padding: 0; text-align: right; vertical-align: top;">
                <div style="width: 268px; margin-left: auto; text-align: left; word-wrap: break-word; overflow-wrap: anywhere;">
                  <strong style="white-space: nowrap;">Vendedor:</strong>&nbsp;<span style="white-space: normal; word-wrap: break-word; overflow-wrap: anywhere;">${vendedor}</span>
                </div>
              </td>
            </tr>
          </table>
        </div>

        ${tablaProductos}

        <div style="text-align: right; margin-top: 15px;">
          <div style="font-size: 13px; color: #64748b;">Monto Total de la Orden:</div>
          <div style="font-size: 26px; font-weight: bold; color: #0f172a;">$${totalDolares}</div>
        </div>

        ${bloqueComentario}

        <div style="margin-top: 45px; border-top: 1px dashed #cbd5e1; padding-top: 15px; font-size: 11px; color: #94a3b8; text-align: center;">
          Este pedido debe verificarse con las unidades disponibles antes de ser despachado.
        </div>
      </body>
    </html>
  `;

  const sufijoArchivo = opciones.sufijoArchivo ? `-${opciones.sufijoArchivo}` : "";
  const nombreArchivo = `${correlativo}${sufijoArchivo}.pdf`;
  const pdfBlob = Utilities.newBlob(plantillaHtml, "text/html", `${correlativo}${sufijoArchivo}.html`)
    .getAs("application/pdf")
    .setName(nombreArchivo);

  const asuntoCorreo = `⏰ ${correlativo} - ${normalizarTexto(datos.cliente, "Cliente no especificado")} ($${totalDolares})`;
  const destinatario = opciones.destinatario || CORREO_NOTIFICACION;
  const comentarioParaCorreo = comentario
    .replace(/[\u0000-\u001F\u007F-\u009F\u2028\u2029]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const comentarioCorreo = comentarioParaCorreo ? `\nComentario:\n${comentarioParaCorreo}\n` : "";

  GmailApp.sendEmail(
    destinatario,
    asuntoCorreo,
    `Nueva orden de pedido recibida.\n\nNº Orden: ${correlativo}\nCliente: ${normalizarTexto(datos.cliente, "Cliente no especificado")}\nZona: ${normalizarTexto(datos.zona, "Sin zona")}\nVendedor: ${normalizarTexto(datos.vendedor, "Sin vendedor")}\nRIF: ${normalizarTexto(datos.rif, "Sin RIF")}${comentarioCorreo}\nTotal: $${totalDolares}\n\nSe adjunta el archivo PDF correspondiente para su despacho.`,
    {
      attachments: [pdfBlob],
      name: "Sistema de Pedidos"
    }
  );
}