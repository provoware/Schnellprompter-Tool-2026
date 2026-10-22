import test from "node:test";
import assert from "node:assert/strict";
import { appendQuickNote, normalizeQuickNote, FILE_NAME } from "../js/quick-notes.js";

test("Notiz normalisiert Leerzeichen ohne Inhaltsverlust", () => {
  assert.equal(normalizeQuickNote("  Hallo \n\t Welt  "), "Hallo Welt");
  assert.throws(() => normalizeQuickNote(" \n\t "), /EMPTY_NOTE/);
});

function fakeDirectory(size = 12, failure = null) {
  const calls = [];
  const stream = {
    async seek(amount) {
      calls.push(["seek", amount]);
      if (failure === "seek") throw Error("SEEK_FAILURE");
    },
    async write(contents) {
      calls.push(["write", contents]);
      if (failure === "write") throw Error("WRITE_FAILURE");
    },
    async close() {
      calls.push(["close"]);
      if (failure === "close") throw Error("CLOSE_FAILURE");
    },
    async abort() {
      calls.push(["abort"]);
      if (failure === "abort") throw Error("ABORT_FAILURE");
    },
  };
  const directory = {
    async getFileHandle(name, options) {
      assert.equal(name, FILE_NAME);
      assert.deepEqual(options, { create: true });
      return {
        async getFile() { return { size }; },
        async createWritable(options) {
          assert.deepEqual(options, { keepExistingData: true });
          return stream;
        },
      };
    },
  };
  return { directory, calls };
}

test("An bestehende Notizdatei wird ohne Abbruch angehängt", async () => {
  const { directory, calls } = fakeDirectory();
  await appendQuickNote(directory, "  Test  einer Notiz ");
  assert.deepEqual(calls.map(([name]) => name), ["seek", "write", "close"]);
  assert.equal(calls[0][1], 12);
  assert.match(calls[1][1], /^\n- \[\d{4}-\d\d-\d\dT.*\] Test einer Notiz\n$/);
});

test("Leere Eingaben eröffnen keine Dateiverbindung", async () => {
  const directory = { getFileHandle() { throw Error("NOT_CALLED"); } };
  await assert.rejects(appendQuickNote(directory, "   "), /EMPTY_NOTE/);
});

for (const stage of ["seek", "write", "close"]) {
  test("Schreibfehler bei " + stage + " löst kontrollierten Abbruch aus", async () => {
    const { directory, calls } = fakeDirectory(0, stage);
    await assert.rejects(appendQuickNote(directory, "Notiz"), new RegExp(stage.toUpperCase() + "_FAILURE"));
    assert.equal(calls.at(-1)[0], "abort");
  });
}
