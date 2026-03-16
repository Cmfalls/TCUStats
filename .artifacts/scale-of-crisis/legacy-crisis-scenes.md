# Legacy Crisis Scene Notes

This archive preserves the retired "The Scale of the Crisis" scene-card approach that previously lived in `unified-three-pillars.jsx`.

The raw SVG scene study now lives in `crisis_cards_row_themed.html` in this same folder.

## Legacy data snapshot

```js
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
    context: "2024 global record (Munich Re)",
    signal: "record losses",
    accent: "#7e6b59",
  },
];
```

## Legacy wrapper component

```jsx
function CrisisSceneCard({ pillar, accent, index = 0 }) {
  const meta = CRISIS.find((item) => item.pillar === pillar);
  const sceneMarkup = (CRISIS_SCENE_SVGS[pillar] || "").replace(
    '<rect x="0" y="0" width="160" height="3" fill="#c0392b" opacity="0.8"/>',
    ""
  );

  return (
    <div style={{
      position: "relative",
      display: "flex",
      flexDirection: "column",
      borderRadius: 24,
      overflow: "visible",
      minHeight: 0,
      transform: "translateY(0)",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        minHeight: 24,
        marginBottom: 8,
        paddingLeft: 6,
        flexWrap: "nowrap",
      }}>
        <div style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 1.9,
          color: meta?.accent ?? C.textMuted,
          fontWeight: 700,
        }}>
          {pillar}
        </div>
        <div style={{
          fontSize: 8.5,
          textTransform: "uppercase",
          letterSpacing: 1.2,
          color: meta?.accent ?? C.red,
          padding: "4px 7px 3px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.42)",
          border: "1px solid rgba(192,57,43,0.12)",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}>
          {meta?.signal}
        </div>
      </div>
      <div style={{
        position: "absolute",
        inset: "26% 8% 6%",
        background: `radial-gradient(circle at 50% 60%, ${accent}24 0%, rgba(245,244,238,0) 68%)`,
        filter: "blur(20px)",
        opacity: 0.48,
        pointerEvents: "none",
      }} />
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: 198,
          lineHeight: 0,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 14px 22px rgba(68, 43, 28, 0.07)",
          flex: 1,
        }}
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, rgba(213,102,82,0.94) 0%, rgba(201,83,63,0.9) 100%)",
          zIndex: 2,
        }} />
        <div dangerouslySetInnerHTML={{ __html: sceneMarkup }} />
      </div>
    </div>
  );
}
```

## Legacy render path

```jsx
<div style={{ marginTop: 56, marginBottom: 48 }}>
  <FadeIn><SectionHeader title="The Scale of the Crisis" /></FadeIn>
  <FadeIn delay={40}>
    <p style={{
      margin: "0 0 14px",
      color: C.textMuted,
      fontSize: 15,
      lineHeight: 1.65,
      maxWidth: 620,
    }}>
      Four ways the same soil crisis shows up.
    </p>
  </FadeIn>
  <FadeIn delay={70}>
    <div style={{
      marginTop: 0,
      padding: 0,
    }}>
      <div style={{
        position: "relative",
        padding: "6px 0 12px",
      }}>
        <div style={{
          position: "absolute",
          inset: "22px -10px 0",
          borderRadius: 42,
          background: "linear-gradient(90deg, rgba(190,154,112,0.08) 0%, rgba(206,175,132,0.14) 26%, rgba(136,176,204,0.11) 58%, rgba(126,111,96,0.12) 100%)",
          filter: "blur(24px)",
        }} />
        <div style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          alignItems: "stretch",
        }}>
          {CRISIS.map((c, i) => (
            <FadeIn key={`${c.stat}-scene-soft`} delay={i * 90}>
              <CrisisSceneCard pillar={c.pillar} accent={c.accent} index={i} />
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  </FadeIn>
</div>
```
