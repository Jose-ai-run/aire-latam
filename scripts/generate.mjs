// AireLatam — genera el sitio estático en /docs a partir del API de AQICN (waqi.info).
// Se ejecuta a diario vía GitHub Actions. Requiere AQICN_TOKEN (gratuito, ver README).

import { mkdir, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { CITIES } from "./cities.mjs";

const TOKEN = process.env.AQICN_TOKEN;
const SITE_URL = process.env.SITE_URL || "https://TU-USUARIO.github.io/aire-latam";
const ROOT = new URL("../docs/", import.meta.url).pathname.replace(/^\/([A-Za-z]):/, "$1:");

// Se activan solos apenas existan estas variables en GitHub (Settings > Actions > Variables).
// Mientras no existan, el sitio funciona igual mostrando el sitio ya como hoy.
const ADSENSE_CLIENT = process.env.ADSENSE_CLIENT || ""; // ej: ca-pub-1234567890123456
const AMAZON_TAG = process.env.AMAZON_TAG || ""; // ej: airelatam-20

const sitemapUrls = [];
function trackUrl(loc) {
  sitemapUrls.push(loc);
}

if (!TOKEN) {
  console.error("Falta la variable de entorno AQICN_TOKEN. Consigue un token gratis en https://aqicn.org/data-platform/token/");
  process.exit(1);
}

const CATEGORIES = [
  { max: 50, label: "Buena", color: "#009966", desc: "La calidad del aire es satisfactoria y representa poco o ningún riesgo." },
  { max: 100, label: "Moderada", color: "#a3a300", desc: "Aceptable, pero puede afectar levemente a personas inusualmente sensibles." },
  { max: 150, label: "Dañina para grupos sensibles", color: "#ff9933", desc: "Niños, adultos mayores y personas con afecciones respiratorias pueden verse afectados." },
  { max: 200, label: "Dañina", color: "#cc0033", desc: "Toda la población puede comenzar a experimentar efectos en la salud." },
  { max: 300, label: "Muy dañina", color: "#660099", desc: "Alerta sanitaria: toda la población puede verse afectada seriamente." },
  { max: Infinity, label: "Peligrosa", color: "#7e0023", desc: "Emergencia sanitaria. Toda la población tiene alta probabilidad de verse afectada." },
];

function categoryFor(aqi) {
  return CATEGORIES.find((c) => aqi <= c.max) ?? CATEGORIES[CATEGORIES.length - 1];
}

function fmt(n) {
  return typeof n === "number" ? Math.round(n) : "N/D";
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const MAX_STATION_DISTANCE_KM = 50;

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchCity(city) {
  const url = `https://api.waqi.info/feed/geo:${city.lat};${city.lon}/?token=${TOKEN}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.status !== "ok") {
    throw new Error(`${city.name}: ${JSON.stringify(json.data)}`);
  }
  const data = json.data;
  const [stationLat, stationLon] = data.city?.geo || [];
  if (typeof stationLat === "number" && typeof stationLon === "number") {
    const distanceKm = haversineKm(city.lat, city.lon, stationLat, stationLon);
    if (distanceKm > MAX_STATION_DISTANCE_KM) {
      throw new Error(
        `Sin estación cercana confiable (la más próxima, "${data.city?.name}", está a ${Math.round(distanceKm)}km — se omite para no publicar datos engañosos)`
      );
    }
  }
  return data;
}

function adsenseHead() {
  if (!ADSENSE_CLIENT) return "";
  return `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}" crossorigin="anonymous"></script>`;
}

function adSlot() {
  if (!ADSENSE_CLIENT) return "";
  return `<ins class="adsbygoogle" style="display:block;margin:1.5rem 0" data-ad-client="${ADSENSE_CLIENT}" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`;
}

function affiliateBox(cat) {
  if (!AMAZON_TAG) return "";
  const urgent = cat && cat.max <= 100 ? false : true;
  const heading = urgent ? "El aire no está del todo limpio hoy — protégete" : "Recomendados para monitorear el aire en casa";
  const items = urgent
    ? [
        ["Mascarillas N95/KN95", "mascarillas+n95"],
        ["Purificador de aire para interiores", "purificador+de+aire"],
      ]
    : [
        ["Monitor de calidad del aire para el hogar", "monitor+calidad+del+aire"],
        ["Purificador de aire para interiores", "purificador+de+aire"],
      ];
  const links = items
    .map(([label, kw]) => `<li><a href="https://www.amazon.com/s?k=${kw}&tag=${AMAZON_TAG}" target="_blank" rel="noopener sponsored">${label}</a></li>`)
    .join("\n");
  return `<aside style="margin:2rem 0;padding:1rem;border:1px solid #eee;border-radius:8px;background:#fafafa">
<p style="margin:0 0 .5rem;font-weight:600">${heading}</p>
<ul style="margin:0">${links}</ul>
<p class="muted" style="margin:.5rem 0 0">Enlaces de afiliado: podemos ganar una comisión sin costo extra para ti.</p>
</aside>`;
}

function layout({ title, description, canonical, body, ogType = "website" }) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="AireLatam">
<meta name="twitter:card" content="summary">
${adsenseHead()}
<style>
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:820px;margin:0 auto;padding:24px;line-height:1.55;color:#1a1a1a}
  h1{font-size:1.5rem} h2{font-size:1.15rem;margin-top:2rem}
  table{width:100%;border-collapse:collapse;margin:1rem 0}
  th,td{text-align:left;padding:7px 10px;border-bottom:1px solid #ddd;font-size:.95rem}
  .rate{font-size:2.5rem;font-weight:700}
  .badge{display:inline-block;padding:3px 10px;border-radius:999px;color:#fff;font-size:.85rem;font-weight:600}
  .muted{color:#666;font-size:.85rem}
  a{color:#0a6cb8;text-decoration:none} a:hover{text-decoration:underline}
  nav{margin-bottom:1.5rem;font-size:.9rem}
  footer{margin-top:3rem;font-size:.8rem;color:#888;border-top:1px solid #eee;padding-top:1rem}
  .grid{display:grid;grid-template-columns:1fr;gap:6px}
</style>
</head>
<body>
<nav><a href="${SITE_URL}/">Inicio</a> &middot; <a href="${SITE_URL}/guia/">Guía del índice AQI</a></nav>
${body}
<footer>Datos: <a href="https://aqicn.org" target="_blank" rel="noopener">World Air Quality Index Project (AQICN)</a>, agregados de estaciones oficiales de monitoreo. Este sitio es informativo y no reemplaza fuentes oficiales de salud pública.</footer>
</body>
</html>`;
}

async function buildCityPage(city, data) {
  const cat = categoryFor(data.aqi);
  const dir = path.join(ROOT, city.slug);
  await mkdir(dir, { recursive: true });

  const iaqi = data.iaqi || {};
  const pollutantRows = Object.entries({
    "PM2.5": iaqi.pm25?.v,
    PM10: iaqi.pm10?.v,
    "Ozono (O3)": iaqi.o3?.v,
    "Dióxido de nitrógeno (NO2)": iaqi.no2?.v,
    "Dióxido de azufre (SO2)": iaqi.so2?.v,
    "Monóxido de carbono (CO)": iaqi.co?.v,
  })
    .filter(([, v]) => typeof v === "number")
    .map(([label, v]) => `<tr><td>${label}</td><td>${v}</td></tr>`)
    .join("\n");

  const body = `
<h1>Calidad del Aire en ${city.name} Hoy</h1>
<p class="rate">${fmt(data.aqi)} <span class="badge" style="background:${cat.color}">${cat.label}</span></p>
<p class="muted">Estación: ${data.city?.name || city.name} · Actualizado: ${data.time?.s || "N/D"} (hora local de la estación)</p>
<p>${cat.desc}</p>
<h2>Contaminantes medidos</h2>
<table>
<thead><tr><th>Contaminante</th><th>Índice</th></tr></thead>
<tbody>${pollutantRows || "<tr><td colspan=2>Sin desglose disponible en este momento</td></tr>"}</tbody>
</table>
<h2>Histórico</h2>
<p><a href="${SITE_URL}/${city.slug}/historial/">Ver registro diario de calidad del aire en ${city.name} &rarr;</a></p>
<p class="muted"><a href="${SITE_URL}/guia/">¿Qué significa el índice AQI y cómo protegerte?</a></p>
${affiliateBox(cat)}
${adSlot()}`;

  const canonical = `${SITE_URL}/${city.slug}/`;
  await writeFile(
    path.join(dir, "index.html"),
    layout({
      title: `Calidad del Aire en ${city.name} Hoy — Índice AQI en Vivo`,
      description: `Índice de calidad del aire (AQI) en ${city.name}, ${city.country}, actualizado hoy: ${fmt(data.aqi)} (${cat.label}). Desglose de contaminantes e histórico diario.`,
      canonical,
      body,
    })
  );
  trackUrl(canonical);

  return cat;
}

async function buildCityHistorialDay(city, data, cat) {
  const date = todayISO();
  const dir = path.join(ROOT, city.slug, "historial", date);
  await mkdir(dir, { recursive: true });
  const body = `
<h1>Calidad del Aire en ${city.name} el ${date}</h1>
<p class="rate">${fmt(data.aqi)} <span class="badge" style="background:${cat.color}">${cat.label}</span></p>
<p>${cat.desc}</p>
<p><a href="${SITE_URL}/${city.slug}/">Ver calidad del aire de hoy en ${city.name} &rarr;</a></p>
<p><a href="${SITE_URL}/${city.slug}/historial/">Ver todo el histórico de ${city.name} &rarr;</a></p>`;
  const canonical = `${SITE_URL}/${city.slug}/historial/${date}/`;
  await writeFile(
    path.join(dir, "index.html"),
    layout({
      title: `Calidad del Aire en ${city.name} el ${date} — AQI ${fmt(data.aqi)}`,
      description: `Registro histórico de calidad del aire en ${city.name} el ${date}: índice AQI ${fmt(data.aqi)} (${cat.label}).`,
      canonical,
      body,
    })
  );
  trackUrl(canonical);
}

async function buildCityHistorialIndex(city) {
  const dir = path.join(ROOT, city.slug, "historial");
  await mkdir(dir, { recursive: true });
  let entries = [];
  try {
    entries = (await readdir(dir, { withFileTypes: true }))
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort()
      .reverse();
  } catch {
    entries = [];
  }
  const items = entries
    .map((date) => `<li><a href="${SITE_URL}/${city.slug}/historial/${date}/">${date}</a></li>`)
    .join("\n");
  const body = `
<h1>Histórico de Calidad del Aire en ${city.name}</h1>
<p>Registro día por día del índice AQI en ${city.name}, ${city.country}.</p>
<ul>${items}</ul>
<p><a href="${SITE_URL}/${city.slug}/">Ver cotización de hoy &rarr;</a></p>`;
  const canonical = `${SITE_URL}/${city.slug}/historial/`;
  await writeFile(
    path.join(dir, "index.html"),
    layout({
      title: `Histórico Calidad del Aire en ${city.name} — Todas las Fechas`,
      description: `Archivo histórico día por día del índice de calidad del aire (AQI) en ${city.name}.`,
      canonical,
      body,
    })
  );
  trackUrl(canonical);
}

function slugifyCountry(name) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function buildCountryPages(results) {
  const byCountry = new Map();
  for (const r of results) {
    const list = byCountry.get(r.city.country) || [];
    list.push(r);
    byCountry.set(r.city.country, list);
  }

  for (const [country, list] of byCountry) {
    const slug = slugifyCountry(country);
    const dir = path.join(ROOT, "pais", slug);
    await mkdir(dir, { recursive: true });
    const ranked = list.slice().sort((a, b) => b.aqi - a.aqi);
    const rows = ranked
      .map(
        (r) =>
          `<tr><td><a href="${SITE_URL}/${r.city.slug}/">${r.city.name}</a></td><td>${fmt(r.aqi)}</td><td><span class="badge" style="background:${r.cat.color}">${r.cat.label}</span></td></tr>`
      )
      .join("\n");
    const body = `
<h1>Calidad del Aire en ${country} — Todas las Ciudades</h1>
<p>Índice de calidad del aire (AQI) actualizado hoy para ${ranked.length} ciudades de ${country}.</p>
<table>
<thead><tr><th>Ciudad</th><th>AQI</th><th>Categoría</th></tr></thead>
<tbody>${rows}</tbody>
</table>
<p><a href="${SITE_URL}/">Ver ranking completo de Latinoamérica &rarr;</a></p>`;
    const canonical = `${SITE_URL}/pais/${slug}/`;
    await writeFile(
      path.join(dir, "index.html"),
      layout({
        title: `Calidad del Aire en ${country} Hoy — Todas las Ciudades`,
        description: `Índice de calidad del aire (AQI) hoy en ${ranked.length} ciudades de ${country}, actualizado a diario.`,
        canonical,
        body,
      })
    );
    trackUrl(canonical);
  }
}

async function buildHomepage(results) {
  const ranked = results.slice().sort((a, b) => b.aqi - a.aqi);
  const rows = ranked
    .map(
      (r) =>
        `<tr><td><a href="${SITE_URL}/${r.city.slug}/">${r.city.name}</a>, <a href="${SITE_URL}/pais/${slugifyCountry(r.city.country)}/">${r.city.country}</a></td><td>${fmt(r.aqi)}</td><td><span class="badge" style="background:${r.cat.color}">${r.cat.label}</span></td></tr>`
    )
    .join("\n");

  const body = `
<h1>AireLatam — Calidad del Aire en Tiempo Real en Latinoamérica</h1>
<p>Índice de calidad del aire (AQI) actualizado a diario para ${results.length} ciudades de América Latina, con datos de estaciones oficiales de monitoreo.</p>
<h2>Ranking de hoy (de peor a mejor)</h2>
<table>
<thead><tr><th>Ciudad</th><th>AQI</th><th>Categoría</th></tr></thead>
<tbody>${rows}</tbody>
</table>
<p class="muted">Actualizado: ${new Date().toISOString()}</p>
${adSlot()}`;

  const canonical = `${SITE_URL}/`;
  await writeFile(
    path.join(ROOT, "index.html"),
    layout({
      title: "AireLatam — Calidad del Aire Hoy en Ciudades de Latinoamérica",
      description: `Índice de calidad del aire (AQI) en tiempo real para ${results.length} ciudades de Latinoamérica: México, Colombia, Perú, Chile, Argentina, Brasil y más.`,
      canonical,
      body,
    })
  );
  trackUrl(canonical);
}

async function buildGuia() {
  const dir = path.join(ROOT, "guia");
  await mkdir(dir, { recursive: true });
  const rows = CATEGORIES.map(
    (c, i) =>
      `<tr><td>${i === 0 ? "0" : CATEGORIES[i - 1].max + 1}–${c.max === Infinity ? "300+" : c.max}</td><td><span class="badge" style="background:${c.color}">${c.label}</span></td><td>${c.desc}</td></tr>`
  ).join("\n");

  const body = `
<h1>Guía: ¿Qué es el Índice de Calidad del Aire (AQI)?</h1>
<p>El AQI (Air Quality Index) es una escala estandarizada, usada internacionalmente, que traduce la concentración de distintos contaminantes del aire (PM2.5, PM10, ozono, dióxido de nitrógeno, dióxido de azufre y monóxido de carbono) en un solo número fácil de interpretar.</p>
<p>AireLatam usa la escala de la Agencia de Protección Ambiental de EE.UU. (EPA), el estándar más usado a nivel mundial, aplicada a datos de estaciones de monitoreo reales en cada ciudad.</p>
<h2>Escala de categorías</h2>
<table>
<thead><tr><th>Rango</th><th>Categoría</th><th>Qué significa</th></tr></thead>
<tbody>${rows}</tbody>
</table>
<h2>¿Cómo protegerte cuando el aire está mal?</h2>
<ul>
<li>Evita actividad física intensa al aire libre cuando el AQI supere 100.</li>
<li>Usa mascarillas con filtro (N95/KN95) si necesitas salir con AQI alto.</li>
<li>Mantén ventanas cerradas y considera un purificador de aire en interiores durante picos de contaminación.</li>
<li>Los grupos sensibles (niños, adultos mayores, personas con asma o enfermedades respiratorias) deben tomar precauciones desde niveles "Dañino para grupos sensibles".</li>
</ul>
<p><a href="${SITE_URL}/">Ver calidad del aire hoy en tu ciudad &rarr;</a></p>`;

  const canonical = `${SITE_URL}/guia/`;
  await writeFile(
    path.join(dir, "index.html"),
    layout({
      title: "¿Qué es el Índice de Calidad del Aire (AQI)? Guía Completa",
      description: "Guía completa sobre el índice de calidad del aire (AQI): qué significan sus categorías y cómo protegerte de la contaminación.",
      canonical,
      body,
    })
  );
  trackUrl(canonical);
}

async function main() {
  await mkdir(ROOT, { recursive: true });

  const results = [];
  for (const city of CITIES) {
    try {
      const data = await fetchCity(city);
      const cat = await buildCityPage(city, data);
      await buildCityHistorialDay(city, data, cat);
      await buildCityHistorialIndex(city);
      results.push({ city, aqi: data.aqi, cat });
      // Respeta límites del API gratuito (1000 req/min es el límite real, pero somos buenos ciudadanos)
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.warn(`Error con ${city.name}:`, err.message);
    }
  }

  await buildHomepage(results);
  await buildCountryPages(results);
  await buildGuia();
  await buildSitemapAndRobots();

  console.log(`Sitio generado. ${results.length}/${CITIES.length} ciudades actualizadas correctamente.`);
}

async function buildSitemapAndRobots() {
  const today = todayISO();
  const urls = sitemapUrls
    .map((loc) => `<url><loc>${loc}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  await writeFile(path.join(ROOT, "sitemap.xml"), xml);

  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  await writeFile(path.join(ROOT, "robots.txt"), robots);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
