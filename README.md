# Lathe Material Transfer v1.0

Visualizador portátil en español para la transferencia main/sub spindle. Abre `index.html` directamente en Chrome, Edge o Firefox. No requiere instalación, servidor, Internet ni cuenta. Copia ese archivo a otra computadora para usarlo allí.

- Vista lateral y reproducción por etapas: grab, main abre, pull, main cierra y estado posterior al cut-off.
- Cálculo desde agarre/salida física deseados o desde posiciones B existentes.
- Referencia Stock front o Model front, material frontal retirado y sustituto configurable del destino B0.
- Guardar y abrir parámetros como JSON.

Las medidas están en pulgadas. La salida inicial siempre mide desde los jaws del main hasta el stock sin desbastar. Model front se interpreta como la cara terminada tras retirar el excedente frontal. G54 permanece fijo y B0 alinea la cara de los jaws del sub con G54 Z0. El modelo asume desplazamiento B positivo hacia la derecha.

El ejemplo del código G usa stock 2, desbaste 0.025, grab B-1 y destino B0.0001: agarre real 0.975, pull 1.0001 y cara final 2.9751 pulgadas.

Esta versión no importa G-code, no genera código para máquina y no valida colisiones. No calcula aún el plano de cut-off, el retorno G28 G53 ni G55; la última etapa indica la separación sin representar una longitud de corte inventada.

Validación de cálculos: `node tests/calculations.cjs`.
