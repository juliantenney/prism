# Sprint 56B — Open Questions

**Purpose:** Track **blocker** open questions for Sprint 56B. Full register remains in [SPRINT-56A-OPEN-QUESTIONS.md](../2026-07-06-sprint-56a-design-page-simplification-planning/SPRINT-56A-OPEN-QUESTIONS.md).  
**Status:** Sprint 56B complete — OQ-24/OQ-25 deferred to Sprint 56C Wave 3.

---

## Recommended review order

| Order | ID | Rationale |
| ----- | -- | --------- |
| 1 | **OQ-02** | Resolved (planning) — Assembly-Time Ownership Test adopted; CP-4 sign-off pending |
| 2 | **OQ-17** | Resolved (planning) — transport-or-omit; SQ-1/SQ-2 pending |
| 3 | **OQ-13** | Resolved (planning) — VA spec moves off DP |
| 4 | **OQ-14** | Resolved (planning) — layered ownership; renderer inference default |
| 5 | **OQ-24** | Dual-path strategy — validation and acceptance criteria |
| 6 | **OQ-25** | Fixtures — baseline for plan validation |
| 7 | **OQ-23** | **Resolved** — Sprint 56C execution; Sprint 57 reserved |

---

## Blocker questions

### OQ-02 — Assembly-time ownership

| Field | Value |
| ----- | ----- |
| **Description** | Which learner-facing prose obligations require **assembly-time visibility** (final membership, section grouping, embedded materials, cross-activity order, journey coherence) vs **upstream transport only**? |
| **Importance** | **Critical** — defines Layer 3 scope; supersedes “author vs organise” binary |
| **Normative test** | [DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) |
| **Affected artefacts** | C6 wrapper cluster; R-35–R-51; guardrails R-46, R-50, R-72; target derivation Layer 3 |
| **Blocking impact** | Was blocker for W2-08 — **unblocked for analysis** pending CP-4 sign-off |
| **Status** | **Resolved (planning)** — pending CP-4 stakeholder sign-off |
| **Resolution** | Adopt **Assembly-Time Ownership Test** (v1.0). Design Page is transport-and-organisation first (Layer 1–2). **Assembly-coherence prose** permitted only when T3 = Yes and §4 Allowed categories apply. Instructional substance, LC/KM re-synthesis, GAM paraphrase, and triple wrapper stack authoring are **not** DP identity. |
| **Date** | 2026-07-06 |

---

### OQ-13 — Visual affordances on Design Page

| Field | Value |
| ----- | ----- |
| **Description** | Should VA **specification ownership** remain on Design Page? |
| **Importance** | **High** — largest non-transport generative load; token competition; mode G (`source_basis`) |
| **Normative review** | [DESIGN-PAGE-OQ-13-VISUAL-AFFORDANCES-OWNERSHIP-REVIEW.md](DESIGN-PAGE-OQ-13-VISUAL-AFFORDANCES-OWNERSHIP-REVIEW.md) |
| **Governing test** | [DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) |
| **Affected artefacts** | R-55–R-60; C8; audit §I; compose pipeline step 4 |
| **Blocking impact** | Was blocker for W2-09 — **unblocked** pending OQ-14 |
| **Status** | **Resolved (planning)** — pending OQ-14, CP-4 |
| **Resolution** | **Option B — move VA specification ownership out of Design Page.** Generative VA (R-56–R-59) is **not** DP identity. Optional passive VA schema keys on page JSON = shared contract decision only. R-60 follows VA locus. **Not** Option A (retain generative VA on DP). |
| **Date** | 2026-07-06 |

---

### OQ-14 — VA relocation target

| Field | Value |
| ----- | ----- |
| **Description** | Where should VA **specification ownership** reside after removal from Design Page? |
| **Importance** | **High** — completes VA disposition; affects preservation, Sprint 57 alignment, OQ-15/OQ-16 |
| **Normative review** | [DESIGN-PAGE-OQ-14-VISUAL-AFFORDANCES-RELOCATION-TARGET-REVIEW.md](DESIGN-PAGE-OQ-14-VISUAL-AFFORDANCES-RELOCATION-TARGET-REVIEW.md) |
| **Governing inputs** | [OQ-13 review](DESIGN-PAGE-OQ-13-VISUAL-AFFORDANCES-OWNERSHIP-REVIEW.md) · [Assembly-Time Ownership Test](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) |
| **Affected artefacts** | C8 disposition; R-55–R-60 locus; Sprint 57 architecture state (as-built) |
| **Blocking impact** | Was blocker for W2-09 completion — **unblocked** pending SQ-VA-4 |
| **Status** | **Resolved (planning)** — pending SQ-VA-4, CP-4 |
| **Resolution** | **Layered ownership.** Default: **renderer inference** for specification/rendering. **DLA** owns visual intent; **GAM** owns visual substance in materials. **DP passive transport** only if VA artefact bound (episode-plan pattern). **Dedicated VA artefact** conditional on explicit portable metadata need. VA **not** mandatory first-class pipeline concern. |
| **Date** | 2026-07-06 |

---

### OQ-15 — `source_basis` citations

| Field | Value |
| ----- | ----- |
| **Description** | Can `source_basis` coexist with full material embedding without substitution risk? |
| **Normative review** | [DESIGN-PAGE-OQ-15-16-VA-CLEANUP-CLOSURE-REVIEW.md](DESIGN-PAGE-OQ-15-16-VA-CLEANUP-CLOSURE-REVIEW.md) |
| **Affected artefacts** | R-59; failure modes E, G |
| **Status** | **Closed (planning)** — consequence of OQ-13/OQ-14 |
| **Resolution** | **Remove** from target architecture (default path). Substitution risk moot when DP does not author VA records. Conditional dedicated VA artefact path: **relocate** with embed-invariant policy only. |
| **Date** | 2026-07-06 |

---

### OQ-16 — Schema 38.4 scope

| Field | Value |
| ----- | ----- |
| **Description** | Is schema 38.4 required on every page or only when figures generated? |
| **Normative review** | [DESIGN-PAGE-OQ-15-16-VA-CLEANUP-CLOSURE-REVIEW.md](DESIGN-PAGE-OQ-15-16-VA-CLEANUP-CLOSURE-REVIEW.md) |
| **Affected artefacts** | R-55; domain pack §13 VA keys; R-60 |
| **Status** | **Closed (planning)** — consequence of OQ-13/OQ-14 |
| **Resolution** | **Deprecated** as universal mandatory page output. **Conditional** only when optional VA artefact bound. **Remove** from default DP emit requirements. Legacy renderer tolerates absent/empty VA. |
| **Date** | 2026-07-06 |

---

### OQ-17 — Knowledge summary policy

| Field | Value |
| ----- | ----- |
| **Description** | Transport KM/LC summary verbatim vs omit section vs author on Design Page? |
| **Importance** | **High** — audit §L structural conflict; failure mode A |
| **Normative review** | [DESIGN-PAGE-OQ-17-KNOWLEDGE-SUMMARY-POLICY-REVIEW.md](DESIGN-PAGE-OQ-17-KNOWLEDGE-SUMMARY-POLICY-REVIEW.md) |
| **Governing test** | [DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) |
| **Affected artefacts** | R-39, R-70, R-71, R-72; C7; audit §L |
| **Blocking impact** | Was blocker for W2-07 — **unblocked for analysis** pending SQ-1/SQ-2 |
| **Status** | **Resolved (planning)** — pending stakeholder SQ-1, SQ-2 |
| **Resolution** | **Transport-or-omit.** Option A when LC/KM provides transportable summary body; Option C otherwise. **Option B (DP authoring) rejected.** R-39/R-71 removed from target architecture; R-70 conditional; R-72 conditional guardrail. |
| **Date** | 2026-07-06 |

---

### OQ-24 — Dual-path validation strategy

| Field | Value |
| ----- | ----- |
| **Description** | Is PRISM post-compose repair the backstop if Copilot path still fails, or must Copilot meet Layer 1 without repair? |
| **Importance** | **High** — Copilot has no capture validators; PRISM repair may mask transport failures |
| **Affected artefacts** | C10; ADR-08; `page-gam-materials-preserve.js`; acceptance criteria |
| **Blocking impact** | Blocks validation strategy in implementation plan; affects OQ-27 rollback design |
| **Evidence needed** | Copilot vs PRISM capability matrix; live failure rate data |
| **56A reference** | Dependency analysis Phase 3 dual-path split |
| **Status** | Open |
| **Resolution** | *(pending)* |

---

### OQ-25 — Canonical acceptance fixtures

| Field | Value |
| ----- | ----- |
| **Description** | Which workflow fixtures are canonical for acceptance testing? |
| **Importance** | **High** — required to operationalise validation strategy and rollback triggers |
| **Affected artefacts** | Implementation plan §validation; OQ-27; existing tests (`design-page-materials-fidelity.test.js`, etc.) |
| **Blocking impact** | Blocks W5-04 validation population; limits evidence-based approval |
| **Evidence needed** | Workflow inventory; 15-min communication/trust scenarios; inflation workshop fixtures |
| **56A reference** | Migration strategy Phase A |
| **Status** | Open |
| **Resolution** | *(pending)* |

---

## Coordination question (not a hard blocker for analysis start)

### OQ-23 — Programme sequencing

| Field | Value |
| ----- | ----- |
| **Description** | Which sprint executes Design Page migration vs future roadmap work? |
| **Importance** | **Medium** — programme coordination |
| **Affected artefacts** | Sprint 56C charter; Sprint 57 reserved |
| **Blocking impact** | Was W4-05 — **resolved** |
| **Evidence needed** | Programme decision |
| **Status** | **Resolved** 2026-07-06 |
| **Resolution** | Design Page migration executes as **Sprint 56C**. **Sprint 57** reserved for future roadmap — not part of Design Page migration. |

---

## Related questions (56A register — not 56B blockers)

Resolve if time permits or carry to implementation sprint:

| ID | Topic |
| -- | ----- |
| OQ-01 | Minimum responsibility set |
| OQ-03 | Overview / learning_purpose essential? |
| OQ-04 | `activities_omitted[]` for size? |
| OQ-05–08 | Conditional sections mandatory? |
| OQ-09–12 | Wrapper merge, study tips, profile scope, word budget |
| OQ-18–22 | Knowledge bleed, migration mechanics, accretion inventory |
| OQ-26–27 | Automated equality check, rollback threshold |

Full list: [SPRINT-56A-OPEN-QUESTIONS.md](../2026-07-06-sprint-56a-design-page-simplification-planning/SPRINT-56A-OPEN-QUESTIONS.md)

---

## Resolution log

| ID | Resolution | Date | Owner |
| -- | ---------- | ---- | ----- |
| OQ-02 | Adopt [DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) v1.0 — pending CP-4 sign-off | 2026-07-06 | Sprint 56B planning |
| OQ-17 | Transport-or-omit per [DESIGN-PAGE-OQ-17-KNOWLEDGE-SUMMARY-POLICY-REVIEW.md](DESIGN-PAGE-OQ-17-KNOWLEDGE-SUMMARY-POLICY-REVIEW.md) — Option B rejected; SQ-1/SQ-2 pending | 2026-07-06 | Sprint 56B planning |
| OQ-13 | Option B per [DESIGN-PAGE-OQ-13-VISUAL-AFFORDANCES-OWNERSHIP-REVIEW.md](DESIGN-PAGE-OQ-13-VISUAL-AFFORDANCES-OWNERSHIP-REVIEW.md) — generative VA not on DP | 2026-07-06 | Sprint 56B planning |
| OQ-14 | Layered ownership per [DESIGN-PAGE-OQ-14-VISUAL-AFFORDANCES-RELOCATION-TARGET-REVIEW.md](DESIGN-PAGE-OQ-14-VISUAL-AFFORDANCES-RELOCATION-TARGET-REVIEW.md) — renderer inference default | 2026-07-06 | Sprint 56B planning |
| OQ-15 | Remove `source_basis` from target architecture per [DESIGN-PAGE-OQ-15-16-VA-CLEANUP-CLOSURE-REVIEW.md](DESIGN-PAGE-OQ-15-16-VA-CLEANUP-CLOSURE-REVIEW.md) | 2026-07-06 | Sprint 56B planning |
| OQ-16 | Schema 38.4 deprecated as universal mandatory per [DESIGN-PAGE-OQ-15-16-VA-CLEANUP-CLOSURE-REVIEW.md](DESIGN-PAGE-OQ-15-16-VA-CLEANUP-CLOSURE-REVIEW.md) | 2026-07-06 | Sprint 56B planning |
