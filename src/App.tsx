import React, { useState, useEffect } from 'react';
import { MainMenu } from './components/MainMenu';
import { TacticsList } from './components/TacticsList';
import { TacticsGenerator } from './components/TacticsGenerator';
import { TdsA4Editor } from './components/editor/TdsA4Editor';
import { Tactic } from './types/tds';
import { INITIAL_TACTICS } from './data/tdsData';
import { translations, Language } from './i18n/translations';
import {
  Search,
  X,
  Edit3,
  Check,
  Wand2,
  Database,
  Home,
  Heart,
  Megaphone,
  User,
  RefreshCw
} from 'lucide-react';

const STORAGE_KEY_TACTICS = 'tds_tactics_vault_v5';
const STORAGE_KEY_INFO_TABS = 'tds_tactics_info_tabs_v7';

type TabType = 'home' | 'list' | 'generator' | 'editor';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // English is the permanent language
  const lang: Language = 'en';
  const t = translations.en;

  // Tactics state
  const [tactics, setTactics] = useState<Tactic[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TACTICS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load tactics from storage:', e);
    }
    return INITIAL_TACTICS;
  });

  // Custom Info Section state
  const [infoTexts, setInfoTexts] = useState<Record<TabType, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INFO_TABS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load info texts from storage:', e);
    }
    return {
      home: translations.en.info.defaultText,
      generator: translations.en.info.defaultText,
      list: translations.en.info.listDefaultText,
      editor: translations.en.info.defaultText
    };
  });

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [tempInfoText, setTempInfoText] = useState(infoTexts['home']);

  // Sync tempInfoText when switching active tab
  useEffect(() => {
    setTempInfoText(infoTexts[activeTab]);
    setIsEditingInfo(false);
  }, [activeTab]);

  // Sync tactics to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TACTICS, JSON.stringify(tactics));
    } catch (e) {
      console.error('Failed to save tactics:', e);
    }
  }, [tactics]);

  // Sync info texts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INFO_TABS, JSON.stringify(infoTexts));
    } catch (e) {
      console.error('Failed to save info texts:', e);
    }
  }, [infoTexts]);

  const handleAddTactic = (newTactic: Tactic) => {
    setTactics(prev => [newTactic, ...prev]);
  };

  const handleUpdateTactic = (updated: Tactic) => {
    setTactics(prev => prev.map(t => (t.id === updated.id ? updated : t)));
  };

  const handleDeleteTactic = (id: string) => {
    setTactics(prev => prev.filter(t => t.id !== id));
  };

  const handleSaveInfo = () => {
    setInfoTexts(prev => ({
      ...prev,
      [activeTab]: tempInfoText
    }));
    setIsEditingInfo(false);
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset all strategies and information text to default values?')) {
      setTactics(INITIAL_TACTICS);
      const defaults = {
        home: translations.en.info.defaultText,
        generator: translations.en.info.defaultText,
        list: translations.en.info.listDefaultText,
        editor: translations.en.info.defaultText
      };
      setInfoTexts(defaults);
      setTempInfoText(defaults[activeTab]);
      localStorage.removeItem(STORAGE_KEY_TACTICS);
      localStorage.removeItem(STORAGE_KEY_INFO_TABS);
    }
  };

  // Scroll progress for top RGB indicator
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const scrollY = window.scrollY;
      const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  const isStudioTab = activeTab === 'generator' || activeTab === 'editor';

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans antialiased flex flex-col justify-between">
      {/* TOP SCROLL PROGRESS BAR */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[2.5px] bg-neutral-900/50 pointer-events-none">
        <div
          className="h-full bg-white transition-[width] duration-200 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div>
        {/* HEADER NAVIGATION BAR */}
        <header className="sticky top-3 z-50 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="rounded-full border border-neutral-800 bg-neutral-950/85 backdrop-blur-md px-3 sm:px-6 py-2.5 min-h-[3.5rem] flex items-center justify-between shadow-2xl relative">
            {/* LEFT: LOGO AND SITE NAME */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl border border-neutral-700 bg-neutral-900 flex items-center justify-center text-white">
                <span className="font-display text-xs font-bold tracking-wider text-white select-none">
                  TDS
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[15px] font-bold text-white tracking-tight leading-tight flex items-center gap-1.5">
                  {t.siteName}
                </span>
                <span className="text-[10px] font-mono text-neutral-500 hidden sm:inline">
                  {t.subBrand}
                </span>
              </div>
            </div>

            {/* CENTER: NAV TABS */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 absolute left-1/2 -translate-x-1/2">
              <button
                onClick={() => setActiveTab('home')}
                className={`font-display px-3.5 py-1.5 text-[13px] font-semibold tracking-[0.01em] rounded-full transition-colors ${
                  activeTab === 'home'
                    ? 'text-white font-bold bg-neutral-900 border border-neutral-700 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t.nav.home}
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`font-display px-3.5 py-1.5 text-[13px] font-semibold tracking-[0.01em] rounded-full transition-colors ${
                  activeTab === 'list'
                    ? 'text-white font-bold bg-neutral-900 border border-neutral-700 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t.nav.tacticsList}
              </button>
              <button
                onClick={() => setActiveTab('generator')}
                className={`font-display px-3.5 py-1.5 text-[13px] font-semibold tracking-[0.01em] rounded-full transition-colors ${
                  activeTab === 'generator'
                    ? 'text-white font-bold bg-neutral-900 border border-neutral-700 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t.nav.generator}
              </button>
            </nav>

            {/* RIGHT: ACTION BUTTONS */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('list')}
                className="font-display px-4 sm:px-5 py-2 text-[13px] font-bold rounded-full bg-white text-black hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>{t.nav.cta}</span>
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </div>

          {/* MOBILE TABS MENU (COMPACT SCREENS) */}
          <div className="flex md:hidden justify-center mt-2">
            <div className="inline-flex p-1 rounded-full bg-neutral-950 border border-neutral-800">
              <button
                onClick={() => setActiveTab('home')}
                className={`font-display px-3 py-1 text-[12px] font-semibold rounded-full transition-colors ${
                  activeTab === 'home' ? 'bg-white text-black font-bold' : 'text-neutral-400'
                }`}
              >
                {t.nav.home}
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`font-display px-3 py-1 text-[12px] font-semibold rounded-full transition-colors ${
                  activeTab === 'list' ? 'bg-white text-black font-bold' : 'text-neutral-400'
                }`}
              >
                {t.nav.tacticsList}
              </button>
              <button
                onClick={() => setActiveTab('generator')}
                className={`font-display px-3 py-1 text-[12px] font-semibold rounded-full transition-colors ${
                  activeTab === 'generator' ? 'bg-white text-black font-bold' : 'text-neutral-400'
                }`}
              >
                {t.nav.generator}
              </button>
            </div>
          </div>
        </header>

        {/* MAIN BODY */}
        {/* Strategy Studio spans the full viewport width so its left sidebar sits on the far-left edge;
            every other tab keeps the centered reading column. */}
        <main className={`${isStudioTab ? 'w-full px-0' : 'max-w-5xl mx-auto px-4'} py-6 md:py-10 space-y-10 transition-all`}>
          {/* SEARCH BAR (Monochrome style) - hidden in Strategy Studio and Editor */}
          {activeTab !== 'generator' && activeTab !== 'editor' && (
            <section className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-neutral-500 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder={t.search.placeholder}
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    if (activeTab === 'home' && e.target.value.trim().length > 0) {
                      setActiveTab('list');
                    }
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-white rounded-2xl pl-12 pr-12 py-3.5 text-sm md:text-base text-white placeholder-neutral-500 focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-white"
                    title={t.search.clear}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {searchQuery && activeTab !== 'list' && (
                <div className="text-xs font-mono text-neutral-400 px-1 flex items-center justify-between">
                  <span>
                    {t.search.queryLabel} "{searchQuery}"
                  </span>
                  <button
                    onClick={() => setActiveTab('list')}
                    className="text-white underline hover:no-underline"
                  >
                    {t.search.goToList}
                  </button>
                </div>
              )}
            </section>
          )}

          {/* DYNAMIC TAB CONTENT */}
          {activeTab === 'home' && (
            <MainMenu
              onNavigate={tab => setActiveTab(tab)}
              tacticsCount={tactics.length}
              lang={lang}
            />
          )}

          {activeTab === 'list' && (
            <TacticsList
              tactics={tactics}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
              onAddTactic={handleAddTactic}
              onUpdateTactic={handleUpdateTactic}
              onDeleteTactic={handleDeleteTactic}
              lang={lang}
            />
          )}

          {(activeTab === 'generator' || activeTab === 'editor') && (
            <TacticsGenerator lang={lang} onAddTactic={handleAddTactic} />
          )}

          {/* INFO SECTION */}
          <section className={`rounded-2xl border border-neutral-800 bg-neutral-950 p-6 md:p-8 space-y-4 ${isStudioTab ? 'mx-4 sm:mx-6 lg:mx-auto lg:max-w-7xl' : ''}`}>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-300 font-bold">
                  {t.info.title}
                </h2>
              </div>

              {/* Edit / Save Info Controls */}
              {isEditingInfo ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setTempInfoText(infoTexts[activeTab]);
                      setIsEditingInfo(false);
                    }}
                    className="px-3 py-1 text-xs font-mono rounded-lg border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
                  >
                    {t.info.cancelBtn}
                  </button>
                  <button
                    onClick={handleSaveInfo}
                    className="px-3 py-1 text-xs font-mono rounded-lg bg-white text-black hover:bg-neutral-200 font-bold flex items-center gap-1 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.info.saveBtn}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setTempInfoText(infoTexts[activeTab]);
                    setIsEditingInfo(true);
                  }}
                  className="px-3 py-1 text-xs font-mono rounded-lg border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  title={t.info.editBtn}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t.info.editBtn}</span>
                </button>
              )}
            </div>

            {/* Info Block Content */}
            {isEditingInfo ? (
              <div className="space-y-3">
                <textarea
                  rows={5}
                  value={tempInfoText}
                  onChange={e => setTempInfoText(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-white rounded-xl p-3 text-sm text-white font-mono focus:outline-none leading-relaxed"
                />
                <p className="text-[11px] text-neutral-500 font-mono">
                  {t.info.hint}
                </p>
              </div>
            ) : (
              <div className="text-sm text-neutral-300 font-sans whitespace-pre-line leading-relaxed">
                {infoTexts[activeTab]}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-neutral-900 bg-neutral-950 mt-16 py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-neutral-400">
              <User className="w-3.5 h-3.5" />
              <span>{t.footer.authors}</span>
            </span>
            <span className="text-neutral-700">·</span>
            <span className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors cursor-pointer">
              <Heart className="w-3.5 h-3.5" />
              <span>{t.footer.support}</span>
            </span>
            <span className="text-neutral-700">·</span>
            <span className="flex items-center gap-1.5 hover:text-neutral-300 transition-colors cursor-pointer">
              <Megaphone className="w-3.5 h-3.5" />
              <span>{t.footer.ads}</span>
            </span>
          </div>

          <button
            onClick={handleResetToDefaults}
            className="hover:text-neutral-300 flex items-center gap-1 transition-colors text-[11px]"
            title={t.footer.reset}
          >
            <RefreshCw className="w-3 h-3" />
            <span>{t.footer.reset}</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
