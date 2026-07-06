# OQ-15 / OQ-16 — VA Cleanup Closure Review

**Sprint:** 56B — Design Page Migration Planning & Architecture Approval  
**Status:** Planning artefact — closure review  
**Date:** 2026-07-06  
**Governing decisions (not reopened):**
- [DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) v1.0 (OQ-02)
- [DESIGN-PAGE-OQ-13-VISUAL-AFFORDANCES-OWNERSHIP-REVIEW.md](DESIGN-PAGE-OQ-13-VISUAL-AFFORDANCES-OWNERSHIP-REVIEW.md)
- [DESIGN-PAGE-OQ-14-VISUAL-AFFORDANCES-RELOCATION-TARGET-REVIEW.md](DESIGN-PAGE-OQ-14-VISUAL-AFFORDANCES-RELOCATION-TARGET-REVIEW.md)

**Evidence base:** Sprint 56A artefacts (frozen); Sprint 38 programme notes; 38S rendering audit

**This document does not propose implementation, prompt changes, code changes, schemas, or workflow modifications.**

---

## Executive summary

| Question | Closure verdict | Classification |
| -------- | --------------- | -------------- |
| **OQ-15** (`source_basis`) | **Close** — consequence of OQ-13/OQ-14 | **Remove** from target architecture (default path) |
| **OQ-16** (schema 38.4 scope) | **Close** — consequence of OQ-13/OQ-14 | **Deprecated** as universal mandatory; **Conditional** on optional explicit-metadata path only |

Both questions are **no longer genuine architecture blockers**. They reduce to **as-built contract residue** and an **optional conditional path** already deferred to SQ-VA-4.

**CP-4:** No item must remain open solely for OQ-15 or OQ-16. SQ-VA-4 (optional explicit-metadata consumers) is the only related stakeholder gate.

---

## 1. OQ-15 — `source_basis`

### Scope of review

| Item | Role |
| ---- | ---- |
| **R-59** | Cite upstream field paths in VA records (e.g. `A3 materials.scenarios`) |
| **`source_basis` field** | Non-empty string on `visual_affordances[]` generate rows (Sprint 38 schema 38.4) |
| **Linked contracts** | Sprint 38 VA contract; compose contract (“citing a path does not satisfy the materials requirement”); matrix competition R-23 vs R-59 |
| **Failure modes** | **G** — cite paths with empty materials; **E** — index mental model |

### Original question (56A)

> Can `source_basis` citations coexist with full material embedding without substitution risk?

This question arose because **Design Page** authored VA records on the same emit path as GAM material embed — creating a **dual satisfaction** path: model could cite `source_basis` instead of embedding bodies.

### Determinations

| Question | Answer |
| -------- | ------ |
| Does `source_basis` remain **required** in target architecture? | **No** — default path has no explicit VA records on page JSON |
| Does any **remaining architectural owner** exist for R-59 on DP? | **No** — OQ-13 removed generative VA from DP; OQ-14 default is renderer inference from **embedded materials** |
| Does the concern **survive** if VA leaves Design Page? | **Only** on the **optional** dedicated VA artefact path — not on default path |

### Classification

| Path | Disposition |
| ---- | ----------- |
| **Default (renderer inference)** | **Remove** — `source_basis` not part of target architecture |
| **Conditional (dedicated VA artefact)** | **Relocate** — if explicit records ever produced, `source_basis` may document evidence paths but **must not** substitute for Layer 1 embed (embed-invariant policy inherited from as-built compose rule) |

**Primary classification for OQ-15 closure: Remove.**

The substitution-risk question is **moot** on the default path because the field is not emitted. On the conditional path, the policy answer is already established: cite ≠ embed.

### Rationale

1. OQ-13 identified R-59 as **high preservation risk** (mode G) when owned by DP generative VA.
2. OQ-14 placed specification on **renderer inference** — SSOT is `materials.*` bodies, not path citations.
3. No active consumer **requires** `source_basis` for correct learner output when `visual_affordances[]` is empty or absent (38S audit; legacy renderer mode).
4. Retaining `source_basis` as an architecture requirement would **reintroduce** the index-without-embed failure mode OQ-13 eliminated.

### Confidence

| Aspect | Level |
| ------ | ----- |
| Remove on default path | **High** |
| Relocate + embed-invariant on conditional path | **High** |
| Close OQ-15 as planning consequence | **High** |

### Remaining stakeholder questions

| ID | Question | Blocks OQ-15 closure? |
| -- | -------- | ---------------------- |
| SQ-VA-4 | Planned non-HTML consumer requiring explicit VA records? | **No** — affects conditional path only; embed-invariant policy already fixed |

---

## 2. OQ-16 — Schema 38.4 scope

### Scope of review

| Item | Role |
| ---- | ---- |
| **R-55** | Emit `visual_affordance_schema_version` `"38.4"`, `visual_affordances[]`, `activities_visual_review[]` |
| **Schema 38.4** | Sprint 38 affordance record shape (generate/defer/reject enums, fields including `source_basis`) |
| **Page JSON (as-built)** | Domain pack §13 lists VA keys as required page-root output (may be `[]`) |
| **Validation** | R-60 normalisation when VA keys present |

### Original question (56A)

> Is schema 38.4 required on every page or only when figures are generated?

### Determinations

| Question | Answer |
| -------- | ------ |
| Mandatory on every page (target architecture)? | **No** |
| Optional? | **Yes** — default path omits VA keys |
| Conditional? | **Yes** — only when optional explicit VA artefact is bound and transported |
| Can be retired? | **From universal DP obligation — yes.** Schema definition may persist as **historical/optional contract** until as-built residue is migrated |

### Classification

| Layer | Disposition |
| ----- | ----------- |
| **Target architecture (default)** | **Remove** — no mandatory `visual_affordance_schema_version` / empty-array emission on every page |
| **Universal mandatory (as-built)** | **Deprecated** — contradicts OQ-13/OQ-14; not carried forward |
| **Optional explicit-metadata path** | **Conditional** — schema 38.4 applies only when VA artefact produces records |
| **Full retirement of schema concept** | **Not required** for closure — schema may remain documented for legacy exports and optional path |

**Primary classification for OQ-16 closure: Deprecated (as universal mandatory); Conditional (optional path only).**

### Rationale

1. OQ-14: explicit VA metadata is **not** architecturally required for current HTML export (DQ-01).
2. Sprint 38 renderer **legacy mode** operates when `visual_affordances[]` is missing or empty — **evidence** that empty mandatory emission is unnecessary for presentation.
3. Mandatory empty-array emission competes for tokens and reinforces VA as DP identity — contradicts OQ-13.
4. Layer 2 organisation allows **passive transport** of VA keys when upstream artefact provides them — not **universal empty schema emission**.

### Confidence

| Aspect | Level |
| ------ | ----- |
| Not mandatory on every page | **High** |
| Deprecated as universal DP output requirement | **High** |
| Conditional on optional artefact path | **High** |
| Close OQ-16 as planning consequence | **High** |

### Remaining stakeholder questions

| ID | Question | Blocks OQ-16 closure? |
| -- | -------- | ---------------------- |
| SQ-VA-4 | Non-HTML consumer requiring portable VA keys on page JSON? | **No** — if yes, triggers **conditional** path only; does not restore universal mandatory |

---

## 3. Dependency analysis — consumers

### Evidence vs assumptions

| Consumer | Status | Evidence | Assumption |
| -------- | ------ | -------- | ---------- |
| **HTML export (legacy renderer mode)** | **Active** | 38S audit: `visual_affordances: []` renders; hooks hidden; Sprint 36 heuristics apply | — |
| **HTML export (authoritative VA mode)** | **Active when non-empty** | Sprint 38 NOTES: non-empty `visual_affordances[]` with `generate` rows drives `utilityMaybeRenderVisualAffordanceHook` | Only when explicit records exist |
| **`source_basis` field** | **No independent consumer** | Field is input to VA record validation; not read by export for body rendering | — |
| **Schema 38.4 version key** | **No presentation consumer** | 38S: version/review metadata can leak to body if misplaced in `sections[]` — defect, not requirement | — |
| **PRISM VA validation (R-60)** | **Active (as-built)** | Runs when VA keys present on captured page | Not a **product** consumer — quality layer |
| **Domain pack §13 output keys** | **Active (as-built contract)** | Lists VA keys as required | **Target architecture supersedes** per OQ-13/OQ-14 |
| **Sprint 38 / VEU tests** | **Active (as-built test suite)** | Fixtures assert schema 38.4 shape | Tests reflect as-built, not target mandate |
| **Future figure pipeline / non-HTML** | **Planned / hypothetical** | Dependency analysis flags uncertainty | SQ-VA-4 — no documented production consumer |
| **Audit tooling on VA decisions** | **Hypothetical** | Sprint 57 PR-06 class questions | Optional metadata path only |

### Summary table

| Category | Items |
| -------- | ----- |
| **Active consumers (require non-empty VA for learner value)** | Authoritative renderer hooks **only when** `visual_affordances[]` contains `generate` rows |
| **Active consumers (tolerate absent/empty VA)** | Legacy renderer mode; current default export path |
| **Planned consumers** | None documented in architecture artefacts |
| **Hypothetical consumers** | Non-HTML pipelines; structured VA audit tooling |
| **No consumers** | `source_basis` as standalone field; mandatory empty schema emission |

---

## 4. Sprint 56A alignment

| Finding | OQ-15 (`source_basis`) | OQ-16 (schema 38.4) |
| ------- | ---------------------- | ------------------- |
| Transport-and-organisation identity | **Remove** eliminates cite-without-embed on DP | **Remove** universal emission eliminates non-transport schema obligation |
| Layer 1 preservation | **Remove** removes R-59 substitution vector | Empty mandatory arrays do not preserve bodies; removal aligns with embed SSOT |
| Layer 2 organisation | N/A on default path | **Conditional** passive carry only when artefact bound |
| Layer 3 narrowing | R-59 removed from DP generative stack | R-55 generative emission removed; no empty-array token cost |

Both closures **strengthen** target architecture alignment.

---

## 5. Recommended resolution

### OQ-15 — `source_basis`

| Field | Value |
| ----- | ----- |
| **Final disposition** | **Remove** from target architecture (default path). **Relocate** only on optional dedicated VA artefact path with embed-invariant policy. |
| **Rationale** | Substitution risk existed because DP authored citations on the embed path. OQ-13/OQ-14 remove that path. Renderer inference uses materials, not path index. |
| **Confidence** | **High** |
| **Stakeholder questions** | None blocking closure. SQ-VA-4 is orthogonal. |
| **R-59 target status** | **Remove** from Design Page responsibility matrix |

### OQ-16 — Schema 38.4 scope

| Field | Value |
| ----- | ----- |
| **Final disposition** | **Deprecated** as universal mandatory page output. **Conditional** when optional VA artefact bound. **Remove** from default DP emit requirements. |
| **Rationale** | Legacy renderer does not require mandatory empty arrays. OQ-14 default has no explicit VA producer on DP. Universal emission contradicts transport identity. |
| **Confidence** | **High** |
| **Stakeholder questions** | None blocking closure. SQ-VA-4 affects conditional path scope only. |
| **R-55 target status** | **Remove** generative emission from DP; **conditional** passive transport only |

### Are these still genuine architecture questions?

| ID | Verdict |
| -- | ------- |
| OQ-15 | **No** — resolved as **consequence** of OQ-13/OQ-14 |
| OQ-16 | **No** — resolved as **consequence** of OQ-13/OQ-14 |

---

## 6. Tracker impact

### Closure recommendation

| ID | Close? | CP-4 gate? |
| -- | ------ | ---------- |
| **OQ-15** | **Yes** (planning) | **No** — record disposition in CP-4 approval bundle |
| **OQ-16** | **Yes** (planning) | **No** — record disposition in CP-4 approval bundle |

### Approval tracker updates

| Entry | Value |
| ----- | ----- |
| **F3f** | `source_basis`: Remove from target architecture (OQ-15 closed) |
| **F3g** | Schema 38.4: Deprecated as universal mandatory; conditional optional path only (OQ-16 closed) |
| **D5** (if brevity) or fold into D3/D4 | OQ-15/OQ-16 closed as VA cleanup consequences |

### Workstream impact

| Item | Effect |
| ---- | ------ |
| **W2-09** | VA boundary review **complete** for planning |
| **W3** | Dependency matrix: VA keys move from mandatory C8 output to optional C14 carry |
| **CP-2** | VA disposition block **complete** (OQ-13, OQ-14, OQ-15, OQ-16) |

### What remains open (not OQ-15/16)

| ID | Relation |
| -- | -------- |
| **SQ-VA-4** | Optional explicit-metadata consumers — does not block OQ-15/16 closure |
| **CP-4** | Stakeholder sign-off on full VA disposition bundle |
| **As-built contract residue** | Domain pack §13 VA keys — implementation migration concern, not open architecture question |

---

## Proposed tracker entries

### SPRINT-56B-OPEN-QUESTIONS.md

| ID | Status | Resolution |
| -- | ------ | ---------- |
| OQ-15 | **Closed (planning)** | **Remove** `source_basis` from target architecture. Consequence of OQ-13/OQ-14. Conditional path: relocate with embed-invariant policy only. |
| OQ-16 | **Closed (planning)** | Schema 38.4 **deprecated** as universal mandatory. **Conditional** on optional VA artefact. **Remove** from default DP requirements. |

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `DESIGN-PAGE-OQ-15-16-VA-CLEANUP-CLOSURE-REVIEW.md` |
| OQs | OQ-15 · OQ-16 |
| Consumers | CP-2 · CP-4 · W2-09 · W3 |

**Planning and approval artefact only.**
