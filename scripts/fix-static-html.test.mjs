import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fixHtml, fixStaticDir, normalizeBase, pagesManifest } from "./fix-static-html.mjs";

test("normalizeBase always has a trailing slash", () => {
  assert.equal(normalizeBase(""), "/");
  assert.equal(normalizeBase("/"), "/");
  assert.equal(normalizeBase("/data-hunter"), "/data-hunter/");
  assert.equal(normalizeBase("/data-hunter/"), "/data-hunter/");
});

test("strips prerender NULs without breaking empty route ids", () => {
  const raw = '{i:"__root__\u0000",u:1},{i:"\u0000\u0000",u:2}';
  assert.equal(fixHtml(raw, "/"), '{i:"__root__",u:1},{i:"",u:2}');
});

test("prefixes leftover /__grok/ without double-prefixing", () => {
  const html =
    '<link rel="manifest" href="/data-hunter/__grok/manifest.webmanifest">' +
    '<link rel="manifest" href="/__grok/manifest.webmanifest">' +
    '<link rel="apple-touch-icon" href="/__grok/icon-180.png">';
  const out = fixHtml(html, "/data-hunter/");
  assert.equal(
    out,
    '<link rel="manifest" href="/data-hunter/__grok/manifest.webmanifest">' +
      '<link rel="manifest" href="/data-hunter/__grok/manifest.webmanifest">' +
      '<link rel="apple-touch-icon" href="/data-hunter/__grok/icon-180.png">',
  );
  assert.equal(fixHtml(html, "/"), html.replaceAll("\u0000", ""));
});

test("pagesManifest uses the subpath as scope", () => {
  const parsed = JSON.parse(pagesManifest("/data-hunter"));
  assert.equal(parsed.start_url, "/data-hunter/");
  assert.equal(parsed.scope, "/data-hunter/");
  assert.equal(parsed.icons[0].src, "/data-hunter/__grok/icon-180.png");
});

test("fixStaticDir rewrites html in nested folders", () => {
  const dir = mkdtempSync(join(tmpdir(), "fix-static-"));
  mkdirSync(join(dir, "nested"));
  writeFileSync(join(dir, "index.html"), '<a href="/__grok/x">x</a>');
  writeFileSync(join(dir, "nested", "page.html"), '<a href="/__grok/y">y</a>');
  const result = fixStaticDir(dir, { base: "/repo/" });
  assert.equal(result.changed, 2);
  assert.equal(readFileSync(join(dir, "index.html"), "utf8"), '<a href="/repo/__grok/x">x</a>');
});
