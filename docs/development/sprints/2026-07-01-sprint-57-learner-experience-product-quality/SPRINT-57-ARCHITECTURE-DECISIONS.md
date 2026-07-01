# Sprint 57 — Architecture Decisions Record

**Scope:** Major decisions from Sprint 56 architecture programme (carried into Sprint 57)  
**Format:** Context → Decision → Rationale → Implications

---

## ADR-01 — DLA owns scaffold generation

| | |
| - | - |
| **Context** | Five overlapping blocks taught scaffold fields with conflicting word ranges. Design Page and OUTPUT CONTRACT duplicated generation guidance. |
| **Decision** | `LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT` is the **sole DLA emit authority** for scaffold word floors, genre, exemplars, and PRE-EMIT gate. |
| **Rationale** | Single SSOT eliminates conflict; early inject (`dlaLearnerPageScaffoldSsot`) establishes precedence. |
| **Implications** | Deprecated blocks remain in repo for evaluators only — not DLA emit. Design Page must preserve, not regenerate. |

---

## ADR-02 — Design Page uses compose-only scaffold slice

| | |
| - | - |
| **Context** | Full DLA scaffold block (~4.3k chars) on Design Page compose path taught generation on an assembly step. |
| **Decision** | `composeOnly: true` in `applyLdGuidedLearningScaffoldContractToDraft` — preservation lines only (~632 chars). |
| **Rationale** | Compose step is read-only; scaffold prose must come from upstream DLA. |
| **Implications** | DLA quality remains bottleneck for scaffold prose; Design Page repair uses field preservation, not re-generation. |

---

## ADR-03 — GAM-PRES owns material depth

| | |
| - | - |
| **Context** | SP blocks, PEL reasoning, and pack template each restated depth minima (≥80w transfer, checklist floors, etc.). |
| **Decision** | Pack **GAM-PRES-08/09** is depth/completeness SSOT. SP owns pattern shape + FM codes; PEL owns cross-material behaviours only. |
| **Rationale** | Depth conflicts cause unpredictable model behaviour; pack is already authoritative for capture gate. |
| **Implications** | SP prefix defers to GAM-PRES; GAM-FMT char heuristics are capture-advisory only. |

---

## ADR-04 — DLA rhetoric excluded from emit path

| | |
| - | - |
| **Context** | `LD-SELF-DIRECTED-RHETORIC` DLA rider duplicated SSOT header and conflicted with scaffold teaching. |
| **Decision** | `applyLearnerActionRhetoric && !isDla` — rhetoric on GAM, Design Page, Assessment only. |
| **Rationale** | DLA specifies cognitive/scaffold content; rhetoric governs wrapper and material voice on later stages. |
| **Implications** | Pack §5 documentation updated to match runtime. |

---

## ADR-05 — PEL excluded from Design Page emit

| | |
| - | - |
| **Context** | PEL orientation/reasoning targeted DLA field generation; pack referenced OUTPUT CONTRACT on Design Page. |
| **Decision** | `applyPedagogicEnrichmentContractScaffoldToDraft` gates PEL to `isDla` and `isGam` only. |
| **Rationale** | Design Page must not expand or re-teach activity-row fields. |
| **Implications** | Design Page relies on compose preservation + journey wrapper for page-level voice. |

---

## ADR-06 — Design Page compose is SSOT for assembly rules

| | |
| - | - |
| **Context** | Pack §13 `promptTemplate` duplicated ~11k of compose contract (membership, materials, episode plans). |
| **Decision** | Thinned pack to pointers; `LD-DESIGN-PAGE-COMPOSE-CONTRACT` owns assembly rules at runtime. |
| **Rationale** | Dual SSOT caused drift (C-01 materials/table referenced but not injected). |
| **Implications** | Pack changes to compose rules must go through lib contract + `buildLdDesignPageComposePromptBlock`. |

---

## ADR-07 — L4 materials/table use role-based injection

| | |
| - | - |
| **Context** | Same fidelity contract needed at three stages with different verbs (specify, author, preserve). |
| **Decision** | `LD-MATERIALS-COPY` and `LD-TABLE-FIDELITY` inject with roles: `dla`, `author`, `design_page`. Design Page embeds preserve roles inside compose block; main chain no-ops for Design Page. |
| **Rationale** | Shared module avoids three divergent copies; role rider clarifies behaviour per stage. |
| **Implications** | Cross-prompt audit treats as **valid shared authority**, not misplacement. |

---

## ADR-08 — Capture-side repair remains authoritative quality layer

| | |
| - | - |
| **Context** | External model runs show high variance on scaffold word counts even with correct prompts (DLA stabilisation probes: 0/3 runs ≥80% mandatory pass). |
| **Decision** | Retain and trust `repairGuidedLearningScaffoldOnDlaCapture`, `page-gam-materials-preserve`, field closure validators. |
| **Rationale** | Prompt SSOT alone cannot guarantee emit quality; repair compensates without architecture change. |
| **Implications** | Sprint 57 product work must not weaken validators to improve apparent pass rates. |

---

## ADR-09 — Facilitator-ban owned by GAM self-study block

| | |
| - | - |
| **Context** | Pack, rhetoric, and self-study block each taught facilitator-ban for self-directed GAM. |
| **Decision** | `buildSelfDirectedGamLearnerVoicePromptBlock` inside self-study materials is authoritative; rhetoric delegates. |
| **Rationale** | Single teaching owner; capture sanitization remains enforcement. |
| **Implications** | Probe may still count `facilitator` phrase in pack + self-study — not duplication of teaching authority. |

---

## ADR-10 — Architecture review programme closed; evidence-triggered changes only

| | |
| - | - |
| **Context** | Sprint 56 expanded from DLA rationalisation to full tri-stage audit programme. |
| **Decision** | Programme **closed** at Sprint 57 open. Further prompt architecture work requires observed defect or new step. |
| **Rationale** | Orchestration GREEN; continued audit yields diminishing returns vs product work. |
| **Implications** | Sprint 57 charter excludes rationalisation programmes; optional hygiene items documented but not scheduled. |

---

## ADR-11 — No new prompt layer without supersession

| | |
| - | - |
| **Context** | Years of accretion created duplicate authorities. |
| **Decision** | Adopted as Sprint 56 governance principle; continues in Sprint 57. |
| **Rationale** | Prevents recurrence of Sprint 55 duplication problem. |
| **Implications** | New contracts require deprecation register entry and removal plan. See [SPRINT-56-PROMPT-GOVERNANCE.md](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/SPRINT-56-PROMPT-GOVERNANCE.md). |

---

## Change log

| ID | Date | Change |
| -- | ---- | ------ |
| ADR-01..11 | 2026-07-01 | Initial record at Sprint 57 open |

Future decisions: append to this file with ADR-12+.
