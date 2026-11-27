// Einstiegspunkt der Wetter-App: verbindet Formular, API und Anzeige.
import { findeStadt, holeWetter } from "./api.js";
import { zeigeWetter, zeigeLaden, zeigeFehler } from "./anzeige.js";

const form = document.getElementById("cityForm");
const input = document.getElementById("cityInput");
const standortButton = document.getElementById("standortButton");

// Schlüssel, unter dem der letzte Ort im Browser gespeichert wird
const SPEICHER_SCHLUESSEL = "wetterapp.letzterOrt";

// localStorage speichert nur Texte, daher wandeln wir das Objekt in JSON um.
// try/catch, weil localStorage z. B. im privaten Modus gesperrt sein kann.
function merkeOrt(ort) {
  const { name, country, latitude, longitude } = ort;
  try {
    localStorage.setItem(SPEICHER_SCHLUESSEL, JSON.stringify({ name, country, latitude, longitude }));
  } catch {
    // Nicht schlimm: Die App funktioniert auch ohne Speichern.
  }
}

function leseGemerktenOrt() {
  try {
    const text = localStorage.getItem(SPEICHER_SCHLUESSEL);
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

// Wetter für einen Ort laden, anzeigen und den Ort merken
async function ladeWetterFuer(ort) {
  zeigeLaden();
  const daten = await holeWetter(ort.latitude, ort.longitude);
  zeigeWetter(ort, daten);
  merkeOrt(ort);
}

// Ablauf beim Absenden des Formulars (Button-Klick oder Enter)
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // verhindert, dass der Browser die Seite neu lädt

  const stadt = input.value.trim();
  if (!stadt) return;

  try {
    zeigeLaden();
    const ort = await findeStadt(stadt);
    await ladeWetterFuer(ort);
  } catch (fehler) {
    zeigeFehler(fehler.message);
  }
});

// Browser-Standort abfragen. getCurrentPosition arbeitet mit Callbacks;
// wir verpacken das in ein Promise, damit wir es mit await nutzen können.
function holeStandort() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Dein Browser unterstützt keine Standortabfrage."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (fehler) => {
        const meldungen = {
          1: "Standortzugriff wurde verweigert.",
          2: "Standort konnte nicht ermittelt werden.",
          3: "Standortabfrage hat zu lange gedauert.",
        };
        reject(new Error(meldungen[fehler.code] ?? "Unbekannter Fehler bei der Standortabfrage."));
      },
      { timeout: 10000 }
    );
  });
}

// Klick auf 📍: Wetter für den aktuellen Standort
standortButton.addEventListener("click", async () => {
  try {
    zeigeLaden();
    const coords = await holeStandort();
    const ort = { name: "Aktueller Standort", latitude: coords.latitude, longitude: coords.longitude };
    input.value = "";
    await ladeWetterFuer(ort);
  } catch (fehler) {
    zeigeFehler(fehler.message);
  }
});

// Beim Start: Gibt es einen gemerkten Ort, zeigen wir dessen Wetter gleich an.
const gemerkterOrt = leseGemerktenOrt();
if (gemerkterOrt) {
  if (gemerkterOrt.name !== "Aktueller Standort") input.value = gemerkterOrt.name;
  ladeWetterFuer(gemerkterOrt).catch((fehler) => zeigeFehler(fehler.message));
}
