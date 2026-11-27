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

// Liefert [Text, Symbol] zu einem Wettercode, mit Fallback für unbekannte Codes
export function beschreibeWetter(code) {
  return WETTERCODES[code] ?? ["Unbekannt", "❔"];
}
