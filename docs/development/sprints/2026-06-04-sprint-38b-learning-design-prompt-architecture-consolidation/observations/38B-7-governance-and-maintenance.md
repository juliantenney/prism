# Slice 38B-7 — Governance and maintenance

**Date:** 2026-06-04  
**Status:** **COMPLETE** (planning-phase governance package)  
**Inputs:** [38B-1](38B-1-prompt-audit.md), [38B-2](38B-2-instruction-taxonomy.md), [38B-3](38B-3-design-page-consolidation-plan.md), [38B-4](38B-4-materials-and-table-fidelity.md), [38B-5](38B-5-workflow-wide-review.md), [38B-6](38B-6-regression-validation-plan.md)  
**Charter:** [SPRINT-38-B-CHARTER.md](../SPRINT-38-B-CHARTER.md)

---

## Success criterion

Published, enforceable rules for LD prompt evolution so Sprint 35–38 capability gains do not repeat unbounded append, precedence drift, or materials/table regressions. This slice **closes Sprint 38-B planning**; it does not authorise implementation work.

---

## Scope

| In scope | Out of scope |
|----------|----------------|
| Maintenance rules, ownership, change classes, waivers, metrics policy | `app.js`, pack, or test edits |
| Module lifecycle and append policy | Implementation PRs, feature flags, CI wiring |
| Planning-phase exit checklist | Sprint 39 specification content |
| Pointers to validation checklist and probes | New probe scripts (implementation phase) |

---

## 1. Enforceable maintenance rules

Principles from the charter and [38B-2](38B-2-instruction-taxonomy.md) are binding as **Maintenance Rules (MR)**. Violations block merge unless a documented waiver (§5) applies.

| ID | Rule | Enforcement |
|----|------|-------------|
| **MR-01** | Every new or changed prompt instruction **must** map to exactly one taxonomy layer **L0–L8** and one cluster ID (38B-2 § cluster registry) or new cluster proposal in the same PR. | PR template + reviewer checklist |
| **MR-02** | Every block or pack section **must** declare **scope**: `step_id`(s), governs `page` \| `activity` \| `materials` \| `figure` \| `upstream_artefact`. | Reject if scope missing |
| **MR-03** | **Precedence** must not contradict the global ladder (38B-2): L2 > L3 > L4 > L5 > L6 > L7 > overview-only prose. Conflicts require explicit “lower layer yields” sentence. | Reviewer + 38B-6 PREC if L4–L6 touched |
| **MR-04** | **Reference once** — duplicated constraints use a canonical module ID (`LD-*`) or pack paragraph anchor; no copy-paste of full tables/materials rules across steps. | PROBE + diff review |
| **MR-05** | **One compact example** per pattern (JSON or markdown); extended fixtures live under `tests/fixtures/` with links in pack notes only. | Token budget review |
| **MR-06** | Design Page or GAM changes that touch **L4** require materials/table validation per [38B-6](38B-6-regression-validation-plan.md) before merge (AUTO today; AUTO* when added). | CI / checklist |
| **MR-07** | **Prompt size delta** recorded in every prompt PR (§6 reporting format). Increase >10% on a heavy step without consolidation issue reference → escalation. | Sprint owner |
| **MR-08** | **Sprint 38 schema 38.4** is frozen — affordance semantics change only via Sprint 38 programme + `lib/sprint38-visual-affordances.js`; not ad-hoc duplicate JSON examples in new blocks. | CC-SCHEMA path |
| **MR-09** | **Sprint 39** new cue fields/instructions remain **gated** until 38B planning exit (§9) and implementation programme exit (38B-6 §7.5) unless slotted into L5–L6 with taxonomy PR. | Sprint owner |
| **MR-10** | **Table fidelity** rules must appear in `LD-TABLE-FIDELITY` (or successor) for both **GAM (author)** and **Design Page (preserve)** when either step’s L4 text changes. | 38B-4 + 38B-5 wave order |
| **MR-11** | **Figure duplicate/avoid** language must include “figures only, not page tables or `activity.materials`”. | L6 review |
| **MR-12** | **Evidence-backed length claims** — “reduced prompt” requires probe numbers and 38B-6 anchor tier met for the change class (§4). | PROBE attachment |

---

## 2. Ownership

Ownership is **accountable role**, not exclusive implementer. Escalation path: **Author → Reviewer → Sprint owner → LD architecture maintainer**.

### 2.1 Shared modules (`LD-*`)

| Module ID | Layer(s) | Owner | Co-owner | Canonical location (target) |
|-----------|----------|-------|----------|----------------------------|
| `LD-SOURCE-MEMBERSHIP` | L2–L3 | LD architecture maintainer | Design Page step owner | Pack §13 + single runtime ref |
| `LD-MATERIALS-COPY` | L4 | Materials fidelity owner | Design Page step owner | Pack + `buildDesignPage…` successor |
| `LD-TABLE-FIDELITY` | L4 | Materials fidelity owner | GAM step owner | Pack §6, §13 + GAM/Design Page refs |
| `LD-PEL-PRESERVE` | L5 | PEL / enrichment owner | DLA step owner | Pack §5 + conditional runtime |
| `LD-SELF-DIRECTED-RHETORIC` | L5–L7 | Self-directed brief owner | Assessment step owner | Single brief-gated append |
| `LD-SPRINT38-AFFORDANCE` | L6 | Sprint 38 owner | Design Page step owner | Pack §13 rider + `applySprint38…` |
| `LD-MATH-RENDER` | L7 | Renderer compatibility owner | All heavy steps | Shared math block |
| `LD-ASSESSMENT-PRESERVE` | L1, L3 | Assessment step owner | Design Page step owner | Pack §9 + §13 |
| `LD-DESIGN-PAGE-COMPOSE-CONTRACT` | L0–L4, L8 | Design Page step owner | LD architecture maintainer | [38B-3](38B-3-design-page-consolidation-plan.md) target |

**Module text changes:** Owner approves content; LD architecture maintainer approves cross-step references and lifecycle promotion (§7).

### 2.2 Workflow-step contracts

| Step | Pack section | Runtime chain owner | Contract doc |
|------|--------------|---------------------|--------------|
| Model Knowledge | §3 | Foundation LD maintainer | 38B-1 row |
| Define Learning Outcomes | §4 | Foundation LD maintainer | 38B-1 row |
| Design Learning Activities | §5 | DLA step owner | 38B-1, 38B-5 wave 2b |
| Generate Activity Materials | §6 | GAM step owner | 38B-1, 38B-4, 38B-5 wave 2a |
| Generate Assessment Items | §9 | Assessment step owner | 38B-1, wave 4 |
| Construct Learning Sequence | §10 | Sequence step owner | 38B-1 |
| Design Page | §13 | Design Page step owner | 38B-3, 38B-6 |

**Pack file:** `domains/learning-design/domain-learning-design-step-patterns.md` — changes reviewed by step owner + LD architecture maintainer when § crosses steps.

**Runtime file:** `app.js` → `applyWorkflowStepRuntimePromptAugmentations` — step owner proposes; LD architecture maintainer enforces MR-01–MR-04 and append policy (§8).

### 2.3 Sprint 38 affordance contract

| Asset | Owner | Frozen? |
|-------|-------|---------|
| Schema `38.4`, compose validator | Sprint 38 owner | **Yes** — CC-SCHEMA |
| `lib/sprint38-visual-affordances.js` | Sprint 38 owner | Behaviour frozen; bugfix only |
| `LD-SPRINT38-AFFORDANCE` prompt rider | Design Page step owner + Sprint 38 owner | Wording only via CC-PROMPT / CC-MODULE |
| Renderer / VEU / CSS / images | Sprint 38 owner | Out of 38B scope |

Prompt prose must not redefine schema fields; reference ARCHITECTURE.md and schema version only.

### 2.4 Materials and table fidelity rules

| Concern | Owner | Evidence |
|---------|-------|----------|
| L4 precedence, case matrix | Materials fidelity owner | [38B-4](38B-4-materials-and-table-fidelity.md) |
| Placeholder detection | Materials fidelity owner | `lib/design-page-materials-fidelity.js` |
| Future comma-row / pipe detectors | Materials fidelity owner | 38B-6 §2 AUTO* backlog |
| GAM as table author | GAM step owner | 38B-4 §1, 38B-5 dependency graph |

### 2.5 Validation framework

| Asset | Owner |
|-------|-------|
| [38B-6](38B-6-regression-validation-plan.md) assertion matrix | QA / validation owner |
| [probe-38B-6-regression-validation-checklist.md](../fixtures/probe-38B-6-regression-validation-checklist.md) | QA / validation owner |
| Probe scripts `scripts/probe-38b1-*.js` | LD architecture maintainer |
| Anchor fixtures `tests/fixtures/page-render/` | Step owner for anchor + QA for cross-cutting |

---

## 3. Hierarchy and layer ownership

| Layer | Name | Primary owner | May not be weakened by |
|-------|------|---------------|-------------------------|
| L0 | Core task | Step owner | — |
| L1 | Hard output schema | Step owner + Sprint 38 owner (affordance keys) | L5–L7 |
| L2 | Source fidelity | LD architecture maintainer | L5–L7 |
| L3 | Activity composition | Design Page + Sequence owners | L5–L7 |
| L4 | Materials + table fidelity | Materials fidelity owner | L5–L7, overview |
| L5 | Pedagogical preservation | PEL / self-directed owner | L7-only rhetoric |
| L6 | Visual affordance metadata | Sprint 38 owner | Must not override L4 |
| L7 | Rendering compatibility | Renderer owner | — |
| L8 | Validation checklist | QA / validation owner | — |

---

## 4. Change classes

| Class | ID | Examples | Approvals required | Validation level |
|-------|-----|----------|-------------------|------------------|
| Documentation only | **CC-DOC** | Observations, README, charter, checklist wording | Author + Reviewer (1) | None — no runtime |
| Prompt wording | **CC-PROMPT** | Rephrase within same layer/scope; typo; precedence clarifier | Step owner + Reviewer | **L1:** AUTO suite; **L2:** PROBE if same step; anchor note if L4–L6 scope |
| Shared module | **CC-MODULE** | `LD-*` text add/trim; lifecycle promotion | Module owner + LD architecture maintainer + Reviewer | **L2:** PROBE all referencing steps; **L3:** 38B-6 checklist tier per §38B-6 §3 |
| Workflow contract | **CC-CONTRACT** | Pack § rewrite; collapse append chain; new `build*PromptBlock` | Step owner + LD architecture maintainer + Sprint owner | **L4:** Full 38B-6 per wave gate; Inflation **MANUAL** mandatory |
| Schema-affecting | **CC-SCHEMA** | `visual_affordance_schema_version`, affordance types, compose rules | Sprint 38 owner + programme lead | Sprint 38 E2E suite + charter freeze review; **not** 38B-only |

### Validation level key

| Level | Meaning |
|-------|---------|
| **L1** | `node --test tests/*.test.js` green |
| **L2** | PROBE: augmented chars + append marker count vs 38B-1 baseline |
| **L3** | [38B-6 checklist](../fixtures/probe-38B-6-regression-validation-checklist.md): AUTO + anchors per change type |
| **L4** | L3 + live Inflation rerun (or approved golden JSON) + PREC-01–04 when L4/L6 touched |
| **L5** | Programme-level: all four anchors + 38B-6 §7.5 exit (implementation completion only) |

### Combined requirements matrix

| Class | Min validation | Sprint owner | Block without waiver |
|-------|----------------|--------------|----------------------|
| CC-DOC | — | No | — |
| CC-PROMPT | L1; L2 if augmented size changes | No | P0 test fail |
| CC-MODULE | L1 + L2 + L3 | Yes if >10% size ↑ any heavy step | Missing module owner review |
| CC-CONTRACT | L1–L4 | Yes | Open P0 on Inflation |
| CC-SCHEMA | Sprint 38 programme criteria | Programme lead | 38B charter freeze breach |

---

## 5. Waiver policy

Waivers are **exceptional**, time-bounded, and visible. Default: **no waiver** for P0 failures ([38B-6](38B-6-regression-validation-plan.md) regression matrix).

### 5.1 Who may approve

| Severity | Approver | Cannot approve |
|----------|----------|----------------|
| **P2** only (e.g. overview prose thinning, materials intact) | Sprint owner | Author alone |
| **P1** (single anchor, non-Inflation) | Sprint owner + module owner | Reviewer alone |
| **P0** | Programme lead only | Sprint owner alone |
| Prompt size over hard threshold (§6) | Sprint owner + LD architecture maintainer | — |
| CC-SCHEMA | Programme lead + Sprint 38 owner | 38B sprint owner alone |

### 5.2 Duration

| Waiver type | Max duration | Expiry |
|-------------|--------------|--------|
| P2 field-specific | **1 PR** | Must clear in next PR touching same layer/step |
| P1 anchor-specific | **14 calendar days** or **2 PRs**, whichever is sooner | Revalidation required before expiry |
| P0 | **Discouraged** — max **7 days** with rollback plan | Mandatory revalidation on expiry |
| Size threshold | Next PR only | Must return under threshold or split change |

### 5.3 Revalidation requirements

On waiver expiry or before closing waiver:

1. Re-run validation level for the change class (§4).  
2. Re-execute failed assertions from 38B-6 matrix by ID.  
3. Update checklist **Open failures / waivers** table with **CLEARED** or new waiver ID.  
4. P0 waivers require Inflation **PREC-01** and **L4-04** pass (MANUAL or AUTO*).  

**Waivers do not apply** to CC-SCHEMA freeze breaches or MR-08 violations.

### 5.4 Waiver record (required fields)

| Field | Required |
|-------|----------|
| Waiver ID | `WVR-YYYYMMDD-n` |
| Assertion / rule IDs | e.g. L4-04, PREC-01 |
| Severity | P0 / P1 / P2 |
| Anchor | Inflation / CI / … |
| Approver(s) | Names + roles |
| Expiry | Date or PR #
| Rollback plan | Branch/tag or revert steps |

---

## 6. Prompt-size governance

### 6.1 Measurement source

| Metric | Source | Brief context |
|--------|--------|---------------|
| `seeded_prompt_chars` | `scripts/probe-38b1-ld-workflow-prompt-audit.js` | Per `workflowStepId` |
| `augmented_prompt_chars` | Same probe | After `applyWorkflowStepRuntimePromptAugmentations` |
| `append_marker_count` | Probe block name list | Distinct runtime markers |
| Design Page detail | `scripts/probe-38b1-design-page-prompt-size.js` | Optional breakdown |

**Baseline (38B-1, self-directed):** Design Page **45,791**; DLA **39,201**; GAM **34,482**; Assessment **32,308**.

**Post-consolidation targets (planning):** Design Page augmented **≤22,000**; heavy steps **≤3** append markers ([38B-3](38B-3-design-page-consolidation-plan.md), [38B-5](38B-5-workflow-wide-review.md)).

### 6.2 Reporting format (every CC-PROMPT, CC-MODULE, CC-CONTRACT PR)

```markdown
### Prompt size report
| Step | Baseline aug | New aug | Δ% | Markers before → after |
|------|-------------:|--------:|---:|------------------------|
| design_page | 45791 | | | 15 → |
| … | | | | |
Probe: `node scripts/probe-38b1-ld-workflow-prompt-audit.js` (attach log or commit hash)
```

### 6.3 Thresholds (self-directed augmented chars)

| Tier | Condition | Action |
|------|-----------|--------|
| **Green** | Δ ≤ +5% vs baseline on touched heavy step | Normal review |
| **Yellow** | +5% < Δ ≤ +10% | Reviewer must note justification in PR |
| **Orange** | +10% < Δ ≤ +15% **or** markers +1 without module consolidation | Sprint owner approval (MR-07) |
| **Red** | Δ > +15% **or** Design Page > **30,000** pre-consolidation programme | Block merge; split PR or consolidation issue required |
| **Target breach** | Post-implementation: Design Page > **22,000** | CC-CONTRACT fail until remediated |

Low-risk steps (MK, Outcomes, Sequence augmented &lt;5k): Yellow tier at +15% instead of +10%.

### 6.4 Escalation triggers

| Trigger | Escalate to | Required artefact |
|---------|-------------|-------------------|
| Red tier on any heavy step | LD architecture maintainer | Probe report + rollback plan |
| Markers >5 on one step after Wave 1 | Sprint owner | 38B-2 taxonomy map showing layer per marker |
| Two consecutive Orange PRs same step | Programme lead | Consolidation plan update (38B-3/5) |
| Augmented total (4 heavy steps) > **152k** (38B-1 sum) | Programme lead | Wave reorder or scope cut |
| Placeholder or comma-row CI failure | Materials fidelity owner | 38B-4 case ID |

---

## 7. Module lifecycle

Applies to all `LD-*` modules and step-level consolidated contracts.

```text
proposed → experimental → canonical → deprecated → removed
```

| State | Entry criteria | Allowed consumers | Promotion / exit |
|-------|----------------|-------------------|------------------|
| **proposed** | Taxonomy cluster mapped; owner named; text in PR only | None in production runtime | Reviewer + module owner → **experimental** |
| **experimental** | Behind brief flag or single step opt-in; PROBE tracked | One step + documented in PR | 38B-6 L3 on mandatory anchor → **canonical** |
| **canonical** | Wave gate passed; single authority (MR-04); 38B-6 signed | All steps in module table §2.1 | Successor module approved → **deprecated** |
| **deprecated** | Canonical successor merged; 90-day max | References only; no new text | No references in probe → **removed** |
| **removed** | Probe shows zero markers for old ID | — | Archive text in observations only |

**Rules:**

- Two **canonical** modules must not govern the same layer+scope (MR-04).  
- **experimental → canonical** requires module owner + LD architecture maintainer + Sprint owner.  
- **deprecated** modules must include “superseded by `LD-*`” header in text until **removed**.

---

## 8. No unbounded append policy (GAP)

**Policy statement:** No new runtime auto-applied prompt block may merge without taxonomy layer assignment, scope declaration, owner approval, and adherence to append limits.

| ID | Requirement |
|----|-------------|
| **GAP-01** | **One layer per append unit** — a single appended string may cover adjacent layers only if documented in 38B-3-style layer list (e.g. L0–L4 + L8 compose contract). |
| **GAP-02** | **Marker budget** — self-directed heavy steps: **≤3** append markers post-consolidation; until then, **no new markers** without removing or merging existing (net zero or negative). |
| **GAP-03** | **No parallel rhetoric** — clusters 1, 11, 12 must not add a tenth rhetoric block; extend `LD-SELF-DIRECTED-RHETORIC` only. |
| **GAP-04** | **L4 before L6** — table/materials modules must be referenced before Sprint 38 rider in augmentation order (matches 38B-1 runtime order intent). |
| **GAP-05** | **Brief gating** — self-directed-only blocks stay behind `delivery_context: self_directed` (or successor flag); no duplicate facilitated variant without CC-CONTRACT. |
| **GAP-06** | **Freeze append during P0** — while 38B-4 B4-01/B4-02 open on Inflation, **CC-PROMPT** may only add L4 precedence clarifiers; no new L5–L7 blocks. |

### Append request template (required in PR)

```markdown
- Layer: L_
- Cluster: #
- Module ID: LD-* or NEW (proposed)
- Scope: steps / governs
- Markers before → after:
- Replaces (ID): none | LD-* | block name
```

Reject if template incomplete or GAP-02 violated.

---

## 9. Anti-patterns (forbidden)

| Anti-pattern | Rule violated | Severity |
|--------------|---------------|----------|
| New 50+ line auto-applied block without consolidation issue | GAP-01, MR-01 | Block merge |
| “Summarise materials for brevity” without overview-only scope | MR-03, PREC-02 | P0 |
| “Duplicate table” without “figures only” | MR-11 | P1 |
| Second full Sprint 38 JSON example in another block | MR-08, MR-05 | P1 |
| Table rules only on GAM, not Design Page | MR-10 | P1 |
| New step-specific copy of `LD-TABLE-FIDELITY` | MR-04 | Orange |
| Sprint 39 cue block before planning exit | MR-09 | Block merge |

---

## 10. PR checklist (binding for CC-PROMPT and above)

- [ ] Change class (CC-*) declared  
- [ ] MR-01 layer + cluster; MR-02 scope  
- [ ] Precedence vs 38B-2 documented if L4–L7  
- [ ] Module lifecycle state if `LD-*` touched  
- [ ] GAP append template filled  
- [ ] Prompt size report (§6.2)  
- [ ] 38B-6 checklist tier met (§4)  
- [ ] Waiver record if any P1/P2 fail  
- [ ] Sprint 38 freeze respected (MR-08)  

---

## 11. Metrics to track (implementation phase optional)

| Metric | Owner | Cadence |
|--------|-------|---------|
| `design_page_augmented_prompt_chars` | LD architecture maintainer | Per PR |
| `heavy_step_append_marker_count` | LD architecture maintainer | Per PR |
| `placeholder_only_materials_failures` | Materials fidelity owner | CI |
| `comma_row_table_failures` | Materials fidelity owner | CI when AUTO* lands |
| `waiver_open_count` | QA / validation owner | Weekly during programme |

---

## 12. Sprint 38-B planning exit checklist

Formal **planning phase close** — all boxes required before **implementation programme** charter or Sprint 39 ungate discussion.

### Observation slices

- [x] **38B-1** — Priority steps audited; probe baselines recorded  
- [x] **38B-2** — Twelve clusters; precedence ladder; `LD-*` module IDs  
- [x] **38B-3** — Block → layer map; Strategy B; targets ([PLANNING-CLOSURE-SUMMARY](../PLANNING-CLOSURE-SUMMARY.md))  
- [x] **38B-4** — Failure modes + requirements (**regression OPEN** B4-01/B4-02; live JSON not planning gate)  
- [x] **38B-5** — Waves 1–4 and priority ranking  
- [x] **38B-6** — Validation framework + checklist  
- [x] **38B-7** — This governance package  

### Governance artefacts

- [x] MR-01–MR-12 published  
- [x] Ownership tables (§2–§3)  
- [x] Change classes CC-DOC through CC-SCHEMA (§4)  
- [x] Waiver policy (§5)  
- [x] Prompt-size thresholds and escalation (§6)  
- [x] Module lifecycle (§7)  
- [x] GAP no-unbounded-append policy (§8)  

### Programme decisions (sign-off)

| Decision | Owner | Date | Status |
|----------|-------|------|--------|
| Planning phase closed; implementation not auto-started | Programme lead | 2026-06-04 | **Closed** ([PLANNING-CLOSURE-SUMMARY](../PLANNING-CLOSURE-SUMMARY.md)) |
| Sprint 38 remains frozen | Sprint 38 owner | | |
| Sprint 39 remains gated until 38B-6 §7.5 **implementation** exit | Programme lead | | |
| Table fidelity fix order: Wave 1 `LD-TABLE-FIDELITY` → GAM → Design Page | Materials fidelity owner | 2026-06-04 | **Agreed** (38B-5) |

### Planning close sign-off

| Role | Name | Date |
|------|------|------|
| LD architecture maintainer | | |
| Materials fidelity owner | | |
| Programme lead | | |

**After sign-off:** Update [HANDOVER-AND-FORWARD-PLAN.md](../HANDOVER-AND-FORWARD-PLAN.md) planning exit section; point [NEXT-CHAT-CONTEXT.md](../../../../NEXT-CHAT-CONTEXT.md) to implementation charter (when created) — **not** part of this slice’s file edits unless requested.

---

## 13. Outputs (this slice)

- [x] Enforceable maintenance rules MR-01–MR-12  
- [x] Ownership for modules, steps, Sprint 38, materials/table, validation  
- [x] Change classes with approvals and validation levels  
- [x] Waiver policy (approver, duration, revalidation)  
- [x] Prompt-size governance (source, format, thresholds, escalation)  
- [x] Module lifecycle proposed → removed  
- [x] GAP no-unbounded-append policy tied to L0–L8  
- [x] Planning exit checklist (§12)  

---

## References

- Validation: [38B-6](38B-6-regression-validation-plan.md), [checklist](../fixtures/probe-38B-6-regression-validation-checklist.md)  
- Taxonomy: [38B-2](38B-2-instruction-taxonomy.md)  
- Consolidation waves: [38B-5](38B-5-workflow-wide-review.md)  
- Sprint 38 freeze: [Sprint 38 ARCHITECTURE.md](../2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/ARCHITECTURE.md)
