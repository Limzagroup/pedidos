    const URL_API_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbwVvAAODNFh4408zZRaxd89p-rWIjXvBWc5_wH3_ofX0fz4NJUqpHrvFLaIWoLkkoAv/exec";
    const CACHE_CATALOGO_LOCAL_KEY = 'limza-catalogo-v3';
    const CACHE_CARRITO_LOCAL_KEY = 'limza-pedido-carrito-v1';
    const TIMEOUT_CATALOGO_MS = 10000;
    let catalogo = [];
    const catalogoPorClave = new Map();
    let catalogoCacheCargado = false;
    let catalogoRenderizado = false;
    let carrito = {};
    let itemEditando = null;
    let solicitudVendedor = 0;
    let temporizadorValidacionVendedor = null;
    let vendedorValidado = null;
    let estadoValidacionVendedor = '';
    let posicionScrollAntesDeBuscar = null;
    let modalInstance = null;
    let modalConfirmarBorradoInstance = null;
    let modalAlertaInstance = null;
    let cerrarRevisionTrasBorrado = false;
    const pulsacionesProlongadasActivas = new Map();
    const getById = (id) => document.getElementById(id);
    const caracteresNoPermitidosComentario = /[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 %\u0027\u0022\u2032\u2033]/g;
    const claveProducto = (producto) => String(producto.id || producto.codigo);
    function initApp() {
      carrito = leerCarritoGuardado();
      modalInstance = new bootstrap.Modal(getById('modalFinalizar'));
      modalConfirmarBorradoInstance = new bootstrap.Modal(getById('modalConfirmarBorrado'));
      modalAlertaInstance = new bootstrap.Modal(getById('modalAlerta'));
      getById('modalConfirmarBorrado').addEventListener('shown.bs.modal', () => {
        const fondos = document.querySelectorAll('.modal-backdrop');
        const fondoConfirmacion = fondos[fondos.length - 1];
        if (fondoConfirmacion) fondoConfirmacion.style.zIndex = '1065';
      });
      getById('modalConfirmarBorrado').addEventListener('hidden.bs.modal', () => {
        if (cerrarRevisionTrasBorrado) {
          cerrarRevisionTrasBorrado = false;
          modalInstance.hide();
        }
      });
      instalarManejadoresPulsacionProlongada();
      instalarManejadoresResumen();
      getById('buscador').addEventListener('input', manejarEntradaBuscador);
      getById('btnLimpiarBuscador').addEventListener('click', limpiarBuscadorManualmente);
      getById('btnAbrirModal').addEventListener('click', abrirModalFinalizar);
      getById('btnAbrirPedidoDesktop').addEventListener('click', abrirModalFinalizar);
      getById('btnBorrarPedido').addEventListener('click', solicitarBorradoPedido);
      getById('btnConfirmarBorrado').addEventListener('click', confirmarBorradoPedido);
      getById('vendedorNombre').addEventListener('input', () => {
        const campo = getById('vendedorNombre');
        forzarMayusculas(campo);
        limpiarCaracteresEspeciales(campo);
        programarValidacionVendedor();
      });
      getById('clienteNombre').addEventListener('input', () => {
        const campo = getById('clienteNombre');
        forzarMayusculas(campo);
        limpiarCaracteresEspeciales(campo);
        validarCampoCliente();
      });
      getById('comentarioPedido').addEventListener('input', () =>
        limpiarCaracteresEspeciales(getById('comentarioPedido'), caracteresNoPermitidosComentario)
      );
      getById('zonaPedido').addEventListener('input', () => {
        forzarMayusculas(getById('zonaPedido'));
        validarCampoZona();
      });
      getById('clienteRif').addEventListener('input', () => validarCampoRif());
      getById('formularioPedido').addEventListener('submit', enviarPedido);
      let lastScrollTop = 0;
      const searchWrapper = getById('searchWrapper');
      if (searchWrapper) {
        window.addEventListener('scroll', function() {
          const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
          if (currentScroll > lastScrollTop && currentScroll > 10) {
            searchWrapper.classList.add('hidden');
          } else {
            searchWrapper.classList.remove('hidden');
          }
          lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        }, false);
      }
      actualizarBarraTotales();
      cargarCatalogoRemoto();
    }
    function leerCarritoGuardado() {
      try {
        const guardado = JSON.parse(localStorage.getItem(CACHE_CARRITO_LOCAL_KEY) || 'null');
        if (!guardado || typeof guardado !== 'object' || Array.isArray(guardado)) return {};
        return Object.entries(guardado).reduce((carritoRestaurado, [clave, item]) => {
          const cantidad = Number(item?.cantidad);
          const precio = Number(item?.precio);
          if (
            !item ||
            typeof item !== 'object' ||
            !String(item.codigo || '').trim() ||
            !Number.isInteger(cantidad) ||
            cantidad <= 0 ||
            !Number.isFinite(precio) ||
            precio < 0
          ) {
            return carritoRestaurado;
          }
          carritoRestaurado[clave] = { ...item, cantidad, precio };
          return carritoRestaurado;
        }, {});
      } catch (err) {
        console.warn('No se pudo recuperar el pedido guardado:', err);
        return {};
      }
    }
    function guardarCarritoLocal() {
      try {
        if (Object.keys(carrito).length) {
          localStorage.setItem(CACHE_CARRITO_LOCAL_KEY, JSON.stringify(carrito));
        } else {
          localStorage.removeItem(CACHE_CARRITO_LOCAL_KEY);
        }
      } catch (err) {
        console.warn('No se pudo guardar el pedido localmente:', err);
      }
    }
    function instalarManejadoresPulsacionProlongada() {
      document.addEventListener('pointerup', finalizarPulsacionProlongada, true);
      document.addEventListener('pointercancel', cancelarPulsacionProlongada, true);
    }
    function instalarManejadoresResumen() {
      ['modalListaItems', 'desktopListaItems'].forEach(id => {
        const contenedor = getById(id);
        contenedor.addEventListener('click', event => {
          if (!(event.target instanceof Element)) return;
          const boton = event.target.closest('.btn-delete-icon');
          if (boton && contenedor.contains(boton)) {
            eliminarDelResumen(boton.dataset.codigo);
          }
        });
      });
    }
    function registrarPulsacionProlongada(boton, incrementar) {
      if (!boton) return;
      boton.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        event.preventDefault();
        boton.classList.add('is-pressed');
        cancelarTemporizadoresPulsacion(event.pointerId);
        const pulsacion = { boton, incrementar, temporizador: null, intervalo: null, iniciada: false };
        pulsacion.temporizador = setTimeout(() => {
          pulsacion.iniciada = true;
          pulsacion.incrementar();
          pulsacion.intervalo = setInterval(pulsacion.incrementar, 150);
        }, 1000);
        pulsacionesProlongadasActivas.set(event.pointerId, pulsacion);
      });
      boton.addEventListener('click', event => {
        if (event.detail === 0) {
          incrementar();
          return;
        }
        event.preventDefault();
        event.stopImmediatePropagation();
      });
    }
    function finalizarPulsacionProlongada(event) {
      const pulsacion = pulsacionesProlongadasActivas.get(event.pointerId);
      if (!pulsacion) return;
      pulsacion.boton.classList.remove('is-pressed');
      cancelarTemporizadoresPulsacion(event.pointerId);
      if (!pulsacion.iniciada) pulsacion.incrementar();
    }
    function cancelarPulsacionProlongada(event) {
      const pulsacion = pulsacionesProlongadasActivas.get(event.pointerId);
      if (pulsacion) pulsacion.boton.classList.remove('is-pressed');
      cancelarTemporizadoresPulsacion(event.pointerId);
    }
    function cancelarTemporizadoresPulsacion(pointerId) {
      const pulsacion = pulsacionesProlongadasActivas.get(pointerId);
      if (!pulsacion) return;
      clearTimeout(pulsacion.temporizador);
      clearInterval(pulsacion.intervalo);
      pulsacionesProlongadasActivas.delete(pointerId);
    }
    document.addEventListener('DOMContentLoaded', initApp);
    function cargarCatalogoRemoto() {
      const catalogoGuardado = leerCatalogoGuardado();
      if (catalogoGuardado) {
        catalogoCacheCargado = true;
        renderizarCatalogo(catalogoGuardado.productos);
      }
      const controlador = new AbortController();
      const temporizador = setTimeout(() => controlador.abort(), TIMEOUT_CATALOGO_MS);
      fetch(`${URL_API_APPS_SCRIPT}?action=catalogo&_=${Date.now()}`, { cache: 'no-store', signal: controlador.signal })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          return res.text();
        })
        .then(texto => {
          if (/<(html|!doctype)|<body|<script/i.test(texto)) {
            throw new Error('La URL del Web App devolvió una página HTML. Verifica la URL, el despliegue y que esté disponible para los usuarios que deben acceder.');
          }
          let datos;
          try {
            datos = JSON.parse(texto);
          } catch (error) {
            throw new Error('La respuesta del Web App no es JSON válido. Publica la versión actualizada de Apps Script.');
          }
          const lista = Array.isArray(datos)
            ? datos
            : (Array.isArray(datos?.catalogo) ? datos.catalogo : null);
          if (!lista) {
            throw new Error(datos?.mensaje || 'El servidor devolvió un catálogo con formato inválido.');
          }
          guardarCatalogoLocal(lista);
          if (!catalogoRenderizado || JSON.stringify(lista) !== JSON.stringify(catalogo)) {
            renderizarCatalogo(lista);
          }
        })
        .catch(err => {
          const cargando = document.getElementById('cargando');
          if (!catalogoRenderizado && catalogoGuardado) {
            catalogoCacheCargado = true;
            renderizarCatalogo(catalogoGuardado.productos);
          }
          if (catalogoCacheCargado) {
            cargando.classList.add('d-none');
            cargando.setAttribute('aria-busy', 'false');
            console.warn("No se pudo actualizar el inventario; se conserva el catálogo guardado:", err);
            return;
          }
          const mensaje = err.message || 'Error de sincronización con el servidor de inventario.';
          cargando.innerHTML = `<div class="text-danger fw-bold">${mensaje}</div>`;
          cargando.classList.remove('d-none');
          cargando.setAttribute('aria-busy', 'false');
          cargando.setAttribute('role', 'alert');
          console.error("Fallo de red:", err);
        })
        .finally(() => {
          clearTimeout(temporizador);
        });
    }
    function leerCatalogoGuardado() {
      try {
        const guardado = localStorage.getItem(CACHE_CATALOGO_LOCAL_KEY);
        if (!guardado) return null;
        const datos = JSON.parse(guardado);
        if (!Array.isArray(datos.productos) || !Number.isFinite(datos.guardadoEn)) {
          localStorage.removeItem(CACHE_CATALOGO_LOCAL_KEY);
          return null;
        }
        return datos;
      } catch (err) {
        console.warn('No se pudo leer el catálogo guardado:', err);
        return null;
      }
    }
    function guardarCatalogoLocal(productos) {
      try {
        localStorage.setItem(CACHE_CATALOGO_LOCAL_KEY, JSON.stringify({
          guardadoEn: Date.now(),
          productos
        }));
      } catch (err) {
        console.warn('No se pudo guardar el catálogo localmente:', err);
      }
    }
    function renderizarCatalogo(datos) {
      catalogo = Array.isArray(datos) ? datos : [];
      catalogoPorClave.clear();
      catalogo.forEach(producto => {
        const clave = claveProducto(producto);
        if (!catalogoPorClave.has(clave)) catalogoPorClave.set(clave, producto);
      });
      catalogoRenderizado = true;
      document.getElementById('cargando').classList.add('d-none');
      document.getElementById('cargando').setAttribute('aria-busy', 'false');
      filtrarCatalogo();
    }
    // --- SISTEMA DE ALERTA PERSONALIZADO ---
    function mostrarAlertaPersonalizada(titulo, mensaje, tipo) {
      const icono = document.getElementById('alertaIcono');
      if (tipo === 'exito') {
        icono.className = 'bi bi-check-circle-fill text-primary';
      } else if (tipo === 'error') {
        icono.className = 'bi bi-x-circle-fill text-danger';
      } else {
        icono.className = 'bi bi-exclamation-triangle-fill text-warning';
      }
      document.getElementById('alertaTitulo').innerText = titulo;
      document.getElementById('alertaMensaje').innerText = mensaje;
      modalAlertaInstance.show();
    }
    function manejarEntradaBuscador() {
      const q = document.getElementById('buscador').value;
      const btnLimpiar = document.getElementById('btnLimpiarBuscador');
      if (q.trim() && posicionScrollAntesDeBuscar === null) {
        posicionScrollAntesDeBuscar = window.scrollY;
      }
      if (q.length > 0) {
        btnLimpiar.classList.remove('d-none');
      } else {
        btnLimpiar.classList.add('d-none');
      }
      filtrarCatalogo();
      if (!q.trim() && posicionScrollAntesDeBuscar !== null) {
        restaurarPosicionAntesDeBuscar();
      }
    }
    function restaurarPosicionAntesDeBuscar() {
      const posicion = posicionScrollAntesDeBuscar;
      posicionScrollAntesDeBuscar = null;
      if (posicion === null) return;
      requestAnimationFrame(() => window.scrollTo(0, posicion));
    }
    function limpiarBuscadorManualmente() {
      document.getElementById('buscador').value = '';
      document.getElementById('btnLimpiarBuscador').classList.add('d-none');
      filtrarCatalogo();
      restaurarPosicionAntesDeBuscar();
      document.getElementById('buscador').focus();
    }
    function filtrarCatalogo() {
      const q = document.getElementById('buscador').value.toLowerCase().trim();
      const contenedor = document.getElementById('contenedorProductos');
      contenedor.innerHTML = '';
      const tarjetas = document.createDocumentFragment();
      const coincidenciasCodigoExacto = q
        ? catalogo.filter(p => String(p.codigo || '').trim().toLowerCase() === q)
        : [];
      const marcaCoincidente = q && catalogo.some(p =>
        String(p.categoria || '').trim().toLowerCase() === q
      );
      const filtrados = coincidenciasCodigoExacto.length
        ? coincidenciasCodigoExacto
        : catalogo.filter(p => {
          const marca = String(p.categoria || '').trim().toLowerCase();
          if (marcaCoincidente) return marca === q;
          return String(p.nombre || '').toLowerCase().includes(q) ||
            String(p.codigo || '').toLowerCase().includes(q) ||
            marca.includes(q);
        });
      if (filtrados.length === 0) {
        contenedor.innerHTML = '<div class="col-12 text-center text-muted py-5">No se encontraron productos coincidentes.</div>';
        return;
      }
      filtrados.forEach(prod => {
        const id = claveProducto(prod);
        const itemEnCarrito = carrito[id];
        const cant = itemEnCarrito ? itemEnCarrito.cantidad : 0;
        let clasesExtras = '';
        if (cant > 0) clasesExtras += 'in-cart ';
        if (!prod.disponible) clasesExtras += 'out-of-stock';
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6';
        col.innerHTML = `
          <div class="card card-product p-3 mb-1 ${clasesExtras}" id="card-${id}">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge badge-cat" aria-label="Marca: ${prod.categoria}">${prod.categoria}</span>
              <div class="d-flex align-items-center gap-2">
                <span class="text-muted small fw-semibold">COD: ${prod.codigo}</span>
              </div>
            </div>
            <div class="fw-bold fs-6 mb-3 text-dark lh-sm">${prod.nombre}${prod.empaque ? ` (${prod.empaque})` : ''}</div>
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <span class="price-tag">$${prod.precio.toFixed(2)} <span class="visually-hidden">por unidad</span></span>
              <div id="ctrl-${id}">
                ${renderBotonesTarjeta(id, cant)}
              </div>
            </div>
          </div>
        `;
        tarjetas.appendChild(col);
      });
      contenedor.appendChild(tarjetas);
      contenedor.querySelectorAll('.qty-increase-button, .qty-decrease-button').forEach(button => {
        const codigo = button.closest('[id^="ctrl-"]').id.slice(5);
        const delta = button.classList.contains('qty-increase-button') ? 1 : -1;
        registrarPulsacionProlongada(button, () => modificarCantidad(codigo, delta));
      });
    }
    function renderBotonesTarjeta(codigo, cant) {
      const prod = catalogoPorClave.get(codigo);
      if (prod && !prod.disponible) {
        return `
          <button class="btn btn-light btn-sm rounded-pill px-3 py-1 fw-bold text-muted border shadow-none d-flex align-items-center gap-1"
                  style="height: 34px; cursor: not-allowed;" disabled title="Producto agotado" aria-label="${prod.nombre}, producto agotado">
            <i class="bi bi-slash-circle" aria-hidden="true"></i>
            <span>No disponible</span>
          </button>
        `;
      }
      const estaEditando = itemEditando === codigo;
      if (cant === 0 && !estaEditando) {
        return `
          <button class="btn btn-primary btn-sm rounded-pill px-4 py-1 fw-bold shadow-sm d-flex align-items-center gap-1"
                  style="height: 34px;" onclick="iniciarAgregar('${codigo}')" aria-label="Agregar ${prod.nombre} al pedido">
            <i class="bi bi-plus-lg" aria-hidden="true"></i>
            <span>Agregar</span>
          </button>
        `;
      }
      if (estaEditando) {
        const displayCant = cant > 0 ? cant : 1;
        return `
          <div class="qty-editor-actions">
            <button class="qty-editor-delete" type="button" onclick="eliminarProducto('${codigo}')"
                    title="Eliminar producto" aria-label="Eliminar ${prod.nombre} del pedido">
              <i class="bi bi-trash3" aria-hidden="true"></i>
            </button>
            <div class="qty-editor-pill" role="group" aria-label="Cantidad de ${prod.nombre}">
                <button class="qty-btn qty-decrease-button" type="button" aria-label="Reducir cantidad de ${prod.nombre}">−</button>
                <input type="number" id="input-qty-${codigo}" class="qty-input" value="${displayCant}" min="1" onchange="establecerCantidadManual('${codigo}', this.value)" aria-label="Cantidad de ${prod.nombre}">
                <button class="qty-btn qty-increase-button" type="button" aria-label="Aumentar cantidad de ${prod.nombre}">+</button>
              <button class="qty-editor-confirm" type="button"
                      onclick="finalizarEdicionItem('${codigo}')" title="Confirmar cantidad" aria-label="Confirmar cantidad de ${prod.nombre}">
                <i class="bi bi-check-lg" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        `;
      }
      return `
        <button class="btn btn-primary btn-sm rounded-pill px-3 py-1 fw-bold shadow-sm d-flex align-items-center gap-1"
                style="height: 34px;" onclick="abrirEdicionItem('${codigo}')"
                aria-label="Editar cantidad de ${prod.nombre}, ${cant} agregados">
          <i class="bi bi-bag-check-fill" aria-hidden="true"></i>
          <span>${cant} agregados</span>
        </button>
      `;
    }
    function iniciarAgregar(codigo) {
      const prod = catalogoPorClave.get(codigo);
      itemEditando = codigo;
      if (prod && prod.disponible && !carrito[codigo]) {
        carrito[codigo] = { ...prod, cantidad: 1 };
      }
      actualizarItemUI(codigo);
      actualizarBarraTotales();
    }
    function abrirEdicionItem(codigo) {
      itemEditando = codigo;
      actualizarItemUI(codigo);
    }
    function finalizarEdicionItem(codigo) {
      const inputEl = document.getElementById(`input-qty-${codigo}`);
      const cantidad = inputEl
        ? Number.parseInt(inputEl.value, 10)
        : (carrito[codigo] ? carrito[codigo].cantidad : 1);
      const prod = catalogoPorClave.get(codigo);
      if (!Number.isFinite(cantidad) || cantidad <= 0) {
        delete carrito[codigo];
      } else if (prod) {
        carrito[codigo] = { ...prod, cantidad };
        mostrarAvisoToast(`${cantidad}x ${prod.nombre}`);
      }
      itemEditando = null;
      if (getById('buscador').value.trim()) {
        getById('buscador').value = '';
        getById('btnLimpiarBuscador').classList.add('d-none');
        filtrarCatalogo();
        restaurarPosicionAntesDeBuscar();
      } else {
        actualizarItemUI(codigo);
      }
      actualizarBarraTotales();
    }
    function modificarCantidad(codigo, delta) {
      const inputEl = document.getElementById(`input-qty-${codigo}`);
      let cantidadActual = inputEl
        ? Number.parseInt(inputEl.value, 10)
        : (carrito[codigo] ? carrito[codigo].cantidad : 1);
      if (!Number.isFinite(cantidadActual)) cantidadActual = 1;
      const nuevaCant = cantidadActual + delta;
      if (nuevaCant <= 0) {
        eliminarProducto(codigo);
        return;
      }
      const prod = catalogoPorClave.get(codigo);
      if (prod) carrito[codigo] = { ...prod, cantidad: nuevaCant };
      actualizarItemUI(codigo);
      actualizarBarraTotales();
    }
    function establecerCantidadManual(codigo, valor) {
      const cantidad = Number.parseInt(valor, 10);
      if (!Number.isFinite(cantidad) || cantidad <= 0) {
        eliminarProducto(codigo);
        return;
      }
      const prod = catalogoPorClave.get(codigo);
      if (prod) carrito[codigo] = { ...prod, cantidad };
      actualizarItemUI(codigo);
      actualizarBarraTotales();
    }
    function eliminarProducto(codigo) {
      delete carrito[codigo];
      itemEditando = null;
      actualizarItemUI(codigo);
      actualizarBarraTotales();
    }
    function actualizarItemUI(codigo) {
      const cant = carrito[codigo] ? carrito[codigo].cantidad : 0;
      const ctrl = document.getElementById(`ctrl-${codigo}`);
      const card = document.getElementById(`card-${codigo}`);
      if (ctrl) {
        ctrl.innerHTML = renderBotonesTarjeta(codigo, cant);
        ctrl.querySelectorAll('.qty-increase-button, .qty-decrease-button').forEach(button => {
          const delta = button.classList.contains('qty-increase-button') ? 1 : -1;
          registrarPulsacionProlongada(button, () => modificarCantidad(codigo, delta));
        });
      }
      if (card) {
        if (cant > 0) { card.classList.add('in-cart'); }
        else { card.classList.remove('in-cart'); }
      }
    }
    function actualizarBarraTotales() {
      guardarCarritoLocal();
      const items = Object.values(carrito);
      let total = 0;
      let count = 0;
      items.forEach(i => {
        total += i.precio * i.cantidad;
        count += i.cantidad;
      });
      const barraCheckout = getById('barraCheckout');
      const carritoTieneItems = items.length > 0;
      barraCheckout.classList.toggle('d-none', !carritoTieneItems);
      barraCheckout.setAttribute('aria-hidden', String(!carritoTieneItems));
      document.getElementById('totalBarra').innerText = '$' + total.toFixed(2);
      const textoCantidad = `${count} ${count === 1 ? 'producto' : 'productos'}`;
      document.getElementById('itemsBarra').innerText = textoCantidad;
      getById('desktopItemsCount').textContent = count;
      getById('desktopItemsCount').setAttribute('aria-label', textoCantidad);
      document.getElementById('btnAbrirModal').disabled = !carritoTieneItems;
      getById('btnAbrirPedidoDesktop').disabled = !carritoTieneItems;
      getById('btnBorrarPedido').disabled = !carritoTieneItems;
      renderizarResumenPedido();
    }
    function solicitarBorradoPedido() {
      if (!Object.keys(carrito).length) return;
      modalConfirmarBorradoInstance.show();
    }
    function confirmarBorradoPedido() {
      if (!Object.keys(carrito).length) return;
      const codigos = Object.keys(carrito);
      carrito = {};
      itemEditando = null;
      codigos.forEach(actualizarItemUI);
      actualizarBarraTotales();
      cerrarRevisionTrasBorrado = true;
      modalConfirmarBorradoInstance.hide();
    }
    function mostrarAvisoToast(mensaje) {
      const toast = document.getElementById('toastAviso');
      document.getElementById('toastTexto').innerText = mensaje;
      toast.classList.add('show');
      setTimeout(() => { toast.classList.remove('show'); }, 2000);
    }
    function abrirModalFinalizar() {
      const items = Object.values(carrito);
      if (items.length === 0) return;
      renderizarResumenPedido();
      revisarTodosLosCampos();
      modalInstance.show();
    }
    function renderizarResumenPedido() {
      const contenedores = [getById('modalListaItems'), getById('desktopListaItems')];
      const filas = document.createDocumentFragment();
      const items = Object.values(carrito);
      let total = 0;
      if (!items.length) {
        const vacio = document.createElement('p');
        vacio.className = 'text-center text-muted py-3 mb-0';
        vacio.textContent = 'No hay productos en el pedido.';
        contenedores.forEach(contenedor => contenedor.replaceChildren(vacio.cloneNode(true)));
        getById('modalTotal').textContent = '$0.00';
        getById('desktopTotal').textContent = '$0.00';
        revisarBotonEnvio();
        return;
      }
      items.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        const fila = document.createElement('div');
        fila.className = 'order-summary-row';
        fila.setAttribute('role', 'listitem');
        const detalles = document.createElement('div');
        detalles.className = 'order-summary-details';
        const nombre = document.createElement('div');
        nombre.className = 'order-summary-name';
        nombre.textContent = `${item.nombre}${item.empaque ? ` (${item.empaque})` : ''}`;
        const metadatos = document.createElement('div');
        metadatos.className = 'order-summary-meta';
        metadatos.textContent = `${item.categoria || 'General'}, COD ${item.codigo || 'N/A'}, $${Number(item.precio).toFixed(2)} c/u`;
        const precio = document.createElement('span');
        precio.className = 'order-summary-subtotal';
        precio.textContent = `$${subtotal.toFixed(2)}`;
        const acciones = document.createElement('div');
        acciones.className = 'order-summary-actions';
        const cantidadControl = document.createElement('div');
        cantidadControl.className = 'order-qty-control';
        cantidadControl.setAttribute('role', 'group');
        cantidadControl.setAttribute('aria-label', `Cantidad de ${item.nombre}`);
        const btnMenos = document.createElement('button');
        btnMenos.type = 'button';
        btnMenos.className = 'order-qty-button order-qty-decrease-button';
        const simboloMenos = document.createElement('span');
        simboloMenos.setAttribute('aria-hidden', 'true');
        simboloMenos.textContent = '−';
        btnMenos.appendChild(simboloMenos);
        btnMenos.dataset.codigo = claveProducto(item);
        btnMenos.disabled = item.cantidad <= 1;
        btnMenos.setAttribute('aria-label', `Reducir cantidad de ${item.nombre}`);
        const cantidad = document.createElement('span');
        cantidad.className = 'order-qty-value';
        cantidad.textContent = item.cantidad;
        cantidad.setAttribute('aria-label', `Cantidad: ${item.cantidad}`);
        const btnMas = document.createElement('button');
        btnMas.type = 'button';
        btnMas.className = 'order-qty-button order-qty-increase-button';
        const simboloMas = document.createElement('span');
        simboloMas.setAttribute('aria-hidden', 'true');
        simboloMas.textContent = '+';
        btnMas.appendChild(simboloMas);
        btnMas.dataset.codigo = claveProducto(item);
        btnMas.setAttribute('aria-label', `Aumentar cantidad de ${item.nombre}`);
        const btnEliminar = document.createElement('button');
        btnEliminar.type = 'button';
        btnEliminar.className = 'btn btn-delete-icon btn-outline-danger btn-sm rounded-circle';
        btnEliminar.dataset.codigo = claveProducto(item);
        btnEliminar.setAttribute('aria-label', `Eliminar ${item.nombre} del pedido`);
        const iconoEliminar = document.createElement('i');
        iconoEliminar.className = 'bi bi-trash3';
        iconoEliminar.setAttribute('aria-hidden', 'true');
        btnEliminar.appendChild(iconoEliminar);
        cantidadControl.append(btnMenos, cantidad, btnMas);
        acciones.append(cantidadControl, btnEliminar);
        detalles.append(nombre, metadatos);
        fila.append(detalles, precio, acciones);
        filas.appendChild(fila);
      });
      const filasDesktop = filas.cloneNode(true);
      contenedores.forEach((contenedor, indice) => {
        contenedor.replaceChildren(indice === 0 ? filas : filasDesktop);
        contenedor.querySelectorAll('.order-qty-increase-button, .order-qty-decrease-button').forEach(button => {
          const codigo = button.dataset.codigo;
          const delta = button.classList.contains('order-qty-increase-button') ? 1 : -1;
          registrarPulsacionProlongada(
            button,
            () => ajustarCantidadEnResumen(codigo, delta)
          );
        });
      });
      getById('modalTotal').textContent = `$${total.toFixed(2)}`;
      getById('desktopTotal').textContent = `$${total.toFixed(2)}`;
      revisarBotonEnvio();
    }
    function ajustarCantidadEnResumen(codigo, cambio) {
      const item = carrito[codigo];
      if (!item) return;
      const cantidadSiguiente = item.cantidad + cambio;
      if (cantidadSiguiente < 1) return;
      item.cantidad = cantidadSiguiente;
      actualizarItemUI(codigo);
      actualizarBarraTotales();
    }
    function eliminarDelResumen(codigo) {
      delete carrito[codigo];
      if (itemEditando === codigo) itemEditando = null;
      actualizarItemUI(codigo);
      actualizarBarraTotales();
    }
    function forzarMayusculas(el) {
      const inicio = el.selectionStart;
      const fin = el.selectionEnd;
      const valorOriginal = el.value;
      const valorMayusculas = valorOriginal.toUpperCase();
      if (valorOriginal === valorMayusculas) return;

      const nuevaPosicionInicio = inicio === null
        ? null
        : valorOriginal.slice(0, inicio).toUpperCase().length;
      const nuevaPosicionFin = fin === null
        ? null
        : valorOriginal.slice(0, fin).toUpperCase().length;
      el.value = valorMayusculas;
      if (nuevaPosicionInicio !== null && nuevaPosicionFin !== null) {
        el.setSelectionRange(nuevaPosicionInicio, nuevaPosicionFin);
      }
    }
    function limpiarCaracteresEspeciales(el, caracteresNoPermitidos = /[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]/g) {
      const valor = el.value.normalize('NFC');
      const posicion = el.selectionStart;
      const valorAntesDelCursor = posicion === null ? valor : valor.slice(0, posicion);
      const valorLimpio = valor.replace(caracteresNoPermitidos, '');
      if (valorLimpio !== el.value) {
        el.value = valorLimpio;
        if (posicion !== null) {
          const posicionLimpia = valorAntesDelCursor.replace(caracteresNoPermitidos, '').length;
          el.setSelectionRange(posicionLimpia, posicionLimpia);
        }
      }
    }
    function normalizarNombreVendedor(nombre) {
      return String(nombre || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .replace(/\s+/g, ' ');
    }
    function mostrarAyudaVendedor(texto, estado) {
      const ayuda = getById('vendedorAyuda');
      ayuda.textContent = texto;
      ayuda.className = `val-feedback px-2${texto ? ` d-block text-${estado}` : ''}`;
    }
    function programarValidacionVendedor() {
      window.clearTimeout(temporizadorValidacionVendedor);
      solicitudVendedor += 1;
      vendedorValidado = null;
      const campo = getById('vendedorNombre');
      const nombre = campo.value.trim();
      const formatoValido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]{6,40}$/.test(nombre);

      if (!formatoValido) {
        estadoValidacionVendedor = '';
        mostrarAyudaVendedor(nombre ? 'Nombre inválido.' : '', 'danger');
        validarCampoVendedor();
        return;
      }

      estadoValidacionVendedor = 'verificando';
      mostrarAyudaVendedor('Verificando...', 'muted');
      validarCampoVendedor();
      const solicitud = solicitudVendedor;
      temporizadorValidacionVendedor = window.setTimeout(
        () => consultarVendedorRegistrado(nombre, solicitud),
        350
      );
    }
    async function consultarVendedorRegistrado(nombre, solicitud) {
      try {
        const url = `${URL_API_APPS_SCRIPT}?action=validarVendedor&nombre=${encodeURIComponent(nombre)}&_=${Date.now()}`;
        const respuesta = await fetch(url, { cache: 'no-store' });
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const datos = await respuesta.json();
        if (datos?.exito !== true || typeof datos.registrado !== 'boolean') {
          throw new Error(datos?.mensaje || 'El servidor devolvió una respuesta de validación inválida.');
        }
        if (solicitud !== solicitudVendedor ||
            normalizarNombreVendedor(getById('vendedorNombre').value) !== normalizarNombreVendedor(nombre)) {
          return;
        }
        vendedorValidado = {
          nombre: normalizarNombreVendedor(nombre),
          registrado: datos.registrado
        };
        estadoValidacionVendedor = datos.registrado ? 'registrado' : 'no-registrado';
        mostrarAyudaVendedor(
          datos.registrado
            ? 'Registrado.'
            : 'No registrado.',
          datos.registrado ? 'success' : 'danger'
        );
        validarCampoVendedor();
      } catch (error) {
        if (solicitud !== solicitudVendedor) return;
        estadoValidacionVendedor = 'error';
        console.error('No se pudo validar el vendedor:', error);
        mostrarAyudaVendedor(
          'Error de conexión.',
          'danger'
        );
        validarCampoVendedor();
      }
    }
    function validarCampoVendedor(actualizarBoton = true) {
      const el = getById('vendedorNombre');
      const nombre = normalizarNombreVendedor(el.value);
      const formatoValido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]{6,40}$/.test(el.value.trim());
      const registrado = formatoValido &&
        vendedorValidado?.registrado === true &&
        vendedorValidado.nombre === nombre;
      const errorVendedor = !registrado && estadoValidacionVendedor !== 'verificando';
      el.classList.toggle('is-valid', registrado);
      el.classList.toggle('is-invalid', errorVendedor);
      el.setAttribute('aria-invalid', String(errorVendedor));
      if (actualizarBoton) revisarBotonEnvio();
      return registrado;
    }
    function validarCampoCliente(actualizarBoton = true) {
      const el = document.getElementById('clienteNombre');
      const esValido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]{6,60}$/.test(el.value.trim());
      el.classList.toggle('is-valid', esValido && el.value.trim() !== '');
      el.classList.toggle('is-invalid', !esValido || el.value.trim() === '');
      el.setAttribute('aria-invalid', String(!esValido || el.value.trim() === ''));
      if (actualizarBoton) revisarBotonEnvio();
      return esValido;
    }
    function validarCampoZona(actualizarBoton = true) {
      const el = document.getElementById('zonaPedido');
      if (el.value.trim() === '') {
        el.classList.remove('is-invalid', 'is-valid');
        el.setAttribute('aria-invalid', 'false');
        if (actualizarBoton) revisarBotonEnvio();
        return true;
      }
      const esValido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]{2,40}$/.test(el.value.trim());
      el.classList.toggle('is-valid', esValido && el.value.trim() !== '');
      el.classList.toggle('is-invalid', !esValido || el.value.trim() === '');
      el.setAttribute('aria-invalid', String(!esValido || el.value.trim() === ''));
      if (actualizarBoton) revisarBotonEnvio();
      return esValido;
    }
    function validarCampoRif(actualizarBoton = true) {
      const el = document.getElementById('clienteRif');
      const valorOriginal = el.value.toUpperCase();
      const posicion = el.selectionStart;
      const valorAntesDelCursor = posicion === null ? valorOriginal : valorOriginal.slice(0, posicion);
      const normalizarRif = (valor) => {
        const caracteresPermitidos = valor.toUpperCase().replace(/[^VEJGPC0-9-]/g, '');
        const prefijo = /^[VEJGPC]/.test(caracteresPermitidos) ? caracteresPermitidos[0] : '';
        if (!prefijo) return '';
        const tieneGuionDespuesDelPrefijo = caracteresPermitidos.charAt(1) === '-';
        const digitos = caracteresPermitidos
          .slice(tieneGuionDespuesDelPrefijo ? 2 : 1)
          .replace(/\D/g, '')
          .slice(0, 9);
        return prefijo + (tieneGuionDespuesDelPrefijo ? '-' : '') + digitos;
      };
      const val = normalizarRif(valorOriginal);
      if (el.value !== val) {
        el.value = val;
        if (posicion !== null) {
          el.setSelectionRange(normalizarRif(valorAntesDelCursor).length, normalizarRif(valorAntesDelCursor).length);
        }
      }
      if (val === '') {
        el.classList.remove('is-invalid', 'is-valid');
        el.setAttribute('aria-invalid', 'false');
        if (actualizarBoton) revisarBotonEnvio();
        return true;
      }
      const esValido = /^[VEJGPC]-\d{6,9}$/.test(val);
      el.classList.toggle('is-valid', esValido);
      el.classList.toggle('is-invalid', !esValido);
      el.setAttribute('aria-invalid', String(!esValido));
      if (actualizarBoton) revisarBotonEnvio();
      return esValido;
    }
    function revisarTodosLosCampos() {
      validarCampoVendedor(false);
      validarCampoCliente(false);
      validarCampoZona(false);
      validarCampoRif(false);
      revisarBotonEnvio();
    }
    function revisarBotonEnvio() {
      const v1 = document.getElementById('vendedorNombre').classList.contains('is-valid');
      const v2 = document.getElementById('clienteNombre').classList.contains('is-valid');
      const v3 = !document.getElementById('zonaPedido').classList.contains('is-invalid');
      const v4 = !document.getElementById('clienteRif').classList.contains('is-invalid');
      document.getElementById('btnEnviar').disabled = !(v1 && v2 && v3 && v4 && Object.keys(carrito).length > 0);
    }
    function enviarPedido(e) {
      e.preventDefault();
      forzarMayusculas(getById('clienteNombre'));
      forzarMayusculas(getById('zonaPedido'));
      forzarMayusculas(getById('vendedorNombre'));
      const vendedorValido = validarCampoVendedor();
      const clienteValido = validarCampoCliente();
      const zonaValida = validarCampoZona();
      const rifValido = validarCampoRif();
      if (!(vendedorValido && clienteValido && zonaValida && rifValido)) {
        const primerCampoInvalido = document.querySelector('#formularioPedido [aria-invalid="true"]');
        if (primerCampoInvalido) primerCampoInvalido.focus();
        mostrarAlertaPersonalizada('Campos incompletos', 'Por favor verifica los campos obligatorios antes de procesar la orden.', 'advertencia');
        return;
      }
      const btn = document.getElementById('btnEnviar');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Enviando pedido...';
      document.getElementById('formularioPedido').setAttribute('aria-busy', 'true');
      const items = Object.values(carrito);
      const resumenTexto = items.map(i => `${i.cantidad}x [${i.categoria || 'General'} - COD ${i.codigo}] ${i.nombre}${i.empaque ? ` (${i.empaque})` : ''} ($${(i.precio * i.cantidad).toFixed(2)})`).join("\n");
      const total = items.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
      const itemsDetalle = items.map(i => ({codigo: i.codigo, nombre: i.nombre, categoria: i.categoria, empaque: i.empaque, cantidad: i.cantidad, precio: i.precio}));
      const rifVal = document.getElementById('clienteRif').value.trim().toUpperCase();
      const payload = {
        vendedor: document.getElementById('vendedorNombre').value.trim(),
        cliente: document.getElementById('clienteNombre').value.trim(),
        zona: document.getElementById('zonaPedido').value.trim(),
        rif: rifVal !== '' ? rifVal : 'N/A',
        comentario: document.getElementById('comentarioPedido').value.trim(),
        resumenTexto: resumenTexto,
        itemsDetalle: itemsDetalle,
        totalDolares: total.toFixed(2)
      };
      function restaurarBotonEnvio() {
        btn.innerHTML = '<i class="bi bi-send-check me-2"></i>Enviar Pedido';
        document.getElementById('formularioPedido').setAttribute('aria-busy', 'false');
        revisarBotonEnvio();
      }
      fetch(URL_API_APPS_SCRIPT, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      })
      .then(async (res) => {
        const textoRespuesta = await res.text();
        const pareceHtml = /<(html|!doctype)|<body|<script/i.test(textoRespuesta);
        if (pareceHtml) {
          throw new Error('La URL del Web App de Google no está disponible o no está publicada como “Anyone”. Revisa el despliegue y la URL de conexión.');
        }
        if (!textoRespuesta) {
          throw new Error('El servidor no devolvió ninguna respuesta. Verifica que el Web App esté activo.');
        }
        let respuesta;
        try {
          respuesta = JSON.parse(textoRespuesta);
        } catch (error) {
          throw new Error('La respuesta del servidor no es JSON válido. Revisa la configuración del Web App de Apps Script.');
        }
        if (!res.ok) {
          throw new Error(respuesta?.mensaje || `El servidor respondió con estado ${res.status}.`);
        }
        if (respuesta.exito) {
          modalInstance.hide();
          const comprobantePrincipalEnviado = respuesta.estadoComprobantePrincipal === 'enviado';
          const estadoCopiaVendedor = respuesta.estadoCopiaVendedor;
          const mensajeComprobanteVendedor = estadoCopiaVendedor === 'enviado'
            ? 'Se envió una copia al correo asociado al vendedor.'
            : estadoCopiaVendedor === 'fallo'
              ? 'No se pudo enviar la copia al vendedor.'
              : 'No se encontró un correo válido del vendedor en la pestaña VENDEDORES.';
          const mensajeExito = comprobantePrincipalEnviado
            ? `Tu pedido ha sido registrado y enviado a LIMZA GROUP. ${mensajeComprobanteVendedor}`
            : `Tu pedido ha sido registrado, pero no se pudo enviar el comprobante a LIMZA GROUP. ${mensajeComprobanteVendedor}`;
          mostrarAlertaPersonalizada('¡Orden completada!', mensajeExito, 'exito');
          carrito = {};
          itemEditando = null;
          document.getElementById('formularioPedido').reset();
          document.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
            el.setAttribute('aria-invalid', 'false');
          });
          actualizarBarraTotales(); limpiarBuscadorManualmente();
        } else {
          mostrarAlertaPersonalizada('Error de sistema', respuesta?.mensaje || 'No se pudo completar la orden.', 'error');
        }
      })
      .catch(err => {
        const respuestaBloqueadaPorElNavegador = err instanceof TypeError && err.message === 'Failed to fetch';
        if (respuestaBloqueadaPorElNavegador) {
          mostrarAlertaPersonalizada(
            'No se pudo confirmar el resultado',
            'Google pudo haber recibido y procesado el pedido, pero el navegador no pudo leer la respuesta. Revisa la hoja de pedidos y el correo antes de volver a enviarlo para evitar duplicados.',
            'advertencia'
          );
          return;
        }
        mostrarAlertaPersonalizada('Error de conexión', err.message || 'No se pudo comunicar con el servidor.', 'error');
      })
      .finally(() => {
        restaurarBotonEnvio();
      });
    }
