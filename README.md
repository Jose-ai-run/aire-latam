# AireLatam

Sitio estático generado automáticamente con la calidad del aire (índice AQI) de 33 ciudades de Latinoamérica, usando el API público de [AQICN / World Air Quality Index Project](https://aqicn.org/api/).

## Cómo funciona

- `scripts/cities.mjs` define las ciudades cubiertas (slug, nombre, país, coordenadas).
- `scripts/generate.mjs` consulta la estación más cercana a cada ciudad y genera páginas HTML estáticas en `docs/`.
- `docs/` es publicado directamente por GitHub Pages (rama `main`, carpeta `/docs`).
- `.github/workflows/daily.yml` corre el generador todos los días y publica automáticamente si hay cambios. Cada corrida agrega una página histórica nueva por ciudad.

## Configuración necesaria (una sola vez)

1. **Token de AQICN (gratis):** pide uno en <https://aqicn.org/data-platform/token/> (llega al instante por correo). Agrégalo en GitHub como secret: `Settings → Secrets and variables → Actions → Secrets` → nombre `AQICN_TOKEN`.
2. **SITE_URL:** en la misma sección pero en la pestaña `Variables`, agrega `SITE_URL` = `https://tu-usuario.github.io/aire-latam` (sin `/` al final).

## Correr localmente

```bash
export AQICN_TOKEN=tu_token_aqui
node scripts/generate.mjs
```

## Agregar una ciudad nueva

Agrega una línea en `scripts/cities.mjs` con `slug`, `name`, `country`, `lat`, `lon`. La próxima corrida la incluye automáticamente en el ranking y le crea su propia página + histórico.
