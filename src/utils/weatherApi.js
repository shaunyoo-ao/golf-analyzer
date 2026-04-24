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

// Session-level weather cache — persists across modal opens until page reload
const _weatherCache = new Map();
const _cacheTimestamps = new Map(); // key → epoch ms when data was fetched

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

// Tier 1: Overpass API — search OSM leisure=golf_course by name (8s timeout)
async function tryOverpass(keyword) {
  const safe = keyword.replace(/["[\]\\]/g, '').trim();
  if (!safe) return null;
  const query = `[out:json][timeout:8];(way["leisure"="golf_course"]["name"~"${safe}",i];relation["leisure"="golf_course"]["name"~"${safe}",i];);out center 1;`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const r = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`, { signal: controller.signal });
    if (!r.ok) return null;
    const d = await r.json();
    const el = d.elements?.[0];
    if (!el) return null;
    const lat = el.center?.lat ?? el.lat;
    const lon = el.center?.lon ?? el.lon;
    if (!lat || !lon) return null;
    return { lat, lng: lon, geocodedName: el.tags?.name ?? keyword };
  } catch { return null; }
  finally { clearTimeout(timer); }
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

// Wrap a promise so null/undefined resolves become rejections (for Promise.any)
const nonNull = (p) => p.then((v) => { if (!v) throw null; return v; });

export async function geocodeCourse(courseName, country) {
  const keyword = extractSearchKeyword(courseName);

  // Run all tiers in parallel — first non-null result wins
  const candidates = [
    nonNull(tryOverpass(courseName)),
    nonNull(tryNominatim(`${keyword} golf ${country}`)),
    nonNull(tryNominatim(`${keyword} ${country}`)),
    nonNull(tryOpenMeteo(`${keyword} ${country}`)),
  ];
  if (keyword !== courseName) {
    candidates.splice(1, 0, nonNull(tryOverpass(keyword)));
  }

  try {
    return await Promise.any(candidates);
  } catch {
    throw new Error('Course location not found');
  }
}

// Returns { hours, fetchedAt } where fetchedAt is epoch ms of the last fetch.
export async function fetchWeather(lat, lng, date, force = false) {
  const key = `${lat},${lng},${date}`;
  if (!force && _weatherCache.has(key)) {
    return { hours: _weatherCache.get(key), fetchedAt: _cacheTimestamps.get(key) };
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,precipitation_probability,weathercode,windspeed_10m&timezone=auto&start_date=${date}&end_date=${date}`;
  const r = await fetch(url);
  const d = await r.json();
  if (!d.hourly) throw new Error('Weather data unavailable');
  const hours = d.hourly.time.map((t, i) => ({
    time: t.slice(11, 16),
    icon: wmoIcon(d.hourly.weathercode[i]),
    desc: wmoDesc(d.hourly.weathercode[i]),
    temp: d.hourly.temperature_2m[i],
    precip: d.hourly.precipitation_probability[i],
    wind: Math.round(d.hourly.windspeed_10m[i]),
  }));
  const fetchedAt = Date.now();
  _weatherCache.set(key, hours);
  _cacheTimestamps.set(key, fetchedAt);
  return { hours, fetchedAt };
}
