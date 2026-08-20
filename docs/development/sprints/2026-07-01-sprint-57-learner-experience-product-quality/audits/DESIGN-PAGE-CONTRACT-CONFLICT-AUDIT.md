# Design Page Contract Conflict Audit (Sprint 57 Discovery)

**Status:** Evidence record  
**Date:** 2026-07-01  
**Method:** Static analysis of pack §13, runtime compose stack, augmentation gates, capture validators

---

## 1. Summary

| Severity | Count | Notes |
|----------|------:|-------|
| **High** (missing invoked authority) | 2 | LD-MATERIALS-COPY, LD-TABLE-FIDELITY named but not injected |
| **Medium** (competing guidance) | 5 | Wrapper synthesis vs materials verbatim; scaffold generation rules on compose |
| **Low** (documented carve-outs) | 3 | generation_notes limitations; visual additive-only; read-only compose |

Documented conflicts: **10**. None match pre-S56 DLA severity (competing word-range grids on identical emit fields with PRE-EMIT), but **governance drift** on materials/table modules is material.

---

## 2. Conflicting design guidance

### C-01 — Referenced modules not appended (HIGH)

**Tension:** Pack and compose contract require obedience to `LD-MATERIALS-COPY` and `LD-TABLE-FIDELITY`; augmentation path does not inject them for Design Page.

| Source | Statement |
|--------|-----------|
| Pack `promptTemplate` | “Canonical contracts (runtime modules; obey all): LD-MATERIALS-COPY… LD-TABLE-FIDELITY…” |
| Compose CORE_LINES | “Obey appended LD-MATERIALS-COPY, LD-TABLE-FIDELITY… — bodies not repeated here” |
| `applyLdMaterialsCopyContractToDraft` | Returns draft unchanged — GAM-only (`app.js` ~10137) |
| `applyLdTableFidelityContractToDraft` | Design Page falls through `return draftBody` (`app.js` ~10226) |

**Conflict:** Model receives **inline pack prose** for table/materials rules plus **deferral to modules that never arrive**. GAM path gets canonical module bodies; Design Page does not.

**Evidence paths:** `domain-learning-design-step-patterns.md` §13; `lib/ld-design-page-compose-contract.js` L30; `app.js` ~10134–10226.

---

### C-02 — Session synthesis vs verbatim materials (MEDIUM)

**Tension:** Wrapper sections should synthesise journey and closure; materials bodies must never be thinned.

| Source | Pull |
|--------|------|
| `LD-JOURNEY-ASSIMILATION` | Rich overview, learning_purpose, study_tips synthesis from upstream signals |
| Pack + compose | Materials are “hard constraints”; no truncation for output size |
| EQF + rhetoric | Epistemic closure and journey framing encourage substantive wrapper prose |

**Conflict:** Under token pressure, models may thin **either** wrapper prose **or** materials; prompt offers **no explicit priority order** beyond journey “never mutate materials.” `generation_notes.limitations` may record wrapper gaps but materials loss is forbidden — asymmetric error handling may confuse models.

**Evidence:** Journey CORE_LINES L28–29; compose MEMBERSHIP_LINES; pack “do not use generation_notes.limitations to excuse material-body loss.”

---

### C-03 — Read-only compose vs DLA generation scaffold (MEDIUM)

**Tension:** Design Page is “read-only composition”; LD-GUIDED-LEARNING-SCAFFOLD supplies DLA **generation** field rules and weak/strong exemplars.

| Source | Statement |
|--------|-----------|
| Pack template | “do not redesign pedagogy”; “Readable page assembly applies to section structure, headings, ordering, and wrapper prose only” |
| `applyLdGuidedLearningScaffoldContractToDraft` | `includeCompose: true`, `includeDlaPreEmit: false` → full FIELD_LINES + EXEMPLAR_LINES + COMPOSE_LINES (`app.js` ~9701–9704) |

**Conflict:** Compose step receives **authoring-quality floors** (50–120 word activity_preamble, exemplar pairs) for fields that should be **copied verbatim** from upstream — implies model may **rewrite** scaffold fields to meet floors instead of preserving upstream text.

**Evidence:** `lib/ld-guided-learning-scaffold.js` ~98–133, ~211–234; probe scaffold block 4,332 chars.

---

### C-04 — Depth vs brevity (LOW–MEDIUM)

| Source | Guidance |
|--------|----------|
| Journey OVERVIEW/PURPOSE | Substantive inquiry arc; avoid activity listing |
| Pack learner profile | “substantive pre-activity context”; “rich learning activities” |
| Compose membership | No omission for “output size, token limit, or model length” |
| JSON output contract | Large required page object (sections, episode_plans, visual_affordances) |

**Conflict:** Completeness and richness directives compete with practical JSON size — no explicit “prefer materials over wrapper brevity” except for materials bodies specifically.

---

### C-05 — Flexibility vs structure (LOW)

| Source | Guidance |
|--------|----------|
| Pack | “meaningful section headings”; canonical section_ids “when applicable” |
| EQF | Progressive independence framing |
| Sprint 38 | Strict enum sets for visual_decision, purpose, tier, representation_avoid tokens |

**Conflict:** Section structure is semi-flexible; visual affordance metadata is **strict**. Low severity — different sub-artefacts.

---

## 3. Competing pedagogic models

### P-01 — Multiple wrapper authorities (MEDIUM)

Three runtime modules claim wrapper/page-level prose shaping for the same sections:

| Module | Sections claimed |
|--------|------------------|
| LD-JOURNEY-ASSIMILATION | overview, learning_purpose, knowledge_summary, study_tips, transitions |
| LD-AUTHORIAL-EXPOSITION | Wrapper voice, preservation boundary |
| LD-SELF-DIRECTED-RHETORIC (design_page) | overview/learning_purpose/knowledge_summary/study_tips |

Module headers declare non-duplication (`journey-assimilation.js` L5: “Does not duplicate… LD-AUTHORIAL-EXPOSITION bodies”) but **emit path appends all three sequentially** (~8,849 chars combined). Rhetoric design_page rider explicitly defers to journey assimilation — **soft precedence only**.

---

### P-02 — Scaffold preservation vs scaffold generation (MEDIUM)

| Model A | Compose FIELD_PRESERVATION — copy verbatim |
| Model B | LD-GUIDED-LEARNING-SCAFFOLD — meet word floors, avoid weak patterns |

Same fields (`activity_preamble`, `reasoning_orientation`, etc.) governed by **preservation** and **generation quality** contracts simultaneously on one step.

---

### P-03 — Sequencing expectations (LOW)

| Source | Rule |
|--------|------|
| Pack | `learning_sequence` for order/timing; do not drop activities absent from sequence |
| Compose | learning_sequence order/timing only for membership |
| Journey | Assimilate transitions into wrapper only |

Aligned in intent; duplicate phrasing may yield inconsistent emphasis (sequence vs inquiry arc).

---

## 4. Output contract conflicts

### O-01 — Pack inline validation vs runtime capture validators (LOW)

Pack template ends with “Before returning JSON, validate: learning_activities.content is an array…” — same rules enforced again in `validatePageActivityClosure`, materials closure, episode closure on capture.

**Conflict type:** Duplicated obligation, not contradictory rules.

---

### O-02 — Strict JSON artefact contract absent (LOW)

`applyStrictJsonArtefactContractToDraft` has no `page` kind (`app.js` ~9217–9263). Pack says “Return JSON only” without strict-json module block. **No conflict** — pack owns JSON shape; strict lib simply not wired.

---

### O-03 — Visual affordances: additive vs required arrays (LOW)

| Source | Rule |
|--------|------|
| Compose / pack | `visual_affordances` additive — must not replace materials |
| Sprint 38 + pack output | `visual_affordance_schema_version`, `activities_visual_review`, `visual_affordances` **required** arrays (may be `[]`) |

**Conflict:** “Additive” semantics vs mandatory schema fields — resolved by empty arrays; wording may confuse.

---

### O-04 — Episode plans: structural metadata vs learner-facing prose (LOW)

Compose + pack: “episode plans are structural metadata — not learner-facing section prose.” Pack also requires Learning Activities section with “usable activity-linked content.” Clear when obeyed; risk if model dumps beats into section bodies (forbidden in two places).

---

### O-05 — Facilitated page_profile vs self-directed rhetoric gate (MEDIUM)

| Context | Behaviour |
|---------|-----------|
| `page_profile: facilitator` (pack option) | Run guidance, facilitation notes |
| Self-directed rhetoric gate | Skipped when not self-directed brief |

Facilitated **brief** skips rhetoric/compose stack; facilitated **page_profile** inside a self-directed workflow may still expect facilitator-oriented content — potential mismatch between brief gate and pack user option (edge case).

---

## 5. Conflict severity matrix

| ID | Topic | Pre-S56 DLA analogue | Design Page severity |
|----|-------|----------------------|---------------------|
| C-01 | Missing module injection | OUTPUT CONTRACT vs SSOT | **High** (governance drift) |
| C-03 | Generation rules on compose | PRE-EMIT + OUTPUT CONTRACT overlap | **Medium** |
| P-01 | Multiple wrapper authorities | Cognition + PEL + OUTPUT | **Medium** |
| C-02 | Synthesis vs verbatim | Materials vs session rhetoric | **Medium** (documented in 38B) |
| Others | — | — | Low |

---

## 6. Traceability

| Evidence | Path |
|----------|------|
| Module injection gates | `app.js` ~10134–10226 |
| Scaffold compose flags | `app.js` ~9701–9704 |
| Pack contracts list | `domain-learning-design-step-patterns.md` §13 `promptTemplate` |
| 38B table regression note | `38B-1-prompt-audit.md` §Table fidelity cross-step |
| Probe PRE-EMIT absence | `scripts/probe-design-page-s57-audit-metrics.js` `phraseCounts.PRE-EMIT: 0` |
