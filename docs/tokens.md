# Identidad visual y contrato de tokens

## Propósito

Static Noise fue creada para dar una identidad común a entornos de desarrollo que normalmente se configuran por separado. Terminal, editor, multiplexor, herramienta Git y asistente pueden tener componentes distintos, pero todos necesitan expresar las mismas relaciones: qué es el fondo, qué está elevado, qué tiene foco, qué es estructura y qué representa un estado.

El contrato no intenta dictar la apariencia exacta de cada herramienta. Define la intención visual que un adaptador debe conservar.

## Identidad visual

Static Noise es oscura, profunda y eléctrica, pero no está construida alrededor del negro puro. `void`, `surface` y `card` crean una progresión de profundidad para que un panel pueda diferenciarse del lienzo sin recurrir a bordes pesados.

El texto usa blancos cálidos y grises azulados. Los acentos son pastel eléctricos: suficientemente luminosos para destacar sobre superficies oscuras, pero asignados a funciones concretas para evitar una interfaz multicolor sin jerarquía.

El cyan representa atención inmediata. Los demás acentos representan categorías semánticas. Los bordes son neutrales y existen para explicar estructura, no para competir con el foco.

La paleta está diseñada para uso prolongado en herramientas de desarrollo. Prioriza reconocimiento rápido, separación entre estados y consistencia entre superficies antes que saturación o decoración.

## Modelo de profundidad

| Nivel | Token | Uso |
| --- | --- | --- |
| Lienzo | `colors.base.void` | Fondo raíz o área que puede heredar transparencia del terminal. |
| Superficie | `colors.base.surface` | Área principal de una aplicación o panel estable. |
| Elevación | `colors.base.card` | Tarjetas, menús, popups, powerbars y elementos que deben separarse del lienzo. |
| Elevación activa | `colors.base.cardHover` | Estado elevado bajo interacción o hover. |

Un adaptador puede omitir un nivel cuando la herramienta no permite fondos separados. En ese caso debe conservar la jerarquía mediante bordes y texto, no inventar un color nuevo.

## Modelo semántico

### Estructura y foco

- `colors.base.border`: delimitador sutil.
- `colors.base.borderStrong`: límite estructural, separador principal o borde de pane.
- `colors.accents.cyan`: cursor, foco activo, selección de acción e interacción principal.
- `colors.base.selection`: selección neutral que no implica foco activo.

`borderStrong` y `cyan` tienen funciones diferentes. El primero explica la estructura permanente; el segundo indica dónde está la atención del usuario.

### Texto

- `colors.text.foreground`: texto principal y contenido que debe leerse sin esfuerzo.
- `colors.text.soft`: texto secundario con presencia normal.
- `colors.text.muted`: etiquetas, metadatos y contenido auxiliar.
- `colors.text.dim`: comentarios, estados inactivos y detalles de baja prioridad.

### Sintaxis y estados

- `blue`: funciones, llamadas y métodos.
- `purple`: keywords, modificadores y almacenamiento.
- `green`: strings y literales de texto.
- `yellow`: tipos, clases e interfaces.
- `orange`: constantes, números y booleanos.
- `red`: errores, alertas y elementos eliminados.
- `magenta`: preprocesamiento y acento adicional.

Las variantes en `colors.dim` reducen la intensidad sin cambiar el significado. `colors.diff` expresa cambios añadidos y eliminados; no sustituye los colores semánticos de sintaxis.

## Reglas para adaptadores

1. Mapear por intención visual, no por nombre de componente.
2. Mantener `cyan` para foco e interacción, no para todos los elementos activos o estructurales.
3. Usar `borderStrong` para estructura que debe seguir visible en fondos oscuros o transparentes.
4. Mantener el contraste y la jerarquía aunque la herramienta no soporte todas las superficies.
5. No agregar colores hexadecimales locales al adaptador sin una necesidad semántica documentada.
6. Tratar cualquier token no reconocido como una incompatibilidad del contrato, no como permiso para adivinar un reemplazo.

La estructura formal se valida con `schemas/palette.schema.json`. Las invariantes semánticas se prueban con `npm test`.
