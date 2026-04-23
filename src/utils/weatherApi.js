// WMO weather code mappings
const WMO_ICONS = {
  0:'☀️',1:'🌤',2:'⛅',3:'☁️',
  45:'🌫',48:'🌫',
  51:'🌦',53:'🌦',55:'🌧',
  61:'🌧',63:'🌧',65:'🌧',
  71:'🌨',73:'🌨',75:'🌨',
  80:'🌦',81:'🌧',82:'⛈',
  95:'⛈',96:'⛈',99:'⛈',
};
const WMO_DESC = {
  0:'Clear',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',
  45:'Fog',48:'Icy fog',
  51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',
  61:'Light rain',63:'Rain',65:'Heavy rain',
  71:'Light snow',73:'Snow',75:'Heavy snow',
  80:'Showers',81:'Rain showers',82:'Heavy showers',
  95:'Thunderstorm',96:'Thunderstorm+hail',99:'Thunderstorm+hail',
};

export const wmoIcon = (c) => WMO_ICONS[c] ?? '🌡';
export const wmoDesc = (c) => WMO_DESC[c] ?? 'Unknown';

// Extract the most distinctive part of a course name for search
function extractSearchKeyword(courseName) {
  // "X at Y" → extract Y (e.g. "The Club at Steyn City" → "Steyn City")
  const atMatch = courseName.match(/\bat\s+(.+)$/i);
  if (atMatch) return atMatch[1].trim();
  // Strip generic golf/venue words
  const stripped = courseName
    .replace(/\b(the|golf|club|course|links|country|resort|estate|gc|manor|park)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return stripped.length >= 3 ? stripped : courseName;
}

// Tier 1: Overpass API — search OSM leisure=golf_course by name
async function tryOverpass(keyword) {
  const safe = keyword.replace(/["[\]\\]/g, '').trim();
  if (!safe) return null;
  const query = `[out:json][timeout:10];(way["leisure"="golf_course"]["name"~"${safe}",i];relation["leisure"="golf_course"]["name"~"${safe}",i];);out center 1;`;
  try {
    const r = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
    if (!r.ok) return null;
    const d = await r.json();
    const el = d.elements?.[0];
    if (!el) return null;
    const lat = el.center?.lat ?? el.lat;
    const lon = el.center?.lon ?? el.lon;
    if (!lat || !lon) return null;
    return { lat, lng: lon, geocodedName: el.tags?.name ?? keyword };
  } catch { return null; }
}

// Tier 2: Nominatim — general venue search
async function tryNominatim(q) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&addressdetails=0`);
    if (!r.ok) return null;
    const d = await r.json();
    if (!d[0]) return null;
    return { lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon), geocodedName: d[0].display_name.split(',')[0] };
  } catch { return null; }
}

// Tier 3: Open-Meteo — city-level fallback
async function tryOpenMeteo(q) {
  try {
    const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=en&format=json`);
    if (!r.ok) return null;
    const d = await r.json();
    if (!d.results?.[0]) return null;
    const el = d.results[0];
    return { lat: el.latitude, lng: el.longitude, geocodedName: el.name };
  } catch { return null; }
}

export async function geocodeCourse(courseName, country) {
  const keyword = extractSearchKeyword(courseName);

  // Tier 1a: Overpass with full name (exact substring match in OSM)
  const ov1 = await tryOverpass(courseName);
  if (ov1) return ov1;

  // Tier 1b: Overpass with stripped keyword (e.g. "Fancourt", "Steyn City")
  if (keyword !== courseName) {
    const ov2 = await tryOverpass(keyword);
    if (ov2) return ov2;
  }

  // Tier 2: Nominatim with keyword + country
  const nm1 = await tryNominatim(`${keyword} golf ${country}`);
  if (nm1) return nm1;

  const nm2 = await tryNominatim(`${keyword} ${country}`);
  if (nm2) return nm2;

  // Tier 3: Open-Meteo city-level fallback
  const om = await tryOpenMeteo(`${keyword} ${country}`);
  if (om) return om;

  throw new Error('Course location not found');
}

export async function fetchWeather(lat, lng, date) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,precipitation_probability,weathercode,windspeed_10m&timezone=auto&start_date=${date}&end_date=${date}`;
  const r = await fetch(url);
  const d = await r.json();
  if (!d.hourly) throw new Error('Weather data unavailable');
  return d.hourly.time.map((t, i) => ({
    time: t.slice(11, 16),
    icon: wmoIcon(d.hourly.weathercode[i]),
    desc: wmoDesc(d.hourly.weathercode[i]),
    temp: d.hourly.temperature_2m[i],
    precip: d.hourly.precipitation_probability[i],
    wind: Math.round(d.hourly.windspeed_10m[i]),
  }));
}
