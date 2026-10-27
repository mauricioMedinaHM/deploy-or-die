# DEPLOY OR DIE

Demo web de supervivencia corporativa, en español, con estética pixel art.

## Jugar

[Abrir la demo](https://deploy-or-die-demo.freshfrost9.chatgpt.site)

Incluye dos escenarios: Friday Deploy y The AI Intern. Cada partida tiene tres decisiones, un temporizador, estrés, reputación y distintos finales.

La ayuda de IA usa respuestas predefinidas. No llama a la API de ChatGPT ni requiere claves.

## Ejecutar localmente

Desde la carpeta del proyecto:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Abrí http://127.0.0.1:4173 en tu navegador. No requiere instalar dependencias.

## Archivos

- `dist/index.html`: estructura de la página.
- `dist/styles.css`: diseño y adaptación a dispositivos.
- `dist/app.js`: escenarios, respuestas simuladas y lógica del juego.
