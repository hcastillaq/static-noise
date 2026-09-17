# AGENTS.md — Contexto para asistentes de IA

## Propósito

Static Noise es un contrato versionado de tokens cromáticos oscuros de alto contraste. Este repositorio no compila temas ni mantiene adaptadores para herramientas externas.

## Regla principal

Antes de cambiar colores, tokens o semántica:

1. Leer `palette.json` y `schemas/palette.schema.json`.
2. Actualizar el contrato y su documentación, no archivos de adaptadores.
3. Ejecutar `npm test`.
4. No regenerar ni modificar `dist/`: son snapshots legacy congelados.

## Fuente de verdad

- `palette.json`: tokens canónicos.
- `schemas/palette.schema.json`: contrato estructural.
- `src/validate.mjs`: validación propia del contrato.
- `docs/`: semántica, versionado y guía para consumidores.

Todo color debe ser hexadecimal de seis dígitos y conservar la semántica documentada. `borderStrong` es el borde estructural; `cyan` es foco e interacción activa.

## Responsabilidad de consumidores

Cada adaptador externo consume un snapshot de `palette.json` desde un tag Git inmutable y mantiene su propia conversión, compatibilidad, pruebas, procedencia y releases. Static Noise no conoce, lista, valida, sincroniza ni publica adaptadores.

`dist/` solo existe temporalmente para consumidores en migración. No tiene generador ni validación y no debe recibir cambios nuevos.

## Verificación

```bash
npm test
```

Vitest valida únicamente el contrato de tokens: esquema, versión, formato hexadecimal, roles semánticos y contraste. No se requieren binarios externos.

## Flujo Git

- `main` es producción; no trabajar directamente sobre ella.
- Las ramas de trabajo parten de `develop` y abren PR hacia `develop`.
- Mantener cambios pequeños y documentar cambios públicos en `README.md` y `docs/`.

## Releases

- Cambiar `palette.json`, esquema y documentación de forma coherente.
- Ejecutar `npm test`.
- Crear un tag semántico inmutable.
- No regenerar `dist/` ni despachar sincronizaciones a otros repositorios.

## Checklist

- [ ] Trabajé sobre una rama de características o `develop`.
- [ ] El cambio pertenece al contrato de tokens, no a un adaptador.
- [ ] No modifiqué `dist/` como fuente primaria.
- [ ] `npm test` pasa con Vitest.
- [ ] No hay colores inválidos ni tokens obsoletos como `borderFocus`.
- [ ] Actualicé documentación si cambió el contrato público.
- [ ] No incluí secretos ni cambios accidentales.
