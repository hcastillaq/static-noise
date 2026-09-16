# AGENTS.md — Contexto para asistentes de IA

## Propósito del proyecto

**Static Noise** es un sistema de diseño cromático oscuro de alto contraste. Mantiene una paleta canónica y la compila a configuraciones para terminales, editores y herramientas de desarrollo.

El repositorio principal es un **compilador de temas multi-target**: la fuente de verdad es `palette.json` y los artefactos consumibles se generan en `dist/`.

## Regla principal para la IA

Antes de cambiar cualquier color, token, nombre o semántica:

1. Leer `palette.json`.
2. Revisar las plantillas afectadas en `templates/`.
3. Actualizar la fuente (`palette.json`) o la plantilla correspondiente, nunca únicamente un archivo generado.
4. Ejecutar `npm run build`.
5. Verificar que los cambios generados en `dist/` sean los esperados.

No editar manualmente archivos de `dist/`: son artefactos derivados y se sobrescriben durante la compilación.

## Fuente de verdad: `palette.json`

La estructura actual es:

- `colors.base`: fondos, superficies, tarjetas, bordes y selección.
- `colors.text`: texto principal, suave, atenuado y tenue.
- `colors.accents`: colores semánticos eléctricos.
- `colors.dim`: variantes oscuras de los acentos.
- `colors.diff`: colores para líneas añadidas/eliminadas y sus énfasis.
- `ansi`: colores ANSI normales y brillantes.

Colores base principales:

- `void`: `#0F1117`
- `surface`: `#141720`
- `card`: `#1A1E2B`
- `border`: `#272C3E`
- `borderFocus`: `#3D4460`
- `foreground`: `#E6E2D6`
- `muted`: `#9299AE`
- `dim`: `#62697B`

Acentos y semántica:

- `cyan`: foco, cursor y acento primario.
- `blue`: funciones, llamadas y métodos.
- `purple`: keywords, modificadores y almacenamiento.
- `green`: strings y literales de texto.
- `yellow`: tipos, clases e interfaces.
- `orange`: constantes, números y booleanos.
- `red`: errores, alertas y elementos eliminados.
- `magenta`: acento adicional, incluido ANSI bright magenta.

Conservar la semántica y el contraste al introducir o modificar tokens. Evitar agregar colores arbitrarios que no estén justificados por una necesidad semántica.

## Arquitectura

- `palette.json`: metadatos y tokens canónicos.
- `templates/*.template`: plantillas por producto/formato. Usan placeholders `{{ruta.anidada}}`.
- `src/build.js`: compilador Node.js sin dependencias externas.
- `dist/`: archivos generados y publicados.
- `README.md`: documentación pública y tabla de colores.
- `RELEASING.md`: proceso de publicación y sincronización.
- `.github/workflows/verify.yml`: recompila y falla si `dist/` no está actualizado.
- `.github/workflows/dispatch-vscode.yml`: sincroniza el artefacto de VS Code al crear tags `v*`.
- `.github/workflows/dispatch-neovim.yml`: sincroniza el artefacto de Neovim al crear tags `v*`.

## Targets generados

`src/build.js` genera:

- Ghostty: `dist/ghostty/static-noise`
- Zellij: `dist/zellij/static-noise.kdl` y `dist/zellij/layouts/default.kdl`
- Neovim: `dist/neovim/palette.lua`
- VS Code: `dist/vscode/static-noise-color-theme.json`
- Fish/FZF: `dist/fish/static-noise-colors.fish`
- Starship: `dist/starship/starship.toml` y `dist/starship/static-noise-palette.toml`
- Bottom: `dist/bottom/static-noise-colors.toml`
- Lazygit: `dist/lazygit/static-noise-theme.yml`
- Git Delta: `dist/delta/static-noise.gitconfig`
- Pi: `dist/pi/static-noise-theme.json`
- JSON minificado: `dist/palette.min.json`

El compilador además valida que no queden placeholders `{{...}}` y que los targets JSON sean JSON válido.

## Flujo de trabajo esperado

### Cambios de paleta o temas

```bash
npm run build
git diff -- palette.json templates/ dist/
```

Si se modifica `palette.json`, deben incluirse en el mismo cambio los artefactos regenerados de `dist/`. Si se modifica una plantilla, revisar el target completo y regenerar todos los artefactos.

### Verificación

No hay suite de tests dedicada actualmente. La verificación canónica es:

```bash
npm run build
git diff --exit-code -- dist
```

El segundo comando se ejecuta después de compilar en CI y confirma que el contenido generado está committed.

### Releases

- Cambiar `palette.json`.
- Ejecutar `npm run build`.
- Committear fuente y `dist/` juntos.
- Crear y publicar un tag compatible, por ejemplo `v0.0.1`.
- La versión inicial `v0.0.1` es un bootstrap para VS Code y Neovim.
- Releases posteriores incrementan el PATCH de los consumidores.
- Las sincronizaciones usan `STATIC_NOISE_SYNC_TOKEN`; nunca exponer ni hardcodear secretos.

## Convenciones de implementación

- Usar Node.js moderno y APIs nativas; el proyecto no requiere dependencias de runtime.
- Mantener cambios pequeños y enfocados.
- Respetar el formato existente de cada target y de cada plantilla.
- Usar nombres de tokens consistentes con la jerarquía de `palette.json`.
- No introducir lógica específica de un target en `palette.json`; la semántica común va en la paleta y la representación específica va en su plantilla.
- No modificar workflows, proceso de release o artefactos publicados sin revisar sus efectos en los repositorios consumidores.
- Documentar en `README.md` los tokens públicos o cambios de semántica relevantes.

## Checklist para asistentes de IA

- [ ] Identifiqué la fuente de verdad y los targets afectados.
- [ ] No edité `dist/` como fuente primaria.
- [ ] Ejecuté `npm run build`.
- [ ] No quedaron placeholders sin resolver.
- [ ] Los JSON generados son válidos.
- [ ] `git diff --exit-code -- dist` pasa después de compilar.
- [ ] Revisé que el contraste y la semántica de los colores no se hayan degradado.
- [ ] Actualicé documentación si cambió la API o semántica pública.
- [ ] No incluí secretos ni cambios accidentales.
