# pedidos
LIMZA GROUP Pedidos

El catálogo combina las pestañas `Productos` y `cebra` del archivo de Google Sheets. `Productos` debe incluir `Código`, `Producto` y `Precio de venta` (marca y disponibilidad son opcionales). `cebra` debe incluir `Código`, `Descripción` y `Precio USD`; `Empaque` es opcional y se muestra junto a la descripción. Para controlar disponibilidad en `cebra`, agrega una columna `Publicación`, `Publicado` o `Disponible`; los valores `No` y `No publicar` deshabilitan el producto.

La tasa USDT/VES muestra el último valor válido guardado en el dispositivo mientras consulta una actualización, y reintenta automáticamente si falla la conexión. Si no se puede actualizar el inventario, el catálogo guardado permanece visible sin mostrar un error de sincronización.

El carrito de pedidos se guarda localmente en el navegador y se restaura al regresar desde el catálogo digital o recargar la página. Se elimina al completar correctamente el pedido; los datos personales del formulario no se guardan.

El nombre del vendedor se valida contra la pestaña `VENDEDORES` antes de habilitar el envío del pedido y también se verifica en el servidor al guardar. Al modificar `script.js`, hay que actualizar el proyecto y volver a desplegar el Web App de Apps Script para activar esta comprobación.

La pestaña `VENDEDORES` puede incluir columnas `Vendedor` (o `Nombre`) y `Correo` (o `Email`). Al registrar un pedido, se busca el vendedor sin distinguir mayúsculas ni acentos y se envía una copia del PDF sin los campos operativos de Picking, bulto, pedido, nota y guías. Si falta una coincidencia o el correo no es válido, el pedido y el comprobante principal se procesan igualmente y se informa al usuario.

El PDF deja que el motor de impresión distribuya las filas según el espacio disponible, repite el encabezado de la tabla en cada página y evita cortar una fila entre páginas.

El apartado `Catálogo digital` está aislado en `catalogo.html`. Es de solo lectura: muestra imagen, código, producto, marca y precio del catálogo público de LIMZA GROUP, además de los productos CEBRA disponibles de la hoja de pedidos; cuando CEBRA tiene empaque, lo muestra en la descripción. No incluye controles para agregar artículos al pedido. Comparte la preferencia de tema y el menú de navegación con la página de pedidos.

La opción `Descargar catálogo`, disponible desde el menú compartido, permite descargar el PDF completo o elegir marcas específicas. Combina el catálogo público con los productos CEBRA disponibles de la hoja de pedidos y completa los logos desde el directorio de marcas. Cuando el producto tiene empaque, lo añade a la descripción. Genera el archivo con `pdf-lib`, incrusta productos e imágenes sobre la plantilla original `Plantilla_Catalogo.pdf` y conserva su cuadrícula 3 × 5, distribución, bordes y numeración de página.
