# Guía para autores de adaptadores

Esta guía sirve para personas y agentes de IA que convierten Static Noise en otro formato.

## Procedimiento

1. Fija una versión de Static Noise mediante un tag y commit SHA.
2. Guarda el snapshot de `palette.json` dentro del repositorio del adaptador.
3. Lee primero `semantic`; usa `primitives` solo cuando el formato destino necesite el valor base.
4. Usa `domains.syntax` para resaltado de código y `domains.diff` para cambios.
5. Traduce los roles a las capacidades reales de la herramienta.
6. Crea tokens locales solo para decisiones propias de la herramienta.
7. Prueba la sintaxis, carga, contraste y estados de la salida.

## Cómo razonar sobre un mapeo

Antes de elegir un color, responde:

- ¿Estoy representando una superficie, contenido, estructura, foco o estado?
- ¿Existe un token `semantic` para esa intención?
- ¿La herramienta necesita un token local porque tiene un componente que Static Noise no define?
- ¿El contraste se conserva en el fondo donde se dibuja?
- ¿El color sigue comunicando la misma intención que en Static Noise?

Ejemplo: para una barra de navegación activa, usa la superficie y el contenido semánticos disponibles, y deriva localmente el estilo de la barra. No agregues `semantic.navigationBar` al núcleo.

## Cuando la herramienta no soporta un rol

- Si un rol es opcional, omítelo de forma documentada.
- Si varios roles deben compartir una capacidad, elige la representación más cercana y registra la limitación.
- No sustituyas silenciosamente un rol por un color arbitrario.
- No cambies el significado de otro token para compensar la falta de una capacidad.
- Si la limitación revela una necesidad visual común a varios consumidores, propón un cambio del contrato.

## Cuando aparece un token nuevo

Un snapshot antiguo puede no tener un token nuevo. El adaptador debe decidir explícitamente si:

- lo omite porque es opcional;
- usa una referencia semántica existente;
- bloquea la actualización hasta implementar compatibilidad.

No debe adivinar una referencia ni modificar el snapshot para ocultar la incompatibilidad.

## Anti-patrones

No hagas lo siguiente:

- agregar tokens llamados `neovim`, `vscode`, `zellij`, `statusline` o `button` al contrato de Static Noise;
- copiar hexadecimales dentro del adaptador cuando existe un token aplicable;
- usar `cyan` para todos los elementos visibles porque “es el color de la marca”;
- tratar `projections.ansi` como fuente semántica;
- publicar una actualización sin registrar tag y commit del snapshot.

## Procedencia mínima

Registra en el repositorio del adaptador:

```text
Static Noise tag: v0.0.1
Static Noise commit: <sha>
Snapshot date: <YYYY-MM-DD>
```

El adaptador mantiene sus propias pruebas y releases. Static Noise no valida la salida específica de la herramienta.
