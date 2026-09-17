# Consumidores, adaptadores y guía de integración

Static Noise publica una identidad visual cromática. Los proyectos externos consumen esa identidad y la convierten en una experiencia concreta dentro de una herramienta.

## Consumidor frente a adaptador

Un **consumidor** es cualquier proyecto que utiliza los tokens de Static Noise.

Un **adaptador** es un consumidor que traduce esos tokens a otro formato o sistema de highlights. Puede convertirlos en colores de un editor, una configuración de terminal, estilos de una herramienta Git o cualquier otra representación.

Static Noise no conoce esos proyectos. No contiene mappings por herramienta, no valida sus formatos y no decide cuándo deben actualizarse. Cada adaptador mantiene su conversión, pruebas, compatibilidad y release.

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

1. Elegir un tag compatible con su implementación.
2. Obtener `palette.json` desde ese tag y registrar el tag y el commit SHA.
3. Guardar el snapshot dentro de su propio repositorio.
4. Leer primero los roles de `semantic` y `domains`.
5. Convertirlos según las capacidades y el formato de su herramienta.
6. Crear tokens locales solo para decisiones propias de esa herramienta.
7. Probar sintaxis, carga, estados y contraste de su salida.
8. Publicar su release sin depender del ciclo de Static Noise.

El snapshot no debe depender de una rama mutable, de una copia local del repositorio fuente ni de una descarga sin versión.

## Estructura recomendada

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

- tag o versión de Static Noise;
- commit SHA exacto;
- fecha de sincronización;
- cambios locales de representación, si existen.

El snapshot es la entrada reproducible del adaptador. No se debe editar para corregir una necesidad de la herramienta: esa decisión pertenece al código de conversión o, si expresa una nueva intención visual, al contrato de Static Noise.

## Cómo razonar sobre un mapeo

Antes de elegir un token, responder:

- ¿Estoy representando una superficie, contenido, estructura, foco o estado?
- ¿Existe un token `semantic` para esa intención?
- ¿Existe un token en `domains.syntax` o `domains.diff`?
- ¿La herramienta necesita un token local porque tiene un componente que Static Noise no define?
- ¿El contraste se conserva en el fondo donde se dibuja?
- ¿El color sigue comunicando la misma intención visual?

Ejemplo: para una barra activa, usar los roles de superficie, contenido, outline e interacción disponibles y derivar localmente el estilo de la barra. No agregar `semantic.navigationBar` al núcleo.

### Cuando la herramienta no soporta un rol

- Si el rol es opcional, omitirlo de forma documentada.
- Si varios roles deben compartir una capacidad, elegir la representación más cercana y registrar la limitación.
- No sustituir silenciosamente un rol por un color arbitrario.
- No cambiar el significado de otro token para compensar una limitación.
- Si la limitación revela una necesidad común a varios consumidores, proponer un cambio del contrato.

### Cuando aparece un token nuevo

Un snapshot antiguo puede no tener un token nuevo. El adaptador debe decidir explícitamente si:

- lo omite porque es opcional;
- usa una referencia semántica existente;
- bloquea la actualización hasta implementar compatibilidad.

No debe adivinar una referencia ni modificar el snapshot para ocultar la incompatibilidad.

## Actualizar el snapshot

1. Revisar la documentación y los cambios del nuevo tag.
2. Reemplazar el snapshot por el `palette.json` elegido.
3. Actualizar `provenance.md`.
4. Revisar cambios de roles, nombres, aliases y semántica.
5. Ajustar la conversión si el contrato introdujo o retiró tokens.
6. Ejecutar las pruebas del adaptador.
7. Publicar una nueva versión solo cuando la salida y compatibilidad estén verificadas.

Un adaptador puede permanecer en una versión anterior de Static Noise. No todas las versiones del contrato deben adoptarse inmediatamente.

## Responsabilidades del adaptador

Cada adaptador es responsable de:

- traducir roles semánticos a capacidades de su herramienta;
- decidir qué hacer cuando una capacidad no existe;
- mantener compatibilidad con sus versiones soportadas;
- probar sintaxis, carga, comportamiento visual y contraste;
- documentar la versión de tokens que consume;
- gestionar releases y migraciones;
- decidir cómo tratar tokens opcionales de snapshots anteriores.

## Anti-patrones

No hacer lo siguiente:

- agregar tokens llamados `neovim`, `vscode`, `zellij`, `statusline` o `button` al contrato de Static Noise;
- copiar hexadecimales cuando existe un token aplicable;
- usar `cyan` para todos los elementos visibles solo porque es el color de la marca;
- tratar `projections.ansi` como fuente semántica;
- publicar una actualización sin registrar tag y commit del snapshot;
- cambiar el significado de un token para resolver una preferencia local.

Solo los cambios que expresan una intención visual común a varios consumidores pertenecen a `palette.json`. Las decisiones específicas de una herramienta pertenecen al adaptador.
