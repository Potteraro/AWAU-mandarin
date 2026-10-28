# AWAU 中文 · App de pronunciación

App web para practicar pronunciación de mandarín en iPhone/iPad, también sin internet.

## Qué hay en la carpeta

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app entera (HTML, CSS, JS, generador de pinyin y el texto principal incrustados) |
| `sw.js` | Guarda la app en el dispositivo para que abra sin internet |
| `manifest.webmanifest` + `icons/` | Icono y nombre al añadirla a la pantalla de inicio |
| `whisper-worker.js` + `vendor/` | Reconocimiento de voz sin conexión (Whisper, transformers.js y ONNX Runtime) |
| `src/` + `build.py` | Fuentes: si cambias `src/index.template.html`, ejecuta `python build.py` para regenerar `index.html` |

## Publicarla en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `mandarin-app`), público.
2. Sube **todo el contenido de esta carpeta** con Git (Antigravity o GitHub Desktop).
   Ojo: la web de GitHub («Add file → Upload files») solo acepta archivos de hasta 25 MB y
   `vendor/ort-wasm-simd-threaded.asyncify.wasm` pesa 25,6 MB, así que por la web falla. Con Git el límite es 100 MB.
3. En el repositorio: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
4. Al cabo de un minuto estará en `https://TU-USUARIO.github.io/mandarin-app/`.

Alternativa sin Git: **Netlify Drop** (app.netlify.com/drop) y arrastrar la carpeta. Funciona igual.

## Instalar en el iPhone / iPad

1. Abre la dirección en **Safari** con wifi.
2. Compartir → **Añadir a pantalla de inicio**.
3. Abre la app desde el icono → «Descargar modelo para usar sin conexión» (Base, unos 80 MB).
4. Voz china sin internet: Ajustes → Accesibilidad → Contenido leído → Voces → Chino → descarga Tingting o Lili.
5. Reconocimiento con internet: activa Siri y Dictado.

## Cuando actualices la app

Cambia `VERSION` en `sw.js` (por ejemplo `awau-v2`) para que el iPhone descargue la versión nueva.
Los textos guardados en el dispositivo no se pierden al actualizar.

## Limitaciones

- El reconocimiento devuelve caracteres, no tonos: la puntuación mide si se entiende lo que dices, no si el tono es perfecto. Para el tono, compara de oído con «Escuchar modelo» y «Escuchar mi voz».
- Whisper transcribe al terminar de grabar (no en vivo) y en el iPhone tarda unos segundos por frase.
- En China, GitHub Pages y Hugging Face pueden no cargar: instala la app y descarga el modelo **antes** de viajar.
