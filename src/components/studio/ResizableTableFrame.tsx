import React, { useRef, useState } from 'react';
import {
  normalizeTableWidth,
  TABLE_WIDTH_MIN_PCT,
  TABLE_WIDTH_MAX_PCT
} from '../../utils/tableWidth';

interface ResizableTableFrameProps {
  /** Stored width as a % of the available content width. Undefined = full width. */
  width: number | undefined;
  /** Called once when a drag / key press settles, with the new width (or undefined to reset to the default). */
  onWidthChange: (pct: number | undefined) => void;
  /** Smallest readable width in px. The frame never renders narrower than this (or than its container). */
  minPx?: number;
  /**
   * Cancel the horizontal padding of the surrounding section (p-3 = 0.75rem) so that 100% means the
   * full page content area rather than the section's padded inner box.
   */
  bleed?: boolean;
  /** Accessible / tooltip texts */
  label: string;
  hint: string;
  children: React.ReactNode;
}

type Side = 'left' | 'right';

/**
 * Wraps one table (and its rounded border) and lets the user resize ONLY that table.
 *
 * - The width is a percentage of the container, so it follows page format, orientation and margins.
 * - It is clamped to [min, 100%], so the table can never leave the page content area.
 * - The table stays centered; both side handles work (dragging one edge by N px changes the width by 2N px).
 * - During a drag the width lives in local state (smooth, no re-render of the whole document and no
 *   localStorage write per mouse move); the value is committed to the document model on release.
 */
export const ResizableTableFrame: React.FC<ResizableTableFrameProps> = ({
  width,
  onWidthChange,
  minPx = 280,
  bleed = false,
  label,
  hint,
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ side: Side; startX: number; startPct: number; rectW: number; minPct: number } | null>(null);
  const [dragPct, setDragPct] = useState<number | null>(null);
  // Always holds the most recent dragged value, so releasing the pointer commits exactly what was last shown.
  const latestPctRef = useRef<number>(TABLE_WIDTH_MAX_PCT);

  const committedPct = normalizeTableWidth(width);
  const shownPct = dragPct ?? committedPct;

  /** Lowest allowed % for the current container (keeps content readable). */
  const getMinPct = (layoutWidth: number) =>
    layoutWidth > 0 ? Math.min(TABLE_WIDTH_MAX_PCT, Math.max(TABLE_WIDTH_MIN_PCT, (minPx / layoutWidth) * 100)) : TABLE_WIDTH_MIN_PCT;

  const clamp = (pct: number, minPct: number) => Math.min(TABLE_WIDTH_MAX_PCT, Math.max(minPct, pct));

  const startDrag = (side: Side) => (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    e.preventDefault();
    e.stopPropagation();
    // rect.width is affected by the page zoom (CSS scale), offsetWidth is not. Pointer deltas are in screen px,
    // so the percentage must be computed against the on-screen (scaled) width.
    const rectW = container.getBoundingClientRect().width;
    dragRef.current = {
      side,
      startX: e.clientX,
      startPct: committedPct,
      rectW,
      minPct: getMinPct(container.offsetWidth)
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    latestPctRef.current = committedPct;
    setDragPct(committedPct);
  };

  const moveDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || d.rectW <= 0) return;
    const dx = (e.clientX - d.startX) * (d.side === 'right' ? 1 : -1);
    // The table is centered, so growing by dx on one edge means growing by 2*dx overall.
    const next = clamp(d.startPct + ((dx * 2) / d.rectW) * 100, d.minPct);
    latestPctRef.current = next;
    setDragPct(next);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    dragRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    const final = latestPctRef.current;
    setDragPct(null);
    if (Math.abs(final - committedPct) >= 0.05) {
      onWidthChange(normalizeTableWidth(final));
    }
  };

  const cancelDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragPct(null);
  };

  const onKeyDown = (side: Side) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const minPct = getMinPct(container?.offsetWidth ?? 0);
    const step = e.shiftKey ? 10 : 2;
    // Arrow pointing away from the table center widens it, towards the center narrows it.
    const outward = side === 'right' ? 'ArrowRight' : 'ArrowLeft';
    const inward = side === 'right' ? 'ArrowLeft' : 'ArrowRight';
    let next: number | null = null;
    if (e.key === outward || e.key === 'ArrowUp') next = committedPct + step;
    else if (e.key === inward || e.key === 'ArrowDown') next = committedPct - step;
    else if (e.key === 'Home') next = minPct;
    else if (e.key === 'End') next = TABLE_WIDTH_MAX_PCT;
    else if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      onWidthChange(undefined);
      return;
    }
    if (next === null) return;
    e.preventDefault();
    onWidthChange(normalizeTableWidth(clamp(next, minPct)));
  };

  const resetWidth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onWidthChange(undefined);
  };

  const dragging = dragPct !== null;

  const renderHandle = (side: Side) => (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuemin={TABLE_WIDTH_MIN_PCT}
      aria-valuemax={TABLE_WIDTH_MAX_PCT}
      aria-valuenow={Math.round(shownPct)}
      tabIndex={0}
      title={hint}
      onPointerDown={startDrag(side)}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={cancelDrag}
      onDoubleClick={resetWidth}
      onKeyDown={onKeyDown(side)}
      style={{ touchAction: 'none' }}
      className={`tds-table-handle print:hidden absolute top-0 bottom-0 z-30 w-4 flex items-center justify-center cursor-ew-resize select-none outline-none transition-opacity ${
        side === 'right' ? '-right-2' : '-left-2'
      } ${
        dragging
          ? 'opacity-100'
          : 'opacity-0 group-hover/tbl:opacity-100 focus-visible:opacity-100 [@media(pointer:coarse)]:opacity-100'
      }`}
    >
      <span
        className={`block w-1.5 h-12 max-h-[60%] rounded-full border shadow transition-colors ${
          dragging
            ? 'bg-purple-400 border-purple-200'
            : 'bg-neutral-500 border-neutral-300/40 hover:bg-purple-400 hover:border-purple-200'
        }`}
      />
    </div>
  );

  return (
    <div ref={containerRef} className={bleed ? '-mx-3' : 'w-full'}>
      <div
        className="tds-table-frame group/tbl relative mx-auto max-w-full"
        style={{
          width: `${shownPct}%`,
          minWidth: `min(100%, ${minPx}px)`
        }}
        data-table-width={shownPct}
      >
        {children}
        {renderHandle('left')}
        {renderHandle('right')}

        {dragging && (
          <div className="print:hidden absolute -top-7 left-1/2 -translate-x-1/2 z-40 px-2 py-0.5 rounded-md bg-neutral-900 border border-purple-400/60 text-[10px] font-mono font-bold text-purple-200 shadow pointer-events-none">
            {Math.round(shownPct)}%
          </div>
        )}
      </div>
    </div>
  );
};
