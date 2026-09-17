# Static Noise Palette

> Sistema de tokens cromáticos oscuro de alto contraste para interfaces de desarrollo.

Static Noise publica una identidad visual mediante un contrato JSON versionado. El repositorio no compila temas para herramientas concretas: cada adaptador consume un snapshot de `palette.json` desde un tag Git y decide cómo convertirlo, probarlo y publicarlo.

## Contrato de tokens

- `palette.json`: fuente canónica y único contrato de colores.
- `schemas/palette.schema.json`: esquema público del contrato.
- `docs/tokens.md`: semántica de roles y contraste.
- `docs/versioning.md`: reglas de versiones y tags.
- `docs/consumers.md`: guía para consumidores y adaptadores.

## Desarrollo

```bash
npm test
```

La suite usa Vitest y valida únicamente el contrato de Static Noise: estructura, versiones, formato hexadecimal, semántica y contraste. No requiere Ghostty, Zellij, Neovim, VS Code ni otros binarios externos.

## Artefactos legacy

`dist/` contiene snapshots congelados para consumidores que todavía están migrando. No se regeneran ni reciben nuevas funcionalidades. Los adaptadores nuevos deben consumir una versión etiquetada de `palette.json` directamente.

## Licencia

Publicado bajo la licencia MIT. Libre para uso personal, distribución y modificaciones.
