import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CustomDocTemplate } from '../../types/customDoc';
import { downloadCustomDocx, copyCustomDocHtmlToClipboard } from '../../utils/customDocExport';
import {
  Download,
  Copy,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { translations, Language } from '../../i18n/translations';
import { Tactic } from '../../types/tds';

interface CustomDocGeneratorModalProps {
  doc: CustomDocTemplate;
  isOpen: boolean;
  onClose: () => void;
  onSaveToVault?: (tactic: Tactic) => void;
  lang: Language;
}

export const CustomDocGeneratorModal: React.FC<CustomDocGeneratorModalProps> = ({
  doc,
  isOpen,
  onClose,
  lang
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const t = translations[lang].studio;

  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadCustomDocx(doc);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = async () => {
    const ok = await copyCustomDocHtmlToClipboard(doc);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-700 rounded-3xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-neutral-800 bg-neutral-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block">
                {t.modalBadge}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                {t.modalTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t.modalDescription.replace('{count}', String(doc.tab2.players.length))}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* 1. Download .docx */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="p-5 rounded-2xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-850 hover:border-white transition-all text-left flex flex-col justify-between space-y-2 group shadow"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-white" />
                  <span>{t.downloadDocxTitle}</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-300 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                  Google Drive
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {t.downloadDocxSub}
              </p>
            </button>

            {/* 2. Copy formatted HTML */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-5 rounded-2xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-850 hover:border-white transition-all text-left flex flex-col justify-between space-y-2 group shadow"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                  <span>{copied ? t.copiedDocHtmlTitle : t.copyDocHtmlTitle}</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-300 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                  Ctrl + V
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {t.copyDocHtmlSub}
              </p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors shadow"
          >
            {t.closeModalBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
