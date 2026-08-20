# Design Page Duplication Audit (Sprint 57 Discovery)

**Status:** Evidence record  
**Date:** 2026-07-01  
**Method:** Phrase counting via probe + static comparison of pack §13 vs runtime compose stack

---

## 1. Executive duplication estimate

| Metric | Estimate |
|--------|----------|
| Augmented prompt size | 44,386 chars |
| Thematic duplication footprint | **14,000–20,000 chars** (32–45% of augmented) |
| Primary clusters | Pack↔compose materials/membership/episode; journey↔rhetoric wrapper; scaffold DLA generation rules on compose path |

Probe phrase evidence: `verbatim` ×18, `activity.materials` ×27, `episode_plans` ×16 — high recurrence of preservation themes across pack and runtime blocks.

---

## 2. Duplicate guidance

### 2.1 Activity design / materials fidelity

Repeated in:

| Location | Content |
|----------|---------|
| Pack `promptTemplate` | “copy learner-facing delivery content verbatim into activity.materials.*”; inflation-collapse FAIL substitutes; forbidden placeholders |
| `LD-DESIGN-PAGE-COMPOSE` MEMBERSHIP_LINES + MATERIALS_BRIDGE | “copy the full materials object”; “no synopsis, reference-only, placeholder” |
| `LD-JOURNEY-ASSIMILATION` CORE_LINES | “never rewrite, compress, or mutate activity.materials.* bodies” |
| `LD-GUIDED-LEARNING-SCAFFOLD` COMPOSE_LINES | “copy verbatim from GAM; do not produce GAM-lite synopsis” |
| Pack `defaultPromptNotes` | “MATERIALS FIDELITY (hard): obey LD-DESIGN-PAGE-COMPOSE-CONTRACT” |

**Estimated overlap:** ~3,500–4,500 chars (pack materials section ~2.8k overlaps compose ~1.2k materials lines + bridge).

### 2.2 Activity membership

Repeated in:

| Location | Content |
|----------|---------|
| Pack template | “every upstream activity_id”; `generation_notes.activities_omitted[]` |
| Compose MEMBERSHIP_LINES | Same closure rule with authority types |
| Pack pre-return checklist | “(U \ X) ⊆ C”; activities_omitted validation |
| Capture `validatePageActivityClosure` | Runtime enforcement of same rule |

**Estimated overlap:** ~800–1,200 chars (prompt-side only).

### 2.3 Episode plans portable schema

Repeated in:

| Location | Content |
|----------|---------|
| Pack template | Top-level `episode_plans[]` + per-activity `episode_plan`; verbatim beats |
| Compose EPISODE_PLAN_LINES | Identical structural requirements (~6 bullet groups) |
| Pack `defaultPromptNotes` | “Portable schema: when upstream episode_plans exist…” |

**Estimated overlap:** ~1,000–1,400 chars.

### 2.4 Sequencing / wrapper transitions

Repeated in:

| Location | Content |
|----------|---------|
| Pack template | `learning_sequence` timeline; assimilate `transition_to_next` into overview/study_tips |
| `LD-JOURNEY-ASSIMILATION` TRANSITION_LINES | 30–60 word conceptual continuity; forbidden scheduling-only transitions |
| `LD-GUIDED-LEARNING-SCAFFOLD` TRANSITION_LINES | Same 30–60 word rule; `intellectual_coherence_bridge` |
| `LD-SELF-DIRECTED-RHETORIC` design_page rider | “Journey assimilation… inquiry arc, transitions, closure synthesis” |

**Estimated overlap:** ~1,200–1,800 chars.

### 2.5 Learner engagement / wrapper rhetoric

Repeated in:

| Location | Content |
|----------|---------|
| Pack learner profile bullets | Substantive overview, learning_purpose, knowledge_summary |
| `LD-JOURNEY-ASSIMILATION` OVERVIEW/PURPOSE/CLOSURE | Detailed wrapper composition rules |
| `LD-AUTHORIAL-EXPOSITION` | Wrapper voice, stakes, tension |
| `LD-SELF-DIRECTED-RHETORIC` WRAPPER_RHETORIC_LINES | Session synthesis, epistemic closure |
| EQF design_page slice | Journey and judgement framing |

**Estimated overlap:** ~2,000–3,000 chars (semantic, not literal).

### 2.6 Scaffolding / field preservation

Repeated in:

| Location | Content |
|----------|---------|
| Compose FIELD_PRESERVATION_LINES | Field ID list + verbatim copy rule |
| `LD-GUIDED-LEARNING-SCAFFOLD` FIELD_LINES | Per-field word ranges and FORBIDDEN patterns (DLA generation oriented) |
| Compose + scaffold | `intellectual_coherence_bridge` preservation stated twice |

**Estimated overlap:** ~2,500–3,500 chars. **Misplaced authority:** full DLA FIELD_LINES + EXEMPLAR_LINES on compose path (`includeCompose: true`, `includeDlaPreEmit: false`) — 4,332 char block includes generation exemplars not required for read-only assembly.

### 2.7 Assessment integration

| Location | Overlap |
|----------|---------|
| Pack template | `assessment_check.content.items[]`; MCQ stem/options rules |
| Compose contract | Assessment preservation in MEMBERSHIP_LINES only |

**Estimated overlap:** ~400 chars — low duplication.

### 2.8 EQF alignment

Single inject path (EQF block). Journey closure and rhetoric epistemic synthesis **semantically** overlap EQF judgement dimension (~500 chars).

### 2.9 Visual affordances

| Location | Content |
|----------|---------|
| Pack template | “VISUAL AFFORDANCES: mandatory page-root metadata only — full Sprint 38… in runtime contract” |
| Compose CORE_LINES | “visual_affordances[] additive only” |
| Sprint 38 block | Full schema + 3 JSON examples (~5,476 chars) |

Pack pointer is intentional deferral; **not** full duplication of Sprint 38 body. Additive-only rule duplicated ~3× (~300 chars literal).

### 2.10 Table / materials module naming

Pack template names `LD-MATERIALS-COPY` and `LD-TABLE-FIDELITY` with full inline rules (~1,500 chars). Compose contract says “obey appended… bodies not repeated here” but modules **not appended**. **Duplicate obligation without single runtime owner** — pack carries table rules that GAM path owns via LD-TABLE-FIDELITY.

---

## 3. Duplicate examples

| Example type | Count | Chars (est.) | Duplication note |
|--------------|------:|-------------:|------------------|
| Sprint 38 JSON exemplars (generate/reject/defer) | 3 | ~2,400 | Unique to visual contract — not duplicated elsewhere |
| LD-GUIDED-LEARNING-SCAFFOLD weak/strong pairs | 4 pairs | ~1,100 | **Misplaced on compose** — DLA generation pedagogy |
| Pack inflation-collapse FAIL substitutes | 6+ patterns | ~800 | Overlaps compose “no synopsis” themes |
| Full page JSON example on emit | 0 | 0 | Healthier than pre-S56 DLA |

**Duplicate exemplar footprint:** ~800–1,100 chars literal misplaced scaffold exemplars.

---

## 4. Duplicate validation

| Check | Prompt-side | Capture-side |
|-------|-------------|--------------|
| Activity membership (U \ X) ⊆ C | Pack pre-return checklist + compose MEMBERSHIP | `validatePageActivityClosure` |
| Materials body presence | Pack + compose verbatim rules | `validatePageMaterialsClosureFromLib` + GAM preserve overlay |
| Episode plan alignment | Pack + compose EPISODE_PLAN_LINES | `validatePageEpisodePlansClosure` |
| Activity field thinning | LD-GUIDED-LEARNING-SCAFFOLD word floors (generation) | `validatePageActivityFieldClosureFromLib` |
| Visual affordance schema | Sprint 38 prompt rules + JSON examples | `applySprint38VisualAffordancesToComposedPage` strictValidation |
| Facilitator field leak | Rhetoric + pack learner profile | `sanitizeSelfDirectedLearnerPageActivityRows` |
| JSON shape | Pack output section | `validateStrictJsonWorkflowRunStepCapture` |

**No PRE-EMIT gate** on Design Page emit (probe: `PRE-EMIT` ×0). Validation duplication is **prompt checklist vs capture closure validators**, not dual emit-time gates.

**Estimated validation duplication:** ~1,000–1,500 chars (pack pre-return checklist mirrors capture validators).

---

## 5. Comparison to peer steps

| Duplication pattern | DLA pre-S56 | GAM pre-remediation | Design Page now |
|---------------------|-------------|---------------------|-----------------|
| Pack + runtime same concern | OUTPUT CONTRACT + SSOT + cognition | GAM-PRES + SP blocks | Pack template + compose stack |
| Word-range on compose | N/A (generation) | N/A | Scaffold FIELD_LINES on compose path |
| Referenced module not injected | — | — | **LD-MATERIALS-COPY, LD-TABLE-FIDELITY** |
| JSON exemplars on emit | Yes (~3k) | No | 3 Sprint 38 row exemplars (~2.4k) |
| PRE-EMIT duplicate gate | Yes | No | No |

Design Page duplication is **pack-heavy** (24.6% of prompt is pack template restating runtime compose) — structurally different from GAM’s SP-stack duplication, **similar in footprint** to GAM pre-remediation (~32–45% estimated).

---

## 6. Rationalisation targets (evidence-ranked)

| Priority | Target | Est. savings |
|----------|--------|-------------:|
| 1 | Thin pack `promptTemplate` to pointers (defer to LD-DESIGN-PAGE-COMPOSE) | 4,000–6,000 chars |
| 2 | Compose-path scaffold: use compact preservation-only block, drop DLA EXEMPLAR_LINES | 2,000–2,500 chars |
| 3 | Dedupe journey ↔ rhetoric wrapper transitions | 800–1,200 chars |
| 4 | Resolve materials/table module injection OR remove pack inline rules | Governance fix + 1,000–1,500 chars |
| 5 | Abbreviate Sprint 38 JSON examples (keep schema rules) | 1,000–1,500 chars |

---

## 7. Traceability

| Evidence | Source |
|----------|--------|
| Phrase counts | `scripts/probe-design-page-s57-audit-metrics.js` |
| Block sizes | Probe `blockSizes`, `incremental` |
| Pack template | `domain-learning-design-step-patterns.md` §13 `promptTemplate` |
| Compose lines | `lib/ld-design-page-compose-contract.js` |
| Scaffold compose mode | `lib/ld-guided-learning-scaffold.js` ~211–234 |
| 38B duplication themes | `38B-1-prompt-audit.md` §Cross-step duplication |
