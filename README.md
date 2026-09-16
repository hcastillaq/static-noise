# Static Noise Palette

> Sistema de diseño cromático oscuro de alto contraste, calibrado para terminales modernas y editores de código.

Static Noise es una paleta oscura y profunda con acentos en tonos pastel eléctricos (Cyan, Blue, Purple, Green, Orange, Red, Yellow), diseñada para eliminar la fatiga visual y mantener una jerarquía de código cristalina tanto de día como de noche.

---

## Paleta canónica

### Colores Base

| Token         | Hex       |                                                        Muestra                                                         | Rol de interfaz                                            |
| :------------ | :-------- | :--------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------- |
| `void`        | `#0F1117` | <span style="display:inline-block;width:4rem;height:1.25rem;background-color:#0F1117;border:1px solid #3D4460"></span> | Fondos ultra-profundos, barras laterales, bordes inactivos |
| `surface`     | `#141720` | <span style="display:inline-block;width:4rem;height:1.25rem;background-color:#141720;border:1px solid #3D4460"></span> | Fondo principal del editor y la terminal                   |
| `card`        | `#1A1E2B` | <span style="display:inline-block;width:4rem;height:1.25rem;background-color:#1A1E2B;border:1px solid #3D4460"></span> | Tarjetas, líneas activas y menús flotantes                 |
| `border`      | `#272C3E` | <span style="display:inline-block;width:4rem;height:1.25rem;background-color:#272C3E;border:1px solid #3D4460"></span> | Delimitadores y bordes sutiles                             |
| `borderFocus` | `#3D4460` | <span style="display:inline-block;width:4rem;height:1.25rem;background-color:#3D4460;border:1px solid #E6E2D6"></span> | Bordes activos y selecciones                               |

### Texto

| Token        | Hex       |                                                        Muestra                                                         | Uso                               |
| :----------- | :-------- | :--------------------------------------------------------------------------------------------------------------------: | :-------------------------------- |
| `foreground` | `#E6E2D6` | <span style="display:inline-block;width:4rem;height:1.25rem;background-color:#E6E2D6;border:1px solid #3D4460"></span> | Texto principal (Warm White)      |
| `muted`      | `#9299AE` | <span style="display:inline-block;width:4rem;height:1.25rem;background-color:#9299AE;border:1px solid #3D4460"></span> | Texto secundario y etiquetas      |
| `dim`        | `#62697B` | <span style="display:inline-block;width:4rem;height:1.25rem;background-color:#62697B;border:1px solid #3D4460"></span> | Comentarios e indicadores sutiles |

### Acentos Eléctricos

| Token    | Hex       |                                                        Muestra                                                         | Semántica                                           |
| :------- | :-------- | :--------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------- |
| `cyan`   | `#72EAD5` | <span style="display:inline-block;width:4rem;height:1.25rem;background-color:#72EAD5;border:1px solid #3D4460"></span> | Cursor, foco activo, tags HTML/JSX, acento primario |
| `blue`   | `#83BFFF` | <span style="display:inline-block;width:4rem;height:1.25rem;background-color:#83BFFF;border:1px solid #3D4460"></span> | Nombres de funciones, llamadas y métodos            |
| `purple` | `#C2A7FF` | <span style="display:inline-block;width:4rem;height:1.25rem;background-color:#C2A7FF;border:1px solid #3D4460"></span> | Keywords, modificadores, almacenamiento             |
| `green`  | `#A3D98B` | <span style="display:inline-block;width:4rem;height:1.25rem;background-color:#A3D98B;border:1px solid #3D4460"></span> | Strings y literales de texto                        |
| `yellow` | `#EDD071` | <span style="display:inline-block;width:4rem;height:1.25rem;background-color:#EDD071;border:1px solid #3D4460"></span> | Tipos, clases e interfaces                          |
| `orange` | `#F3A261` | <span style="display:inline-block;width:4rem;height:1.25rem;background-color:#F3A261;border:1px solid #3D4460"></span> | Constantes, números y booleanos                     |
| `red`    | `#EF7785` | <span style="display:inline-block;width:4rem;height:1.25rem;background-color:#EF7785;border:1px solid #3D4460"></span> | Errores, alertas y caracteres eliminados            |

---

## Compilación multi-target

Este repositorio actúa como el compilador central. Leyendo el archivo `palette.json`, genera automáticamente los temas listos para usar en la carpeta `dist/`:

```bash
npm run build
```

### Targets Generados

- **Ghostty:** `dist/ghostty/static-noise`
- **Zellij:** `dist/zellij/static-noise.kdl` y `dist/zellij/layouts/default.kdl`
- **Neovim:** `dist/neovim/palette.lua`
- **VS Code:** `dist/vscode/static-noise-color-theme.json`
- **Fish/FZF:** `dist/fish/static-noise-colors.fish`
- **Starship:** `dist/starship/starship.toml` (completo)
- **Starship palette:** `dist/starship/static-noise-palette.toml`
- **Bottom:** `dist/bottom/static-noise-colors.toml`
- **Lazygit:** `dist/lazygit/static-noise-theme.yml`
- **Git Delta:** `dist/delta/static-noise.gitconfig`
- **Pi:** `dist/pi/static-noise-theme.json`
- **JSON minificado:** `dist/palette.min.json`

---

## Licencia

Publicado bajo la licencia MIT. Libre para uso personal, distribución y modificaciones.
