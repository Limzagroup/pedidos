# pedidos
LIMZA GROUP Pedidos

El catálogo combina las pestañas `Productos` y `cebra` del archivo de Google Sheets. `Productos` debe incluir `Código`, `Producto` y `Precio de venta` (marca y disponibilidad son opcionales). `cebra` debe incluir `Código`, `Descripción` y `Precio USD`; `Empaque` es opcional y se muestra junto a la descripción. Para controlar disponibilidad en `cebra`, agrega una columna `Publicación`, `Publicado` o `Disponible`; los valores `No` y `No publicar` deshabilitan el producto.

La pestaña `VENDEDORES` puede incluir columnas `Vendedor` (o `Nombre`) y `Correo` (o `Email`). Al registrar un pedido, se busca el vendedor sin distinguir mayúsculas ni acentos y se envía una copia del PDF sin los campos operativos de Picking, bulto, pedido, nota y guías. Si falta una coincidencia o el correo no es válido, el pedido y el comprobante principal se procesan igualmente y se informa al usuario.
