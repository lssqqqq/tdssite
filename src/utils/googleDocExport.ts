import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType
} from 'docx';
import { saveAs } from 'file-saver';
import { StrategyDocData } from '../types/generator';

/**
 * Generates an official, beautifully formatted Microsoft Word (.docx) file
 * that can be directly uploaded to Google Drive / opened in Google Docs with 100% fidelity.
 */
export async function exportStrategyToWordDocx(data: StrategyDocData): Promise<void> {
  const primaryColor = '2563EB'; // Royal Blue accent
  const darkColor = '0F172A';
  const lightGrayBg = 'F8FAFC';
  const borderColor = 'CBD5E1';

  const thinBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
    left: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
    right: { style: BorderStyle.SINGLE, size: 1, color: borderColor }
  };

  // 1. Meta / Overview Table
  const metaRows = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: lightGrayBg },
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: 'Strategy Title:', bold: true })] })]
        }),
        new TableCell({
          width: { size: 70, type: WidthType.PERCENTAGE },
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: data.title, bold: true, color: primaryColor })] })]
        })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { type: ShadingType.CLEAR, fill: lightGrayBg },
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: 'Creators:', bold: true })] })]
        }),
        new TableCell({
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: data.creators || data.author || 'Ayaka' })] })]
        })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { type: ShadingType.CLEAR, fill: lightGrayBg },
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: 'Map:', bold: true })] })]
        }),
        new TableCell({
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: data.selectedMap.name })] })]
        })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { type: ShadingType.CLEAR, fill: lightGrayBg },
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: 'Gamemode / Difficulty:', bold: true })] })]
        }),
        new TableCell({
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: `${data.gamemode} • ${data.playersCount}` })] })]
        })
      ]
    }),
    new TableRow({
      children: [
        new TableCell({
          shading: { type: ShadingType.CLEAR, fill: lightGrayBg },
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: 'Date Created:', bold: true })] })]
        }),
        new TableCell({
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: new Date().toLocaleDateString('en-US') })] })]
        })
      ]
    })
  ];

  const metaTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: metaRows
  });

  // 2. Hero Grid Table
  const heroTowers = data.heroTowers && data.heroTowers.length > 0
    ? data.heroTowers
    : data.playerDecks.flatMap(d => d.towers);

  const heroGridHeader = new TableRow({
    children: [
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
        borders: thinBorder,
        children: [new Paragraph({ children: [new TextRun({ text: '#', bold: true, color: 'FFFFFF' })] })]
      }),
      new TableCell({
        width: { size: 40, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
        borders: thinBorder,
        children: [new Paragraph({ children: [new TextRun({ text: 'Hero / Tower', bold: true, color: 'FFFFFF' })] })]
      }),
      new TableCell({
        width: { size: 25, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
        borders: thinBorder,
        children: [new Paragraph({ children: [new TextRun({ text: 'Category', bold: true, color: 'FFFFFF' })] })]
      }),
      new TableCell({
        width: { size: 25, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: '1E3A8A' },
        borders: thinBorder,
        children: [new Paragraph({ children: [new TextRun({ text: 'Cost / DPS', bold: true, color: 'FFFFFF' })] })]
      })
    ]
  });

  const heroGridRows = heroTowers.map((tower, idx) => {
    return new TableRow({
      children: [
        new TableCell({
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: `${idx + 1}` })] })]
        }),
        new TableCell({
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: tower.name, bold: true })] })]
        }),
        new TableCell({
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: tower.category })] })]
        }),
        new TableCell({
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: `$${tower.cost} • ${tower.dps || 'DPS'}` })] })]
        })
      ]
    });
  });

  const heroTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [heroGridHeader, ...heroGridRows]
  });

  // 3. Placed Towers Table (from Canvas)
  const towerHeader = new TableRow({
    children: [
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: '0F172A' },
        borders: thinBorder,
        children: [new Paragraph({ children: [new TextRun({ text: '#', bold: true, color: 'FFFFFF' })] })]
      }),
      new TableCell({
        width: { size: 30, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: '0F172A' },
        borders: thinBorder,
        children: [new Paragraph({ children: [new TextRun({ text: 'Tower', bold: true, color: 'FFFFFF' })] })]
      }),
      new TableCell({
        width: { size: 15, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: '0F172A' },
        borders: thinBorder,
        children: [new Paragraph({ children: [new TextRun({ text: 'Player', bold: true, color: 'FFFFFF' })] })]
      }),
      new TableCell({
        width: { size: 15, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: '0F172A' },
        borders: thinBorder,
        children: [new Paragraph({ children: [new TextRun({ text: 'Level', bold: true, color: 'FFFFFF' })] })]
      }),
      new TableCell({
        width: { size: 15, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: '0F172A' },
        borders: thinBorder,
        children: [new Paragraph({ children: [new TextRun({ text: 'Target', bold: true, color: 'FFFFFF' })] })]
      }),
      new TableCell({
        width: { size: 15, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: '0F172A' },
        borders: thinBorder,
        children: [new Paragraph({ children: [new TextRun({ text: 'Coordinates', bold: true, color: 'FFFFFF' })] })]
      })
    ]
  });

  const towerRows = data.placedTowers.map((pt, idx) => {
    return new TableRow({
      children: [
        new TableCell({
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: `${idx + 1}` })] })]
        }),
        new TableCell({
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: pt.towerName, bold: true })] })]
        }),
        new TableCell({
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: pt.player })] })]
        }),
        new TableCell({
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: `Lv.${pt.level}` })] })]
        }),
        new TableCell({
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: pt.target })] })]
        }),
        new TableCell({
          borders: thinBorder,
          children: [new Paragraph({ children: [new TextRun({ text: `${Math.round(pt.x)}% / ${Math.round(pt.y)}%` })] })]
        })
      ]
    });
  });

  const placementTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [towerHeader, ...towerRows]
  });

  // Free document content split by paragraphs
  const docParagraphs = (data.freeDocContent || '')
    .split('\n')
    .map(line => {
      if (line.startsWith('# ')) {
        return new Paragraph({
          text: line.replace('# ', ''),
          heading: HeadingLevel.HEADING_1
        });
      }
      if (line.startsWith('## ')) {
        return new Paragraph({
          text: line.replace('## ', ''),
          heading: HeadingLevel.HEADING_2
        });
      }
      return new Paragraph({
        children: [new TextRun({ text: line || ' ' })]
      });
    });

  // Construct full Word / Google Docs document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: data.title || 'TDS Strategy Document',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER
          }),
          // Creators
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Creators: ${data.creators || data.author || 'Ayaka'}`,
                bold: true,
                color: '3B82F6'
              })
            ]
          }),
          new Paragraph({ text: '' }),

          // NOTES (Tab 1 Notes)
          new Paragraph({
            text: 'NOTES & GUIDELINES',
            heading: HeadingLevel.HEADING_2
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.notesTab1 || data.generalNotes || '• Follow tower placement instructions.\n• Respect ability cooldown timings.',
                color: darkColor
              })
            ]
          }),
          new Paragraph({ text: '' }),

          // Overview
          new Paragraph({
            text: 'Strategy Overview',
            heading: HeadingLevel.HEADING_2
          }),
          metaTable,
          new Paragraph({ text: '' }),

          // Hero Grid
          new Paragraph({
            text: `Hero Grid / Selected Towers (${heroTowers.length})`,
            heading: HeadingLevel.HEADING_2
          }),
          heroTowers.length > 0
            ? heroTable
            : new Paragraph({ children: [new TextRun({ text: 'No towers selected in hero grid.' })] }),
          new Paragraph({ text: '' }),

          // Tactical Notes (Tab 2)
          ...(data.notesTab2
            ? [
                new Paragraph({
                  text: 'Tactical Notes',
                  heading: HeadingLevel.HEADING_2
                }),
                new Paragraph({
                  children: [new TextRun({ text: data.notesTab2 })]
                }),
                new Paragraph({ text: '' })
              ]
            : []),

          // Placed Towers Table (from canvas)
          new Paragraph({
            text: `Map Placement (${data.placedTowers.length} towers)`,
            heading: HeadingLevel.HEADING_2
          }),
          data.placedTowers.length > 0
            ? placementTable
            : new Paragraph({
                children: [new TextRun({ text: 'Towers are placed throughout the match.', italics: true })]
              }),
          new Paragraph({ text: '' }),

          // Free text / Guide space
          new Paragraph({
            text: 'Strategy Guide & Instructions',
            heading: HeadingLevel.HEADING_2
          }),
          ...docParagraphs,

          new Paragraph({ text: '' }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: 'Document generated via TDS Strategy Studio for Google Docs.',
                size: 18,
                color: '94A3B8'
              })
            ]
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const safeFilename = `${(data.title || 'TDS_Strategy').replace(/[^a-zA-Z0-9_-]/g, '_')}_GoogleDoc.docx`;
  saveAs(blob, safeFilename);
}

/**
 * Creates styled HTML ready to paste directly into Google Docs (via docs.new)
 * using the system clipboard with full formatting preservation.
 */
export function generateGoogleDocHtml(data: StrategyDocData): string {
  const tableStyle =
    'border-collapse: collapse; width: 100%; margin-top: 10px; margin-bottom: 20px; font-family: Arial, sans-serif; font-size: 13px;';
  const thStyle =
    'border: 1px solid #cbd5e1; background-color: #1e3a8a; color: #ffffff; padding: 8px 12px; text-align: left; font-weight: bold;';
  const tdStyle =
    'border: 1px solid #cbd5e1; padding: 7px 10px; color: #1e293b;';

  const heroTowers = data.heroTowers && data.heroTowers.length > 0
    ? data.heroTowers
    : data.playerDecks.flatMap(d => d.towers);

  const heroHtml = heroTowers
    .map(
      (t, i) => `<tr>
        <td style="${tdStyle}">${i + 1}</td>
        <td style="${tdStyle}"><b>${t.name}</b></td>
        <td style="${tdStyle}">${t.category}</td>
        <td style="${tdStyle}">$${t.cost} • ${t.dps || 'DPS'}</td>
      </tr>`
    )
    .join('');

  const towersHtml = data.placedTowers
    .map(
      (t, i) => `<tr>
        <td style="${tdStyle}">${i + 1}</td>
        <td style="${tdStyle}"><b>${t.towerName}</b></td>
        <td style="${tdStyle}">${t.player}</td>
        <td style="${tdStyle}">Lv.${t.level}</td>
        <td style="${tdStyle}">${t.target}</td>
        <td style="${tdStyle}">${Math.round(t.x)}% / ${Math.round(t.y)}%</td>
      </tr>`
    )
    .join('');

  const freeHtml = (data.freeDocContent || '')
    .split('\n')
    .map(line => `<p style="margin: 6px 0; line-height: 1.6;">${line || '&nbsp;'}</p>`)
    .join('');

  return `
  <div style="font-family: Arial, Helvetica, sans-serif; color: #0f172a; max-width: 800px; padding: 20px;">
    <h1 style="color: #1d4ed8; text-align: center; margin-bottom: 4px; font-size: 26px;">${data.title}</h1>
    <p style="text-align: center; color: #475569; font-size: 14px; margin-top: 0; margin-bottom: 20px;">
      Creators: <b>${data.creators || data.author || 'Ayaka'}</b> • Map: <b>${data.selectedMap.name}</b> • Gamemode: <b>${data.gamemode}</b>
    </p>

    <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 12px 16px; margin-bottom: 20px;">
      <h3 style="margin: 0 0 6px 0; color: #1e3a8a; font-size: 14px;">NOTES:</h3>
      <div style="font-size: 13px; color: #334155; white-space: pre-wrap;">${data.notesTab1 || data.generalNotes || 'No notes provided'}</div>
    </div>

    ${
      data.notesTab2
        ? `<div style="background-color: #f1f5f9; border-left: 4px solid #0284c7; padding: 10px 14px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 4px 0; color: #0369a1; font-size: 13px;">Tactical Notes:</h4>
        <div style="font-size: 12px; color: #334155;">${data.notesTab2}</div>
      </div>`
        : ''
    }

    <h2 style="color: #1e3a8a; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">Hero Grid (Strategy Towers)</h2>
    <table style="${tableStyle}">
      <thead>
        <tr>
          <th style="${thStyle}; width: 8%;">#</th>
          <th style="${thStyle}; width: 42%;">Hero / Tower</th>
          <th style="${thStyle}; width: 25%;">Category</th>
          <th style="${thStyle}; width: 25%;">Stats</th>
        </tr>
      </thead>
      <tbody>
        ${heroHtml || '<tr><td colspan="4" style="' + tdStyle + '">No heroes selected</td></tr>'}
      </tbody>
    </table>

    ${
      data.placedTowers.length > 0
        ? `
    <h2 style="color: #1e3a8a; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">Map Placement (${data.placedTowers.length} towers)</h2>
    <table style="${tableStyle}">
      <thead>
        <tr>
          <th style="${thStyle}; width: 8%;">#</th>
          <th style="${thStyle}; width: 32%;">Tower</th>
          <th style="${thStyle}; width: 15%;">Player</th>
          <th style="${thStyle}; width: 15%;">Level</th>
          <th style="${thStyle}; width: 15%;">Target</th>
          <th style="${thStyle}; width: 15%;">Coordinates</th>
        </tr>
      </thead>
      <tbody>
        ${towersHtml}
      </tbody>
    </table>
    `
        : ''
    }

    <h2 style="color: #1e3a8a; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">Strategy Guide & Instructions</h2>
    <div style="font-size: 14px; color: #1e293b; line-height: 1.6;">
      ${freeHtml || '<p>Step-by-step match walkthrough instructions.</p>'}
    </div>
  </div>
  `;
}

/**
 * Copies formatted HTML directly to user clipboard
 */
export async function copyFormattedGoogleDocToClipboard(data: StrategyDocData): Promise<boolean> {
  const htmlContent = generateGoogleDocHtml(data);
  const plainText = `${data.title}\nCreators: ${data.creators || data.author}\nNOTES:\n${data.notesTab1}\n\nMap: ${data.selectedMap.name}\n\nINSTRUCTIONS:\n${data.freeDocContent}`;

  try {
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
      const blobHtml = new Blob([htmlContent], { type: 'text/html' });
      const blobText = new Blob([plainText], { type: 'text/plain' });
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobText
        })
      ]);
      return true;
    } else {
      await navigator.clipboard.writeText(plainText);
      return true;
    }
  } catch (err) {
    console.error('Clipboard copy error:', err);
    try {
      await navigator.clipboard.writeText(plainText);
      return true;
    } catch (e) {
      return false;
    }
  }
}
