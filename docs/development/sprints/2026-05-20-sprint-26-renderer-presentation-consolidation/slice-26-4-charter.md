# Slice 26-4 — Professional renderer polish

**Date:** 2026-05-20  
**Status:** **Complete**  
**Scope:** Presentation/CSS/HTML classes only — no composition, export authority, or activity recovery changes

---

## Charter

| Item | Detail |
|------|--------|
| **Focus** | Visual hierarchy, icon alignment, calmer material headings, card/table/timeline/metadata polish |
| **Fixtures** | `renderer-kitchen-sink-page.json` (coverage); `ld-inflation-workshop-page-full.json` (fidelity) |
| **Predecessors** | 26-2 spacing/print CSS; 26-3 structural fallback safety |
| **Code** | `getUtilityPagePresentationCssV26_4()`, `getUtilityPagePresentationCss()`, `utilityRenderIconHeading`, timeline emit paths in `app.js` |

---

## Objectives delivered

| Area | Change |
|------|--------|
| **Icon headings** | `utilityRenderIconHeading` always appends `util-icon-heading`; v26-4 flex alignment for icons vs text baseline |
| **Heading hierarchy** | Calmer `h4.util-material-heading`; section `h2` border rhythm; activity `h3` scale; nested content headings toned down |
| **Material headings** | Consistent spacing, icon gap, muted colour tier — distinct from activity titles |
| **Cards / blocks** | Light shadows on task/scenario/prompt/checklist/template; softer fallback (`util-material-fallback`) |
| **Timeline** | `util-session-timeline` wrapper; `util-timeline-step` / `util-timeline-meta` / `util-timeline-title`; linked-journey path uses timeline chrome for simple steps, `util-task-block` when rich linked materials |
| **Tables** | `.util-table-scroll` border/radius; header/empty-cell treatment; print empty-cell rule |
| **Metadata** | `details.util-meta` card styling; summary chevron affordance; section spacing inside fold |
| **LO export** | `buildUtilityLearningObjectHtml` uses `getUtilityPagePresentationCss()` (26-2 + 26-4 parity) |

---

## Decisions (R26-020–R26-023)

| ID | Decision |
|----|----------|
| R26-020 | Presentation polish lives in **`getUtilityPagePresentationCssV26_4()`**, composed via **`getUtilityPagePresentationCss()`** | Keeps 26-2 rhythm separate; single append point for export paths |
| R26-021 | **Linked-journey timeline** uses timeline chrome (`util-session-timeline`, `util-timeline-step`) for simple sequence rows; retains `util-task-block` when inline/linked materials are rich | Kitchen sink + inflation sequence paths share professional timeline without changing JSON semantics |
| R26-022 | **Icon headings** normalised with `util-icon-heading` on all `utilityRenderIconHeading` output | Consistent vertical alignment across section, material, output, support, and meta summary |
| R26-023 | Tests assert **durable class/CSS markers** only (timeline wrapper, v26-4 selectors, meta details) — not pixel/visual snapshots | Matches governance: presentation tests must not encode fragile layout |

---

## Before / after (kitchen sink)

| Issue | Before | After |
|-------|--------|-------|
| Icon/text alignment | Uneven gaps in material and section headings | Flex `util-icon-heading` with fixed icon column |
| Material vs activity headings | Materials competed with activity titles | Smaller, muted `h4.util-material-heading` tier |
| Session timeline | Generic dashed task cards | Left-border timeline stack; meta line + compact title |
| Tables | Functional but plain wrapper | Bordered scroll region; header/empty-cell polish |
| Metadata fold | Basic `<details>` | Card-style fold with summary affordance |
| LO export | 26-2 CSS only | Full presentation stack (26-2 + 26-4) |

---

## Verification

```bash
node --test tests/*.test.js
```

| Check | Result |
|-------|--------|
| Full suite | **246 passed**, 0 failed |
| Kitchen sink 26-4 | 2 smoke tests (timeline structure + icon-heading classes) |
| Inflation full | Existing regression tests unchanged (scenario counts, metadata fold) |

**Manual (recommended):** kitchen sink HTML preview; inflation full fixture; print preview on **KS-A3** density block.

---

## Out of scope (deferred)

- B26-022 full badge contrast audit
- B26-031 compact mode, B26-034 LO chrome beyond shared CSS
- B26-052 PRISM TRACE gating
- Composition / export / activity recovery changes
