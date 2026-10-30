(() => {
  const menu = document.getElementById("btnMenu");
  const contenedor = menu && menu.parentElement;
  if (!contenedor || typeof URL_API_APPS_SCRIPT === "undefined") {
    console.error("No se pudo inicializar la tasa USDT: falta el menú o la URL de Apps Script.");
    return;
  }

  const estilos = document.createElement("style");
  estilos.textContent = `
    .usdt-rate {
      min-width: 76px;
      padding: 6px 11px;
      border: 1px solid #3a3a3a;
      border-radius: 14px;
      background: #242424;
      color: #f5f5f5;
      font-size: 0.78rem;
      font-weight: 600;
      line-height: 1.1;
      text-align: center;
      white-space: nowrap;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
      box-sizing: border-box;
    }
    .usdt-rate > span:first-child {
      color: #f97316;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.08em;
    }
    .usdt-rate > span:last-child {
      font-variant-numeric: tabular-nums;
    }
    body.light-mode .usdt-rate {
      border-color: #e2e8f0;
      background: #ffffff;
      color: #0f172a;
    }
    body.light-mode .usdt-rate > span:first-child {
      color: #f97316;
    }
    @media (max-width: 375px) {
      .usdt-rate {
        min-width: 68px;
        padding: 4px 7px;
        font-size: 0.7rem;
      }
    }
  `;
  document.head.appendChild(estilos);

  const elemento = document.createElement("span");
  elemento.id = "tasaUsdt";
  elemento.className = "usdt-rate";
  elemento.setAttribute("role", "status");
  elemento.setAttribute("aria-live", "polite");
  elemento.setAttribute("aria-label", "Tasa manual de USDT/VES");
  elemento.title = "Tasa USDT/VES ingresada en la celda G1 de la hoja Multimarcas.";
  const etiqueta = document.createElement("span");
  etiqueta.textContent = "USDT";
  const valor = document.createElement("span");
  valor.textContent = "Bs. consultando...";
  elemento.append(etiqueta, valor);
  contenedor.insertBefore(elemento, menu);

  const callbackName = `__limzaTasaUsdt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const script = document.createElement("script");
  let completado = false;
  const timeout = window.setTimeout(
    () => finalizar(new Error("Se agotó el tiempo de lectura de la tasa USDT.")),
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
      Number(datos.tasa) <= 0
    ) {
      if (error) console.error("No se pudo cargar la tasa manual USDT:", error);
      else console.error("Apps Script devolvió una tasa USDT inválida.", datos);
      valor.textContent = "Bs. no disponible";
      elemento.title = datos && datos.mensaje
        ? String(datos.mensaje)
        : "No se pudo leer la tasa USDT/VES de la hoja Multimarcas.";
      return;
    }

    const tasaFormateada = new Intl.NumberFormat("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(datos.tasa));
    valor.textContent = `Bs. ${tasaFormateada}`;
    elemento.title = `Tasa manual USDT/VES: Bs. ${tasaFormateada}`;
  }

  window[callbackName] = (datos) => finalizar(null, datos);
  script.onerror = () => finalizar(new Error("No se pudo leer la tasa manual desde Apps Script."));
  script.src = `${URL_API_APPS_SCRIPT}?action=tasaUSDT&callback=${encodeURIComponent(callbackName)}`;
  document.head.appendChild(script);
})();
