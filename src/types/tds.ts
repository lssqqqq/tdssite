export const OFFICIAL_TAGS = [
  'Frost',
  'Fallen',
  'Hidden Wave',
  'Achievement',
  'Hardcore',
  'Event',
  'Challenge Trials',
  'Coin Grind',
  'Solo',
  'Duo',
  'Trio',
  'Quad',
  'Mission Quest',
  'Special Towers',
  'No Special Towers',
  'Modified',
  'Special Gamemodes',
  'No Skill Tree',
  'Skill Tree',
  'Voidcore',
  'Badlands II',
  'Polluted Wastelands II',
  'Pizza Party',
  'Gem Farm'
] as const;

export const TAG_ICONS: Record<string, string> = {
  'Frost': '🧊',
  'Fallen': '🦹',
  'Hidden Wave': '🕶️',
  'Achievement': '🏅',
  'Hardcore': '💎',
  'Event': '🎃',
  'Challenge Trials': '⚔️',
  'Coin Grind': '🪙',
  'Solo': '1️⃣',
  'Duo': '2️⃣',
  'Trio': '3️⃣',
  'Quad': '4️⃣',
  'Mission Quest': '📜',
  'Special Towers': '🏛️',
  'No Special Towers': '🚫',
  'Modified': '💪',
  'Special Gamemodes': '❗',
  'No Skill Tree': '🌱',
  'Skill Tree': '🌲',
  'Voidcore': '😈',
  'Badlands II': '🌵',
  'Polluted Wastelands II': '☣️',
  'Pizza Party': '🍕',
  'Gem Farm': '💎'
};

export type OfficialTag = typeof OFFICIAL_TAGS[number];

export interface Tactic {
  id: string;
  title: string;
  author: string; // Author name
  googleDocsUrl: string;
  tags: string[]; // e.g. ['Hardcore', 'Trio', 'Coin Grind']
  description?: string;
  towers?: string[];
  createdAt?: string;
}
