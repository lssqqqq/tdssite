import React, { useState, useRef } from 'react';
import {
  FileText,
  Maximize2,
  Sliders,
  Sun,
  Moon,
  Palette,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileDown,
  Copy,
  Grid,
  Layers,
  ChevronDown,
  Check,
  Sparkles,
  Download,
  Upload,
  Plus
} from 'lucide-react';
import { CanvasSettings, PageFormat, PageOrientation, PageMargin, PageTheme, PageLayoutMode } from '../../types/customDoc';
import { translations, Language } from '../../i18n/translations';

interface CanvasControlsBarProps {
  settings: CanvasSettings;
  onChangeSettings: (updated: Partial<CanvasSettings>) => void;
  onExportDocx: () => void;
  onCopyHtml: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onAddCustomPage?: () => void;
  onFitWidth?: () => void;
  lang: Language;
}

export const CanvasControlsBar: React.FC<CanvasControlsBarProps> = ({
  settings,
  onChangeSettings,
  onExportDocx,
  onCopyHtml,
  onExportJson,
  onImportJson,
  onAddCustomPage,
  onFitWidth,
  lang
}) => {
  const t = translations[lang].canvas;
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  // Dropdown menus states
  const [openFormatMenu, setOpenFormatMenu] = useState(false);
  const [openMarginMenu, setOpenMarginMenu] = useState(false);
  const [openThemeMenu, setOpenThemeMenu] = useState(false);
  const [openExportMenu, setOpenExportMenu] = useState(false);

  // Formats list
  const formatOptions: { id: PageFormat; label: string; desc: string }[] = [
    { id: 'a4', label: t.formatA4, desc: '210 × 297 mm' },
    { id: 'letter', label: t.formatLetter, desc: '8.5 × 11 in' },
    { id: 'a3', label: t.formatA3, desc: '297 × 420 mm' },
    { id: 'widescreen', label: t.formatWidescreen, desc: '16:9 Presentation' },
    { id: 'fluid', label: t.formatFluid, desc: 'Responsive Canvas' },
    { id: 'custom', label: t.formatCustom, desc: 'Custom mm / px' }
  ];

  // Margins list
  const marginOptions: { id: PageMargin; label: string }[] = [
    { id: 'normal', label: t.marginNormal },
    { id: 'narrow', label: t.marginNarrow },
    { id: 'moderate', label: t.marginModerate },
    { id: 'wide', label: t.marginWide },
    { id: 'none', label: t.marginNone }
  ];

  // Themes list
  const themeOptions: { id: PageTheme; label: string; color: string; border: string }[] = [
    { id: 'black', label: t.themeBlack, color: '#000000', border: '#262626' },
    { id: 'dark', label: t.themeDark, color: '#0f0f11', border: '#27272a' },
    { id: 'midnight', label: t.themeMidnight, color: '#0d0714', border: '#581c87' },
    { id: 'white', label: t.themeWhite, color: '#ffffff', border: '#d4d4d8' },
    { id: 'paper', label: t.themePaper, color: '#f8fafc', border: '#cbd5e1' },
    { id: 'custom', label: t.themeCustom, color: settings.customBgColor || '#1a102f', border: '#a855f7' }
  ];

  // Zoom helpers
  const handleZoomChange = (delta: number) => {
    const next = Math.min(2.0, Math.max(0.4, Number((settings.zoom + delta).toFixed(2))));
    onChangeSettings({ zoom: next });
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
    }
    if (jsonInputRef.current) jsonInputRef.current.value = '';
  };

  return (
    <div className="w-full bg-neutral-950/95 backdrop-blur-md border border-neutral-800 rounded-3xl p-3 shadow-2xl space-y-3 relative z-30 select-none">
      {/* Top Toolbar Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left cluster: Format, Orientation, Margins, Theme */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* 1. Format Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setOpenFormatMenu(!openFormatMenu);
                setOpenMarginMenu(false);
                setOpenThemeMenu(false);
                setOpenExportMenu(false);
              }}
              className="py-1.5 px-3 rounded-2xl bg-neutral-900 hover:bg-neutral-850 text-white border border-neutral-800 hover:border-neutral-700 text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
              title={t.format}
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span className="uppercase tracking-wider text-[11px]">
                {settings.format === 'a4'
                  ? 'A4'
                  : settings.format === 'letter'
                  ? 'Letter'
                  : settings.format === 'a3'
                  ? 'A3'
                  : settings.format === 'widescreen'
                  ? '16:9'
                  : settings.format === 'fluid'
                  ? 'Studio'
                  : 'Custom'}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {openFormatMenu && (
              <div className="absolute left-0 mt-2 w-56 bg-neutral-900 border border-neutral-750 rounded-2xl shadow-2xl p-1.5 z-50 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-800 mb-1">
                  {t.format}
                </div>
                {formatOptions.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onChangeSettings({ format: opt.id });
                      setOpenFormatMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between transition-colors ${
                      settings.format === opt.id
                        ? 'bg-purple-600 text-white font-bold'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="text-[10px] opacity-75 font-mono">{opt.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Orientation Toggle (Portrait vs Landscape) */}
          <div className="flex items-center bg-neutral-900 p-0.5 rounded-2xl border border-neutral-800 text-xs">
            <button
              type="button"
              onClick={() => onChangeSettings({ orientation: 'portrait' })}
              className={`py-1 px-2.5 rounded-xl transition-all flex items-center gap-1 text-[11px] font-medium ${
                settings.orientation === 'portrait'
                  ? 'bg-purple-600 text-white font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title={t.portrait}
            >
              <span className="w-2.5 h-3.5 border border-current rounded-xs shrink-0" />
              <span className="hidden sm:inline">{t.portrait}</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeSettings({ orientation: 'landscape' })}
              className={`py-1 px-2.5 rounded-xl transition-all flex items-center gap-1 text-[11px] font-medium ${
                settings.orientation === 'landscape'
                  ? 'bg-purple-600 text-white font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title={t.landscape}
            >
              <span className="w-3.5 h-2.5 border border-current rounded-xs shrink-0" />
              <span className="hidden sm:inline">{t.landscape}</span>
            </button>
          </div>

          {/* 3. Margins Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setOpenMarginMenu(!openMarginMenu);
                setOpenFormatMenu(false);
                setOpenThemeMenu(false);
                setOpenExportMenu(false);
              }}
              className="py-1.5 px-3 rounded-2xl bg-neutral-900 hover:bg-neutral-850 text-white border border-neutral-800 hover:border-neutral-700 text-xs font-medium transition-all flex items-center gap-1.5"
              title={t.margins}
            >
              <Sliders className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-[11px] hidden md:inline">{t.margins}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {openMarginMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-neutral-900 border border-neutral-750 rounded-2xl shadow-2xl p-1.5 z-50 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-800 mb-1">
                  {t.margins}
                </div>
                {marginOptions.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onChangeSettings({ margins: opt.id });
                      setOpenMarginMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between transition-colors ${
                      settings.margins === opt.id
                        ? 'bg-purple-600 text-white font-bold'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {settings.margins === opt.id && <Check className="w-3 h-3 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Sheet Color / Theme Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setOpenThemeMenu(!openThemeMenu);
                setOpenFormatMenu(false);
                setOpenMarginMenu(false);
                setOpenExportMenu(false);
              }}
              className="py-1.5 px-3 rounded-2xl bg-neutral-900 hover:bg-neutral-850 text-white border border-neutral-800 hover:border-neutral-700 text-xs font-medium transition-all flex items-center gap-2"
              title={t.theme}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-neutral-600 shrink-0"
                style={{
                  backgroundColor:
                    settings.theme === 'black'
                      ? '#000000'
                      : settings.theme === 'dark'
                      ? '#0f0f11'
                      : settings.theme === 'midnight'
                      ? '#0d0714'
                      : settings.theme === 'white'
                      ? '#ffffff'
                      : settings.theme === 'paper'
                      ? '#f8fafc'
                      : settings.customBgColor || '#120924'
                }}
              />
              <span className="text-[11px] hidden lg:inline">
                {themeOptions.find(o => o.id === settings.theme)?.label || t.theme}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {openThemeMenu && (
              <div className="absolute left-0 mt-2 w-52 bg-neutral-900 border border-neutral-750 rounded-2xl shadow-2xl p-1.5 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-800 mb-1">
                  {t.theme}
                </div>
                {themeOptions.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      if (opt.id === 'custom') {
                        colorPickerRef.current?.click();
                      } else {
                        onChangeSettings({ theme: opt.id });
                      }
                      setOpenThemeMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                      settings.theme === opt.id
                        ? 'bg-neutral-800 text-white font-bold border border-purple-500/50'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border shrink-0"
                      style={{ backgroundColor: opt.color, borderColor: opt.border }}
                    />
                    <span className="flex-1">{opt.label}</span>
                    {settings.theme === opt.id && <Check className="w-3 h-3 text-purple-400" />}
                  </button>
                ))}
              </div>
            )}

            {/* Hidden native color picker for custom color */}
            <input
              ref={colorPickerRef}
              type="color"
              value={settings.customBgColor || '#0f0f11'}
              onChange={e => {
                onChangeSettings({ theme: 'custom', customBgColor: e.target.value });
              }}
              className="sr-only"
            />
          </div>
        </div>

        {/* Center cluster: Display Mode (All Pages A4 flow vs Page 1 vs Page 2 vs Continuous) */}
        <div className="flex items-center bg-neutral-900 p-1 rounded-2xl border border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => onChangeSettings({ layoutMode: 'multi-page' })}
            className={`py-1 px-3 rounded-xl transition-all flex items-center gap-1.5 text-[11px] font-bold ${
              settings.layoutMode === 'multi-page'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Display all pages stacked with realistic A4 page breaks"
          >
            <Layers className="w-3 h-3" />
            <span>{t.allPages}</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeSettings({ layoutMode: 'tab1' })}
            className={`py-1 px-2.5 rounded-xl transition-all text-[11px] font-medium ${
              settings.layoutMode === 'tab1'
                ? 'bg-neutral-800 text-white font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.page1}
          </button>

          <button
            type="button"
            onClick={() => onChangeSettings({ layoutMode: 'tab2' })}
            className={`py-1 px-2.5 rounded-xl transition-all text-[11px] font-medium ${
              settings.layoutMode === 'tab2'
                ? 'bg-neutral-800 text-white font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.page2}
          </button>

          <button
            type="button"
            onClick={() => onChangeSettings({ layoutMode: 'continuous' })}
            className={`py-1 px-2.5 rounded-xl transition-all text-[11px] font-medium ${
              settings.layoutMode === 'continuous'
                ? 'bg-neutral-800 text-white font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {t.continuous}
          </button>
        </div>

        {/* Right cluster: Zoom, Guides, Exports */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Zoom Controls */}
          <div className="flex items-center bg-neutral-900 p-0.5 rounded-2xl border border-neutral-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => handleZoomChange(-0.1)}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title={t.zoomOut}
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onChangeSettings({ zoom: 1 })}
              className="text-[11px] text-neutral-200 font-bold px-2 hover:text-purple-400 transition-colors"
              title={t.resetZoom}
            >
              {Math.round(settings.zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={() => handleZoomChange(0.1)}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title={t.zoomIn}
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            {onFitWidth && (
              <button
                type="button"
                onClick={onFitWidth}
                className="py-1 px-1.5 rounded-xl text-[10px] text-neutral-400 hover:text-white hover:bg-neutral-800 font-mono transition-colors"
                title={t.fitWidth}
              >
                Fit
              </button>
            )}
          </div>

          {/* Grid Toggle */}
          <button
            type="button"
            onClick={() => onChangeSettings({ showGrid: !settings.showGrid })}
            className={`p-2 rounded-2xl border transition-all text-xs ${
              settings.showGrid
                ? 'bg-purple-950/80 text-purple-300 border-purple-700 shadow-sm'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
            title={t.showGrid}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Export Dropdown (DOCX, HTML, JSON) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setOpenExportMenu(!openExportMenu);
                setOpenFormatMenu(false);
                setOpenMarginMenu(false);
                setOpenThemeMenu(false);
              }}
              className="py-1.5 px-3 rounded-2xl bg-white hover:bg-neutral-200 text-black font-black text-xs transition-all flex items-center gap-1.5 shadow-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 text-neutral-700" />
            </button>

            {openExportMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-neutral-900 border border-neutral-750 rounded-2xl shadow-2xl p-1.5 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    onExportDocx();
                    setOpenExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-neutral-800 flex items-center gap-2.5 transition-colors"
                >
                  <FileDown className="w-4 h-4 text-purple-400" />
                  <span>{t.exportDocx}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onCopyHtml();
                    setOpenExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-neutral-800 flex items-center gap-2.5 transition-colors"
                >
                  <Copy className="w-4 h-4 text-emerald-400" />
                  <span>{t.copyHtml}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onExportJson();
                    setOpenExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-neutral-800 flex items-center gap-2.5 transition-colors"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>{t.exportJson}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    jsonInputRef.current?.click();
                    setOpenExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-neutral-800 flex items-center gap-2.5 transition-colors border-t border-neutral-800 mt-1 pt-1.5"
                >
                  <Upload className="w-4 h-4 text-sky-400" />
                  <span>{t.importJson}</span>
                </button>

                {onAddCustomPage && (
                  <button
                    type="button"
                    onClick={() => {
                      onAddCustomPage();
                      setOpenExportMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-neutral-800 flex items-center gap-2.5 transition-colors border-t border-neutral-800 mt-1 pt-1.5"
                  >
                    <Plus className="w-4 h-4 text-purple-400" />
                    <span>{t.addCustomPage}</span>
                  </button>
                )}
              </div>
            )}

            {/* Hidden JSON File Input */}
            <input
              ref={jsonInputRef}
              type="file"
              accept=".json"
              onChange={handleJsonUpload}
              className="sr-only"
            />
          </div>
        </div>
      </div>

      {/* Custom Dimension Inputs if format === 'custom' */}
      {settings.format === 'custom' && (
        <div className="flex items-center gap-3 pt-2 border-t border-neutral-850 text-xs font-mono">
          <span className="text-neutral-400">{t.formatCustom}:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">{t.widthMm}:</span>
            <input
              type="number"
              value={settings.customWidthMm || 210}
              onChange={e => onChangeSettings({ customWidthMm: Number(e.target.value) || 210 })}
              className="w-20 bg-neutral-900 border border-neutral-750 rounded-lg px-2 py-1 text-white text-xs font-bold focus:outline-none focus:border-purple-500"
              min="100"
              max="1000"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">{t.heightMm}:</span>
            <input
              type="number"
              value={settings.customHeightMm || 297}
              onChange={e => onChangeSettings({ customHeightMm: Number(e.target.value) || 297 })}
              className="w-20 bg-neutral-900 border border-neutral-750 rounded-lg px-2 py-1 text-white text-xs font-bold focus:outline-none focus:border-purple-500"
              min="100"
              max="2000"
            />
          </div>
        </div>
      )}
    </div>
  );
};
