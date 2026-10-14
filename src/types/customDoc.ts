export interface AvatarItem {
  id: string;
  name: string; // Default "Name"
  image: string; // Black & white avatar/logo
  role?: string;
}

export interface AvatarCategory {
  id: string;
  title: string; // e.g. "CREATORS", "PLACEMENT MAP MAKER", "TESTERS", or custom
  members: AvatarItem[];
}

export interface TableRowItem {
  id: string;
  label: string; // Placeholder "title"
  content: string; // Placeholder "write here..."
}

export interface PlacedMapToken {
  id: string;
  x: number; // percent 0-100 on photo
  y: number; // percent 0-100 on photo
  label: string; // "1", "2", "3", "DJ", "Bait", etc.
  towerName?: string;
  towerImage?: string;
  color?: string; // outline colour of the placement circle, e.g. '#f5c518'
  size?: number; // diameter multiplier relative to the default size (1 = default)
}

export interface PlayerStrategyBlock {
  id: string;
  playerTitle: string; // e.g. "PLAYER 1"
  difficultyBadge: string; // e.g. "Difficulty: Normal", "POV: Watch"
  towers: { id: string; name: string; image: string; cost?: string }[];
  mapTitle?: string;
  hideMap?: boolean;
  mapPhoto: string;
  tokens: PlacedMapToken[];
  notesTitle?: string;
  hideNotes?: boolean;
  notes: string;
  waveRows: { wave: string; instructions: string }[];
  /** Width of this player's map/notes/waves table, as a percentage (TABLE_WIDTH_MIN_PCT-100) of the page content area. Undefined = full width. */
  tableWidth?: number;
}

export interface LoadoutSlot {
  id: string;
  name: string;
  image: string;
}

export interface LoadoutRow {
  id: string;
  playerTitle: string; // "Player 1", "Player 2", etc.
  slots: LoadoutSlot[];
}

export interface CommonIssueRow {
  id: string;
  wave: string; // "Wave 1 - 10" or "title"
  reason: string; // "write here..."
}

export type PageFormat = 'a4' | 'letter' | 'a3' | 'widescreen' | 'fluid' | 'custom';
export type PageOrientation = 'portrait' | 'landscape';
export type PageMargin = 'normal' | 'narrow' | 'moderate' | 'wide' | 'none' | 'custom';
export type PageTheme = 'black' | 'dark' | 'graphite' | 'midnight' | 'white' | 'paper' | 'custom';
export type PageLayoutMode = 'multi-page' | 'continuous' | 'tab1' | 'tab2';

export interface CanvasSettings {
  format: PageFormat;
  orientation: PageOrientation;
  margins: PageMargin;
  customMarginsMm?: number;
  customWidthMm?: number;
  customHeightMm?: number;
  theme: PageTheme;
  customBgColor?: string;
  zoom: number; // 0.5 - 2.0
  layoutMode: PageLayoutMode;
  showGrid: boolean;
  showPageNumbers: boolean;
}

export interface CustomPageBlock {
  id: string;
  title: string;
  content: string;
  tableRows?: { id: string; label: string; content: string }[];
}

export interface CustomDocTemplate {
  // Saved canvas layout & style settings
  canvasSettings?: CanvasSettings;

  // Tab 1 (First Photo)
  tab1: {
    bannerImage: string;
    subBannerText: string;
    // Dynamic categories (CREATORS, PLACEMENT MAP MAKER, TESTERS, etc.)
    categories: AvatarCategory[];
    notesTitle: string;
    notesRows: TableRowItem[];
    /** Width of the notes table as a % of the page content area. Undefined = full width. */
    notesTableWidth?: number;
    extraSections?: { id: string; title: string; content: string }[];
  };

  // Tab 2 (Second & Third Photo)
  tab2: {
    topNotesTitle: string;
    topNotesRows: TableRowItem[];
    /** Width of the top notes table as a % of the page content area. Undefined = full width. */
    topNotesTableWidth?: number;
    loadoutsTitle: string;
    loadoutRows: LoadoutRow[];
    /** Width of the LOADOUTS table as a % of the page content area. Undefined = full width. */
    loadoutsTableWidth?: number;
    strategyTitle: string;
    players: PlayerStrategyBlock[];
    commonIssuesTitle: string;
    commonIssuesRows: CommonIssueRow[];
    /** Width of the common issues table as a % of the page content area. Undefined = full width. */
    commonIssuesTableWidth?: number;
  };

  // Additional custom pages
  extraPages?: CustomPageBlock[];

  /** Top-level sections the user deleted (so they stay deleted after a refresh). Key = section id. */
  hiddenSections?: Record<string, boolean>;
}

