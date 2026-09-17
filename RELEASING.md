# Releasing Static Noise

1. Actualiza `palette.json`, su esquema y la documentación cuando cambie el contrato.
2. Ejecuta `npm test`.
3. Publica un tag Git semántico que los adaptadores puedan fijar por tag y commit.
4. No regeneres ni publiques cambios en `dist/`; esos archivos son snapshots legacy congelados.

## Versionado

- PATCH: correcciones de documentación o validación sin cambiar el contrato de tokens.
- MINOR: nuevos tokens opcionales o metadatos compatibles.
- MAJOR: renombrar, retirar o cambiar la semántica de tokens existentes.

Static Noise no despacha eventos ni abre sincronizaciones para consumidores. Cada adaptador decide cuándo adoptar un tag y mantiene su propia procedencia, conversión, compatibilidad, pruebas y release.
