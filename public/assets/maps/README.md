# Map images

This folder holds the **clean background image** of every Tower Defense Simulator map
(no towers, labels or markers on it). Strategy Studio draws towers, labels, arrows and
other annotations *on top of* these images as separate objects - the files in this folder
are never modified.

## Adding a new map

1. **Put the image file in this folder** (`public/assets/maps/`).
2. **Register it**, with one of these:
   - run `npm run maps`  (works while `npm run dev` is running - the page updates by itself), or
   - just restart `npm run dev`  (the list is rebuilt automatically on start), or
   - run `npm run build`  (also rebuilds the list automatically).
3. The map appears in Strategy Studio's map selection. No component needs to be edited.

If a new map does not show up, run `npm run maps` and read its messages: it tells you
which files it skipped and why.

## Supported formats

`.png`, `.jpg`, `.jpeg`, `.webp`  (PNG recommended - lossless).

Any size and aspect ratio works. The editor reads each image's real width/height and shows
the whole map without stretching or cropping. Use the original, uncompressed screenshot where
possible: maps are exported to DOCX at high resolution.

## File names

The file name becomes the map name shown in the editor. The conversion lives in ONE place,
`src/utils/formatMapName.ts`, and is used for display only - the file name itself (and the image
URL derived from it) is never changed.

| File name                 | Name shown in the editor |
|---------------------------|--------------------------|
| `Wrecked_Battlefield.png` | Wrecked Battlefield      |
| `wretched-front.png`      | Wretched Front           |
| `the_ancient_ruins_v2.png`| The Ancient Ruins V2     |
| `Void Kingdom.webp`       | Void Kingdom             |

- The extension is removed; `_`, `-` and repeated spaces become single spaces; every word starts
  with a capital letter (numbers and roman numerals such as `II` are kept).
- Keep the name stable. Saved strategies refer to a map by its file name, so renaming a file
  later disconnects it from strategies that already use it.
- Do not put anything else in this folder except this README (other file types are skipped).

## How it works (for developers)

`scripts/generate-maps-manifest.mjs` scans this folder and writes
`src/data/mapsManifest.generated.ts` (file name, URL and pixel size of each map).
`src/data/mapCatalog.ts` turns that list into the catalog used by the editor and derives each
readable display name from the file name with `formatMapName()` (`src/utils/formatMapName.ts`).
The generated file is committed with the project, so the app also works without running the script.
