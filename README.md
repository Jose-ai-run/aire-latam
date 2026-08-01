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

## Monetización (opcional, se activa solo con variables)

El sitio ya tiene la lógica lista para AdSense y afiliados de Amazon — mientras no configures estas variables, el sitio funciona exactamente igual que ahora, sin anuncios ni links de afiliado.

- **AdSense:** cuando tu cuenta esté aprobada, agrega la variable `ADSENSE_CLIENT` (pestaña `Variables`) con tu ID `ca-pub-XXXXXXXXXXXXXXXX`. Se inyecta automáticamente el script y los bloques de anuncio en cada página.
- **Amazon Afiliados:** cuando tengas tu Associate Tag aprobado, agrega la variable `AMAZON_TAG` con tu tag (ej. `airelatam-20`). Aparece automáticamente una caja de productos recomendados (mascarillas/purificadores) en cada página de ciudad, con mensaje adaptado según qué tan mala esté el aire ese día.

## SEO

- `sitemap.xml` y `robots.txt` se regeneran automáticamente en cada corrida con todas las URLs vigentes.
- Cada página trae meta tags Open Graph para que se vea bien al compartirse.
- Pendiente (lo haces tú, requiere tu cuenta de Google): verificar el sitio en [Google Search Console](https://search.google.com/search-console) y enviar `https://tu-usuario.github.io/aire-latam/sitemap.xml` para acelerar la indexación.

## Correr localmente

```bash
export AQICN_TOKEN=tu_token_aqui
node scripts/generate.mjs
```

## Agregar una ciudad nueva

Agrega una línea en `scripts/cities.mjs` con `slug`, `name`, `country`, `lat`, `lon`. La próxima corrida la incluye automáticamente en el ranking y le crea su propia página + histórico.
