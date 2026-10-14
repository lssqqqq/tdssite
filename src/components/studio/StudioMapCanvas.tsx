import React, { useState, useRef } from 'react';
import { MapItem, TowerItem, PlacedTower, PlayerSlot } from '../../types/generator';
import {
  Grid,
  Trash2,
  Sparkles,
  User,
  X,
  Target,
  Move,
  Info
} from 'lucide-react';
import { Language } from '../../i18n/translations';

interface StudioMapCanvasProps {
  selectedMap: MapItem;
  selectedTower: TowerItem | null;
  placedTowers: PlacedTower[];
  onAddPlacedTower: (tower: PlacedTower) => void;
  onUpdatePlacedTower: (tower: PlacedTower) => void;
  onRemovePlacedTower: (id: string) => void;
  onClearPlacedTowers: () => void;
  activePlayer: PlayerSlot;
  onChangeActivePlayer: (player: PlayerSlot) => void;
  lang: Language;
  heightClass?: string;
}

const PLAYER_COLORS: Record<PlayerSlot, { bg: string; text: string; border: string; hex: string }> = {
  P1: { bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-500', hex: '#3b82f6' },
  P2: { bg: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500', hex: '#10b981' },
  P3: { bg: 'bg-amber-600', text: 'text-amber-400', border: 'border-amber-500', hex: '#f59e0b' },
  P4: { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-500', hex: '#a855f7' }
};

export const StudioMapCanvas: React.FC<StudioMapCanvasProps> = ({
  selectedMap,
  selectedTower,
  placedTowers,
  onAddPlacedTower,
  onUpdatePlacedTower,
  onRemovePlacedTower,
  onClearPlacedTowers,
  activePlayer,
  onChangeActivePlayer,
  lang,
  heightClass = 'min-h-[460px] md:min-h-[520px]'
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedPlacedTowerId, setSelectedPlacedTowerId] = useState<string | null>(null);
  const [draggingTowerId, setDraggingTowerId] = useState<string | null>(null);

  // Handle clicking on canvas to place the selected tower
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicking directly on a placed tower or child control, don't place another
    if ((e.target as HTMLElement).closest('.placed-tower-token')) {
      return;
    }

    if (!selectedTower || !canvasRef.current) {
      setSelectedPlacedTowerId(null);
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPercent = Math.min(95, Math.max(5, (clickX / rect.width) * 100));
    const yPercent = Math.min(95, Math.max(5, (clickY / rect.height) * 100));

    const newPlaced: PlacedTower = {
      id: `pt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      towerId: selectedTower.id,
      towerName: selectedTower.name,
      towerImage: selectedTower.image,
      towerColor: selectedTower.color,
      x: xPercent,
      y: yPercent,
      player: activePlayer,
      level: 0,
      target: 'First'
    };

    onAddPlacedTower(newPlaced);
    setSelectedPlacedTowerId(newPlaced.id);
  };

  // Drag and drop handler from sidebar or moving existing tower
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const xPercent = Math.min(95, Math.max(5, ((e.clientX - rect.left) / rect.width) * 100));
    const yPercent = Math.min(95, Math.max(5, ((e.clientY - rect.top) / rect.height) * 100));

    if (draggingTowerId) {
      // Repositioning existing tower
      const existing = placedTowers.find(t => t.id === draggingTowerId);
      if (existing) {
        onUpdatePlacedTower({ ...existing, x: xPercent, y: yPercent });
      }
      setDraggingTowerId(null);
    } else if (selectedTower) {
      // Dropping from sidebar
      const newPlaced: PlacedTower = {
        id: `pt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        towerId: selectedTower.id,
        towerName: selectedTower.name,
        towerImage: selectedTower.image,
        towerColor: selectedTower.color,
        x: xPercent,
        y: yPercent,
        player: activePlayer,
        level: 0,
        target: 'First'
      };
      onAddPlacedTower(newPlaced);
      setSelectedPlacedTowerId(newPlaced.id);
    }
  };

  // Handle Preset Recommendation Placements
  const handleLoadRecommendedPreset = () => {
    onClearPlacedTowers();
    const points = selectedMap.trackPoints;
    const pStart = points[0] || { x: 10, y: 50 };
    const pMid = points[Math.floor(points.length / 2)] || { x: 50, y: 50 };

    const sampleTowers: PlacedTower[] = [
      {
        id: `pt-preset-1`,
        towerId: 'golden-scout',
        towerName: 'Golden Scout',
        towerImage: selectedTower?.image || '',
        towerColor: '#eab308',
        x: Math.min(90, pStart.x + 12),
        y: Math.max(10, pStart.y - 12),
        player: 'P1',
        level: 3,
        target: 'First'
      },
      {
        id: `pt-preset-2`,
        towerId: 'dj-booth',
        towerName: 'DJ Booth',
        towerImage: selectedTower?.image || '',
        towerColor: '#ec4899',
        x: pMid.x,
        y: pMid.y + 14,
        player: 'P3',
        level: 4,
        target: 'First'
      },
      {
        id: `pt-preset-3`,
        towerId: 'commander',
        towerName: 'Commander',
        towerImage: selectedTower?.image || '',
        towerColor: '#3b82f6',
        x: pMid.x + 8,
        y: pMid.y + 14,
        player: 'P4',
        level: 3,
        target: 'First'
      },
      {
        id: `pt-preset-4`,
        towerId: 'accelerator',
        towerName: 'Accelerator',
        towerImage: selectedTower?.image || '',
        towerColor: '#a855f7',
        x: pMid.x - 6,
        y: pMid.y + 14,
        player: 'P1',
        level: 5,
        target: 'Strongest'
      },
      {
        id: `pt-preset-5`,
        towerId: 'accelerator',
        towerName: 'Accelerator',
        towerImage: selectedTower?.image || '',
        towerColor: '#a855f7',
        x: pMid.x - 12,
        y: pMid.y + 14,
        player: 'P2',
        level: 5,
        target: 'Strongest'
      },
      {
        id: `pt-preset-6`,
        towerId: 'farm',
        towerName: 'Farm',
        towerImage: selectedTower?.image || '',
        towerColor: '#22c55e',
        x: 85,
        y: 15,
        player: 'P1',
        level: 5,
        target: 'First'
      },
      {
        id: `pt-preset-7`,
        towerId: 'farm',
        towerName: 'Farm',
        towerImage: selectedTower?.image || '',
        towerColor: '#22c55e',
        x: 85,
        y: 28,
        player: 'P2',
        level: 5,
        target: 'First'
      }
    ];

    sampleTowers.forEach(t => onAddPlacedTower(t));
  };

  const selectedPlacedTower = placedTowers.find(t => t.id === selectedPlacedTowerId);

  // SVG path calculation for track points
  const generateSvgTrackPath = () => {
    if (!selectedMap.trackPoints || selectedMap.trackPoints.length < 2) return '';
    return selectedMap.trackPoints.reduce((acc, pt, index) => {
      return index === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  };

  return (
    <div className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
      {/* Canvas Top Bar */}
      <div className="p-3 border-b border-neutral-800 bg-neutral-900/80 flex flex-wrap items-center justify-between gap-3">
        {/* Selected Map Info Banner */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950 shrink-0">
            <img src={selectedMap.image} alt={selectedMap.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>{selectedMap.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {selectedMap.difficulty}
                </span>
              </h3>
            </div>
            <p className="text-[10px] text-neutral-400 font-mono">
              Interactive Map Canvas
            </p>
          </div>
        </div>

        {/* Player Selector (P1, P2, P3, P4) */}
        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
          <span className="text-[10px] font-mono text-neutral-500 px-2 uppercase flex items-center gap-1">
            <User className="w-3 h-3" />
            Player:
          </span>
          {(['P1', 'P2', 'P3', 'P4'] as PlayerSlot[]).map(slot => {
            const isCur = activePlayer === slot;
            const style = PLAYER_COLORS[slot];
            return (
              <button
                key={slot}
                type="button"
                onClick={() => onChangeActivePlayer(slot)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  isCur
                    ? `${style.bg} text-white shadow-md ring-2 ring-white/20`
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>

        {/* View & Tool Controls */}
        <div className="flex items-center gap-1.5">
          {/* Preset placement button */}
          <button
            type="button"
            onClick={handleLoadRecommendedPreset}
            className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
            title="Load recommended towers"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              Preset
            </span>
          </button>

          {/* Toggle Grid */}
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              showGrid
                ? 'bg-neutral-800 text-white border-neutral-600'
                : 'bg-neutral-900 text-neutral-500 border-neutral-800 hover:text-neutral-300'
            }`}
            title="Toggle Grid"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Clear Placements */}
          {placedTowers.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Clear all placed towers from the canvas?')) {
                  onClearPlacedTowers();
                }
              }}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-red-950/60 border border-neutral-800 hover:border-red-800 text-neutral-400 hover:text-red-400 transition-colors"
              title="Clear map canvas"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* BIG MAP CANVAS */}
      <div
        ref={canvasRef}
        onClick={handleCanvasClick}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        className={`relative w-full ${heightClass} bg-neutral-950 overflow-hidden cursor-crosshair select-none group`}
        style={{
          backgroundImage: showGrid
            ? 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)'
            : 'none',
          backgroundSize: '24px 24px'
        }}
      >
        {/* Terrain Background Tint depending on map theme */}
        <div
          className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
            selectedMap.theme === 'grass'
              ? 'bg-gradient-to-b from-emerald-950/20 to-neutral-950'
              : selectedMap.theme === 'desert'
                ? 'bg-gradient-to-b from-amber-950/25 to-neutral-950'
                : selectedMap.theme === 'wasteland'
                  ? 'bg-gradient-to-b from-green-950/30 to-neutral-950'
                  : selectedMap.theme === 'inferno'
                    ? 'bg-gradient-to-b from-red-950/30 to-neutral-950'
                    : selectedMap.theme === 'snow'
                      ? 'bg-gradient-to-b from-cyan-950/20 to-neutral-950'
                      : 'bg-gradient-to-b from-purple-950/20 to-neutral-950'
          }`}
        />

        {/* SVG Road Track & Cliff Zones */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Cliff Areas */}
          {selectedMap.cliffZones.map((cliff, idx) => (
            <g key={idx}>
              <rect
                x={cliff.x}
                y={cliff.y}
                width={cliff.w}
                height={cliff.h}
                rx="2"
                fill="#1f2937"
                fillOpacity="0.45"
                stroke="#4b5563"
                strokeWidth="0.5"
                strokeDasharray="1,1"
              />
              <text
                x={cliff.x + cliff.w / 2}
                y={cliff.y + cliff.h / 2 + 1}
                fontSize="2.5"
                fontFamily="monospace"
                fontWeight="bold"
                fill="#9ca3af"
                textAnchor="middle"
              >
                {cliff.label || 'CLIFF'}
              </text>
            </g>
          ))}

          {/* Path Outer Shadow / Border */}
          <path
            d={generateSvgTrackPath()}
            fill="none"
            stroke="#262626"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Path Main Road */}
          <path
            d={generateSvgTrackPath()}
            fill="none"
            stroke={
              selectedMap.theme === 'desert'
                ? '#b45309'
                : selectedMap.theme === 'wasteland'
                  ? '#166534'
                  : selectedMap.theme === 'inferno'
                    ? '#991b1b'
                    : selectedMap.theme === 'snow'
                      ? '#0284c7'
                      : '#525252'
            }
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Road Center Dotted Line */}
          <path
            d={generateSvgTrackPath()}
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeDasharray="2,3"
            strokeLinecap="round"
          />

          {/* Start and Finish markers */}
          {selectedMap.trackPoints.length > 0 && (
            <>
              <circle
                cx={selectedMap.trackPoints[0].x}
                cy={selectedMap.trackPoints[0].y}
                r="3.5"
                fill="#ef4444"
                fillOpacity="0.8"
                stroke="#ffffff"
                strokeWidth="0.6"
              />
              <text
                x={selectedMap.trackPoints[0].x}
                y={selectedMap.trackPoints[0].y + 1}
                fontSize="2"
                fontWeight="bold"
                fill="#ffffff"
                textAnchor="middle"
              >
                IN
              </text>

              <circle
                cx={selectedMap.trackPoints[selectedMap.trackPoints.length - 1].x}
                cy={selectedMap.trackPoints[selectedMap.trackPoints.length - 1].y}
                r="3.5"
                fill="#10b981"
                fillOpacity="0.8"
                stroke="#ffffff"
                strokeWidth="0.6"
              />
              <text
                x={selectedMap.trackPoints[selectedMap.trackPoints.length - 1].x}
                y={selectedMap.trackPoints[selectedMap.trackPoints.length - 1].y + 1}
                fontSize="2"
                fontWeight="bold"
                fill="#ffffff"
                textAnchor="middle"
              >
                BASE
              </text>
            </>
          )}
        </svg>

        {/* Empty Canvas Watermark */}
        {placedTowers.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-center text-neutral-400 mb-2 shadow-xl backdrop-blur-sm">
              <Move className="w-6 h-6 text-neutral-300 animate-pulse" />
            </div>
            <h4 className="text-sm font-bold text-white mb-0.5">
              Interactive Map Canvas
            </h4>
            <p className="text-[11px] text-neutral-400 max-w-sm font-mono leading-relaxed">
              Select a tower on the left and click anywhere on the canvas to place it. Drag to reposition.
            </p>
          </div>
        )}

        {/* Placed Towers Tokens on the Canvas */}
        {placedTowers.map(pt => {
          const isSelected = selectedPlacedTowerId === pt.id;
          const pStyle = PLAYER_COLORS[pt.player];

          return (
            <div
              key={pt.id}
              className="placed-tower-token absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-move"
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              onClick={e => {
                e.stopPropagation();
                setSelectedPlacedTowerId(pt.id);
              }}
              draggable
              onDragStart={() => setDraggingTowerId(pt.id)}
            >
              {/* Tower Token Circle */}
              <div
                className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center bg-neutral-950 shadow-2xl transition-transform hover:scale-110 ${
                  isSelected ? 'ring-4 ring-white border-white scale-110' : pStyle.border
                }`}
              >
                {/* Tower Photo */}
                <div className="w-7 h-7 rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center p-0.5 pointer-events-none">
                  {pt.towerImage ? (
                    <img src={pt.towerImage} alt={pt.towerName} className="max-w-full max-h-full w-auto h-auto object-contain" />
                  ) : (
                    <span className="text-[10px] font-bold text-white">
                      {pt.towerName.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Player Tag Badge (P1, P2, P3, P4) */}
                <span
                  className={`absolute -top-1.5 -left-1.5 ${pStyle.bg} text-white text-[8px] font-black px-1 rounded shadow`}
                >
                  {pt.player}
                </span>

                {/* Level Badge (Lv.0 - Lv.5) */}
                <span className="absolute -bottom-1 -right-1 bg-black text-amber-300 border border-neutral-700 text-[8px] font-mono font-bold px-1 rounded shadow">
                  L{pt.level}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Canvas Bottom Inspector Bar */}
      <div className="p-2.5 border-t border-neutral-800 bg-neutral-900/95 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        {selectedPlacedTower ? (
          <div className="flex-1 flex flex-wrap items-center justify-between gap-3 min-w-0">
            {/* Tower Info */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-950 shrink-0 flex items-center justify-center p-0.5">
                <img src={selectedPlacedTower.towerImage} alt="" className="max-w-full max-h-full w-auto h-auto object-contain" />
              </div>
              <div>
                <span className="font-bold text-white text-xs block">
                  {selectedPlacedTower.towerName}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {Math.round(selectedPlacedTower.x)}%, {Math.round(selectedPlacedTower.y)}%
                </span>
              </div>
            </div>

            {/* Upgrade Level Control */}
            <div className="flex items-center gap-1 bg-neutral-950 px-2 py-0.5 rounded-xl border border-neutral-800">
              <span className="text-[10px] font-mono text-neutral-400 mr-1">
                Level:
              </span>
              <button
                type="button"
                onClick={() =>
                  onUpdatePlacedTower({
                    ...selectedPlacedTower,
                    level: Math.max(0, selectedPlacedTower.level - 1)
                  })
                }
                className="w-5 h-5 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-amber-300 font-mono text-xs">
                Lv.{selectedPlacedTower.level}
              </span>
              <button
                type="button"
                onClick={() =>
                  onUpdatePlacedTower({
                    ...selectedPlacedTower,
                    level: Math.min(5, selectedPlacedTower.level + 1)
                  })
                }
                className="w-5 h-5 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300"
              >
                +
              </button>
            </div>

            {/* Change Player Assignment */}
            <div className="flex items-center gap-1 bg-neutral-950 px-2 py-0.5 rounded-xl border border-neutral-800">
              <span className="text-[10px] font-mono text-neutral-400 mr-1">
                Player:
              </span>
              {(['P1', 'P2', 'P3', 'P4'] as PlayerSlot[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onUpdatePlacedTower({ ...selectedPlacedTower, player: p })}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    selectedPlacedTower.player === p
                      ? `${PLAYER_COLORS[p].bg} text-white`
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Target Priority */}
            <div className="flex items-center gap-1 bg-neutral-950 px-2 py-0.5 rounded-xl border border-neutral-800">
              <Target className="w-3 h-3 text-neutral-400" />
              <select
                value={selectedPlacedTower.target}
                onChange={e =>
                  onUpdatePlacedTower({
                    ...selectedPlacedTower,
                    target: e.target.value as any
                  })
                }
                className="bg-transparent text-[11px] font-mono text-white focus:outline-none cursor-pointer"
              >
                <option value="First" className="bg-neutral-900">First</option>
                <option value="Last" className="bg-neutral-900">Last</option>
                <option value="Strongest" className="bg-neutral-900">Strongest</option>
                <option value="Weakest" className="bg-neutral-900">Weakest</option>
              </select>
            </div>

            {/* Remove Placed Tower */}
            <button
              type="button"
              onClick={() => {
                onRemovePlacedTower(selectedPlacedTower.id);
                setSelectedPlacedTowerId(null);
              }}
              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-300 flex items-center gap-1 transition-colors"
              title="Delete tower"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="text-[10px]">Delete</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-neutral-400 text-xs">
              <span className="font-mono text-[11px]">
                Towers on map:{' '}
                <strong className="text-white">{placedTowers.length}</strong>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-500 text-[10px]">
                Click placed tower to adjust level or delete
              </span>
            </div>
            {selectedTower && (
              <span className="text-[10px] font-mono text-neutral-300 bg-neutral-950 px-2 py-0.5 rounded-lg border border-neutral-800">
                Active:{' '}
                <strong className="text-white">{selectedTower.name}</strong>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
