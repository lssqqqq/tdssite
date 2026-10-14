import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import Image from '@tiptap/extension-image';

import { DocumentMetadata, TdsEditorDocument } from '../../types/editor';
import { INITIAL_EDITOR_HTML } from '../../data/editorTemplates';
import { TdsEditorToolbar } from './TdsEditorToolbar';
import { TdsEditorSidebar } from './TdsEditorSidebar';
import { exportEditorToDocx } from '../../utils/docxExportHelper';
import { translations, Language } from '../../i18n/translations';

const STORAGE_KEY_A4_DRAFT = 'tds_a4_editor_draft_v2';

interface TdsA4EditorProps {
  lang: Language;
}

export const TdsA4Editor: React.FC<TdsA4EditorProps> = ({ lang }) => {
  const t = translations[lang].editor;

  // Metadata state
  const [metadata, setMetadata] = useState<DocumentMetadata>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_A4_DRAFT);
      if (saved) {
        const parsed: TdsEditorDocument = JSON.parse(saved);
        if (parsed.metadata) return parsed.metadata;
      }
    } catch (e) {
      console.error('Failed to load draft metadata:', e);
    }
    return {
      id: `doc-${Date.now()}`,
      title: 'LUCILLE STRATEGY — HARDCORE TRIO',
      author: 'Ayaka',
      gamemode: 'Hardcore',
      theme: 'dark',
      zoom: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Table.configure({
        resizable: true
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        inline: true,
        allowBase64: true
      })
    ],
    content: (() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_A4_DRAFT);
        if (saved) {
          const parsed: TdsEditorDocument = JSON.parse(saved);
          if (parsed.content) return parsed.content;
          if (parsed.html) return parsed.html;
        }
      } catch (e) {
        console.error('Failed to load draft content:', e);
      }
      return INITIAL_EDITOR_HTML;
    })(),
    onUpdate: () => {
      triggerAutoSave();
    }
  });

  // Debounced auto-save function
  const triggerAutoSave = useCallback(() => {
    if (!editor) return;
    setIsSaving(true);
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        const draft: TdsEditorDocument = {
          metadata: {
            ...metadata,
            updatedAt: new Date().toISOString()
          },
          content: editor.getJSON(),
          html: editor.getHTML()
        };
        localStorage.setItem(STORAGE_KEY_A4_DRAFT, JSON.stringify(draft));
      } catch (e) {
        console.error('Failed to auto-save draft:', e);
      } finally {
        setIsSaving(false);
      }
    }, 600);
  }, [editor, metadata]);

  // Trigger auto-save when metadata changes
  useEffect(() => {
    triggerAutoSave();
  }, [metadata.title, metadata.theme, metadata.zoom, triggerAutoSave]);

  const handleUpdateMetadata = (updated: Partial<DocumentMetadata>) => {
    setMetadata(prev => ({ ...prev, ...updated }));
  };

  // Export JSON structured document
  const handleExportJson = () => {
    if (!editor) return;
    const docData: TdsEditorDocument = {
      metadata: {
        ...metadata,
        updatedAt: new Date().toISOString()
      },
      content: editor.getJSON(),
      html: editor.getHTML()
    };
    const jsonStr = JSON.stringify(docData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(metadata.title || 'tds_strategy').replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON structured document
  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const json = JSON.parse(ev.target?.result as string) as TdsEditorDocument;
        if (json.metadata) {
          setMetadata(json.metadata);
        }
        if (json.content && editor) {
          editor.commands.setContent(json.content);
        } else if (json.html && editor) {
          editor.commands.setContent(json.html);
        }
      } catch (err) {
        alert('Invalid JSON document file.');
      }
    };
    reader.readAsText(file);
  };

  // Export to Microsoft Word DOCX (Google Docs compatible)
  const handleExportDocx = async () => {
    if (!editor) return;
    try {
      await exportEditorToDocx(metadata, editor.getHTML());
    } catch (e) {
      console.error('Error exporting DOCX:', e);
      alert('Failed to export DOCX.');
    }
  };

  // Reset to default template
  const handleResetDoc = () => {
    if (confirm('Reset document content to default template?')) {
      if (editor) {
        editor.commands.setContent(INITIAL_EDITOR_HTML);
      }
      setMetadata(prev => ({
        ...prev,
        title: 'LUCILLE STRATEGY — HARDCORE TRIO',
        updatedAt: new Date().toISOString()
      }));
    }
  };

  const isDark = metadata.theme === 'dark';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP TOOLBAR */}
      <TdsEditorToolbar
        editor={editor}
        metadata={metadata}
        onChangeMetadata={handleUpdateMetadata}
        isSaving={isSaving}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onExportDocx={handleExportDocx}
        onResetDoc={handleResetDoc}
        lang={lang}
      />

      {/* 2. WORKSPACE AREA: SIDEBAR + A4 CANVAS */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left: TDS Quick Elements Sidebar */}
        <TdsEditorSidebar editor={editor} lang={lang} />

        {/* Center / Right: Desktop Background with Scaled A4 Sheet */}
        <div className="flex-1 w-full bg-neutral-950/80 border border-neutral-800 rounded-3xl p-4 sm:p-8 min-h-[850px] flex flex-col items-center justify-start shadow-inner overflow-x-auto">
          {/* A4 Format Badge Header */}
          <div className="mb-4 flex items-center justify-between w-full max-w-[210mm] text-[11px] font-mono text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>{t.pageA4Badge}</span>
            </span>
            <span>Zoom: {Math.round(metadata.zoom * 100)}%</span>
          </div>

          {/* Scaled A4 Sheet Container */}
          <div
            className="transition-transform duration-150 origin-top flex justify-center w-full"
            style={{
              transform: `scale(${metadata.zoom})`
            }}
          >
            {/* PHYSICAL A4 SHEET (210mm x 297mm with 25.4mm margins) */}
            <div
              className={`a4-page-sheet shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-sm border ${
                isDark
                  ? 'a4-theme-dark bg-[#0c0d12] text-[#f1f5f9] border-neutral-800'
                  : 'a4-theme-light bg-white text-[#111827] border-neutral-300'
              }`}
            >
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
