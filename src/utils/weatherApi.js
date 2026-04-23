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

export async function geocodeCourse(courseName, country) {
  const tryGeocode = async (q) => {
    const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=en&format=json`);
    const d = await r.json();
    return d.results?.[0] ?? null;
  };
  const result = (await tryGeocode(`${courseName} ${country}`)) ?? (await tryGeocode(courseName));
  if (!result) throw new Error('Course location not found');
  return { lat: result.latitude, lng: result.longitude, geocodedName: result.name };
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
