import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../i18n/translations';
import { CustomDocTemplate } from '../types/customDoc';
import { PhotoAsset } from '../data/tdsPhotoAssets';
import { loadStudioDoc, saveStudioDoc } from '../utils/studioStorage';
import { CustomAssetSidebar } from './studio/CustomAssetSidebar';
import { CustomDocView } from './studio/CustomDocView';
import { CustomDocGeneratorModal } from './studio/CustomDocGeneratorModal';
import { Tactic } from '../types/tds';

interface TacticsGeneratorProps {
  lang: Language;
  onAddTactic?: (newTactic: Tactic) => void;
}

export const TacticsGenerator: React.FC<TacticsGeneratorProps> = ({ lang, onAddTactic }) => {
  // Main document state, restored from the latest saved draft (or an EMPTY default strategy).
  const [docTemplate, setDocTemplate] = useState<CustomDocTemplate>(() => loadStudioDoc(lang));
  const [saveError, setSaveError] = useState<string | null>(null);

  // Autosave: every change is written to localStorage (debounced), and the latest state is flushed
  // immediately when the tab is hidden, the page is closed/refreshed, or the studio unmounts.
  const latestDocRef = useRef(docTemplate);
  const dirtyRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);

  const flushSave = React.useCallback(() => {
    if (timerRef.current !== undefined) {
      window.clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
    if (!dirtyRef.current) return;
    const result = saveStudioDoc(latestDocRef.current);
    if (result.ok) dirtyRef.current = false;
    setSaveError(result.ok ? null : result.error || 'Storage unavailable');
  }, []);

  useEffect(() => {
    latestDocRef.current = docTemplate;
    dirtyRef.current = true;
    if (timerRef.current !== undefined) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(flushSave, 250);
  }, [docTemplate, flushSave]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flushSave();
    };
    window.addEventListener('pagehide', flushSave);
    window.addEventListener('beforeunload', flushSave);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', flushSave);
      window.removeEventListener('beforeunload', flushSave);
      document.removeEventListener('visibilitychange', onVisibility);
      flushSave();
    };
  }, [flushSave]);

  // Selection from the left panel. Towers and maps are tracked separately so a map can be chosen
  // while a tower stays selected for placing. Clicking the selected item again deselects it.
  const [selectedTower, setSelectedTower] = useState<PhotoAsset | null>(null);
  const [selectedMap, setSelectedMap] = useState<PhotoAsset | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectAsset = (asset: PhotoAsset) => {
    if (asset.category === 'maps') {
      if (selectedMap?.id === asset.id) {
        // Deselect only: the map already used by the strategy and all placements stay untouched.
        setSelectedMap(null);
        return;
      }
      setSelectedMap(asset);
      // Choosing a map applies it to every player block of the strategy.
      setDocTemplate(prev => ({
        ...prev,
        tab2: {
          ...prev.tab2,
          players: prev.tab2.players.map(p => ({ ...p, mapPhoto: asset.url }))
        }
      }));
      return;
    }
    if (asset.category === 'towers') {
      setSelectedTower(prev => (prev?.id === asset.id ? null : asset));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">
      {saveError && (
        <div
          role="alert"
          className="mx-4 sm:mx-6 lg:mx-0 lg:mr-6 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-2 text-xs font-mono text-red-300"
        >
          Progress could not be saved to this browser (storage may be full - large uploaded images take the most
          space). Export your strategy as JSON to keep a backup.
        </div>
      )}

      {/* Workspace: Left Photo Assets Sidebar + Center/Right Customizable Google Doc Template */}
      <div className="flex flex-col lg:flex-row gap-6 items-start px-4 sm:px-6 lg:px-0 lg:pr-6">
        {/* Left Sidebar: Ready Photos (Towers, Maps) */}
        <CustomAssetSidebar
          selectedTower={selectedTower}
          selectedMap={selectedMap}
          onSelectAsset={handleSelectAsset}
          lang={lang}
        />

        {/* Center / Right: The Complete TDS Google Doc Template */}
        <CustomDocView
          doc={docTemplate}
          onChangeDoc={setDocTemplate}
          selectedAsset={selectedTower}
          selectedMap={selectedMap}
          onGenerateDoc={() => setIsModalOpen(true)}
          lang={lang}
        />
      </div>

      {/* Generation Output Modal */}
      <CustomDocGeneratorModal
        doc={docTemplate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveToVault={onAddTactic}
        lang={lang}
      />
    </div>
  );
};
