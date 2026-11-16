(() => {
  const botonMenu = document.getElementById('btnAbrirMenu');
  const menuPrincipal = document.getElementById('menuPrincipal');
  const botonTema = document.getElementById('btnCambiarTema');
  const iconoTema = document.getElementById('iconoTema');
  const etiquetaTema = document.getElementById('etiquetaTema');

  if (!botonMenu || !menuPrincipal || !botonTema || !iconoTema || !etiquetaTema) {
    throw new Error('No se pudo inicializar la navegación: faltan elementos del menú.');
  }

  function cerrarMenu() {
    menuPrincipal.hidden = true;
    botonMenu.setAttribute('aria-expanded', 'false');
  }

  function aplicarTema(tema) {
    const esClaro = tema === 'claro';
    document.body.classList.toggle('light-mode', esClaro);
    const temaDestino = esClaro ? 'oscuro' : 'claro';
    botonTema.setAttribute('aria-checked', String(esClaro));
    botonTema.setAttribute('aria-label', `Cambiar a modo ${temaDestino}`);
    botonTema.title = `Cambiar a modo ${temaDestino}`;
    etiquetaTema.textContent = esClaro ? 'Claro' : 'Oscuro';
    iconoTema.className = `bi bi-${esClaro ? 'sun' : 'moon'}`;
  }

  let temaGuardado = 'oscuro';
  try {
    temaGuardado = localStorage.getItem('limza-tema') === 'claro' ? 'claro' : 'oscuro';
  } catch (error) {
    console.warn('No se pudo recuperar la preferencia de tema:', error);
  }
  aplicarTema(temaGuardado);

  botonMenu.addEventListener('click', event => {
    event.stopPropagation();
    const abierto = menuPrincipal.hidden;
    menuPrincipal.hidden = !abierto;
    botonMenu.setAttribute('aria-expanded', String(abierto));
  });
  botonTema.addEventListener('click', event => {
    const tema = document.body.classList.contains('light-mode') ? 'oscuro' : 'claro';
    aplicarTema(tema);
    try {
      localStorage.setItem('limza-tema', tema);
    } catch (error) {
      console.warn('No se pudo guardar la preferencia de tema:', error);
    }
    if (event.detail > 0) event.currentTarget.blur();
  });
  document.addEventListener('click', event => {
    if (!menuPrincipal.contains(event.target) && !botonMenu.contains(event.target)) cerrarMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menuPrincipal.hidden) {
      cerrarMenu();
      botonMenu.focus();
    }
  });

  window.LimzaNavigation = { closeMenu: cerrarMenu };
})();
