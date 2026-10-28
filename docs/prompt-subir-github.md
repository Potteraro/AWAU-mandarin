# Tarea para Antigravity: subir la app de pronunciación a GitHub

Carpeta de trabajo (Windows):
`C:\Users\arnau\OneDrive\Escritorio\Documentos Drive\AWAU Mandarin\app-pronunciacion`

La URL del repositorio te la da Arnau en la misma orden con la que te pide leer este archivo
(algo como `https://github.com/USUARIO/mandarin-app.git`). El repositorio ya está creado en GitHub y está vacío.

## Qué hacer

1. Abre una terminal en la carpeta de trabajo.
2. Si no existe, crea un archivo `.gitignore` con estas líneas:
   ```
   Thumbs.db
   desktop.ini
   .DS_Store
   ```
3. Ejecuta:
   ```
   git init
   git branch -M main
   git add -A
   git commit -m "App de pronunciación de mandarín (PWA con Whisper sin conexión)"
   git remote add origin <URL que te ha dado Arnau>
   git push -u origin main
   ```
   - Si `git remote add` dice que `origin` ya existe, usa `git remote set-url origin <URL>`.
   - Si el push pide iniciar sesión en GitHub, deja que Arnau lo haga en la ventana que se abra.
4. Comprueba con `git ls-files` que están subidos, como mínimo:
   `index.html`, `sw.js`, `manifest.webmanifest`, `whisper-worker.js`, `icons/` (3 png) y
   `vendor/ort-wasm-simd-threaded.asyncify.wasm` (pesa unos 26 MB; con Git se acepta, el límite es 100 MB).

## Reglas

- **No modifiques** ningún archivo de la app (index.html, sw.js, vendor/, etc.). Solo Git y el `.gitignore`.
- **No pruebes ni abras nada en Chrome ni en ningún navegador.**
- No actives GitHub Pages: eso lo hace Arnau a mano.
- Termina solo cuando el push esté hecho y comprobado, y entonces da un resumen corto:
  URL del repositorio, número de archivos subidos, hash del commit y si hubo algún error.
