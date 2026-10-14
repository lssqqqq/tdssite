import { saveAs } from 'file-saver';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  HeadingLevel,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
  TableLayoutType,
  PageOrientation
} from 'docx';
import { CustomDocTemplate } from '../types/customDoc';
import { getExportPageGeometry, normalizeTableWidth, tableWidthTwips } from './tableWidth';

/**
 * Downloads .docx formatted file from the custom TDS Google Doc template in sleek monochrome style
 */
export async function downloadCustomDocx(docData: CustomDocTemplate): Promise<void> {
  const darkBg = '18181B';
  const borderCol = '52525B';

  const thinBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: borderCol },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: borderCol },
    left: { style: BorderStyle.SINGLE, size: 1, color: borderCol },
    right: { style: BorderStyle.SINGLE, size: 1, color: borderCol }
  };

  const geometry = getExportPageGeometry(docData.canvasSettings);

  /**
   * Builds a two-column table whose total width is the stored percentage of the page content area
   * (so each table keeps its own width in the exported file), centered and with fixed column widths.
   */
  const buildTwoColumnTable = (
    rows: { left: string; right: string }[],
    widthPct: number | undefined,
    leftFraction: number,
    header?: [string, string]
  ): Table => {
    const total = tableWidthTwips(widthPct, geometry);
    const leftW = Math.round(total * leftFraction);
    const columnWidths = [leftW, total - leftW];

    const makeCell = (text: string, index: 0 | 1, isHeader = false) =>
      new TableCell({
        width: { size: columnWidths[index], type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: index === 0 || isHeader ? darkBg : '0A0A0A' },
        borders: thinBorder,
        children: (text || ' ').split('\n').map(
          line =>
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  bold: index === 0 || isHeader,
                  color: index === 0 || isHeader ? 'FFFFFF' : 'E4E4E7'
                })
              ]
            })
        )
      });

    const tableRows = [
      ...(header ? [new TableRow({ tableHeader: true, children: [makeCell(header[0], 0, true), makeCell(header[1], 1, true)] })] : []),
      ...rows.map(r => new TableRow({ children: [makeCell(r.left, 0), makeCell(r.right, 1)] }))
    ];

    // A table without rows makes Word report a corrupt file, so always keep at least one (empty) row
    if (tableRows.length === 0) {
      tableRows.push(new TableRow({ children: [makeCell(' ', 0), makeCell(' ', 1)] }));
    }

    return new Table({
      width: { size: total, type: WidthType.DXA },
      columnWidths,
      layout: TableLayoutType.FIXED,
      alignment: AlignmentType.CENTER,
      rows: tableRows
    });
  };

  // Tab 1 Notes table
  const tab1Table = buildTwoColumnTable(
    docData.tab1.notesRows.map(row => ({ left: row.label || 'Title', right: row.content || 'write here...' })),
    docData.tab1.notesTableWidth,
    0.28
  );

  // Tab 2 top notes table (only when it has rows)
  const topNotesTable =
    docData.tab2.topNotesRows.length > 0
      ? buildTwoColumnTable(
          docData.tab2.topNotesRows.map(row => ({ left: row.label || 'Title', right: row.content || 'write here...' })),
          docData.tab2.topNotesTableWidth,
          0.28
        )
      : null;

  // Tab 2 Loadouts table
  const loadoutTable = buildTwoColumnTable(
    docData.tab2.loadoutRows.map(lr => ({ left: lr.playerTitle, right: lr.slots.map(sl => sl.name).filter(Boolean).join(' | ') })),
    docData.tab2.loadoutsTableWidth,
    0.22
  );

  // One table per player: placement map, notes and wave rows, each with the player's own width
  const buildPlayerTable = (player: CustomDocTemplate['tab2']['players'][number]): Table => {
    const rows: { left: string; right: string }[] = [];
    if (!player.hideMap) {
      rows.push({
        left: player.mapTitle || 'Placement Map',
        right: `${player.tokens.length} markers: ${player.tokens.map(tk => `${tk.label} (${tk.towerName || 'Tower'})`).join(', ') || '-'}`
      });
    }
    if (!player.hideNotes) {
      rows.push({ left: player.notesTitle || 'Notes', right: player.notes || '-' });
    }
    player.waveRows.forEach(w => rows.push({ left: w.wave || 'Wave ?', right: w.instructions || '-' }));
    return buildTwoColumnTable(rows, player.tableWidth, 0.28);
  };

  // Common issues table
  const commonIssuesTable = buildTwoColumnTable(
    docData.tab2.commonIssuesRows.map(issue => ({ left: issue.wave || 'Title', right: issue.reason || 'write here...' })),
    docData.tab2.commonIssuesTableWidth,
    0.28,
    ['Waves', 'Reason']
  );

  // Dynamic Categories Paragraphs
  const categoryParagraphs = docData.tab1.categories.flatMap(cat => [
    new Paragraph({
      text: cat.title,
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.CENTER
    }),
    new Paragraph({
      text: cat.members.map(m => m.name || 'Name').join(' • '),
      alignment: AlignmentType.CENTER
    }),
    new Paragraph({ text: '' })
  ]);

  // Build docx sections
  const docx = new Document({
    sections: [
      {
        properties: {
          page: {
            // Same page size, orientation and margins as the editor, so a table's stored % maps to the same width
            size: {
              width: geometry.portraitWidthTwips,
              height: geometry.portraitHeightTwips,
              orientation: geometry.landscape ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT
            },
            margin: {
              top: geometry.marginTwips,
              right: geometry.marginTwips,
              bottom: geometry.marginTwips,
              left: geometry.marginTwips
            }
          }
        },
        children: [
          // Title
          new Paragraph({
            text: 'TDS STRATEGY DOCUMENT',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({
            text: docData.tab1.subBannerText || 'TDS Community Strategy Guide',
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({ text: '' }),

          // Categories (CREATORS, MAP MAKER, TESTERS, etc.)
          ...categoryParagraphs,

          // Tab 1 Notes
          new Paragraph({
            text: docData.tab1.notesTitle || 'NOTES',
            heading: HeadingLevel.HEADING_2
          }),
          tab1Table,
          new Paragraph({ text: '' }),

          // Tab 2 Top Notes
          ...(topNotesTable
            ? [
                new Paragraph({
                  text: docData.tab2.topNotesTitle || 'NOTES',
                  heading: HeadingLevel.HEADING_2,
                  alignment: AlignmentType.CENTER
                }),
                topNotesTable,
                new Paragraph({ text: '' })
              ]
            : []),

          // Tab 2 Loadouts (heading centered above the table)
          new Paragraph({
            text: docData.tab2.loadoutsTitle || 'LOADOUTS',
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER
          }),
          loadoutTable,
          new Paragraph({ text: '' }),

          // Tab 2 Players
          ...docData.tab2.players.flatMap(player => [
            new Paragraph({
              text: `${player.playerTitle} (${player.difficultyBadge})`,
              heading: HeadingLevel.HEADING_2
            }),
            new Paragraph({
              text: `Loadout: ${player.towers.map(t => t.name).filter(Boolean).join(', ')}`
            }),
            buildPlayerTable(player),
            new Paragraph({ text: '' })
          ]),

          // Common Issues
          new Paragraph({
            text: docData.tab2.commonIssuesTitle || 'COMMON ISSUES',
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER
          }),
          commonIssuesTable
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(docx);
  saveAs(blob, `TDS_Strategy_GoogleDoc_${Date.now()}.docx`);
}

/**
 * Copies rich styled HTML for Google Docs (docs.new) in black & white theme
 */
export async function copyCustomDocHtmlToClipboard(docData: CustomDocTemplate): Promise<boolean> {
  // Each table gets its own width (stored as a % of the content area) and stays centered
  const tableStyleFor = (widthPct: number | undefined) =>
    `border-collapse: collapse; width: ${normalizeTableWidth(widthPct)}%; margin: 14px auto; font-family: Arial, sans-serif; font-size: 13px; background-color: #0a0a0a; color: #ffffff;`;
  const tdLeft =
    'border: 1px solid #404040; background-color: #171717; color: #ffffff; padding: 10px 14px; font-weight: bold; width: 25%; vertical-align: top;';
  const tdRight =
    'border: 1px solid #404040; padding: 10px 14px; vertical-align: top; color: #e5e5e5; line-height: 1.6; white-space: pre-wrap;';

  const notesHtml = docData.tab1.notesRows
    .map(r => `<tr><td style="${tdLeft}">${r.label || 'Title'}</td><td style="${tdRight}">${r.content || 'write here...'}</td></tr>`)
    .join('');

  const loadoutHtml = docData.tab2.loadoutRows
    .map(
      lr =>
        `<tr><td style="${tdLeft}">${lr.playerTitle}</td><td style="${tdRight}">${lr.slots.map(s => s.name).filter(Boolean).join(' | ')}</td></tr>`
    )
    .join('');

  const topNotesHtml = docData.tab2.topNotesRows
    .map(r => `<tr><td style="${tdLeft}">${r.label || 'Title'}</td><td style="${tdRight}">${r.content || 'write here...'}</td></tr>`)
    .join('');

  const categoriesHtml = docData.tab1.categories
    .map(
      cat => `
        <h2 style="color: #ffffff; font-size: 20px; text-align: center; margin-top: 20px; text-transform: uppercase;">${cat.title}</h2>
        <p style="text-align: center; font-size: 14px; color: #a3a3a3;">${cat.members.map(m => m.name || 'Name').join(' • ')}</p>
      `
    )
    .join('');

  const playersHtml = docData.tab2.players
    .map(
      p => `<div style="box-sizing: border-box; width: ${normalizeTableWidth(p.tableWidth)}%; margin: 24px auto 0 auto; padding: 16px; background-color: #111111; border: 1px solid #333333; border-radius: 8px;">
        <h3 style="color: #ffffff; margin: 0 0 4px 0; font-size: 20px;">${p.playerTitle}</h3>
        <p style="color: #a3a3a3; font-size: 12px; margin: 0 0 12px 0;">${p.difficultyBadge}</p>
        <p style="color: #d4d4d4; font-size: 13px;"><b>Towers:</b> ${p.towers.map(t => t.name).filter(Boolean).join(', ')}</p>
        ${!p.hideMap ? `<p style="color: #d4d4d4; font-size: 13px;"><b>${p.mapTitle || 'Map Markers'} (${p.tokens.length}):</b> ${p.tokens.map(t => `${t.label} (${t.towerName || 'Tower'})`).join(', ')}</p>` : ''}
        ${!p.hideNotes ? `<div style="background-color: #0a0a0a; border: 1px solid #262626; padding: 12px; border-radius: 6px; margin: 10px 0; font-size: 13px; line-height: 1.6; white-space: pre-wrap;"><b style="color: #ffffff;">${p.notesTitle || 'Notes'}:</b><br/>${p.notes || '-'}</div>` : ''}
        ${p.waveRows.map(w => `<p style="margin: 6px 0; font-size: 13px;"><b style="color: #ffffff;">${w.wave || 'Wave ?'}:</b> ${w.instructions || '-'}</p>`).join('')}
      </div>`
    )
    .join('');

  const commonIssuesHtml = docData.tab2.commonIssuesRows
    .map(i => `<tr><td style="${tdLeft}">${i.wave || 'Title'}</td><td style="${tdRight}">${i.reason || 'write here...'}</td></tr>`)
    .join('');

  const fullHtml = `
  <div style="font-family: Arial, sans-serif; background-color: #000000; color: #ffffff; padding: 24px; max-width: 820px; border: 2px solid #333333;">
    <h1 style="color: #ffffff; text-align: center; font-size: 28px; margin-bottom: 4px; letter-spacing: 2px;">TDS STRATEGY DOCUMENT</h1>
    <p style="text-align: center; color: #a3a3a3; font-size: 13px; margin-bottom: 24px; white-space: pre-wrap;">${docData.tab1.subBannerText}</p>

    ${categoriesHtml}

    <h2 style="color: #ffffff; font-size: 24px; text-align: center; margin-top: 28px;">${docData.tab1.notesTitle}</h2>
    <table style="${tableStyleFor(docData.tab1.notesTableWidth)}">
      ${notesHtml}
    </table>

    ${
      topNotesHtml
        ? `<h2 style="color: #ffffff; font-size: 24px; text-align: center; margin-top: 32px;">${docData.tab2.topNotesTitle}</h2>
    <table style="${tableStyleFor(docData.tab2.topNotesTableWidth)}">
      ${topNotesHtml}
    </table>`
        : ''
    }

    <h2 style="color: #ffffff; font-size: 24px; text-align: center; margin-top: 32px;">${docData.tab2.loadoutsTitle}</h2>
    <table style="${tableStyleFor(docData.tab2.loadoutsTableWidth)}">
      ${loadoutHtml}
    </table>

    <h2 style="color: #ffffff; font-size: 26px; text-align: center; margin-top: 32px;">${docData.tab2.strategyTitle}</h2>
    ${playersHtml}

    <h2 style="color: #ffffff; font-size: 24px; text-align: center; margin-top: 32px;">${docData.tab2.commonIssuesTitle}</h2>
    <table style="${tableStyleFor(docData.tab2.commonIssuesTableWidth)}">
      ${commonIssuesHtml}
    </table>
  </div>
  `;

  try {
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
      const blobHtml = new Blob([fullHtml], { type: 'text/html' });
      const blobText = new Blob([docData.tab1.subBannerText], { type: 'text/plain' });
      await navigator.clipboard.write([
        new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })
      ]);
      return true;
    } else {
      await navigator.clipboard.writeText(fullHtml);
      return true;
    }
  } catch (e) {
    console.error('Clipboard copy failed:', e);
    return false;
  }
}
