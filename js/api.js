// Zugriff auf die Open-Meteo-APIs (https://open-meteo.com), kostenlos und ohne API-Key.

// Stadtname -> Ort mit Koordinaten (Geocoding)
export async function findeStadt(name) {
  const url =
    "https://geocoding-api.open-meteo.com/v1/search?count=1&language=de&format=json&name=" +
    encodeURIComponent(name);

  const antwort = await fetch(url);
  if (!antwort.ok) throw new Error("Geocoding fehlgeschlagen (HTTP " + antwort.status + ")");

  const daten = await antwort.json();
  if (!daten.results || daten.results.length === 0) {
    throw new Error(`Stadt „${name}“ nicht gefunden.`);
  }
  return daten.results[0]; // enthält name, country, latitude, longitude, ...
}

// Koordinaten -> aktuelles Wetter + 7-Tage-Vorhersage
export async function holeWetter(lat, lon) {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${lat}&longitude=${lon}` +
    "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
    "&forecast_days=7" +
    "&timezone=auto";

  const antwort = await fetch(url);
  if (!antwort.ok) throw new Error("Wetterabfrage fehlgeschlagen (HTTP " + antwort.status + ")");

  return await antwort.json(); // enthält "current" und "daily"
}
