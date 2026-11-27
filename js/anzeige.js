// Alles, was HTML erzeugt und in die Seite schreibt.
import { beschreibeWetter } from "./wettercodes.js";

const output = document.getElementById("weatherInfo");

// Datum "2026-11-28" -> "Heute" bzw. Wochentag "Sa."
function wochentag(datum, index) {
  if (index === 0) return "Heute";
  // "T00:00" sorgt dafür, dass das Datum in lokaler Zeit gelesen wird
  return new Date(datum + "T00:00").toLocaleDateString("de-DE", { weekday: "short" });
}

// 7-Tage-Vorhersage als HTML-Liste bauen
function baueVorhersage(daily) {
  // daily enthält parallele Arrays: daily.time[i], daily.temperature_2m_max[i], ...
  const zeilen = daily.time.map((datum, i) => {
    const [text, symbol] = beschreibeWetter(daily.weather_code[i]);
    return `
      <li>
        <span class="tag">${wochentag(datum, i)}</span>
        <span class="tag-symbol" title="${text}">${symbol}</span>
        <span class="min">${Math.round(daily.temperature_2m_min[i])}°</span>
        <span class="max">${Math.round(daily.temperature_2m_max[i])}°</span>
        <span class="regen">${daily.precipitation_probability_max[i]}%</span>
      </li>
    `;
  });

  return `<ul class="vorhersage">${zeilen.join("")}</ul>`;
}

export function zeigeWetter(ort, daten) {
  const wetter = daten.current;
  const [text, symbol] = beschreibeWetter(wetter.weather_code);
  const ortText = ort.country ? `${ort.name}, ${ort.country}` : ort.name;

  output.innerHTML = `
    <h2>${ortText}</h2>
    <div class="symbol">${symbol}</div>
    <div class="temperatur">${Math.round(wetter.temperature_2m)} °C</div>
    <div class="beschreibung">${text}</div>
    <ul class="details">
      <li>Gefühlt: ${Math.round(wetter.apparent_temperature)} °C</li>
      <li>Luftfeuchtigkeit: ${wetter.relative_humidity_2m} %</li>
      <li>Wind: ${Math.round(wetter.wind_speed_10m)} km/h</li>
    </ul>
    <h3>Nächste 7 Tage</h3>
    ${baueVorhersage(daten.daily)}
  `;
}

export function zeigeLaden() {
  output.innerHTML = "<p>Lade Wetterdaten …</p>";
}

export function zeigeFehler(meldung) {
  output.innerHTML = `<p class="fehler">${meldung}</p>`;
}
