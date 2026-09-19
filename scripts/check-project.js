import { readFile } from "node:fs/promises";

const requiredFiles = [
  "index.html",
  "css/styles.css",
  "js/app.js",
  "js/config.js",
  "js/logger.js",
  "js/quick-notes.js",
  "manifest.webmanifest",
  "README.md",
  "docs/DEVELOPMENT.md",
  "docs/MASTER_PROMPT.md",
  "docs/PROJECT_STATUS.md",
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
  [contents["index.html"].includes('id="progress-title"'), "Fortschrittsanzeige fehlt"],
  [contents["index.html"].includes('id="work-title"'), "Benannte Hauptliste fehlt"],
  [contents["js/quick-notes.js"].includes("createWritable({ keepExistingData: true })"), "Anhängen an bestehende Datei fehlt"],
  [contents["js/quick-notes.js"].includes("new Date().toISOString()"), "Zeitstempel für Schnellspeicherung fehlt"],
  [contents["README.md"].includes("docs/PROJECT_STATUS.md"), "Projektstatus ist im README nicht verlinkt"],
  [contents["docs/PROJECT_STATUS.md"].includes("## Pflege-Trigger"), "Dokumentations-Trigger fehlen"],
  [contents["docs/MASTER_PROMPT.md"].includes("## 2. Verbindlicher Arbeitsablauf"), "Masterprompt-Ablauf fehlt"],
];

for (const [condition, message] of assertions) {
  if (!condition) throw new Error(message);
}

JSON.parse(contents["manifest.webmanifest"]);
console.log(`Projektcheck erfolgreich (${assertions.length} Regeln, ${requiredFiles.length} Dateien).`);
