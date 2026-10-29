(() => {
  const menu = document.getElementById("btnMenu");
  const contenedor = menu && menu.parentElement;
  if (!contenedor || typeof URL_API_APPS_SCRIPT === "undefined") {
    console.error("No se pudo inicializar el módulo de promedio USDT: falta el menú o la URL de Apps Script.");
    return;
  }

  const estilos = document.createElement("style");
  estilos.textContent = `
    .usdt-rate {
      color: #f5f5f5;
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1.05;
      text-align: center;
      white-space: nowrap;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    body.light-mode .usdt-rate {
      color: #191919;
    }
    @media (max-width: 375px) {
      .usdt-rate {
        font-size: 0.68rem;
      }
    }
  `;
  document.head.appendChild(estilos);

  const elemento = document.createElement("span");
  elemento.id = "promedioUsdt";
  elemento.className = "usdt-rate";
  elemento.setAttribute("role", "status");
  elemento.setAttribute("aria-live", "polite");
  elemento.setAttribute("aria-label", "Promedio de compra y venta de USDT/VES en Binance P2P");
  elemento.title = "Promedio de compra y venta de USDT/VES en Binance P2P, expresado en bolívares.";
  const etiqueta = document.createElement("span");
  etiqueta.textContent = "USDT";
  const valor = document.createElement("span");
  valor.textContent = "Bs. consultando...";
  elemento.append(etiqueta, valor);
  contenedor.insertBefore(elemento, menu);

  const callbackName = `__limzaPromedioUsdt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const script = document.createElement("script");
  let completado = false;
  const timeout = window.setTimeout(
    () => finalizar(new Error("Se agotó el tiempo de consulta del promedio USDT.")),
    10000
  );

  function finalizar(error, datos) {
    if (completado) return;
    completado = true;
    window.clearTimeout(timeout);
    delete window[callbackName];
    script.remove();

    if (
      error ||
      !datos ||
      datos.exito !== true ||
      !Number.isFinite(Number(datos.tasa)) ||
      Number(datos.tasa) <= 0 ||
      !Number.isFinite(Number(datos.promedioCompra)) ||
      Number(datos.promedioCompra) <= 0 ||
      !Number.isFinite(Number(datos.promedioVenta)) ||
      Number(datos.promedioVenta) <= 0
    ) {
      if (error) console.error("No se pudo cargar el promedio USDT:", error);
      else console.error("El servidor devolvió un promedio USDT inválido.", datos);
      valor.textContent = "Bs. no disponible";
      elemento.title = datos && datos.mensaje
        ? String(datos.mensaje)
        : "No se pudo consultar el promedio USDT/VES en Binance P2P.";
      return;
    }

    const formatear = (tasa) => new Intl.NumberFormat("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(tasa));
    valor.textContent = `Bs. ${formatear(datos.tasa)}`;
    elemento.title =
      `Promedio Binance P2P USDT/VES en bolívares · Compra: Bs. ${formatear(datos.promedioCompra)} · ` +
      `Venta: Bs. ${formatear(datos.promedioVenta)}`;
  }

  window[callbackName] = (datos) => finalizar(null, datos);
  script.onerror = () => finalizar(new Error("No se pudo cargar la respuesta de Apps Script para el promedio USDT."));
  script.src = `${URL_API_APPS_SCRIPT}?action=promedioUSDT&callback=${encodeURIComponent(callbackName)}`;
  document.head.appendChild(script);
})();
