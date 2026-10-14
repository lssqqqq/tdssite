import { CanvasSettings } from '../types/customDoc';

/**
 * Table widths are stored in the strategy data as a PERCENTAGE of the page's content area
 * (the sheet width minus its margins). Because the value is relative, a table keeps the same
 * proportion when the page format, orientation or margins change, and it can never be wider
 * than the permitted content area.
 */
export const TABLE_WIDTH_MAX_PCT = 100;
export const TABLE_WIDTH_MIN_PCT = 30;
export const TABLE_WIDTH_DEFAULT_PCT = 100;

/** Clamp a stored/dragged width into the allowed range. Missing or invalid values fall back to the default. */
export function normalizeTableWidth(value: number | undefined | null): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return TABLE_WIDTH_DEFAULT_PCT;
  return Math.min(TABLE_WIDTH_MAX_PCT, Math.max(TABLE_WIDTH_MIN_PCT, Math.round(value * 10) / 10));
}

/** Smallest readable width, in px, of each kind of table (the frame never renders narrower than this unless the page itself is). */
export const TABLE_MIN_PX = {
  notes: 280,
  loadouts: 440,
  playerBlock: 320,
  commonIssues: 280
} as const;

// ---------------------------------------------------------------------------
// Page geometry (used by the DOCX / HTML exports so a stored percentage means
// the same thing in the exported file as it does on screen)
// ---------------------------------------------------------------------------

const TWIPS_PER_MM = 1440 / 25.4;

export const mmToTwips = (mm: number): number => Math.round(mm * TWIPS_PER_MM);

/** Portrait page size in mm for a canvas format. 'fluid' has no physical size and exports as A4. */
function portraitSizeMm(settings: Partial<CanvasSettings> | undefined): { w: number; h: number } {
  switch (settings?.format) {
    case 'letter':
      return { w: 215.9, h: 279.4 };
    case 'a3':
      return { w: 297, h: 420 };
    case 'widescreen':
      return { w: 185, h: 330 };
    case 'custom':
      return { w: settings.customWidthMm || 210, h: settings.customHeightMm || 297 };
    case 'a4':
    case 'fluid':
    default:
      return { w: 210, h: 297 };
  }
}

function marginMm(settings: Partial<CanvasSettings> | undefined): number {
  switch (settings?.margins) {
    case 'narrow':
      return 12.7;
    case 'moderate':
      return 19;
    case 'wide':
      return 35;
    case 'none':
      return 4;
    case 'custom':
      return settings.customMarginsMm || 20;
    case 'normal':
    default:
      return 25.4;
  }
}

export interface ExportPageGeometry {
  /** Portrait width/height in twips (the docx library swaps them itself when orientation is landscape). */
  portraitWidthTwips: number;
  portraitHeightTwips: number;
  landscape: boolean;
  marginTwips: number;
  /** Width of the area tables may occupy, in twips, for the chosen orientation and margins. */
  contentWidthTwips: number;
}

export function getExportPageGeometry(settings: Partial<CanvasSettings> | undefined): ExportPageGeometry {
  const { w, h } = portraitSizeMm(settings);
  const landscape = settings?.orientation === 'landscape';
  const margin = marginMm(settings);
  const pageW = landscape ? h : w;
  return {
    portraitWidthTwips: mmToTwips(w),
    portraitHeightTwips: mmToTwips(h),
    landscape,
    marginTwips: mmToTwips(margin),
    contentWidthTwips: Math.max(mmToTwips(50), mmToTwips(pageW - margin * 2))
  };
}

/** Width of a table in twips for a stored percentage on a given page. */
export function tableWidthTwips(pct: number | undefined, geometry: ExportPageGeometry): number {
  return Math.round((geometry.contentWidthTwips * normalizeTableWidth(pct)) / 100);
}
