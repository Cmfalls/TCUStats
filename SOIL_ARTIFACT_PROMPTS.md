# Soil Artifact Prompt Guide

Use these prompts to generate a single evolving soil artifact for the SOM slider in the overview section. The implementation is already wired to look for the files below in `images/soil-stages/`.

## Recommended workflow

1. Use the same base prompt every time.
2. Generate all 5 images in the same session if possible.
3. Keep the camera angle, lighting, crop, and silhouette consistent.
4. Export with a transparent background.
5. Save the files with the exact names listed here.

## Recommended art direction

- Subject: one isolated soil clod or soil profile specimen
- Angle: straight-on or slight three-quarter view
- Background: transparent
- Style: photoreal, museum specimen, premium editorial, not cartoonish
- Framing: centered, generous padding, no hands, no tools, no landscape
- Texture focus: cracks, aggregates, roots, pore spaces, fungal threads, moisture

## Base prompt

Use this as the shared prefix for all five stages:

```text
Create a photoreal isolated soil specimen on a transparent background, centered composition, consistent studio lighting, premium editorial realism, highly detailed soil aggregates, believable pore structure, crisp edges, no people, no tools, no container, no text, no labels, no landscape background, no infographic styling, no cutaway box, no floating debris, no cartoon look.
```

## Stage prompts

### 1. `stage-1-degraded.png`

```text
Create a photoreal isolated soil specimen on a transparent background, centered composition, consistent studio lighting, premium editorial realism, highly detailed soil aggregates, believable pore structure, crisp edges, no people, no tools, no container, no text, no labels, no landscape background, no infographic styling, no cutaway box, no floating debris, no cartoon look. Stage 1: severely degraded soil organic matter. Make the soil pale brown to dusty tan, compacted, crusted, cracked, with weak structure, almost no visible roots, almost no organic residue, very low porosity, dry and lifeless, slightly eroded surface, fragile and mineral-heavy appearance.
```

### 2. `stage-2-typical.png`

```text
Create a photoreal isolated soil specimen on a transparent background, centered composition, consistent studio lighting, premium editorial realism, highly detailed soil aggregates, believable pore structure, crisp edges, no people, no tools, no container, no text, no labels, no landscape background, no infographic styling, no cutaway box, no floating debris, no cartoon look. Stage 2: conventional typical farm soil. Make the soil medium brown, somewhat compacted, modest crumb structure, a small amount of crop residue, a few shallow roots, limited pore space, slightly healthier than degraded soil but still dry and constrained, low biological activity.
```

### 3. `stage-3-recovering.png`

```text
Create a photoreal isolated soil specimen on a transparent background, centered composition, consistent studio lighting, premium editorial realism, highly detailed soil aggregates, believable pore structure, crisp edges, no people, no tools, no container, no text, no labels, no landscape background, no infographic styling, no cutaway box, no floating debris, no cartoon look. Stage 3: recovering soil organic matter. Make the soil darker brown, more granular, with visible aggregation, several fine roots, emerging pore channels, hints of fungal threads, modest organic residue, slight moisture, clear signs that biology and structure are returning.
```

### 4. `stage-4-regenerative.png`

```text
Create a photoreal isolated soil specimen on a transparent background, centered composition, consistent studio lighting, premium editorial realism, highly detailed soil aggregates, believable pore structure, crisp edges, no people, no tools, no container, no text, no labels, no landscape background, no infographic styling, no cutaway box, no floating debris, no cartoon look. Stage 4: regenerative soil. Make the soil deep rich brown, strongly aggregated, sponge-like, with dense fine roots, visible pore networks, visible fungal filaments, higher moisture, stable crumb structure, abundant organic matter, clearly vibrant and biologically active.
```

### 5. `stage-5-prairie.png`

```text
Create a photoreal isolated soil specimen on a transparent background, centered composition, consistent studio lighting, premium editorial realism, highly detailed soil aggregates, believable pore structure, crisp edges, no people, no tools, no container, no text, no labels, no landscape background, no infographic styling, no cutaway box, no floating debris, no cartoon look. Stage 5: virgin prairie level soil organic matter. Make the soil nearly black-brown, extremely rich in carbon, highly aggregated, dense root mass throughout, extensive fungal network, excellent pore structure, moist but not muddy, resilient, lush, and visibly alive, the most biologically complex and water-retentive stage.
```

## Negative prompt

If your generator supports negative prompts, use:

```text
cartoon, illustration, vector, low detail, blurry, muddy silhouette, background scene, hands, shovel, pot, grass field, sky, text, label, infographic, cross section box, scientific diagram, unrealistic neon colors, duplicate roots, extra objects
```

## Copilot workflow

If you want Copilot to help refine before generating, paste this:

```text
Help me refine these 5 image prompts so the subject stays identical across all generations and only the soil health characteristics change. Keep the framing, specimen silhouette, lighting, camera angle, and transparent background consistent. Optimize for a photoreal isolated soil clod that transitions from degraded to virgin prairie soil.
```

## Implementation note

The slider is already set up to crossfade between these files:

- `/soil-stages/stage-1-degraded.png`
- `/soil-stages/stage-2-typical.png`
- `/soil-stages/stage-3-recovering.png`
- `/soil-stages/stage-4-regenerative.png`
- `/soil-stages/stage-5-prairie.png`
