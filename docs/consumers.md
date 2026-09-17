# Consumidores y adaptadores

Static Noise publica un vocabulario cromático común. Los proyectos externos consumen ese vocabulario y lo convierten en una experiencia concreta dentro de una herramienta.

## Consumidor frente a adaptador

Un **consumidor** es cualquier proyecto que utiliza los tokens de Static Noise.

Un **adaptador** es un consumidor que además traduce los tokens a otro formato o sistema de highlights. Por ejemplo, puede convertirlos en highlights de Neovim, colores de un editor, una configuración de terminal o estilos de una herramienta Git.

Static Noise no conoce esos proyectos. No contiene mappings por herramienta, no valida sus formatos y no decide cuándo deben actualizarse. Esta separación evita que una modificación de una integración fuerce una nueva versión del contrato común.

## Flujo de adopción

```text
Tag inmutable de Static Noise
            ↓
Snapshot local de palette.json
            ↓
Conversión propia del adaptador
            ↓
Pruebas y compatibilidad de la herramienta
            ↓
Release independiente del adaptador
```

El adaptador debe:

1. Elegir un tag de Static Noise compatible con su implementación.
2. Obtener `palette.json` desde ese tag y registrar el tag y el commit SHA.
3. Guardar el snapshot dentro de su propio repositorio.
4. Convertir los tokens según las capacidades y el formato de su herramienta.
5. Probar su salida con las versiones de herramienta que decide soportar.
6. Publicar su release sin depender del ciclo de publicación de Static Noise.

El snapshot no debe depender de una rama mutable, de una copia local del repositorio fuente ni de una descarga sin versión.

## Estructura recomendada

Cada adaptador puede organizar sus archivos de forma equivalente a esta estructura:

```text
adapter/
├── vendor/
│   └── static-noise/
│       ├── palette.json
│       └── provenance.md
├── src/                         # Conversión propia del adaptador
├── test/                        # Pruebas de la herramienta destino
└── README.md
```

`provenance.md` debe registrar al menos:

- versión o tag de Static Noise;
- commit SHA exacto;
- fecha de sincronización;
- cambios locales de representación, si existen.

El snapshot es la entrada reproducible del adaptador. No se debe editar para corregir una necesidad de la herramienta: esa decisión pertenece al código de conversión o, si expresa una nueva intención visual, al contrato de Static Noise.

## Actualizar el snapshot

Una actualización de tokens debe ser un cambio explícito dentro del repositorio consumidor:

1. Revisar el changelog y la documentación del nuevo tag.
2. Reemplazar el snapshot por el `palette.json` del tag elegido.
3. Actualizar la procedencia y revisar cambios de roles, nombres o semántica.
4. Ajustar la conversión si el contrato introdujo o retiró tokens.
5. Ejecutar las pruebas del adaptador.
6. Publicar una nueva versión del adaptador solo cuando su salida y compatibilidad estén verificadas.

Un adaptador puede permanecer en una versión anterior de Static Noise. No todas las versiones del contrato tienen que ser adoptadas inmediatamente por todos los consumidores.

## Responsabilidades del adaptador

Cada adaptador es responsable de:

- traducir roles semánticos a componentes de su herramienta;
- decidir qué hacer cuando la herramienta carece de una capacidad;
- mantener compatibilidad con sus versiones soportadas;
- probar sintaxis, carga y comportamiento visual de su salida;
- documentar la versión de tokens que consume;
- gestionar sus releases y migraciones;
- decidir cómo tratar tokens opcionales que no existían en snapshots anteriores.

## Reglas de compatibilidad

Si un adaptador consume un snapshot antiguo y aparece un token nuevo, debe mantener un comportamiento explícito: omitirlo porque es opcional, usar una representación ya existente o bloquear la actualización por incompatibilidad.

No debe inventar un color arbitrario ni cambiar el significado de otro token silenciosamente. Si la herramienta necesita una semántica que no existe en Static Noise, el adaptador debe documentar la limitación o proponer un cambio del contrato.

Un cambio específico de la herramienta debe resolverse dentro del adaptador. Solo los cambios que expresan una intención visual común a varios consumidores pertenecen a `palette.json`.
