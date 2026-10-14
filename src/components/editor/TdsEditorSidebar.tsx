import React from 'react';
import { Editor } from '@tiptap/react';
import {
  FileText,
  Shield,
  Target,
  User,
  Users,
  ListOrdered,
  MapPin,
  Sparkles,
  Plus,
  Layers,
  Zap,
  Map as MapIcon
} from 'lucide-react';
import { QUICK_INSERT_BLOCKS } from '../../data/editorTemplates';
import { translations, Language } from '../../i18n/translations';
import { TOWER_PHOTOS, MAP_PHOTOS, getAssetDisplayName } from '../../data/tdsPhotoAssets';

interface TdsEditorSidebarProps {
  editor: Editor | null;
  lang: Language;
}

export const TdsEditorSidebar: React.FC<TdsEditorSidebarProps> = ({ editor, lang }) => {
  const t = translations[lang].editor;

  if (!editor) return null;

  const handleInsertHtml = (html: string) => {
    editor.chain().focus().insertContent(html).run();
  };

  const handleInsertTowerTag = (towerName: string) => {
    editor
      .chain()
      .focus()
      .insertContent(` <code>${towerName}</code> `)
      .run();
  };

  const handleInsertMapBadge = (mapName: string) => {
    editor
      .chain()
      .focus()
      .insertContent(` <strong>[Map: ${mapName}]</strong> `)
      .run();
  };

  const getBlockIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'FileText':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'Shield':
        return <Shield className="w-4 h-4 text-amber-400" />;
      case 'Target':
        return <Target className="w-4 h-4 text-blue-400" />;
      case 'User':
        return <User className="w-4 h-4 text-cyan-400" />;
      case 'Users':
        return <Users className="w-4 h-4 text-indigo-400" />;
      case 'ListOrdered':
        return <ListOrdered className="w-4 h-4 text-emerald-400" />;
      case 'MapPin':
        return <MapPin className="w-4 h-4 text-rose-400" />;
      default:
        return <Layers className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-neutral-950 border border-neutral-800 rounded-3xl flex flex-col max-h-[calc(100vh-6rem)] shadow-2xl overflow-hidden sticky top-20">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 bg-neutral-900/60">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            {t.elementsSidebar}
          </h3>
        </div>
        <p className="text-[11px] text-neutral-400 leading-snug">
          {t.sidebarDesc}
        </p>
      </div>

      {/* Content Scrollable List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin">
        {/* 1. Quick Structural Blocks */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 px-1 font-bold">
            Document Structure Blocks
          </span>

          <div className="grid grid-cols-1 gap-2">
            {QUICK_INSERT_BLOCKS.map(block => (
              <button
                key={block.id}
                type="button"
                onClick={() => handleInsertHtml(block.html)}
                className="group p-3 rounded-2xl border border-neutral-800/90 bg-neutral-900/50 hover:bg-neutral-900 hover:border-purple-500/50 transition-all text-left flex items-start gap-3 shadow-sm hover:shadow-md"
              >
                <div className="w-8 h-8 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0 group-hover:border-purple-500/60 transition-colors">
                  {getBlockIcon(block.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                      {t.blocks[block.id as keyof typeof t.blocks] || block.title}
                    </span>
                    <Plus className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                    {t.blocks[`${block.id}Desc` as keyof typeof t.blocks] || block.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Quick TDS Tower Stamps (English names) */}
        <div className="space-y-2 pt-2 border-t border-neutral-900">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Quick Towers</span>
            </span>
            <span className="text-[10px] font-mono text-neutral-600">click to add</span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-neutral-950/80 rounded-xl border border-neutral-900">
            {TOWER_PHOTOS.slice(0, 14).map(tw => (
              <button
                key={tw.id}
                type="button"
                onClick={() => handleInsertTowerTag(tw.name)}
                className="px-2 py-1 rounded-lg text-[10px] font-mono font-semibold bg-neutral-900 hover:bg-purple-950 text-neutral-300 hover:text-purple-300 border border-neutral-800 hover:border-purple-700 transition-colors"
                title={`Insert ${tw.name}`}
              >
                + {tw.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Quick TDS Map Stamps */}
        <div className="space-y-2 pt-2 border-t border-neutral-900">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold flex items-center gap-1">
              <MapIcon className="w-3 h-3 text-emerald-400" />
              <span>Quick Maps</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-950/80 rounded-xl border border-neutral-900">
            {MAP_PHOTOS.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleInsertMapBadge(getAssetDisplayName(m))}
                className="px-2 py-1 rounded-lg text-[10px] font-mono font-semibold bg-neutral-900 hover:bg-emerald-950 text-neutral-300 hover:text-emerald-300 border border-neutral-800 hover:border-emerald-700 transition-colors"
                title={`Insert [Map: ${getAssetDisplayName(m)}]`}
              >
                + {getAssetDisplayName(m)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
