import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const PUBLIC_ROOT = path.join(DIST, "games", "Prisma-Abyss");

// Keep this list aligned with _config.yml's production exclusions.
// Additional entries below are Cloudflare/build plumbing that must not be
// published as game assets.
const EXCLUDED_TOP_LEVEL = new Set([
  ".git",
  ".github",
  ".agents",
  ".wrangler",
  "node_modules",
  "dist",
  "image-backups",
  "edit",
  "canon",
  "development_notes",
  "docs",
  "tools",
  "logs",
  "worker"
]);

const EXCLUDED_ROOT_FILES = new Set([
  ".gitignore",
  "_config.yml",
  "package.json",
  "package-lock.json",
  "wrangler.jsonc",
  "README-CLOUDFLARE.txt"
]);

await rm(DIST, { recursive: true, force: true });
await mkdir(PUBLIC_ROOT, { recursive: true });

const entries = await readdir(ROOT, { withFileTypes: true });

for (const entry of entries) {
  if (EXCLUDED_TOP_LEVEL.has(entry.name)) continue;
  if (entry.isFile() && EXCLUDED_ROOT_FILES.has(entry.name)) continue;

  const source = path.join(ROOT, entry.name);
  const target = path.join(PUBLIC_ROOT, entry.name);

  await cp(source, target, {
    recursive: true,
    force: true,
    errorOnExist: false
  });
}

async function summarize(dir) {
  let files = 0;
  let bytes = 0;
  let largest = { path: "", bytes: 0 };

  async function walk(current) {
    const children = await readdir(current, { withFileTypes: true });
    for (const child of children) {
      const full = path.join(current, child.name);
      if (child.isDirectory()) {
        await walk(full);
      } else if (child.isFile()) {
        const info = await stat(full);
        files += 1;
        bytes += info.size;
        if (info.size > largest.bytes) largest = { path: full, bytes: info.size };
      }
    }
  }

  await walk(dir);
  return { files, bytes, largest };
}

const summary = await summarize(PUBLIC_ROOT);
const mib = (n) => (n / 1024 / 1024).toFixed(2);

if (summary.files > 20000) {
  throw new Error(`Static asset count ${summary.files} exceeds the 20,000-file Free-plan guard.`);
}

if (summary.largest.bytes > 25 * 1024 * 1024) {
  throw new Error(
    `Largest static asset exceeds 25 MiB: ${path.relative(ROOT, summary.largest.path)} (${mib(summary.largest.bytes)} MiB)`
  );
}

console.log(`Build complete: ${summary.files} files / ${mib(summary.bytes)} MiB`);
console.log(`Public root: ${path.relative(ROOT, PUBLIC_ROOT)}`);
console.log(`Largest asset: ${path.relative(ROOT, summary.largest.path)} (${mib(summary.largest.bytes)} MiB)`);
