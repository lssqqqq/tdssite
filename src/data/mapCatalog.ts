import { MAPS_MANIFEST } from './mapsManifest.generated';
import { formatMapName } from '../utils/formatMapName';

/**
 * Central map catalog.
 *
 * Every map image placed in public/assets/maps/ is registered here automatically through
 * src/data/mapsManifest.generated.ts (see public/assets/maps/README.md). The editor works with
 * ANY entry of this catalog - there is no per-map component or per-map code.
 */
export interface MapDefinition {
  /** Stable id derived from the file name, e.g. "wrecked-battlefield" */
  id: string;
  /** Readable display name derived from the file name, e.g. "Wrecked Battlefield". Display only - never used for loading. */
  name: string;
  /** File name inside public/assets/maps/ */
  file: string;
  /** URL the browser loads the (unmodified) background image from */
  url: string;
  /** Natural pixel size of the image */
  width: number;
  height: number;
  /** width / height - the canvas uses this so the map is never stretched or cropped */
  aspectRatio: number;
}

export const MAP_CATALOG: MapDefinition[] = MAPS_MANIFEST.map((m) => ({
  id: m.id,
  // Display name only: `file` and `url` stay exactly as on disk so images and saved strategies keep working.
  name: formatMapName(m.file) || m.file,
  file: m.file,
  url: m.url,
  width: m.width,
  height: m.height,
  aspectRatio: m.width / m.height,
})).sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }) || a.file.localeCompare(b.file));

export const getMapById = (id: string): MapDefinition | undefined => MAP_CATALOG.find((m) => m.id === id);

export const getMapByFile = (file: string): MapDefinition | undefined => MAP_CATALOG.find((m) => m.file === file);

/** Find a catalog map from the URL stored in a document (tolerates encoded / decoded spaces). */
export const getMapByUrl = (url?: string): MapDefinition | undefined => {
  if (!url) return undefined;
  const safeDecode = (s: string) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  };
  const wanted = safeDecode(url);
  return MAP_CATALOG.find((m) => safeDecode(m.url) === wanted);
};
