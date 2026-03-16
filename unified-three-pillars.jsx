import { useState, useEffect, useRef } from "react";

/* â”€â”€â”€ Color palette â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const C = {
  bg:         "#f5f4ee",
  card:       "#ffffff",
  cardAlt:    "#eeecea",
  cardGreen:  "#edf5db",
  cardRed:    "#fdf0ee",
  text:       "#1a1a12",
  textSec:    "#4c4c3c",
  textMuted:  "#7a7a6a",
  textFaint:  "#aeada4",
  border:     "rgba(0,0,0,0.08)",
  borderGreen:"rgba(106,157,42,0.35)",
  borderRed:  "rgba(192,57,43,0.3)",
  green:      "#5a8c1e",
  greenBright:"#6a9d2a",
  red:        "#c0392b",
  redBright:  "#e74c3c",
};

const SOIL_ARTIFACT_STAGES = [
  {
    id: "stage-1-degraded",
    label: "Degraded",
    subtitle: "Dusty, compacted, low life",
    anchor: 0.5,
    min: 0.5,
    max: 1.1,
    src: "/soil-stages/stage-1-degraded.webp",
    accent: "#b64933",
    highlights: ["Compacted surface", "Weak biology", "Fast runoff risk"],
  },
  {
    id: "stage-2-typical",
    label: "Typical Farm",
    subtitle: "Some residue, shallow roots",
    anchor: 2.0,
    min: 1.2,
    max: 2.0,
    src: "/soil-stages/stage-2-typical.webp",
    accent: "#8B5E3C",
    highlights: ["Thin residue cover", "Shallow roots", "Moderate holding power"],
  },
  {
    id: "stage-3-recovering",
    label: "Recovering",
    subtitle: "Structure returning, roots spreading",
    anchor: 3.2,
    min: 2.1,
    max: 3.2,
    src: "/soil-stages/stage-3-recovering.webp",
    accent: "#567d22",
    highlights: ["Roots spreading", "Structure returning", "More sponge capacity"],
  },
  {
    id: "stage-4-regenerative",
    label: "Regenerative",
    subtitle: "Dark aggregates, pores, biology",
    anchor: 4.5,
    min: 3.3,
    max: 4.7,
    src: "/soil-stages/stage-4-regenerative.webp",
    accent: "#3a7010",
    highlights: ["Stable aggregates", "Active biology", "High infiltration"],
  },
  {
    id: "stage-5-prairie",
    label: "Virgin Prairie",
    subtitle: "Dense roots, rich carbon sponge",
    anchor: 6.0,
    min: 4.8,
    max: 6.0,
    src: "/soil-stages/stage-5-prairie.webp",
    accent: "#6a9d2a",
    highlights: ["Dense root web", "Carbon-rich profile", "Peak water buffering"],
  },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized;
  const int = Number.parseInt(value, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getCurrentSoilArtifactStage(som) {
  return SOIL_ARTIFACT_STAGES.find((stage) => som >= stage.min && som <= stage.max) ?? SOIL_ARTIFACT_STAGES[0];
}

function getSoilArtifactBlend(som) {
  const stages = SOIL_ARTIFACT_STAGES;

  if (som <= stages[0].anchor) {
    return [{ ...stages[0], opacity: 1 }];
  }

  if (som >= stages[stages.length - 1].anchor) {
    return [{ ...stages[stages.length - 1], opacity: 1 }];
  }

  for (let i = 0; i < stages.length - 1; i += 1) {
    const lower = stages[i];
    const upper = stages[i + 1];

    if (som >= lower.anchor && som <= upper.anchor) {
      const progress = clamp((som - lower.anchor) / (upper.anchor - lower.anchor), 0, 1);
      return [
        { ...lower, opacity: 1 - progress },
        { ...upper, opacity: progress },
      ];
    }
  }

  return [{ ...stages[0], opacity: 1 }];
}

function FadeIn({ children, delay = 0 }) {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(24px)",
      transition: `all 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function SoilArtifact({ som }) {
  const [failedImages, setFailedImages] = useState({});
  const currentStage = getCurrentSoilArtifactStage(som);
  const layers = getSoilArtifactBlend(som).filter((layer) => layer.opacity > 0.001);
  const hasRenderableLayer = layers.some((layer) => !failedImages[layer.id]);

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100%",
      minHeight: 428,
      borderRadius: 26,
      overflow: "hidden",
      background: "linear-gradient(145deg, rgba(252,253,247,0.96) 0%, rgba(234,243,213,0.98) 100%)",
      border: "1px solid rgba(106,157,42,0.22)",
      boxShadow: "0 22px 40px rgba(76, 98, 23, 0.12)",
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at 78% 18%, rgba(106,157,42,0.18) 0%, rgba(106,157,42,0) 30%), radial-gradient(circle at 18% 78%, rgba(182,73,51,0.11) 0%, rgba(182,73,51,0) 26%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        left: "16%",
        right: "12%",
        bottom: 62,
        height: 42,
        background: "radial-gradient(circle, rgba(74,88,24,0.2) 0%, rgba(74,88,24,0.06) 42%, rgba(74,88,24,0) 78%)",
        filter: "blur(18px)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative",
        width: "100%",
        minHeight: 428,
      }}>
        <div style={{
          position: "absolute",
          top: 20,
          left: 22,
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
          zIndex: 2,
        }}>
          <div style={{
            fontSize: 10,
            letterSpacing: 2.4,
            textTransform: "uppercase",
            color: C.textMuted,
          }}>
            Soil Profile
          </div>
          <div style={{
            padding: "6px 12px",
            borderRadius: 999,
            border: `1px solid ${C.border}`,
            background: "rgba(255,255,255,0.72)",
            fontSize: 11,
            color: C.textMuted,
            whiteSpace: "nowrap",
          }}>
            {currentStage.min.toFixed(1)}-{currentStage.max.toFixed(1)}% SOM
          </div>
        </div>

        <div style={{
          position: "absolute",
          inset: "12% 6% 9%",
          borderRadius: 28,
          overflow: "hidden",
          background: "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.95) 0%, rgba(239,243,225,0.96) 52%, rgba(229,238,208,0.95) 100%)",
          border: "1px solid rgba(106,157,42,0.16)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.82), 0 14px 32px rgba(76,98,23,0.12)",
        }} />
        <div style={{
          position: "absolute",
          inset: "12% 6% 9%",
          borderRadius: 28,
          background: "linear-gradient(180deg, rgba(255,255,255,0) 62%, rgba(229,238,208,0.26) 100%)",
          pointerEvents: "none",
        }} />

        {layers.map((layer) => (
          <img
            key={layer.id}
            src={layer.src}
            alt={`${layer.label} soil artifact`}
            onError={() => {
              setFailedImages((prev) => (prev[layer.id] ? prev : { ...prev, [layer.id]: true }));
            }}
            style={{
              position: "absolute",
              inset: "4% 0 6%",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: failedImages[layer.id] ? 0 : layer.opacity,
              transition: "opacity 240ms ease-out",
              pointerEvents: "none",
              filter: "drop-shadow(0 20px 32px rgba(72,56,35,0.16))",
            }}
          />
        ))}

        {!hasRenderableLayer && (
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: 96,
              height: 96,
              borderRadius: "44% 44% 38% 38% / 34% 34% 58% 58%",
              background: `radial-gradient(circle at 35% 24%, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0) 24%), linear-gradient(180deg, ${currentStage.accent} 0%, #4d3927 100%)`,
              boxShadow: "inset 0 -10px 14px rgba(0,0,0,0.18), 0 16px 22px rgba(72,56,35,0.18)",
            }} />
          </div>
        )}

        <div style={{
          position: "absolute",
          left: 22,
          right: 22,
          bottom: 18,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          gap: 12,
          alignItems: "end",
          zIndex: 2,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: "'Bebas Neue', Arial, sans-serif",
              fontSize: "clamp(30px, 4.2vw, 46px)",
              lineHeight: 0.92,
              color: currentStage.accent,
              marginBottom: 8,
            }}>
              Soil Condition
            </div>
            <div style={{
              fontSize: 14,
              color: C.textSec,
              lineHeight: 1.6,
              maxWidth: 360,
            }}>
              {currentStage.subtitle}.
            </div>
          </div>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "flex-end",
          }}>
            {currentStage.highlights.map((highlight) => (
              <div
                key={highlight}
                style={{
                  padding: "7px 10px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(255,255,255,0.82)",
                  fontSize: 11,
                  color: C.textSec,
                  boxShadow: "0 6px 14px rgba(38, 52, 12, 0.08)",
                  whiteSpace: "nowrap",
                }}
              >
                {highlight}
              </div>
            ))}
          </div>
        </div>

        {!hasRenderableLayer && (
          <div style={{
            position: "absolute",
            left: 22,
            right: 22,
            bottom: 86,
            fontSize: 10,
            color: C.textMuted,
            lineHeight: 1.45,
            zIndex: 2,
          }}>
            Drop generated files into <strong>/images/soil-stages</strong> using the filenames in the prompt guide.
          </div>
        )}
      </div>
    </div>
  );
}

function SOMSlider() {
  const [som, setSom] = useState(1);
  const currentStage = getCurrentSoilArtifactStage(som);
  const waterGal = som * 20000;
  const carbonTons = som * 5.8; // Van Bemmelen factor: SOC ≈ 58% of SOM weight
  const economicsValue = som >= 3 ? "+78%" : som >= 2 ? "+30%" : "+5%";
  const infiltrationRate = 100 + (som - 1) * 45;
  const microbialBiomass = 100 + (som - 1) * 30;
  const summaryStats = [
    { label: "Water", value: `${(waterGal / 1000).toFixed(0)}K`, sub: "held per acre", borderColor: "#5a8c1e" },
    { label: "Carbon", value: carbonTons.toFixed(0), sub: "tons C per acre", borderColor: "#8B5E3C" },
    { label: "Economics", value: economicsValue, sub: "profit potential", borderColor: C.green },
  ];
  const baselineCards = [
    {
      label: "Infiltration Rate",
      value: `${infiltrationRate.toFixed(0)}%`,
      sub: "of degraded baseline",
      accent: "linear-gradient(90deg, #8B5E3C 0%, #5a8c1e 100%)",
    },
    {
      label: "Microbial Biomass",
      value: `~${microbialBiomass.toFixed(0)}%`,
      sub: "of degraded baseline",
      accent: "linear-gradient(90deg, #5a8c1e 0%, #6a9d2a 100%)",
    },
  ];

  return (
    <div style={{
      padding: "24px",
      background: "linear-gradient(180deg, #eef6de 0%, #e7f1cf 100%)",
      borderRadius: 22,
      border: `1px solid ${C.borderGreen}`,
      boxShadow: "0 18px 40px rgba(64, 88, 19, 0.08)",
    }}>
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 18,
        flexWrap: "wrap",
        marginBottom: 16,
      }}>
        <div style={{ flex: "1 1 520px" }}>
          <div style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 3,
            color: C.green,
            marginBottom: 10,
            fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
          }}>
            Interactive - Adjust Soil Organic Matter %
          </div>
          <div style={{
            fontFamily: "'Bebas Neue', Arial, sans-serif",
            fontSize: "clamp(40px, 6vw, 64px)",
            lineHeight: 0.94,
            color: C.text,
            marginBottom: 8,
            textShadow: "0 1px 0 rgba(255,255,255,0.4)",
          }}>
            Soil Organic Matter
          </div>
          <div style={{
            maxWidth: 640,
            fontSize: 15,
            color: C.textSec,
            lineHeight: 1.65,
          }}>
            Slide upward to watch the soil profile densify, darken, and hold more carbon and water.
          </div>
        </div>

        <div style={{
          padding: "11px 15px",
          borderRadius: 999,
          background: "linear-gradient(180deg, rgba(255,255,255,0.84) 0%, rgba(247,249,239,0.92) 100%)",
          border: "1px solid rgba(106,157,42,0.2)",
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: currentStage.accent,
          whiteSpace: "nowrap",
          boxShadow: "0 10px 18px rgba(62, 86, 19, 0.08)",
        }}>
          Live readout
        </div>
      </div>

      <div style={{
        padding: "14px 16px 12px",
        marginBottom: 18,
        background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(248,250,241,0.7) 100%)",
        border: "1px solid rgba(106,157,42,0.12)",
        borderRadius: 18,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
      }}>
        <input
          type="range" min={0.5} max={6} step={0.1} value={som}
          onChange={(e) => setSom(parseFloat(e.target.value))}
          style={{
            width: "100%",
            height: 10,
            appearance: "none",
            background: `linear-gradient(90deg, #c0392b 0%, #8B5E3C 22%, #567d22 52%, #6a9d2a 100%)`,
            borderRadius: 999,
            outline: "none",
            cursor: "pointer",
            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.08)",
          }}
        />
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 10,
          color: C.textMuted,
          marginTop: 8,
          gap: 12,
          flexWrap: "wrap",
          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        }}>
          <span>0.5% (degraded)</span>
          <span>2% (typical farm)</span>
          <span>4%+ (regenerative)</span>
          <span>6% (virgin prairie)</span>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.62fr) minmax(360px, 1fr)",
        gap: 18,
        alignItems: "stretch",
        marginBottom: 14,
      }}>
        <div style={{ minWidth: 0 }}>
          <SoilArtifact som={som} />
        </div>

        <div style={{
          minWidth: 0,
          padding: "20px 16px 16px",
          borderRadius: 24,
          background: "linear-gradient(160deg, rgba(255,255,255,0.88) 0%, rgba(241,247,227,0.96) 100%)",
          border: "1px solid rgba(106,157,42,0.18)",
          boxShadow: "0 16px 32px rgba(64, 88, 19, 0.1)",
          display: "flex",
          flexDirection: "column",
          minHeight: 428,
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 86% 12%, rgba(106,157,42,0.12) 0%, rgba(106,157,42,0) 34%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "relative",
            fontSize: 10,
            letterSpacing: 2.2,
            textTransform: "uppercase",
            color: C.textMuted,
            marginBottom: 14,
          }}>
            What Changes Fastest
          </div>
          <div style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            minHeight: 154,
            marginBottom: 6,
            paddingLeft: 8,
            paddingTop: 8,
          }}>
          <div style={{
            position: "relative",
            fontFamily: "'Bebas Neue', Arial, sans-serif",
            fontSize: "clamp(74px, 13vw, 132px)",
            lineHeight: 0.84,
            background: "linear-gradient(135deg, #8B5E3C 0%, #3a7010 40%, #6a9d2a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 4,
            transform: "translate(-4px, 4px)",
          }}>
            {som.toFixed(1)}%
          </div>
          <div style={{ position: "relative", fontSize: 15, color: C.textSec, marginBottom: 2 }}>
            Soil Organic Matter
          </div>
          <div style={{
            position: "relative",
            fontSize: 12.5,
            color: C.textSec,
            lineHeight: 1.5,
            marginBottom: 0,
            maxWidth: 300,
          }}>
            More SOM means more water, more carbon, and stronger farm resilience.
          </div>
          </div>

          <div style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 10,
            marginTop: "auto",
            alignItems: "stretch",
          }}>
            {summaryStats.map((item) => (
              <div
                key={item.label}
                style={{
                  padding: "16px 10px 14px",
                  borderRadius: 18,
                  background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(250,251,245,0.9) 100%)",
                  border: "1px solid rgba(106,157,42,0.08)",
                  boxShadow: "0 12px 18px rgba(32, 45, 12, 0.05)",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: 132,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 8,
                }}
              >
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: 4,
                  background: item.borderColor,
                }} />
                <div style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: 1.8,
                  color: C.textMuted,
                  marginBottom: 0,
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontFamily: "'Bebas Neue', Arial, sans-serif",
                  fontSize: "clamp(38px, 4.4vw, 50px)",
                  color: C.green,
                  lineHeight: 0.92,
                  marginBottom: 0,
                }}>
                  {item.value}
                </div>
                <div style={{
                  fontSize: 11.5,
                  color: C.textMuted,
                  lineHeight: 1.3,
                  maxWidth: 96,
                  minHeight: 28,
                  display: "flex",
                  alignItems: "center",
                }}>
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 12,
      }}>
        {baselineCards.map((item) => (
          <div
            key={item.label}
            style={{
              padding: "18px 18px 16px",
              background: "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(249,251,243,0.96) 100%)",
              borderRadius: 18,
              border: `1px solid ${C.border}`,
              boxShadow: "0 12px 18px rgba(32, 45, 12, 0.05)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: 4,
              background: item.accent,
            }} />
            <div style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: 2.2,
              color: C.textMuted,
              marginBottom: 10,
            }}>
              {item.label}
            </div>
            <div style={{
              fontFamily: "'Bebas Neue', Arial, sans-serif",
              fontSize: 38,
              lineHeight: 0.92,
              color: C.green,
              marginBottom: 4,
            }}>
              {item.value}
            </div>
            <div style={{ fontSize: 12, color: C.textMuted }}>
              {item.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const CRISIS = [
  {
    pillar: "Carbon",
    stat: "133 Gt C",
    label: "Global soil carbon lost",
    context: "since farming began",
    signal: "historic depletion",
    accent: "#8B5E3C",
  },
  {
    pillar: "Economics",
    stat: "$1T+/yr",
    label: "US soil degradation cost",
    context: "annual economic drag",
    signal: "annual drag",
    accent: "#9c7650",
  },
  {
    pillar: "Water",
    stat: "71%",
    label: "Aquifers are declining",
    context: "of 1,700 studied",
    signal: "resource decline",
    accent: "#4a8fb5",
  },
  {
    pillar: "Climate",
    stat: "$320B",
    label: "Climate disaster losses",
    context: "2024 global record",
    signal: "record losses",
    accent: "#7e6b59",
  },
];

function CrisisBubble({ item }) {
  const outerTint = hexToRgba(item.accent, 0.1);
  const innerRing = hexToRgba(item.accent, 0.26);
  const statSize = item.stat.length > 6 ? "clamp(24px, 3vw, 36px)" : "clamp(30px, 3.8vw, 44px)";

  return (
    <div style={{ flexShrink: 0 }}>
      <div
        style={{
          position: "relative",
          width: "clamp(160px, 18.5vw, 210px)",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          padding: 20,
          background: `radial-gradient(circle at 50% 22%, rgba(255,255,255,0.96) 0%, rgba(245,248,239,0.98) 38%, rgba(236,242,225,1) 100%), radial-gradient(circle at 18% 18%, ${outerTint} 0%, rgba(255,255,255,0) 34%)`,
          border: "1.8px solid rgba(106,157,42,0.34)",
          boxShadow: "0 10px 28px rgba(65, 86, 21, 0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{
          position: "absolute",
          inset: 10,
          borderRadius: "50%",
          border: "1.8px solid rgba(106,157,42,0.18)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          inset: 22,
          borderRadius: "50%",
          border: `1.8px solid ${innerRing}`,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}>
          <div style={{
            display: "grid",
            gap: 4,
            justifyItems: "center",
            marginBottom: 7,
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}>
              <div style={{
                fontSize: 8.5,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: item.accent,
                fontWeight: 700,
              }}>
                {item.pillar}
              </div>
              <div style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: item.accent,
                boxShadow: `0 0 0 2px ${hexToRgba(item.accent, 0.18)}`,
                flexShrink: 0,
              }} />
            </div>
            <div style={{
              fontSize: 8,
              letterSpacing: 1.3,
              textTransform: "uppercase",
              color: item.accent,
              padding: "4px 8px 3px",
              borderRadius: 999,
              border: `1.5px solid ${hexToRgba(item.accent, 0.18)}`,
              background: "rgba(255,255,255,0.68)",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}>
              {item.signal}
            </div>
          </div>

          <div style={{
            fontFamily: "'Bebas Neue', Arial, sans-serif",
            fontSize: statSize,
            lineHeight: 0.9,
            color: C.greenBright,
            letterSpacing: 0.5,
            marginBottom: 7,
          }}>
            {item.stat}
          </div>

          <div style={{
            display: "grid",
            gap: 3,
            justifyItems: "center",
            maxWidth: 130,
          }}>
            <div style={{
              fontSize: 11.5,
              lineHeight: 1.25,
              color: C.text,
              fontWeight: 600,
              textWrap: "balance",
            }}>
              {item.label}
            </div>
            <div style={{
              fontSize: 10,
              lineHeight: 1.3,
              color: C.textMuted,
              textWrap: "balance",
            }}>
              {item.context}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CrisisBubbleGrid() {
  return (
    <div style={{
      position: "relative",
      padding: "22px 40px 22px",
      borderRadius: 28,
      background: "radial-gradient(circle at 50% 0%, rgba(106,157,42,0.1) 0%, rgba(106,157,42,0) 48%), linear-gradient(180deg, rgba(250,250,246,0.96) 0%, rgba(239,245,229,0.92) 100%)",
      border: "1.8px solid rgba(106,157,42,0.18)",
      boxShadow: "0 14px 30px rgba(63, 85, 20, 0.05)",
    }}>
      <div style={{
        position: "absolute",
        left: 24,
        right: 24,
        bottom: 0,
        height: 2,
        borderRadius: 999,
        background: "linear-gradient(90deg, rgba(106,157,42,0) 0%, rgba(106,157,42,0.38) 20%, rgba(106,157,42,0.52) 50%, rgba(106,157,42,0.38) 80%, rgba(106,157,42,0) 100%)",
      }} />
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}>
        {CRISIS.map((item) => (
          <CrisisBubble key={item.pillar} item={item} />
        ))}
      </div>
    </div>
  );
}

const SOLUTION = [
  { icon: "/icons/evidence-carbon-sequestered.webp", stat: "0.3-1.0", unit: "Mg C/ha/yr", label: "Carbon sequestered by regenerative practices", color: C.green, iconScale: 1.04 },
  { icon: "/icons/evidence-higher-profits.webp",     stat: "+78%",    label: "Higher profits on regen farms (LaCanne & Lundgren)",   color: C.green, iconScale: 1.18 },
  { icon: "/icons/evidence-water-infiltration.webp", stat: "+59%",    label: "Water infiltration improvement from cover crops",      color: C.green, iconScale: 1.15 },
  { icon: "/icons/evidence-carbon-moved.webp",       stat: "13.12 Gt", unit: "CO2e/yr", label: "Carbon moved by mycorrhizal fungi networks", color: C.green, iconScale: 1.08 },
];

function SectionHeader({ title }) {
  return (
    <div style={{
      background: "linear-gradient(90deg, #2f5202, #3d6a10)",
      padding: "10px 20px", marginBottom: 28,
      display: "inline-block", borderRadius: "2px 8px 8px 2px",
    }}>
      <div style={{ fontFamily: "'Bebas Neue', Arial, sans-serif", fontSize: 24, letterSpacing: 2, color: "#ffffff", margin: 0 }}>
        {title}
      </div>
    </div>
  );
}

export default function UnifiedViz() {
  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      color: C.text,
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      padding: "0 0 80px",
    }}>

      {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ position: "relative", minHeight: 460, overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
        <div style={{
          position: "absolute", inset: 0, right: "50%",
          backgroundImage: "url(/hero-before.webp)",
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        <div style={{
          position: "absolute", inset: 0, left: "50%",
          backgroundImage: "url(/hero-after.webp)",
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        {/* Center divider */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: "50%",
          width: 1,
          background: "linear-gradient(to bottom, rgba(106,157,42,0.2) 0%, rgba(106,157,42,0.78) 50%, rgba(106,157,42,0.2) 100%)",
          transform: "translateX(-50%)", zIndex: 2,
        }} />
        {/* Corner labels */}
        <div style={{
          position: "absolute", top: 22, left: 20, zIndex: 3,
          fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
          color: C.redBright, background: "rgba(245,244,238,0.72)",
          backdropFilter: "blur(6px)",
          padding: "4px 10px", borderRadius: 4,
          border: `1px solid ${C.borderRed}`,
        }}>Degraded</div>
        <div style={{
          position: "absolute", top: 22, right: 20, zIndex: 3,
          fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
          color: C.green, background: "rgba(245,244,238,0.72)",
          backdropFilter: "blur(6px)",
          padding: "4px 10px", borderRadius: 4,
          border: `1px solid ${C.borderGreen}`,
        }}>Regenerated</div>
        {/* Fade to off-white */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: `linear-gradient(to bottom, rgba(10,12,7,0.1) 0%, rgba(10,12,7,0.15) 44%, rgba(245,244,238,0.95) 100%)`,
        }} />

        <header style={{
          position: "relative", zIndex: 4,
          width: "100%",
          padding: "42px 24px 46px",
        }}>
          <div style={{
            maxWidth: 760,
            margin: "0 auto",
            textAlign: "center",
            background: "rgba(245,244,238,0.82)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${C.border}`,
            borderRadius: 14,
            padding: "22px 24px 24px",
            boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
          }}>
            <div style={{
              fontSize: 10,
              letterSpacing: 2.2,
              textTransform: "uppercase",
              color: C.green,
              marginBottom: 12,
            }}>
              The Edison Institute - The Carbon Underground
            </div>
            <h1 style={{
              fontFamily: "'Bebas Neue', Arial, sans-serif",
              fontSize: "clamp(36px, 6.5vw, 68px)",
              lineHeight: 0.96,
              margin: "0 0 14px",
              color: C.text,
              letterSpacing: 1,
            }}>
              One Metric.{" "}
              <span style={{ color: C.green }}>Three Crises.</span>
              <br />One Solution.
            </h1>
            <p style={{ color: C.textSec, fontSize: 15, lineHeight: 1.65, maxWidth: 620, margin: "0 auto" }}>
              Soil organic matter is the thread connecting carbon storage, farm profitability, and water security.
              When soil health declines, everything declines.{" "}
              <strong style={{ color: C.text }}>When we rebuild, everything recovers.</strong>
            </p>
          </div>
        </header>
      </div>

      {/* â”€â”€ Brand strip â€” stays dark â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{
        background: "linear-gradient(90deg, #1e3801, #2f5202, #3d6a10, #2f5202, #1e3801)",
        padding: "14px 32px", textAlign: "center",
        borderTop: "1px solid rgba(106,157,42,0.3)",
        borderBottom: "1px solid rgba(106,157,42,0.3)",
      }}>
        <span style={{
          fontFamily: "'Bebas Neue', Arial, sans-serif",
          fontSize: "clamp(13px, 2vw, 17px)",
          letterSpacing: 3, color: "#ffffff", textTransform: "uppercase",
        }}>
          Rebuild the Soil - Store the Carbon - Hold the Water - Feed the World
        </span>
      </div>

      <main style={{ maxWidth: 1020, margin: "0 auto", padding: "0 32px" }}>

        {/* â”€â”€ The Crisis â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div style={{ marginTop: 56, marginBottom: 40 }}>
          <SectionHeader title="The Scale of the Crisis" />
          <p style={{
            margin: "0 0 18px",
            color: C.textMuted,
            fontSize: 15,
            lineHeight: 1.65,
            maxWidth: 560,
          }}>
            Four ways the same soil crisis shows up.
          </p>
          <CrisisBubbleGrid />
        </div>

        {/* â”€â”€ Interactive Slider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <FadeIn delay={200}>
          <div style={{ marginBottom: 48 }}>
            <SOMSlider />
          </div>
        </FadeIn>

        {/* â”€â”€ The Evidence â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div style={{ marginBottom: 48 }}>
          <FadeIn><SectionHeader title="The Evidence" /></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {SOLUTION.map((s, i) => (
              <FadeIn key={s.stat} delay={i * 100}>
                <div style={{
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #edf6dc 0%, #e6f0cf 100%)",
                  border: `1px solid ${C.borderGreen}`,
                  display: "grid",
                  gridTemplateColumns: "31% 69%",
                  overflow: "hidden",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                  minHeight: 0,
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "18px 10px",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.42) 0%, rgba(244,248,232,0.88) 100%)",
                    borderRight: "1px solid rgba(106,157,42,0.16)",
                  }}>
                    <div style={{
                      width: 80,
                      height: 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <img
                        src={s.icon}
                        alt=""
                        style={{
                          width: 72,
                          height: 72,
                          objectFit: "contain",
                          display: "block",
                          transform: `scale(${s.iconScale ?? 1})`,
                          transformOrigin: "center",
                        }}
                      />
                    </div>
                  </div>
                  <div style={{
                    padding: "14px 20px 14px 20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, rgba(232,241,210,0.96) 0%, rgba(226,237,200,0.96) 100%)",
                  }}>
                    <div style={{
                      fontFamily: "'Bebas Neue', Arial, sans-serif",
                      fontSize: "clamp(34px, 4vw, 50px)", color: s.color, lineHeight: 0.95, marginBottom: 6,
                    }}>
                      {s.stat}{s.unit && <span style={{ fontSize: "0.48em", color: C.textMuted, marginLeft: 6 }}>{s.unit}</span>}
                    </div>
                    <div style={{ fontSize: 13.5, color: C.textSec, lineHeight: 1.45, maxWidth: 300 }}>{s.label}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* â”€â”€ Three Pillars â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <FadeIn delay={100}>
          <div style={{ marginBottom: 56 }}>
            <SectionHeader title="Three Pillars of Evidence" />
            <p style={{
              margin: "0 0 20px",
              color: C.textMuted,
              fontSize: 14,
              lineHeight: 1.65,
              maxWidth: 760,
            }}>
              Each pillar quantifies one part of the same system. Together they show why soil restoration is a climate, water, and profitability strategy.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 18 }}>
              {[
                {
                  num: "01", title: "Carbon Pools",
                  desc: "Soil stores 3.1x more carbon than the atmosphere. Mycorrhizal fungi move 13.12 Gt CO2e per year. 133 Gt C stripped since farming began.",
                  stats: ["2,500 Gt C in global soils", "1B bacteria / gram", "+45% SOC in 8 years (UC Davis)"],
                  color: "#8B5E3C",
                },
                {
                  num: "02", title: "Economics",
                  desc: "Regenerative farms earn 78% higher profits. SHI 100-farm study: 85% of farmers saw net gains. $1T/yr in hidden degradation costs.",
                  stats: ["$51.60/acre corn gain (SHI)", "-41% fertilizer (Gabe Brown)", "+120% long-term ROI (BCG)"],
                  color: "#3a7010",
                },
                {
                  num: "03", title: "Water Security",
                  desc: "20,000 gallons held per acre per 1% SOM gain. 71% of aquifers declining. California's Central Valley faces permanent loss of 500K-1M acres.",
                  stats: ["87% CA water loss by 2043", "2M ac-ft/yr overdraft", "+59% infiltration (cover crops)"],
                  color: C.greenBright,
                },
              ].map((p, i) => (
                <FadeIn key={i} delay={i * 120}>
                  <div style={{
                    padding: "24px 20px 20px",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.86) 0%, #f3f2ef 100%)",
                    borderRadius: 16,
                    border: `1px solid ${C.border}`,
                    borderTop: `4px solid ${p.color}`,
                    height: "100%", boxSizing: "border-box",
                    position: "relative", overflow: "hidden",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                  }}>
                    <div style={{
                      fontFamily: "'Bebas Neue', Arial, sans-serif",
                      fontSize: 60, color: p.color, opacity: 0.1,
                      lineHeight: 1, position: "absolute", top: 8, right: 12,
                      userSelect: "none",
                    }}>{p.num}</div>
                    <div style={{ position: "relative" }}>
                      <div style={{ fontSize: 10, letterSpacing: 2.4, textTransform: "uppercase", color: p.color, marginBottom: 10, fontWeight: 700 }}>
                        Pillar {p.num}
                      </div>
                      <div style={{ fontFamily: "'Bebas Neue', Arial, sans-serif", fontSize: 32, color: C.text, marginBottom: 10, lineHeight: 1 }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6, marginBottom: 16 }}>{p.desc}</div>
                      <div style={{ display: "grid", gap: 7 }}>
                        {p.stats.map((s, j) => (
                          <div key={j} style={{
                            fontSize: 11, color: C.green,
                            padding: "6px 10px", background: "rgba(106,157,42,0.12)",
                            borderRadius: 6, border: `1px solid ${C.borderGreen}`,
                          }}>{s}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* â”€â”€ Investment Gap â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <FadeIn delay={150}>
          <div style={{
            padding: "34px 28px 30px", borderRadius: 18,
            background: "linear-gradient(165deg, #e6edd4 0%, #dce6c4 100%)",
            border: `1px solid ${C.borderGreen}`,
            marginBottom: 46,
            boxShadow: "0 10px 24px rgba(59, 92, 22, 0.12)",
          }}>
            <div style={{
              fontSize: 10, textTransform: "uppercase", letterSpacing: 3,
              color: C.green, marginBottom: 14, textAlign: "center", fontWeight: 700,
            }}>
              The Investment Gap - The Edison Institute's Mandate
            </div>
            <div style={{ fontSize: 15, color: C.textSec, lineHeight: 1.75, maxWidth: 720, margin: "0 auto 28px", textAlign: "center" }}>
              The science is settled. Regenerative agriculture can sequester carbon, restore aquifers, and
              rebuild farm profitability simultaneously. The bottleneck is investment, research continuity,
              and adoption at scale.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
              {[
                { val: "$200-450B", label: "Annual global investment needed",     sub: "To achieve soil restoration and climate impact at scale",       color: C.text,  borderColor: C.borderGreen },
                { val: "<10%",      label: "Currently funded",                    sub: "Less than 10% of required capital is deployed globally",        color: C.red,   borderColor: C.borderRed },
                { val: "31.9%",     label: "CAGR of carbon credit market",        sub: "$36M -> $648M by 2034. The market is forming - fast.",           color: C.green, borderColor: C.borderGreen },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: "12px 16px 14px", background: "rgba(255,255,255,0.86)",
                  borderRadius: 14, border: `1px solid ${s.borderColor}`,
                  textAlign: "center",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                }}>
                  <div style={{
                    height: 4, width: "100%", marginBottom: 12, borderRadius: 999,
                    background: `linear-gradient(90deg, ${s.color} 0%, rgba(255,255,255,0.3) 100%)`,
                  }} />
                  <div style={{
                    fontFamily: "'Bebas Neue', Arial, sans-serif",
                    fontSize: "clamp(36px, 5vw, 56px)", color: s.color, lineHeight: 0.9, marginBottom: 6,
                  }}>{s.val}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 6, lineHeight: 1.35 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.45 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* â”€â”€ Long-term research gap â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <FadeIn delay={200}>
          <div style={{
            padding: "22px 26px", borderRadius: 18,
            background: "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, #f1f0ed 100%)",
            border: `1px solid ${C.border}`,
            textAlign: "center", marginBottom: 48,
            boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: C.textMuted, marginBottom: 12, fontWeight: 600 }}>
              The Long-Term Research Gap
            </div>
            <div style={{
              display: "flex",
              justifyContent: "center",
              margin: "0 auto 8px",
            }}>
              <img
                src="/rodale-logo.webp"
                alt="Rodale Institute"
                style={{ height: 68, width: "auto", display: "block", margin: "0 -24px" }}
              />
            </div>
            <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.65, maxWidth: 680, margin: "0 auto 18px" }}>
              Most studies run 3-5 years. The Rodale Institute took 34 years to show definitive results.
              Soil systems operate on decades, not quarters. The Edison Institute exists to fill this gap -
              whole-systems, long-term research across all three pillars simultaneously.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, alignItems: "stretch" }}>
              {[
                { val: "34",    unit: "years",  label: "Rodale's trial before definitive carbon data" },
                { val: "6,000", unit: "years",  label: "For the Ogallala to recharge naturally" },
                { val: "50+",   unit: "years",  label: "Tillage damage that one pass on virgin soil equals (MSU)" },
              ].map((t, i) => (
                <FadeIn key={i} delay={i * 100}>
                  <div style={{
                    padding: "10px 14px 12px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.65)",
                    border: `1px solid ${C.border}`,
                    minHeight: 0,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6 }}>
                      <span style={{ fontFamily: "'Bebas Neue', Arial, sans-serif", fontSize: "clamp(44px, 5vw, 64px)", color: C.text, lineHeight: 1 }}>{t.val}</span>
                      <span style={{ fontSize: 15, color: C.textMuted }}>{t.unit}</span>
                    </div>
                    <div style={{ fontSize: 13, color: C.textMuted, marginTop: 6, lineHeight: 1.4, display: "flex", alignItems: "center", justifyContent: "center" }}>{t.label}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* â”€â”€ Mission statement â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <FadeIn delay={100}>
          <div style={{
            padding: "48px 32px", borderRadius: 16,
            background: C.cardGreen,
            border: `1px solid ${C.borderGreen}`,
            textAlign: "center", marginBottom: 0,
            position: "relative", overflow: "hidden",
            boxShadow: "0 2px 16px rgba(106,157,42,0.12)",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "url(/hands-soil-sunlight.webp)",
              backgroundSize: "cover", backgroundPosition: "center",
              opacity: 0.06,
            }} />
            <div style={{ position: "relative" }}>
              <img
                src="/TCU.Whitetext.GreenBGjpg.webp"
                alt="The Carbon Underground"
                style={{ height: 44, width: "auto", display: "block", margin: "0 auto 24px", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15))" }}
              />
              <div style={{
                fontFamily: "'Bebas Neue', Arial, sans-serif",
                fontSize: "clamp(22px, 3.5vw, 36px)",
                color: C.text, lineHeight: 1.4,
                maxWidth: 600, margin: "0 auto 20px", letterSpacing: 1,
              }}>
                Rebuild the Soil. Store the Carbon.<br />Hold the Water. Feed the World.
              </div>
              <div style={{ fontSize: 14, color: C.textSec, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 24px" }}>
                The Edison Institute funds and publishes the long-term, whole-systems research that connects
                these three crises to one solution - and makes the case for regenerative agriculture at the
                scale of institutional capital.
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 20px",
                border: `1px solid ${C.borderGreen}`,
                borderRadius: 4,
                fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: C.green,
                background: "rgba(255,255,255,0.6)",
              }}>
                The Edison Institute - California's Central Valley
              </div>
            </div>
          </div>
        </FadeIn>

      </main>

      <footer style={{
        maxWidth: 920, margin: "60px auto 0",
        padding: "24px 28px 32px",
        borderTop: "1px solid rgba(47,82,2,0.25)",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <div style={{ fontSize: 9, color: "#2f5202", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Peer-Reviewed Sources</div>
            {[
              "Sanderman et al. 2017 (PNAS) — global soil carbon debt",
              "Hawkins et al. 2023 (Current Biology) — mycorrhizal carbon flux",
              "Lal 2004 (Science) — soil carbon sequestration potential",
              "LaCanne & Lundgren 2018 (PeerJ) — regen farm profitability",
              "Basche & DeLonge 2019 (PLOS ONE) — water infiltration meta-analysis",
              "Jasechko & Perrone 2024 (Nature) — global aquifer acceleration",
            ].map((s, i) => (
              <div key={i} style={{ fontSize: 10, color: "#7a7a6a", lineHeight: 1.65, display: "flex", gap: 6 }}>
                <span style={{ color: "#2f5202", flexShrink: 0 }}>→</span>{s}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 9, color: "#2f5202", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Institutional & Government</div>
            {[
              "Rodale Institute — 34-Year Farming Systems Trial",
              "Lawrence Livermore National Laboratory — microbial necromass",
              "USDA-NRCS — soil health & water retention research",
              "USGS 2024 — groundwater depletion reports",
              "PPIC 2024 — California groundwater & SGMA projections",
              "Edison Institute / TCU — research compendium 2024–2025",
            ].map((s, i) => (
              <div key={i} style={{ fontSize: 10, color: "#7a7a6a", lineHeight: 1.65, display: "flex", gap: 6 }}>
                <span style={{ color: "#2f5202", flexShrink: 0 }}>→</span>{s}
              </div>
            ))}
          </div>
        </div>
        <div style={{
          marginTop: 20, paddingTop: 16,
          borderTop: "1px solid rgba(0,0,0,0.07)",
          fontSize: 10, color: "#3a3d38",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 8,
        }}>
          <div>Overview · The Carbon Underground · Data current through 2025</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/tcu-logo-black.webp" alt="TCU" style={{ height: 18, opacity: 0.65 }} />
            <span style={{ color: "rgba(0,0,0,0.15)" }}>|</span>
            <a href="#" style={{ display: "inline-flex" }}><img src="/icon-instagram.webp" alt="Instagram" style={{ height: 14, opacity: 0.5 }} /></a>
            <a href="#" style={{ display: "inline-flex" }}><img src="/icon-linkedin.webp" alt="LinkedIn" style={{ height: 14, opacity: 0.5 }} /></a>
            <a href="#" style={{ display: "inline-flex" }}><img src="/icon-tiktok.webp" alt="TikTok" style={{ height: 14, opacity: 0.5 }} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
