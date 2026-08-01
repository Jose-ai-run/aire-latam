// Ciudades cubiertas por AireLatam. Agregar una ciudad = agregar una línea aquí.
// slug: usado en la URL. lat/lon: usados para pedir la estación AQICN más cercana.
//
// IMPORTANTE: generate.mjs descarta automáticamente cualquier ciudad cuya estación
// real más cercana esté a más de 50km (ver MAX_STATION_DISTANCE_KM), para no publicar
// el dato de otra ciudad como si fuera local. Es seguro agregar candidatos aquí aunque
// no se sepa con certeza si tienen cobertura: si no la tienen, simplemente se omiten
// (se ve una advertencia en el log de la Action, no rompe nada).
//
// Países con red de monitoreo densa confirmada: México, Colombia, Chile, Perú,
// Ecuador (zona Quito) y Brasil (sobre todo estado de São Paulo). El resto de países
// de la lista original tiene cobertura muy escasa o nula en la red pública de AQICN;
// se dejan igual por si se agregan estaciones nuevas en el futuro.
export const CITIES = [
  // --- México (buena cobertura) ---
  { slug: "ciudad-de-mexico", name: "Ciudad de México", country: "México", lat: 19.4326, lon: -99.1332 },
  { slug: "guadalajara", name: "Guadalajara", country: "México", lat: 20.6597, lon: -103.3496 },
  { slug: "monterrey", name: "Monterrey", country: "México", lat: 25.6866, lon: -100.3161 },
  { slug: "puebla", name: "Puebla", country: "México", lat: 19.0414, lon: -98.2063 },
  { slug: "toluca", name: "Toluca", country: "México", lat: 19.2926, lon: -99.6568 },
  { slug: "leon", name: "León", country: "México", lat: 21.1619, lon: -101.6921 },
  { slug: "mexicali", name: "Mexicali", country: "México", lat: 32.6245, lon: -115.4523 },
  { slug: "tijuana", name: "Tijuana", country: "México", lat: 32.5149, lon: -117.0382 },
  { slug: "ciudad-juarez", name: "Ciudad Juárez", country: "México", lat: 31.6904, lon: -106.4245 },
  { slug: "aguascalientes", name: "Aguascalientes", country: "México", lat: 21.8853, lon: -102.2916 },
  { slug: "queretaro", name: "Querétaro", country: "México", lat: 20.5888, lon: -100.3899 },
  { slug: "merida-mx", name: "Mérida", country: "México", lat: 20.9674, lon: -89.5926 },
  { slug: "hermosillo", name: "Hermosillo", country: "México", lat: 29.0729, lon: -110.9559 },
  { slug: "chihuahua", name: "Chihuahua", country: "México", lat: 28.6353, lon: -106.0889 },
  { slug: "saltillo", name: "Saltillo", country: "México", lat: 25.4232, lon: -101.0053 },
  { slug: "torreon", name: "Torreón", country: "México", lat: 25.5428, lon: -103.4068 },
  { slug: "veracruz", name: "Veracruz", country: "México", lat: 19.1738, lon: -96.1342 },
  { slug: "cuernavaca", name: "Cuernavaca", country: "México", lat: 18.9261, lon: -99.2308 },
  { slug: "san-luis-potosi", name: "San Luis Potosí", country: "México", lat: 22.1565, lon: -100.9855 },
  { slug: "morelia", name: "Morelia", country: "México", lat: 19.7008, lon: -101.1844 },

  // --- Colombia (buena cobertura) ---
  { slug: "bogota", name: "Bogotá", country: "Colombia", lat: 4.711, lon: -74.0721 },
  { slug: "medellin", name: "Medellín", country: "Colombia", lat: 6.2442, lon: -75.5812 },
  { slug: "cali", name: "Cali", country: "Colombia", lat: 3.4516, lon: -76.532 },
  { slug: "barranquilla", name: "Barranquilla", country: "Colombia", lat: 10.9639, lon: -74.7964 },
  { slug: "bucaramanga", name: "Bucaramanga", country: "Colombia", lat: 7.1193, lon: -73.1227 },
  { slug: "manizales", name: "Manizales", country: "Colombia", lat: 5.0689, lon: -75.5174 },
  { slug: "cartagena", name: "Cartagena", country: "Colombia", lat: 10.391, lon: -75.4794 },
  { slug: "cucuta", name: "Cúcuta", country: "Colombia", lat: 7.8939, lon: -72.5078 },
  { slug: "pereira", name: "Pereira", country: "Colombia", lat: 4.8087, lon: -75.6906 },
  { slug: "ibague", name: "Ibagué", country: "Colombia", lat: 4.4389, lon: -75.2322 },
  { slug: "santa-marta", name: "Santa Marta", country: "Colombia", lat: 11.2408, lon: -74.199 },

  // --- Perú ---
  { slug: "lima", name: "Lima", country: "Perú", lat: -12.0464, lon: -77.0428 },
  { slug: "callao", name: "Callao", country: "Perú", lat: -12.0566, lon: -77.1181 },
  { slug: "arequipa", name: "Arequipa", country: "Perú", lat: -16.409, lon: -71.5375 },
  { slug: "trujillo", name: "Trujillo", country: "Perú", lat: -8.1116, lon: -79.0288 },
  { slug: "cusco", name: "Cusco", country: "Perú", lat: -13.5319, lon: -71.9675 },
  { slug: "chiclayo", name: "Chiclayo", country: "Perú", lat: -6.7714, lon: -79.8409 },
  { slug: "piura", name: "Piura", country: "Perú", lat: -5.1945, lon: -80.6328 },
  { slug: "huancayo", name: "Huancayo", country: "Perú", lat: -12.0651, lon: -75.2049 },
  { slug: "iquitos", name: "Iquitos", country: "Perú", lat: -3.7437, lon: -73.2516 },
  { slug: "tacna", name: "Tacna", country: "Perú", lat: -18.0146, lon: -70.2536 },
  { slug: "ica", name: "Ica", country: "Perú", lat: -14.0678, lon: -75.7286 },
  { slug: "pucallpa", name: "Pucallpa", country: "Perú", lat: -8.3791, lon: -74.5539 },

  // --- Chile (buena cobertura, red SINCA) ---
  { slug: "santiago", name: "Santiago", country: "Chile", lat: -33.4489, lon: -70.6693 },
  { slug: "valparaiso", name: "Valparaíso", country: "Chile", lat: -33.0472, lon: -71.6127 },
  { slug: "concepcion", name: "Concepción", country: "Chile", lat: -36.8201, lon: -73.0444 },
  { slug: "rancagua", name: "Rancagua", country: "Chile", lat: -34.1708, lon: -70.7444 },
  { slug: "temuco", name: "Temuco", country: "Chile", lat: -38.7359, lon: -72.5904 },
  { slug: "antofagasta", name: "Antofagasta", country: "Chile", lat: -23.6509, lon: -70.3975 },
  { slug: "arica", name: "Arica", country: "Chile", lat: -18.4783, lon: -70.3126 },
  { slug: "iquique", name: "Iquique", country: "Chile", lat: -20.2133, lon: -70.1503 },
  { slug: "copiapo", name: "Copiapó", country: "Chile", lat: -27.3668, lon: -70.3323 },
  { slug: "coquimbo", name: "Coquimbo", country: "Chile", lat: -29.9533, lon: -71.3395 },
  { slug: "talca", name: "Talca", country: "Chile", lat: -35.4264, lon: -71.6554 },
  { slug: "chillan", name: "Chillán", country: "Chile", lat: -36.6066, lon: -72.1034 },
  { slug: "puerto-montt", name: "Puerto Montt", country: "Chile", lat: -41.4693, lon: -72.9424 },
  { slug: "punta-arenas", name: "Punta Arenas", country: "Chile", lat: -53.1638, lon: -70.9171 },

  // --- Ecuador (zona Quito con cobertura) ---
  { slug: "quito", name: "Quito", country: "Ecuador", lat: -0.1807, lon: -78.4678 },
  { slug: "guayaquil", name: "Guayaquil", country: "Ecuador", lat: -2.1894, lon: -79.8891 },
  { slug: "cuenca", name: "Cuenca", country: "Ecuador", lat: -2.9006, lon: -79.0045 },

  // --- Brasil (sobre todo estado de São Paulo) ---
  { slug: "sao-paulo", name: "São Paulo", country: "Brasil", lat: -23.5505, lon: -46.6333 },
  { slug: "campinas", name: "Campinas", country: "Brasil", lat: -22.9099, lon: -47.0626 },
  { slug: "santos", name: "Santos", country: "Brasil", lat: -23.9608, lon: -46.3336 },
  { slug: "ribeirao-preto", name: "Ribeirão Preto", country: "Brasil", lat: -21.1775, lon: -47.8103 },
  { slug: "sorocaba", name: "Sorocaba", country: "Brasil", lat: -23.5015, lon: -47.4526 },
  { slug: "rio-de-janeiro", name: "Río de Janeiro", country: "Brasil", lat: -22.9068, lon: -43.1729 },
  { slug: "brasilia", name: "Brasília", country: "Brasil", lat: -15.7939, lon: -47.8828 },
  { slug: "sao-jose-dos-campos", name: "São José dos Campos", country: "Brasil", lat: -23.2237, lon: -45.9009 },
  { slug: "jundiai", name: "Jundiaí", country: "Brasil", lat: -23.1857, lon: -46.8978 },
  { slug: "curitiba", name: "Curitiba", country: "Brasil", lat: -25.4284, lon: -49.2733 },
  { slug: "porto-alegre", name: "Porto Alegre", country: "Brasil", lat: -30.0346, lon: -51.2177 },
  { slug: "belo-horizonte", name: "Belo Horizonte", country: "Brasil", lat: -19.9167, lon: -43.9345 },

  // --- Argentina ---
  { slug: "buenos-aires", name: "Buenos Aires", country: "Argentina", lat: -34.6037, lon: -58.3816 },
  { slug: "cordoba", name: "Córdoba", country: "Argentina", lat: -31.4201, lon: -64.1888 },
  { slug: "rosario", name: "Rosario", country: "Argentina", lat: -32.9442, lon: -60.6505 },
  { slug: "mendoza", name: "Mendoza", country: "Argentina", lat: -32.8895, lon: -68.8458 },

  // --- Resto de países (cobertura hoy escasa o nula; se dejan por si aparecen estaciones) ---
  { slug: "caracas", name: "Caracas", country: "Venezuela", lat: 10.4806, lon: -66.9036 },
  { slug: "maracaibo", name: "Maracaibo", country: "Venezuela", lat: 10.6666, lon: -71.6124 },
  { slug: "la-paz", name: "La Paz", country: "Bolivia", lat: -16.5, lon: -68.1193 },
  { slug: "santa-cruz-de-la-sierra", name: "Santa Cruz de la Sierra", country: "Bolivia", lat: -17.7833, lon: -63.1821 },
  { slug: "cochabamba", name: "Cochabamba", country: "Bolivia", lat: -17.3895, lon: -66.1568 },
  { slug: "asuncion", name: "Asunción", country: "Paraguay", lat: -25.2637, lon: -57.5759 },
  { slug: "montevideo", name: "Montevideo", country: "Uruguay", lat: -34.9011, lon: -56.1645 },
  { slug: "san-jose", name: "San José", country: "Costa Rica", lat: 9.9281, lon: -84.0907 },
  { slug: "ciudad-de-panama", name: "Ciudad de Panamá", country: "Panamá", lat: 8.9824, lon: -79.5199 },
  { slug: "san-salvador", name: "San Salvador", country: "El Salvador", lat: 13.6929, lon: -89.2182 },
  { slug: "tegucigalpa", name: "Tegucigalpa", country: "Honduras", lat: 14.0723, lon: -87.1921 },
  { slug: "ciudad-de-guatemala", name: "Ciudad de Guatemala", country: "Guatemala", lat: 14.6349, lon: -90.5069 },
  { slug: "managua", name: "Managua", country: "Nicaragua", lat: 12.1364, lon: -86.2514 },
  { slug: "santo-domingo", name: "Santo Domingo", country: "República Dominicana", lat: 18.4861, lon: -69.9312 },
  { slug: "san-juan", name: "San Juan", country: "Puerto Rico", lat: 18.4655, lon: -66.1057 },
];
