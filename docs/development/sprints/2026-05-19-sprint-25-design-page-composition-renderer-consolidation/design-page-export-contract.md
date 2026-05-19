# Design Page export / pageSections integration contract (Sprint 25-3)

**Status:** **Implemented (Slice 25-5)** — `strictCompositionClosure` when `sections[]` is authoritative; probe recovery disabled for full-page export  
**Date:** 2026-05-19  
**Sprint:** 25 — Design Page composition and renderer consolidation  
**Slice:** 25-3

**Related:**

- [Composition contract (25-2)](design-page-composition-contract.md)
- [Pipeline investigation (25-1)](design-page-composition-pipeline-investigation.md)
- [`docs/architecture/renderer-export-behavior.md`](../../../architecture/renderer-export-behavior.md) (runtime behaviour notes — to align in 25-5)

---

## 1. Purpose

Define how **PRISM Utilities HTML export** must consume `artifact_type: page` JSON so that:

- **`page.sections[]` remains authoritative** for page body content.
- **Catalog `renderConfig.sectionOrder`** controls presentation labels and fallback ordering only — not membership.
- **`pageSections` probe context** enriches partial renders without redefining composition membership (per 25-2).
- Export **does not mask** composition omissions by preferring stale top-level canonical keys.

**Out of scope for this contract:** Design Page LLM composition (25-2), pack prompt edits, new validators (25-5).

---

## 2. Export path audit (current codebase)

### 2.1 Call chain

| Step | Function | Role |
|------|----------|------|
| 1 | `handleUtilitiesGenerate()` | Parse JSON; resolve plan; invoke renderer |
| 2 | `resolveUtilityRenderPlan(parsed, format)` | Load artefact `renderHints` from domain catalog via `WorkflowGenerationContext.getArtefactRenderCatalog` |
| 3 | `runUtilityRendererByPlan(plan, parsed, baseName, renderOptions)` | Dispatch to `buildUtilityStructuredHtml` for `page` |
| 4 | `buildUtilityStructuredHtml(parsed, plan, …, renderOptions)` | Build HTML document shell + body blocks |
| 5 | `utilityRenderPageSections(sectionsValue, labels, sectionOrder, opts)` | Render sections → HTML |
| 6 | `buildPageSectionProbeContext(pageSections)` | Inside `utilityRenderPageSections` — cross-section activity/material/sequence index |
| 7 | `resolveLearningActivityRowsForRender(…)` | Merge activity rows + sequence stubs + material stubs |
| 8 | `sanitizeUtilityHtmlOutput(html)` | Post-render cleanup (placeholders, checkboxes, etc.) |

**Download:** `handleUtilitiesDownloadHtml()` serves `state.utilitiesLastHtml` only — no re-render.

### 2.2 Live generate path — `pageSections` (current)

```javascript
// handleUtilitiesGenerate → runUtilityRendererByPlan
{
  presentationMode: state.utilitiesPresentationMode,
  pageSections: Array.isArray(parsed.sections) ? parsed.sections : null
}
```

**Finding:** Live Utilities generate **does pass** `pageSections` when `parsed.sections` is an array.

### 2.3 Pack `renderHints` (production catalog)

Source: `domains/learning-design/domain-learning-design-artefacts.md` §18 `page`.

```json
"sectionOrder": [
  "overview",
  "learning_purpose",
  "knowledge_summary",
  "learning_activities",
  "assessment_check",
  "support_notes"
]
```

| Property | Value | Implication |
|----------|--------|-------------|
| **`sections` in sectionOrder** | **Absent** | Body is **not** a top-level key; lives in `sections[]` array |
| **`omitIfMissing`** | `assessment_check`, `support_notes`, metadata keys | Optional sections skipped if empty |
| **`labels`** | Canonical section labels | Used for headings when rendering fallback top-level keys |

### 2.4 `buildUtilityStructuredHtml` — page body authority (current)

When `artifact_type === "page"` and `Array.isArray(parsed.sections) && parsed.sections.length > 0`:

| Mechanism | Behaviour |
|-----------|-----------|
| `pageBodyFromSectionsArray` | `true` |
| **Primary body** | Single call: `utilityRenderPageSections(pageSectionsArray, labels, sectionOrder, buildPageSectionRenderOpts())` |
| **Duplicate suppression** | `shouldSkipPageBodySectionKey(key)` returns true for `sections` and every `PAGE_BODY_SECTION_IDS` key during `sectionOrder` / `Object.keys` loops |
| **Metadata** | `source_artefacts`, `constraints_applied`, `generation_notes` still rendered via `pageMetadataKeyOrder` into collapsed `<details class="util-meta">` |
| **`pageSections` in opts** | `options.pageSections` if provided, else `parsed.sections` |

When **`sections[]` is absent or empty**:

| Mechanism | Behaviour |
|-----------|-----------|
| `pageBodyFromSectionsArray` | `false` |
| **Fallback** | Each `sectionOrder` key rendered via `renderSectionKey` |
| **`learning_activities` top-level** | Routed through `utilityRenderPageSections({ learning_activities: value }, …)` with probe — **not** generic `utilityRenderArray` |
| **Risk** | Stale or partial **top-level** `learning_activities` may become the only activity source |

### 2.5 `utilityRenderPageSections` — array vs probe

| Input shape | Order | Probe |
|-------------|-------|-------|
| **`sections[]` array** (production) | **Array document order** (foreach index) | `buildPageSectionProbeContext(pageSections)` from full array |
| **Object map** `{ overview: …, learning_activities: … }` | `sectionOrder` then remaining keys | Probe from `renderOpts.pageSections` or map |
| **Single-section slice** | One section | Probe **must** use full `pageSections` for cross-section recovery |

**Important:** For unified `sections[]` render, **catalog `sectionOrder` does not reorder** array entries; it supplies labels and drives fallback top-level paths only.

### 2.6 `buildPageSectionProbeContext` — what it does

Collects from full `pageSections` array:

- `learningActivitiesValue`, `learningSequenceValue`, `resourcesValue`
- `materialsByActivityId`, `activityLookup` (merged across all `learning_activities` sections)
- `linkedIndex`

Used by `resolveLearningActivityRowsForRender` to:

- Order activities by sequence when present
- Add **stub rows** from sequence entries not in activities content
- Add **stub rows** from `materialsByActivityId` keys not in activities content

**Contract alignment (25-2):** This is **display recovery for render**, not composition membership authority. It can **surface an activity in HTML** when missing from `sections[learning_activities].content` but present in materials/sequence — which **must not** be treated as satisfying composition closure (see §6).

### 2.7 Test harness divergence

| Path | `sectionOrder` default |
|------|------------------------|
| **Production catalog** | Canonical keys (no `"sections"`) |
| **`buildUtilityStructuredHtmlForTest`** | Defaults to `["sections"]` unless override |

**Parity requirement (future):** Export tests must use **catalog `sectionOrder`**, not test-only `["sections"]`, unless explicitly testing the legacy key path.

---

## 3. Production export behaviour — risk assessment

### 3.1 When `sections[]` is present (nominal production shape)

| Question | Current answer |
|----------|----------------|
| Renders `sections[]` as authoritative body? | **Yes** — single `utilityRenderPageSections` on full array |
| Passes `pageSections` on live generate? | **Yes** — `handleUtilitiesGenerate` |
| Falls back to top-level canonical keys for body? | **No** — skipped via `shouldSkipPageBodySectionKey` |
| Duplicate body when top-level + `sections[]`? | **No** — top-level body keys suppressed |
| Stale top-level `learning_activities` overrides `sections[]`? | **No** — suppressed when `sections[]` non-empty |

**Regression test (implemented):** `catalog sectionOrder prefers sections[] over partial top-level learning_activities` — stale top-level without A2, full `sections[]` → A2 visible in HTML.

### 3.2 When `sections[]` is absent (legacy / malformed)

| Question | Current answer |
|----------|----------------|
| Top-level `learning_activities` used? | **Yes** — via activity pipeline + probe |
| Stale top-level can omit activities? | **Yes** — **high risk** |
| `pageSections` null on generate? | **Yes** if no array — probe weakened |

### 3.3 Historical risk (pre–`pageBodyFromSectionsArray`)

Before unified `sections[]` rendering, catalog `sectionOrder` could render **top-level `learning_activities` first** via generic array renderer, producing **wrong activity set** (e.g. A1, A3–A5 without A2) even when `sections[]` was complete.

**Status:** Mitigated in current `app.js` when `sections[]` is non-empty. **Documented here** so 25-5 does not regress.

### 3.4 A2 symptom vs export layer

| Scenario | Export outcome |
|----------|----------------|
| `sections[]` complete with A2 | HTML includes A2 (fixture + tests) |
| `sections[]` missing A2; materials section has A2 | Probe **may** still render A2 stub — **masks composition gap** |
| `sections[]` missing A2; no material keys for A2 | A2 absent in HTML — consistent with live report |
| Stale top-level only (no `sections[]`) | Top-level set wins — **A2 can be lost** |

**Conclusion:** Live A2 loss is **still primarily a composition (S2) issue** if production `page` JSON has complete `sections[]` without A2. Export is **not the first suspect** when `sections[]` is authoritative and complete. Export **is** a suspect when `sections[]` is missing or top-level duplicates are used.

---

## 4. Export authority rules (normative)

### 4.1 Primary authority

| Rule | Requirement |
|------|-------------|
| **X1** | For `artifact_type: page` with non-empty `sections[]`, **body HTML MUST be derived only from `sections[]`** (one unified render pass). |
| **X2** | Top-level keys in `PAGE_BODY_SECTION_IDS` MUST NOT be rendered as additional body sections when X1 applies. |
| **X3** | `sectionOrder` from `renderHints` MUST NOT be interpreted as a second body pass over top-level keys when X1 applies. |

### 4.2 `sectionOrder` role

| Rule | Requirement |
|------|-------------|
| **X4** | `sectionOrder` provides **labels** and **fallback ordering** when rendering top-level keys (no `sections[]`). |
| **X5** | `sectionOrder` MUST NOT define activity membership (see [composition contract §4](design-page-composition-contract.md)). |
| **X6** | Physical order of `sections[]` array entries is the **default presentation order** for unified render unless a future spec adds explicit reordering. |

### 4.3 Top-level canonical keys — fallback only

| Rule | Requirement |
|------|-------------|
| **X7** | Top-level `overview`, `learning_activities`, etc. MAY be rendered only when `sections[]` is **absent or empty**. |
| **X8** | When both exist, top-level keys are **non-authoritative** and MUST be ignored for body (X1–X3). |
| **X9** | Metadata keys (`source_artefacts`, `constraints_applied`, `generation_notes`) MAY render from top-level regardless — not learner body. |

### 4.4 `pageSections` probe context

| Rule | Requirement |
|------|-------------|
| **X10** | Live generate MUST pass `pageSections: parsed.sections` when `sections` is an array. |
| **X11** | Probe MAY use full `pageSections` to recover **materials**, **sequence order**, and **title lookup** for activities present in the slice being rendered. |
| **X12** | Probe MUST NOT be used to **drop** activities present in `sections[learning_activities].content`. |
| **X13** | Probe-driven stub activities (from materials/sequence only) MUST NOT be treated as composition closure; optional future **warn** in 25-5 if stub-only ids appear without composition trace. |

### 4.5 `generation_notes` / limitations

| Rule | Requirement |
|------|-------------|
| **X14** | Export SHOULD render `generation_notes` / limitations in collapsed metadata when present. |
| **X15** | Export MUST NOT hide or strip `generation_notes` that document activity omissions. |

---

## 5. Renderer vs export separation

| Responsibility | Owner | Must | Must not |
|----------------|-------|------|----------|
| **Faithful structure** | Renderer (`utilityRenderPageSections`, material helpers) | Render cards, tables, prompts, icons from JSON | Invent pedagogy |
| **Membership** | Composition (Design Page) | Emit complete `sections[]` | — |
| **Export routing** | `buildUtilityStructuredHtml` | Prefer `sections[]`; pass probe | Prefer stale top-level body |
| **Display recovery** | `resolveLearningActivityRowsForRender` | Enrich partial slices; order by sequence | Replace composition closure rules |
| **Activity invention** | — | — | Add activities not in composed JSON |
| **Silent suppression** | — | — | Drop activities present in `sections[]` content |

**Principle:** Renderer/export **structure** faithful content; they **do not fix** missing activities in composed `page` JSON except via explicit, documented recovery paths that must not invalidate 25-2 closure validation.

---

## 6. Probe recovery vs composition (explicit tension)

Current `resolveLearningActivityRowsForRender` can add activity rows when:

- Sequence references an `activity_id` not in the section’s `content` array, or
- `materialsByActivityId` contains keys not in `content`.

**Export contract stance:**

| Behaviour | Status |
|-----------|--------|
| Recovery helps **partial** Utilities paste (single `learning_activities` section) | **Allowed** |
| Recovery **masks** missing activities in **full page** export without `generation_notes` | **Undesirable** — document for 25-5 |
| Full-page export should match **composition contract** first; recovery is safety net only | **Normative target** |

**Implemented (25-5):** `buildPageSectionRenderOpts` sets `strictCompositionClosure: true` when `pageBodyFromSectionsArray`; `resolveLearningActivityRowsForRender` skips sequence/material stub rows. Isolated section render may pass `strictCompositionClosure: false` explicitly for legacy probe behaviour.

---

## 7. Future parity test matrix (25-5 — not implemented in 25-3)

| ID | Scenario | `sectionOrder` | Input shape | Assert |
|----|----------|----------------|-------------|--------|
| **T1** | Production catalog + full fixture | Catalog (no `sections` key) | Complete `sections[]` | All activity titles (incl. A2); 5 `util-task-block` |
| **T2** | Stale top-level override guard | Catalog | Full `sections[]` + top-level `learning_activities` missing A2 | A2 still visible (T2 exists) |
| **T3** | Live generate opts | Catalog | Via `handleUtilitiesGenerate` equivalent | `pageSections` passed; same as T1 |
| **T4** | No duplicate sections | Catalog | Full `sections[]` + top-level duplicates | Single Learning Activities block; no duplicated headings |
| **T5** | Fallback path warning | Catalog | **No** `sections[]`; top-level only | Renders top-level only; document as legacy |
| **T6** | Partial slice + probe | Catalog | `[laSection]` + `pageSections: full` | A2 recovered when missing from slice only (probe) |
| **T7** | Strict closure (future) | Catalog | `sections[]` missing A2, materials have A2 | **Fail** validation or **warn** — not pass silently as “fixed” |
| **T8** | `generation_notes` visible | Catalog | Fixture with `generation_notes.limitations` | Collapsed metadata contains limitation text |
| **T9** | Learning object mode | Catalog | `presentationMode: learning_object` + `pageSections` | LO screens preserve A2 when in full snapshot |

**Fixture needs (document only):**

- `ld-inflation-workshop-page-export-stale-top-level.json` — full `sections[]`, partial top-level `learning_activities`
- `ld-inflation-workshop-page-no-sections-array.json` — top-level keys only (legacy)

---

## 8. Alignment with architecture doc

[`renderer-export-behavior.md`](../../../architecture/renderer-export-behavior.md) should gain a **Page authority** section in 25-5 referencing this contract (X1–X15). Current architecture doc lists the call chain but not `sections[]` authority or duplicate-key suppression.

---

## 9. Slice 25-4 vs 25-5 recommendation

| Slice | Recommendation |
|-------|----------------|
| **25-4 — Renderer governance** | **Proceed after 25-5 export/composition fixes** if live A2 loss is confirmed in composed JSON. Renderer polish (tables, icons, spacing) is valuable but **must not distract** from closure/export authority. |
| **25-5 — Remediation** | **Should come first:** (1) apply composition contract to Design Page pack prompt; (2) lock export authority with T1–T4 tests; (3) optional closure validator; (4) consider strict probe mode. |
| **25-4 in parallel** | Only **documentation/governance** (visual direction charter) — no conflicting CSS churn during 25-5. |

**Rationale:** 25-1 implicates composition; 25-2 defines rules; 25-3 shows export is **already correct when `sections[]` is authoritative**. Fixing composition + locking export regression tests delivers more user value than renderer CSS tweaks while A2 may still be absent from composed JSON.

---

## 10. Implementation boundary (25-3)

| In scope | Out of scope |
|----------|--------------|
| This contract | Code changes |
| Investigation §12 update | Pack prompts |
| Review-log decisions | New tests/fixtures (listed only) |
| Architecture doc cross-reference plan | Renderer CSS |

**25-5 implementation checklist:** enforce X1–X3 (verify no regression), add T1–T4, pack prompt apply, optional strict probe, update `renderer-export-behavior.md`.
