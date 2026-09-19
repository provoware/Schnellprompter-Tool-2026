import { readFile } from "node:fs/promises";

const requiredFiles = [
  "index.html",
  "css/styles.css",
  "js/app.js",
  "js/config.js",
  "js/logger.js",
  "js/arbeitsablaeufe.js",
  "js/hilfetexte.js",
  "qualitaetsregeln.json",
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
  [contents["index.html"].includes('spellcheck="true"'), "Rechtschreibprüfung fehlt"],
  [contents["index.html"].includes('id="entry-list"'), "Textbausteinliste fehlt"],
  [contents["js/arbeitsablaeufe.js"].includes("localStorage"), "Lokale Speicherung fehlt"],
  [contents["js/arbeitsablaeufe.js"].includes("titelindex"), "Dublettenindex fehlt"],
  [contents["js/arbeitsablaeufe.js"].includes("versionen"), "Versionierung fehlt"],
  [!contents["js/arbeitsablaeufe.js"].includes("console."), "Direkter Konsolenzugriff im Arbeitsablaufmodul"],
];

for (const [condition, message] of assertions) {
  if (!condition) throw new Error(message);
}

JSON.parse(contents["manifest.webmanifest"]);
JSON.parse(contents["qualitaetsregeln.json"]);
console.log(`Projektcheck erfolgreich (${assertions.length} Regeln, ${requiredFiles.length} Dateien).`);
