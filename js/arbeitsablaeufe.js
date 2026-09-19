import { HILFETEXTE_VERSION, SCHNELLSTART_SCHRITTE } from "./hilfetexte.js";

const SPEICHERSCHLUESSEL = "schnellprompter.entries.v2";
const ALTER_SPEICHERSCHLUESSEL = "schnellprompter.entries.v1";
const PLATZHALTER_SCHLUESSEL = "schnellprompter.platzhalter.v1";
const ARTNAMEN = { fragment: "Textabschnitt", template: "Vorlage", phrase: "Formulierung" };

const woerterZaehlen = (text) => text.trim() ? text.trim().split(/\s+/u).length : 0;
const vereinheitlichen = (text) => text.trim().toLocaleLowerCase("de").replace(/\s+/gu, " ");
const neueKennung = () => crypto.randomUUID();
const textSichern = (text) => String(text).replace(/[&<>"']/gu, (zeichen) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[zeichen]);

function alteEintraegeUebernehmen(eintraege) {
  // Bereits gespeicherte Texte bleiben erhalten und werden beim ersten Laden automatisch zu Version 1.
  return eintraege.map((eintrag) => {
    if (!eintrag || typeof eintrag !== "object") return null;
    if (Array.isArray(eintrag.versionen)) return eintrag;
    const versionskennung = neueKennung();
    return { ...eintrag, versionen: [{ id: versionskennung, text: eintrag.content ?? "", erstelltAm: eintrag.updatedAt ?? eintrag.createdAt }], aktuelleVersion: versionskennung };
  }).filter((eintrag) => eintrag && typeof eintrag.id === "string" && typeof eintrag.title === "string" && ARTNAMEN[eintrag.type]
    && typeof eintrag.updatedAt === "string" && eintrag.versionen.length
    && eintrag.versionen.every((version) => typeof version.id === "string" && typeof version.text === "string"));
}

function laden(schluessel, ersatz = []) {
  try {
    const wert = JSON.parse(localStorage.getItem(schluessel) ?? JSON.stringify(ersatz));
    return Array.isArray(wert) ? wert : ersatz;
  } catch { return ersatz; }
}

function aktuelleFassung(eintrag, auswahl) {
  return eintrag.versionen.find(({ id }) => id === (auswahl.get(eintrag.id) ?? eintrag.aktuelleVersion)) ?? eintrag.versionen.at(-1);
}

function karteErstellen(eintrag, auswahl) {
  const fassung = aktuelleFassung(eintrag, auswahl);
  const element = document.createElement("li");
  element.className = "entry-card"; element.draggable = true; element.dataset.id = eintrag.id;
  const optionen = eintrag.versionen.map((version, index) => `<option value="${textSichern(version.id)}"${version.id === fassung.id ? " selected" : ""}>Version ${index + 1}</option>`).join("");
  element.innerHTML = `<div class="entry-card__top"><span class="drag-handle" aria-hidden="true">⠿</span><span class="tag tag--${eintrag.type}">${ARTNAMEN[eintrag.type]}</span></div><button class="workflow-button" type="button" data-action="kopieren" title="Text dieser Version in die Zwischenablage kopieren">${textSichern(eintrag.title)}</button><p>${textSichern(fassung.text)}</p><div class="entry-card__footer"><label>Verwendete Fassung<select data-action="version">${optionen}</select></label><span>${woerterZaehlen(fassung.text)} Wörter · ${fassung.text.length} Zeichen</span><div><button type="button" data-action="bearbeiten" title="Diese Fassung bearbeiten">Bearbeiten</button><button class="danger" type="button" data-action="loeschen" title="Arbeitsablauf vollständig löschen">Löschen</button></div></div>`;
  return element;
}

export function initArbeitsablaeufe(root = document) {
  const kennungen = ["prompt-form", "entry-id", "entry-type", "entry-title", "entry-content", "title-stat", "content-stat", "entry-count", "word-count", "character-count", "entry-list", "empty-state", "sort-order", "reset-button", "save-button", "feedback", "import-button", "import-file", "export-button", "drop-zone", "new-version", "placeholder-form", "placeholder-name", "placeholder-aliases", "placeholder-list", "hilfe-oeffnen", "hilfe-dialog", "help-steps"];
  const felder = Object.fromEntries(kennungen.map((id) => [id, root.getElementById(id)]));
  if (Object.values(felder).some((element) => !element)) return;
  let eintraege = alteEintraegeUebernehmen(laden(SPEICHERSCHLUESSEL, laden(ALTER_SPEICHERSCHLUESSEL)));
  let platzhalter = laden(PLATZHALTER_SCHLUESSEL);
  let gezogen = null;
  const versionsauswahl = new Map();
  let titelindex = new Map();
  let textindex = new Map();

  // Die Indizes ermöglichen eine eindeutige Dublettenprüfung, ohne jeden Eintrag mehrfach durchsuchen zu müssen.
  const indizesErneuern = () => {
    titelindex = new Map(eintraege.map((eintrag) => [vereinheitlichen(eintrag.title), eintrag.id]));
    textindex = new Map(eintraege.flatMap((eintrag) => eintrag.versionen.map((version) => [vereinheitlichen(version.text), eintrag.id])));
  };
  const melden = (text) => { felder.feedback.textContent = text; };
  const speichern = () => { localStorage.setItem(SPEICHERSCHLUESSEL, JSON.stringify(eintraege)); indizesErneuern(); };
  const sortierteEintraege = () => {
    const liste = [...eintraege]; const reihenfolge = felder["sort-order"].value;
    if (reihenfolge === "newest") liste.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    if (reihenfolge === "title") liste.sort((a, b) => a.title.localeCompare(b.title, "de"));
    if (reihenfolge === "type") liste.sort((a, b) => ARTNAMEN[a.type].localeCompare(ARTNAMEN[b.type], "de"));
    return liste;
  };
  const anzeigen = () => {
    felder["entry-list"].replaceChildren(...sortierteEintraege().map((eintrag) => karteErstellen(eintrag, versionsauswahl)));
    felder["empty-state"].hidden = eintraege.length > 0;
    const texte = eintraege.map((eintrag) => aktuelleFassung(eintrag, versionsauswahl).text);
    felder["entry-count"].textContent = eintraege.length;
    felder["word-count"].textContent = texte.reduce((summe, text) => summe + woerterZaehlen(text), 0);
    felder["character-count"].textContent = texte.reduce((summe, text) => summe + text.length, 0);
  };
  const zaehlerAktualisieren = () => {
    const text = felder["entry-content"].value;
    felder["title-stat"].textContent = `${felder["entry-title"].value.length} Zeichen`;
    felder["content-stat"].textContent = `${woerterZaehlen(text)} Wörter · ${text.length} Zeichen`;
  };
  const eingabeLeeren = () => {
    felder["prompt-form"].reset(); felder["entry-id"].value = ""; felder["new-version"].checked = true;
    felder["save-button"].textContent = "Arbeitsablauf speichern"; zaehlerAktualisieren();
  };
  const dubletteFinden = (titel, text, eigeneKennung) => {
    const titelTreffer = titelindex.get(vereinheitlichen(titel));
    const textTreffer = textindex.get(vereinheitlichen(text));
    return [titelTreffer, textTreffer].find((kennung) => kennung && kennung !== eigeneKennung);
  };
  const offenePlatzhalter = (text) => [...text.matchAll(/\{\{\s*([^{}]+?)\s*\}\}/gu)].map((treffer) => treffer[1]);
  const inZwischenablage = async (text) => {
    // Die Rückmeldung sagt nicht nur, dass kopiert wurde, sondern nennt auch noch auszufüllende Stellen.
    try {
      await navigator.clipboard.writeText(text);
      const offen = offenePlatzhalter(text);
      melden(offen.length ? `Text kopiert. Bitte noch ersetzen: ${offen.join(", ")}.` : "Text wurde kopiert und kann jetzt eingefügt werden.");
    } catch { melden("Der Browser hat das Kopieren nicht erlaubt. Bitte geben Sie die Zwischenablage frei."); }
  };

  felder["prompt-form"].addEventListener("submit", (ereignis) => {
    ereignis.preventDefault();
    const eigeneKennung = felder["entry-id"].value;
    if (dubletteFinden(felder["entry-title"].value, felder["entry-content"].value, eigeneKennung)) {
      melden("Dieser Titel oder Text ist bereits vorhanden. Bitte öffnen Sie den bestehenden Arbeitsablauf."); return;
    }
    const stelle = eintraege.findIndex(({ id }) => id === eigeneKennung);
    if (stelle >= 0 && eintraege[stelle].versionen.some(({ text }) => vereinheitlichen(text) === vereinheitlichen(felder["entry-content"].value))) {
      melden("Diese Fassung ist bereits in diesem Arbeitsablauf vorhanden."); return;
    }
    const jetzt = new Date().toISOString();
    if (stelle < 0) {
      const versionskennung = neueKennung();
      eintraege.unshift({ id: neueKennung(), type: felder["entry-type"].value, title: felder["entry-title"].value.trim(), versionen: [{ id: versionskennung, text: felder["entry-content"].value.trim(), erstelltAm: jetzt }], aktuelleVersion: versionskennung, createdAt: jetzt, updatedAt: jetzt });
    } else {
      const eintrag = eintraege[stelle];
      const neueVersion = { id: neueKennung(), text: felder["entry-content"].value.trim(), erstelltAm: jetzt };
      if (felder["new-version"].checked) eintrag.versionen.push(neueVersion);
      else eintrag.versionen = eintrag.versionen.map((version) => version.id === eintrag.aktuelleVersion ? neueVersion : version);
      Object.assign(eintrag, { type: felder["entry-type"].value, title: felder["entry-title"].value.trim(), aktuelleVersion: neueVersion.id, updatedAt: jetzt });
    }
    speichern(); anzeigen(); eingabeLeeren(); melden(stelle < 0 ? "Arbeitsablauf gespeichert." : "Neue Fassung gespeichert.");
  });
  [felder["entry-title"], felder["entry-content"]].forEach((feld) => feld.addEventListener("input", zaehlerAktualisieren));
  felder["reset-button"].addEventListener("click", eingabeLeeren);
  felder["sort-order"].addEventListener("change", anzeigen);
  root.addEventListener("click", async (ereignis) => {
    const schalter = ereignis.target.closest("[data-copy], [data-paste]"); if (!schalter) return;
    const feld = felder[schalter.dataset.copy ?? schalter.dataset.paste];
    if (schalter.dataset.copy) inZwischenablage(feld.value);
    else try { feld.value = await navigator.clipboard.readText(); zaehlerAktualisieren(); melden("Text wurde aus der Zwischenablage eingefügt."); } catch { melden("Der Browser hat das Einfügen nicht erlaubt."); }
  });
  felder["entry-list"].addEventListener("change", (ereignis) => {
    if (ereignis.target.dataset.action !== "version") return;
    versionsauswahl.set(ereignis.target.closest("li").dataset.id, ereignis.target.value); anzeigen();
  });
  felder["entry-list"].addEventListener("click", (ereignis) => {
    const schalter = ereignis.target.closest("[data-action]"); const eintrag = eintraege.find(({ id }) => id === schalter?.closest("li")?.dataset.id);
    if (!eintrag || schalter.dataset.action === "version") return;
    const fassung = aktuelleFassung(eintrag, versionsauswahl);
    if (schalter.dataset.action === "kopieren") inZwischenablage(fassung.text);
    if (schalter.dataset.action === "bearbeiten") {
      felder["entry-id"].value = eintrag.id; felder["entry-type"].value = eintrag.type; felder["entry-title"].value = eintrag.title; felder["entry-content"].value = fassung.text;
      eintrag.aktuelleVersion = fassung.id; felder["save-button"].textContent = "Änderung speichern"; zaehlerAktualisieren(); felder["entry-title"].focus();
    }
    if (schalter.dataset.action === "loeschen" && confirm(`„${eintrag.title}“ mit allen Versionen löschen?`)) {
      eintraege = eintraege.filter(({ id }) => id !== eintrag.id); speichern(); anzeigen(); melden("Arbeitsablauf gelöscht.");
    }
  });
  felder["entry-list"].addEventListener("dragstart", (ereignis) => { gezogen = ereignis.target.closest("li")?.dataset.id; });
  felder["entry-list"].addEventListener("dragover", (ereignis) => ereignis.preventDefault());
  felder["entry-list"].addEventListener("drop", (ereignis) => {
    ereignis.preventDefault(); const ziel = ereignis.target.closest("li")?.dataset.id; if (!gezogen || !ziel || gezogen === ziel) return;
    eintraege = sortierteEintraege(); const verschoben = eintraege.find(({ id }) => id === gezogen); eintraege = eintraege.filter(({ id }) => id !== gezogen);
    eintraege.splice(eintraege.findIndex(({ id }) => id === ziel), 0, verschoben); felder["sort-order"].value = "manual"; speichern(); anzeigen(); melden("Reihenfolge gespeichert.");
  });

  const platzhalterAnzeigen = () => {
    // Jede Bezeichnung ist zugleich eine Schaltfläche, damit sie ohne Tipparbeit in einen Text übernommen werden kann.
    felder["placeholder-list"].replaceChildren(...platzhalter.map((wert) => {
      const zeile = document.createElement("li"); zeile.dataset.id = wert.id;
      zeile.innerHTML = `<button type="button" data-placeholder="${textSichern(wert.name)}" title="Platzhalter kopieren">{{${textSichern(wert.name)}}}</button><span>${wert.aliases.length ? `Auch bekannt als: ${textSichern(wert.aliases.join(", "))}` : "Keine alternativen Namen"}</span><button type="button" data-remove-placeholder>Entfernen</button>`; return zeile;
    }));
  };
  felder["placeholder-form"].addEventListener("submit", (ereignis) => {
    ereignis.preventDefault(); const name = felder["placeholder-name"].value.trim();
    if (platzhalter.some((wert) => vereinheitlichen(wert.name) === vereinheitlichen(name))) { melden("Dieser Platzhalter ist bereits vorhanden."); return; }
    platzhalter.push({ id: neueKennung(), name, aliases: felder["placeholder-aliases"].value.split(",").map((wert) => wert.trim()).filter(Boolean) });
    localStorage.setItem(PLATZHALTER_SCHLUESSEL, JSON.stringify(platzhalter)); felder["placeholder-form"].reset(); platzhalterAnzeigen(); melden("Platzhalter gespeichert.");
  });
  felder["placeholder-list"].addEventListener("click", (ereignis) => {
    const zeile = ereignis.target.closest("li"); if (!zeile) return;
    if (ereignis.target.dataset.placeholder) inZwischenablage(`{{${ereignis.target.dataset.placeholder}}}`);
    if (ereignis.target.hasAttribute("data-remove-placeholder")) { platzhalter = platzhalter.filter(({ id }) => id !== zeile.dataset.id); localStorage.setItem(PLATZHALTER_SCHLUESSEL, JSON.stringify(platzhalter)); platzhalterAnzeigen(); melden("Platzhalter entfernt."); }
  });
  const importieren = async (datei) => {
    // Erst nach vollständiger Prüfung ersetzen eingelesene Daten den vorhandenen Bestand.
    try {
      const daten = JSON.parse(await datei.text()); const quellEintraege = Array.isArray(daten) ? daten : daten.arbeitsablaeufe;
      if (!Array.isArray(quellEintraege)) throw new Error("ungueltig");
      const uebernommen = alteEintraegeUebernehmen(quellEintraege); if (uebernommen.length !== quellEintraege.length) throw new Error("ungueltig");
      const neuePlatzhalter = Array.isArray(daten.platzhalter) ? daten.platzhalter : platzhalter;
      if (!neuePlatzhalter.every((wert) => typeof wert.id === "string" && typeof wert.name === "string" && Array.isArray(wert.aliases) && wert.aliases.every((alias) => typeof alias === "string"))) throw new Error("ungueltig");
      eintraege = uebernommen; platzhalter = neuePlatzhalter;
      speichern(); localStorage.setItem(PLATZHALTER_SCHLUESSEL, JSON.stringify(platzhalter)); platzhalterAnzeigen(); anzeigen(); melden(`${eintraege.length} Arbeitsabläufe importiert.`);
    }
    catch { melden("Die Sicherungsdatei konnte nicht gelesen werden."); }
  };
  felder["import-button"].addEventListener("click", () => felder["import-file"].click());
  felder["import-file"].addEventListener("change", () => felder["import-file"].files[0] && importieren(felder["import-file"].files[0]));
  felder["drop-zone"].addEventListener("dragover", (ereignis) => ereignis.preventDefault());
  felder["drop-zone"].addEventListener("drop", (ereignis) => { ereignis.preventDefault(); if (ereignis.dataTransfer.files[0]) importieren(ereignis.dataTransfer.files[0]); });
  felder["export-button"].addEventListener("click", () => {
    const sicherung = { formatVersion: 2, hilfetexteVersion: HILFETEXTE_VERSION, arbeitsablaeufe: eintraege, platzhalter };
    const verweis = document.createElement("a"); verweis.href = URL.createObjectURL(new Blob([JSON.stringify(sicherung, null, 2)], { type: "application/json" }));
    verweis.download = `schnellprompter-sicherung-${new Date().toISOString().slice(0, 10)}.json`; verweis.click(); URL.revokeObjectURL(verweis.href); melden(`${eintraege.length} Arbeitsabläufe gesichert.`);
  });
  felder["help-steps"].replaceChildren(...SCHNELLSTART_SCHRITTE.map(({ titel, text }) => { const schritt = document.createElement("li"); schritt.innerHTML = `<strong>${textSichern(titel)}</strong><p>${textSichern(text)}</p>`; return schritt; }));
  felder["hilfe-oeffnen"].addEventListener("click", () => felder["hilfe-dialog"].showModal());
  indizesErneuern(); zaehlerAktualisieren(); platzhalterAnzeigen(); anzeigen();
}
