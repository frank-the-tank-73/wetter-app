// Einstiegspunkt der Wetter-App: verbindet Formular, API und Anzeige.
import { findeStadt, holeWetter } from "./api.js";
import { zeigeWetter, zeigeLaden, zeigeFehler } from "./anzeige.js";

const form = document.getElementById("cityForm");
const input = document.getElementById("cityInput");
const standortButton = document.getElementById("standortButton");

// Wetter für einen Ort laden und anzeigen
async function ladeWetterFuer(ort) {
  zeigeLaden();
  const daten = await holeWetter(ort.latitude, ort.longitude);
  zeigeWetter(ort, daten);
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
