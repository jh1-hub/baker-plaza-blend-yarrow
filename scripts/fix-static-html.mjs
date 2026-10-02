#!/usr/bin/env node
/**
 * Post-process Nitro/Vercel static HTML so it works on both Vercel and GitHub Pages:
 * - Strip NUL bytes TanStack Start bakes into the prerender payload (they make
 *   `grep` treat the file as binary and can break hydration).
 * - Prefix leftover root-absolute `/__grok/` links when `BASE_PATH` is a subpath
 *   (the PWA injector always emits `/__grok/...`, which 404s on project Pages).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export function normalizeBase(raw) {
  const trimmed = String(raw ?? "").trim() || "/";
  if (trimmed === "/") return "/";
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withSlash.endsWith("/") ? withSlash : `${withSlash}/`;
}

export function fixHtml(html, base = "/") {
  let out = String(html).replaceAll("\u0000", "");
  const prefix = normalizeBase(base);
  if (prefix !== "/") {
    out = out.replace(/(["'(=])\/__grok\//g, `$1${prefix}__grok/`);
  }
  return out;
}

export function pagesManifest(base = "/") {
  const root = normalizeBase(base);
  return `${JSON.stringify(
    {
      name: "DATA HUNTER",
      short_name: "DATA HUNTER",
      id: root,
      start_url: root,
      scope: root,
      display: "standalone",
      background_color: "#05080c",
      theme_color: "#05080c",
      icons: [
        {
          src: `${root}__grok/icon-180.png`,
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    null,
    2,
  )}\n`;
}

function walkHtml(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(path, files);
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(path);
  }
  return files;
}

export function fixStaticDir(dir, { base = process.env.BASE_PATH || "/" } = {}) {
  const files = walkHtml(dir);
  let changed = 0;
  for (const file of files) {
    const before = readFileSync(file);
    const after = Buffer.from(fixHtml(before.toString("utf8"), base), "utf8");
    if (!before.equals(after)) {
      writeFileSync(file, after);
      changed += 1;
    }
  }
  return { files: files.length, changed };
}

function isMain() {
  if (!process.argv[1]) return false;
  return pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
}

if (isMain()) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const dir = process.argv[2]
    ? join(process.cwd(), process.argv[2])
    : join(root, ".vercel/output/static");
  if (!existsSync(dir)) {
    console.error(`[static-html] missing ${dir}`);
    process.exit(1);
  }
  const result = fixStaticDir(dir);
  console.log(`[static-html] scanned ${result.files} html, wrote ${result.changed}`);
}
