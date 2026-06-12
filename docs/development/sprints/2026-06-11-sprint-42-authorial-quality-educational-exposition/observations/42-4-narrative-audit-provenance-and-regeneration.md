# Slice 42-4 — Narrative Audit Provenance and Regeneration

**Date:** 2026-06-11  
**Type:** Validation / provenance check (no Sprint 42 feature implementation)

---

## Required verdict

| Question | Answer |
| -------- | ------ |
| **Were all original audit artefacts fresh?** | **No — Mixed** |
| **Which artefacts were stale or uncertain?** | **Inflation** and **Climate** page fixtures (May 2026, pre–Sprint 42, static renderer regression shapes). **Marx** git-committed fixture (June 2026-03) pre–42-3; working copy hand-edited 2026-06-11, not LLM-regenerated. |
| **Which artefacts were regenerated?** | **None via live workflow.** Partial capture: fixture copies + deterministic HTML render + DLA/Design Page **prompt snapshots** from current code → `captures/sprint-42-exposition/42-4-regenerated/`. |
| **Does the main conclusion still hold after regeneration?** | **Yes for Inflation and Climate** (unchanged stale JSON). **Partially revised for Marx activity exposition** (42-3 hand-edit improves preambles); **narrative progression / transition / closure gaps unchanged** across all three. |

---

## 1. Provenance table

| Artefact | Path | Last write | Last git touch | Post 42-2? | Post 42-3? | 42-2 evidence in JSON | 42-3 evidence in JSON |
| -------- | ---- | ---------- | -------------- | ---------- | ---------- | --------------------- | --------------------- |
| Marx self-study page | `tests/fixtures/page-render/marx-self-study-page.json` | 2026-06-11 15:35 | 2026-06-03 (Sprint 34–36) | **No** | **Partial** (hand-edit only) | N/A — contract is prompt-only | Working copy: narrative preambles + `reasoning_orientation`; git HEAD: procedural preambles |
| Inflation workshop page | `tests/fixtures/page-render/ld-inflation-workshop-page.json` | 2026-05-19 | 2026-05-19 (Sprint 25) | **No** | **No** | None | None — 0 `activity_preamble` |
| Climate workshop page | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | 2026-05-21 | 2026-05-21 (Sprint 27) | **No** | **No** | None | None — 0 `activity_preamble` |

### How to read “evidence in JSON”

Sprint 42 contracts are **prompt augmentations**, not fields stored in page JSON:

- **42-2** `LD-AUTHORIAL-EXPOSITION-CONTRACT` — wired on **Design Page** step only (`design-page-prompt-snapshot.txt` contains marker).
- **42-3** `LD-ACTIVITY-PREAMBLE-EXPOSITION-CONTRACT` — wired on **Design Learning Activities** step when learner-page framing scaffold applies (`dla-prompt-snapshot.txt` contains marker).

Absence of markers in page JSON is expected. Freshness means the artefact was **produced by a workflow run** after those prompts were active — which did not occur for any audit fixture.

### Sprint 42 code state at capture

- `lib/ld-authorial-exposition.js` — **uncommitted** (not in `HEAD`)
- `lib/ld-activity-preamble-exposition.js` — **uncommitted** (not in `HEAD`)
- `app.js` — **modified**, uncommitted wiring for 42-2/42-3

Captures reflect **working tree** prompt behaviour, not committed release history.

### Live captures used in prior audit

The Slice 42-4 narrative audit used **only** the three `tests/fixtures/page-render/*.json` files above. No live workflow captures from `docs/.../live-artefacts/` were cited. The only Sprint 42 capture folder item pre-42-4 was `marx-preamble-before-after.json` (42-3 validation diff, not a workflow run).

---

## 2. Regeneration attempt

### What was requested

Fresh DLA, GAM, Design Page JSON, and rendered HTML for Marx, Inflation, and Climate workflows.

### What was possible

| Output | Marx | Inflation | Climate |
| ------ | ---- | --------- | ------- |
| `page.json` | Fixture copy (working tree) | Fixture copy | Fixture copy |
| `page-rendered.html` | Deterministic render | Deterministic render | Deterministic render |
| `dla-prompt-snapshot.txt` | From current `app.js` | From current `app.js` | From current `app.js` |
| `design-page-prompt-snapshot.txt` | From current `app.js` | From current `app.js` | From current `app.js` |
| `upstream-learning-activities.json` | Not available | Existing upstream fixture | Not available |
| GAM / `activity_materials` JSON | **Not captured** | **Not captured** | **Not captured** |
| LLM workflow regeneration | **Blocked** | **Blocked** | **Blocked** |

**Blocker:** PRISM has no automated workflow runner in `tools/`; workflows execute via browser UI and external AI. No API credentials in the repository. `tools/evaluate-educational-quality-framework.js` explicitly evaluates manually saved artefacts only.

**Capture location:** `captures/sprint-42-exposition/42-4-regenerated/`  
**Manifest:** `provenance-manifest.json`  
**Notice:** `REGENERATION-NOTICE.md`

**Capture script:** `tools/capture-sprint-42-4-provenance.js` (reproducible metadata + renders; not LLM generation).

---

## 3. Re-run narrative audit (confirmed artefacts only)

Audit basis:

- **Marx:** working-tree `marx-self-study-page.json` (42-3 hand-edit)
- **Inflation / Climate:** unchanged May 2026 fixtures
- **HTML:** fresh deterministic renders in `42-4-regenerated/*/page-rendered.html`

### Marx self-study

| Dimension | Finding |
| --------- | ------- |
| Central inquiry | Still **implicit** — `knowledge_summary` previews moves; no page-level governing question |
| Cross-activity progression | **Strong structure** (A2→A3→A4 faded scaffolding) |
| Intellectual momentum | **Improved** in preambles (explanatory openers); bridges still imperative |
| Transition quality | **Weak** — bridges: “Reuse the purpose-and-difference move…”, “Move from comparing texts…” |
| Resource climax | **Materials-led** (A3 template, A4 checklist); page does not announce climax |
| Closure quality | **Weak** — `study_tips` bullets only; EQF Learning Success absent |
| Visible scaffolding | Framing rail + cognition blocks render; field stack still visible |
| Self-study voice | **Pass** — no facilitator leakage; teach-before-task in preambles |

### Inflation workshop

| Dimension | Finding |
| --------- | ------- |
| Central inquiry | **Fail** — session brief + outcome bullets only |
| Cross-activity progression | Logical order; **no prose arc** |
| Intellectual momentum | **Absent** in wrappers |
| Transition quality | **Absent** |
| Resource climax | Latent in A2 table/prompts; not narrated |
| Closure quality | MCQ only |
| Visible scaffolding | Task cards, tables, prompts — **no** preamble/cognition layer |
| Workshop voice | **Fail** P4 — facilitator choreography in `support_note` |

### Climate workshop

| Dimension | Finding |
| --------- | ------- |
| Central inquiry | **Fail** — one-line overview |
| Cross-activity progression | Single activity; internal sequence not narrated |
| Intellectual momentum | **Absent** in wrappers |
| Transition quality | **Absent** |
| Resource climax | Card dump + template; no staged arc |
| Closure quality | T/F check only; `expected_output` reads as author spec |
| Visible scaffolding | Materials-heavy single block |
| Workshop voice | Neutral — no facilitator leakage in fixture |

---

## 4. Conclusions separated

### A. Findings confirmed on fresh Sprint 42 artefacts

*Scope: prompt snapshots + Marx working-tree JSON + deterministic HTML — not LLM workflow outputs.*

1. Current code **does** inject 42-3 on Marx DLA prompts (`delivery_context: self_directed`) and 42-2 on Design Page prompts for all three briefs tested.
2. **Inflation and Climate page JSON** contain **no** `activity_preamble`, bridges, or cognition fields — any audit finding about missing activity exposition on these fixtures is **confirmed** and **not** an artefact-staleness illusion for those fields (they were never generated).
3. **Narrative progression, transition quality, closure, and page-level central inquiry** gaps remain on **all three** fixtures after capture.
4. **Inflation facilitator leakage** in learner `support_note` is **confirmed** in stale JSON.
5. **Marx structural progression** (model → compare → apply) and **materials depth** are **confirmed** independent of Sprint 42 prompt wiring.

### B. Findings that only applied to old fixtures

1. **Marx “procedural preamble” activity exposition** — applied to **git HEAD** committed fixture (`Study the model row…`, `No model row…`). Working-tree 42-3 hand-edit **does not** have procedural openings (`meetsAuthorialExposition: true`).
2. Treating Marx fixture as **evidence that 42-3 prompts automatically improve live DLA output** — **invalid**; improvement on benchmark is **manual fixture edit**, not workflow regeneration.
3. Implied **Design Page authorial assimilation** in Marx page JSON — **never testable** from this fixture; Marx page has no `overview`/`learning_purpose` and was not composed through a post-42-2 Design Page run.

### C. Findings that changed after regeneration

| Finding | Before (audit on mixed provenance) | After (provenance check) |
| ------- | ------------------------------------ | ------------------------ |
| Marx activity exposition gap | Reported as thin/procedural preambles | **Downgraded for working copy** — preambles now narrative; gap shifts to **bridges + page entry + closure** |
| Marx mandatory cognition on A2 | A2 lacked `reasoning_orientation` in pre-42-3 committed fixture | **Resolved in working copy** (hand-edit) |
| Inflation / Climate | Same | **Unchanged** — no regeneration |
| Primary gap characterisation | Layered: narrative progression + transitions + workshops missing exposition | **Still holds**; Marx **activity exposition** no longer primary gap **on hand-edited benchmark only** |

---

## 5. Recommendations (post-provenance; no new prompt work)

1. **Do not treat `tests/fixtures/page-render/*.json` as post–Sprint 42 workflow outputs** until manually re-run and saved under `captures/sprint-42-exposition/`.
2. **Run manual workflow capture** (Marx self-study, Inflation learner page, Climate learner handout) in PRISM UI with current working tree; store full DLA → GAM → Design Page chain.
3. **Commit Sprint 42 libs and wiring** before the next validation slice so provenance is traceable.
4. **Next implementation priority unchanged:** page-level narrative (`overview` / `learning_purpose` inquiry arc), bridge/transition upgrade, workshop framing regeneration, closure synthesis — **not** further Marx benchmark hand-edits.
5. Add optional CI step: `node tools/capture-sprint-42-4-provenance.js` + manifest drift check (prompt presence only).

---

## 6. EQF reference (fixtures unchanged except Marx working copy)

| Fixture | Score | Missing dimensions |
| ------- | ----- | ------------------ |
| Marx (working) | 7/8 | Learning Success |
| Inflation | 5/8 | Independence, Metacognition, Learning Success |
| Climate | 5/8 | Independence, Metacognition, Learning Success |

---

## Appendix: Marx preamble provenance (committed vs working)

| Activity | Git HEAD `activity_preamble` | Working tree (42-3 hand-edit) |
| -------- | ---------------------------- | ------------------------------ |
| A2 | Study the model row before completing the full comparison table. | Comparing two major works is not the same as summarising them… |
| A3 | The Manifesto row is modelled; add Das Kapital… | The Communist Manifesto and Das Kapital address capitalism from different angles… |
| A4 | No model row — apply checklist terms directly to the case. | After comparing Marx's writings, the harder test is whether his concepts explain a concrete workplace… |

See also: `captures/sprint-42-exposition/marx-preamble-before-after.json`
