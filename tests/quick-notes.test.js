import test from "node:test";
import assert from "node:assert/strict";
import { appendQuickNote, normalizeQuickNote, FILE_NAME } from "../js/quick-notes.js";

test("Notiztext wird normalisiert, ohne den Sinn zu verändern", () => {
  assert.equal(normalizeQuickNote("  Hallo  \n\t Welt  "), "Hallo Welt");
  assert.throws(() => normalizeQuickNote(" \n\t "), /EMPTY_NOTE/);
});

test("Notiz wird an eine vorhandene Datei angehängt", async () => {
  const calls = [];
  const directory = {
    async getFileHandle(name, options) {
      assert.equal(name, FILE_NAME);
      assert.deepEqual(options, { create: true });
      return {
        async getFile() { return { size: 12 }; },
        async createWritable(options) {
          assert.deepEqual(options, { keepExistingData: true });
          return {
            async seek(size) { calls.push(["seek", size]); },
            async write(text) { calls.push(["write", text]); },
            async close() { calls.push(["close"]); },
          };
        },
      };
    },
  };
  await appendQuickNote(directory, "  Test   einer  Notiz  ");
  assert.deepEqual(calls.map((call) => call[0]), ["seek", "write", "close"]);
  assert.equal(calls[0][1], 12);
  assert.match(calls[1][1], /^\n- \[\d{4}-\d\d-\d\dT.*\] Test einer Notiz\n$/);
});

test("Leere Notizen erzeugen keinen Dateizugriff", async () => {
  const directory = { getFileHandle() { throw Error("Darf nicht aufgerufen werden"); } };
  await assert.rejects(appendQuickNote(directory, "  "), /EMPTY_NOTE/);
});
