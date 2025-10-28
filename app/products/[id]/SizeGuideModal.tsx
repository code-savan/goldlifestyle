"use client";
import React, { useState } from "react";

export default function SizeGuideModal() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[12px] font-semibold underline cursor-pointer uppercase"
        style={{ color: "#111" }}
      >
        Size guide
      </button>

      {open ? (
        <div role="dialog" aria-modal="true" aria-labelledby="size-guide-title">
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.45)",
              zIndex: 50,
            }}
          />
          <div
            // style={{
            //   position: "fixed",
            //   top: "50%",
            //   left: "50%",
            //   transform: "translate(-50%, -50%)",
            //   width: "min(92vw, 780px)",
            //   maxHeight: "85vh",
            //   overflow: "auto",
            //   background: "#fff",
            //   boxShadow: "0 10px 30px rgba(0,0,0,.2)",
            //   zIndex: 60,
            // }}
            className=" rounded-t-lg md:rounded-t-none fixed md:top-[50%] bottom-0 md:left-1/2 left-0 transform md:-translate-x-1/2 md:-translate-y-1/2 md:w-[min(92vw,780px)] max-h-[85vh] h-full overflow-auto bg-white shadow-lg z-60"
          >
            <div className="flex justify-between items-center p-4 border-b border-b-gray-200">
              <h3 id="size-guide-title" className="minimal-heading" style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>Universal Size Guide</h3>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" style={{ border: 0, background: "transparent", fontSize: 20, cursor: "pointer" }}>×</button>
            </div>

            <div style={{ padding: 16, display: "grid", gap: 20 }}>
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
      <h4 className="minimal-heading" style={{ margin: 0, marginBottom: 8, fontWeight: 600, fontSize: 13, color: "#111" }}>{title}</h4>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c} style={{ textAlign: "left", padding: "8px 10px", borderBottom: "1px solid #e5e7eb", color: "#374151", fontWeight: 600 }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((cell, j) => (
                  <td key={j} style={{ padding: "8px 10px", borderBottom: "1px solid #f3f4f6", color: "#111" }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
