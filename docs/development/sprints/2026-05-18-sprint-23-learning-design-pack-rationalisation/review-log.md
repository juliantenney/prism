# Sprint 23 review log — Learning Design pack rationalisation

**Pack path:** `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/`  
**Date:** 2026-05-18  
**Status:** **Proposed / ready for charter** — bootstrap only

**Predecessor:** [`../2026-05-15-sprint-22-unified-workflow-settings/review-log.md`](../2026-05-15-sprint-22-unified-workflow-settings/review-log.md)

---

## 2026-05-18 — Bootstrap session

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R23-001 | Sprint 23 follows **Sprint 22** (unified Settings + LD metadata expansion) | Operational tuning exists; semantics coherence is next gap |
| R23-002 | Sprint 23 is **pack semantics / elicitation / metadata** — not runtime rewrite | Preserve Sprint 22 architecture |
| R23-003 | **Elicitation → initialisation** of structured state | Thesis: not sole authority over workflow semantics |
| R23-004 | **Domain pack as declarative pedagogy** | Pack declares; runtime interprets generically |
| R23-005 | **Design Assessment** is priority review area | Bespoke inheritance + assessment vocabulary spread |
| R23-006 | **PF bespoke-control audit** required | Converge `userOptions` + `app.js` branches with `*ParameterControls` |
| R23-007 | **Workflow vs step ownership** review required | Especially assessment params |
| R23-008 | **No mappingRule auto-controls** | Sprint 22 precedent preserved |
| R23-009 | Research pack **frozen** unless chartered | Continuity S1–S13 |
| R23-010 | No implementation in bootstrap | Documentation only |

### Artefacts created

| Artefact | Path |
|----------|------|
| Sprint 23 portable pack | `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/` |
| Fresh-chat bootstrap | [`GPT-bootstrap-sprint-23.md`](GPT-bootstrap-sprint-23.md) |
| Bootstrap alias | [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md) |
| Sprint context | [`SPRINT-CONTEXT.md`](SPRINT-CONTEXT.md) |
| Context snapshots placeholder | [`context-files/README.md`](context-files/README.md) |
| Bootstrap thesis | [`sprint-23-bootstrap.md`](sprint-23-bootstrap.md) |
| Index | [`sprint-23-index.md`](sprint-23-index.md) |
| Current state | [`CURRENT-STATE.md`](CURRENT-STATE.md) |
| Handover | [`HANDOVER.md`](HANDOVER.md) |
| Slice 23-1 placeholder | [`slice-23-1-charter.md`](slice-23-1-charter.md) |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **185+** passed, 0 failed expected (docs-only bootstrap; Sprint 22 floor **185**).

### Open questions (for Slice 23-1 charter)

1. Standard **`elicitation`** vocabulary across pack controls — reuse existing flags or extend?  
2. Minimum **runtime delta** to retire Design Assessment title/canonical branches?  
3. Should **`assessment_type`** migrate to workflow-level, step-level, or dual with precedence?  
4. Which PF **`userOptions`** blocks are redundant post–Sprint 22 metadata expansion?  
5. **`step_generate_learning_content`** — declare controls or document intentional exclusion?  
6. Cross-step **inheritance** — pack-declared vs runtime helper (`mapDesignAssessment*` functions)?  
7. Elicitation questions deferrable to **Settings-only** without blocking essentials?  

---

## 2026-05-18 — Slice 23-1 LD pack inventory + semantics matrix

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R23-011 | Slice 23-1 deliverable = **`ld-semantics-matrix.md`** | Single audit artefact for downstream slices |
| R23-012 | Confirmed DA control gap (2 Settings vs 5 PF vs 4 mapping targets) | Blocks pack rationalisation until 23-5/23-6 |
| R23-013 | Confirmed vocabulary split: `difficulty_profile`/`coverage_scope` (mapping) vs `difficulty_level`/`coverage_breadth` (PF + inheritance) | Runtime reads PF keys, not mapping target names |
| R23-014 | No pack or runtime edits in 23-1 | Audit-only charter |
| R23-015 | `assessment_required` documented as topology gate without `mappingRule` | Explains WGC/inference vs parameter model |

### Artefacts

| Artefact | Path |
|----------|------|
| Semantics matrix | [`ld-semantics-matrix.md`](ld-semantics-matrix.md) |
| Slice charter (closed) | [`slice-23-1-charter.md`](slice-23-1-charter.md) |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **188 passed**, 0 failed.

---

## 2026-05-18 — Slice 23-2 elicitation alignment + burden reduction

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R23-016 | Six posture vocabulary adopted (blocking, topology, initializer, settings-only, deferral, removal) | Consistent classification across 29 factors |
| R23-017 | `design_scope` / `input_strategy` = **initializer at brief** + **settings-only after synthesis** | Preserves synthesis gate; reduces refinement duplication in 23-6 |
| R23-018 | `assessment_required` = **topology gate** only (no mappingRule) | Matches WGC/inference behaviour |
| R23-019 | `assessment_type` / `assessment_total_items` mustAsk → **defer in refinement** when mapped (pack 23-6) | Addresses triple-ask with DA/Gen controls |
| R23-020 | No runtime elicitation removal in 23-2 | Plan-only slice |

### Artefacts

| Artefact | Path |
|----------|------|
| Elicitation alignment plan | [`ld-elicitation-alignment-plan.md`](ld-elicitation-alignment-plan.md) |
| Slice charter (closed) | [`slice-23-2-charter.md`](slice-23-2-charter.md) |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **188 passed**, 0 failed.

---

## 2026-05-18 — Slice 23-3 PF bespoke-control audit

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R23-021 | Audit **all 17** canonical LD steps, not DA-only | DA/Gen Items exemplify systemic PF ⊃ Settings pattern |
| R23-022 | **3 steps** at full PF ↔ Settings parity (Normalize, Model Knowledge, Define LO) | Reference pattern for 23-6 |
| R23-023 | Assessment inheritance B2–B7 **retire only after** pack key alignment (23-5/23-6) | Avoid runtime drift |
| R23-024 | `filterUserOptionsExcludingPackKeys` = **preserve** (generic, pack-driven) | Not bespoke |
| R23-025 | DLA `activity_pattern_mix` = inverse gap (Settings without PF) | 23-6 add PF option or drop control |
| R23-026 | No pack/runtime edits in 23-3 | Audit-only slice |

### Artefacts

| Artefact | Path |
|----------|------|
| PF bespoke audit | [`ld-pf-bespoke-control-audit.md`](ld-pf-bespoke-control-audit.md) |
| Slice charter (closed) | [`slice-23-3-charter.md`](slice-23-3-charter.md) |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **188 passed**, 0 failed.

---

## 2026-05-18 — Slice 23-4 workflow vs step parameter ownership

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R23-027 | **Design Assessment** = canonical assessment authority | Approved semantic model |
| R23-028 | **Generate Items** inherits from DA by default; explicit override wins | §5 inheritance doctrine |
| R23-029 | Six ownership classes: workflow, step, inherited, topology, artefact, prompt-local | Governance vocabulary |
| R23-030 | `assessment_required` = **topology-only** — not Settings | No mappingRule |
| R23-031 | Runtime inheritance **preserved** in 23-4 | Until 23-5/23-6 parity gates |
| R23-032 | Alias policy: unify `difficulty_profile`, `coverage_scope`, `duration_minutes` in 23-6 | PF/mapping/brief splits |
| R23-033 | No pack/runtime edits in 23-4 | Governance slice |

### Artefacts

| Artefact | Path |
|----------|------|
| Parameter ownership model | [`ld-parameter-ownership-model.md`](ld-parameter-ownership-model.md) |
| Slice charter (closed) | [`slice-23-4-charter.md`](slice-23-4-charter.md) |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **188 passed**, 0 failed.

---

## 2026-05-18 — Slice 23-5 Design Assessment semantics

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R23-034 | DA = **canonical assessment authority** | Approved model |
| R23-035 | `assessment_type` → **`activity_type`** remains **documented alias** | mappingRule stable; step key canonical |
| R23-036 | DA canonical keys: **`difficulty_profile`**, **`coverage_scope`**, **`total_items`** | Unify brief, mapping, output JSON |
| R23-037 | Gen: **`number_of_items`**, **`coverage_mode`**, **`response_formats`** with inheritance | Realisation layer |
| R23-038 | `feedback_display` (DA) ≠ `feedback_required` (Design Feedback) | Separate semantics |
| R23-039 | `cognitive_demand`, `assessment_cadence` → **DA step controls** in 23-6 | mappingRules target DA |
| R23-040 | Runtime inheritance preserved until gates §10.2 | No 23-5 code changes |
| R23-041 | Three-layer difficulty vocabulary documented for 23-6 enum map | Brief vs PF vs Gen |

### Artefacts

| Artefact | Path |
|----------|------|
| Design Assessment semantics | [`ld-design-assessment-semantics.md`](ld-design-assessment-semantics.md) |
| Slice charter (closed) | [`slice-23-5-charter.md`](slice-23-5-charter.md) |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **188 passed**, 0 failed.

---

## 2026-05-18 — Slice 23-6 Pack metadata rationalisation

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R23-042 | `stepParameterControls` count **25 → 39** (+14) | DA +5, Gen +9 per §11 |
| R23-043 | DA PF ids aligned to controls; template placeholders updated | `filterUserOptionsExcludingPackKeys` pattern |
| R23-044 | Gen Items controls **`settings-only`** elicitation | Operational authority post-synthesis |
| R23-045 | `assessmentPolicy` declared in pack | Documents authority + inheritance rows |
| R23-046 | Minimal runtime: read `difficulty_profile`/`coverage_scope` with legacy fallback | Pack canonical keys; helpers preserved |
| R23-047 | `extraFields` delivery_context removed; `workflowParameterControls` retained | Safe dedupe |
| R23-048 | Construct Sequence PF `duration_minutes` id aligns step control | Low-risk naming fix |

### Artefacts

| Artefact | Path |
|----------|------|
| LD pack (implemented) | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Slice charter (closed) | [`slice-23-6-charter.md`](slice-23-6-charter.md) |
| Tests | `tests/workflow-step-parameter-controls.test.js` (+7 cases) |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **195 passed**, 0 failed.

---

## 2026-05-18 — Sprint 23 closeout

### Summary

| Item | Value |
|------|-------|
| **Sprint 23** | **Complete** |
| **Slices** | **23-1–23-6** closed |
| **Tests** | **195 passed**, 0 failed |

### Closeout decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R23-049 | Sprint 23 programme **complete** | All chartered slices delivered |
| R23-050 | Governed declarative LD pack semantics is the sprint outcome | Emergent → documented + applied metadata |
| R23-051 | Runtime inheritance **retained**; retirement deferred | Parity gates §10.2 not yet chartered |
| R23-052 | Research packs, Settings UI, provenance, workflow graph **unchanged** | Explicit non-goals honoured |

### Artefacts

| Artefact | Path |
|----------|------|
| Sprint closeout | [`sprint-23-closeout.md`](sprint-23-closeout.md) |
| Current state | [`CURRENT-STATE.md`](CURRENT-STATE.md) |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **195 passed**, 0 failed.

---

## Status

**Sprint 23 complete.** Slices **23-1–23-6** closed. Optional follow-up: runtime inheritance retirement charter when parity gates §10.2 are met; renderer/v1 UX; cross-pack consistency.





