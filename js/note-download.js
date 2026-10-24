import { FILE_NAME, normalizeQuickNote } from "./quick-notes.js";

export function buildNoteDownload(rawText, now = new Date()) {
  const text = normalizeQuickNote(rawText);
  const timestamp = now.toISOString();
  return {
    filename: FILE_NAME.replace(/\.md$/, `-${timestamp.replace(/[:.]/g, "-")}.md`),
    contents: `- [${timestamp}] ${text}\n`,
  };
}

export function downloadQuickNote(rawText, {
  documentRef = document,
  urlApi = URL,
  schedule = setTimeout,
} = {}) {
  const { filename, contents } = buildNoteDownload(rawText);
  const blob = new Blob([contents], { type: "text/markdown;charset=utf-8" });
  const url = urlApi.createObjectURL(blob);
  let link;
  try {
    link = documentRef.createElement("a");
    link.href = url;
    link.download = filename;
    link.hidden = true;
    documentRef.body.append(link);
    link.click();
  } finally {
    link?.remove();
    schedule(() => urlApi.revokeObjectURL(url), 2000);
  }
  return filename;
}
