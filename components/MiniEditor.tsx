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
    } catch {}
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
      <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
        <ToolbarButton active={isBold} onClick={() => exec("bold")} title="Bold"><b>B</b></ToolbarButton>
        <ToolbarButton active={isItalic} onClick={() => exec("italic")} title="Italic"><i>I</i></ToolbarButton>
        <ToolbarButton active={isUnderline} onClick={() => exec("underline")} title="Underline"><u>U</u></ToolbarButton>
        <span style={{ width: 8 }} />
        <ToolbarButton onClick={() => exec("removeFormat")} title="Clear formatting">Clear</ToolbarButton>
      </div>

      <div
        ref={editableRef}
        contentEditable
        onInput={onInput}
        onPaste={onPaste}
        data-placeholder={placeholder}
        style={{
          width: "100%",
          minHeight: height,
          padding: "10px 12px",
          border: "1px solid #e5e7eb",
          borderRadius: 6,
          fontSize: 14,
          lineHeight: 1.5,
          outline: "none",
          background: "#fff",
        }}
        suppressContentEditableWarning
      />
      {/* Basic placeholder styling */}
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  background: "#fff",
  borderRadius: 6,
  padding: "6px 10px",
  fontSize: 12,
  cursor: "pointer",
};

function ToolbarButton({ active, onClick, children, title }: { active?: boolean; onClick?: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button type="button" onClick={onClick} title={title} style={{
      ...btnStyle,
      background: active ? "#111" : "#fff",
      color: active ? "#fff" : "#111",
      borderColor: active ? "#111" : "#e5e7eb",
    }}>{children}</button>
  );
}
