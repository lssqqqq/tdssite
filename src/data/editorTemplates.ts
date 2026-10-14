import { QuickInsertBlock } from '../types/editor';

export const INITIAL_EDITOR_HTML = `
<h1>LUCILLE STRATEGY — HARDCORE TRIO</h1>
<p><strong>Author:</strong> Ayaka &nbsp;|&nbsp; <strong>Gamemode:</strong> Hardcore &nbsp;|&nbsp; <strong>Difficulty:</strong> Special &nbsp;|&nbsp; <strong>Map:</strong> Crossroads</p>
<hr />

<h2>NOTES &amp; GENERAL RULES</h2>
<table>
  <thead>
    <tr>
      <th style="width: 25%;">Rule / Timing</th>
      <th>Instruction</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Base Defense</strong></td>
      <td>Never leak early Shadow or Fast enemies. Player 1 handles early game until wave 10.</td>
    </tr>
    <tr>
      <td><strong>Commander Chain</strong></td>
      <td>Rotate Call to Arms ability continuously without gaps starting from wave 30.</td>
    </tr>
    <tr>
      <td><strong>Farm Upgrades</strong></td>
      <td>Max all Farms to Level 5 before wave 25. Sell all Farms on wave 36 for DPS spam.</td>
    </tr>
  </tbody>
</table>

<h2>LOADOUTS &amp; ROLES</h2>
<table>
  <thead>
    <tr>
      <th style="width: 20%;">Player</th>
      <th>Tower 1</th>
      <th>Tower 2</th>
      <th>Tower 3</th>
      <th>Tower 4</th>
      <th>Tower 5</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Player 1 (Early)</strong></td>
      <td>Golden Scout</td>
      <td>Farm</td>
      <td>Commander</td>
      <td>DJ Booth</td>
      <td>Accelerator</td>
    </tr>
    <tr>
      <td><strong>Player 2 (Support)</strong></td>
      <td>Farm</td>
      <td>Commander</td>
      <td>DJ Booth</td>
      <td>Medic</td>
      <td>Accelerator</td>
    </tr>
  </tbody>
</table>

<h2>WAVE-BY-WAVE STEP ACTIONS</h2>
<table>
  <thead>
    <tr>
      <th style="width: 15%;">Wave</th>
      <th style="width: 15%;">Player</th>
      <th>Action / Upgrade</th>
      <th style="width: 25%;">Timing Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Wave 0</strong></td>
      <td>Player 1</td>
      <td>Place 2 Golden Scout at track entrance (Lv.0).</td>
      <td>Defend early fast mobs</td>
    </tr>
    <tr>
      <td><strong>Wave 1</strong></td>
      <td>All</td>
      <td>Place 1 Farm (Lv.0).</td>
      <td>Economy start (Skip: Yes)</td>
    </tr>
    <tr>
      <td><strong>Wave 10</strong></td>
      <td>Player 2</td>
      <td>Place DJ Booth (Lv.2) covering central tower spot.</td>
      <td>Discount for farms and towers</td>
    </tr>
    <tr>
      <td><strong>Wave 15</strong></td>
      <td>Player 1</td>
      <td>Place Commander (Lv.2) next to DJ Booth.</td>
      <td>Ready Call to Arms</td>
    </tr>
    <tr>
      <td><strong>Wave 36</strong></td>
      <td>All</td>
      <td>Sell all Farms! Spam max Accelerator and Rangers.</td>
      <td>Prepare for final boss rush</td>
    </tr>
    <tr>
      <td><strong>Wave 50</strong></td>
      <td>All</td>
      <td>VOID REAPER BOSS! Chain Commander 24/7. Use Medic cleanses.</td>
      <td>Victory &amp; 300+ Gems!</td>
    </tr>
  </tbody>
</table>
`;

export const QUICK_INSERT_BLOCKS: QuickInsertBlock[] = [
  {
    id: 'cover',
    title: 'Cover Banner',
    description: 'Title header with violet accent bar and author metadata',
    icon: 'Sparkles',
    category: 'header',
    html: `
<h1>STRATEGY TITLE (MODE / MAP)</h1>
<p><strong>Author:</strong> Author Name &nbsp;|&nbsp; <strong>Gamemode:</strong> Fallen &nbsp;|&nbsp; <strong>Team:</strong> Duo / Trio</p>
<hr />
`
  },
  {
    id: 'notes',
    title: 'Notes Section',
    description: 'Structured table of gameplay rules and critical timings',
    icon: 'FileText',
    category: 'notes',
    html: `
<h2>IMPORTANT STRATEGY NOTES</h2>
<table>
  <thead>
    <tr>
      <th style="width: 30%;">Topic / Key Timing</th>
      <th>Action Required</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Early Defense</strong></td>
      <td>Do not skip until initial defense towers reach Lv.2.</td>
    </tr>
    <tr>
      <td><strong>Support Timing</strong></td>
      <td>Activate Call to Arms ability when boss enters range.</td>
    </tr>
    <tr>
      <td><strong>Farm Selling</strong></td>
      <td>Sell all farms before final wave for extra DPS cash.</td>
    </tr>
  </tbody>
</table>
`
  },
  {
    id: 'loadouts',
    title: 'Loadouts Table',
    description: 'Player deck slots (P1 & P2 with 5 tower slots)',
    icon: 'Shield',
    category: 'loadout',
    html: `
<h2>TEAM LOADOUTS</h2>
<table>
  <thead>
    <tr>
      <th style="width: 20%;">Player</th>
      <th>Tower 1</th>
      <th>Tower 2</th>
      <th>Tower 3</th>
      <th>Tower 4</th>
      <th>Tower 5</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Player 1</strong></td>
      <td>Golden Scout</td>
      <td>Farm</td>
      <td>Commander</td>
      <td>DJ Booth</td>
      <td>Accelerator</td>
    </tr>
    <tr>
      <td><strong>Player 2</strong></td>
      <td>Shotgunner</td>
      <td>Farm</td>
      <td>Commander</td>
      <td>Ranger</td>
      <td>Minigunner</td>
    </tr>
  </tbody>
</table>
`
  },
  {
    id: 'strategy',
    title: 'Strategy Plan',
    description: 'Strategy overview section with bulleted instructions',
    icon: 'Target',
    category: 'strategy',
    html: `
<h2>CORE STRATEGY EXECUTION</h2>
<p>Follow these core principles for flawless execution:</p>
<ul>
  <li><strong>Phase 1 (Waves 0-10):</strong> Establish early defense and place initial farms.</li>
  <li><strong>Phase 2 (Waves 11-25):</strong> Upgrade support towers (DJ Booth &amp; Commander) inside discounted zone.</li>
  <li><strong>Phase 3 (Waves 26-40):</strong> Maximize heavy DPS units and initiate continuous Call to Arms chain.</li>
</ul>
`
  },
  {
    id: 'player1',
    title: 'Player 1 Plan',
    description: 'Dedicated task card and responsibilities for Player 1',
    icon: 'User',
    category: 'strategy',
    html: `
<h2>PLAYER 1 DUTIES (EARLY DEFENSE &amp; LEAD DAMAGE)</h2>
<blockquote>Player 1 focuses on halting early enemies and placing primary defense.</blockquote>
<ul>
  <li>Place early Golden Scout / Militant on curve 1.</li>
  <li>Upgrade farm economy steadily during waves 2 to 8.</li>
  <li>Place and upgrade first Accelerator inside DJ Booth range on wave 22.</li>
</ul>
`
  },
  {
    id: 'player2',
    title: 'Player 2 Plan',
    description: 'Dedicated task card and responsibilities for Player 2',
    icon: 'Users',
    category: 'strategy',
    html: `
<h2>PLAYER 2 DUTIES (SUPPORT &amp; LATE GAME DPS)</h2>
<blockquote>Player 2 provides essential support buffs, cleanses, and secondary heavy DPS.</blockquote>
<ul>
  <li>Place central DJ Booth on wave 10 and upgrade to Level 2.</li>
  <li>Place 3 Commanders and establish continuous ability rotation on wave 30.</li>
  <li>Cleanse stuns using Medic ability when bosses unleash ground attacks.</li>
</ul>
`
  },
  {
    id: 'waveTable',
    title: 'Wave Schedule Table',
    description: '4-column step table: Wave, Player, Action, Notes',
    icon: 'ListOrdered',
    category: 'table',
    html: `
<h2>WAVE-BY-WAVE STEP ACTIONS</h2>
<table>
  <thead>
    <tr>
      <th style="width: 15%;">Wave</th>
      <th style="width: 15%;">Player</th>
      <th>Action / Upgrade</th>
      <th style="width: 25%;">Timing Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Wave 0</strong></td>
      <td>P1</td>
      <td>Place 2 Golden Scout (Lv.0).</td>
      <td>Hold entrance</td>
    </tr>
    <tr>
      <td><strong>Wave 1</strong></td>
      <td>All</td>
      <td>Place 1 Farm (Lv.0).</td>
      <td>Economy (Skip)</td>
    </tr>
    <tr>
      <td><strong>Wave 14</strong></td>
      <td>P2</td>
      <td>Place Commander (Lv.2).</td>
      <td>Support zone</td>
    </tr>
    <tr>
      <td><strong>Wave 30</strong></td>
      <td>All</td>
      <td>Start Commander Chain &amp; max DPS units.</td>
      <td>Constant 55% firerate buff</td>
    </tr>
    <tr>
      <td><strong>Wave 40</strong></td>
      <td>All</td>
      <td>FINAL BOSS: Sell Farms, spam Accelerators.</td>
      <td>Victory!</td>
    </tr>
  </tbody>
</table>
`
  },
  {
    id: 'placementMap',
    title: 'Placement Diagram Block',
    description: 'Map placement notes and positioning diagram placeholder',
    icon: 'MapPin',
    category: 'strategy',
    html: `
<h2>TOWER PLACEMENT DIAGRAM</h2>
<p><strong>Map:</strong> Crossroads &nbsp;|&nbsp; <strong>Theme:</strong> Grassland</p>
<blockquote>Ensure all DPS towers are placed strictly inside the DJ Booth discount aura ring (green circle) for maximum efficiency and commander buffs.</blockquote>
`
  }
];
