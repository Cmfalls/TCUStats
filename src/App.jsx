import { useState } from "react";
import UnifiedViz from "../unified-three-pillars.jsx";
import CarbonPools from "../pillar1-carbon-pools.jsx";
import EconomicsViz from "../pillar2-economics.jsx";
import WaterViz from "../pillar3-water-security.jsx";

const SECTIONS = [
  { id: "overview", label: "Overview", sub: "", component: UnifiedViz },
  { id: "carbon",   label: "Carbon",   sub: "Pillar 1",   component: CarbonPools },
  { id: "economics",label: "Economics",sub: "Pillar 2",   component: EconomicsViz },
  { id: "water",    label: "Water",    sub: "Pillar 3",   component: WaterViz },
];

export default function App() {
  const [active, setActive] = useState("overview");
  const ActiveComponent = SECTIONS.find(s => s.id === active).component;

  return (
    <div style={{ minHeight: "100vh", background: "#111108" }}>
      {/* Sticky top nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 220,
        background: "rgba(10,11,8,0.97)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(106,157,42,0.35)",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        padding: "8px 18px",
        gap: 8,
      }}>
        {/* Logo */}
        <div style={{
          display: "flex", alignItems: "center",
          paddingRight: 18,
          borderRight: "1px solid rgba(106,157,42,0.28)",
          marginRight: 8,
          flexShrink: 0,
        }}>
          <a
            href="https://thecarbonunderground.org/"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit The Carbon Underground"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "5px 7px",
              minHeight: 42,
              borderRadius: 8,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(106,157,42,0.18)",
            }}
          >
            <img
              src="/TCU.Whitetext.GreenBGjpg.webp"
              alt="The Carbon Underground"
              style={{ height: 22, width: "auto", display: "block" }}
            />
          </a>
        </div>

        {/* Nav items */}
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "flex-start",
              justifyContent: "center",
              padding: "8px 12px 7px",
              background: active === s.id ? "rgba(106,157,42,0.14)" : "rgba(255,255,255,0.02)",
              border: active === s.id ? "1px solid rgba(106,157,42,0.5)" : "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.2s ease",
              minWidth: 102,
            }}
          >
            {s.sub ? (
              <span style={{
                fontSize: 10, letterSpacing: 1.6, textTransform: "uppercase",
                color: active === s.id ? "#88b850" : "#9a9d9f",
                lineHeight: 1, marginBottom: 3,
                transition: "color 0.2s",
              }}>
                {s.sub}
              </span>
            ) : null}
            <span style={{
              fontFamily: "'Bebas Neue', Arial, sans-serif",
              fontSize: 24, letterSpacing: 0.5,
              color: active === s.id ? "#ffffff" : "#d0d3d4",
              lineHeight: 1,
              transition: "color 0.2s",
            }}>
              {s.label}
            </span>
          </button>
        ))}

        {/* Right — mission tagline */}
        <div style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          fontSize: 11, color: "#a4a8aa",
          letterSpacing: 1.2,
          flexShrink: 0,
          paddingLeft: 12,
          padding: "6px 10px",
          borderRadius: 14,
          background: "linear-gradient(180deg, #edf3df 0%, #e3edcf 100%)",
          border: "1px solid rgba(139,189,83,0.28)",
          boxShadow: "0 6px 14px rgba(0,0,0,0.16)",
        }}>
          <a
            href="https://www.theedisoninstitute.org/"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit The Edison Institute"
            style={{ display: "inline-flex" }}
          >
            <img
              src="/TEILogo.webp"
              alt="The Edison Institute"
              style={{
                height: 28,
                width: "auto",
                opacity: 1,
                display: "block",
              }}
            />
          </a>
        </div>
      </nav>

      {/* Active section */}
      <ActiveComponent />
    </div>
  );
}
