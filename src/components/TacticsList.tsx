import React, { useState, useMemo } from 'react';
import {
  Search,
  ExternalLink,
  FileText,
  User,
  Copy,
  Check,
  Plus,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { Tactic, OFFICIAL_TAGS, TAG_ICONS } from '../types/tds';
import { translations, Language } from '../i18n/translations';
import { TdsGemIcon } from './TdsGemIcon';

const renderTagIcon = (tag: string) => {
  if (tag === 'Gem Farm' || tag === 'Hardcore') {
    return <TdsGemIcon className="w-3.5 h-3.5 shrink-0" />;
  }
  const icon = TAG_ICONS[tag];
  return icon ? <span className="shrink-0">{icon}</span> : null;
};

interface TacticsListProps {
  tactics: Tactic[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddTactic: (tactic: Tactic) => void;
  onUpdateTactic: (tactic: Tactic) => void;
  onDeleteTactic: (id: string) => void;
  selectedTag?: string | null;
  onSelectTag?: (tag: string | null) => void;
  lang: Language;
}

export const TacticsList: React.FC<TacticsListProps> = ({
  tactics,
  searchQuery,
  onSearchChange,
  onAddTactic,
  onUpdateTactic,
  onDeleteTactic,
  selectedTag: propSelectedTag,
  onSelectTag: propOnSelectTag,
  lang
}) => {
  const t = translations[lang].tacticsList;
  const tm = translations[lang].modal;

  const [internalTag, setInternalTag] = useState<string | null>(null);
  const selectedTag = propSelectedTag !== undefined ? propSelectedTag : internalTag;
  const setSelectedTag = (tag: string | null) => {
    if (propOnSelectTag) {
      propOnSelectTag(tag);
    } else {
      setInternalTag(tag);
    }
  };
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Editing author / tactic state
  const [editingTactic, setEditingTactic] = useState<Tactic | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Tactic Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState(t.author);
  const [newDocsUrl, setNewDocsUrl] = useState('');
  const [newTags, setNewTags] = useState<string[]>(['Fallen', 'Solo']);
  const [newDesc, setNewDesc] = useState('');

  // Filter tactics by search and tag
  const filteredTactics = useMemo(() => {
    return tactics.filter(tactic => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tactic.title.toLowerCase().includes(q) ||
        tactic.author.toLowerCase().includes(q) ||
        tactic.tags.some(t => t.toLowerCase().includes(q)) ||
        (tactic.description && tactic.description.toLowerCase().includes(q));

      const matchesTag = !selectedTag || tactic.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [tactics, searchQuery, selectedTag]);

  const handleCopyLink = (e: React.MouseEvent, tactic: Tactic) => {
    e.stopPropagation();
    navigator.clipboard.writeText(tactic.googleDocsUrl);
    setCopiedId(tactic.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateTactic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDocsUrl.trim()) return;

    let docUrl = newDocsUrl.trim();
    if (!docUrl.startsWith('http://') && !docUrl.startsWith('https://')) {
      docUrl = `https://${docUrl}`;
    }

    const created: Tactic = {
      id: `tactic-${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim() || t.author,
      googleDocsUrl: docUrl,
      tags: newTags.length > 0 ? newTags : ['Solo'],
      description: newDesc.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddTactic(created);
    setIsAddOpen(false);
    setNewTitle('');
    setNewAuthor(t.author);
    setNewDocsUrl('');
    setNewTags(['Fallen', 'Solo']);
    setNewDesc('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTactic) return;
    onUpdateTactic(editingTactic);
    setEditingTactic(null);
  };

  const toggleTagInNewForm = (tag: string) => {
    if (newTags.includes(tag)) {
      setNewTags(newTags.filter(t => t !== tag));
    } else {
      setNewTags([...newTags, tag]);
    }
  };

  const toggleTagInEditForm = (tag: string) => {
    if (!editingTactic) return;
    const currentTags = editingTactic.tags;
    const updated = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    setEditingTactic({ ...editingTactic, tags: updated });
  };

  return (
    <div className="space-y-6">
      {/* Tags Filter Bar */}
      <div className="border border-neutral-800 bg-neutral-950 p-4 md:p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-900">
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            {t.filterByTags}
          </div>
          <div className="flex items-center gap-3">
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-xs font-mono text-neutral-400 hover:text-white underline transition-colors"
              >
                {t.resetTag} ({selectedTag})
              </button>
            )}
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-3 py-1 text-xs font-mono bg-white text-black hover:bg-neutral-200 font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addTactic}</span>
            </button>
          </div>
        </div>

        {/* All requested tags */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors ${
              selectedTag === null
                ? 'bg-white text-black border-white font-bold'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white'
            }`}
          >
            {t.all}
          </button>
          {OFFICIAL_TAGS.map(tag => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-black border-white font-bold'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white'
                }`}
              >
                {renderTagIcon(tag)}
                <span>{tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Current Filter Info */}
      <div className="flex items-center justify-between text-xs font-mono text-neutral-500 px-1">
        <div>
          <span>{t.foundCount} <strong className="text-white">{filteredTactics.length}</strong></span>
          {selectedTag && <span className="ml-2">· {selectedTag}</span>}
          {searchQuery && <span className="ml-2">· "{searchQuery}"</span>}
        </div>
        <div>
          <span>{t.totalCount} {tactics.length}</span>
        </div>
      </div>

      {/* Empty State */}
      {filteredTactics.length === 0 && (
        <div className="border border-neutral-800 bg-neutral-950 p-12 text-center rounded-2xl">
          <p className="text-sm font-mono text-neutral-400 mb-4">
            {t.emptyTitle}
          </p>
          <div className="flex justify-center gap-3">
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="px-3 py-1.5 text-xs font-mono rounded-lg border border-neutral-700 text-white hover:border-white transition-colors"
              >
                {t.clearTagFilter}
              </button>
            )}
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="px-3 py-1.5 text-xs font-mono rounded-lg border border-neutral-700 text-white hover:border-white transition-colors"
              >
                {t.clearSearch}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tactics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTactics.map(tactic => (
          <div
            key={tactic.id}
            className="border border-neutral-800 bg-neutral-950 hover:border-neutral-600 rounded-2xl p-5 flex flex-col justify-between transition-colors"
          >
            <div>
              {/* Title & Quick actions */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                  {tactic.title}
                </h3>
                <div className="flex items-center gap-1.5 shrink-0 text-neutral-500">
                  <button
                    onClick={() => setEditingTactic(tactic)}
                    title={tm.editTitle}
                    className="p-1 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete strategy "${tactic.title}"?`)) {
                        onDeleteTactic(tactic.id);
                      }
                    }}
                    title="Delete"
                    className="p-1 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tactic.tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className="px-2 py-0.5 text-[11px] font-mono rounded border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors flex items-center gap-1"
                  >
                    {renderTagIcon(tag)}
                    <span>{tag}</span>
                  </button>
                ))}
              </div>

              {/* Description */}
              {tactic.description && (
                <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
                  {tactic.description}
                </p>
              )}

              {/* Google Docs Document Row */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 mb-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-white shrink-0" />
                    <span className="text-xs font-mono text-neutral-200 truncate">
                      {tactic.googleDocsUrl}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleCopyLink(e, tactic)}
                      title={t.copyDocLink}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 transition-colors"
                    >
                      {copiedId === tactic.id ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={tactic.googleDocsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-xs font-mono bg-white text-black hover:bg-neutral-200 font-semibold rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <span>{t.openDoc}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Underneath: Author */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-900 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-neutral-500" />
                  <span>
                    {t.authorPrefix} <strong className="text-white font-mono">{tactic.author}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setEditingTactic(tactic)}
                  className="text-[11px] font-mono text-neutral-500 hover:text-neutral-300 underline"
                >
                  {t.edit}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Tactic Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-neutral-950 border border-neutral-800 rounded-2xl p-6 text-neutral-100">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">
              {tm.addTitle}
            </h3>

            <form onSubmit={handleCreateTactic} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  {tm.fieldTitle}
                </label>
                <input
                  type="text"
                  required
                  placeholder={tm.fieldTitlePlaceholder}
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  {tm.fieldDocsUrl}
                </label>
                <input
                  type="text"
                  required
                  placeholder={tm.fieldDocsPlaceholder}
                  value={newDocsUrl}
                  onChange={e => setNewDocsUrl(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  {tm.fieldAuthor}
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={e => setNewAuthor(e.target.value)}
                  placeholder={tm.fieldAuthorPlaceholder}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  {tm.fieldTags}
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-neutral-900/50 border border-neutral-800 rounded-lg">
                  {OFFICIAL_TAGS.map(tag => {
                    const active = newTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTagInNewForm(tag)}
                        className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors flex items-center gap-1.5 ${
                          active
                            ? 'bg-white text-black border-white font-bold'
                            : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                        }`}
                      >
                        {renderTagIcon(tag)}
                        <span>{active ? `✓ ${tag}` : tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  {tm.fieldDescription}
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder={tm.fieldDescriptionPlaceholder}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-900 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-mono rounded-lg border border-neutral-800 text-neutral-400 hover:text-white"
                >
                  {tm.btnCancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-mono rounded-lg bg-white text-black hover:bg-neutral-200 font-bold"
                >
                  {tm.btnAdd}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Tactic Modal */}
      {editingTactic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-neutral-950 border border-neutral-800 rounded-2xl p-6 text-neutral-100">
            <button
              onClick={() => setEditingTactic(null)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-4">
              {tm.editTitle}
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  {tm.fieldTitle}
                </label>
                <input
                  type="text"
                  required
                  value={editingTactic.title}
                  onChange={e => setEditingTactic({ ...editingTactic, title: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  {tm.fieldAuthor}
                </label>
                <input
                  type="text"
                  required
                  value={editingTactic.author}
                  onChange={e => setEditingTactic({ ...editingTactic, author: e.target.value })}
                  placeholder={tm.fieldAuthorPlaceholder}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  {tm.fieldDocsUrl}
                </label>
                <input
                  type="text"
                  required
                  value={editingTactic.googleDocsUrl}
                  onChange={e => setEditingTactic({ ...editingTactic, googleDocsUrl: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                  {tm.fieldTags}
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-neutral-900/50 border border-neutral-800 rounded-lg">
                  {OFFICIAL_TAGS.map(tag => {
                    const active = editingTactic.tags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTagInEditForm(tag)}
                        className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors flex items-center gap-1.5 ${
                          active
                            ? 'bg-white text-black border-white font-bold'
                            : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                        }`}
                      >
                        {renderTagIcon(tag)}
                        <span>{active ? `✓ ${tag}` : tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  {tm.fieldDescription}
                </label>
                <textarea
                  rows={2}
                  value={editingTactic.description || ''}
                  onChange={e => setEditingTactic({ ...editingTactic, description: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-white rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-900 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTactic(null)}
                  className="px-4 py-2 text-xs font-mono rounded-lg border border-neutral-800 text-neutral-400 hover:text-white"
                >
                  {tm.btnCancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-mono rounded-lg bg-white text-black hover:bg-neutral-200 font-bold"
                >
                  {tm.btnSave}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
