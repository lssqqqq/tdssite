import { saveAs } from 'file-saver';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType
} from 'docx';
import { DocumentMetadata } from '../types/editor';

/**
 * Exports current A4 document to Microsoft Word .docx format with exact A4 page dimensions
 * and standard 1-inch (1440 dxa / 25.4 mm) margins for Google Docs and Word compatibility.
 */
export async function exportEditorToDocx(
  metadata: DocumentMetadata,
  htmlOrText: string
): Promise<void> {
  // Convert basic HTML tags or plain text into docx Paragraphs and Tables
  const paragraphs: (Paragraph | Table)[] = [];

  // Document Title
  paragraphs.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: metadata.title || 'TDS Strategy Document',
          bold: true,
          size: 36,
          color: '15803D' // Green Accent
        })
      ]
    })
  );

  // Subtitle / Meta
  paragraphs.push(
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: `Author: ${metadata.author || 'TDS Community'}  |  Gamemode: ${metadata.gamemode || 'Hardcore'}  |  Theme: ${metadata.theme === 'dark' ? 'Dark Page' : 'Light Page'}`,
          italics: true,
          size: 20,
          color: '64748B'
        })
      ]
    })
  );

  // Divider Table
  paragraphs.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: {
                bottom: { style: BorderStyle.SINGLE, size: 12, color: '8B5CF6' },
                top: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE }
              },
              children: [new Paragraph({ children: [] })]
            })
          ]
        })
      ]
    })
  );

  // Parse lines / tags from HTML or text
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlOrText;

  const childNodes = Array.from(tempDiv.children);

  if (childNodes.length === 0) {
    // Plain text fallback
    const lines = tempDiv.textContent?.split('\n') || [];
    lines.forEach(line => {
      if (line.trim()) {
        paragraphs.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [new TextRun({ text: line.trim(), size: 22 })]
          })
        );
      }
    });
  } else {
    childNodes.forEach(node => {
      const tag = node.tagName.toLowerCase();
      const text = node.textContent?.trim() || '';

      if (tag === 'h1') {
        paragraphs.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text,
                bold: true,
                size: 32,
                color: '15803D'
              })
            ]
          })
        );
      } else if (tag === 'h2') {
        paragraphs.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text,
                bold: true,
                size: 26,
                color: '7C3AED'
              })
            ]
          })
        );
      } else if (tag === 'h3') {
        paragraphs.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 160, after: 80 },
            children: [
              new TextRun({
                text,
                bold: true,
                size: 24,
                color: '334155'
              })
            ]
          })
        );
      } else if (tag === 'table') {
        // Table parsing
        const rows = Array.from(node.querySelectorAll('tr'));
        const docxRows: TableRow[] = [];

        rows.forEach(tr => {
          const cells = Array.from(tr.querySelectorAll('th, td'));
          const docxCells = cells.map(cell => {
            const isTh = cell.tagName.toLowerCase() === 'th';
            return new TableCell({
              shading: isTh
                ? { type: ShadingType.CLEAR, fill: 'F1F5F9' }
                : undefined,
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
                left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
                right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' }
              },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cell.textContent?.trim() || '',
                      bold: isTh,
                      size: isTh ? 20 : 19
                    })
                  ]
                })
              ]
            });
          });

          if (docxCells.length > 0) {
            docxRows.push(new TableRow({ children: docxCells }));
          }
        });

        if (docxRows.length > 0) {
          paragraphs.push(
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: docxRows
            })
          );
        }
      } else if (tag === 'ul' || tag === 'ol') {
        const lis = Array.from(node.querySelectorAll('li'));
        lis.forEach((li, idx) => {
          paragraphs.push(
            new Paragraph({
              bullet: tag === 'ul' ? { level: 0 } : undefined,
              spacing: { after: 60 },
              children: [
                new TextRun({
                  text: tag === 'ol' ? `${idx + 1}. ${li.textContent?.trim()}` : li.textContent?.trim() || '',
                  size: 22
                })
              ]
            })
          );
        });
      } else if (tag === 'blockquote') {
        paragraphs.push(
          new Paragraph({
            spacing: { before: 120, after: 120 },
            children: [
              new TextRun({
                text: `"${text}"`,
                italics: true,
                color: '6B21A8',
                size: 21
              })
            ]
          })
        );
      } else {
        if (text) {
          paragraphs.push(
            new Paragraph({
              spacing: { after: 100 },
              children: [new TextRun({ text, size: 22 })]
            })
          );
        }
      }
    });
  }

  // A4 size in DXA: width 11906 dxa (210mm), height 16838 dxa (297mm)
  // Margin: 1440 dxa (25.4mm / 1 inch)
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906,
              height: 16838
            },
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children: paragraphs
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `${(metadata.title || 'TDS_Strategy').replace(/\s+/g, '_')}.docx`;
  saveAs(blob, fileName);
}
