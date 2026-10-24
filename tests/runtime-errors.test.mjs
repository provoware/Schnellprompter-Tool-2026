import test from "node:test";
import assert from "node:assert/strict";
import { reportRuntimeError } from "../js/runtime-errors.js";

function capture(event) {
  const entries = [];
  reportRuntimeError(event, { error: (...args) => entries.push(args) });
  return entries;
}

test("Window-Fehler protokolliert nur festen Code", () => {
  const secret = "VERTRAULICHER_PROMPT_123";
  const entries = capture({
    type: "error",
    message: secret,
    filename: "/privat/" + secret,
    error: new Error(secret),
  });
  assert.deepEqual(entries, [["Nicht behandelter Laufzeitfehler", { code: "WINDOW_ERROR" }]]);
  assert.ok(!JSON.stringify(entries).includes(secret));
});

test("Unbehandelte Promise-Ablehnung enthaelt keine Nutzerdaten", () => {
  const secret = "GEHEIMES_TOKEN_456";
  const entries = capture({
    type: "unhandledrejection",
    reason: { message: secret, prompt: secret, password: secret },
  });
  assert.deepEqual(entries, [["Nicht behandelter Laufzeitfehler", { code: "UNHANDLED_REJECTION" }]]);
  assert.ok(!JSON.stringify(entries).includes(secret));
});

test("Unbekannter Ereignistyp wird auf festen Code begrenzt", () => {
  assert.deepEqual(capture({ type: "PROMPT_IN_EVENT_TYPE" }), [
    ["Nicht behandelter Laufzeitfehler", { code: "UNKNOWN_RUNTIME_EVENT" }],
  ]);
  assert.deepEqual(capture(null), [
    ["Nicht behandelter Laufzeitfehler", { code: "UNKNOWN_RUNTIME_EVENT" }],
  ]);
});

test("Sensible Fehlerfelder werden nicht einmal ausgelesen", () => {
  const event = { type: "error" };
  Object.defineProperty(event, "message", { get() { throw Error("MESSAGE_ACCESSED"); } });
  Object.defineProperty(event, "reason", { get() { throw Error("REASON_ACCESSED"); } });
  assert.deepEqual(capture(event), [
    ["Nicht behandelter Laufzeitfehler", { code: "WINDOW_ERROR" }],
  ]);
});
