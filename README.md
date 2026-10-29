# Portfolio de Aitana Cantó Rico

Web estática (HTML, CSS y un poco de JavaScript), sin dependencias ni compilación.

## Verla en local

```bash
python -m http.server 8800
```

y abrir http://localhost:8800

## Cosas que se cambian en `assets/js/main.js`

- `CV_URL`: ruta del PDF del CV (por ejemplo `assets/CV-Aitana-Canto.pdf`). Mientras sea `null`, el botón no aparece.
- `LINKEDIN_URL`: dirección del perfil. Mientras sea `null`, el enlace no aparece.
- `PUBLIC_REPOS`: nombres de los repositorios que ya sean públicos. Solo esos muestran «GitHub →» en su proyecto.

La foto va en `assets/img/aitana.jpg` (vertical, 4:5). Si no existe, se ve el monograma «AC».

## Publicar en GitHub Pages

1. Crear un repositorio público llamado `aitanacanto.github.io`.
2. Subir el contenido de esta carpeta a la rama `main`.
3. En *Settings → Pages*, elegir *Deploy from a branch*, rama `main`, carpeta `/ (root)`.
4. La web queda en https://aitanacanto.github.io
