#!/usr/bin/env node
/**
 * Map manifest generator
 *
 * Scans  public/assets/maps/  for map background images and writes
 *        src/data/mapsManifest.generated.ts
 * which the Strategy Studio map catalog (src/data/mapCatalog.ts) reads.
 *
 * Run it with:  npm run maps
 * It also runs automatically before `npm run dev` and `npm run build`.
 *
 * - No dependencies (Node built-ins only).
 * - Image width/height are read from the file headers (PNG, JPEG, WebP).
 * - The original image files are never modified.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAPS_DIR = process.env.TDS_MAPS_DIR ? resolve(process.env.TDS_MAPS_DIR) : join(ROOT, 'public', 'assets', 'maps');
const OUT_FILE = process.env.TDS_MAPS_OUT ? resolve(process.env.TDS_MAPS_OUT) : join(ROOT, 'src', 'data', 'mapsManifest.generated.ts');
const URL_PREFIX = '/assets/maps/';
const SUPPORTED = new Set(['.png', '.jpg', '.jpeg', '.webp']);

/** Read pixel size from the image header. Returns null when the file is not a valid image. */
export function readImageSize(buf, ext) {
  try {
    if (ext === '.png') {
      const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
      if (buf.length < 24 || sig.some((b, i) => buf[i] !== b)) return null;
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
    if (ext === '.jpg' || ext === '.jpeg') {
      if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
      let i = 2;
      while (i + 9 < buf.length) {
        if (buf[i] !== 0xff) { i++; continue; }
        const marker = buf[i + 1];
        if (marker === 0xff) { i++; continue; }
        if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
        const len = buf.readUInt16BE(i + 2);
        const isSOF = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
        if (isSOF) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
        i += 2 + len;
      }
      return null;
    }
    if (ext === '.webp') {
      if (buf.length < 30 || buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null;
      const fourcc = buf.toString('ascii', 12, 16);
      if (fourcc === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
      if (fourcc === 'VP8L') {
        const bits = buf.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
      if (fourcc === 'VP8X') {
        return {
          width: 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16)),
          height: 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16)),
        };
      }
      return null;
    }
  } catch {
    return null;
  }
  return null;
}

/** Stable URL-safe id derived from the file name. */
export function slugFromFile(file) {
  const base = file.slice(0, file.length - extname(file).length);
  return base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'map';
}

export function scanMaps(dir = MAPS_DIR) {
  const warnings = [];
  const entries = [];
  if (!existsSync(dir)) {
    warnings.push(`Maps folder not found: ${dir}`);
    return { entries, warnings };
  }
  const usedIds = new Set();
  const files = readdirSync(dir).filter((f) => !f.startsWith('.')).sort((a, b) => a.localeCompare(b));
  for (const file of files) {
    const full = join(dir, file);
    if (!statSync(full).isFile()) continue;
    const ext = extname(file).toLowerCase();
    if (!SUPPORTED.has(ext)) {
      if (!/^readme(\.md)?$/i.test(file)) warnings.push(`Skipped "${file}": unsupported format (use .png, .jpg, .jpeg or .webp).`);
      continue;
    }
    const buf = readFileSync(full);
    const size = readImageSize(buf, ext);
    if (!size || !size.width || !size.height) {
      warnings.push(`Skipped "${file}": could not read the image size (is the file a valid ${ext} image?).`);
      continue;
    }
    let id = slugFromFile(file);
    if (usedIds.has(id)) id = `${id}-${ext.slice(1)}`;
    let n = 2;
    while (usedIds.has(id)) id = `${slugFromFile(file)}-${n++}`;
    usedIds.add(id);
    entries.push({
      id,
      file,
      url: URL_PREFIX + encodeURIComponent(file),
      width: size.width,
      height: size.height,
      bytes: buf.length,
    });
  }
  // Display names are NOT stored here: the app derives them from `file` with formatMapName()
  // (src/utils/formatMapName.ts), so there is a single place that defines how names look.
  entries.sort((a, b) => a.file.localeCompare(b.file, 'en', { sensitivity: 'base' }));
  return { entries, warnings };
}

export function renderManifest(entries) {
  const body = entries
    .map(
      (e) =>
        `  { id: ${JSON.stringify(e.id)}, file: ${JSON.stringify(e.file)}, url: ${JSON.stringify(e.url)}, width: ${e.width}, height: ${e.height}, bytes: ${e.bytes} },`
    )
    .join('\n');
  return `// AUTO-GENERATED by scripts/generate-maps-manifest.mjs - do not edit by hand.
// Source folder: public/assets/maps  (run \`npm run maps\` after adding or removing map images)

export interface MapManifestEntry {
  id: string;
  file: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
}

export const MAPS_MANIFEST: MapManifestEntry[] = [
${body}
];
`;
}

function main() {
  mkdirSync(MAPS_DIR, { recursive: true });
  const { entries, warnings } = scanMaps();
  for (const w of warnings) console.warn(`[maps] WARNING: ${w}`);
  const next = renderManifest(entries);
  const prev = existsSync(OUT_FILE) ? readFileSync(OUT_FILE, 'utf8') : null;
  if (prev !== next) {
    mkdirSync(dirname(OUT_FILE), { recursive: true });
    writeFileSync(OUT_FILE, next, 'utf8'); // only rewritten when the list changed (avoids needless hot reloads)
    console.log(`[maps] Updated manifest: ${entries.length} map(s).`);
  } else {
    console.log(`[maps] Manifest is up to date: ${entries.length} map(s).`);
  }
  for (const e of entries) console.log(`[maps]   ${e.id}  ${e.width}x${e.height}  ${e.file}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
