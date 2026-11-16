(() => {
  const menu = document.getElementById("btnAbrirMenu");
  const contenedor = menu && menu.parentElement;
  if (!contenedor || typeof URL_API_APPS_SCRIPT === "undefined") {
    console.error("No se pudo inicializar la tasa USDT: falta el menú o la URL de Apps Script.");
    return;
  }

  const CACHE_TASA_USDT_KEY = "limza-tasa-usdt-v1";
  const MAX_INTENTOS = 3;
  const REINTENTOS_MS = [1500, 5000];

  const estilos = document.createElement("style");
  estilos.textContent = `
    .usdt-rate {
      min-width: 92px;
      padding: 6px 10px;
      border: 1px solid rgba(249, 115, 22, 0.34);
      border-radius: 12px;
      background: linear-gradient(145deg, #292929, #1b1b1b);
      color: #f8fafc;
      font-size: 0.74rem;
      font-weight: 600;
      line-height: 1.15;
      text-align: left;
      white-space: nowrap;
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      box-shadow: 0 5px 14px rgba(0, 0, 0, 0.24), inset 0 1px rgba(255, 255, 255, 0.05);
      box-sizing: border-box;
    }
    .usdt-rate > span:first-child {
      color: #fb923c;
      font-size: 0.58rem;
      font-weight: 700;
      letter-spacing: 0.11em;
    }
    .usdt-rate > span:last-child {
      font-size: 0.75rem;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .navbar .navbar-actions {
      gap: 8px;
    }
    body.light-mode .usdt-rate {
      border-color: rgba(234, 88, 12, 0.3);
      background: linear-gradient(145deg, #ffffff, #fff7ed);
      color: #172033;
    }
    body.light-mode .usdt-rate > span:first-child {
      color: #c2410c;
    }
    @media (max-width: 375px) {
      .usdt-rate {
        min-width: 80px;
        padding: 5px 7px;
      }
      .usdt-rate > span:first-child {
        font-size: 0.52rem;
      }
      .usdt-rate > span:last-child {
        font-size: 0.68rem;
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
  etiqueta.textContent = "USDT / VES";
  const valor = document.createElement("span");
  valor.textContent = "Bs. consultando...";
  elemento.append(etiqueta, valor);
  contenedor.insertBefore(elemento, menu);

  let tasaGuardada = leerTasaGuardada();
  let intentos = 0;
  let consultando = false;
  let temporizadorReintento = null;
  if (tasaGuardada) mostrarTasa(tasaGuardada.tasa, tasaGuardada.guardadoEn, true);

  function formatearTasa(tasa) {
    return new Intl.NumberFormat("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(tasa);
  }

  function mostrarTasa(tasa, fecha, guardada) {
    const tasaFormateada = formatearTasa(tasa);
    valor.textContent = `Bs. ${tasaFormateada}`;
    const fechaFormateada = new Intl.DateTimeFormat("es-VE", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date(fecha));
    elemento.title = guardada
      ? `Última tasa USDT/VES guardada: Bs. ${tasaFormateada} (${fechaFormateada}). Se está verificando si hay una tasa más reciente.`
      : `Tasa manual USDT/VES: Bs. ${tasaFormateada} (actualizada ${fechaFormateada}).`;
  }

  function leerTasaGuardada() {
    try {
      const datos = JSON.parse(localStorage.getItem(CACHE_TASA_USDT_KEY) || "null");
      if (!datos || !Number.isFinite(datos.tasa) || datos.tasa <= 0 ||
          !Number.isFinite(datos.guardadoEn) ||
          !Number.isFinite(new Date(datos.guardadoEn).getTime())) {
        return null;
      }
      return datos;
    } catch (error) {
      console.warn("No se pudo leer la tasa USDT guardada:", error);
      return null;
    }
  }

  function guardarTasa(tasa, guardadoEn) {
    tasaGuardada = { tasa, guardadoEn };
    try {
      localStorage.setItem(CACHE_TASA_USDT_KEY, JSON.stringify(tasaGuardada));
    } catch (error) {
      console.warn("No se pudo guardar la tasa USDT localmente:", error);
    }
  }

  function manejarFallo(error) {
    if (tasaGuardada) {
      mostrarTasa(tasaGuardada.tasa, tasaGuardada.guardadoEn, true);
    } else {
      valor.textContent = "Bs. no disponible";
      elemento.title = "No se pudo leer la tasa USDT/VES. Se volverá a intentar automáticamente.";
    }

    if (intentos < MAX_INTENTOS) {
      console.warn("No se pudo actualizar la tasa USDT; se volverá a intentar:", error);
      temporizadorReintento = window.setTimeout(consultarTasa, REINTENTOS_MS[intentos - 1]);
    } else {
      console.error("No se pudo actualizar la tasa USDT después de varios intentos:", error);
    }
  }

  function consultarTasa() {
    if (consultando) return;
    consultando = true;
    intentos += 1;
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
      consultando = false;
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
        manejarFallo(error || new Error(
          datos && datos.mensaje ? String(datos.mensaje) : "Apps Script devolvió una tasa USDT inválida."
        ));
        return;
      }

      const tasa = Number(datos.tasa);
      const guardadoEn = Date.now();
      guardarTasa(tasa, guardadoEn);
      mostrarTasa(tasa, guardadoEn, false);
      intentos = 0;
      window.clearTimeout(temporizadorReintento);
      temporizadorReintento = null;
    }

    window[callbackName] = (datos) => finalizar(null, datos);
    script.onerror = () => finalizar(new Error("No se pudo leer la tasa manual desde Apps Script."));
    script.src = `${URL_API_APPS_SCRIPT}?action=tasaUSDT&callback=${encodeURIComponent(callbackName)}&_=${Date.now()}`;
    document.head.appendChild(script);
  }

  window.addEventListener("online", () => {
    if (consultando) return;
    window.clearTimeout(temporizadorReintento);
    temporizadorReintento = null;
    intentos = 0;
    consultarTasa();
  });

  consultarTasa();
})();
