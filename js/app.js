import { config } from "./config.js";
import { createLogger } from "./logger.js";
import { reportRuntimeError } from "./runtime-errors.js";
import { downloadQuickNote } from "./note-download.js";
import {
  appendQuickNote,
  chooseProjectFolder,
  loadDraft,
  loadSettings,
  saveDraft,
  saveSettings,
  supportsFolderAccess,
} from "./quick-notes.js";

const logger = createLogger({
  level: config.debug ? "debug" : "warn",
  context: { app: config.appName, version: config.version },
});

const elements = {
  chooseFolder: document.querySelector("#choose-folder"),
  noteForm: document.querySelector("#quick-note-form"),
  noteInput: document.querySelector("#quick-note-input"),
  noteStatus: document.querySelector("#quick-note-status"),
  openSettings: document.querySelector("#open-settings"),
  settingsDialog: document.querySelector("#settings-dialog"),
  settingsForm: document.querySelector("#settings-form"),
  autosaveSetting: document.querySelector("#autosave-setting"),
  highlightSetting: document.querySelector("#highlight-setting"),
};

let directoryHandle;
let settings = loadSettings();

function setStatus(message, state = "") {
  if (!elements.noteStatus) return;
  elements.noteStatus.textContent = message;
  elements.noteStatus.dataset.state = state;
}

async function selectFolder() {
  if (!supportsFolderAccess()) {
    setStatus("Dieser Browser unterstützt die Ordnerauswahl nicht. Bitte Chrome oder Edge verwenden.", "error");
    return false;
  }
  try {
    directoryHandle = await chooseProjectFolder();
    setStatus(`Projektordner „${directoryHandle.name}“ ist bereit.`, "success");
    return true;
  } catch (error) {
    if (error.name !== "AbortError") setStatus("Der Projektordner konnte nicht geöffnet werden.", "error");
    return false;
  }
}

async function handleNoteSubmit(event) {
  event.preventDefault();
  if (!elements.noteInput) return;
  if (!supportsFolderAccess()) {
    try {
      downloadQuickNote(elements.noteInput.value);
      setStatus("Download gestartet. Datei prüfen und die Notiz selbst in die Projektdatei übernehmen. Die Eingabe bleibt erhalten.");
    } catch {
      setStatus("Download fehlgeschlagen. Die Eingabe bleibt erhalten.", "error");
    }
    return;
  }
  if (!directoryHandle && !(await selectFolder())) return;
  try {
    await appendQuickNote(directoryHandle, elements.noteInput.value);
    elements.noteInput.value = "";
    saveDraft("", settings.autosave === "on");
    setStatus("Gespeichert und mit Zeitstempel an die Markdown-Datei angehängt.", "success");
  } catch {
    setStatus("Speichern fehlgeschlagen. Bitte Ordnerzugriff prüfen und erneut versuchen.", "error");
  }
}

function applySettings() {
  document.documentElement.dataset.highlight = settings.highlight;
  if (elements.autosaveSetting) elements.autosaveSetting.value = settings.autosave;
  if (elements.highlightSetting) elements.highlightSetting.value = settings.highlight;
}

function handleSettingsClose(event) {
  event.preventDefault();
  const submitter = event.submitter;
  if (submitter?.value === "save") {
    settings = { autosave: elements.autosaveSetting.value, highlight: elements.highlightSetting.value };
    saveSettings(settings);
    if (settings.autosave === "off") saveDraft("", false);
    applySettings();
  }
  elements.settingsDialog.close();
}

function bindQuickNotes() {
  if (!elements.noteForm || !elements.settingsDialog) return;
  elements.noteInput.value = loadDraft();
  applySettings();
  if (!supportsFolderAccess()) {
    if (elements.chooseFolder) elements.chooseFolder.hidden = true;
    const submitButton = elements.noteForm.querySelector('button[type="submit"]');
    if (submitButton) submitButton.textContent = "Herunterladen";
    setStatus("Keine Ordnerwahl: Notiz als einzelne Markdown-Datei herunterladen und selbst ins Projekt übernehmen.");
  }
  elements.noteForm.addEventListener("submit", handleNoteSubmit);
  elements.chooseFolder?.addEventListener("click", selectFolder);
  elements.noteInput.addEventListener("input", () => saveDraft(elements.noteInput.value, settings.autosave === "on"));
  elements.openSettings?.addEventListener("click", () => elements.settingsDialog.showModal());
  elements.settingsForm?.addEventListener("submit", handleSettingsClose);
}

function start() {
  document.documentElement.dataset.appReady = "true";
  bindQuickNotes();
  logger.debug("Anwendung initialisiert", { environment: config.environment });
}

window.addEventListener("error", (event) => reportRuntimeError(event, logger));
window.addEventListener("unhandledrejection", (event) => reportRuntimeError(event, logger));

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}
