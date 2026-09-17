# Identidad visual y contrato de tokens

Static Noise es una identidad visual oscura, profunda y eléctrica para herramientas de desarrollo. El contrato define relaciones visuales comunes; no define botones, barras, paneles ni configuraciones de una herramienta concreta.

## Capas del contrato

El contrato sigue cuatro capas:

- `primitives`: valores visuales concretos que forman la identidad.
- `semantic`: roles transversales como superficie, contenido, outline, interacción y estado.
- `domains`: conceptos propios del trabajo de desarrollo, como sintaxis y diff.
- `projections`: representaciones de compatibilidad, actualmente ANSI.

Los tokens siguen el formato DTCG: cada token tiene `$type`, `$value` y `$description`. Un `$value` puede ser un color hexadecimal o una referencia como `{primitives.accent.cyan}`.

## Propósito visual

Static Noise evita el negro absoluto y construye profundidad con `void`, `surface` y `elevated`. El texto usa blancos cálidos y grises azulados para mantener una lectura prolongada. Los acentos son eléctricos, pero cada uno tiene una función estable para evitar una interfaz multicolor sin jerarquía.

- `cyan` concentra la atención: foco, cursor e interacción activa.
- `blue` expresa comportamiento: funciones, llamadas y métodos.
- `purple` expresa estructura del código: keywords y modificadores.
- `green` expresa texto y resultados positivos: strings, literales y éxito.
- `yellow` expresa clasificación y atención: tipos y advertencias.
- `orange` expresa valores: constantes, números y booleanos.
- `red` expresa fallo o eliminación: errores, peligro y contenido removido.
- `magenta` es un acento secundario para preprocesamiento y diferenciación.

Estos significados son parte de la identidad, no nombres de componentes. Un adaptador puede representar una función de otra manera si su herramienta lo exige, pero debe conservar la intención de `domains.syntax.function`.

## Cómo usar las capas

### Primitives

Usa `primitives` cuando necesites conocer el valor visual de la identidad o construir una referencia semántica. No uses un primitive directamente si ya existe un rol semántico equivalente.

### Semantic

Usa `semantic` para superficies y relaciones generales:

- `semantic.surface.canvas`: lienzo raíz.
- `semantic.surface.base`: superficie principal.
- `semantic.surface.elevated`: panel o contenedor elevado.
- `semantic.content.primary`, `secondary`, `muted`, `subtle`: jerarquía de texto.
- `semantic.outline.subtle` y `strong`: separación estructural.
- `semantic.interaction.focus`: atención activa.
- `semantic.status.success`, `warning`, `danger`: estados comunes.

`onX` solo aparece cuando el contrato necesita declarar el contenido sobre un fondo estable. No se crean pares por simetría para todos los colores.

### Domains

`domains.syntax` y `domains.diff` son conceptos compartidos por herramientas de desarrollo, no tokens de Neovim, VS Code o cualquier producto concreto.

- `domains.syntax.function`, `keyword`, `string`, `type`, `constant`, `preprocessor`, `error`.
- `domains.diff.added`, `addedEmphasis`, `removed`, `removedEmphasis`.

### Projections

`projections.ansi` es una traducción de compatibilidad. No es la fuente de la identidad ni debe utilizarse para inferir el significado de los primitives.

## Reglas de diseño

1. Nombrar por intención visual, no por color de herramienta o componente.
2. Añadir un token solo si su significado es común a varios consumidores.
3. Preferir referencias a primitives antes que duplicar hexadecimales.
4. Mantener el foco separado de la estructura: `interaction.focus` no reemplaza `outline.strong`.
5. No crear tokens para botones, barras, tabs, paneles, sidebars o plugins.
6. No usar color como único indicador de estado cuando el adaptador pueda añadir texto, forma o iconografía.
7. Documentar y probar cualquier nuevo rol, referencia o par de contraste.

El schema está en `schemas/palette.schema.json` y la suite del contrato se divide por propósito en `test/schema.test.mjs`, `test/semantics.test.mjs` y `test/accessibility.test.mjs`.
