import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PlacedMapToken } from '../../types/customDoc';
import { isMapAssetUrl } from '../../data/tdsPhotoAssets';
import {
  Upload,
  Trash2,
  X,
  Eye,
  EyeOff,
  MapPin,
  ImageOff,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Hand,
  Maximize2,
  Minimize2,
  Copy,
  Minus,
  Plus
} from 'lucide-react';
import { translations, Language } from '../../i18n/translations';

interface PhotoMapCanvasProps {
  photoUrl: string;
  tokens: PlacedMapToken[];
  onChangePhoto: (newUrl: string) => void;
  /** Removes the map photo of THIS player only (other variants keep theirs). */
  onRemovePhoto?: () => void;
  onChangeTokens: (newTokens: PlacedMapToken[]) => void;
  /** Tower currently selected in the left panel (never a map). */
  selectedAssetUrl?: string;
  selectedAssetName?: string;
  defaultColor?: string;
  /** width / height of the map image. When set, the whole image is shown (no cropping or stretching). */
  aspectRatio?: number;
  lang: Language;
}

/** Outline colours (taken from the reference placement map). */
const PLACEMENT_COLORS = [
  '#f5c518', // yellow
  '#3b82f6', // blue
  '#22c55e', // green
  '#d946ef', // magenta
  '#14b8a6', // teal
  '#f97316', // orange
  '#ef4444', // red
  '#ffffff' // white
];

/** Default marker diameter as a fraction of the map width, and a minimum so it never gets tiny. */
const BASE_DIAMETER_FRACTION = 0.05;
const MIN_DIAMETER_PX = 26;
const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const DRAG_THRESHOLD_PX = 4;
const FALLBACK_ASPECT = 1.6;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

interface View {
  z: number;
  x: number;
  y: number;
}

interface Geometry {
  vw: number;
  vh: number;
  sw: number;
  sh: number;
  ox: number;
  oy: number;
}

const clampAxis = (pan: number, offset: number, size: number, viewport: number, z: number) => {
  const content = size * z;
  if (content <= viewport + 0.5) return (viewport - content) / 2 - offset;
  return Math.min(-offset, Math.max(viewport - offset - content, pan));
};

const clampView = (v: View, g: Geometry): View => ({
  z: v.z,
  x: clampAxis(v.x, g.ox, g.sw, g.vw, v.z),
  y: clampAxis(v.y, g.oy, g.sh, g.vh, v.z)
});

type DragState =
  | {
      kind: 'token';
      id: string;
      pointerId: number;
      startX: number;
      startY: number;
      origX: number;
      origY: number;
      /** Latest dragged position. Kept on the ref (not only in state) so the drop never reads a stale render. */
      curX: number;
      curY: number;
      moved: boolean;
    }
  | {
      kind: 'empty';
      pointerId: number;
      startX: number;
      startY: number;
      panX: number;
      panY: number;
      canPan: boolean;
      forcePan: boolean;
      moved: boolean;
    };

export const PhotoMapCanvas: React.FC<PhotoMapCanvasProps> = ({
  photoUrl,
  tokens,
  onChangePhoto,
  onRemovePhoto,
  onChangeTokens,
  selectedAssetUrl,
  selectedAssetName,
  aspectRatio,
  lang
}) => {
  const t = translations[lang].studio;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);

  const [vpEl, setVpEl] = useState<HTMLDivElement | null>(null);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const [view, setView] = useState<View>({ z: 1, x: 0, y: 0 });
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ id: string; x: number; y: number } | null>(null);
  const [panning, setPanning] = useState(false);
  const [handTool, setHandTool] = useState(false);
  const [spaceDown, setSpaceDown] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [tokensEnabled, setTokensEnabled] = useState(true);
  const [tokensVisible, setTokensVisible] = useState(true);
  const [naturalAr, setNaturalAr] = useState<{ url: string; ar: number } | null>(null);

  // The last colour / size the user picked are reused for the next placed tower.
  const lastColorRef = useRef<string>(PLACEMENT_COLORS[0]);
  const lastSizeRef = useRef<number>(1);

  // A map must never be used as a tower image.
  const towerUrl = selectedAssetUrl && !isMapAssetUrl(selectedAssetUrl) ? selectedAssetUrl : undefined;

  const ar =
    aspectRatio ?? (naturalAr && naturalAr.url === photoUrl ? naturalAr.ar : undefined) ?? FALLBACK_ASPECT;

  // ---------- geometry ----------
  const fitW = Math.min(vp.w, vp.h * ar);
  const geom: Geometry = {
    vw: vp.w,
    vh: vp.h,
    sw: fitW,
    sh: fitW / ar,
    ox: (vp.w - fitW) / 2,
    oy: (vp.h - fitW / ar) / 2
  };
  const geomRef = useRef(geom);
  geomRef.current = geom;

  useLayoutEffect(() => {
    if (!vpEl) return;
    const measure = () => setVp({ w: vpEl.clientWidth, h: vpEl.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(vpEl);
    return () => ro.disconnect();
  }, [vpEl]);

  // A different map was chosen (e.g. from the sidebar while this editor is zoomed or expanded):
  // show the new map fitted instead of keeping a zoom/pan that belonged to the previous image.
  useEffect(() => {
    setView({ z: 1, x: 0, y: 0 });
    setDragPos(null);
    dragRef.current = null;
    setPanning(false);
  }, [photoUrl]);

  // Keep pan inside the map whenever the viewport, aspect ratio or zoom changes.
  useEffect(() => {
    if (vp.w === 0) return;
    setView(v => {
      const next = clampView(v, geomRef.current);
      return next.x === v.x && next.y === v.y ? v : next;
    });
  }, [vp.w, vp.h, ar]);

  const diameter = Math.max(MIN_DIAMETER_PX, geom.sw * BASE_DIAMETER_FRACTION);

  // ---------- zoom ----------
  const zoomAt = useCallback(
    (factor: number, clientX?: number, clientY?: number) => {
      const el = vpEl;
      if (!el) return;
      const g = geomRef.current;
      if (g.vw === 0) return;
      const rect = el.getBoundingClientRect();
      const k = rect.width / g.vw || 1; // page itself may be CSS-scaled
      const px = clientX === undefined ? g.vw / 2 : (clientX - rect.left) / k;
      const py = clientY === undefined ? g.vh / 2 : (clientY - rect.top) / k;
      setView(v => {
        const nz = clamp(v.z * factor, MIN_ZOOM, MAX_ZOOM);
        const qx = (px - g.ox - v.x) / v.z;
        const qy = (py - g.oy - v.y) / v.z;
        return clampView({ z: nz, x: px - g.ox - qx * nz, y: py - g.oy - qy * nz }, g);
      });
    },
    [vpEl]
  );

  const resetView = () => setView(clampView({ z: 1, x: 0, y: 0 }, geomRef.current));

  // Ctrl/Cmd + wheel (or pinch) zooms; in the expanded editor the plain wheel zooms too.
  useEffect(() => {
    if (!vpEl) return;
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey || expanded)) return;
      e.preventDefault();
      // Small deltas = trackpad pinch (fine steps); large deltas = mouse-wheel notches (gentler steps).
      const dy = clamp(e.deltaY, -120, 120);
      const factor = Math.exp(-dy * (Math.abs(dy) < 50 ? 0.01 : 0.0025));
      zoomAt(factor, e.clientX, e.clientY);
    };
    vpEl.addEventListener('wheel', onWheel, { passive: false });
    return () => vpEl.removeEventListener('wheel', onWheel);
  }, [vpEl, expanded, zoomAt]);

  // ---------- token helpers ----------
  const selectedToken = tokens.find(tok => tok.id === selectedTokenId) || null;

  const updateToken = (id: string, patch: Partial<PlacedMapToken>) => {
    onChangeTokens(tokens.map(tok => (tok.id === id ? { ...tok, ...patch } : tok)));
  };

  const removeToken = (id: string) => {
    onChangeTokens(tokens.filter(tok => tok.id !== id));
    if (selectedTokenId === id) setSelectedTokenId(null);
  };

  const duplicateToken = (tok: PlacedMapToken) => {
    const copy: PlacedMapToken = {
      ...tok,
      id: `tok-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      x: clamp(tok.x + 2, 0, 100),
      y: clamp(tok.y + 2, 0, 100)
    };
    onChangeTokens([...tokens, copy]);
    setSelectedTokenId(copy.id);
  };

  const pointToPercent = (clientX: number, clientY: number) => {
    const stage = stageRef.current;
    if (!stage) return null;
    const r = stage.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return null;
    return {
      x: clamp(((clientX - r.left) / r.width) * 100, 0, 100),
      y: clamp(((clientY - r.top) / r.height) * 100, 0, 100)
    };
  };

  const placeToken = (clientX: number, clientY: number) => {
    const pos = pointToPercent(clientX, clientY);
    if (!pos) return;
    if (!towerUrl) {
      setSelectedTokenId(null);
      return;
    }
    const size = lastSizeRef.current;
    const newToken: PlacedMapToken = {
      id: `tok-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      x: pos.x,
      y: pos.y,
      label: selectedAssetName ? selectedAssetName.slice(0, 4) : `${tokens.length + 1}`,
      towerName: selectedAssetName || `Tower ${tokens.length + 1}`,
      towerImage: towerUrl,
      color: lastColorRef.current,
      ...(size !== 1 ? { size } : {})
    };
    setTokensVisible(true);
    onChangeTokens([...tokens, newToken]);
    setSelectedTokenId(newToken.id);
  };

  // ---------- pointer interaction ----------
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.button !== 1) return;
    if (!tokensEnabled && e.button === 0 && view.z === 1 && !handTool && !spaceDown) return;
    vpEl?.focus({ preventScroll: true });

    const forcePan = e.button === 1 || spaceDown || handTool;
    const tokenEl = (e.target as HTMLElement).closest('[data-token-id]') as HTMLElement | null;
    if (e.button === 1) e.preventDefault();

    if (tokenEl && !forcePan && tokensEnabled && tokensVisible) {
      const id = tokenEl.dataset.tokenId as string;
      const tok = tokens.find(x => x.id === id);
      if (!tok) return;
      setSelectedTokenId(id);
      dragRef.current = {
        kind: 'token',
        id,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        origX: tok.x,
        origY: tok.y,
        curX: tok.x,
        curY: tok.y,
        moved: false
      };
    } else {
      dragRef.current = {
        kind: 'empty',
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        panX: view.x,
        panY: view.y,
        canPan: forcePan || view.z > 1,
        forcePan,
        moved: false
      };
    }
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
      d.moved = true;
      if (d.kind === 'empty' && d.canPan) setPanning(true);
    }
    if (d.kind === 'token') {
      const stage = stageRef.current;
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      d.curX = clamp(d.origX + (dx / r.width) * 100, 0, 100);
      d.curY = clamp(d.origY + (dy / r.height) * 100, 0, 100);
      setDragPos({ id: d.id, x: d.curX, y: d.curY });
    } else if (d.canPan && vpEl) {
      const k = vpEl.getBoundingClientRect().width / (geomRef.current.vw || 1) || 1;
      setView(v => clampView({ z: v.z, x: d.panX + dx / k, y: d.panY + dy / k }, geomRef.current));
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    dragRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setPanning(false);

    if (d.kind === 'token') {
      if (!cancelled && d.moved) {
        updateToken(d.id, { x: d.curX, y: d.curY });
      }
      setDragPos(null);
      return;
    }
    // Click on empty map (no drag): place a tower, or just clear the selection.
    if (!cancelled && !d.moved && !d.forcePan && e.button === 0 && tokensEnabled) {
      placeToken(e.clientX, e.clientY);
    }
  };

  // ---------- keyboard ----------
  const handleEscape = () => {
    if (dragRef.current) {
      dragRef.current = null;
      setDragPos(null);
      setPanning(false);
      return;
    }
    if (selectedTokenId) {
      setSelectedTokenId(null);
      return;
    }
    if (expanded) setExpanded(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ') {
      e.preventDefault();
      setSpaceDown(true);
      return;
    }
    if (e.key === 'Escape') {
      if (!expanded) handleEscape(); // expanded: handled by the window listener
      return;
    }
    if (e.key === '+' || e.key === '=') return zoomAt(1.25);
    if (e.key === '-') return zoomAt(1 / 1.25);
    if (e.key === '0') return resetView();
    if (!selectedToken) return;
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      removeToken(selectedToken.id);
      return;
    }
    const step = e.shiftKey ? 1 : 0.1;
    const nudge: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step]
    };
    const n = nudge[e.key];
    if (n) {
      e.preventDefault();
      updateToken(selectedToken.id, {
        x: clamp(selectedToken.x + n[0], 0, 100),
        y: clamp(selectedToken.y + n[1], 0, 100)
      });
    }
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ') setSpaceDown(false);
  };

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Escape inside a text field of the (still usable) sidebar must not close the expanded map.
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      handleEscape();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, selectedTokenId]);

  // ---------- photo ----------
  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      if (result) onChangePhoto(result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ---------- rendering ----------
  const btn =
    'px-2.5 py-1 rounded-lg border text-[11px] font-mono flex items-center gap-1.5 transition-colors bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border-neutral-700';
  const iconBtn =
    'p-1.5 rounded-lg border bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-700 transition-colors disabled:opacity-40 disabled:pointer-events-none';

  const toolbar = (
    <div className="placement-ui flex flex-wrap items-center justify-between gap-2 px-2.5 py-2 bg-neutral-950 border-b border-neutral-800">
      <div className="flex flex-wrap items-center gap-1.5">
        <button type="button" onClick={() => fileInputRef.current?.click()} className={btn} title={t.mapUploadBtn}>
          <Upload className="w-3 h-3" />
          <span>{t.mapUploadBtn}</span>
        </button>
        {photoUrl && onRemovePhoto && (
          <button type="button" onClick={onRemovePhoto} className={btn} title={t.removeMapPhoto}>
            <ImageOff className="w-3 h-3" />
            <span>{t.removeMapPhoto}</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            const next = !tokensEnabled;
            setTokensEnabled(next);
            setTokensVisible(next);
            if (!next) setSelectedTokenId(null);
          }}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono flex items-center gap-1.5 transition-colors ${
            tokensEnabled
              ? 'bg-neutral-800 text-white border-neutral-600'
              : 'bg-white text-black border-white font-bold'
          }`}
          title={tokensEnabled ? t.markersOn : t.cleanPhoto}
        >
          {tokensEnabled ? <MapPin className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          <span>{tokensEnabled ? t.markersOn : t.cleanPhoto}</span>
        </button>
        {tokens.length > 0 && tokensEnabled && (
          <button
            type="button"
            onClick={() => setTokensVisible(v => !v)}
            className={iconBtn}
            title={tokensVisible ? t.hideMarkers : t.showMarkers}
          >
            {tokensVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        )}
        {tokens.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(t.clearAllConfirm)) {
                onChangeTokens([]);
                setSelectedTokenId(null);
              }
            }}
            className={`${iconBtn} hover:!text-red-400`}
            title={t.clearAllMarkers}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setHandTool(h => !h)}
          className={`${iconBtn} ${handTool ? '!bg-white !text-black !border-white' : ''}`}
          title={t.panTool}
          aria-pressed={handTool}
        >
          <Hand className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => zoomAt(1 / 1.25)} className={iconBtn} title={t.zoomOut} disabled={view.z <= MIN_ZOOM}>
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="w-11 text-center text-[11px] font-mono text-neutral-300 select-none">
          {Math.round(view.z * 100)}%
        </span>
        <button type="button" onClick={() => zoomAt(1.25)} className={iconBtn} title={t.zoomIn} disabled={view.z >= MAX_ZOOM}>
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={resetView} className={iconBtn} title={t.resetView}>
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className={iconBtn}
          title={expanded ? t.collapseEditor : t.expandEditor}
        >
          {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );

  const renderToken = (token: PlacedMapToken, index: number) => {
    const isSelected = selectedTokenId === token.id;
    const pos = dragPos && dragPos.id === token.id ? dragPos : token;
    const color = token.color || '#ffffff';
    const d = diameter * (token.size ?? 1);
    const border = Math.max(2, d * 0.07);
    const isDragging = dragPos?.id === token.id;
    return (
      <div
        key={token.id}
        data-token-id={token.id}
        style={{
          position: 'absolute',
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          width: d,
          height: d,
          transform: 'translate(-50%, -50%)',
          borderRadius: '9999px',
          zIndex: isSelected ? 40 : 10 + index,
          touchAction: 'none',
          cursor: handTool || spaceDown ? 'grab' : isDragging ? 'grabbing' : 'grab'
        }}
      >
        {/* Placement circle: coloured outline + light tint, with a hairline dark casing for contrast */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '9999px',
            border: `${border}px solid ${color}`,
            backgroundColor: `${color.length === 7 ? color : '#ffffff'}2e`,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(0,0,0,0.4)',
            pointerEvents: 'none'
          }}
        />
        {token.towerImage ? (
          <img
            src={token.towerImage}
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              inset: border + d * 0.03,
              width: `calc(100% - ${2 * (border + d * 0.03)}px)`,
              height: `calc(100% - ${2 * (border + d * 0.03)}px)`,
              objectFit: 'contain',
              pointerEvents: 'none',
              userSelect: 'none'
            }}
          />
        ) : (
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
              fontWeight: 700,
              fontSize: d * 0.34,
              pointerEvents: 'none'
            }}
          >
            {token.label}
          </span>
        )}
        {/* Selection ring: editor-only, hidden when printing */}
        {isSelected && (
          <div
            className="placement-ui"
            style={{
              position: 'absolute',
              inset: -Math.max(4, d * 0.12),
              borderRadius: '9999px',
              border: '2px dashed #ffffff',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.7)',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>
    );
  };

  const cursor = panning
    ? 'grabbing'
    : handTool || spaceDown
    ? 'grab'
    : view.z > 1
    ? 'grab'
    : tokensEnabled && towerUrl
    ? 'crosshair'
    : 'default';

  const viewport = (
    <div
      ref={setVpEl}
      tabIndex={0}
      role="application"
      aria-label="Placement map editor"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={e => endDrag(e, false)}
      onPointerCancel={e => endDrag(e, true)}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onBlur={() => setSpaceDown(false)}
      onDragStart={e => e.preventDefault()}
      onContextMenu={e => {
        if (panning) e.preventDefault();
      }}
      className={`placement-viewport relative w-full overflow-hidden select-none bg-neutral-950 outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
        expanded ? 'flex-1 min-h-0' : ''
      }`}
      style={{
        ...(expanded ? {} : { aspectRatio: String(ar) }),
        cursor,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: view.z > 1 || expanded || handTool ? 'none' : 'pan-y'
      }}
    >
      {vp.w > 0 && (
        <div
          ref={stageRef}
          className="placement-stage absolute"
          style={{
            left: geom.ox,
            top: geom.oy,
            width: geom.sw,
            height: geom.sh,
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.z})`,
            transformOrigin: '0 0',
            willChange: panning || dragPos ? 'transform' : undefined
          }}
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Placement Map"
              draggable={false}
              onLoad={e => {
                const img = e.currentTarget;
                if (img.naturalWidth && img.naturalHeight) {
                  setNaturalAr({ url: photoUrl, ar: img.naturalWidth / img.naturalHeight });
                }
              }}
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
              style={{ objectFit: 'fill' }}
            />
          ) : (
            <div className="placement-ui absolute inset-0 flex flex-col items-center justify-center text-center space-y-2.5 pointer-events-none">
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-neutral-500" />
              </div>
              <span className="text-xs font-mono text-neutral-500 px-4">{t.mapEmptyHint}</span>
            </div>
          )}

          {tokensEnabled && tokensVisible && tokens.map(renderToken)}
        </div>
      )}
    </div>
  );

  const statusBar = (
    <div className="placement-ui px-2.5 py-2 bg-neutral-900 border-t border-neutral-800 text-xs min-h-[3rem] flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      {selectedToken && tokensEnabled ? (
        <>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-2 min-w-0">
              {selectedToken.towerImage && (
                <img src={selectedToken.towerImage} alt="" className="w-7 h-7 object-contain shrink-0" draggable={false} />
              )}
              <span className="font-mono font-bold text-white truncate max-w-[10rem]">
                {selectedToken.towerName || selectedToken.label}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-neutral-400">{t.markerOutlineLabel}</span>
              {PLACEMENT_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    lastColorRef.current = c;
                    updateToken(selectedToken.id, { color: c });
                  }}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${
                    (selectedToken.color || '#ffffff').toLowerCase() === c ? 'border-white scale-110' : 'border-neutral-700 hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                  aria-label={`${t.markerOutlineLabel} ${c}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono text-neutral-400">{t.markerSizeLabel}</span>
              <button
                type="button"
                className={iconBtn}
                onClick={() => {
                  const s = clamp(Math.round(((selectedToken.size ?? 1) - 0.1) * 10) / 10, 0.5, 3);
                  lastSizeRef.current = s;
                  updateToken(selectedToken.id, { size: s });
                }}
              >
                <Minus className="w-3 h-3" />
              </button>
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.1}
                value={selectedToken.size ?? 1}
                onChange={e => {
                  const s = Number(e.target.value);
                  lastSizeRef.current = s;
                  updateToken(selectedToken.id, { size: s });
                }}
                className="w-24 accent-white"
              />
              <button
                type="button"
                className={iconBtn}
                onClick={() => {
                  const s = clamp(Math.round(((selectedToken.size ?? 1) + 0.1) * 10) / 10, 0.5, 3);
                  lastSizeRef.current = s;
                  updateToken(selectedToken.id, { size: s });
                }}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => duplicateToken(selectedToken)} className={btn} title={t.duplicateMarker}>
              <Copy className="w-3 h-3" />
              <span>{t.duplicateMarker}</span>
            </button>
            <button
              type="button"
              onClick={() => removeToken(selectedToken.id)}
              className={`${btn} hover:!text-red-400`}
              title={t.deleteMarker}
            >
              <Trash2 className="w-3 h-3" />
              <span>{t.deleteMarker}</span>
            </button>
            <button type="button" onClick={() => setSelectedTokenId(null)} className={iconBtn} title={t.deselectMarker}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      ) : (
        <span className="font-mono text-neutral-400">
          {!tokensEnabled || !tokensVisible
            ? t.placeHintHidden
            : towerUrl
            ? `${t.placeHintReady}: ${selectedAssetName ?? ''}`
            : t.placeHintNoTower}
        </span>
      )}
    </div>
  );

  const editor = (
    <div
      className={`relative border-neutral-700 bg-neutral-950 ${
        expanded
          ? 'w-full h-full min-w-0 max-w-[1800px] flex flex-col rounded-2xl border-2 overflow-hidden shadow-2xl'
          : 'rounded-2xl overflow-hidden border-2 shadow-2xl'
      }`}
    >
      {toolbar}
      {viewport}
      {statusBar}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadPhoto} />
    </div>
  );

  if (expanded) {
    // The expanded editor is a fixed layer that stops at the left sidebar (see .placement-expanded-layer
    // in index.css), so the sidebar stays visible and usable: another map or tower can be picked
    // without closing the editor. It is portaled to <body> because the page sheet it normally lives in
    // is CSS-scaled/clipped, which would break position: fixed.
    return createPortal(
      <div className="placement-ui placement-expanded-layer rounded-3xl bg-black/85 backdrop-blur-sm flex items-stretch justify-center p-2 sm:p-3">
        {editor}
      </div>,
      document.body
    );
  }
  return editor;
};
