import React, { useRef } from 'react';
import { Editor } from '@tiptap/react';
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Table as TableIcon,
  PlusSquare,
  Trash2,
  Image as ImageIcon,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  Download,
  Upload,
  FileText,
  FileCheck2,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { DocumentMetadata, PageTheme } from '../../types/editor';
import { translations, Language } from '../../i18n/translations';

interface TdsEditorToolbarProps {
  editor: Editor | null;
  metadata: DocumentMetadata;
  onChangeMetadata: (updated: Partial<DocumentMetadata>) => void;
  isSaving: boolean;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onExportDocx: () => void;
  onResetDoc: () => void;
  lang: Language;
}

export const TdsEditorToolbar: React.FC<TdsEditorToolbarProps> = ({
  editor,
  metadata,
  onChangeMetadata,
  isSaving,
  onExportJson,
  onImportJson,
  onExportDocx,
  onResetDoc,
  lang
}) => {
  const t = translations[lang].editor;
  const imageInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const src = ev.target?.result as string;
      if (src) {
        editor.chain().focus().setImage({ src }).run();
      }
    };
    reader.readAsDataURL(file);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleJsonFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
    }
    if (jsonInputRef.current) jsonInputRef.current.value = '';
  };

  const setZoom = (nextZoom: number) => {
    const clamped = Math.min(1.5, Math.max(0.6, nextZoom));
    onChangeMetadata({ zoom: Number(clamped.toFixed(2)) });
  };

  const isTableActive = editor.can().deleteTable();

  return (
    <div className="sticky top-20 z-40 bg-neutral-950/95 backdrop-blur-md border border-neutral-800 rounded-2xl p-3 shadow-2xl space-y-3">
      {/* Top Row: Title, Save Status, Theme, Zoom, Exports */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-neutral-800/80">
        {/* Document Title Input */}
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="w-8 h-8 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={metadata.title}
            onChange={e => onChangeMetadata({ title: e.target.value })}
            placeholder={t.docTitlePlaceholder}
            className="w-full bg-transparent font-bold text-sm md:text-base text-white focus:outline-none focus:ring-1 focus:ring-purple-500 rounded px-2 py-1 border border-transparent hover:border-neutral-800 transition-colors"
          />
        </div>

        {/* Right Actions: Auto-save status, Zoom, Theme, JSON & DOCX */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Auto-save Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                isSaving ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
              }`}
            />
            <span className={isSaving ? 'text-amber-400' : 'text-neutral-300'}>
              {isSaving ? t.saving : t.saved}
            </span>
          </div>

          {/* Theme Switcher: Dark Page vs Light Page */}
          <button
            type="button"
            onClick={() =>
              onChangeMetadata({ theme: metadata.theme === 'dark' ? 'light' : 'dark' })
            }
            className={`px-2.5 py-1 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition-all ${
              metadata.theme === 'dark'
                ? 'bg-neutral-900 text-purple-300 border-purple-900/60 hover:border-purple-700'
                : 'bg-neutral-100 text-neutral-900 border-neutral-300 hover:bg-white font-bold'
            }`}
            title={metadata.theme === 'dark' ? t.themeDark : t.themeLight}
          >
            {metadata.theme === 'dark' ? (
              <Moon className="w-3.5 h-3.5 text-purple-400" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span className="hidden md:inline">
              {metadata.theme === 'dark' ? t.themeDark : t.themeLight}
            </span>
          </button>

          {/* Zoom Controls (A4 scale) */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl px-1.5 py-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setZoom(metadata.zoom - 0.15)}
              className="p-1 text-neutral-400 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[11px] text-neutral-300 select-none min-w-[42px] text-center">
              {Math.round(metadata.zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom(metadata.zoom + 0.15)}
              className="p-1 text-neutral-400 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Export / Import JSON */}
          <button
            type="button"
            onClick={onExportJson}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-mono flex items-center gap-1 transition-colors"
            title={t.exportJson}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">JSON</span>
          </button>

          <button
            type="button"
            onClick={() => jsonInputRef.current?.click()}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-mono flex items-center gap-1 transition-colors"
            title={t.importJson}
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t.importJson}</span>
          </button>
          <input
            ref={jsonInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleJsonFileChange}
          />

          {/* Export DOCX (Google Docs compatible) */}
          <button
            type="button"
            onClick={onExportDocx}
            className="px-3 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-950 transition-all border border-purple-400/30"
            title={t.exportDocx}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>DOCX</span>
          </button>

          {/* Reset Template */}
          <button
            type="button"
            onClick={onResetDoc}
            className="p-1.5 rounded-xl bg-neutral-900 hover:bg-red-950/60 text-neutral-400 hover:text-red-400 border border-neutral-800 transition-colors"
            title={t.resetDoc}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Formatting & Controls Row */}
      <div className="flex flex-wrap items-center gap-1.5 text-neutral-300">
        {/* Undo / Redo */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded-lg hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title={t.undo}
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded-lg hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title={t.redo}
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-[1px] h-5 bg-neutral-800 mx-0.5 hidden sm:block" />

        {/* Headings: H1 (Emerald Green Accent), H2 (Violet Accent), H3 */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
              editor.isActive('heading', { level: 1 })
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                : 'hover:bg-neutral-800 text-emerald-400/80 hover:text-emerald-400'
            }`}
            title={t.h1}
          >
            <Heading1 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">H1</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-purple-950 text-purple-400 border border-purple-500/50'
                : 'hover:bg-neutral-800 text-purple-400/80 hover:text-purple-400'
            }`}
            title={t.h2}
          >
            <Heading2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">H2</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-neutral-800 text-white border border-neutral-600'
                : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title={t.h3}
          >
            <Heading3 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">H3</span>
          </button>
        </div>

        <div className="w-[1px] h-5 bg-neutral-800 mx-0.5 hidden sm:block" />

        {/* Text Styles: Bold, Italic, Strike, Code */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('bold')
                ? 'bg-purple-600 text-white shadow-sm'
                : 'hover:bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
            title={t.bold}
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('italic')
                ? 'bg-purple-600 text-white shadow-sm'
                : 'hover:bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
            title={t.italic}
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('strike')
                ? 'bg-purple-600 text-white shadow-sm'
                : 'hover:bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
            title={t.strike}
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('code')
                ? 'bg-purple-600 text-white shadow-sm'
                : 'hover:bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
            title={t.code}
          >
            <Code className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('bulletList')
                ? 'bg-purple-600 text-white shadow-sm'
                : 'hover:bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
            title={t.bulletList}
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('orderedList')
                ? 'bg-purple-600 text-white shadow-sm'
                : 'hover:bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
            title={t.orderedList}
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive('blockquote')
                ? 'bg-purple-600 text-white shadow-sm'
                : 'hover:bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
            title={t.blockquote}
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            title={t.divider}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-[1px] h-5 bg-neutral-800 mx-0.5 hidden sm:block" />

        {/* Table Operations */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5">
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
            className="px-2 py-1 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
            title={t.table}
          >
            <TableIcon className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">{t.table}</span>
          </button>

          {isTableActive && (
            <>
              <button
                type="button"
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-emerald-400 transition-colors"
                title={t.addRowBelow}
              >
                <PlusSquare className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteRow().run()}
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-red-400 transition-colors"
                title={t.deleteRow}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="px-1.5 py-0.5 text-[10px] font-mono text-red-400 hover:text-white hover:bg-red-950 rounded transition-colors"
                title={t.deleteTable}
              >
                DEL
              </button>
            </>
          )}
        </div>

        {/* Insert Image */}
        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5">
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="px-2 py-1 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
            title={t.insertImage}
          >
            <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">{t.insertImage}</span>
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageFileChange}
          />
        </div>
      </div>
    </div>
  );
};
