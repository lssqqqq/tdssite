import { JSONContent } from '@tiptap/react';

export type PageTheme = 'dark' | 'light';

export interface DocumentMetadata {
  id: string;
  title: string;
  author: string;
  gamemode: string;
  theme: PageTheme;
  zoom: number; // 0.75, 1, 1.25
  createdAt: string;
  updatedAt: string;
}

export interface TdsEditorDocument {
  metadata: DocumentMetadata;
  content: JSONContent;
  html?: string;
}

export interface QuickInsertBlock {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'header' | 'loadout' | 'strategy' | 'table' | 'notes';
  html: string;
}
