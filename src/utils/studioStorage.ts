import { CustomDocTemplate } from '../types/customDoc';
import { getInitialCustomDoc } from '../data/initialCustomDoc';
import { isMapAssetUrl } from '../data/tdsPhotoAssets';
import { Language } from '../i18n/translations';

/** Current storage key. v3 is the legacy key that is migrated (read-only) on first load. */
export const STORAGE_KEY_STUDIO_DOC = 'tds_studio_doc_template_v4';
const LEGACY_STORAGE_KEY_STUDIO_DOC = 'tds_studio_doc_template_v3';
const STORAGE_KEY_STUDIO_UI = 'tds_studio_ui_v1';

/** Tower names/images that older versions pre-filled into every new strategy. */
const LEGACY_DEFAULT_LOADOUT: Record<string, string> = {
  s1: 'Accelerator',
  s2: 'Commander',
  s3: 'DJ Booth',
  s4: 'Farm',
  s5: 'Minigunner',
  s6: 'Ranger',
  s7: 'Golden Scout',
  s8: 'Brawler',
  s9: 'Medic',
  s10: 'Warden'
};
const LEGACY_DEFAULT_PLAYER_TOWERS: Record<string, string> = {
  pt1: 'Accelerator',
  pt2: 'Commander',
  pt3: 'DJ Booth',
  pt4: 'Farm',
  pt5: 'Minigunner',
  pt6: 'Ranger',
  pt7: 'Golden Scout',
  pt8: 'Brawler',
  pt9: 'Medic',
  pt10: 'Warden'
};

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Fills fields that are missing from a stored document with the defaults, WITHOUT touching anything
 * the user already has (arrays such as players, towers and tokens are kept exactly as saved).
 */
const fillMissing = <T,>(saved: unknown, defaults: T): T => {
  if (Array.isArray(defaults)) return (Array.isArray(saved) ? saved : defaults) as unknown as T;
  if (isPlainObject(defaults)) {
    const src = isPlainObject(saved) ? saved : {};
    const out: Record<string, unknown> = { ...src };
    for (const key of Object.keys(defaults)) {
      out[key] = key in src ? fillMissing(src[key], (defaults as Record<string, unknown>)[key]) : (defaults as Record<string, unknown>)[key];
    }
    return out as T;
  }
  return (saved === undefined || saved === null ? defaults : saved) as T;
};

/** True when every hero slot of a legacy document is still exactly the old pre-filled default. */
const isUntouchedLegacyTowerSet = (doc: CustomDocTemplate): boolean => {
  const rows = doc.tab2?.loadoutRows ?? [];
  const players = doc.tab2?.players ?? [];
  const slots = rows.flatMap(r => r.slots);
  const towers = players.flatMap(p => p.towers);
  if (slots.length === 0 && towers.length === 0) return false;
  const slotsPristine = slots.every(s => LEGACY_DEFAULT_LOADOUT[s.id] === s.name);
  const towersPristine = towers.every(t => LEGACY_DEFAULT_PLAYER_TOWERS[t.id] === t.name);
  return slotsPristine && towersPristine;
};

const clearHeroSlots = (doc: CustomDocTemplate): CustomDocTemplate => ({
  ...doc,
  tab2: {
    ...doc.tab2,
    loadoutRows: doc.tab2.loadoutRows.map(r => ({ ...r, slots: r.slots.map(s => ({ ...s, name: '', image: '' })) })),
    players: doc.tab2.players.map(p => ({ ...p, towers: p.towers.map(t => ({ ...t, name: '', image: '' })) }))
  }
});

/** A map image must never live in a hero (tower) slot. Everything else is left as the user saved it. */
const stripMapsFromHeroSlots = (doc: CustomDocTemplate): CustomDocTemplate => ({
  ...doc,
  tab2: {
    ...doc.tab2,
    loadoutRows: (doc.tab2.loadoutRows ?? []).map(r => ({
      ...r,
      slots: (r.slots ?? []).map(s => (isMapAssetUrl(s.image) ? { ...s, name: '', image: '' } : s))
    })),
    players: (doc.tab2.players ?? []).map(p => ({
      ...p,
      towers: (p.towers ?? []).map(t => (isMapAssetUrl(t.image) ? { ...t, name: '', image: '' } : t))
    }))
  }
});

const readJson = (key: string): unknown => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error(`Failed to read "${key}" from storage:`, e);
    return null;
  }
};

const looksLikeDoc = (v: unknown): v is CustomDocTemplate => isPlainObject(v) && isPlainObject(v.tab1) && isPlainObject(v.tab2);

/**
 * Loads the latest saved Strategy Studio document.
 * - Current key first; otherwise the legacy key is migrated once.
 * - Towers are NEVER auto-filled: an empty slot stays empty.
 * - A legacy draft whose towers are all still the old pre-filled defaults (user never chose any) is emptied.
 */
export const loadStudioDoc = (lang?: Language): CustomDocTemplate => {
  const defaults = getInitialCustomDoc(lang);

  const current = readJson(STORAGE_KEY_STUDIO_DOC);
  if (looksLikeDoc(current)) {
    return stripMapsFromHeroSlots(fillMissing(current, defaults));
  }

  const legacy = readJson(LEGACY_STORAGE_KEY_STUDIO_DOC);
  if (looksLikeDoc(legacy)) {
    let migrated = stripMapsFromHeroSlots(fillMissing(legacy, defaults));
    if (isUntouchedLegacyTowerSet(migrated)) migrated = clearHeroSlots(migrated);
    saveStudioDoc(migrated);
    return migrated;
  }

  return defaults;
};

export interface SaveResult {
  ok: boolean;
  error?: string;
}

/** Writes the document to localStorage. Never throws; reports quota/security failures. */
export const saveStudioDoc = (doc: CustomDocTemplate): SaveResult => {
  try {
    localStorage.setItem(STORAGE_KEY_STUDIO_DOC, JSON.stringify(doc));
    return { ok: true };
  } catch (e) {
    console.error('Failed to save studio doc draft:', e);
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
};

// ---------- small UI state (which page tab the user was on) ----------

export type StudioPageTab = 'tab1' | 'tab2';

export const loadStudioActiveTab = (): StudioPageTab => {
  const ui = readJson(STORAGE_KEY_STUDIO_UI);
  return isPlainObject(ui) && (ui.activeTab === 'tab1' || ui.activeTab === 'tab2') ? ui.activeTab : 'tab1';
};

export const saveStudioActiveTab = (activeTab: StudioPageTab): void => {
  try {
    localStorage.setItem(STORAGE_KEY_STUDIO_UI, JSON.stringify({ activeTab }));
  } catch (e) {
    console.error('Failed to save studio UI state:', e);
  }
};
