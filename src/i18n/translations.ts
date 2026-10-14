export type Language = 'en';

export const translations = {
  en: {
    siteName: 'Strategy Vault',
    subBrand: 'Strategy Hub',
    
    // Header navigation
    nav: {
      home: 'Main Menu',
      tacticsList: 'Strategy List',
      generator: 'Strategy Studio',
      editor: 'A4 Editor',
      cta: 'Strategies'
    },

    // Search bar
    search: {
      placeholder: 'Search by strategy name, tags, or author...',
      queryLabel: 'Search results for:',
      clear: 'Clear search',
      goToList: 'Go to strategy list →'
    },

    // Main Menu
    mainMenu: {
      heroTitle1: 'Find strategies',
      heroTitle2: 'for any match.',
      heroDescription:
        'A convenient website to browse, store, and quickly generate strategies right in your browser. Everything you need is gathered in one place so you can easily find suitable strategies or create your own.',
      cards: {
        list: {
          title: 'Strategy List',
          description:
            'TDS community strategy vault with direct Google Docs links, 13 official filter tags, and author credits.',
          button: 'Open strategy list',
          link: 'All strategies in vault ({count}) →'
        },
        generator: {
          title: 'Strategy Studio',
          description:
            'Craft custom strategies for your towers: difficulty settings, team role distribution, and step-by-step wave instructions.',
          button: 'Go to studio',
          link: 'Configure build →'
        }
      }
    },

    // Strategy List
    tacticsList: {
      filterByTags: 'Filter by tags',
      all: 'All',
      resetTag: 'Reset tag',
      addTactic: 'Add strategy',
      foundCount: 'Strategies found:',
      totalCount: 'Total in vault:',
      author: 'Author',
      authorPrefix: 'Author:',
      edit: 'Edit',
      openDoc: 'Open',
      copyDocLink: 'Copy Google Doc link',
      copied: 'Copied',
      emptyTitle: 'No strategies found for your criteria.',
      clearTagFilter: 'Clear tag filter',
      clearSearch: 'Clear search'
    },

    // Add / Edit Modal
    modal: {
      addTitle: 'Add strategy to vault',
      editTitle: 'Edit strategy and author',
      fieldTitle: 'Strategy Title *',
      fieldTitlePlaceholder: 'e.g. Lucille Strategy Hardcore',
      fieldDocsUrl: 'Google Docs Link *',
      fieldDocsPlaceholder: 'https://docs.google.com/document/d/...',
      fieldAuthor: 'Author',
      fieldAuthorPlaceholder: 'Author',
      fieldTags: 'Strategy tags',
      fieldDescription: 'Short description',
      fieldDescriptionPlaceholder: 'What is this strategy about...',
      btnCancel: 'Cancel',
      btnAdd: 'Save strategy',
      btnSave: 'Apply changes'
    },

    // Studio & Custom Doc Generator
    studio: {
      sidebarTowers: 'Towers',
      sidebarMaps: 'Maps',
      searchTowersPlaceholder: 'Search towers...',
      searchMapsPlaceholder: 'Search maps...',
      nothingFound: 'Nothing found.',
      
      tab1: 'Tab 1: Cover & Notes',
      tab2: 'Tab 2: Loadouts & Waves',
      generateBtn: 'Generate Google Doc',
      
      uploadCoverTooltip: 'Click to upload cover from files',
      insertFromSidebar: 'Insert from sidebar',
      uploadCoverBtn: 'Upload cover',
      deleteCoverTooltip: 'Delete cover',
      subBannerPlaceholder: 'write here...',
      
      categoryTitlePlaceholder: 'CATEGORY TITLE',
      duplicateCategory: 'Duplicate category',
      deleteCategory: 'Delete category',
      deleteSlot: 'Delete slot',
      uploadAvatarTooltip: 'Click to upload image from files',
      fileOverlay: 'File',
      namePlaceholder: 'Name',
      addSlotBtn: 'Add',
      addCategoryBtn: 'Add category',
      restoreCategoriesBtn: 'Restore default categories',
      defaultCreatorTitle: 'CREATORS',
      defaultMapMakerTitle: 'PLACEMENT MAP MAKER',
      defaultTestersTitle: 'TESTERS',
      
      notesTitlePlaceholder: 'title',
      duplicateNotes: 'Duplicate notes section',
      deleteNotes: 'Delete notes section',
      deleteRow: 'Delete row',
      writeHerePlaceholder: 'write here...',
      addNotesRowBtn: 'Add notes row',
      restoreSectionsLabel: 'Restore sections:',
      restoreCover: 'Cover',
      restoreNotes: 'Notes',
      
      addTopNotesRowBtn: 'Add row',
      
      loadoutsTitlePlaceholder: 'LOADOUTS',
      deleteLoadouts: 'Delete loadouts section',
      playersCountLabel: 'Players:',
      tableResizeLabel: 'Resize table width',
      tableResizeHint: 'Drag to resize this table (arrow keys fine-tune, double-click resets)',
      thPlayer: 'Player',
      slotPrefix: 'Slot',
      applyTowerTooltip: 'Click to apply selected tower or upload file',
      playerNamePlaceholder: 'Player Name',
      towerNamePlaceholder: 'Tower Name',
      
      strategyTitlePlaceholder: 'STRATEGY',
      deleteStrategy: 'Delete strategy section',
      
      duplicateBtn: 'Duplicate',
      deleteBtn: 'Delete',
      playerTitlePlaceholder: 'PLAYER NAME',
      difficultyBadgePlaceholder: 'Difficulty: Normal',
      placementMapTitlePlaceholder: 'Placement Map',
      deleteMapTooltip: 'Delete',
      notesTitleBlockPlaceholder: 'Notes',
      deleteNotesTooltip: 'Delete',
      wavePlaceholder: 'Wave ?',
      addPlacementMapBtn: 'Add Placement Map',
      addNotesBtn: 'Add Notes block',
      addWaveBtn: 'Add wave for',
      addPlayerBlockBtn: 'Add player strategy block',
      copySuffix: ' (Copy)',
      
      commonIssuesTitlePlaceholder: 'COMMON ISSUES',
      deleteCommonIssues: 'Delete common issues section',
      thWaves: 'Waves',
      thReason: 'Reason',
      addCommonIssueBtn: 'Add issue row',
      
      mapUploadBtn: 'Upload map photo',
      markersOn: 'Markers: On',
      cleanPhoto: 'Clean photo (no markers)',
      hideMarkers: 'Hide markers',
      showMarkers: 'Show markers',
      clearAllMarkers: 'Clear all markers',
      mapClickHint: 'Click anywhere on the map photo to place a tower, or select "Clean photo"',
      markerLabel: 'Marker:',
      deleteMarker: 'Delete marker',
      duplicateMarker: 'Duplicate',
      deselectMarker: 'Deselect',
      removeMapPhoto: 'Remove map photo',
      removeImage: 'Remove image',
      uploadImage: 'Upload image',
      emptyImageSlot: 'No image',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      resetView: 'Reset view',
      panTool: 'Pan tool (or hold Space / middle mouse button)',
      expandEditor: 'Expand editor',
      collapseEditor: 'Close expanded editor',
      placeHintReady: 'Click the map to place',
      placeHintNoTower: 'Select a tower in the left panel, then click the map to place it',
      placeHintHidden: 'Markers are hidden - turn them on to edit placements',
      markerOutlineLabel: 'Outline',
      markerSizeLabel: 'Size',
      clearAllConfirm: 'Remove all tower placements from this map?',
      mapEmptyHint: 'Select a map in the left panel or upload a map photo',
      
      modalBadge: 'Google Doc Generated',
      modalTitle: 'Strategy Document Created!',
      modalDescription: 'Your styled document with all logos, creator avatars, note tables, decks, and maps is ready to export.',
      downloadDocxTitle: 'Download .docx file',
      downloadDocxSub: 'Ready to upload and open in Google Docs or Microsoft Word.',
      copyDocHtmlTitle: 'Copy formatted text',
      copiedDocHtmlTitle: 'Copied!',
      copyDocHtmlSub: 'Copies full formatted document to clipboard for instant pasting.',
      closeModalBtn: 'Close'
    },

    // Generator placeholder
    generatorPlaceholder: {
      badge: 'Module in preparation',
      title: 'Strategy Studio',
      description:
        'This section is reserved for the strategy studio feature. Detailed parameters, deck settings, and strategy generation algorithms will be added here later.',
      status: 'Awaiting parameter configuration'
    },

    // Information section
    info: {
      title: 'Information',
      editBtn: 'Edit text',
      cancelBtn: 'Cancel',
      saveBtn: 'Save',
      hint: 'The text is automatically saved in your browser. You can modify it at any time.',
      defaultText: `Here you can write any information about the website, project, or community:
• Guidelines for formatting and using strategies from Google Docs
• Links to your Discord community or Roblox group
• Instructions on how to submit community strategies
• Current Tower Defense Simulator patch version`,
      listDefaultText: `• This site features current tactics and strategies for Tower Defense Simulator (TDS) in Roblox.
• Guide sources: All featured materials and Google Docs strategies are compiled from open sources (the official TDS Discord server, community hubs, and the internet). We do not claim ownership of the original strategies — all rights belong to their respective creators.
• Usage: Strategies are structured for quick and convenient reference before heading into a match.`
    },

    // Footer
    footer: {
      authors: 'Author: Ayaka',
      support: 'Support development',
      chat: 'Chat & news',
      ads: 'Advertising / Contact',
      reset: 'Reset data to defaults'
    },

    // Canvas & Sheet Formatting (Unified Strategy Studio + A4 Editor)
    canvas: {
      toolbarTitle: 'Canvas Settings',
      format: 'Format',
      formatA4: 'A4 (210 × 297 mm)',
      formatLetter: 'US Letter (8.5 × 11 in)',
      formatA3: 'A3 (297 × 420 mm)',
      formatWidescreen: '16:9 Slide (1920 × 1080)',
      formatFluid: 'Studio Canvas',
      formatCustom: 'Custom Size',
      orientation: 'Orientation',
      portrait: 'Portrait',
      landscape: 'Landscape',
      margins: 'Margins',
      marginNormal: 'Normal (25.4 mm)',
      marginNarrow: 'Narrow (12.7 mm)',
      marginModerate: 'Moderate (19 mm)',
      marginWide: 'Wide (35 mm)',
      marginNone: 'None (0 mm)',
      marginCustom: 'Custom Margins',
      theme: 'Sheet Color',
      themeBlack: 'OLED Black',
      themeDark: 'Dark Graphite',
      themeMidnight: 'Midnight Purple',
      themeWhite: 'Clean White',
      themePaper: 'Soft Paper',
      themeCustom: 'Custom Color',
      pagesMode: 'Display Mode',
      allPages: 'All Pages (A4 Flow)',
      page1: 'Page 1: Overview',
      page2: 'Page 2: Strategy',
      continuous: 'Continuous Canvas',
      zoom: 'Zoom',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      resetZoom: '100%',
      fitWidth: 'Fit to Window',
      guides: 'Guides',
      showGrid: 'Grid',
      exportDocx: 'Export DOCX',
      copyHtml: 'Copy HTML',
      exportJson: 'Export JSON',
      importJson: 'Import JSON',
      addCustomPage: 'Add Page',
      pageCounter: 'Page {current} of {total}',
      widthMm: 'Width (mm)',
      heightMm: 'Height (mm)',
      pageBreakBadge: 'PAGE BREAK'
    },

    // A4 Tactics Web-Editor
    editor: {
      title: 'TDS Tactics A4 Editor',
      subtitle: 'Full-featured A4 (210 × 297 mm) document editor with customizable margins and export.',
      docTitlePlaceholder: 'Untitled TDS Strategy',
      undo: 'Undo (Ctrl+Z)',
      redo: 'Redo (Ctrl+Y)',
      bold: 'Bold',
      italic: 'Italic',
      strike: 'Strikethrough',
      code: 'Code',
      h1: 'H1 Title (Emerald Accent)',
      h2: 'H2 Section (Violet Accent)',
      h3: 'H3 Subsection',
      bulletList: 'Bullet List',
      orderedList: 'Numbered List',
      blockquote: 'Quote Block',
      divider: 'Divider',
      table: 'Insert Table (3x3)',
      addRowAbove: 'Add Row Above',
      addRowBelow: 'Add Row Below',
      deleteRow: 'Delete Row',
      addColumnBefore: 'Add Column Left',
      addColumnAfter: 'Add Column Right',
      deleteColumn: 'Delete Column',
      deleteTable: 'Delete Table',
      insertImage: 'Insert Image',
      imageUploadPrompt: 'Upload image from computer or enter URL:',
      themeDark: 'Dark Page',
      themeLight: 'Light Page',
      zoom: 'Zoom',
      saved: 'Saved',
      saving: 'Saving...',
      exportJson: 'Export JSON',
      importJson: 'Import JSON',
      exportDocx: 'Export DOCX',
      resetDoc: 'Reset Template',
      elementsSidebar: 'TDS Element Blocks',
      sidebarDesc: 'Click any block to insert it at cursor position into your A4 document.',
      insertBlock: 'Insert',
      pageA4Badge: 'A4 Format (210 × 297 mm, 25.4 mm margins)',
      blocks: {
        cover: 'Cover Banner',
        coverDesc: 'Title header with violet accent and credits',
        notes: 'Notes Section',
        notesDesc: 'Important rules and notices table',
        loadouts: 'Loadouts Table',
        loadoutsDesc: 'Player 1 & 2 deck slots with towers',
        strategy: 'Strategy Header',
        strategyDesc: 'Role assignment and team layout',
        player1: 'Player 1 Plan',
        player1Desc: 'Detailed wave duties for Player 1',
        player2: 'Player 2 Plan',
        player2Desc: 'Detailed wave duties for Player 2',
        waveTable: 'Wave Schedule Table',
        waveTableDesc: 'Wave-by-wave action table with timings',
        placementMap: 'Placement Map Block',
        placementMapDesc: 'Container for tower placement diagram'
      }
    }
  }
};
