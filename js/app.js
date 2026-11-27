// Einstiegspunkt der Wetter-App: verbindet Formular, API und Anzeige.
import { findeStadt, holeWetter } from "./api.js";
import { zeigeWetter, zeigeLaden, zeigeFehler } from "./anzeige.js";

const form = document.getElementById("cityForm");
const input = document.getElementById("cityInput");

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
