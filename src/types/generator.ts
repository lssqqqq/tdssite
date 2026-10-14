export type TowerCategory = 'Hardcore' | 'Golden' | 'Support' | 'Damage' | 'Economy' | 'Event' | 'Custom';

export interface TowerItem {
  id: string;
  name: string;
  nameRu?: string;
  category: TowerCategory;
  cost: number;
  dps?: string;
  image: string; // image URL or base64 or SVG
  color: string;
  range: number; // visual radius in canvas percent/px
  cliff?: boolean;
  maxPlacement?: number;
  description?: string;
}

export type MapTheme = 'grass' | 'desert' | 'wasteland' | 'snow' | 'cyber' | 'inferno' | 'retro';

export interface MapPoint {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface MapCliffZone {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
}

export interface MapItem {
  id: string;
  name: string;
  nameRu?: string;
  difficulty: 'Easy' | 'Normal' | 'Intermediate' | 'Hard' | 'Special' | 'Event';
  waves: number;
  theme: MapTheme;
  image: string;
  trackPoints: MapPoint[];
  cliffZones: MapCliffZone[];
  description: string;
  recommendedTowers?: string[];
}

export type PlayerSlot = 'P1' | 'P2' | 'P3' | 'P4';

export interface PlacedTower {
  id: string;
  towerId: string;
  towerName: string;
  towerImage: string;
  towerColor: string;
  x: number; // percentage 0 - 100 on canvas
  y: number; // percentage 0 - 100 on canvas
  player: PlayerSlot;
  level: number; // 0 to 5
  target: 'First' | 'Last' | 'Strongest' | 'Weakest';
  notes?: string;
  range?: number;
}

export interface WaveStep {
  id: string;
  wave: number;
  player: PlayerSlot | 'All';
  action: string;
  notes: string;
  skip?: boolean;
}

export interface PlayerDeck {
  player: PlayerSlot;
  role: string;
  towers: TowerItem[];
}

export interface StrategyDocData {
  title: string;
  author: string;
  creators: string;
  notesTab1: string;
  notesTab2: string;
  heroTowers: TowerItem[];
  freeDocContent: string;
  gamemode: string;
  playersCount: 'Solo' | 'Duo' | 'Trio' | 'Quad';
  selectedMap: MapItem;
  placedTowers: PlacedTower[];
  playerDecks: PlayerDeck[];
  waveSteps: WaveStep[];
  generalNotes: string;
  tags: string[];
}
