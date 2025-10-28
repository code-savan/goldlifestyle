"use client";
import React, { useEffect, useRef, useState } from "react";

type MiniEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  height?: number;
};

export default function MiniEditor({ value, onChange, placeholder = "Type here...", height = 160 }: MiniEditorProps) {
  const editableRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  useEffect(() => {
    const el = editableRef.current;
    if (!el) return;
    // Avoid resetting caret position unnecessarily
    if (el.innerHTML !== value) {
      el.innerHTML = value || "";
    }
  }, [value]);

  const restoreSelection = () => {
    const el = editableRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (!sel) return;
    if (savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  const updateToolbarState = () => {
    try {
      setIsBold(document.queryCommandState("bold"));
      setIsItalic(document.queryCommandState("italic"));
      setIsUnderline(document.queryCommandState("underline"));
    } catch {
      // Ignore errors
    }
  };

  const exec = (command: string, valueArg?: string) => {
    restoreSelection();
    document.execCommand(command, false, valueArg);
    if (editableRef.current) onChange(editableRef.current.innerHTML);
    updateToolbarState();
  };

  const onInput = () => {
    if (editableRef.current) onChange(editableRef.current.innerHTML);
    updateToolbarState();
  };

  const onPaste: React.ClipboardEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  useEffect(() => {
    const onSelectionChange = () => {
      const el = editableRef.current;
      if (!el) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      // Only react if selection is inside the editor
      if (el.contains(range.startContainer)) {
        savedRangeRef.current = range;
        updateToolbarState();
      }
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  return (
    <div>
      <div className="flex gap-2 mb-3 flex-wrap">
        <ToolbarButton active={isBold} onClick={() => exec("bold")} title="Bold">
          <span className="font-semibold">B</span>
        </ToolbarButton>
        <ToolbarButton active={isItalic} onClick={() => exec("italic")} title="Italic">
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton active={isUnderline} onClick={() => exec("underline")} title="Underline">
          <span className="underline">U</span>
        </ToolbarButton>
        <span className="w-2" />
        <ToolbarButton onClick={() => exec("insertUnorderedList")} title="Bullet List">
          <span className="text-[11px]">•</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("insertOrderedList")} title="Numbered List">
          <span className="text-[11px]">1.</span>
        </ToolbarButton>
        <span className="w-2" />
        <ToolbarButton onClick={() => exec("removeFormat")} title="Clear formatting">
          <span className="text-[10px] tracking-wider uppercase">Clear</span>
        </ToolbarButton>
      </div>

      <div
        ref={editableRef}
        contentEditable
        onInput={onInput}
        onPaste={onPaste}
        data-placeholder={placeholder}
        className="w-full border border-black/20 px-4 py-3 text-[13px] font-light leading-relaxed outline-none bg-white focus:border-black transition-colors"
        style={{ minHeight: height }}
        suppressContentEditableWarning
      />
      {/* Basic placeholder styling */}
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: rgba(0,0,0,0.3);
          font-weight: 300;
        }
      `}</style>
    </div>
  );
}

function ToolbarButton({ active, onClick, children, title }: { active?: boolean; onClick?: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`border px-3 py-1.5 text-[11px] transition-all hover:bg-black hover:text-white ${
        active
          ? "bg-black text-white border-black"
          : "bg-white text-black border-black/20"
      }`}
    >
      {children}
    </button>
  );
}
