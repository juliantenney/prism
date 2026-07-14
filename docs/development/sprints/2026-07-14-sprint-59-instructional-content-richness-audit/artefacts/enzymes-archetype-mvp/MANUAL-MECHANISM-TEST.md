# Manual mechanism transfer test — handoff

**Purpose:** Manually verify that a `mechanism_explanation` contract travels DLA → capture → GAM routing → material body.  
**Do not** treat this as an instructional-quality rubric; only confirm the route and save artefacts.

**Opt-in token (required):** `S59_MECHANISM_TEST`

---

## 1. Workflow / fixture to open

1. Open PRISM in the browser (`index.html` via your usual local host, e.g. XAMPP).
2. Soft-reload so scripts include `lib/ld-instructional-archetype.js?v=20260714-2`.
3. Create or open an **Enzymes and Reaction Rates** (or equivalent temperature/enzyme) learning-design workflow with partial-page flags on (`pageEnrichmentV2` + `partialPageOutputs`).
4. In the workflow **goal** (or title/notes), include the exact token:

```text
S59_MECHANISM_TEST
```

Example goal:

```text
Enzymes and Reaction Rates — S59_MECHANISM_TEST
```

Optional console override (same session):

```js
window.__PRISM_S59_MECHANISM_TEST = true
```

---

## 2. Which activity carries the mechanism contract

**Designated row:**

| Field | Value |
| ----- | ----- |
| `activity_id` | `A2` |
| `material_id` | `A2-M1` |
| `instructional_archetype` | `mechanism_explanation` |

If A2 / A2-M1 does not exist yet, the capture stamp creates `A2-M1` on activity `A2` (or the first activity if `A2` is missing). Prefer designs that already have activity **A2**.

---

## 3. Run DLA

1. Complete Episode Plan so activity `A2` exists.
2. Open **Design Learning Activities**.
3. Copy the DLA prompt (Copy prompt / usual run UI).
4. Confirm the prompt contains:

```text
LD-INSTRUCTIONAL-ARCHETYPE-DLA-MECHANISM-TEST (auto-applied)
```

and the enzymes `archetype_plan` JSON (start / outcome / required_links).
5. Run Copilot / paste the model output into the DLA step capture textarea.
6. Blur/save / advance so PRISM syncs the capture (status should clear validation errors).

---

## 4. Inspect the captured DLA payload

In the DLA step **run output** textarea (persisted runstate), locate:

```json
"material_id": "A2-M1"
```

and confirm:

```json
"instructional_archetype": "mechanism_explanation",
"archetype_plan": {
  "start": "temperature increases within and beyond the enzyme's stable range",
  "outcome": "reaction rate first increases and then decreases",
  "required_links": [ ... ]
}
```

Optional console:

```js
window.__PRISM_S59_MECHANISM_TEST_STAMP
```

Should show `{ activity_id, material_id, instructional_archetype, archetype_plan, changed }`.

**Save:** copy the full DLA JSON to e.g.  
`docs/development/sprints/2026-07-14-sprint-59-instructional-content-richness-audit/artefacts/enzymes-archetype-mvp/manual-run-dla-capture.json`

---

## 5. Run GAM

1. Open **Generate Activity Materials**.
2. Copy the GAM prompt.
3. Confirm the prompt includes:

```text
LD-INSTRUCTIONAL-ARCHETYPE-ROUTING (auto-applied)
```

and:

```text
Selected rule ids for this request: mechanism_explanation.
```

4. Confirm **no** `process_walkthrough` / `mental_model_building` rules.
5. Confirm DEPTH anti-gaming / anti-leakage text is still present.
6. Run Copilot and paste the GAM capture.

---

## 6. Inspect routing debug information

After copying the GAM prompt (routing runs at copy/augment time):

```js
window.__PRISM_S59_ARCHETYPE_ROUTING_DEBUG
```

Expected shape:

```js
{
  at: <timestamp>,
  selections: [{
    activity_id: "A2",
    material_id: "A2-M1",
    instructional_archetype: "mechanism_explanation",
    archetype_plan: { start, outcome, required_links },
    rule_selected: true,
    rule_preview: "Explain how the stated start…"
  }]
}
```

Also check the browser console for:

```text
[PRISM S59 archetype routing]
```

Learner-facing materials must **not** contain this debug object.

---

## 7. Locate the generated material body

In the GAM capture JSON:

```text
activities[] → activity_id "A2" → materials[] → material_id "A2-M1" → body
```

That `body` is the object of your instructional review.

**Save:** full GAM JSON as  
`.../artefacts/enzymes-archetype-mvp/manual-run-gam-capture.json`

---

## 8. Artefacts to save for comparison

| Artefact | Suggested path |
| -------- | -------------- |
| DLA capture | `artefacts/enzymes-archetype-mvp/manual-run-dla-capture.json` |
| GAM capture | `artefacts/enzymes-archetype-mvp/manual-run-gam-capture.json` |
| Optional: copied GAM prompt excerpt with routing block | `manual-run-gam-prompt-routing-excerpt.txt` |
| Console dumps | note `__PRISM_S59_MECHANISM_TEST_STAMP` + `__PRISM_S59_ARCHETYPE_ROUTING_DEBUG` |

Fixture reference (planning only):  
`artefacts/enzymes-archetype-mvp/mechanism-explanation.required-material.json`

---

## Blockers to watch for

1. **Token missing** — without `S59_MECHANISM_TEST` (or window flag), no DLA emission block and no capture stamp.
2. **DLA not persisted in runstate** — GAM routing uses `resolveDlaEnrichedPageJsonForGamCopy`; if the DLA textarea was never synced, no rule injects. Re-blur/save DLA before copying GAM.
3. **Hard refresh** — ensure cache-bust `ld-instructional-archetype.js?v=20260714-2` is loaded.
4. No Copilot-history fallback — if DLA never lands in PRISM capture, this path will not self-heal.
