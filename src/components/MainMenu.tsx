import { Wand2, ArrowRight, FileEdit, Sparkles } from 'lucide-react';
import { translations, Language } from '../i18n/translations';

interface MainMenuProps {
  onNavigate: (tab: 'list' | 'generator' | 'editor') => void;
  tacticsCount: number;
  lang: Language;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onNavigate,
  tacticsCount,
  lang
}) => {
  const t = translations[lang].mainMenu;
  const te = translations[lang].editor;

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-4 md:py-8">
      {/* Hero Header */}
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.08]">
          {t.heroTitle1}<br />
          {t.heroTitle2}
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
          {t.heroDescription}
        </p>
      </div>

      {/* Featured Banner: A4 Tactics Web Editor */}
      <div className="rounded-3xl border border-purple-800/60 bg-gradient-to-r from-neutral-950 via-purple-950/20 to-neutral-950 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
        <div className="space-y-2 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-700/60 text-xs font-mono text-purple-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>NEW: A4 Tactics Web-Editor</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            TDS Strategy Document Editor
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Craft long-form tactics on true A4 pages (210 × 297 mm) with Tiptap/ProseMirror, wave tables, player decks, dark/light page styling, and auto-save.
          </p>
        </div>

        <button
          onClick={() => onNavigate('editor')}
          className="relative z-10 px-6 py-3.5 rounded-2xl bg-white text-black font-black text-sm hover:bg-neutral-200 transition-all shadow-xl hover:shadow-purple-500/20 flex items-center gap-2 shrink-0 group-hover:scale-105"
        >
          <FileEdit className="w-4 h-4 text-purple-600" />
          <span>Open A4 Editor</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2 Main Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Tactics List */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 flex flex-col justify-between hover:border-neutral-700 transition-all group">
          <div>
            {/* Visual Preview Box */}
            <div className="rounded-xl overflow-hidden bg-black border border-neutral-800 aspect-[16/9] relative mb-5 flex items-center justify-center group-hover:border-neutral-700 transition-colors">
              <img
                src="/src/assets/images/tds_strategy_list_cover_1791741075556.jpg"
                alt={t.cards.list.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Title & Description */}
            <h3 className="text-xl font-bold text-white mb-1.5">
              {t.cards.list.title}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-6">
              {t.cards.list.description}
            </p>
          </div>

          {/* Action Button & Link */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => onNavigate('list')}
              className="w-full py-3 px-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>{t.cards.list.button}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-center">
              <button
                onClick={() => onNavigate('list')}
                className="text-xs font-mono text-neutral-400 hover:text-white inline-flex items-center gap-1 transition-colors"
              >
                <span>{t.cards.list.link.replace('{count}', String(tacticsCount))}</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Strategy Generator */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 flex flex-col justify-between hover:border-neutral-700 transition-all group">
          <div>
            {/* Visual Preview Box */}
            <div className="rounded-xl overflow-hidden bg-black border border-neutral-800 aspect-[16/9] relative mb-5 flex items-center justify-center group-hover:border-neutral-700 transition-colors">
              <img
                src="/src/assets/images/tds_strategy_generator_cover_1791741088329.jpg"
                alt={t.cards.generator.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Title & Description */}
            <h3 className="text-xl font-bold text-white mb-1.5">
              {t.cards.generator.title}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-6">
              {t.cards.generator.description}
            </p>
          </div>

          {/* Action Button & Link */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => onNavigate('generator')}
              className="w-full py-3 px-4 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-bold text-sm hover:bg-neutral-800 hover:border-neutral-500 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>{t.cards.generator.button}</span>
              <Wand2 className="w-4 h-4" />
            </button>
            <div className="text-center">
              <button
                onClick={() => onNavigate('generator')}
                className="text-xs font-mono text-neutral-400 hover:text-white inline-flex items-center gap-1 transition-colors"
              >
                <span>{t.cards.generator.link}</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
