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
        [/^MARFIL$/, "#CEC7AE"],
        [/^AMARILLO PURO$/, "#E5B013"],
        [/^AMARILLO ORO$/, "#BA7448"],
        [/^AMARILLO BANDERA$/, "#FFBF3E"],
        [/^ANARANJADO$/, "#D5492E"],
        [/^AZUL CIELO$/, "#047A9A"],
        [/^AZUL PROFUNDO$/, "#163354"],
        [/^AZUL BANDERA$/, "#113E7B"],
        [/^AGUAMARINA$/, "#71AFAA"],
        [/^ROJO VIVO$/, "#CE002C"],
        [/^ROJO RUBI$/, "#5D1217"],
        [/^ROJO BANDERA$/, "#A0000C"],
        [/^VERDE PRADERA$/, "#29805A"],
        [/^VERDE SELVA$/, "#183C30"],
        [/^CASTANO REAL$/, "#5F2E28"],
        [/^CHOCOLATE$/, "#442D20"],
        [/^GRIS OSCURO$/, "#6E6D72"],
        [/^GRIS LIGERO$/, "#999999"],
        [/^ALUMINIO$/, "#AFAFAF"],
        [/^BLANCO OSTRA$/, "#ECEFDC"],
        [/^BLANCO$/, "#ffffff"],
        [/^BLANCO MATE$/, "#f4f3ee"],
        [/^NEGRO$/, "#060606"],
        [/^NEGRO MATE$/, "#2c2c2c"]
      ];
      const coincidenciaEsmalte = coloresEsmalte.find(([patron]) => patron.test(color));
      if (coincidenciaEsmalte) return coincidenciaEsmalte[1];
    }
    if (normalizarNombre(linea) === "FONDO 2 EN 1") {
      const coloresFondoDosEnUno = [
        [/^BLANCO$/, "#FFFFFF"],
        [/^GRIS$/, "#43484F"],
        [/^ROJO$/, "#72201A"],
        [/^NEGRO$/, "#0E0E0E"]
      ];
      const coincidencia = coloresFondoDosEnUno.find(([patron]) => patron.test(color));
      if (coincidencia) return coincidencia[1];
    }
    if (normalizarNombre(linea) === "FONDO ANTICORROSIVO") {
      const coloresFondoAnticorrosivo = [
        [/^BLANCO$/, "#FFFFFF"],
        [/^GRIS$/, "#4B5158"],
        [/^ROJO$/, "#763930"],
        [/^NEGRO$/, "#2D2D2D"]
      ];
      const coincidencia = coloresFondoAnticorrosivo.find(([patron]) => patron.test(color));
      if (coincidencia) return coincidencia[1];
    }
    if (normalizarNombre(linea) === "FONDO ANTIALCALINO" && color === "BLANCO MATE") {
      return "#FFFFFF";
    }
    if (normalizarNombre(linea) === "CAUCHO MATE CLASE A") {
      const coloresClaseA = [
        [/^BLANCO NIEVE$/, "#FFFFFF"],
        [/^BLANCO OSTRA$/, "#C2C3BC"],
        [/^BEIGE ARENA$/, "#E6DEC6"],
        [/^OCRE$/, "#A67458"],
        [/^NARANJA$/, "#EC7358"],
        [/^ROSADO$/, "#CD8EAC"],
        [/^LAVANDA$/, "#8A81B6"],
        [/^AZUL CIELO$/, "#B5EAFE"],
        [/^AZUL$/, "#5F86B8"],
        [/^VERDE$/, "#29A98E"],
        [/^VERDE MANZANA$/, "#87CB80"],
        [/^AMARILLO OCRE$/, "#D4AA5E"],
        [/^GRIS$/, "#979797"]
      ];
      const coincidenciaClaseA = coloresClaseA.find(([patron]) => patron.test(color));
      if (coincidenciaClaseA) return coincidenciaClaseA[1];
    }
    if (normalizarNombre(linea) === "CAUCHO MATE CLASE C") {
      const coloresClaseC = [
        [/^BLANCO NIEVE$/, "#FFFFFF"],
        [/^BLANCO OSTRA$/, "#BCBCBC"],
        [/^AMARILLO CREMA$/, "#EDE6CD"],
        [/^AMARILLO$/, "#F2B844"],
        [/^ROSADO SALMON$/, "#C49487"],
        [/^CEREZA$/, "#DF2950"],
        [/^GUAYABA ROSA$/, "#D37482"],
        [/^FUCSIA$/, "#B94A69"],
        [/^MORADO$/, "#6B70A4"],
        [/^AZUL TURQUESA$/, "#4DB8C1"],
        [/^AZUL PROFUNDO$/, "#275B96"],
        [/^VERDE LIMON$/, "#DEDDAE"],
        [/^VERDE PISTACHO$/, "#63C592"],
        [/^VERDE$/, "#1D6F68"],
        [/^MANDARINA$/, "#D6654E"],
        [/^TERRACOTA$/, "#A15F58"],
        [/^MARRON EGIPTO$/, "#5F6059"],
        [/^VINOTINTO$/, "#994357"],
        [/^GRIS$/, "#565656"],
        [/^NEGRO$/, "#323232"]
      ];
      const coincidenciaClaseC = coloresClaseC.find(([patron]) => patron.test(color));
      if (coincidenciaClaseC) return coincidenciaClaseC[1];
    }
    if (normalizarNombre(linea) === "CAUCHO MATE CLASE B") {
      const coloresClaseB = [
        [/^BLANCO NIEVE$/, "#FFFFFF"],
        [/^BLANCO HUMO$/, "#E3E4DD"],
        [/^MARFIL$/, "#FFFCE0"],
        [/^ROJO$/, "#B43F4B"],
        [/^NARANJA$/, "#D05F48"],
        [/^AMARILLO IMPERIAL$/, "#EFCB78"],
        [/^VERDE$/, "#9DC156"],
        [/^VERDE GEMA$/, "#0D997E"],
        [/^AZUL$/, "#0380AE"],
        [/^VIOLETA$/, "#80558A"],
        [/^ROSADO ROMANCE$/, "#EBA7AC"],
        [/^MARRON$/, "#815B5A"],
        [/^DORADO$/, "#8B774E"],
        [/^GRIS CEMENTO$/, "#7F7C74"],
        [/^NEGRO$/, "#343434"]
      ];
      const coincidenciaClaseB = coloresClaseB.find(([patron]) => patron.test(color));
      if (coincidenciaClaseB) return coincidenciaClaseB[1];
    }
    return "#a9adb5";
  };
})(window);
