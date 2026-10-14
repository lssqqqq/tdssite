import { TowerItem, MapItem, WaveStep } from '../types/generator';

// Helper to create distinctive SVG badges as data URIs for TDS towers (fallback helper)
export const createTowerSvg = (bgColor: string, accentColor: string, iconSymbol: string, nameText: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      <linearGradient id="g_${nameText.replace(/\s+/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgColor}" />
        <stop offset="100%" stop-color="#0a0a0a" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="20" fill="url(#g_${nameText.replace(/\s+/g, '')})" stroke="${accentColor}" stroke-width="3" />
    <circle cx="50" cy="45" r="28" fill="${accentColor}" fill-opacity="0.15" stroke="${accentColor}" stroke-width="1.5" />
    <text x="50" y="54" font-size="28" text-anchor="middle" dominant-baseline="middle">${iconSymbol}</text>
    <rect x="8" y="76" width="84" height="18" rx="5" fill="#000000" fill-opacity="0.8" stroke="${accentColor}" stroke-width="1" />
    <text x="50" y="89" font-size="9.5" font-family="monospace" font-weight="bold" fill="#ffffff" text-anchor="middle">${nameText.slice(0, 14)}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Helper to create stylized map thumbnails
export const createMapSvg = (terrainColor: string, roadColor: string, mapName: string, icon: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="200" height="120">
    <rect width="200" height="120" rx="14" fill="${terrainColor}" stroke="#333333" stroke-width="2" />
    <!-- Path track -->
    <path d="M 0 30 Q 60 20 70 60 T 130 60 T 200 90" fill="none" stroke="${roadColor}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 0 30 Q 60 20 70 60 T 130 60 T 200 90" fill="none" stroke="#222222" stroke-width="3" stroke-dasharray="6,6" />
    <!-- Cliffs -->
    <rect x="25" y="70" width="35" height="35" rx="6" fill="#1f2937" stroke="#4b5563" stroke-width="1.5" />
    <text x="42" y="92" font-size="10" font-family="monospace" fill="#9ca3af" text-anchor="middle">CLIFF</text>
    <rect x="135" y="15" width="45" height="25" rx="6" fill="#1f2937" stroke="#4b5563" stroke-width="1.5" />
    <text x="157" y="32" font-size="9" font-family="monospace" fill="#9ca3af" text-anchor="middle">CLIFF</text>
    <!-- Overlay badge -->
    <rect x="8" y="8" width="28" height="28" rx="8" fill="#000000" fill-opacity="0.75" />
    <text x="22" y="27" font-size="16" text-anchor="middle">${icon}</text>
    <!-- Label -->
    <rect x="8" y="92" width="184" height="22" rx="6" fill="#000000" fill-opacity="0.85" stroke="#404040" stroke-width="1" />
    <text x="100" y="107" font-size="11" font-family="sans-serif" font-weight="bold" fill="#ffffff" text-anchor="middle">${mapName}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const TDS_TOWERS: TowerItem[] = [
  {
    id: 'golden-scout',
    name: 'Golden Scout',
    nameRu: 'Golden Scout',
    category: 'Golden',
    cost: 300,
    dps: 'Early Game King',
    image: '/assets/towers/Golden Scout.png',
    color: '#eab308',
    range: 14,
    description: 'Best early game start. Easily holds early waves for low cost with rapid firerate.'
  },
  {
    id: 'golden-cowboy',
    name: 'Golden Cowboy',
    nameRu: 'Golden Cowboy',
    category: 'Golden',
    cost: 700,
    dps: 'Cash & DPS',
    image: '/assets/towers/Golden Cowboy.png',
    color: '#eab308',
    range: 16,
    description: 'Generates cash with every shot while delivering solid damage bursts.'
  },
  {
    id: 'golden-crook-boss',
    name: 'Golden Crook Boss',
    nameRu: 'Golden Crook Boss',
    category: 'Golden',
    cost: 800,
    dps: 'Guards & DPS',
    image: '/assets/towers/Golden Crook Boss.png',
    color: '#eab308',
    range: 16,
    description: 'Golden mob boss summoning elite golden guards and mafiosos to patrol the track.'
  },
  {
    id: 'golden-demoman',
    name: 'Golden Demoman',
    nameRu: 'Golden Demoman',
    category: 'Golden',
    cost: 450,
    dps: 'Heavy Explosive AoE',
    image: '/assets/towers/Golden Demoman.png',
    color: '#eab308',
    range: 15,
    description: 'Golden grenadier firing high-yield explosive rounds into swarms.'
  },
  {
    id: 'golden-minigunner',
    name: 'Golden Minigunner',
    nameRu: 'Golden Minigunner',
    category: 'Golden',
    cost: 1500,
    dps: '210 DPS',
    image: '/assets/towers/Golden Minigunner.png',
    color: '#eab308',
    range: 17,
    description: 'Enhanced golden variant with higher DPS, shorter windup, and immense sustained damage.'
  },
  {
    id: 'golden-pyromancer',
    name: 'Golden Pyromancer',
    nameRu: 'Golden Pyromancer',
    category: 'Golden',
    cost: 600,
    dps: 'Armor Melt & Slow',
    image: '/assets/towers/Golden Pyromancer.png',
    color: '#eab308',
    range: 15,
    description: 'Golden flame projector melting armor while heavily slowing enemy speed.'
  },
  {
    id: 'golden-soldier',
    name: 'Golden Soldier',
    nameRu: 'Golden Soldier',
    category: 'Golden',
    cost: 350,
    dps: 'Burst Assault DPS',
    image: '/assets/towers/Golden Soldier.png',
    color: '#eab308',
    range: 15,
    description: 'Golden burst-fire rifleman with extended burst count and armor shred.'
  },
  {
    id: 'golden-snowballer',
    name: 'Golden Snowballer',
    nameRu: 'Golden Snowballer',
    category: 'Golden',
    cost: 500,
    dps: 'Freeze & Splash DPS',
    image: '/assets/towers/Golden Snowballer.png',
    color: '#eab308',
    range: 16,
    description: 'Golden frost thrower pelting enemies with rapid freeze projectiles.'
  },
  {
    id: 'accelerator',
    name: 'Accelerator',
    nameRu: 'Accelerator',
    category: 'Hardcore',
    cost: 2500,
    dps: '350+ DPS',
    image: '/assets/towers/Accelerator.png',
    color: '#a855f7',
    range: 18,
    description: 'Primary Hardcore DPS tower with a high-powered sustained laser beam.'
  },
  {
    id: 'engineer',
    name: 'Engineer',
    nameRu: 'Engineer',
    category: 'Hardcore',
    cost: 3000,
    dps: '420+ DPS',
    image: '/assets/towers/Engineer.png',
    color: '#f59e0b',
    range: 17,
    description: 'Deploys up to 4 high-powered sentry turrets. Outstanding boss damage.'
  },
  {
    id: 'brawler',
    name: 'Brawler',
    nameRu: 'Brawler',
    category: 'Hardcore',
    cost: 1200,
    dps: 'Pushback Melee',
    image: '/assets/towers/Brawler.png',
    color: '#f43f5e',
    range: 11,
    description: 'Melee fighter capable of knocking back enemies along the track.'
  },
  {
    id: 'necromancer',
    name: 'Necromancer',
    nameRu: 'Necromancer',
    category: 'Hardcore',
    cost: 2800,
    dps: 'Spawn Skeletons',
    image: '/assets/towers/Necromancer.png',
    color: '#8b5cf6',
    range: 18,
    description: 'Summons hordes of skeletons and undead minions to stall the path.'
  },
  {
    id: 'mecha-base',
    name: 'Mecha Base',
    nameRu: 'Mecha Base',
    category: 'Hardcore',
    cost: 3500,
    dps: 'Heavy Mecha Units',
    image: '/assets/towers/Mecha Base.png',
    color: '#0284c7',
    range: 20,
    description: 'Produces massive mechanical walkers and war mechs with heavy cannons.'
  },
  {
    id: 'war-machine',
    name: 'War Machine',
    nameRu: 'War Machine',
    category: 'Hardcore',
    cost: 4500,
    dps: 'Colossal DPS',
    image: '/assets/towers/War Machine.png',
    color: '#dc2626',
    range: 22,
    description: 'Heavy experimental armored mech packing overwhelming firepower.'
  },
  {
    id: 'farm',
    name: 'Farm',
    nameRu: 'Farm',
    category: 'Economy',
    cost: 250,
    dps: '+$1,500/wave',
    image: '/assets/towers/Farm.png',
    color: '#22c55e',
    range: 10,
    maxPlacement: 8,
    description: 'Generates cash at the end of each wave. Backbone of any strategy.'
  },
  {
    id: 'cowboy',
    name: 'Cowboy',
    nameRu: 'Cowboy',
    category: 'Economy',
    cost: 650,
    dps: 'Income & DPS',
    image: '/assets/towers/Cowboy.png',
    color: '#b45309',
    range: 15,
    description: 'Dual-revolver gunslinger earning cash with every bullet fired.'
  },
  {
    id: 'commander',
    name: 'Commander',
    nameRu: 'Commander',
    category: 'Support',
    cost: 800,
    dps: 'Call to Arms Buff',
    image: '/assets/towers/Commander.png',
    color: '#3b82f6',
    range: 19,
    description: 'Boosts attack speed of all towers within radius by +55% (Call to Arms).'
  },
  {
    id: 'dj-booth',
    name: 'DJ Booth',
    nameRu: 'DJ Booth',
    category: 'Support',
    cost: 750,
    dps: 'Range & Discount',
    image: '/assets/towers/DJ Booth.png',
    color: '#ec4899',
    range: 22,
    description: 'Reduces upgrade costs by up to 20% and increases tower range by up to 35%.'
  },
  {
    id: 'medic',
    name: 'Medic',
    nameRu: 'Medic',
    category: 'Support',
    cost: 950,
    dps: 'Heal & Unstun',
    image: '/assets/towers/Medic.png',
    color: '#22c55e',
    range: 16,
    description: 'Cleanses tower stuns and restores base HP.'
  },
  {
    id: 'warden',
    name: 'Warden',
    nameRu: 'Warden',
    category: 'Support',
    cost: 1000,
    dps: 'Shock & Stun',
    image: '/assets/towers/Warden.png',
    color: '#6366f1',
    range: 12,
    description: 'Melee guardian using electric stun batons to incapacitate threats.'
  },
  {
    id: 'sledger',
    name: 'Sledger',
    nameRu: 'Sledger',
    category: 'Support',
    cost: 850,
    dps: 'Ice Freeze Melee',
    image: '/assets/towers/Sledger.png',
    color: '#38bdf8',
    range: 11,
    description: 'Strikes foes with an ice hammer to freeze and shatter them.'
  },
  {
    id: 'freezer',
    name: 'Freezer',
    nameRu: 'Freezer',
    category: 'Support',
    cost: 350,
    dps: 'Direct Freeze Ray',
    image: '/assets/towers/Freezer.png',
    color: '#0ea5e9',
    range: 14,
    description: 'Blasts enemies with sub-zero cryo beams, halting movement.'
  },
  {
    id: 'cryomancer',
    name: 'Cryomancer',
    nameRu: 'Cryomancer',
    category: 'Support',
    cost: 750,
    dps: 'Cold AoE Zone',
    image: '/assets/towers/Cryomancer.png',
    color: '#38bdf8',
    range: 16,
    description: 'Creates persistent ice storms that slow and freeze entire clusters.'
  },
  {
    id: 'electroshocker',
    name: 'Electroshocker',
    nameRu: 'Electroshocker',
    category: 'Support',
    cost: 600,
    dps: 'Chain Lightning Stun',
    image: '/assets/towers/Electroshocker.png',
    color: '#eab308',
    range: 15,
    description: 'Chains electrical shocks across groups of enemies, briefly stunning them.'
  },
  {
    id: 'hacker',
    name: 'Hacker',
    nameRu: 'Hacker',
    category: 'Support',
    cost: 1100,
    dps: 'Firewall & Buffs',
    image: '/assets/towers/Hacker.png',
    color: '#10b981',
    range: 18,
    description: 'Hacks into enemy systems to disrupt buffs and overclock allies.'
  },
  {
    id: 'saboteur',
    name: 'Saboteur',
    nameRu: 'Saboteur',
    category: 'Support',
    cost: 900,
    dps: 'EMP Traps & Stun',
    image: '/assets/towers/Saboteur.png',
    color: '#64748b',
    range: 15,
    description: 'Plants EMP mines and explosive charges that detonate on heavy enemies.'
  },
  {
    id: 'jester',
    name: 'Jester',
    nameRu: 'Jester',
    category: 'Support',
    cost: 800,
    dps: 'Confusion & Bombs',
    image: '/assets/towers/Jester.png',
    color: '#d946ef',
    range: 15,
    description: 'Throws gift boxes containing ice, poison, confusion, or fire effects.'
  },
  {
    id: 'toxic-gunner',
    name: 'Toxic Gunner',
    nameRu: 'Toxic Gunner',
    category: 'Support',
    cost: 700,
    dps: 'Poison & Slow',
    image: '/assets/towers/Toxic Gunner.png',
    color: '#84cc16',
    range: 15,
    description: 'Sprays radioactive toxins that permanently slow enemies and deal damage over time.'
  },
  {
    id: 'trapper',
    name: 'Trapper',
    nameRu: 'Trapper',
    category: 'Support',
    cost: 500,
    dps: 'Bear Traps & Spikes',
    image: '/assets/towers/Trapper.png',
    color: '#78716c',
    range: 14,
    description: 'Places caltrops and heavy bear traps along the path to snare runners.'
  },
  {
    id: 'spotlight',
    name: 'Spotlight',
    nameRu: 'Spotlight',
    category: 'Support',
    cost: 600,
    dps: 'Reveal Hidden Buff',
    image: '/assets/towers/Spotlight.png',
    color: '#fbbf24',
    range: 20,
    description: 'Illuminates enemies in a wide cone, revealing hidden and flying targets.'
  },
  {
    id: 'mercenary-base',
    name: 'Mercenary Base',
    nameRu: 'Mercenary Base',
    category: 'Support',
    cost: 1800,
    dps: 'Airdrops & Mercs',
    image: '/assets/towers/Mercenary Base.png',
    color: '#475569',
    range: 18,
    description: 'Orders supply drops and deploys elite specialized mercenary combatants.'
  },
  {
    id: 'scout',
    name: 'Scout',
    nameRu: 'Scout',
    category: 'Damage',
    cost: 200,
    dps: 'Starter DPS',
    image: '/assets/towers/Scout.png',
    color: '#94a3b8',
    range: 13,
    description: 'Classic beginner tower with fast firing pistols for early defense.'
  },
  {
    id: 'sniper',
    name: 'Sniper',
    nameRu: 'Sniper',
    category: 'Damage',
    cost: 350,
    dps: 'Long Range Single',
    image: '/assets/towers/Sniper.png',
    color: '#64748b',
    range: 25,
    cliff: true,
    description: 'High precision cliff marksman targeting heavy enemies from afar.'
  },
  {
    id: 'soldier',
    name: 'Soldier',
    nameRu: 'Soldier',
    category: 'Damage',
    cost: 300,
    dps: 'Burst Assault',
    image: '/assets/towers/Soldier.png',
    color: '#16a34a',
    range: 14,
    description: 'Shoots accurate 3-round bursts with dependable early-to-mid power.'
  },
  {
    id: 'paintballer',
    name: 'Paintballer',
    nameRu: 'Paintballer',
    category: 'Damage',
    cost: 250,
    dps: 'Splash Splatter',
    image: '/assets/towers/Paintballer.png',
    color: '#f97316',
    range: 13,
    description: 'Fires pressurized paintballs dealing area-of-effect splash.'
  },
  {
    id: 'demoman',
    name: 'Demoman',
    nameRu: 'Demoman',
    category: 'Damage',
    cost: 400,
    dps: 'Grenade AoE',
    image: '/assets/towers/Demoman.png',
    color: '#ea580c',
    range: 14,
    description: 'Lobs explosive grenades that shatter crowded enemy waves.'
  },
  {
    id: 'hunter',
    name: 'Hunter',
    nameRu: 'Hunter',
    category: 'Damage',
    cost: 550,
    dps: 'Rifle Piercing',
    image: '/assets/towers/Hunter.png',
    color: '#059669',
    range: 17,
    description: 'Bolt-action marksman with piercing rounds and high single-shot impact.'
  },
  {
    id: 'militant',
    name: 'Militant',
    nameRu: 'Militant',
    category: 'Damage',
    cost: 700,
    dps: 'Early/Mid DPS',
    image: '/assets/towers/Militant.png',
    color: '#10b981',
    range: 15,
    description: 'Reliable assault rifleman with reload mechanics and dependable DPS.'
  },
  {
    id: 'shotgunner',
    name: 'Shotgunner',
    nameRu: 'Shotgunner',
    category: 'Damage',
    cost: 450,
    dps: 'Close Burst',
    image: '/assets/towers/Shotgunner.png',
    color: '#f97316',
    range: 14,
    description: 'Heavy close-range burst damage with wide shell spread.'
  },
  {
    id: 'rocketeer',
    name: 'Rocketeer',
    nameRu: 'Rocketeer',
    category: 'Damage',
    cost: 900,
    dps: 'Rocket Splash',
    image: '/assets/towers/Rocketeer.png',
    color: '#dc2626',
    range: 17,
    description: 'Launches high-explosive rockets with massive blast radius.'
  },
  {
    id: 'pyromancer',
    name: 'Pyromancer',
    nameRu: 'Pyromancer',
    category: 'Damage',
    cost: 550,
    dps: 'Armor Melt & Burn',
    image: '/assets/towers/Pyromancer.png',
    color: '#ef4444',
    range: 15,
    description: 'Melts enemy defense armor and ignites swarms with continuous flame.'
  },
  {
    id: 'crook-boss',
    name: 'Crook Boss',
    nameRu: 'Crook Boss',
    category: 'Damage',
    cost: 650,
    dps: 'Thompson & Goons',
    image: '/assets/towers/Crook Boss.png',
    color: '#71717a',
    range: 15,
    description: 'Fires a Tommy gun while periodically sending armed henchmen onto the path.'
  },
  {
    id: 'military-base',
    name: 'Military Base',
    nameRu: 'Military Base',
    category: 'Damage',
    cost: 1000,
    dps: 'Armor Vehicles',
    image: '/assets/towers/Military Base.png',
    color: '#475569',
    range: 18,
    description: 'Spawns Humvees, tanks, and railgun trucks to ram and bombard enemies.'
  },
  {
    id: 'minigunner',
    name: 'Minigunner',
    nameRu: 'Minigunner',
    category: 'Damage',
    cost: 1200,
    dps: '120 DPS',
    image: '/assets/towers/Minigunner.png',
    color: '#d6d3d1',
    range: 16,
    description: 'Classic machine gunner delivering a continuous storm of bullets.'
  },
  {
    id: 'ranger',
    name: 'Ranger',
    nameRu: 'Ranger',
    category: 'Damage',
    cost: 4000,
    dps: 'High Single Damage',
    image: '/assets/towers/Ranger.png',
    color: '#6b7280',
    range: 26,
    cliff: true,
    description: 'Exclusive cliff placement. Massive high-impact single-target damage.'
  },
  {
    id: 'mortar',
    name: 'Mortar',
    nameRu: 'Mortar',
    category: 'Damage',
    cost: 2100,
    dps: 'Long Range AoE',
    image: '/assets/towers/Mortar.png',
    color: '#6366f1',
    range: 24,
    cliff: true,
    description: 'Long-range cliff artillery delivering devastating area-of-effect damage.'
  },
  {
    id: 'turret',
    name: 'Turret',
    nameRu: 'Turret',
    category: 'Damage',
    cost: 2000,
    dps: 'Twin Gatling DPS',
    image: '/assets/towers/Turret.png',
    color: '#64748b',
    range: 20,
    maxPlacement: 3,
    description: 'Heavy automated dual-barrel stationary turret with formidable range and fire rate.'
  },
  {
    id: 'ace-pilot',
    name: 'Ace Pilot',
    nameRu: 'Ace Pilot',
    category: 'Damage',
    cost: 1500,
    dps: 'Air Patrol & Bombs',
    image: '/assets/towers/Ace Pilot.png',
    color: '#0ea5e9',
    range: 20,
    description: 'Patrols in circles overhead, bombing and strafing enemy lines.'
  },
  {
    id: 'pursuit',
    name: 'Pursuit',
    nameRu: 'Pursuit',
    category: 'Damage',
    cost: 2200,
    dps: 'Attack Helicopter',
    image: '/assets/towers/Pursuit.png',
    color: '#0284c7',
    range: 22,
    description: 'Attack helicopter that tracks the strongest or first enemy with rockets and missiles.'
  },
  {
    id: 'enforcer',
    name: 'Enforcer',
    nameRu: 'Enforcer',
    category: 'Damage',
    cost: 850,
    dps: 'Riot Shotgun',
    image: '/assets/towers/Enforcer.png',
    color: '#0284c7',
    range: 15,
    description: 'Armored lawman firing rapid shotgun shells with SWAT backup.'
  },
  {
    id: 'firework-technician',
    name: 'Firework Technician',
    nameRu: 'Firework Technician',
    category: 'Damage',
    cost: 750,
    dps: 'Rocket Bursts',
    image: '/assets/towers/Firework Technician.png',
    color: '#ec4899',
    range: 16,
    description: 'Launches dazzling festive fireworks that burst into multi-target shrapnel.'
  },
  {
    id: 'boomerang',
    name: 'Boomerang',
    nameRu: 'Boomerang',
    category: 'Damage',
    cost: 500,
    dps: 'Return Piercing',
    image: '/assets/towers/Boomerang.png',
    color: '#d97706',
    range: 15,
    description: 'Throws curved blades that pass through enemies on the way out and return.'
  },
  {
    id: 'biologist',
    name: 'Biologist',
    nameRu: 'Biologist',
    category: 'Damage',
    cost: 800,
    dps: 'Biohazard Splatter',
    image: '/assets/towers/Biologist.png',
    color: '#16a34a',
    range: 16,
    description: 'Launches biohazard canisters that create lingering acidic puddles.'
  },
  {
    id: 'elementalist',
    name: 'Elementalist',
    nameRu: 'Elementalist',
    category: 'Damage',
    cost: 1400,
    dps: 'Elemental Spells',
    image: '/assets/towers/Elementalist.png',
    color: '#8b5cf6',
    range: 18,
    description: 'Channels fire, wind, water, and earth magic into rotating devastation.'
  },
  {
    id: 'slime-trooper',
    name: 'Slime Trooper',
    nameRu: 'Slime Trooper',
    category: 'Damage',
    cost: 600,
    dps: 'Sticky Slime AoE',
    image: '/assets/towers/Slime Trooper.png',
    color: '#84cc16',
    range: 14,
    description: 'Covers enemies in sticky corrosive slime, impairing movement.'
  },
  {
    id: 'operator',
    name: 'Operator',
    nameRu: 'Operator',
    category: 'Damage',
    cost: 950,
    dps: 'Drone Strikes',
    image: '/assets/towers/Operator.png',
    color: '#475569',
    range: 18,
    description: 'Coordinates remote combat drones to execute precision airstrikes.'
  },
  {
    id: 'pulse-trooper',
    name: 'Pulse Trooper',
    nameRu: 'Pulse Trooper',
    category: 'Damage',
    cost: 650,
    dps: 'Pulse Energy',
    image: '/assets/towers/Pulse Trooper.png',
    color: '#06b6d4',
    range: 15,
    description: 'Discharges high-frequency plasma pulses that bypass standard defenses.'
  },
  {
    id: 'assassin',
    name: 'Assassin',
    nameRu: 'Assassin',
    category: 'Damage',
    cost: 750,
    dps: 'Stealth Criticals',
    image: '/assets/towers/Assassin.png',
    color: '#334155',
    range: 14,
    description: 'Strikes from the shadows with lethal precision and high critical multipliers.'
  },
  {
    id: 'tesla',
    name: 'Tesla',
    nameRu: 'Tesla',
    category: 'Damage',
    cost: 1100,
    dps: 'High Voltage Coil',
    image: '/assets/towers/Tesla.png',
    color: '#38bdf8',
    range: 16,
    description: 'Discharges arcing bolts of high-voltage electricity between multiple foes.'
  },
  {
    id: 'snowballer',
    name: 'Snowballer',
    nameRu: 'Snowballer',
    category: 'Damage',
    cost: 450,
    dps: 'Ice Pellets',
    image: '/assets/towers/Snowballer.png',
    color: '#bae6fd',
    range: 14,
    description: 'Hurls icy snowballs that chip away enemy health with slight chill.'
  },
  {
    id: 'gladiator',
    name: 'Gladiator',
    nameRu: 'Gladiator',
    category: 'Event',
    cost: 400,
    dps: 'Early Rush Melee',
    image: '/assets/towers/Gladiator.png',
    color: '#b45309',
    range: 10,
    description: 'Relentless swordmaster with active war cry ability. Exceptional early game sweeper.'
  },
  {
    id: 'commando',
    name: 'Commando',
    nameRu: 'Commando',
    category: 'Event',
    cost: 800,
    dps: 'Rocket & Rifle',
    image: '/assets/towers/Commando.png',
    color: '#15803d',
    range: 18,
    description: 'Armored elite soldier armed with dual assault rifles and shoulder-mounted rockets.'
  },
  {
    id: 'slasher',
    name: 'Slasher',
    nameRu: 'Slasher',
    category: 'Event',
    cost: 400,
    dps: 'Bleed Melee',
    image: '/assets/towers/Slasher.png',
    color: '#991b1b',
    range: 10,
    description: 'Wields machetes and knives to slash enemies and inflict severe bleed damage.'
  },
  {
    id: 'frost-blaster',
    name: 'Frost Blaster',
    nameRu: 'Frost Blaster',
    category: 'Event',
    cost: 750,
    dps: 'Frost Blast AoE',
    image: '/assets/towers/Frost Blaster.png',
    color: '#38bdf8',
    range: 16,
    description: 'Fires concentrated ice projectiles that detonate on contact with frost bursts.'
  },
  {
    id: 'archer',
    name: 'Archer',
    nameRu: 'Archer',
    category: 'Event',
    cost: 350,
    dps: 'Arrow Volleys',
    image: '/assets/towers/Archer.png',
    color: '#65a30d',
    range: 20,
    cliff: true,
    description: 'High-angle cliff archer firing swift volleys of piercing arrows.'
  },
  {
    id: 'swarmer',
    name: 'Swarmer',
    nameRu: 'Swarmer',
    category: 'Event',
    cost: 650,
    dps: 'Bee Hive Swarms',
    image: '/assets/towers/Swarmer.png',
    color: '#eab308',
    range: 16,
    description: 'Summons swarms of aggressive stinging bees that relentlessly chase targets.'
  },
  {
    id: 'executioner',
    name: 'Executioner',
    nameRu: 'Executioner',
    category: 'Event',
    cost: 900,
    dps: 'Bouncing Axe',
    image: '/assets/towers/Executioner.png',
    color: '#7f1d1d',
    range: 16,
    description: 'Hurls heavy battleaxes that ricochet between multiple nearby enemies.'
  },
  {
    id: 'elf-camp',
    name: 'Elf Camp',
    nameRu: 'Elf Camp',
    category: 'Event',
    cost: 1200,
    dps: 'Elf Guardians',
    image: '/assets/towers/Elf Camp.png',
    color: '#15803d',
    range: 18,
    description: 'Festive outpost deploying sword elves, cannon elves, and reindeer mounts.'
  },
  {
    id: 'harvester',
    name: 'Harvester',
    nameRu: 'Harvester',
    category: 'Event',
    cost: 1500,
    dps: 'Scythe & Vines',
    image: '/assets/towers/Harvester.png',
    color: '#854d0e',
    range: 16,
    description: 'Reaps enemies with an enchanted scythe while ensnaring them with thorny roots.'
  },
  {
    id: 'hallow-punk',
    name: 'Hallow Punk',
    nameRu: 'Hallow Punk',
    category: 'Event',
    cost: 1100,
    dps: 'Punk Shockwaves',
    image: '/assets/towers/Hallow Punk.png',
    color: '#ea580c',
    range: 16,
    description: 'Spooky rocker firing sonic distortion waves and spectral pumpkins.'
  },
  {
    id: 'juggernaut',
    name: 'Juggernaut',
    nameRu: 'Juggernaut',
    category: 'Event',
    cost: 2600,
    dps: 'Heavy Armored Mech',
    image: '/assets/towers/Juggernaut.png',
    color: '#0284c7',
    range: 19,
    description: 'Massive robotic dreadnought delivering overwhelming kinetic and missile fury.'
  },
  {
    id: 'warlock',
    name: 'Warlock',
    nameRu: 'Warlock',
    category: 'Event',
    cost: 1800,
    dps: 'Dark Curses & Hexes',
    image: '/assets/towers/Warlock.png',
    color: '#7c3aed',
    range: 18,
    description: 'Weaves shadowy hexes that weaken boss defenses and siphon enemy vitality.'
  },
  {
    id: 'kingpin',
    name: 'Kingpin',
    nameRu: 'Kingpin',
    category: 'Event',
    cost: 2000,
    dps: 'Syndicate Enforcers',
    image: '/assets/towers/Kingpin.png',
    color: '#475569',
    range: 18,
    description: 'Syndicate mastermind employing heavily armed bodyguards and explosive limos.'
  },
  {
    id: 'gatling-gun',
    name: 'Gatling Gun',
    nameRu: 'Gatling Gun',
    category: 'Event',
    cost: 3200,
    dps: 'Rotary Cannon DPS',
    image: '/assets/towers/Gatling Gun.png',
    color: '#d97706',
    range: 21,
    description: 'High-caliber multi-barrel rotary cannon shredding all armored resistance.'
  }
];

export const TDS_MAPS: MapItem[] = [
  {
    id: 'crossroads',
    name: 'Crossroads',
    nameRu: 'Crossroads',
    difficulty: 'Normal',
    waves: 40,
    theme: 'grass',
    image: createMapSvg('#14532d', '#78716c', 'Crossroads', '🌲'),
    trackPoints: [
      { x: 0, y: 50 },
      { x: 25, y: 50 },
      { x: 25, y: 22 },
      { x: 75, y: 22 },
      { x: 75, y: 78 },
      { x: 50, y: 78 },
      { x: 50, y: 50 },
      { x: 100, y: 50 }
    ],
    cliffZones: [
      { x: 10, y: 15, w: 18, h: 22, label: 'Cliff Alpha' },
      { x: 72, y: 12, w: 20, h: 22, label: 'Cliff Beta' },
      { x: 38, y: 62, w: 22, h: 22, label: 'Cliff Center' }
    ],
    description: 'Classic map with convenient corners and wide zones for Farms and Accelerators.',
    recommendedTowers: ['Accelerator', 'Commander', 'DJ Booth', 'Farm', 'Ranger']
  },
  {
    id: 'badlands-2',
    name: 'Badlands II',
    nameRu: 'Badlands II',
    difficulty: 'Special',
    waves: 40,
    theme: 'desert',
    image: createMapSvg('#78350f', '#d97706', 'Badlands II', '🌵'),
    trackPoints: [
      { x: 0, y: 30 },
      { x: 35, y: 30 },
      { x: 35, y: 75 },
      { x: 65, y: 75 },
      { x: 65, y: 25 },
      { x: 88, y: 25 },
      { x: 88, y: 85 },
      { x: 100, y: 85 }
    ],
    cliffZones: [
      { x: 42, y: 40, w: 18, h: 25, label: 'High Canyon' },
      { x: 72, y: 38, w: 14, h: 30, label: 'Mesa Ridge' }
    ],
    description: 'Special map required to achieve the Quickdraw badge and unlock Cowboy.',
    recommendedTowers: ['Golden Cowboy', 'Accelerator', 'Commander', 'DJ Booth', 'Engineer']
  },
  {
    id: 'polluted-wastelands-2',
    name: 'Polluted Wastelands II',
    nameRu: 'Polluted Wastelands II',
    difficulty: 'Hard',
    waves: 40,
    theme: 'wasteland',
    image: createMapSvg('#14532d', '#15803d', 'PW II Wasteland', '☣️'),
    trackPoints: [
      { x: 0, y: 20 },
      { x: 40, y: 20 },
      { x: 40, y: 60 },
      { x: 20, y: 60 },
      { x: 20, y: 85 },
      { x: 80, y: 85 },
      { x: 80, y: 40 },
      { x: 100, y: 40 }
    ],
    cliffZones: [
      { x: 50, y: 30, w: 22, h: 24, label: 'Nuclear Silo' },
      { x: 10, y: 32, w: 18, h: 20, label: 'Acid Cliff' }
    ],
    description: 'Hazardous zone with toxic waste. Requires Medics and strong poison mitigation.',
    recommendedTowers: ['Medic', 'Golden Minigunner', 'Accelerator', 'Commander', 'DJ Booth']
  },
  {
    id: 'pizza-party',
    name: 'Pizza Party',
    nameRu: 'Pizza Party',
    difficulty: 'Special',
    waves: 40,
    theme: 'retro',
    image: createMapSvg('#451a03', '#b45309', 'Pizza Party', '🍕'),
    trackPoints: [
      { x: 0, y: 45 },
      { x: 30, y: 45 },
      { x: 30, y: 15 },
      { x: 70, y: 15 },
      { x: 70, y: 55 },
      { x: 45, y: 55 },
      { x: 45, y: 85 },
      { x: 100, y: 85 }
    ],
    cliffZones: [
      { x: 38, y: 25, w: 24, h: 22, label: 'Diner Roof' },
      { x: 78, y: 25, w: 16, h: 24, label: 'Arcade Stage' }
    ],
    description: 'Retro pizzeria event map. Defeat animatronics to unlock the Warden tower.',
    recommendedTowers: ['Accelerator', 'Farm', 'DJ Booth', 'Commander', 'Shotgunner']
  },
  {
    id: 'nether-inferno',
    name: 'Inferno / Nether',
    nameRu: 'Inferno / Nether',
    difficulty: 'Hard',
    waves: 50,
    theme: 'inferno',
    image: createMapSvg('#7f1d1d', '#dc2626', 'Inferno Pit', '🔥'),
    trackPoints: [
      { x: 0, y: 50 },
      { x: 20, y: 30 },
      { x: 45, y: 70 },
      { x: 65, y: 30 },
      { x: 80, y: 65 },
      { x: 100, y: 50 }
    ],
    cliffZones: [
      { x: 25, y: 45, w: 16, h: 18, label: 'Basalt Peak' },
      { x: 50, y: 22, w: 18, h: 18, label: 'Obsidian Ring' },
      { x: 70, y: 42, w: 16, h: 18, label: 'Lava Rock' }
    ],
    description: 'Fiery map for Hardcore and Molten modes. Superb cliffs for Rangers and Mortars.',
    recommendedTowers: ['Accelerator', 'Ranger', 'Mortar', 'Commander', 'DJ Booth']
  },
  {
    id: 'winter-bridges',
    name: 'Winter Bridges',
    nameRu: 'Winter Bridges',
    difficulty: 'Normal',
    waves: 40,
    theme: 'snow',
    image: createMapSvg('#0c4a6e', '#38bdf8', 'Winter Bridges', '❄️'),
    trackPoints: [
      { x: 0, y: 25 },
      { x: 40, y: 25 },
      { x: 40, y: 75 },
      { x: 60, y: 75 },
      { x: 60, y: 25 },
      { x: 100, y: 25 }
    ],
    cliffZones: [
      { x: 15, y: 45, w: 20, h: 25, label: 'Ice Fortress' },
      { x: 68, y: 45, w: 22, h: 25, label: 'Snow Peak' }
    ],
    description: 'Frozen rivers and snowy bridges. Long winding track for maximized DPS coverage.',
    recommendedTowers: ['Pyromancer', 'Accelerator', 'Commander', 'DJ Booth', 'Farm']
  },
  {
    id: 'cyber-city',
    name: 'Cyber City',
    nameRu: 'Cyber City',
    difficulty: 'Hard',
    waves: 40,
    theme: 'cyber',
    image: createMapSvg('#1e1b4b', '#a855f7', 'Cyber City', '🏙️'),
    trackPoints: [
      { x: 0, y: 35 },
      { x: 25, y: 35 },
      { x: 25, y: 70 },
      { x: 70, y: 70 },
      { x: 70, y: 30 },
      { x: 88, y: 30 },
      { x: 88, y: 65 },
      { x: 100, y: 65 }
    ],
    cliffZones: [
      { x: 35, y: 35, w: 25, h: 24, label: 'Skyline Roof' },
      { x: 74, y: 42, w: 12, h: 22, label: 'Neon Tower' }
    ],
    description: 'Futuristic metropolis with neon roadways and dense urban choke points.',
    recommendedTowers: ['Engineer', 'Accelerator', 'Commander', 'DJ Booth', 'Golden Scout']
  }
];

export const DEFAULT_WAVE_STEPS_FALLEN: WaveStep[] = [
  { id: 'w0', wave: 0, player: 'P1', action: 'Place 2 Golden Scouts / Militants at track entrance (Lv.0)', notes: 'Defend against early fast enemies', skip: false },
  { id: 'w1', wave: 1, player: 'All', action: 'All players place 1 Farm each (Lv.0)', notes: 'Start economy buildup (Skip: Yes)', skip: true },
  { id: 'w3', wave: 3, player: 'P1', action: 'Upgrade Golden Scout to Lv.1. Maintain front line defense.', notes: 'Heavies arrive', skip: false },
  { id: 'w5', wave: 5, player: 'All', action: 'Upgrade Farms to Lv.2. Player 2 places Shotgunner or Militant.', notes: 'Do not skip if defense is close', skip: false },
  { id: 'w10', wave: 10, player: 'P3', action: 'Place DJ Booth at center of main tower cluster (Lv.2).', notes: 'Range boost and upgrade discount', skip: true },
  { id: 'w14', wave: 14, player: 'P4', action: 'Place first Commander near DJ Booth (Lv.2).', notes: 'Prepare for mid-game bosses', skip: false },
  { id: 'w19', wave: 19, player: 'All', action: 'Max Farms to Lv.5. Begin placing primary DPS towers.', notes: 'Maximize wave income', skip: true },
  { id: 'w22', wave: 22, player: 'P1', action: 'Place first Accelerator within DJ range (Lv.3).', notes: 'Melt armored targets', skip: false },
  { id: 'w30', wave: 30, player: 'P2', action: 'Place 3 Commanders (Chain Call to Arms).', notes: 'Continuous speed buff rotation', skip: true },
  { id: 'w36', wave: 36, player: 'All', action: 'Sell all Farms! Deploy max Accelerators and Rangers.', notes: 'Prepare for final boss wave', skip: false },
  { id: 'w40', wave: 40, player: 'All', action: 'BOSS WAVE! Continuous Commander chain, activate DJ and Medic abilities.', notes: 'Use abilities on cooldown', skip: false }
];

export const DEFAULT_WAVE_STEPS_HARDCORE: WaveStep[] = [
  { id: 'hc0', wave: 0, player: 'P1', action: 'P1 places Brawler / Militant / Golden Scout on the first tile.', notes: 'Hold early scout enemies', skip: false },
  { id: 'hc2', wave: 2, player: 'P2', action: 'P2 places 2 Farms at Lv.1. P1 controls the track entrance.', notes: 'Begin gem farm economy', skip: true },
  { id: 'hc8', wave: 8, player: 'P3', action: 'P3 prepares hidden detection — Ace Pilot or Sniper.', notes: 'Watch out for Shadow enemies', skip: false },
  { id: 'hc15', wave: 15, player: 'P4', action: 'P4 places DJ Booth in center. Discount for Farm upgrades.', notes: 'Discount is critical', skip: true },
  { id: 'hc24', wave: 24, player: 'All', action: 'Place and upgrade Accelerators and Engineers to max level.', notes: 'Eliminate Lead and Mega Slow', skip: false },
  { id: 'hc50', wave: 50, player: 'All', action: 'VOID REAPER! Continuous Commander chain 24/7. Focus the boss!', notes: 'Victory and 300+ Gems reward', skip: false }
];
