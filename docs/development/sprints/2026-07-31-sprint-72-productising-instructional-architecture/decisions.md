# Sprint 72 — Decision Log

**Sprint status:** OPEN / IN PROGRESS (opened 2026-07-31)  
**Format:** ID · Decision · Status · Rationale · Consequences  

Do **not** invent decisions for matters still under investigation.  
Do **not** copy colliding predecessor ID families as if they were new Sprint 72 decisions — **link** instead.

### Decision-ID namespaces

| ID family | Role |
| --------- | ---- |
| `S70-D01` … `S70-D10` | Authoritative Sprint 70 closure / methodology |
| `S71-D01` … | Sprint 71 aliases / local decisions — closed pack |
| `S72-D01` … | Sprint 72 decisions (this log) |

---

## Inherited (binding — link, do not re-author)

| Source | Role for Sprint 72 |
| ------ | ------------------ |
| [Sprint 70 closure `S70-D01`…`S70-D10`](../2026-07-28-sprint-70-visual-planning-and-synthesis/SPRINT-70-CLOSURE.md) | Methodological discipline: retain rejected findings; distinguish observed location / owner / contributors / responsibility type; do not attribute solely by visible stage |
| [Sprint 71 decisions](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/decisions.md) | Historical evaluation-scope decisions; Sprint 71 closed |
| [Sprint 71 Final Report](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/SPRINT-71-FINAL-REPORT.md) | Architectural conclusions and principles — evidence authority |

**Note on `S70-D01` / `S70-D02`:** Those decisions constrained **Sprint 71** (no authoring-workflow redesign / no post-generation author questioning **in that evaluation workstream**). Sprint 72 explicitly opens elicitation redesign as Priority 2 for this successor — see `S72-D06`. This does not reopen Sprint 71.

---

## Sprint 72 opening decisions

## S72-D01 Three-layer responsibility routing is binding

- **Decision:** Every Sprint 72 improvement must be routed primarily to Layer 1 (platform instructional architecture), Layer 2 (workflow elicitation), or Layer 3 (author-supplied evidence), with Product/UX/renderer attributed separately when that is the true owner.  
- **Status:** Accepted (opening)  
- **Rationale:** Sprint 71 proved collapsing layers into “prompt improvement” hides responsibility and misplaces author burden (`S71-O-006`).  
- **Consequences:** Plans, PRs, and status updates must name the layer; generic prompt-only framing is insufficient.

## S72-D02 Binding priority order

- **Decision:** Unless changed by a later recorded Sprint 72 decision, work priority is: (1) Platform/system, (2) Workflow elicitation, (3) Author-supplied evidence, (4) Product/UX, (5) Raise-the-ceiling.  
- **Status:** Accepted (opening)  
- **Rationale:** Operator opening brief for Sprint 72.  
- **Consequences:** Lower-priority work does not displace Priority 1 without an explicit decision.

## S72-D03 Do not collapse into generic prompt improvement

- **Decision:** Sprint 72 must not treat platform, elicitation, and author-evidence problems as one undifferentiated “prompt improvement” workstream.  
- **Status:** Accepted (opening)  
- **Rationale:** Sprint 71 attribution model and three-layer conclusions.  
- **Consequences:** Changes require stage/layer attribution before rewrite.

## S72-D04 Evidence-Centred Learning as first-class design principle (goal)

- **Decision:** Sprint 72 treats **Evidence-Centred Learning** as the first-class umbrella platform design principle, nesting Evidence Sufficiency, Evidence-Centred Activity Design, and Discipline-Appropriate Evidence Evaluation. **Evidence-Based Learning** remains Sprint 71’s complementary framing (learners reason *with* artefacts) and is not collapsed as a duplicate label.  
- **Status:** Accepted (opening goal; terminology standardised in pre-implementation amendment)  
- **Rationale:** Sprint 71 evidence findings; operator amendment pass.  
- **Consequences:** Phase 1 (`S72-T-010`/`T-011`) must represent the umbrella; see Charter principles section.

## S72-D05 Validation requires Benchmark + Validation Review, not score alone

- **Decision:** Implementation claims require Benchmark and Validation Review with attention to targeted dimensions and regressions; total score alone is insufficient proof.  
- **Status:** Accepted (opening)  
- **Rationale:** Sprint 70/71 evidence discipline; operator Sprint 72 brief.  
- **Consequences:** STATUS and PR notes must cite dimension outcomes.

## S72-D06 Sprint 72 authorises workflow elicitation redesign

- **Decision:** Unlike Sprint 71’s evaluation-only scope, Sprint 72 authorises investigation and preferably prototyping of clearer workflow elicitation (Priority 2), including replacing or mediating arcane brief fields with instructional questions.  
- **Status:** Accepted (opening)  
- **Rationale:** Operator Sprint 72 theme; Layer 2 of Sprint 71 model.  
- **Consequences:** Does not reopen Sprint 71; does not mandate shipping full elicitation UI in-sprint (see PLAN commitment labels).

## S72-D07 Charter success criteria — Accepted

- **Decision:** Charter success criteria are **Accepted**, incorporating the pre-implementation amendments: `S71-F-001` dual routing (`S72-D08`); committed Layer-1 implementation and validation (`S72-T-013`, `S72-T-014`); Evidence-Centred Learning umbrella terminology; shared workflow asset-persistence model (`S72-D09`). The 95–98 quality ceiling remains **aspirational**, not a universal score requirement.  
- **Status:** **Accepted** (2026-07-31)  
- **Rationale:** Operator approval via amendment pass.  
- **Consequences:** `S72-T-003` Done; Phase 0 complete; execution begins at `S72-T-010`.

## S72-D08 `S71-F-001` dual routing (do not split the Sprint 71 ID)

- **Decision:** Preserve one authoritative `S71-F-001`. Route **Evidence Sufficiency** (instructional / evidence-completable activities) primarily to **A** (platform). Route **evidence availability/sourcing** to **B** (elicitation) when Prism must ask what exists, and to **C** (author-supplied) when Prism cannot or must not generate the material. Order: platform first → elicitation for genuine gaps → author artefacts only where generation is inappropriate.  
- **Status:** Accepted (amendment)  
- **Rationale:** Operator pre-implementation amendment; avoids treating availability as only Layer 3 or only prompt richness.  
- **Consequences:** Traceability sub-routes F-001-A/B/C; tasks `S72-T-015`, `S72-T-033`, `S72-T-040+`.

## S72-D09 Shared workflow asset-persistence model

- **Decision:** `S72-T-042` (workflow ↔ author-evidence association persistence) and `S72-T-051` (generated image assets, IDs, generation metadata, reconnection, selective regeneration) must align with **one shared workflow asset-persistence model**, not separate incompatible storage approaches.  
- **Status:** Accepted (amendment)  
- **Rationale:** Operator clarification of persistence responsibilities.  
- **Consequences:** Phase 4 and Phase 5 path work cross-reference; storage technology choice still open investigation.

## S72-D10 Evidence-centred activity slice — system-generated evidence boundary

- **Decision:** The validated evidence-centred activity thin-slice supports both **system-generated learner evidence** (simulated observations/cases with honest provenance labelling; separate-provider and combined evidence/workspace patterns) and **source-bound conversation-attachment evidence** (`conversation_attachment`) where DLA inventories source units and GAM renders attributed source-native evidence (quotations/excerpts/values/observations/clauses) for learner reasoning. Prism still does **not** inspect, ingest, persist, or verify Copilot attachment bytes as stable, addressable artefacts. Deferred boundary is narrowed to upload classification, storage, identifiers, retrieval, rights handling, and byte-level fidelity verification.  
- **Status:** Accepted (slice closure boundary)  
- **Rationale:** RNA/HCV and heteroscedasticity validated system-generated evidence sufficiency. Owen progression showed an initial summary-collapse attempt, followed by source-bound DLA/GAM refinements that produced attributed quotations and evidence-centred activities where supplied poems were central. This proves conversation-bound source use while preserving the attachment-byte storage/fidelity limitation.  
- **Consequences:** Do not regress source-bound conversation usage now that it is implemented; defer only stable attachment ingestion/persistence and byte-level verification capabilities.

## S72-D11 Sprint-72 evidence-centred slice does not require pipeline redesign

- **Decision:** The Sprint 72 evidence-centred implementation slice must remain within the existing activity-oriented pipeline and must not introduce a new pipeline stage, new page type, or complex shared evidence-spine architecture for this sprint slice.
- **Status:** Accepted (implemented boundary)
- **Rationale:** Governing sprint principle: “Make activities use evidence for reasoning.” Empirical runs (RNA, heteroscedasticity, Owen source-bound package) showed substantial gains without architecture replacement.
- **Consequences:** Dedicated case-study page and shared-evidence-spine architecture remain future options, not completion requirements for this slice.

## S72-D12 Evidence use is selective, bounded by pedagogy and session realism

- **Decision:** Evidence is required when it supports reasoning demands of the activity, and may be omitted when unnecessary for learning efficiency, prerequisites, cognitive load, or available time. Authentic published evidence is not mandatory for every effective activity.
- **Status:** Accepted (implemented boundary)
- **Rationale:** Activity-level evidence design selected during corpus analysis and validated across sparse-brief experiments.
- **Consequences:** DLA evidence decisions remain per-activity and selective; contracts must preserve explanatory/non-evidence activities as valid.

## S72-D13 Committed vs uncommitted sprint state must be explicit in handover

- **Decision:** Sprint 72 documentation must distinguish implemented work that is currently uncommitted in the working tree from committed baseline state, and must not claim commits that do not exist.
- **Status:** Accepted (handover integrity)
- **Rationale:** Current repository state shows substantial uncommitted implementation and test changes.
- **Consequences:** Status/plan/docs must mark bridge-correction and presentation refinements as implemented but currently uncommitted until verification and commit.

---

## Decisions deliberately not made yet

- Storage technology for the shared workflow asset-persistence model.  
- Whether music/chemistry/engineering renderers receive any implementation thin-slice.  
- Exact mid-sprint capacity cut-line for stretch items.
- Upload classification / primary-evidence artefact pipeline design (deferred under `S72-D10`).
