(function (global) {
  "use strict";

  function normalizarNombre(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLocaleUpperCase();
  }

  function obtenerTipoPintura(linea) {
    const texto = normalizarNombre(linea);
    if (texto.includes("TIPO A") || texto.includes("CLASE A")) return "TIPO A";
    if (texto.includes("TIPO B") || texto.includes("CLASE B")) return "TIPO B";
    if (texto.includes("TIPO C") || texto.includes("CLASE C")) return "TIPO C";
    if (texto.includes("ESMALTE")) return "ESMALTE";
    if (texto.includes("FONDO")) return "FONDO";
    return "";
  }

  global.analizarPinturaCatalogo = function (producto) {
    if (normalizarNombre(producto.categoria) !== "CEBRA") return null;
    const nombre = String(producto.nombre || "").trim();
    const fondoDosEnUno = normalizarNombre(nombre).match(/^FONDO (BLANCO|GRIS|NEGRO|ROJO) 2 EN 1$/);
    if (fondoDosEnUno) {
      return { linea: "FONDO 2 EN 1", color: fondoDosEnUno[1], tipo: "FONDO" };
    }
    if (normalizarNombre(nombre) === "FONDO ANTIALCALINO") {
      return { linea: nombre, color: "BLANCO MATE", tipo: "FONDO" };
    }
    const separador = nombre.match(/^(.+?)\s*[-–—]\s*(.+)$/);
    if (!separador) return null;
    const linea = separador[1].trim();
    const tipo = obtenerTipoPintura(linea);
    if (!tipo) return null;
    return { linea, color: separador[2].trim(), tipo };
  };

  global.obtenerColorMuestraCatalogo = function (nombre, linea) {
    const color = normalizarNombre(nombre);
    if (normalizarNombre(linea) === "ESMALTE") {
      const coloresEsmalte = [
        [/^MARFIL$/, "#d3c9b2"],
        [/^AMARILLO PURO$/, "#e2b900"],
        [/^AMARILLO ORO$/, "#c48a18"],
        [/^AMARILLO BANDERA$/, "#e1b914"],
        [/^ANARANJADO$/, "#e85b16"],
        [/^AZUL CIELO$/, "#1380b7"],
        [/^AZUL PROFUNDO$/, "#1b2942"],
        [/^AZUL BANDERA$/, "#0c3479"],
        [/^AGUAMARINA$/, "#78b8bc"],
        [/^ROJO VIVO$/, "#c5203a"],
        [/^ROJO RUBI$/, "#aa2134"],
        [/^ROJA BANDERA$/, "#bf1e27"],
        [/^ROJO BANDERA$/, "#bf1e27"],
        [/^VERDE PRADERA$/, "#299c4a"],
        [/^VERDE SELVA$/, "#153f3a"],
        [/^CASTANO REAL$/, "#783a30"],
        [/^CHOCOLATE$/, "#704036"],
        [/^GRIS OSCURO$/, "#707782"],
        [/^GRIS LIGERO$/, "#9a9ea5"],
        [/^ALUMINIO$/, "linear-gradient(135deg, #d6dae0 0%, #7d8794 24%, #f0f2f4 45%, #929ca8 63%, #e2e5e9 82%, #9da6b1 100%)"],
        [/^BLANCO OSTRA$/, "#bfbfb4"],
        [/^BLANCO$/, "linear-gradient(135deg, #ffffff 0%, #f0f1f0 35%, #ffffff 50%, #e4e6e8 70%, #ffffff 100%)"],
        [/^BLANCO MATE$/, "#f4f3ee"],
        [/^NEGRO$/, "linear-gradient(135deg, #62656b 0%, #1d1e22 24%, #050506 48%, #33353a 72%, #0b0b0c 100%)"],
        [/^NEGRO MATE$/, "#111111"]
      ];
      const coincidenciaEsmalte = coloresEsmalte.find(([patron]) => patron.test(color));
      if (coincidenciaEsmalte) return coincidenciaEsmalte[1];
    }
    if (normalizarNombre(linea) === "FONDO 2 EN 1") {
      const coloresFondoDosEnUno = [
        [/^BLANCO$/, "#f4f2ea"],
        [/^GRIS$/, "#2b2a2f"],
        [/^ROJO$/, "#74281f"],
        [/^NEGRO$/, "#111011"]
      ];
      const coincidencia = coloresFondoDosEnUno.find(([patron]) => patron.test(color));
      if (coincidencia) return coincidencia[1];
    }
    if (normalizarNombre(linea) === "FONDO ANTICORROSIVO") {
      const coloresFondoAnticorrosivo = [
        [/^BLANCO$/, "#f2efe6"],
        [/^GRIS$/, "#3a3a3d"],
        [/^ROJO$/, "#812e22"],
        [/^NEGRO$/, "#1d1b1c"]
      ];
      const coincidencia = coloresFondoAnticorrosivo.find(([patron]) => patron.test(color));
      if (coincidencia) return coincidencia[1];
    }
    if (normalizarNombre(linea) === "CAUCHO MATE CLASE C") {
      const coloresClaseC = [
        [/^BLANCO NIEVE$/, "#f5f5f5"],
        [/^BLANCO OSTRA$/, "#c9c5bb"],
        [/^AMARILLO CREMA$/, "#dccea9"],
        [/^AMARILLO$/, "#e1a900"],
        [/^ROSADO SALMON$/, "#d89b89"],
        [/^CEREZA$/, "#c9242e"],
        [/^GUAYABA ROSA$/, "#cc7777"],
        [/^FUCSIA$/, "#b33e5c"],
        [/^MORADO$/, "#7873a6"],
        [/^AZUL TURQUESA$/, "#36a2b6"],
        [/^AZUL PROFUNDO$/, "#1456a8"],
        [/^VERDE LIMON$/, "#c6c982"],
        [/^VERDE PISTACHO$/, "#7cc77c"],
        [/^VERDE$/, "#18836f"],
        [/^MANDARINA$/, "#e75918"],
        [/^TERRACOTA$/, "#c76755"],
        [/^MARRON EGIPTO$/, "#827253"],
        [/^VINOTINTO$/, "#a8404b"],
        [/^GRIS$/, "#706b65"],
        [/^NEGRO$/, "#1f1f1f"]
      ];
      const coincidenciaClaseC = coloresClaseC.find(([patron]) => patron.test(color));
      if (coincidenciaClaseC) return coincidenciaClaseC[1];
    }
    if (normalizarNombre(linea) === "CAUCHO MATE CLASE B") {
      const coloresClaseB = [
        [/^BLANCO NIEVE$/, "#f5f5f5"],
        [/^BLANCO HUMO$/, "#d0c9bc"],
        [/^MARFIL$/, "#e6d0a7"],
        [/^ROJO$/, "#ca3025"],
        [/^NARANJA$/, "#e64a13"],
        [/^AMARILLO IMPERIAL$/, "#ddb725"],
        [/^VERDE$/, "#a4b70b"],
        [/^VERDE GEMA$/, "#168f70"],
        [/^AZUL$/, "#0573c3"],
        [/^VIOLETA$/, "#8a508b"],
        [/^ROSADO ROMANCE$/, "#e69c9c"],
        [/^MARRON$/, "#835148"],
        [/^DORADO$/, "#a68132"],
        [/^GRIS CEMENTO$/, "#928c80"],
        [/^NEGRO$/, "#1f1d1e"]
      ];
      const coincidenciaClaseB = coloresClaseB.find(([patron]) => patron.test(color));
      if (coincidenciaClaseB) return coincidenciaClaseB[1];
    }
    const colores = [
      [/^BLANCO NIEVE$/, "#f5f5f5"],
      [/^BLANCO OSTRA$/, "#d0c4b4"],
      [/^GRIS$/, "#9d9d9a"],
      [/^AZUL$/, "#6a89c1"],
      [/^AZUL CIELO$/, "#a8cbde"],
      [/^VERDE$/, "#56b39f"],
      [/^VERDE MANZANA$/, "#9dd26a"],
      [/^NARANJA$/, "#e86023"],
      [/^BEIGE ARENA$/, "#d6bea1"],
      [/^AMARILLO OCRE$/, "#e3b612"],
      [/^OCRE$/, "#b77747"],
      [/^ROSADO$/, "#e2a6b5"],
      [/^LAVANDA$/, "#b89ecd"],
      [/BLANCO NIEVE|BLANCO/, "#ffffff"],
      [/OSTRA/, "#e4dac3"],
      [/GRIS|CEMENTO|ALUMINIO/, "#92979d"],
      [/AZUL CIELO/, "#67b7e5"],
      [/TURQUESA/, "#36a9aa"],
      [/AZUL/, "#2879ca"],
      [/VERDE MANZANA/, "#58ad50"],
      [/VERDE/, "#31975a"],
      [/NARANJA|ANARANJADO|MANDARINA|TERRACOTA/, "#ed861c"],
      [/BEIGE|ARENA|MARFIL/, "#d6c29d"],
      [/AMARILLO|OCRE|DORADO/, "#d9af22"],
      [/ROSADO|ROSA|FUCSIA|GUAYABA/, "#d7839a"],
      [/LAVANDA|VIOLETA/, "#a18bc6"],
      [/MARRON|CASTANO|CHOCOLATE/, "#80583f"],
      [/NEGRO/, "#111111"],
      [/ROJO/, "#d92934"]
    ];
    const coincidencia = colores.find(([patron]) => patron.test(color));
    return coincidencia ? coincidencia[1] : "#a9adb5";
  };
})(window);
