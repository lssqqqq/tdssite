import React, { useState } from 'react';
import { PhotoAsset, TOWER_PHOTOS, MAP_PHOTOS, getAssetDisplayName } from '../../data/tdsPhotoAssets';
import { Search, Shield, MapPin, Check } from 'lucide-react';
import { translations, Language } from '../../i18n/translations';

interface CustomAssetSidebarProps {
  /** Currently selected tower (or null). */
  selectedTower: PhotoAsset | null;
  /** Currently selected map (or null). */
  selectedMap: PhotoAsset | null;
  /** Called on every click; the parent toggles (select / deselect) the clicked asset. */
  onSelectAsset: (asset: PhotoAsset) => void;
  lang: Language;
}

export const CustomAssetSidebar: React.FC<CustomAssetSidebarProps> = ({
  selectedTower,
  selectedMap,
  onSelectAsset,
  lang
}) => {
  const [activeCategory, setActiveCategory] = useState<'towers' | 'maps'>('towers');
  const [searchQuery, setSearchQuery] = useState('');

  const t = translations[lang].studio;
  const allAssets = activeCategory === 'towers' ? TOWER_PHOTOS : MAP_PHOTOS;

  const filteredAssets = allAssets.filter(asset => {
    const displayName = getAssetDisplayName(asset, lang);
    return (
      displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const categories = [
    { id: 'towers', label: t.sidebarTowers, icon: Shield },
    { id: 'maps', label: t.sidebarMaps, icon: MapPin }
  ] as const;

  return (
    <aside className="studio-sidebar w-full shrink-0 bg-neutral-950 border border-neutral-800 rounded-3xl flex flex-col max-h-[calc(100vh-2.5rem)] shadow-2xl overflow-hidden z-20 lg:rounded-l-none lg:border-l-0">
      {/* Category Tabs: ONLY Towers & Maps (Strict single-language, zero parentheses) */}
      <div className="p-2 border-b border-neutral-800 bg-neutral-900/60 flex gap-2">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isCur = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-1 py-2.5 px-2 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                isCur
                  ? 'bg-white text-black border-white shadow-md'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-neutral-800 bg-neutral-950">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder={activeCategory === 'towers' ? t.searchTowersPlaceholder : t.searchMapsPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* Grid of Ready Photos */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
        <div className="grid grid-cols-2 gap-2">
          {filteredAssets.map(asset => {
            const displayName = getAssetDisplayName(asset, lang);
            const isSelected = (asset.category === 'maps' ? selectedMap : selectedTower)?.id === asset.id;
            return (
              <div
                key={asset.id}
                role="button"
                aria-pressed={isSelected}
                onClick={() => onSelectAsset({ ...asset, name: displayName })}
                className={`group relative rounded-2xl border-2 p-2 cursor-pointer transition-all flex flex-col items-center text-center ${
                  isSelected
                    ? 'border-white bg-neutral-900 ring-2 ring-white/30 shadow-lg'
                    : 'border-neutral-800 bg-neutral-950 hover:border-neutral-600 hover:bg-neutral-900'
                }`}
              >
                {/* Photo Barrier Frame */}
                <div className="w-full h-20 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-700/80 mb-1.5 flex items-center justify-center p-1.5">
                  <img
                    src={asset.url}
                    alt={displayName}
                    className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform select-none"
                    loading="lazy"
                  />
                </div>

                <span className="text-[11px] font-bold text-white truncate max-w-full">
                  {displayName}
                </span>

                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 bg-white text-black p-0.5 rounded-full shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-12 text-xs text-neutral-500 font-mono">
            {t.nothingFound}
          </div>
        )}
      </div>
    </aside>
  );
};
