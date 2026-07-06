# Sprint 56C — Wave 2 Assembly-Coherence Discovery

**Sprint:** 56C — Design Page Migration Execution  
**Wave:** 2 — Boundary refactoring (discovery only)  
**Date:** 2026-07-06  
**Status:** Analysis complete — **superseded for implementation target by** [Thin Bridge Definition](SPRINT-56C-WAVE-2-THIN-ASSEMBLY-COHERENCE-BRIDGE-DEFINITION.md)

**Authority:** [Wave 1 Closure Summary](SPRINT-56C-WAVE-1-CLOSURE-SUMMARY.md) · [CP-4 Brief](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-CP-4-ARCHITECTURE-APPROVAL-BRIEF.md) · [Architecture Guardrails](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-ARCHITECTURE-GUARDRAILS.md) · [Assembly-Time Ownership Test](../2026-07-06-sprint-56b-design-page-migration-planning/DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) (OQ-02) · [Generation Visibility Constraint](SPRINT-56C-GENERATION-VISIBILITY-CONSTRAINT.md)

**Method:** Static inspection of post–Wave 1 runtime prompt path (`app.js`), compose libs (`lib/ld-*`), domain pack §13, post-compose repair/validation, and governance inventory (R-40, R-44, R-45, R-47, R-83). No code changes. No runtime validation claims.

---

## Executive summary

After Wave 1, Design Page is **transport-first**. The triple wrapper stack, EQF, VA authoring, synthesis mandates, and brevity shaping are removed from the emit path.

What remains falls into three buckets:

| Bucket | Post–Wave 1 state |
| ------ | ------------------- |
| **Preserve & embed (Layer 1)** | Fully implemented and heavily contracted — compose, materials-copy, table-fidelity, field preservation, episode-plan transport |
| **Organise (Layer 2)** | Fully implemented — schema, membership, ordering, section slots, profile, provenance |
| **Bounded assembly-coherence (Layer 3)** | **Partially specified only** — R-40 is a **label** in compose/domain; R-44, R-45, R-47 exist in **lib soak** (authorial module) but are **not injected**; R-83 is **partially** enforced via anti-condense guardrails but not narrowed to the approved delimiter wording everywhere |

**Wave 2 discovery finding:** The approved **single thin assembly-coherence bridge** (CP-4 D6 / OQ-09) does **not yet exist** as a consolidated contract. Wave 1 removed the rejected stack; Wave 2 must **define and bound** what legitimately remains — not restore removed modules.

---

## Discovery questions — answers

| # | Question | Answer (summary) |
| - | -------- | ---------------- |
| 1 | What assembly-coherence responsibilities still exist today? | **One explicit pointer** (R-40 label on `overview` / `learning_purpose`); **implicit** section-heading organisation; **guardrail overlap** with R-83 via F40 anti-condense. R-44/R-45/R-47 **not on DP path**. |
| 2 | Which are truly assembly-time dependent? | **Thin** cross-activity navigation framing in `overview` / `learning_purpose` when upstream does not supply prose **and** final membership/order is known. **Not** activity-row bridges (`intellectual_coherence_bridge`), material bodies, or knowledge substance. |
| 3 | Which could be relocated upstream? | `intellectual_coherence_bridge`, `activity_preamble`, cognition scaffolds → **DLA**; `transition_to_next` / phase framing → **learning_sequence** or **LC**; `knowledge_summary` / `study_tips` bodies → **LC/KM/GAM** (transport-or-omit); inquiry arc substance → **LC/LO**. |
| 4 | Which are merely transport and not assembly-coherence? | GAM `materials.*`, DLA activity-row fields, episode plans, assessment items, knowledge_summary when LC/KM bound, study_tips when GAM provides closure bodies, `learning_purpose` when LO/LC provides body. |
| 5 | Which are required for readability after multi-source assembly? | **Layer 2 structure** (membership, order, headings, self-contained page) — **R-83 narrowed**; optional **thin** wrapper pointers (where to start, how activities connect at page level) — **R-40** only if upstream transport absent. **Not** prose optimisation of payloads. |
| 6 | Smallest defensible Design Page responsibility set? | **Preserve → Organise → (optional thin assembly-coherence) → Guardrails**. Generative prose limited to navigation/sequencing/structural framing that passes T3 and §4 Allowed; everything else transport-or-omit. |

---

## Section 1 — Current residual Design Page responsibilities

### 1.1 Responsibility inventory (post–Wave 1)

| ID | Responsibility | Current location | On DP runtime path? | Layer | Purpose |
| -- | -------------- | ---------------- | --------------------- | ----- | ------- |
| **R-01–R-09** | Page schema, `artifact_type`, profiles, section model | `domain-learning-design-step-patterns.md` §13; `ld-design-page-compose-contract.js` | Yes | 2 | Self-describing page JSON for renderer |
| **R-17–R-23** | GAM material embed, multi-material enumeration, opaque payload | `ld-materials-copy.js`; embedded in compose | Yes | 1 | Verbatim transport of GAM `Content:` bodies |
| **R-24, R-22** | Complete payload; materials override optimisation | `ld-materials-copy.js` PREC-02, FULL CONTENT BODY, F40 lines; compose `UPSTREAM_CONSUMPTION_LINES` | Yes | Guardrail | Prevent condensation/synopsis substitution |
| **R-27–R-31** | Activity membership, field preservation, sequence order reference | `ld-design-page-compose-contract.js` `MEMBERSHIP_LINES`, `FIELD_PRESERVATION_LINES` | Yes | 1–2 | Closure of upstream activity set on page |
| **R-40** | Wrapper transition / thin assembly-coherence | `FIELD_AUTHORIZING_LINES` (compose); `ld-materials-copy.js` ARCHIVAL; domain §13 notes/template | **Label only** — no dedicated contract block | 3 (intended) | Pointer: overview/learning_purpose may carry thin continuity |
| **R-44** | Rhetorical role separation (one job per wrapper section) | `lib/ld-authorial-exposition.js` `ROLE_SEPARATION_LINES` | **No** — module not injected (Wave 1) | 3 (soak) | Was authorial stack; candidate for thin bridge merge |
| **R-45** | Transition quality across page arc | `lib/ld-authorial-exposition.js` `TRANSITION_LINES` | **No** | 3 (soak) | Same |
| **R-47** | Anti-redundancy across wrapper slots | `lib/ld-authorial-exposition.js` `ANTI_REDUNDANCY_LINES` | **No** | 3 (soak) | Same |
| **R-46, R-50** | Preservation boundary (wrapper vs archival) | `ld-materials-copy.js` TRANSPORT VS ARCHIVAL; compose field preservation | Yes (as constraint) | Guardrail | Wrapper must not rewrite activity rows/materials |
| **R-61–R-64** | Episode plan transport | `ld-design-page-compose-contract.js` `EPISODE_PLAN_LINES` | Yes | 1–2 | Portable choreography metadata on page |
| **R-66–R-69** | Assessment transport | Compose membership + domain template | Yes | 1 | `assessment_check` when upstream provided |
| **R-70** | `knowledge_summary` section slot | Domain canonical `section_ids`; compose transport-or-omit | Yes (organisational) | 2 | Slot exists; body transport-or-omit (OQ-17) |
| **R-83** | Readable assembly scope | Partial: F40 anti-condense in L4; domain still says “readable page” | **Partial** | Guardrail | Delimiter not fully codified as standalone rule |
| **R-10, R-73** | Context access / upstream consumption | Compose `CONTEXT_ACCESS_RULE_LINES` | Yes | Plumbing | Copilot conversation history consumption |
| **—** | Table fidelity (L4) | `ld-table-fidelity.js` embedded in compose | Yes | 1 | Pipe-table preservation |
| **—** | Math render (L7) | `ld-math-render.js` on augment path | Yes | Presentation | Notation preservation |
| **—** | Guided scaffold compose preservation | `ld-guided-learning-scaffold.js` `composeOnly` slice via `app.js` | Yes | 1 | Do not compress DLA scaffold fields on compose |
| **—** | Post-compose repair | `app.js` `repairLearnerPageCompositionFromUpstream`, `mergeUpstreamCognitionFieldsIntoPageActivities` | Yes (PRISM tier) | Quality | Restore omitted activities/fields from upstream — not generative |
| **—** | Composition validators | `app.js` page closure, episode-plan closure, activity-field preserve checks | Yes | Quality | Structural completeness — not authoring |
| **—** | Strict JSON contract | `workflow-artefact-json-strict` augmentation | Yes | Plumbing | Artefact shape |

### 1.2 Removed from path (Wave 1 — not residual ownership)

Journey assimilation, authorial exposition injection, rhetoric, EQF, VA authoring, `knowledge_summary`/`study_tips` synthesis, brevity params, mandatory schema 38.4 / `source_basis` on default path. Lib modules may remain for evaluators; **not emitted** on Design Page.

### 1.3 Per-responsibility assessment (assembly-coherence focus)

| ID | Ownership assessment | Recommendation | Rationale |
| -- | --------------------- | -------------- | --------- |
| **R-40** | **Approved DP assembly-owned (thin)** — T3 Yes for wrapper placement when membership final; currently **under-specified** | **Keep** — implement as **single thin bridge** in Wave 2 (W2.3) | CP-4 D6; only remaining generative Layer 3 obligation. Must not restate materials or DLA scaffolds. Prefer upstream transport first. |
| **R-44** | Assembly-level structural discipline — **not** instructional | **Relocate into thin bridge** (merge, do not re-inject authorial module) | One job per section is editorial guardrail, not separate generative stack. |
| **R-45** | Bounded arc continuity — overlaps R-40; was over-broad in authorial module | **Relocate into thin bridge** — cap volume; disallow instructional explanations | Assembly-Time Test §4 disallowed table rejects teaching in wrapper. |
| **R-47** | Anti-redundancy across wrapper slots — assembly-visible dedup | **Relocate into thin bridge** — structural dedup only | Prevents overview/learning_purpose duplication; not a licence to rewrite archival fields. |
| **R-83** | **Guardrail**, not generative identity — Layer 2 delimiter | **Keep narrowed** — Wave 2.5 explicit wording; remove “readable” optimise licence from domain | Consolidation §6 approved definition; failure mode A driver when read broadly. |
| **R-38** (`learning_purpose`) | Upstream-owned substance; T3 partial | **Transport** — thin assembly only when no upstream body | Assembly-Time Test §6 R-38 worked example. |
| **R-37** (`overview`) | Split: transport vs thin navigation | **Split** — transport LC/LO substance; optional thin R-40 framing only | Risk of mode A front-loading if generative mandate too strong. |
| **`intellectual_coherence_bridge`** | **DLA-owned** — T3 No on DP | **Transport only** — already in field preservation list | Per-activity continuity authored at DLA; DP must not assimilate into wrapper. |
| **`learning_sequence` transitions** | **LS-owned** | **Transport** to overview/study_tips when present; **no** assimilation mandate | Journey module removed; TRANSITION_LINES in scaffold not on DP `composeOnly` path. |
| **Section headings** | Layer 2 organisation | **Keep** — organisation only, no new substance | R-04 boundary; compose says “section headings — organisation only”. |
| **Episode plans** | Structural metadata transport | **Keep** — not learner-facing prose | EPISODE_PLAN_LINES: do not dump beats into section bodies. |

---

## Section 2 — Assembly-time ownership analysis

Source: [Assembly-Time Ownership Test](../2026-07-06-sprint-56b-design-page-migration-planning/DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) (OQ-02 resolution).

### 2.1 Decision rule application

| Category | T1 upstream? | T2 material body? | T3 assembly-dependent? | DP obligation post–Wave 1 |
| -------- | ------------- | ----------------- | ------------------------ | ------------------------- |
| GAM `materials.*` | Yes | Yes | No | **Transport only** (Layer 1) |
| DLA scaffold fields | Yes | No (row fields) | No | **Transport only** (Layer 1) |
| `knowledge_summary` | Often (LC/KM) | No | No | **Transport-or-omit** (OQ-17) |
| `study_tips` | Often (GAM closure) | Partial | No for substance | **Transport-or-omit** |
| `overview` / `learning_purpose` | Partial | No | **Yes** for thin framing | **Transport first**; thin R-40 only if gap |
| Cross-activity page arc | Partial | No | **Yes** | **Bounded** R-40/R-45 in thin bridge |
| Section role discipline | N/A | No | **Yes** at assembly | **R-44/R-47** in thin bridge |
| Page structure/readability | N/A | No | **Yes** at assembly | **R-83** guardrail (non-generative) |

### 2.2 Truly assembly-time dependent (legitimate DP candidates)

| Responsibility | Why assembly-time | Volume cap | Hard constraints |
| -------------- | ------------------- | ---------- | ---------------- |
| **Activity membership closure** | Final set C only known after upstream binding | N/A (structural) | `(U \ X) ⊆ C`; `activities_omitted[]` authority |
| **Section ordering** | Composed order may differ from upstream ids | N/A | `learning_activities.content[]` authoritative sequence |
| **Thin wrapper navigation** | “What this page contains / where to start” after membership fixed | **Thin** — must not compete with GAM token budget | No instructional explanations (§4 disallowed) |
| **Optional cross-activity pointer** | Dependencies visible only after compose | **Thin** — prefer transport `transition_to_next` | No scheduling-only transitions |
| **Wrapper slot deduplication** | Same substance must not appear in overview + learning_purpose | Editorial | Must not delete transported upstream bodies |

### 2.3 Not assembly-coherence (common misclassification)

| Surface | Why not assembly-coherence | Correct classification |
| ------- | ---------------------------- | ---------------------- |
| `intellectual_coherence_bridge` | Authored per activity at DLA for learner row context | **Transport** (Layer 1) |
| `activity_preamble` | DLA orientation prose | **Transport** |
| `knowledge_summary` body | LC/KM substance | **Transport-or-omit** |
| `study_tips` body | GAM consolidation/transfer material | **Transport-or-omit** |
| Episode plan beats | Upstream choreography spec | **Transport** (metadata) |
| Materials fidelity rules | Constraint on copy behaviour | **Guardrail** (R-22, R-24, R-83) |
| Post-compose repair | PRISM tier restoration | **Quality layer** (C10; OQ-24 policy) |

### 2.4 Gap analysis — approved vs as-built

| Approved target (CP-4) | As-built after Wave 1 | Gap |
| ---------------------- | ---------------------- | --- |
| Single thin assembly-coherence bridge (D6) | R-40 **label** only; R-44/45/47 in **uninjected** lib | **W2.3** — consolidate into one bounded block |
| R-83 Layer 2 delimiter only | F40 + materials rules enforce anti-condense; domain “readable page” lingers | **W2.5** — align domain + explicit delimiter |
| No triple stack | **Achieved** | None |
| Transport-or-omit (OQ-17) | **Achieved** in compose + domain | **W2.4** — SQ-1/SQ-2 upstream packaging |

---

## Section 3 — Candidate relocations

### 3.1 Relocate upstream (substance ownership)

| Concern | From (historical DP) | To | Wave 2 package |
| ------- | -------------------- | -- | -------------- |
| Per-activity continuity | Wrapper assimilation / journey | **DLA** `intellectual_coherence_bridge` | Affirm transport (W2.1) |
| Session transitions | Journey `TRANSITION_LINES` | **learning_sequence** `transition_to_next` | SQ-1 packaging |
| Inquiry arc substance | Overview authoring | **LC / LO** | SQ-2 |
| Knowledge preview body | DP synthesis | **LC/KM** | W2.4 (OQ-17) |
| Closure / study tips body | DP synthesis | **GAM** materials | W2.1 affirmation |
| Learning purpose narrative | DP authoring | **LO/LC** | W2.6 |
| Facilitator logistics | DP invention | **Profile policy + upstream** | W2.7 (SQ-F1) |

### 3.2 Relocate into thin bridge (structural guardrails only)

| Historical module | Lines | Relocation target |
| ----------------- | ----- | ----------------- |
| `LD-AUTHORIAL-EXPOSITION` ROLE_SEPARATION | R-44 | Thin assembly-coherence contract |
| `LD-AUTHORIAL-EXPOSITION` TRANSITION | R-45 | Thin bridge — bounded, no instructional voice |
| `LD-AUTHORIAL-EXPOSITION` ANTI_REDUNDANCY | R-47 | Thin bridge — wrapper slots only |
| `LD-JOURNEY-ASSIMILATION` TRANSITION | R-40 overlap | **Do not restore** — extract transport-first rule only |
| `LD-GUIDED-LEARNING-SCAFFOLD` TRANSITION | R-53 duplicate | **Keep off DP** — DLA path only (already `composeOnly`) |

### 3.3 Keep on Design Page (no relocation)

| Item | Reason |
| ---- | ------ |
| Compose + L4 preserve embed | Core Layer 1 identity |
| Membership / schema / episode-plan transport | Core Layer 2 |
| F40 / PREC-02 / R-83 anti-condense | Guardrails — not relocation candidates |
| Post-compose repair (PRISM) | Quality tier — separate from generative ownership |

---

## Section 4 — Minimal Design Page responsibility model

### 4.1 Three-layer target (post–Wave 1, pre–Wave 2 implementation)

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1 — Preserve & Embed (non-generative)                │
│  GAM materials, DLA fields, episode plans, assessment,      │
│  knowledge_summary/study_tips WHEN upstream provides body   │
├─────────────────────────────────────────────────────────────┤
│  Layer 2 — Organise (non-generative)                        │
│  Schema, page_profile, membership, order, section slots,    │
│  headings, source_artefacts, generation_notes, R-83 delim   │
├─────────────────────────────────────────────────────────────┤
│  Layer 3 — Bounded assembly-coherence (thin generative)     │
│  OPTIONAL thin overview/learning_purpose navigation only    │
│  where T3=Yes AND upstream transport absent                 │
│  + role separation / anti-redundancy as CONSTRAINTS         │
│  (single consolidated bridge — Wave 2 deliverable)        │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Smallest defensible responsibility set

| # | Responsibility | Generative? | Required? |
| - | -------------- | ----------- | --------- |
| 1 | Verbatim embed of upstream educational payloads | No | **Yes** |
| 2 | Activity membership and ordering | No | **Yes** |
| 3 | Page schema and profile-aware section structure | No | **Yes** |
| 4 | Transport-or-omit for optional sections (OQ-17) | No | **Yes** |
| 5 | Anti-condense / complete-payload guardrails (R-22, R-24, R-83) | No | **Yes** |
| 6 | Thin assembly-coherence for wrapper slots (R-40, R-44, R-45, R-47) | **Minimal** | **Optional** — only when upstream does not supply and T3 passes |
| 7 | Post-compose PRISM repair/validation | No | **Yes** (quality tier) |

**Identity statement (defensible minimum):**

> Design Page is a **read-only assembly step** that produces a **self-contained page artefact** by **embedding** upstream bodies, **organising** them into schema-conformant sections, and **optionally** adding **thin** page-level navigation prose where assembly visibility requires it — never re-authoring instructional substance.

### 4.3 What must not return

- Triple wrapper stack as separate injectors
- Synthesis mandates for `knowledge_summary` / `study_tips`
- Journey assimilation / authorial exposition as standalone augment blocks
- Rhetoric, EQF, VA authoring on DP
- Brevity-driven condensation
- “Readable assembly” as licence to optimise wrapper or archival payloads

---

## Section 5 — Wave 2 implementation opportunities

*Planning pointers only — not execution commitments.*

| Package | Scope | Inventory | Discovery notes |
| ------- | ----- | --------- | --------------- |
| **W2.1** | Layer 1 affirmation | R-17–R-23, R-28–R-30 | Mostly complete; affirm tests + docs |
| **W2.2** | Layer 2 organisation | R-01–R-09, R-27, R-31, R-70 slot | Align domain “readable page” wording with R-83 narrow |
| **W2.3** | **Assembly-coherence contract** | R-40, R-44, R-45, R-47; thin R-36/R-37 structural | **Primary Wave 2 gap** — create **one** lib block + single inject point; do not re-enable authorial/journey modules |
| **W2.4** | Knowledge transport-or-omit | R-70 + OQ-17 | SQ-1/SQ-2 upstream packaging enablers |
| **W2.5** | **R-83 narrowing** | Readable assembly delimiter | Replace ambiguous “readable page” optimise cues in domain §13 Purpose/`what_this_step_does` |
| **W2.6** | `learning_purpose` transport-only | R-38 | Explicit transport-first in template |
| **W2.7** | Facilitator profile alignment | R-84, R-85 | SQ-F1/SQ-F2 — profile policy not DP authoring |

### 5.1 Recommended thin-bridge content shape (planning target)

A consolidated block should be **shorter than** the removed authorial+journey stack combined, and include only:

1. **Transport-first rule** — populate wrapper sections from upstream when present; omit when absent.
2. **Thin assembly fallback** — max-volume-capped navigation/sequencing prose for `overview` / `learning_purpose` only when gaps exist.
3. **Role separation** — one rhetorical job per wrapper section (R-44) without mandating substance.
4. **Anti-redundancy** — do not duplicate the same upstream text across wrapper slots (R-47).
5. **Transition discipline** — prefer `learning_sequence.transition_to_next` and DLA bridges transported; forbid scheduling-only filler (R-40/R-45).
6. **Preservation boundary pointer** — defer to compose + L4 (R-46/R-50) — no duplication of field-preservation lists.

### 5.2 Suggested validation (Wave 2 planning)

| Check | Type |
| ----- | ---- |
| DP prompt contains exactly one assembly-coherence block | Contract test |
| No re-injection of authorial/journey/rhetoric markers | Regression gate |
| Thin bridge word-count / forbidden-pattern ceiling | Schema/contract test |
| Overview transport-or-compose-fallback behaviour | Prompt audit |
| R-83 domain wording excludes wrapper optimisation | Domain diff test |

---

## Section 6 — Risks and constraints

### 6.1 Risks

| Risk | Severity | Mitigation (Wave 2 planning) |
| ---- | -------- | ---------------------------- |
| **Thin bridge becomes new wrapper stack** | High | Single block; volume cap; Assembly-Time Test §4 disallowed table |
| **R-40 mandate revives mode A summarisation** | High | Transport-first ordering; explicit omit when LC/KM/LS provide bodies |
| **Re-injecting authorial module “for convenience”** | High | W2.3 must merge constraints only — not restore `LD-AUTHORIAL-EXPOSITION` augment |
| **R-83 “readable page” misread** | Medium | W2.5 domain wording; separate guardrail from generative bridge |
| **intellectual_coherence_bridge double-authored** | Medium | Keep on DLA path; DP transport-only — do not add wrapper assimilation |
| **Lib soak confusion** | Low | Deprecation register; tests assert non-injection (Wave 1 pattern) |

### 6.2 Constraints (non-negotiable)

| Constraint | Source |
| ---------- | ------ |
| No reopening CP-4 D1–D7 without formal decision | Guardrails escalation rule |
| Preservation First — F40 intact | Wave 1 exit; checklist §B |
| Generation Visibility — no Copilot output proof in Prism | Sprint 56C constraint |
| Renderer Independence — no DP VA authoring | OQ-13–16 |
| OQ-17 transport-or-omit for knowledge_summary | CP-4 |
| Presentation Inference — renderer does not author substance | Guardrails §B–D |

### 6.3 Wave 2 readiness (from discovery)

| Question | Assessment |
| -------- | ---------- |
| Blocked by Wave 1? | **No** |
| Unresolved Wave 1 architecture defects? | **None blocking** |
| Clear Wave 2 target? | **Yes** — define thin bridge + narrow R-83 + SQ packaging |
| Stable architectural target? | **Yes** — this document |

---

## References

| Document | Role |
| -------- | ---- |
| [SPRINT-56B-IMPLEMENTATION-PLAN.md](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-IMPLEMENTATION-PLAN.md) | Wave 2 work packages W2.1–W2.7 |
| [DESIGN-PAGE-REMAINING-STAKEHOLDER-DECISIONS-CONSOLIDATION-REVIEW.md](../2026-07-06-sprint-56b-design-page-migration-planning/DESIGN-PAGE-REMAINING-STAKEHOLDER-DECISIONS-CONSOLIDATION-REVIEW.md) | R-83 narrow definition; R-36/R-37 split |
| [DEPRECATION-REGISTER.md](../../prompt-contracts/DEPRECATION-REGISTER.md) | Wave 1 removed responsibilities |
| [SPRINT-56C-WAVE-1-PHASE-2A-EXECUTION-REPORT.md](SPRINT-56C-WAVE-1-PHASE-2A-EXECUTION-REPORT.md) | Transport vs archival split |
| [lib/ld-design-page-compose-contract.js](../../../lib/ld-design-page-compose-contract.js) | Current compose SSOT |

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `SPRINT-56C-WAVE-2-ASSEMBLY-COHERENCE-DISCOVERY.md` |
| Type | Architecture discovery / Wave 2 planning input |
| Implementation | **None** |
| Runtime changes | **None** |
