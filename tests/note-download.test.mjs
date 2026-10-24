import test from "node:test";
import assert from "node:assert/strict";
import { buildNoteDownload, downloadQuickNote } from "../js/note-download.js";

const fixed = new Date("2026-10-24T02:50:00.000Z");

test("Fallback-Datei hat ISO-Zeitstempel und keine Nutzerinhalte im Dateinamen", () => {
  const result = buildNoteDownload("  Mein  geheimer\nText  ", fixed);
  assert.equal(result.filename, "entwicklerinfo_und_ideen_menge-inhalt-2026-10-24T02-50-00-000Z.md");
  assert.equal(result.contents, "- [2026-10-24T02:50:00.000Z] Mein geheimer Text\n");
  assert.equal(result.filename.includes("geheimer"), false);
});

test("Leere Eingabe wird vor einem Download abgewiesen", () => {
  assert.throws(() => buildNoteDownload(" \n\t ", fixed), /EMPTY_NOTE/);
});

function fakeBrowser(failClick = false) {
  const calls = [];
  let blob;
  let download;
  let scheduled;
  const urlApi = {
    createObjectURL(value) { blob = value; calls.push("create"); return "blob:test"; },
    revokeObjectURL(url) { assert.equal(url, "blob:test"); calls.push("revoke"); },
  };
  const documentRef = {
    createElement(tag) {
      assert.equal(tag, "a");
      download = {
        click() { calls.push("click"); if (failClick) throw Error("CLICK_BLOCKED"); },
        remove() { calls.push("remove"); },
      };
      return download;
    },
    body: { append(link) { assert.equal(link, download); calls.push("append"); } },
  };
  const schedule = (callback, delay) => {
    assert.equal(delay, 2000);
    scheduled = callback;
  };
  return {
    options: { documentRef, urlApi, schedule },
    calls,
    get blob() { return blob; },
    get link() { return download; },
    cleanup() { scheduled(); },
  };
}

test("Download nutzt eine Markdown-Datei, klickt und gibt Objekt-URL wieder frei", async () => {
  const fake = fakeBrowser();
  const name = downloadQuickNote("Notiz", fake.options);
  assert.match(name, /^entwicklerinfo_und_ideen_menge-inhalt-.*\.md$/);
  assert.equal(fake.link.download, name);
  assert.equal(fake.link.href, "blob:test");
  assert.equal(fake.link.hidden, true);
  assert.equal(fake.blob.type, "text/markdown;charset=utf-8");
  assert.match(await fake.blob.text(), /^- \[\d{4}-.*\] Notiz\n$/);
  assert.deepEqual(fake.calls, ["create", "append", "click", "remove"]);
  fake.cleanup();
  assert.deepEqual(fake.calls, ["create", "append", "click", "remove", "revoke"]);
});

test("Blockierter Download räumt auf und meldet Fehler", () => {
  const fake = fakeBrowser(true);
  assert.throws(() => downloadQuickNote("Notiz", fake.options), /CLICK_BLOCKED/);
  assert.deepEqual(fake.calls, ["create", "append", "click", "remove"]);
  fake.cleanup();
  assert.equal(fake.calls.at(-1), "revoke");
});

test("Leere Eingabe erzeugt weder Datei noch Link", () => {
  const fake = fakeBrowser();
  assert.throws(() => downloadQuickNote(" ", fake.options), /EMPTY_NOTE/);
  assert.deepEqual(fake.calls, []);
});
