# ⚡ Static Noise Palette

> Sistema de diseño cromático oscuro de alto contraste, calibrado para terminales modernas y editores de código.

Static Noise es una paleta oscura y profunda con acentos en tonos pastel eléctricos (Cyan, Blue, Purple, Green, Orange, Red, Yellow), diseñada para eliminar la fatiga visual y mantener una jerarquía de código cristalina tanto de día como de noche.

---

## 🎨 Paleta Canónica

### Colores Base
| Token | Hex | Muestra | Rol de Interfaz |
| :--- | :--- | :---: | :--- |
| `void` | `#0F1117` | `⬛` | Fondos ultra-profundos, barras laterales, bordes inactivos |
| `surface` | `#141720` | `⬛` | Fondo principal del editor y la terminal |
| `card` | `#1A1E2B` | `⬛` | Tarjetas, líneas activas y menús flotantes |
| `border` | `#272C3E` | `⬛` | Delimitadores y bordes sutiles |
| `borderFocus`| `#3D4460` | `⬛` | Bordes activos y selecciones |

### Texto
| Token | Hex | Muestra | Uso |
| :--- | :--- | :---: | :--- |
| `foreground` | `#E6E2D6` | `⬜` | Texto principal (Warm White) |
| `muted` | `#9299AE` | `▫️` | Texto secundario y etiquetas |
| `dim` | `#62697B` | `▪️` | Comentarios e indicadores sutiles |

### Acentos Eléctricos
| Token | Hex | Muestra | Semántica |
| :--- | :--- | :---: | :--- |
| `cyan` | `#72EAD5` | `🩵` | Cursor, foco activo, tags HTML/JSX, acento primario |
| `blue` | `#83BFFF` | `💙` | Nombres de funciones, llamadas y métodos |
| `purple` | `#C2A7FF` | `💜` | Keywords, modificadores, almacenamiento |
| `green` | `#A3D98B` | `💚` | Strings y literales de texto |
| `yellow` | `#EDD071` | `💛` | Tipos, clases e interfaces |
| `orange` | `#F3A261` | `🧡` | Constantes, números y booleans |
| `red` | `#EF7785` | `❤️` | Errores, alertas y caracteres eliminados |

---

## 🛠️ Compilación Multi-Target

Este repositorio actúa como el compilador central. Leyendo el archivo `palette.json`, genera automáticamente los temas listos para usar en la carpeta `dist/`:

```bash
npm run build
```

### Targets Generados:
* **Ghostty:** `dist/ghostty/static-noise`
* **Zellij:** `dist/zellij/static-noise.kdl` y `dist/zellij/layouts/default.kdl`
* **Neovim:** `dist/neovim/palette.lua`
* **VS Code:** `dist/vscode/static-noise-color-theme.json`
* **Fish/FZF:** `dist/fish/static-noise-colors.fish`
* **Starship:** `dist/starship/starship.toml` (completo)
* **Starship palette:** `dist/starship/static-noise-palette.toml`
* **Bottom:** `dist/bottom/static-noise-colors.toml`
* **Lazygit:** `dist/lazygit/static-noise-theme.yml`
* **Git Delta:** `dist/delta/static-noise.gitconfig`
* **Pi:** `dist/pi/static-noise-theme.json`
* **JSON Minificado:** `dist/palette.min.json`

---

## 📄 Licencia

Publicado bajo la licencia MIT. Libre para uso personal, distribución y modificaciones.
