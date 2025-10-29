"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function SizeGuideModal() {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[11px] font-light tracking-wider uppercase text-black/60 hover:text-black transition-colors underline underline-offset-2"
      >
        Size guide
      </button>

      {open ? (
        <div role="dialog" aria-modal="true" aria-labelledby="size-guide-title">
          {/* Backdrop */}
          <div
            onClick={handleClose}
            className={`fixed inset-0 bg-black/40 z-50 backdrop-blur-sm ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
          />

          {/* Modal */}
          <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[min(92vw,800px)] max-h-[85vh] overflow-auto bg-white z-50 border border-black/10 ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}>
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-black/10">
              <h3 id="size-guide-title" className="text-[15px] font-light tracking-wider uppercase">
                Universal Size Guide
              </h3>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="w-8 h-8 flex items-center justify-center hover:bg-black/5 transition-colors"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-10">
              <Section
                title="1. Tops (T-shirts, Shirts, Hoodies, Jackets)"
                columns={["Size", "Chest (in)", "Chest (cm)", "Shoulder (in)", "Length (in)"]}
                rows={[
                  ["XS", "32–34", "81–86", "16", "26"],
                  ["S", "35–37", "89–94", "17", "27"],
                  ["M", "38–40", "97–102", "18", "28"],
                  ["L", "41–43", "104–109", "19", "29"],
                  ["XL", "44–46", "112–117", "20", "30"],
                  ["XXL", "47–49", "119–124", "21", "31"],
                ]}
              />

              <Section
                title="2. Bottoms (Jeans, Pants, Shorts)"
                columns={["Size", "Waist (in)", "Waist (cm)", "Hip (in)", "Inseam (in)"]}
                rows={[
                  ["XS", "26–28", "66–71", "32–34", "30"],
                  ["S", "29–31", "74–79", "35–37", "31"],
                  ["M", "32–34", "81–86", "38–40", "32"],
                  ["L", "35–37", "89–94", "41–43", "33"],
                  ["XL", "38–40", "97–102", "44–46", "34"],
                  ["XXL", "41–43", "104–109", "47–49", "34"],
                ]}
              />

              <Section
                title="3. Dresses (Women)"
                columns={["Size", "Bust (in)", "Waist (in)", "Hips (in)"]}
                rows={[
                  ["XS", "31–32", "23–24", "33–34"],
                  ["S", "33–34", "25–26", "35–36"],
                  ["M", "35–36", "27–28", "37–38"],
                  ["L", "37–39", "29–31", "39–41"],
                  ["XL", "40–42", "32–34", "42–44"],
                  ["XXL", "43–45", "35–37", "45–47"],
                ]}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Section({ title, columns, rows }: { title: string; columns: string[]; rows: string[][] }) {
  return (
    <div>
      <h4 className="text-[13px] font-light tracking-wider uppercase text-black/60 mb-4">
        {title}
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c}
                  className="text-left px-4 py-3 border-b border-black/10 text-[11px] font-light tracking-wider uppercase text-black/50"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-black/02 transition-colors">
                {r.map((cell, j) => (
                  <td
                    key={j}
                    className="px-4 py-3 border-b border-black/5 text-[13px] font-light text-black/70"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
