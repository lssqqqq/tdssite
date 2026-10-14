import React, { useState, useRef } from 'react';
import { TowerItem, MapItem, TowerCategory } from '../../types/generator';
import { TDS_TOWERS, TDS_MAPS } from '../../data/tdsGeneratorData';
import { Language } from '../../i18n/translations';
import {
  MapPin,
  Shield,
  Search,
  Upload,
  Plus,
  Check,
  Info
} from 'lucide-react';

interface StudioSidebarProps {
  selectedMap: MapItem;
  onSelectMap: (map: MapItem) => void;
  selectedTower: TowerItem | null;
  onSelectTower: (tower: TowerItem) => void;
  onQuickPlaceTower?: (tower: TowerItem) => void;
  lang?: Language;
}

export const StudioSidebar: React.FC<StudioSidebarProps> = ({
  selectedMap,
  onSelectMap,
  selectedTower,
  onSelectTower,
  onQuickPlaceTower
}) => {
  const [activeCategory, setActiveCategory] = useState<'maps' | 'towers'>('maps');
  const [searchQuery, setSearchQuery] = useState('');
  const [towerFilter, setTowerFilter] = useState<TowerCategory | 'All'>('All');

  // Custom User Uploads
  const [customTowers, setCustomTowers] = useState<TowerItem[]>([]);
  const [customMaps, setCustomMaps] = useState<MapItem[]>([]);
  const [isUploadingFor, setIsUploadingFor] = useState<'tower' | 'map'>('tower');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allTowers = [...customTowers, ...TDS_TOWERS];
  const allMaps = [...customMaps, ...TDS_MAPS];

  const filteredTowers = allTowers.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      towerFilter === 'All' || t.category === towerFilter;
    return matchesSearch && matchesCat;
  });

  const filteredMaps = allMaps.filter(m => {
    return (
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const result = event.target?.result as string;
      if (isUploadingFor === 'tower') {
        const newName = file.name.replace(/\.[^/.]+$/, '');
        const newTower: TowerItem = {
          id: `custom-tower-${Date.now()}`,
          name: newName,
          nameRu: newName,
          category: 'Custom',
          cost: 1000,
          dps: 'Custom DPS',
          image: result,
          color: '#38bdf8',
          range: 16,
          description: 'Custom tower with user image'
        };
        setCustomTowers(prev => [newTower, ...prev]);
        onSelectTower(newTower);
      } else {
        const newName = file.name.replace(/\.[^/.]+$/, '');
        const newMap: MapItem = {
          id: `custom-map-${Date.now()}`,
          name: newName,
          nameRu: newName,
          difficulty: 'Special',
          waves: 40,
          theme: 'grass',
          image: result,
          trackPoints: [
            { x: 0, y: 50 },
            { x: 30, y: 50 },
            { x: 30, y: 20 },
            { x: 70, y: 20 },
            { x: 70, y: 80 },
            { x: 100, y: 80 }
          ],
          cliffZones: [{ x: 40, y: 35, w: 20, h: 25, label: 'Custom Cliff' }],
          description: 'Custom map with uploaded image'
        };
        setCustomMaps(prev => [newMap, ...prev]);
        onSelectMap(newMap);
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const towerCategories: (TowerCategory | 'All')[] = [
    'All',
    'Hardcore',
    'Support',
    'Golden',
    'Damage',
    'Economy',
    'Event'
  ];

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col h-[740px] shadow-2xl overflow-hidden">
      {/* Category Tabs: Towers vs Maps */}
      <div className="p-3 border-b border-neutral-800 bg-neutral-900/60 flex items-center gap-2">
        <button
          onClick={() => setActiveCategory('maps')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
            activeCategory === 'maps'
              ? 'bg-white text-black border-white shadow-md'
              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Maps</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-800/80 text-neutral-300">
            {allMaps.length}
          </span>
        </button>

        <button
          onClick={() => setActiveCategory('towers')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
            activeCategory === 'towers'
              ? 'bg-white text-black border-white shadow-md'
              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Towers</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-800/80 text-neutral-300">
            {allTowers.length}
          </span>
        </button>
      </div>

      {/* Search and Action Toolbar */}
      <div className="p-3 border-b border-neutral-800 space-y-2.5 bg-neutral-950/80">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder={activeCategory === 'maps' ? 'Search maps...' : 'Search towers...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-600 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>

        {/* Category-specific filter chips for Towers */}
        {activeCategory === 'towers' && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-[11px]">
            {towerCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setTowerFilter(cat)}
                className={`px-2 py-0.5 rounded-lg whitespace-nowrap transition-colors border ${
                  towerFilter === cat
                    ? 'bg-neutral-200 text-black border-white font-medium'
                    : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Upload Custom Photo Button */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-0.5">
          <span className="font-mono text-[10px] text-neutral-500">
            {activeCategory === 'maps'
              ? 'Click map to place on canvas'
              : 'Select tower to place'}
          </span>
          <button
            onClick={() => {
              setIsUploadingFor(activeCategory === 'towers' ? 'tower' : 'map');
              fileInputRef.current?.click();
            }}
            className="inline-flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white px-2 py-1 bg-neutral-900 hover:bg-neutral-800 rounded-lg border border-neutral-800 transition-colors"
            title="Upload photo"
          >
            <Upload className="w-3.5 h-3.5 text-neutral-400" />
            <span>Add Photo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {/* Main List Section */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
        {/* ================= MAPS CATEGORY ================= */}
        {activeCategory === 'maps' && (
          <div className="space-y-3">
            <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 px-1">
              Select Map for Center Canvas
            </div>

            {filteredMaps.map(map => {
              const isSelected = selectedMap.id === map.id;
              return (
                <div
                  key={map.id}
                  onClick={() => onSelectMap(map)}
                  className={`group relative rounded-xl border p-2.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-white bg-neutral-900 ring-2 ring-white/20 shadow-lg'
                      : 'border-neutral-800/80 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/80'
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Map Photo / Artwork Preview */}
                    <div className="w-24 h-16 rounded-lg overflow-hidden border border-neutral-800 shrink-0 bg-neutral-950 relative">
                      <img
                        src={map.image}
                        alt={map.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-white text-black p-0.5 rounded-full shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Map Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-white truncate">
                            {map.name}
                          </h4>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase shrink-0 ${
                              map.difficulty === 'Hard' || map.difficulty === 'Special'
                                ? 'border-amber-900/50 bg-amber-950/40 text-amber-300'
                                : 'border-neutral-700 bg-neutral-800 text-neutral-300'
                            }`}
                          >
                            {map.difficulty}
                          </span>
                        </div>
                        {map.description && (
                          <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                            {map.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mt-1">
                        <span>{map.waves} waves</span>
                        <span className="text-neutral-400 group-hover:text-white transition-colors">
                          {isSelected ? 'Active on canvas ✓' : 'Open on canvas →'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredMaps.length === 0 && (
              <div className="text-center py-10 text-xs text-neutral-500">
                No maps found.
              </div>
            )}
          </div>
        )}

        {/* ================= TOWERS CATEGORY ================= */}
        {activeCategory === 'towers' && (
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 px-1 flex items-center justify-between">
              <span>Available Towers</span>
              <span>{filteredTowers.length}</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {filteredTowers.map(tower => {
                const isSelected = selectedTower?.id === tower.id;
                return (
                  <div
                    key={tower.id}
                    onClick={() => onSelectTower(tower)}
                    draggable
                    onDragStart={e => {
                      e.dataTransfer.setData('text/plain', tower.id);
                    }}
                    className={`group rounded-xl border p-2 cursor-pointer transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-white bg-neutral-900 shadow-md ring-1 ring-white/30'
                        : 'border-neutral-800/80 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/80'
                    }`}
                  >
                    {/* Tower Photo / Badge */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shrink-0 relative flex items-center justify-center p-0.5">
                      <img
                        src={tower.image}
                        alt={tower.name}
                        className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform"
                      />
                      {tower.cliff && (
                        <span
                          className="absolute bottom-0 right-0 bg-blue-600 text-[8px] font-mono font-bold px-1 rounded-tl text-white"
                          title="Cliff only"
                        >
                          CLIFF
                        </span>
                      )}
                    </div>

                    {/* Tower Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white truncate">
                          {tower.name}
                        </span>
                        <span
                          className="text-[9px] font-mono px-1.5 py-0.2 rounded border"
                          style={{
                            borderColor: `${tower.color}66`,
                            color: tower.color
                          }}
                        >
                          {tower.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mt-1">
                        <span className="text-emerald-400 font-semibold">${tower.cost}</span>
                        <span className="text-neutral-500">{tower.dps || 'DPS'}</span>
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    {onQuickPlaceTower && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onQuickPlaceTower(tower);
                        }}
                        className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-white hover:text-black border border-neutral-700 flex items-center justify-center text-neutral-300 transition-colors shrink-0"
                        title="Place on canvas center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredTowers.length === 0 && (
              <div className="text-center py-10 text-xs text-neutral-500">
                No towers found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info / Selected Tower Placement Helper */}
      <div className="p-3 border-t border-neutral-800 bg-neutral-900/90 text-xs">
        {selectedTower ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg overflow-hidden border border-neutral-700 shrink-0 flex items-center justify-center p-0.5 bg-neutral-950">
                <img src={selectedTower.image} alt={selectedTower.name} className="max-w-full max-h-full w-auto h-auto object-contain" />
              </div>
              <div className="truncate">
                <p className="text-[11px] font-bold text-white truncate">{selectedTower.name}</p>
                <p className="text-[9px] text-neutral-400 font-mono">
                  Ready to place on canvas
                </p>
              </div>
            </div>
            {onQuickPlaceTower && (
              <button
                onClick={() => onQuickPlaceTower(selectedTower)}
                className="px-2.5 py-1 bg-white text-black font-bold text-[10px] rounded-lg hover:bg-neutral-200 transition-colors shrink-0"
              >
                Place
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
            <Info className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span>
              Select a map to view its board or pick a tower to place.
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
