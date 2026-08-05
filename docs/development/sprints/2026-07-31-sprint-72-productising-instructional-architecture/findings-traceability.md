# Sprint 72 — Findings Traceability (Sprint 71 → destinations)

**Purpose:** Categorise every applicable carried-forward Sprint 71 finding or observation under a primary Sprint 72 destination.  
**Authority for evidence:** Sprint 71 [improvement-register.md](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/improvement-register.md) — **do not invent S71 IDs**; **do not rewrite S71 evidence**.  
**Opened:** 2026-07-31  
**Status:** Phase 0 complete; backlog rationalised (`S72-T-077`); Sprint 72 **CLOSED** 2026-08-05 — unfinished streams live in [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md). Keep Confirmed vs Partial distinct.

### Destination legend

| Code | Destination |
| ---- | ----------- |
| **A** | Platform / system responsibility |
| **B** | Workflow elicitation responsibility |
| **C** | Author-supplied evidence responsibility |
| **D** | Product / UX or renderer responsibility |
| **E** | Benchmark / methodology follow-up |
| **F** | No Sprint 72 action / already resolved / retained as evidence only |

Secondary destinations may be listed. For dual-routed items, follow the sub-route table — do not collapse into one destination.

---

## `S71-F-001` dual routing (one Sprint 71 ID — two Sprint 72 treatments)

**Do not rename or split the Sprint 71 ID.** `S71-F-001` remains one authoritative Confirmed Critical finding. Sprint 72 implements it as **dual-routed**:

| Sub-route | Concern | Destination | Ordered rule | Sprint 72 tasks |
| --------- | ------- | ----------- | ------------ | --------------- |
| **F-001-A** | **Evidence Sufficiency** as an instructional requirement — activities must be evidence-completable by default | **A** (primary for instructional requirement) | Platform first ensures activities are evidence-completable | `S72-T-010`, `S72-T-011`, `S72-T-015` |
| **F-001-B** | **Evidence availability / sourcing** — Prism must ask what exists, what may be generated illustratively, what must not be invented | **B** | Elicitation identifies genuinely missing evidence after platform defaults | `S72-T-033` (after Phase 1 map) |
| **F-001-C** | **Evidence availability / sourcing** — Prism cannot or must not generate the required material | **C** | Author-supplied artefacts only where generation is inappropriate | `S72-T-040`–`S72-T-044` |

**Order:** A → B → C. System-side Evidence Sufficiency remains the default; do not jump to author upload for problems the platform can solve.

---

## Instructional findings (`S71-F-*`)

| S71 ID | Concise finding | Validated status | Recurrence / importance | S71 attribution (summary) | Primary dest. | Secondary | Rationale | Proposed validation | Dependency | Initial S72 status |
| ------ | --------------- | ---------------- | ----------------------- | ------------------------- | ------------- | --------- | --------- | ------------------- | ---------- | ------------------ |
| S71-F-001 | Evidence sufficiency / authentic disciplinary evidence availability | Confirmed (Critical) | High recurrence (R-001…R-011 cluster) | GAM primary; DLA/MK/DEP; workflow elicitation for availability | **A** (Evidence Sufficiency instructional) | **B**, **C** (availability / sourcing) | Dual-routed: platform owns evidence-completable design; elicitation asks what exists; author supply only when generation inappropriate — see sub-routes above (`S72-D08`) | Matched regenerate with/without Layer-3 artefacts; Benchmark + Validation on evidence dimensions | Phase 1 (`T-015`); Phase 3 (`T-033`); Phase 4 (`T-040+`) | **Partial — slice implemented (uncommitted)** (F-001-A activity evidence; F-001-B DLA guidance T-076; F-001-C conversation_attachment; byte storage deferred `S72-D10`) |
| S71-F-002 | Feedback primarily criterion-based rather than diagnostic | Confirmed (High) | Confirmed + Partial across many reviews | Design Feedback primary | **A** | — | Platform can improve diagnostic distinctions system-side; do not require authors to restate feedback pedagogy each run | Regenerated resources with diagnostic-feedback slice; dimension-focused Benchmark + Validation | Phase 2 | **Partial — guided-review slice** (T-022) |
| S71-F-003 | Draft-saving communication may be unclear | Partially confirmed (Low) | 1 (R-001); not later | DLA | **F** | A (watch) | Low priority Partial; not observed later — retain evidence; no committed S72 work unless recurrence | N/A unless reopened | — | Deferred / evidence only |
| S71-F-004 | Competing interpretations limited / procedural rather than evidential | Confirmed (High) | Confirmed R-009; Partials earlier | DLA; DEP; GAM; MK | **A** | B | Platform Disciplinary Uncertainty / competing-interpretations principle; elicitation only if discipline intent unclear | Controlled regen; check plurality/evidence use dimensions | Phase 1/2 related | **Partial — evidence-centred + uncertainty constraints in slice** |
| S71-F-005 | Disciplinary uncertainty not consistently explicit / sustained | Partially confirmed (Medium) | Partial R-001, R-010 | DLA; GAM; MK; Design Feedback | **A** | — | Partial — do not inflate; productise Disciplinary Uncertainty sustainment across sequence | Dimension checks on uncertainty/plurality | Depends on F-004 work | **Partial** (unchanged Partial discipline) |
| S71-F-006 | Limited prompts requiring rejection of alternatives | Partially confirmed (Medium) | 1 (R-003) | DLA; GAM; DEP | **A** | — | Partial single-resource — candidate Layer-1 activity design; low commitment until recurrence | Optional stretch validation | Stretch | Deferred / stretch |
| S71-F-007 | Source diversity / source evaluation limited | Confirmed (Low severity; Medium priority) | Confirmed ×3; correctly **rejected** on literature R-010 | GAM; DLA; MK | **A** | E | Discipline-Appropriate Evidence Evaluation — platform; R-010 rejection informs methodology | Discipline-matched samples; do not import history provenance into literature | Phase 1 principles | Open |
| S71-F-008 | Scholarly perspectives generic / under-specified | Partially confirmed (Medium) | 1 (R-002) | GAM; MK; DLA | **A** | B | Partial — platform materials quality; elicitation if author has preferred scholarship | Stretch | Stretch | Deferred / stretch |
| S71-F-009 | Diagnostic evidence overly unambiguous | Confirmed (Medium) | 1 (R-004) | GAM; DLA; DEP | **A** | — | Ambiguous/conflicting evidence for professional judgement — materials + activity design | Regen diagnostic case materials; Validation on judgement under uncertainty | Related to F-004 | Open |
| S71-F-010 | Transfer lightly specified | Partially confirmed (Medium) | Partial R-004, R-005 | DLA; GAM; CLS | **A** | — | Partial cluster — transfer / modelling depth in activities | Dimension-focused transfer checks | Stretch after P1 | Deferred / stretch |
| S71-F-011 | Worked example under-explains key conceptual rule | Confirmed (Medium) | 1 (R-005) | GAM; DLA | **A** | — | Worked-example conceptual depth — GAM | Math worked-example regen + Validation | Distinct from O-004 (resolved) | Open |
| S71-F-012 | Later-stage prediction before calculation inconsistent | Partially confirmed (Medium) | 1 (R-006) | DLA; GAM | **A** | — | Partial — qualitative prediction before advanced calculation | Engineering sample regen | Stretch | Deferred / stretch |
| S71-F-013 | Worked-example variety / contrasting representations limited | Partially confirmed (Low) | 1 (R-006) | GAM; DLA | **A** | — | Partial — contrasting worked patterns | Stretch | Stretch | Deferred / stretch |
| S71-F-014 | Essential disciplinary representational artefacts underused (e.g. code) | Confirmed (High) | 1 Confirmed R-007; thematically linked literature via F-001 | GAM; DLA; MK | **A** | **D** | Platform must require first-class disciplinary artefacts; UX/renderer for code presentation (`S72-B-003`) | Programming resource regen; representation completeness checks | Phase 5 requirements; optional impl | **Deferred** (T-052 / B-003 not started) |
| S71-F-015 | Disciplinary representation pedagogically mistimed (premature disclosure) | Confirmed (High) | 1 (R-008) | GAM; DLA; Design Page if placement | **A** | — | Pedagogical Timing — scaffolding vs answer disclosure | Biology/osmosis-like regen; assessment-validity check | Phase 1/2 | **Partial — delayed-disclosure constraints in slice** |

---

## Observations (`S71-O-*`)

| S71 ID | Concise observation | Status | Ownership (S71) | Primary dest. | Secondary | Rationale | Proposed validation | Dependency | Initial S72 status |
| ------ | ------------------- | ------ | --------------- | ------------- | --------- | --------- | ------------------- | ---------- | ------------------ |
| S71-O-001 | Long activity titles abbreviated in nav/headings | Open (watch) | Renderer / UX | **D** | — | Product/UX nav (`S72-B-005`); not instructional prompt | UI acceptance: truncation, wrap, overflow, a11y, active visibility | Phase 5 | **Partial — nav fixes via T-056** |
| S71-O-002 | Malformed visual evidence anchors | **Resolved** | Producer / handoff; validator correct | **F** | — | Resolved in S71 — retain evidence only | N/A | — | No action |
| S71-O-003 | Orphaned placeholders / missing image (historical) | **Resolved** | Renderer / shell | **F** | — | Historical resolved — not outstanding | N/A | — | No action |
| S71-O-004 | Corrupted math TeX in GAM | **Resolved — regression verified** | GAM | **F** | — | Fixed + regression verified — do not reopen as active defect | Retain regression discipline if touching GAM math | — | No action (retain regression watch) |
| S71-O-005 | Semantic heading hierarchy inconsistent | **Open** | Renderer | **D** | A (if Design Page authors bad levels) | Keep renderer vs assembly vs Design Page distinct; ≤3 meaningful levels default | A11y / heading-outline checks on learner pages | Phase 5 | **Partial — heading hierarchy via T-056** |
| S71-O-006 | Pedagogically informed guidance steers quality; distinguish prompt-sensitive vs availability | Open (architectural insight) | Elicitation + contracts + author evidence | **A** | **B**, **C** | Principal S71 insight — frames entire sprint; not a single prompt fix | Owen-style matched comparisons remain the methodological gold standard | All phases | Open — architectural |

---

## Explicit minimum-treatment checklist

| Topic | Covered via | Destinations |
| ----- | ----------- | ------------ |
| `S71-F-001` evidence sufficiency / availability | Dual-route section + row above | **A** instructional; **B**/**C** availability |
| Diagnostic feedback | `S71-F-002` | A |
| Evidence-centred activity design | Evidence-Centred Learning umbrella + F-001-A | A (+ B/C for missing artefacts) |
| Disciplinary representation | `S71-F-014` + `S72-B-003` | A + D |
| Pedagogical timing | `S71-F-015` | A |
| Uncertainty / competing interpretations | `S71-F-004`, `S71-F-005`, `S71-F-009` | A |
| Source / evidence evaluation | `S71-F-007` | A (+ E for discipline-appropriate scoring) |
| `S71-O-005` semantic headings | Row above | D |
| `S71-O-006` steerability insight | Row above | A/B/C framing |
| Image consistency | `S72-B-001` (below) | D |
| Workflow image persistence | `S72-B-002` (below) | D |
| Code / programming support | `S71-F-014` + `S72-B-003` | A + D |
| Long-title navigation / scrolling | `S71-O-001` + `S72-B-005` | D |

---

## Sprint 72 backlog items (operator-noted — **not** Sprint 71 validated findings)

| S72 ID | Topic | Primary dest. | Related S71 | Rationale | Initial status |
| ------ | ----- | ------------- | ----------- | --------- | -------------- |
| S72-B-001 | Image consistency (shared run-level visual style) | **D** | — (operator) | Not an S71 Confirmed instructional finding | Discovery |
| S72-B-002 | Persist generated images in workflow data | **D** | — (operator) | Persistence / asset IDs / reconnect — not prompt richness | Discovery → path committed |
| S72-B-003 | Programming / code first-class support (highlighting, IO, traces, debug feedback) | **D** (+ **A** contracts) | Anchored by `S71-F-014` | Expand requirements beyond S71 observation | Requirements committed |
| S72-B-004 | Specialist representations architecture path (music, maths, chem, engineering) | **D** / architecture | Discovery | Do not implement all unless capacity + evidence | Discovery |
| S72-B-005 | Navigation bar long titles / overflow / scroll / a11y / responsive | **D** | Related `S71-O-001` | Expand acceptance criteria; attribute design vs assembly vs renderer | **Partial** (T-056 bounded fixes; T-055 acceptance open) |

---

## Reclassification rule

If a row’s primary destination must change during Sprint 72, record:

1. Previous destination  
2. New destination  
3. Rationale  
4. Decision ID (if binding)  

Do **not** silently reclassify. Keep Confirmed and Partially Confirmed distinct. Retain Resolved items under **F**.
