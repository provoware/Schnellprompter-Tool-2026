import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { hasStrictBaseUri } from "../scripts/csp-base-uri.js";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const meta = (rule) =>
  '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; '+rule+'">';

test("Originalseite sperrt base-uri gegen Umleitung", () => {
  assert.equal(hasStrictBaseUri(html), true);
});
test("fehlende Sperre wird abgewiesen", () => {
  assert.equal(hasStrictBaseUri(meta("script-src 'self'")), false);
});
test("andere Basisadress-Berechtigung wird abgewiesen", () => {
  assert.equal(hasStrictBaseUri(meta("base-uri 'self'")), false);
});
test("doppelte oder erweiterte Basisadress-Regeln werden abgewiesen", () => {
  assert.equal(hasStrictBaseUri(meta("base-uri 'none'; base-uri 'none'")), false);
  assert.equal(hasStrictBaseUri(meta("base-uri 'none' https://example.org")), false);
});
test("fehlender oder mehrfacher CSP-Metatags werden abgewiesen", () => {
  assert.equal(hasStrictBaseUri("<html><head></head></html>"), false);
  assert.equal(hasStrictBaseUri(meta("base-uri 'none'")+meta("base-uri 'none'")), false);
});
