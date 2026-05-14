"use client";

/** Reusable bottom-sheet primitive used for informational and confirmation overlays. */

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

const TRANSITION_MS = 320;

type BottomSheetContextValue = {
  titleId: string;
  requestClose: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

/** Use on the sheet title element (`<h2 id={...}>`) for dialog accessibility. */
export function useBottomSheetTitleId(): string {
  const ctx = useContext(BottomSheetContext);
  if (!ctx) {
    throw new Error("useBottomSheetTitleId must be used inside BottomSheet");
  }
  return ctx.titleId;
}

export function useBottomSheetRequestClose(): () => void {
  const ctx = useContext(BottomSheetContext);
  if (!ctx) {
    throw new Error(
      "useBottomSheetRequestClose must be used inside BottomSheet",
    );
  }
  return ctx.requestClose;
}

export type BottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  /** Optional id of the title node; if omitted, an id is generated and exposed via context. */
  titleId?: string;
  /** Optional description id for `aria-describedby` on the dialog. */
  descriptionId?: string;
  /** Extra classes on the sliding panel (rounded top, padding, etc. are defaults). */
  panelClassName?: string;
};

/**
 * Reusable bottom sheet: dimmed backdrop, slide-up panel (translate + opacity),
 * swipe-down on the grab handle, tap outside and Escape to dismiss.
 * Renders in a portal with body scroll lock.
 */
export function BottomSheet({
  open,
  onOpenChange,
  children,
  titleId: titleIdProp,
  descriptionId,
  panelClassName = "",
}: BottomSheetProps) {
  const autoTitleId = useId();
  const titleId = titleIdProp ?? autoTitleId;
  const [shouldRender, setShouldRender] = useState(false);
  const [entered, setEntered] = useState(false);

  const requestClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (open) {
      startTransition(() => {
        setShouldRender(true);
      });
      const t = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          startTransition(() => setEntered(true));
        });
      });
      return () => cancelAnimationFrame(t);
    }
    startTransition(() => setEntered(false));
    const clear = window.setTimeout(() => {
      startTransition(() => setShouldRender(false));
    }, TRANSITION_MS);
    return () => window.clearTimeout(clear);
  }, [open]);

  useEffect(() => {
    if (!shouldRender) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [shouldRender]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, requestClose]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  const onBackdropPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) requestClose();
    },
    [requestClose],
  );

  if (!mounted || !shouldRender) return null;

  const ctx: BottomSheetContextValue = {
    titleId,
    requestClose,
  };

  return createPortal(
    <BottomSheetContext.Provider value={ctx}>
      <div
        className="fixed inset-0 z-[100] flex flex-col justify-end"
        role="presentation"
      >
        <div
          className={`absolute inset-0 bg-black/45 transition-opacity ease-out ${
            entered ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDuration: `${TRANSITION_MS}ms` }}
          onPointerDown={onBackdropPointerDown}
          aria-hidden
        />
        <div className="relative z-[1] flex w-full justify-center px-0">
          <BottomSheetPanel
            entered={entered}
            titleId={titleId}
            descriptionId={descriptionId}
            panelClassName={panelClassName}
            onRequestClose={requestClose}
          >
            {children}
          </BottomSheetPanel>
        </div>
      </div>
    </BottomSheetContext.Provider>,
    document.body,
  );
}

type PanelProps = {
  entered: boolean;
  titleId: string;
  descriptionId?: string;
  panelClassName: string;
  onRequestClose: () => void;
  children: ReactNode;
};

function BottomSheetPanel({
  entered,
  titleId,
  descriptionId,
  panelClassName,
  onRequestClose,
  children,
}: PanelProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const [dragArmed, setDragArmed] = useState(false);
  const dragArmedRef = useRef(false);
  const dragOffsetRef = useRef(0);
  const dragStartY = useRef<number | null>(null);

  const onHandlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartY.current = e.clientY;
    dragOffsetRef.current = 0;
    dragArmedRef.current = true;
    setDragArmed(true);
    setDragOffset(0);
  };

  const onHandlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragArmedRef.current || dragStartY.current === null) return;
    const dy = e.clientY - dragStartY.current;
    if (dy > 0) {
      dragOffsetRef.current = dy;
      setDragOffset(dy);
    }
  };

  const endDrag = () => {
    if (dragArmedRef.current && dragOffsetRef.current > 72) onRequestClose();
    dragOffsetRef.current = 0;
    dragArmedRef.current = false;
    setDragOffset(0);
    dragStartY.current = null;
    setDragArmed(false);
  };

  const draggingActive = dragArmed && dragOffset > 0;

  const sheetTransform = draggingActive
    ? `translateY(${dragOffset}px)`
    : entered
      ? "translateY(0)"
      : "translateY(100%)";

  const sheetOpacity = draggingActive
    ? Math.max(0.45, 1 - dragOffset / 220)
    : entered
      ? 1
      : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={`w-full max-w-[420px] rounded-t-[32px] bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.12)] ${panelClassName}`.trim()}
      style={{
        transform: sheetTransform,
        opacity: sheetOpacity,
        transitionProperty: dragArmed ? "none" : "transform, opacity",
        transitionDuration: `${TRANSITION_MS}ms`,
        transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
      }}
    >
      <div
        className="flex cursor-grab touch-none justify-center pt-3 pb-1 active:cursor-grabbing"
        onPointerDown={onHandlePointerDown}
        onPointerMove={onHandlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="h-1 w-10 shrink-0 rounded-full bg-neutral-300"
          aria-hidden
        />
      </div>
      {children}
    </div>
  );
}
