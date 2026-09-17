# Publicar Static Noise

Static Noise publica un contrato de tokens, no configuraciones para herramientas.

## Publicar una versión

1. Actualiza `palette.json`, `schemas/palette.schema.json` y la documentación relacionada.
2. Ejecuta `npm test`.
3. Revisa que `dist/` no haya cambiado; sus archivos son snapshots legacy congelados.
4. Crea y publica un tag Git semántico, por ejemplo `v0.1.0`.
5. Usa el commit del tag como referencia inmutable para los consumidores.

Static Noise no despacha eventos, sincroniza repositorios ni abre PRs para adaptadores. Cada adaptador decide cuándo adoptar una versión y mantiene su propio snapshot, procedencia, conversión, compatibilidad, pruebas y release.

## Versionado del contrato

- **PATCH:** correcciones de documentación o validación sin cambiar el contrato de tokens.
- **MINOR:** nuevos tokens opcionales o metadatos compatibles.
- **MAJOR:** renombrar, retirar o cambiar la semántica de tokens existentes.

Los consumidores deben registrar el tag y el commit SHA que copiaron. Si necesitan actualizar tokens, abren el cambio dentro de su propio repositorio y ejecutan allí sus pruebas específicas.

## `dist/` legacy

`dist/` se conserva temporalmente para consumidores que aún no migraron. No se regenera, no se valida y no recibe nuevas funcionalidades. Se eliminará cuando los consumidores pendientes hayan migrado a snapshots directos de `palette.json`.
