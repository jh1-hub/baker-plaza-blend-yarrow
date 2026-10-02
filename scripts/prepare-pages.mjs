#!/usr/bin/env node
/**
 * Pack Nitro/Vercel static output into `dist/` for GitHub Pages.
 * Copies index.html → 404.html so client-side routing still works.
 */
import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { fixStaticDir, pagesManifest } from "./fix-static-html.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, ".vercel/output/static");
const dest = join(root, "dist");
const base = process.env.BASE_PATH || "/";

if (!existsSync(src)) {
  console.error("[pages] missing .vercel/output/static — run the production build first");
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });

const index = join(dest, "index.html");
if (!existsSync(index)) {
  console.error("[pages] no index.html in static output — prerender did not emit a shell");
  process.exit(1);
}

const fixed = fixStaticDir(dest, { base });
copyFileSync(index, join(dest, "404.html"));

const grokDir = join(dest, "__grok");
mkdirSync(grokDir, { recursive: true });
writeFileSync(join(grokDir, "manifest.webmanifest"), pagesManifest(base));
writeFileSync(join(dest, ".nojekyll"), "");

console.log(
  `[pages] wrote dist/ (index.html, 404.html, .nojekyll, manifest) base=${base} htmlFixed=${fixed.changed}`,
);
