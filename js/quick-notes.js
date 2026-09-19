const FILE_NAME = "entwicklerinfo_und_ideen_menge-inhalt.md";
const DRAFT_KEY = "schnellprompter.quickNoteDraft";
const SETTINGS_KEY = "schnellprompter.settings";
const DEFAULT_SETTINGS = Object.freeze({ autosave: "on", highlight: "strong" });

function readLocal(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

function writeLocal(key, value) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    return false;
  }
  return true;
}

export function loadSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(readLocal(SETTINGS_KEY, "{}")) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  writeLocal(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadDraft() {
  return readLocal(DRAFT_KEY, "");
}

export function saveDraft(value, enabled) {
  writeLocal(DRAFT_KEY, enabled ? value : "");
}

export function supportsFolderAccess() {
  return typeof window.showDirectoryPicker === "function";
}

export async function chooseProjectFolder() {
  return window.showDirectoryPicker({ mode: "readwrite", id: "schnellprompter-project" });
}

export async function appendQuickNote(directoryHandle, rawText) {
  const text = rawText.trim().replace(/\s+/g, " ");
  if (!text) throw new Error("EMPTY_NOTE");

  const fileHandle = await directoryHandle.getFileHandle(FILE_NAME, { create: true });
  const file = await fileHandle.getFile();
  const writable = await fileHandle.createWritable({ keepExistingData: true });
  await writable.seek(file.size);
  await writable.write(`${file.size ? "\n" : ""}- [${new Date().toISOString()}] ${text}\n`);
  await writable.close();
}

export { FILE_NAME };
