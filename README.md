# TDS Strategy Studio & Tactics Vault

A full-featured **Tower Defense Simulator (TDS)** strategy creation, tactical vault, and document studio application built with React 19, TypeScript, Vite, Tailwind CSS v4, Lucide icons, TipTap, and docx generation.

---

## 🚀 Quick Start Guide (Running Locally)

### 1. Prerequisites
- **Node.js**: version 18.0.0 or higher (Node 20+ or 22+ recommended)
- **npm** (comes with Node), **pnpm**, **yarn**, or **bun**

### 2. Install Dependencies
Open your terminal inside the project directory and run:

```bash
npm install
```
*(or `pnpm install` / `yarn install` / `bun install`)*

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at [http://localhost:3000](http://localhost:3000) (or the URL shown in your console).

### 4. Build for Production
To build the optimized static production bundle:

```bash
npm run build
```
The output files will be in the `dist/` directory, ready to deploy to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any static hosting service.

To test the production build locally:
```bash
npm run preview
```

---

## 📁 Project Directory Structure

```text
├── public/                     # Static assets served at root
│   ├── assets/
│   │   └── towers/             # Full collection of original tower portraits (transparent PNGs)
│   ├── towers/                 # Tower assets directory
│   └── tds-strategy-studio-source.zip # Pre-packaged export archive
├── src/                        # Application source code
│   ├── App.tsx                 # Main application controller, tab navigation, local storage sync
│   ├── main.tsx                # React DOM entry point
│   ├── index.css               # Global Tailwind CSS imports and custom scrollbars
│   ├── assets/
│   │   ├── images/             # Blackhole cover, tactic list & generator preview covers
│   │   └── towers/             # High-resolution tower assets
│   ├── components/
│   │   ├── MainMenu.tsx        # Hero landing page, quick action cards, stats counter
│   │   ├── TacticsGenerator.tsx# Strategy Studio host view (with CustomDocView integration)
│   │   ├── TacticsList.tsx     # Tactics database with filters, search, modal details, and tags
│   │   ├── TdsGemIcon.tsx      # SVG gem & branding icons
│   │   ├── editor/
│   │   │   ├── TdsA4Editor.tsx     # Printable A4 document layout editor with TipTap
│   │   │   ├── TdsEditorSidebar.tsx# A4 editor sidebar for blocks and templates
│   │   │   └── TdsEditorToolbar.tsx# Rich text formatting toolbar
│   │   └── studio/
│   │       ├── CanvasControlsBar.tsx       # Canvas zoom, grid snapping, mode toggle
│   │       ├── CustomAssetSidebar.tsx      # Tower selector with search and original portraits
│   │       ├── CustomDocGeneratorModal.tsx # Strategy AI & algorithmic prompt wizard
│   │       ├── CustomDocView.tsx           # Complete Strategy Studio: Loadouts, Map Canvas,
│   │       │                               # Wave table, Notes, Players, and Export engine
│   │       ├── DocGeneratorModal.tsx       # Step-by-step strategy wizard
│   │       ├── HeroGrid.tsx                # Visual map backdrop and placement preview
│   │       ├── PhotoMapCanvas.tsx          # Real photographic map canvas with token placement
│   │       ├── StudioDocEditor.tsx         # Strategy document notes and rich text
│   │       ├── StudioMapCanvas.tsx         # Interactive interactive map canvas
│   │       └── StudioSidebar.tsx           # Tower catalog, player loadouts, custom tokens
│   ├── data/
│   │   ├── initialCustomDoc.ts # Default Strategy Studio document state with starter towers
│   │   ├── tdsData.ts          # Core tactics database (Lucille, Trio, Duo, Solo strategies)
│   │   ├── tdsGeneratorData.ts # TDS tower catalogs, stats, categories, and aliases
│   │   ├── tdsPhotoAssets.ts   # Canonical image URLs and original asset mapping
│   │   └── editorTemplates.ts  # Pre-built strategy templates for the document editor
│   ├── i18n/
│   │   └── translations.ts     # Localization dictionary (English default)
│   ├── types/
│   │   ├── customDoc.ts        # Strategy Studio document schema, tokens, loadouts, waves
│   │   ├── editor.ts           # Document editor block types
│   │   ├── generator.ts        # Tactics generator wizard types
│   │   └── tds.ts              # Core tactics item schema
│   └── utils/
│       ├── customDocExport.ts  # Strategy Studio JSON, TXT, and Markdown exporter
│       ├── docxExportHelper.ts # Microsoft Word (.docx) generator with styled tables and headers
│       └── googleDocExport.ts  # Google Docs copy/paste formatting and export helper
├── .env.example                # Example environment variables (none required for local dev)
├── .gitignore                  # Standard Git ignore rules
├── index.html                  # HTML5 application shell and meta tags
├── metadata.json               # Project metadata
├── package.json                # Project dependencies and run scripts
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite bundler configuration with Tailwind CSS plugin
```

---

## 🎮 Key Features & Modules

1. **Strategy Studio (`src/components/studio/CustomDocView.tsx`)**:
   - Interactive visual map canvas with drag-and-drop or click-to-place tower tokens.
   - Dual-player and multi-player loadout slots with instant tower swapping.
   - Preserves original tower aspect ratios with transparent PNG portraits.
   - Wave-by-wave action instruction editor (Placements, Upgrades, Abilities).
   - Canvas controls: Zoom, pan, center reset, grid overlay, and clear markers.

2. **Tactics Vault (`src/components/TacticsList.tsx`)**:
   - Comprehensive searchable database of TDS strategies (Lucille, Badlands, Pizza Party, Fallen, Polluted Wastelands, etc.).
   - Search by map name, strategy title, or tower name.
   - Filter by player count (Solo, Duo, Trio, Quad) and difficulty.
   - Add new custom strategies with persistence in `localStorage`.

3. **Strategy Generator & Builder (`src/components/TacticsGenerator.tsx`)**:
   - Generate custom team loadouts balancing Early Game, DPS, Support, and Economy.
   - Instant export to Strategy Studio canvas.

4. **Document Exporters**:
   - **Microsoft Word (.docx)**: Generates formatted Word documents with tables and headers.
   - **Google Docs**: Copy-ready rich HTML format designed for direct pasting into Google Docs.
   - **JSON / Text**: Instant backup and restore of complete strategy files.

---

## 🔑 External Services & Environment Variables

- **Offline by Default**: The entire core application, Strategy Studio, Map Canvas, tactics database, and document generation run **100% locally in your browser** without requiring any external backend server or database!
- **Optional Gemini AI API**: If you wish to enable optional server-side AI generation, you can set `GEMINI_API_KEY` in your `.env` file (see `.env.example`). When no key is set, the app continues to operate using its built-in rule-based strategy generator and manual studio builder.

---

## 🛠️ Tech Stack
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Document Generation**: `docx`, `@tiptap/react`, `file-saver`
- **Animations**: Motion
