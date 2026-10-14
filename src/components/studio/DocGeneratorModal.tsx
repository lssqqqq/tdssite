import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { StrategyDocData } from '../../types/generator';
import {
  exportStrategyToWordDocx,
  copyFormattedGoogleDocToClipboard
} from '../../utils/googleDocExport';
import {
  Download,
  Copy,
  ExternalLink,
  Check,
  Printer,
  BookmarkPlus,
  X,
  Sparkles,
  FileCheck2,
  Info,
  AlertCircle
} from 'lucide-react';
import { Language } from '../../i18n/translations';
import { Tactic } from '../../types/tds';

interface DocGeneratorModalProps {
  data: StrategyDocData;
  isOpen: boolean;
  onClose: () => void;
  onSaveToVault?: (tactic: Tactic) => void;
  lang?: Language;
}

export const DocGeneratorModal: React.FC<DocGeneratorModalProps> = ({
  data,
  isOpen,
  onClose,
  onSaveToVault
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [savedToVault, setSavedToVault] = useState(false);
  const [activeView, setActiveView] = useState<'actions' | 'preview'>('actions');

  useEffect(() => {
    if (isOpen) {
      // Trigger festive confetti celebration on generation
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Download DOCX
  const handleDownloadDocx = async () => {
    setDownloading(true);
    try {
      await exportStrategyToWordDocx(data);
    } catch (err) {
      console.error('Docx download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  // Handle Copy Formatted HTML for Google Docs
  const handleCopyFormatted = async () => {
    const success = await copyFormattedGoogleDocToClipboard(data);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Handle Save to Site Tactics Vault
  const handleSaveTacticToVault = () => {
    if (!onSaveToVault) return;
    const newTactic: Tactic = {
      id: `gen-tactic-${Date.now()}`,
      title: data.title || 'Custom TDS Strategy',
      author: data.author || 'Ayaka',
      googleDocsUrl: 'https://docs.google.com/document/u/0/',
      tags: [
        data.gamemode,
        data.playersCount,
        data.selectedMap.name,
        'Strategy Studio'
      ],
      description: `Strategy guide for ${data.selectedMap.name} (${data.gamemode}, ${data.playersCount}). Tower placements: ${data.placedTowers.length}. Wave steps: ${data.waveSteps.length}.`,
      towers: Array.from(new Set(data.placedTowers.map(t => t.towerName))),
      createdAt: new Date().toISOString().split('T')[0]
    };
    onSaveToVault(newTactic);
    setSavedToVault(true);
    setTimeout(() => setSavedToVault(false), 4000);
  };

  // Handle Print / Save as PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-neutral-800 bg-neutral-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold">
                  Google Doc Generated
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                {data.title || 'TDS Strategy Document'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Switcher: Actions vs Live Google Doc Preview */}
        <div className="px-6 pt-3 pb-2 border-b border-neutral-800/80 bg-neutral-950 flex items-center gap-2">
          <button
            onClick={() => setActiveView('actions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeView === 'actions'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Export & Open Options
          </button>
          <button
            onClick={() => setActiveView('preview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeView === 'preview'
                ? 'bg-white text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Document Preview
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
          {activeView === 'actions' ? (
            <div className="space-y-5">
              {/* Summary Banner */}
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[11px] font-mono">
                    Strategy Summary:
                  </span>
                  <span className="text-white font-bold">
                    {data.selectedMap.name} • {data.gamemode} ({data.playersCount}) • {data.placedTowers.length} towers on canvas
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-400">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>{data.waveSteps.length} wave steps planned</span>
                </div>
              </div>

              {/* Primary Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* 1. Download .docx */}
                <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Download className="w-4 h-4 text-blue-400" />
                        <span>Download .docx</span>
                      </span>
                      <span className="text-[10px] font-mono bg-blue-950/60 border border-blue-800/60 text-blue-300 px-1.5 py-0.5 rounded">
                        Google Docs Ready
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Download file directly compatible with Google Docs and Microsoft Word.
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadDocx}
                    disabled={downloading}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>{downloading ? 'Packaging doc...' : 'Download Document (.docx)'}</span>
                  </button>
                </div>

                {/* 2. Copy Rich HTML for Google Docs */}
                <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Copy className="w-4 h-4 text-emerald-400" />
                        <span>Copy for Google Docs</span>
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 px-1.5 py-0.5 rounded">
                        Ctrl + V
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Copies formatted document with tables to clipboard. Open docs.new and paste!
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyFormatted}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
                        copied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-black hover:bg-neutral-200'
                      }`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy Google Doc'}</span>
                    </button>

                    <a
                      href="https://docs.new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      title="Open blank Google Doc"
                    >
                      <span>docs.new</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* 3. Save to Strategy Vault on Website */}
                <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <BookmarkPlus className="w-4 h-4 text-purple-400" />
                      <span>Save to Strategy List</span>
                    </span>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Saves this strategy into your website database in the "Strategy List" tab.
                    </p>
                  </div>

                  <button
                    onClick={handleSaveTacticToVault}
                    disabled={savedToVault}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
                      savedToVault
                        ? 'bg-purple-600 text-white'
                        : 'bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white'
                    }`}
                  >
                    {savedToVault ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                    <span>{savedToVault ? 'Saved to Strategy List!' : 'Add to Vault List'}</span>
                  </button>
                </div>

                {/* 4. Print / PDF Export */}
                <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Printer className="w-4 h-4 text-amber-400" />
                      <span>Print / Export PDF</span>
                    </span>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Print ready formatted document or save as high-quality PDF via browser.
                    </p>
                  </div>

                  <button
                    onClick={handlePrint}
                    className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save as PDF</span>
                  </button>
                </div>
              </div>

              {/* Instructions Callout */}
              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-start gap-2.5 text-xs text-neutral-400">
                <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-neutral-300">
                    How to open in Google Docs:
                  </span>
                  <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-neutral-400">
                    <li>
                      <b>Option 1:</b> Click <i>"Copy Google Doc"</i>, then open <i>"docs.new"</i> and press <b>Ctrl + V</b> (Paste).
                    </li>
                    <li>
                      <b>Option 2:</b> Click <i>"Download .docx"</i> and upload or drag it into Google Drive; it will open as an official Google Docs document.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          ) : (
            /* Live Google Doc Visual Preview (White A4 page formatted like Google Docs) */
            <div className="bg-white text-slate-900 rounded-2xl p-6 md:p-10 shadow-2xl border border-slate-200 font-sans max-w-2xl mx-auto space-y-6">
              <div className="text-center pb-5 border-b border-slate-200">
                <h1 className="text-2xl font-bold text-blue-700 tracking-tight mb-1">
                  {data.title || 'TDS Strategy Document'}
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  Creators: <span className="font-bold text-slate-900">{data.creators || data.author || 'Ayaka'}</span> • Map: {data.selectedMap.name} • Mode: {data.gamemode} ({data.playersCount})
                </p>
              </div>

              {/* NOTES */}
              <div className="bg-amber-50/80 border-l-4 border-amber-500 p-3.5 rounded-r text-xs">
                <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>NOTES & Rules</span>
                </h4>
                <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-[11px]">
                  {data.notesTab1 || data.generalNotes || 'No key notes provided'}
                </div>
              </div>

              {/* Tab 2 Tactical Notes (if present) */}
              {data.notesTab2 && (
                <div className="bg-sky-50 border-l-4 border-sky-500 p-3 rounded-r text-xs">
                  <h5 className="font-bold text-sky-900 mb-0.5">Tactical Notes:</h5>
                  <p className="text-slate-700 text-[11px]">{data.notesTab2}</p>
                </div>
              )}

              {/* Hero Grid Table */}
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-blue-900 border-b pb-1 mb-2">
                  Hero Grid (Deck Towers - {(data.heroTowers || []).length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(data.heroTowers && data.heroTowers.length > 0
                    ? data.heroTowers
                    : data.playerDecks.flatMap(d => d.towers)
                  ).map(t => (
                    <div key={t.id} className="border border-slate-200 rounded-lg p-2 bg-slate-50 flex items-center gap-2 text-xs">
                      <div className="w-8 h-8 rounded bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                        <img src={t.image} alt={t.name} className="max-w-full max-h-full w-auto h-auto object-contain" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold block truncate text-slate-800 text-[11px]">{t.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">${t.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Placed Towers on Canvas */}
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-blue-900 border-b pb-1 mb-2">
                  Map Placement ({data.placedTowers.length} towers)
                </h3>
                {data.placedTowers.length > 0 ? (
                  <div className="border border-slate-200 rounded overflow-hidden">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead className="bg-slate-800 text-white">
                        <tr>
                          <th className="p-1.5 pl-2">#</th>
                          <th className="p-1.5">Tower</th>
                          <th className="p-1.5">Player</th>
                          <th className="p-1.5">Level</th>
                          <th className="p-1.5">Target</th>
                          <th className="p-1.5">Coordinates</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {data.placedTowers.map((t, i) => (
                          <tr key={t.id} className="hover:bg-slate-50">
                            <td className="p-1.5 pl-2 font-mono">{i + 1}</td>
                            <td className="p-1.5 font-bold">{t.towerName}</td>
                            <td className="p-1.5">{t.player}</td>
                            <td className="p-1.5">Lv.{t.level}</td>
                            <td className="p-1.5">{t.target}</td>
                            <td className="p-1.5 font-mono">{Math.round(t.x)}% / {Math.round(t.y)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-[11px]">No towers placed on canvas yet.</p>
                )}
              </div>

              {/* Free document space content */}
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-blue-900 border-b pb-1 mb-2">
                  Document Guide Content
                </h3>
                <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {data.freeDocContent || 'No guide content provided.'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/60 flex items-center justify-between">
          <div className="text-[11px] text-neutral-400 font-mono">
            TDS Strategy Studio • Google Docs Generator
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
