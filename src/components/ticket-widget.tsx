"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitTicket } from "@/app/(actions)/tickets";

type Phase = "idle" | "picking" | "composing" | "submitting" | "done";

type Captured = {
  selector: string;
  html: string;
};

const HIGHLIGHT_STYLE = "outline: 2px solid #f59e0b; outline-offset: 2px; cursor: crosshair !important;";

function buildSelector(el: Element): string {
  if (el.id) return `#${el.id}`;
  const path: string[] = [];
  let cur: Element | null = el;
  let depth = 0;
  while (cur && cur.nodeType === 1 && depth < 6) {
    let part = cur.tagName.toLowerCase();
    if (cur.classList.length > 0) {
      const cls = Array.from(cur.classList)
        .filter((c) => !c.startsWith("hover:") && !c.startsWith("focus:") && c.length < 30)
        .slice(0, 2)
        .map((c) => `.${CSS.escape(c)}`)
        .join("");
      part += cls;
    }
    const parent = cur.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter((s) => s.tagName === cur!.tagName);
      if (siblings.length > 1) {
        const idx = siblings.indexOf(cur) + 1;
        part += `:nth-of-type(${idx})`;
      }
    }
    path.unshift(part);
    cur = cur.parentElement;
    depth++;
  }
  return path.join(" > ");
}

export function TicketWidget() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [captured, setCaptured] = useState<Captured | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const lastHighlight = useRef<HTMLElement | null>(null);

  const isInside = useCallback((el: Element | null) => {
    while (el) {
      if (el instanceof HTMLElement && el.dataset.ticketWidget === "1") return true;
      el = el.parentElement;
    }
    return false;
  }, []);

  useEffect(() => {
    if (phase !== "picking") return;

    function clearHighlight() {
      if (lastHighlight.current) {
        lastHighlight.current.style.cssText = lastHighlight.current.dataset._origStyle ?? "";
        delete lastHighlight.current.dataset._origStyle;
        lastHighlight.current = null;
      }
    }

    function onMove(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target || isInside(target)) {
        clearHighlight();
        return;
      }
      if (lastHighlight.current === target) return;
      clearHighlight();
      lastHighlight.current = target;
      target.dataset._origStyle = target.getAttribute("style") ?? "";
      target.setAttribute("style", `${target.getAttribute("style") ?? ""}; ${HIGHLIGHT_STYLE}`);
    }

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target || isInside(target)) return;
      e.preventDefault();
      e.stopPropagation();
      clearHighlight();
      const html = target.outerHTML.slice(0, 1500);
      const selector = buildSelector(target);
      setCaptured({ selector, html });
      setPhase("composing");
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        clearHighlight();
        setPhase("idle");
      }
    }

    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey, true);
    document.body.style.cursor = "crosshair";
    return () => {
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey, true);
      document.body.style.cursor = "";
      clearHighlight();
    };
  }, [phase, isInside]);

  async function handleSubmit() {
    setPhase("submitting");
    setError(null);
    const result = await submitTicket({
      page_url: window.location.pathname + window.location.search,
      element_selector: captured?.selector ?? null,
      element_html: captured?.html ?? null,
      viewport_w: window.innerWidth,
      viewport_h: window.innerHeight,
      description,
    });
    if (!result.ok) {
      setError(result.error ?? "Failed to submit");
      setPhase("composing");
      return;
    }
    setPhase("done");
    setTimeout(() => {
      setPhase("idle");
      setCaptured(null);
      setDescription("");
    }, 2500);
  }

  return (
    <div data-ticket-widget="1">
      {phase === "picking" && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-amber-950 text-sm py-2 text-center font-medium">
          Click anything on the page to report a problem with it. Press Esc to cancel.
        </div>
      )}

      {phase === "composing" && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center p-4">
          <div className="bg-background border rounded-lg w-full max-w-md p-4 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">Report a problem</h3>
              <button
                onClick={() => { setPhase("idle"); setCaptured(null); setDescription(""); }}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>
            {captured && (
              <div className="text-xs bg-secondary/50 rounded p-2 font-mono break-all">
                {captured.selector}
              </div>
            )}
            <Textarea
              autoFocus
              rows={4}
              placeholder="What's wrong with this? What did you expect to happen?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPhase("picking")}
              >
                Pick different element
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!description.trim()}
              >
                Send report
              </Button>
            </div>
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="fixed bottom-20 right-4 z-50 bg-green-600 text-white text-sm rounded-lg px-3 py-2 shadow">
          Thanks — we got it.
        </div>
      )}

      <button
        type="button"
        aria-label="Report a problem"
        onClick={() => setPhase(phase === "picking" ? "idle" : "picking")}
        className="fixed bottom-4 right-4 z-40 h-11 w-11 rounded-full bg-foreground text-background shadow-lg hover:opacity-90 flex items-center justify-center font-semibold"
      >
        ?
      </button>
    </div>
  );
}
