# Sprint 56B — Open Questions

**Purpose:** Track **blocker** open questions for Sprint 56B. Full register remains in [SPRINT-56A-OPEN-QUESTIONS.md](../2026-07-06-sprint-56a-design-page-simplification-planning/SPRINT-56A-OPEN-QUESTIONS.md).  
**Status:** Living document during Sprint 56B.

---

## Recommended review order

| Order | ID | Rationale |
| ----- | -- | --------- |
| 1 | **OQ-02** | Unblocks wrapper boundary review (critical path) |
| 2 | **OQ-17** | Knowledge summary structural conflict (mode A) |
| 3 | **OQ-13** | VA placement — largest non-transport load |
| 4 | **OQ-24** | Dual-path strategy — validation and acceptance criteria |
| 5 | **OQ-25** | Fixtures — baseline for plan validation |
| 6 | **OQ-23** | Sprint 57 coordination (may parallel with 1–5) |

---

## Blocker questions

### OQ-02 — Author vs organise

| Field | Value |
| ----- | ----- |
| **Description** | Should Design Page ever **author** new learner-facing prose, or only **organise** upstream prose? |
| **Importance** | **Critical** — defines whether Layer 3 wrapper stack remains, is bounded, or is removed |
| **Affected artefacts** | C6 wrapper cluster; R-35–R-51; guardrails R-46, R-50, R-72; target derivation Layer 3 |
| **Blocking impact** | Blocks W2-08 wrapper review; blocks architecture approval disposition; distorts OQ-09 if answered late |
| **Evidence needed** | Wrapper value on exported HTML; learner usability comparison; overlap char budget |
| **56A reference** | Responsibility analysis §3; migration strategy Phase B item 6 |
| **Status** | Open |
| **Resolution** | *(pending)* |

---

### OQ-13 — Visual affordances on Design Page

| Field | Value |
| ----- | ----- |
| **Description** | Should VA authoring remain on Design Page at all? |
| **Importance** | **High** — largest non-transport prompt load; token competition with GAM embed |
| **Affected artefacts** | C8; R-55–R-59; compose pipeline step 4; failure mode G (`source_basis`) |
| **Blocking impact** | Blocks W2-09; blocks dependency impact for VA relocation; related OQ-14 if relocated |
| **Evidence needed** | Renderer consumption audit (DQ-01: does HTML export require VA?); Sprint 38 architecture notes |
| **56A reference** | Audit §I; dependency analysis C8 |
| **Status** | Open |
| **Resolution** | *(pending)* |

---

### OQ-17 — Knowledge summary policy

| Field | Value |
| ----- | ----- |
| **Description** | Transport KM/LC excerpt verbatim vs omit section vs author preview on Design Page? |
| **Importance** | **High** — audit §L clearest structural conflict; drives failure mode A |
| **Affected artefacts** | C7; R-39, R-70, R-71, R-72; `knowledge_summary` section |
| **Blocking impact** | Blocks W2-07; affects wrapper/knowledge overlap in dependency matrix |
| **Evidence needed** | Side-by-side page comparison; cross-field bleed to materials |
| **56A reference** | Audit §L; matrix competition knowledge in two places |
| **Status** | Open |
| **Resolution** | *(pending)* |

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

### OQ-23 — Sprint 57 sequencing

| Field | Value |
| ----- | ----- |
| **Description** | Does Sprint 57 start before, after, or in parallel with Design Page implementation? |
| **Importance** | **Medium** — programme coordination |
| **Affected artefacts** | Sprint 57 charter; product presentation work |
| **Blocking impact** | Blocks W4-05; does not block W1–W3 if Layer 1–2 frozen as constraint |
| **Evidence needed** | Stakeholder decision |
| **Status** | Open |
| **Resolution** | *(pending)* |

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
| OQ-14–16 | VA relocation target, source_basis, schema 38.4 scope |
| OQ-18–22 | Knowledge bleed, migration mechanics, accretion inventory |
| OQ-26–27 | Automated equality check, rollback threshold |

Full list: [SPRINT-56A-OPEN-QUESTIONS.md](../2026-07-06-sprint-56a-design-page-simplification-planning/SPRINT-56A-OPEN-QUESTIONS.md)

---

## Resolution log

| ID | Resolution | Date | Owner |
| -- | ---------- | ---- | ----- |
| — | *(populate as questions close)* | | |
