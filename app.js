// Wetter-App: Stadt eingeben -> Koordinaten ermitteln -> aktuelles Wetter anzeigen.
// Datenquelle: Open-Meteo (https://open-meteo.com), kostenlos und ohne API-Key.

const form = document.getElementById("cityForm");
const input = document.getElementById("cityInput");
const output = document.getElementById("weatherInfo");

// WMO-Wettercodes (liefert Open-Meteo) -> Text und Symbol
const WETTERCODES = {
  0: ["Klar", "☀️"],
  1: ["Überwiegend klar", "🌤️"],
  2: ["Teilweise bewölkt", "⛅"],
  3: ["Bedeckt", "☁️"],
  45: ["Nebel", "🌫️"],
  48: ["Nebel mit Reif", "🌫️"],
  51: ["Leichter Nieselregen", "🌦️"],
  53: ["Nieselregen", "🌦️"],
  55: ["Starker Nieselregen", "🌧️"],
  61: ["Leichter Regen", "🌦️"],
  63: ["Regen", "🌧️"],
  65: ["Starker Regen", "🌧️"],
  71: ["Leichter Schneefall", "🌨️"],
  73: ["Schneefall", "🌨️"],
  75: ["Starker Schneefall", "❄️"],
  80: ["Leichte Regenschauer", "🌦️"],
  81: ["Regenschauer", "🌧️"],
  82: ["Heftige Regenschauer", "⛈️"],
  95: ["Gewitter", "⛈️"],
  96: ["Gewitter mit Hagel", "⛈️"],
  99: ["Schweres Gewitter mit Hagel", "⛈️"],
};

// 1. Stadtname -> Koordinaten (Geocoding)
async function findeStadt(name) {
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

// 2. Koordinaten -> aktuelles Wetter
async function holeWetter(lat, lon) {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${lat}&longitude=${lon}` +
    "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m" +
    "&timezone=auto";

  const antwort = await fetch(url);
  if (!antwort.ok) throw new Error("Wetterabfrage fehlgeschlagen (HTTP " + antwort.status + ")");

  const daten = await antwort.json();
  return daten.current;
}

// 3. Ergebnis ins HTML schreiben
function zeigeWetter(ort, wetter) {
  const [text, symbol] = WETTERCODES[wetter.weather_code] ?? ["Unbekannt", "❔"];

  output.innerHTML = `
    <h2>${ort.name}, ${ort.country ?? ""}</h2>
    <div class="symbol">${symbol}</div>
    <div class="temperatur">${Math.round(wetter.temperature_2m)} °C</div>
    <div class="beschreibung">${text}</div>
    <ul class="details">
      <li>Gefühlt: ${Math.round(wetter.apparent_temperature)} °C</li>
      <li>Luftfeuchtigkeit: ${wetter.relative_humidity_2m} %</li>
      <li>Wind: ${Math.round(wetter.wind_speed_10m)} km/h</li>
    </ul>
  `;
}

// Ablauf beim Absenden des Formulars (Button-Klick oder Enter)
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // verhindert, dass der Browser die Seite neu lädt

  const stadt = input.value.trim();
  if (!stadt) return;

  output.innerHTML = "<p>Lade Wetterdaten …</p>";

  try {
    const ort = await findeStadt(stadt);
    const wetter = await holeWetter(ort.latitude, ort.longitude);
    zeigeWetter(ort, wetter);
  } catch (fehler) {
    output.innerHTML = `<p class="fehler">${fehler.message}</p>`;
  }
});
