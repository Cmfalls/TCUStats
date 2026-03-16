import { useEffect, useRef, useState } from "react";
import UnifiedViz from "../unified-three-pillars.jsx";
import CarbonPools from "../pillar1-carbon-pools.jsx";
import EconomicsViz from "../pillar2-economics.jsx";
import WaterViz from "../pillar3-water-security.jsx";

const SECTIONS = [
  { id: "overview", label: "Overview", sub: "One Metric", component: UnifiedViz },
  { id: "carbon",   label: "Carbon",   sub: "Pillar 1",   component: CarbonPools },
  { id: "economics",label: "Economics",sub: "Pillar 2",   component: EconomicsViz },
  { id: "water",    label: "Water",    sub: "Pillar 3",   component: WaterViz },
];

const INTRO_STORAGE_KEY = "tcuFounderIntroSeen";

function FounderIntroModal({ onEnter }) {
  const enterButtonRef = useRef(null);

  useEffect(() => {
    enterButtonRef.current?.focus();
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at 18% 18%, rgba(106,157,42,0.2) 0%, rgba(106,157,42,0) 28%), radial-gradient(circle at 82% 16%, rgba(139,94,60,0.14) 0%, rgba(139,94,60,0) 26%), linear-gradient(180deg, #f5f4ee 0%, #eef6de 100%)",
      color: "#1a190f",
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 18px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, rgba(255,255,255,0.24) 0%, rgba(231,241,207,0.12) 100%)",
        backdropFilter: "blur(12px)",
      }} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="founder-note-title"
        style={{
          position: "relative",
          width: "min(760px, 100%)",
          padding: "30px 30px 26px",
          borderRadius: 28,
          background: "linear-gradient(160deg, rgba(250,250,245,0.96) 0%, rgba(241,247,224,0.94) 100%)",
          border: "1px solid rgba(106,157,42,0.2)",
          boxShadow: "0 28px 60px rgba(58, 76, 17, 0.16)",
        }}
      >
        <div style={{
          fontSize: 11,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "#5a8c1e",
          marginBottom: 12,
        }}>
          A Note Before You Enter
        </div>
        <h1
          id="founder-note-title"
          style={{
            margin: "0 0 18px",
            fontFamily: "'Bebas Neue', Arial, sans-serif",
            fontSize: "clamp(36px, 6vw, 62px)",
            lineHeight: 0.94,
            letterSpacing: 0.4,
            color: "#17150f",
          }}
        >
          A small thank you,
          <br />
          and a way back in.
        </h1>

        <div style={{
          maxWidth: 620,
          display: "grid",
          gap: 14,
          fontSize: 16,
          lineHeight: 1.72,
          color: "#3f4238",
        }}>
          <p style={{ margin: 0 }}>
            Randi and Larry, it has been genuinely exciting to see the Edison Institute project taking shape so successfully. The more I understood what you were building, the more inspired I felt to make something that tried to meet the ambition of it.
          </p>
          <p style={{ margin: 0 }}>
            Inside, you'll find an interactive framework built around three pillars — carbon sequestration, agricultural economics, and water security — each grounded in data and brought to life through dynamic visualizations. It's designed to be fast, tangible, and experiential rather than a static slide deck.
          </p>
          <p style={{ margin: 0 }}>
            Once I better understood what Larry was interested in and where I could be most useful, I wanted to build this as both a thank you and a constructive way to reconnect. In some ways it became my attempt to take the same challenge being framed elsewhere and push it into something sharper, faster, and more experiential. If what you see resonates, I would love to help shape the full website.
          </p>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          flexWrap: "wrap",
          marginTop: 26,
          paddingTop: 18,
          borderTop: "1px solid rgba(106,157,42,0.16)",
        }}>
          <div style={{
            fontSize: 13,
            lineHeight: 1.5,
            color: "#6c7265",
            maxWidth: 420,
          }}>
            I hope the work speaks for itself. Thanks for taking a look.
          </div>
          <button
            ref={enterButtonRef}
            onClick={onEnter}
            style={{
              border: "none",
              cursor: "pointer",
              padding: "14px 24px 12px",
              borderRadius: 999,
              background: "linear-gradient(90deg, #2f5202, #5a8c1e)",
              color: "#ffffff",
              fontFamily: "'Bebas Neue', Arial, sans-serif",
              fontSize: 24,
              letterSpacing: 1.2,
              lineHeight: 1,
              boxShadow: "0 12px 24px rgba(58, 92, 16, 0.24)",
            }}
          >
            Enter the site
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("overview");
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return window.localStorage.getItem(INTRO_STORAGE_KEY) !== "true";
    } catch {
      return true;
    }
  });
  const ActiveComponent = SECTIONS.find(s => s.id === active).component;

  const handleEnterSite = () => {
    try {
      window.localStorage.setItem(INTRO_STORAGE_KEY, "true");
    } catch {
      // If storage is unavailable, still let the visitor into the site.
    }
    setShowIntro(false);
  };

  if (showIntro) {
    return <FounderIntroModal onEnter={handleEnterSite} />;
  }

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
            <span style={{
              fontSize: 10, letterSpacing: 1.6, textTransform: "uppercase",
              color: active === s.id ? "#88b850" : "#9a9d9f",
              lineHeight: 1, marginBottom: 3,
              transition: "color 0.2s",
            }}>
              {s.sub}
            </span>
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
