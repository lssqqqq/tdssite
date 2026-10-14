import React from 'react';
import { TowerItem } from '../../types/generator';
import { Plus, X, Check } from 'lucide-react';
import { Language } from '../../i18n/translations';

interface HeroGridProps {
  heroTowers: TowerItem[];
  selectedTower: TowerItem | null;
  onSelectTower: (tower: TowerItem) => void;
  onAddHeroTower: (tower: TowerItem) => void;
  onRemoveHeroTower: (towerId: string) => void;
  lang?: Language;
}

export const HeroGrid: React.FC<HeroGridProps> = ({
  heroTowers,
  selectedTower,
  onSelectTower,
  onAddHeroTower,
  onRemoveHeroTower
}) => {
  return (
    <div className="space-y-3 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-neutral-800/80">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-200 font-bold">
            Tactical Hero Grid (Towers in Tactic)
          </h4>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
            {heroTowers.length} heroes
          </span>
        </div>

        <span className="text-[11px] text-neutral-400 font-mono">
          Click a hero to select and insert onto the map below
        </span>
      </div>

      {/* Hero Slots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {heroTowers.map(tower => {
          const isSelected = selectedTower?.id === tower.id;
          return (
            <div
              key={tower.id}
              onClick={() => onSelectTower(tower)}
              className={`group relative rounded-xl border p-2.5 cursor-pointer transition-all flex flex-col items-center text-center ${
                isSelected
                  ? 'border-white bg-neutral-850 ring-2 ring-white/30 shadow-lg'
                  : 'border-neutral-800 bg-neutral-950/70 hover:border-neutral-700 hover:bg-neutral-900'
              }`}
            >
              {/* Active Selection Pin */}
              {isSelected && (
                <div className="absolute top-1.5 left-1.5 bg-blue-600 text-white rounded-full p-0.5 shadow">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onRemoveHeroTower(tower.id);
                }}
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-red-400 hover:border-red-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove from grid"
              >
                <X className="w-3 h-3" />
              </button>

              {/* Tower Photo */}
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 mb-2 p-0.5 flex items-center justify-center">
                <img
                  src={tower.image}
                  alt={tower.name}
                  className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Tower Name & Stats */}
              <span className="text-xs font-bold text-white truncate max-w-full">
                {tower.name}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono mt-0.5">
                ${tower.cost}
              </span>
              <span
                className="text-[9px] font-mono px-1.5 py-0.2 rounded border mt-1"
                style={{
                  borderColor: `${tower.color}66`,
                  color: tower.color
                }}
              >
                {tower.category}
              </span>
            </div>
          );
        })}

        {/* Add selected tower to hero grid slot */}
        {selectedTower && !heroTowers.some(t => t.id === selectedTower.id) && (
          <button
            type="button"
            onClick={() => onAddHeroTower(selectedTower)}
            className="rounded-xl border border-dashed border-neutral-700 hover:border-white p-2.5 bg-neutral-950/40 hover:bg-neutral-900/60 transition-all flex flex-col items-center justify-center text-neutral-400 hover:text-white min-h-[120px]"
          >
            <Plus className="w-5 h-5 mb-1 text-blue-400" />
            <span className="text-[11px] font-bold">
              Add
            </span>
            <span className="text-[10px] text-neutral-500 font-mono truncate max-w-[100px]">
              {selectedTower.name}
            </span>
          </button>
        )}
      </div>

      {heroTowers.length === 0 && (
        <div className="text-center py-6 text-xs text-neutral-500 font-mono">
          No heroes in grid yet. Pick towers from the left panel to populate your tactic loadout.
        </div>
      )}
    </div>
  );
};
