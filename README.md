# Static Noise

Static Noise es una identidad visual cromática para herramientas de desarrollo.

Fue creada para resolver un problema concreto: los entornos de terminal y los editores suelen acumular fondos negros, grises y acentos saturados sin una jerarquía común. Static Noise propone una superficie oscura, cálida y profunda, con acentos eléctricos de baja fatiga visual y suficiente contraste para distinguir estructura, foco, sintaxis y estados.

El proyecto publica un contrato de tokens. No genera configuraciones para herramientas concretas. Cada adaptador consume una versión de `palette.json` y decide cómo representar esa identidad dentro de sus propias capacidades.

![Guía visual de Static Noise](docs/palette-preview.svg)

## Identidad visual

Static Noise se basa en cinco principios:

1. **Profundidad sin negro absoluto.** El lienzo parte de `void` y construye superficies progresivas con `surface` y `card`, evitando que toda la interfaz se convierta en una sola masa negra.
2. **Foco eléctrico.** `cyan` identifica el cursor, el foco activo y la interacción principal. Es un color de atención, no un relleno decorativo permanente.
3. **Jerarquía cálida.** El texto principal usa blancos cálidos para reducir la dureza de los fondos fríos y conservar legibilidad prolongada.
4. **Semántica estable.** Los acentos tienen funciones consistentes: azul para funciones, púrpura para keywords, verde para strings, amarillo para tipos, naranja para constantes y rojo para errores.
5. **Estructura neutral.** Los bordes y separadores delimitan la interfaz sin competir con el foco. `borderStrong` está reservado para límites estructurales que deben seguir visibles en fondos oscuros o transparentes.

La paleta está pensada para personas que pasan muchas horas alternando entre terminales, editores, multiplexores, herramientas Git y asistentes de desarrollo. Su objetivo no es maximizar el número de colores, sino hacer que cada color comunique algo distinto.

## Contrato de tokens

- `palette.json` es la fuente canónica.
- `schemas/palette.schema.json` define la estructura válida.
- `docs/tokens.md` explica la identidad, los roles y las reglas de uso.
- `docs/consumers.md` explica cómo crear adaptadores independientes.
- `RELEASING.md` define versionado y publicación.

## Uso de los colores

Los adaptadores deben mapear los tokens por intención, no por coincidencia superficial de nombres:

| Necesidad visual | Token recomendado |
| --- | --- |
| Lienzo o fondo raíz | `colors.base.void` |
| Superficie de aplicación | `colors.base.surface` |
| Panel, tarjeta o popup | `colors.base.card` |
| Separador sutil | `colors.base.border` |
| Límite estructural | `colors.base.borderStrong` |
| Cursor o elemento enfocado | `colors.accents.cyan` |
| Texto principal | `colors.text.foreground` |
| Texto secundario | `colors.text.soft` o `colors.text.muted` |
| Funciones y métodos | `colors.accents.blue` |
| Keywords y modificadores | `colors.accents.purple` |
| Strings y literales | `colors.accents.green` |
| Tipos e interfaces | `colors.accents.yellow` |
| Constantes y números | `colors.accents.orange` |
| Errores y eliminaciones | `colors.accents.red` |

Las variantes de `colors.dim` sirven para estados secundarios del mismo acento. `colors.diff` se reserva para representar cambios añadidos y eliminados. No se deben introducir colores arbitrarios dentro de un adaptador para resolver una diferencia visual local; primero hay que decidir si la necesidad pertenece al contrato común o únicamente a la herramienta.

## Desarrollo

```bash
npm test
```

La suite usa Vitest y valida únicamente el contrato de Static Noise: estructura, roles, versiones, formato hexadecimal y contraste. No requiere Ghostty, Zellij, Neovim, VS Code ni otros binarios externos.

## Artefactos legacy

`dist/` contiene snapshots congelados para consumidores que todavía están migrando. No se regeneran ni reciben nuevas funcionalidades. Los adaptadores nuevos deben consumir una versión etiquetada de `palette.json` directamente.

## Licencia

Publicado bajo la licencia MIT. Libre para uso personal, distribución y modificaciones.
