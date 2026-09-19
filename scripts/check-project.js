import { readFile } from "node:fs/promises";

const requiredFiles = [
  "index.html",
  "css/styles.css",
  "js/app.js",
  "js/config.js",
  "js/logger.js",
  "js/quick-notes.js",
  "manifest.webmanifest",
];

const contents = Object.fromEntries(await Promise.all(requiredFiles.map(async (path) => [
  path,
  await readFile(path, "utf8"),
])));

const assertions = [
  [contents["index.html"].startsWith("<!doctype html>"), "HTML-Dokumenttyp fehlt"],
  [contents["index.html"].includes('lang="de"'), "Dokumentsprache fehlt"],
  [contents["index.html"].includes('id="arbeitsbereich"'), "Hauptbereich fehlt"],
  [contents["index.html"].includes('type="module"'), "ES-Modul-Einstieg fehlt"],
  [contents["css/styles.css"].includes("prefers-reduced-motion"), "Bewegungsreduktion fehlt"],
  [!contents["js/app.js"].includes("console."), "Direkter Konsolenzugriff in app.js"],
  [contents["index.html"].includes('id="quick-note-form"'), "Schnellspeicherung fehlt"],
  [contents["js/quick-notes.js"].includes("createWritable({ keepExistingData: true })"), "Anhängen an bestehende Datei fehlt"],
  [contents["js/quick-notes.js"].includes("new Date().toISOString()"), "Zeitstempel für Schnellspeicherung fehlt"],
];

for (const [condition, message] of assertions) {
  if (!condition) throw new Error(message);
}

JSON.parse(contents["manifest.webmanifest"]);
console.log(`Projektcheck erfolgreich (${assertions.length} Regeln, ${requiredFiles.length} Dateien).`);
