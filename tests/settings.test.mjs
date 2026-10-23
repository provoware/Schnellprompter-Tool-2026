import test from "node:test";
import assert from "node:assert/strict";
import { loadSettings } from "../js/quick-notes.js";

const KEY = "schnellprompter.settings";

function withStored(value, callback) {
  const previous = globalThis.localStorage;
  globalThis.localStorage = {
    getItem(key) {
      assert.equal(key, KEY);
      return value;
    },
  };
  try {
    callback();
  } finally {
    if (previous === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = previous;
  }
}

for (const [stored, expected] of [
  [null, { autosave: "on", highlight: "strong" }],
  ['{"autosave":"off","highlight":"subtle"}', { autosave: "off", highlight: "subtle" }],
  ['{"autosave":"yes","highlight":"neon"}', { autosave: "on", highlight: "strong" }],
  ['{"autosave":"off","highlight":null}', { autosave: "off", highlight: "strong" }],
  ['{"autosave":0,"highlight":["subtle"]}', { autosave: "on", highlight: "strong" }],
  ['{"autosave":"off","highlight":"subtle","unexpected":"x"}', { autosave: "off", highlight: "subtle" }],
  ["null", { autosave: "on", highlight: "strong" }],
  ["[]", { autosave: "on", highlight: "strong" }],
  ['"off"', { autosave: "on", highlight: "strong" }],
  ['{"autosave":', { autosave: "on", highlight: "strong" }],
  ['{"__proto__":{"polluted":true},"autosave":"off"}', { autosave: "off", highlight: "strong" }],
]) {
  test("Nur erlaubte gespeicherte Einstellungen: " + String(stored), () => {
    withStored(stored, () => assert.deepEqual(loadSettings(), expected));
  });
}

test("Gesperrter Browserspeicher liefert Standardwerte", () => {
  const previous = globalThis.localStorage;
  globalThis.localStorage = { getItem() { throw Error("STORAGE_BLOCKED"); } };
  try {
    assert.deepEqual(loadSettings(), { autosave: "on", highlight: "strong" });
  } finally {
    if (previous === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = previous;
  }
});
