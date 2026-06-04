# Sprint 38-B Execution Charter — Wave 1 Shared Module Consolidation

**Pack:** `docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/`  
**Date:** 2026-06-04  
**Phase:** **Implementation** — Wave 1 only  
**Status:** **COMPLETE** — Wave 1 exit gate PR-W1-5 (2026-06-04). See [observations/38B-W1-5-wave-1-exit-gate.md](observations/38B-W1-5-wave-1-exit-gate.md). **Do not start Wave 2a** until programme lead confirms handoff.  
**Parent charter:** [SPRINT-38-B-CHARTER.md](SPRINT-38-B-CHARTER.md)  
**Planning inputs:** [38B-1](observations/38B-1-prompt-audit.md) · [38B-2](observations/38B-2-instruction-taxonomy.md) · [38B-3](observations/38B-3-design-page-consolidation-plan.md) · [38B-4](observations/38B-4-materials-and-table-fidelity.md) · [38B-5](observations/38B-5-workflow-wide-review.md) · [38B-6](observations/38B-6-regression-validation-plan.md) · [38B-7](observations/38B-7-governance-and-maintenance.md)

---

## 1. Wave 1 scope

Wave 1 establishes **canonical shared prompt modules** (`LD-*`) for instructions that today are duplicated across **Design Learning Activities (DLA)**, **Generate Activity Materials (GAM)**, **Generate Assessment Items**, and **Design Page** — without yet collapsing per-step append chains or rewriting pack contracts.

### 1.1 In scope

| Objective | Detail |
|-----------|--------|
| **Canonical module text** | One authoritative prose block per Wave 1 module ID, mapped to taxonomy layers **L4**, **L7**, and **L5–L7** (rhetoric), with global precedence ladder embedded where required ([38B-2](observations/38B-2-instruction-taxonomy.md)). |
| **Runtime wiring** | Refactor `app.js` augmentation so heavy steps **reference** shared builders instead of embedding duplicate full copies; preserve brief gating (`delivery_context: self_directed`) and augmentation **order** (L4 before L6 intent per GAP-04). |
| **Module registry** | Document module location, lifecycle state, and consumer steps in pack notes or a dedicated registry file (CC-MODULE). |
| **Parity baseline** | Record 38B-1 probe baselines before first merge; post-change PROBE must show net reduction or documented deferral. |
| **Table fidelity foundation** | `LD-TABLE-FIDELITY` includes 38B-4 consolidation requirements (pipe example, forbidden comma-row / `Headers`+`Rows` patterns, GAM row-adequacy, precedence over brevity) — **text only** in Wave 1; B4-01/B4-02 output fix is **not** claimed closed until Wave 2a/3. |

### 1.2 Wave 1 deliverables (documentation + code)

1. Four modules at lifecycle **experimental** → **canonical** at wave exit (§8).  
2. Refactored `build*PromptBlock` (or successor) functions that return module text by ID.  
3. Per-PR prompt size reports ([38B-7](observations/38B-7-governance-and-maintenance.md) §6.2).  
4. Signed [38B-6 checklist](fixtures/probe-38B-6-regression-validation-checklist.md) on each CC-MODULE PR.  
5. Updated observation note `observations/38B-W1-implementation-log.md` (optional, CC-DOC) — wave outcomes and probe table.

### 1.3 Implementation sequencing within Wave 1

Recommended PR order (dependencies):

```text
PR-W1-1  LD-TABLE-FIDELITY      (L4 — unblocks table author path; cluster 5)
PR-W1-2  LD-MATERIALS-COPY      (L4 — cluster 4; references table module)
PR-W1-3  LD-MATH-RENDER         (L7 — cluster 8; coexistence with pipes)
PR-W1-4  LD-SELF-DIRECTED-RHETORIC  (L5–L7 — cluster 1, 11; after L4 refs wired)
PR-W1-5  Wave exit gate         (PROBE + checklist; promote modules to canonical)
```

**Rationale:** Deploy L4 precedence and table anti-patterns before merging nine rhetoric markers ([38B-5](observations/38B-5-workflow-wide-review.md), [38B-4](observations/38B-4-materials-and-table-fidelity.md)).

---

## 2. Shared modules to extract and canonicalise

Wave 1 implements **exactly four** module IDs. Other `LD-*` IDs from [38B-2](observations/38B-2-instruction-taxonomy.md) are **named only** for downstream waves.

### 2.1 `LD-TABLE-FIDELITY` (L4 — cluster 5)

| Attribute | Value |
|-----------|--------|
| **Layers** | L4 |
| **Scope** | `materials.<table_key>`; governs **GAM (author)**, **Design Page (preserve)**, DLA `required_materials` **cross-reference** (spec vocabulary only) |
| **Owners** | Materials fidelity owner; GAM step owner (co-owner) |
| **Canonical content must include** | Global precedence snippet; pipe table GOOD example (≤6 lines); FORBIDDEN comma-row (`/^[^|\n]+,,,\s*$/`); FORBIDDEN `Headers` / `Rows` prose blocks; “table fidelity overrides brevity/summarisation”; figure duplicate rules **explicitly excluded** (figures only); GAM **row adequacy** (blank rows, mapping rows) merged into this module — no orphan `buildSelfDirectedGamTableRowAdequacyPromptBlock` text after Wave 1 exit |
| **Extract from (current)** | `buildSelfDirectedGamTableRowAdequacyPromptBlock`; GAM pack §6 pipe-table lines; Design Page materials fidelity table bullets; 38B-4 § consolidation requirements |
| **Consumers after Wave 1** | DLA, GAM, Design Page, Assessment (reference only if table mentioned — Assessment has no table author role) |
| **Target state** | Single function e.g. `buildLdTableFidelityPromptBlock({ role: 'author' \| 'preserve' \| 'spec' })` with role-specific riders ≤200 chars each |

### 2.2 `LD-MATERIALS-COPY` (L4 — cluster 4)

| Attribute | Value |
|-----------|--------|
| **Layers** | L4 (+ L5 field-preservation pointers on Design Page) |
| **Scope** | `activity.materials` bodies; verbatim copy from upstream `activity_materials`; no placeholder-only labels |
| **Owners** | Materials fidelity owner; Design Page step owner |
| **Canonical content must include** | Verbatim merge rules; no summarisation of `materials`; placeholder ban (align with `lib/design-page-materials-fidelity.js`); precedence: materials fidelity **over** overview/synthesis; pointer to `LD-TABLE-FIDELITY` for table-shaped fields |
| **Extract from (current)** | `buildDesignPageActivityMaterialsFidelityPromptBlock`; overlapping bullets in Design Page §13 pack `MATERIALS FIDELITY`; `buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock` (materials-relevant sentences only); GAM “full usable content” hard rules |
| **Consumers** | GAM (authoring density), Design Page (preserve) — DLA receives **one-line cross-ref** only in Wave 1 |
| **Target state** | One module; Design Page field-preservation defers duplicate materials bullets to `LD-MATERIALS-COPY` |

### 2.3 `LD-MATH-RENDER` (L7 — cluster 8)

| Attribute | Value |
|-----------|--------|
| **Layers** | L7 |
| **Scope** | TeX delimiters in prose fields; **must not** break pipe-table lines inside `materials.*` |
| **Owners** | Renderer compatibility owner |
| **Canonical content must include** | `\\(...\\)` / `\\[...\\]` rules; explicit coexistence: “do not code-fence pipe tables in materials” |
| **Extract from (current)** | `buildMathSafeOutputContractPromptBlock`; duplicated pack template lines on DLA, GAM, Assessment, Design Page |
| **Consumers** | DLA, GAM, Assessment, Design Page — **identical** module text; step-specific pack trim deferred to Wave 2–4 |
| **Target state** | `applyMathSafeOutputContractToDraft` appends **only** `LD-MATH-RENDER` (no per-step duplicate math paragraphs in runtime) |

### 2.4 `LD-SELF-DIRECTED-RHETORIC` (L5–L7 — clusters 1, 11, partial 7)

| Attribute | Value |
|-----------|--------|
| **Layers** | L5 (pedagogical preservation in overview/orientation fields), L7 (voice guardrails) |
| **Scope** | Self-directed brief only; **not** `materials` bodies; overview / `learning_purpose` / study tips / activity orientation fields |
| **Owners** | Self-directed brief owner; Assessment step owner (co-owner) |
| **Canonical content must include** | Merged substance of nine rhetoric blocks (~1.5k chars target per 38B-2); explicit subordination to L4; no “summarise materials”; worked-example / misconception / closure sections as **scoped** bullets; **no** tenth parallel rhetoric block (GAP-03) |
| **Extract from (current)** | `applySelfDirectedLearnerPageStepScaffoldsToDraft` chain: learner-action rhetoric, worked-example/faded, embedded feedback/misconception, concept/procedure, metacognitive closure, session orientation, conceptual tension, intellectual progression, epistemic synthesis, transfer/durable |
| **Consumers** | DLA, GAM, Assessment, Design Page |
| **Target state** | One append marker per step (e.g. `LD-SELF-DIRECTED-RHETORIC`) replacing nine distinct marker names in probe output — **same effective instruction**, fewer characters |

### 2.5 Modules explicitly deferred (not Wave 1)

| Module ID | Wave | Reason |
|-----------|------|--------|
| `LD-SOURCE-MEMBERSHIP` | 3–4 | Design Page / Sequence pack contract |
| `LD-PEL-PRESERVE` | 2b–3 | Brief-gated PEL/cognition |
| `LD-SPRINT38-AFFORDANCE` | 3 | Design Page only; Strategy B rider |
| `LD-ASSESSMENT-PRESERVE` | 4 | Assessment + Design Page L1/L3 |
| `LD-DESIGN-PAGE-COMPOSE-CONTRACT` | 3 | Full L0–L4 + L8 compose contract |

---

## 3. Success criteria

Wave 1 is **successful** when all criteria below are met at wave exit (PR-W1-5). Partial PRs must not claim wave exit.

### 3.1 Module authority (38B-6 §5 Wave 1)

| # | Criterion | Evidence |
|---|-----------|----------|
| S1 | Each of the four module IDs has **one** canonical text source in the repo | Code review + grep: no second full copy of table/materials rules in separate auto-applied blocks |
| S2 | Global precedence ladder + PREC-01–PREC-04 normative sentences appear in `LD-TABLE-FIDELITY` and/or `LD-MATERIALS-COPY` | Prompt text review |
| S3 | `LD-TABLE-FIDELITY` includes 38B-4 forbidden patterns and compact pipe GOOD example | Diff against [38B-4](observations/38B-4-materials-and-table-fidelity.md) § consolidation requirements |
| S4 | GAM row adequacy lives **inside** `LD-TABLE-FIDELITY` (author role), not a standalone orphan block | PROBE marker list for GAM |
| S5 | Rhetoric: **one** marker name per heavy step for merged rhetoric (not nine) | `probe-38b1-ld-workflow-prompt-audit.js` block list |
| S6 | L5-04: augmented prompts for all four heavy steps still **include** `LD-TABLE-FIDELITY` reference after rhetoric merge | PROBE or string inspect |

### 3.2 Behaviour preservation

| # | Criterion | Evidence |
|---|-----------|----------|
| S7 | **L8-01:** `node --test tests/*.test.js` — full suite green | CI / local |
| S8 | **L4-01–L4-03:** `tests/design-page-materials-fidelity.test.js` unchanged pass | AUTO |
| S9 | **L6-01–L6-03:** Sprint 38 tests green — Wave 1 must not touch affordance schema or compose | AUTO |
| S10 | No change to composed page JSON fixtures unless intentional documented change | Fixture diff review |
| S11 | Facilitated brief augmentation unchanged except math module consolidation (expected **+0** or math-only delta on facilitated probe) | PROBE both briefs |

### 3.3 Size and consolidation (38B-6 §5, 38B-7 MR-12)

| # | Criterion | Evidence |
|---|-----------|----------|
| S12 | **L8-02:** Combined augmented chars for DLA + GAM + Design Page + Assessment (self-directed) **↓ ≥15%** vs 38B-1 baseline (**152,782** total) **or** programme-lead documented deferral with remediation issue | Prompt size report |
| S13 | **Net-zero or negative** append marker count on each heavy step vs baseline (GAP-02) | 38B-1 baselines: DLA 14, GAM 15, Design Page 15, Assessment 11 |
| S14 | No heavy step enters **Red** tier (>+15% size) per [38B-7](observations/38B-7-governance-and-maintenance.md) §6.3 | Prompt size report |

### 3.4 Process

| # | Criterion | Evidence |
|---|-----------|----------|
| S15 | Every PR: change class **CC-MODULE**; MR-01–MR-04, GAP template; module owner + LD architecture maintainer review | PR records |
| S16 | Every PR: signed [38B-6 checklist](fixtures/probe-38B-6-regression-validation-checklist.md) attached | PR description |
| S17 | Modules promoted to lifecycle **canonical** per [38B-7](observations/38B-7-governance-and-maintenance.md) §7 | PR-W1-5 |

**Not Wave 1 success criteria:** B4-01/B4-02 closed on live Inflation rerun; Design Page ≤22k chars; ≤3 append units on Design Page — those belong to Waves 2–3.

---

## 4. Rollback criteria

Rollback is required when any **trigger** fires before wave exit sign-off. Rollback unit = **revert the merging PR** (or revert to tag recorded in PR prompt size report).

### 4.1 Automatic rollback triggers (P0)

| Trigger | Detection | Action |
|---------|-----------|--------|
| **R1** | Any **L8-01** test failure introduced by Wave 1 PR | Revert PR; reopen module as **experimental** |
| **R2** | **L4-01–L4-03** regression on `design-page-materials-fidelity.test.js` | Revert PR; materials fidelity owner triage |
| **R3** | Sprint 38 **L6-01–L6-03** failure | Revert PR — Wave 1 violated freeze (MR-08) |
| **R4** | PROBE shows **>+15%** augmented chars on any heavy step (Red tier) without approved deferral | Revert or split PR |
| **R5** | Duplicate **contradictory** table or materials rules detected in two full append blocks (38B-6 Wave 1 fail) | Revert offending PR; fix MR-04 violation |

### 4.2 Rollback triggers requiring programme decision

| Trigger | Detection | Action |
|---------|-----------|--------|
| **R6** | Combined 15% reduction target missed after PR-W1-4 | Programme lead: accept deferral, extend Wave 1, or rollback rhetoric merge only |
| **R7** | Facilitated brief gains unintended rhetoric blocks | Revert brief-gating change |
| **R8** | Live Inflation rerun shows **new** L4 failure mode attributable to Wave 1 text change | Revert last CC-MODULE PR; MANUAL 38B-4 case update |

### 4.3 Rollback procedure

1. Revert merge commit(s) for the failing PR.  
2. Record **WVR** only if programme lead approves temporary P0 carry (max 7 days per 38B-7 §5).  
3. Re-run **L8-01** + Inflation AUTO suite + PROBE baselines.  
4. Set affected modules to **deprecated** or **experimental** until root cause documented.  
5. Do **not** start Wave 2a (GAM) until Wave 1 exit criteria (§8) are met or programme lead issues written scope waiver.

### 4.4 Rollback preservation

After rollback, runtime must return to **pre-PR behaviour** for all workflow steps — same probe char counts (±1% tolerance) and same marker names as recorded in the reverted PR’s baseline snapshot.

---

## 5. Validation requirements (38B-6)

All Wave 1 work uses [38B-6](observations/38B-6-regression-validation-plan.md) and the [regression checklist](fixtures/probe-38B-6-regression-validation-checklist.md).

### 5.1 Every CC-MODULE PR (minimum)

| Requirement | Assertion IDs | Mode |
|-------------|---------------|------|
| Full test suite | L8-01 | AUTO |
| Materials fidelity tests | L4-01, L4-02, L4-03 | AUTO |
| Sprint 38 affordance tests (unchanged code path) | L6-01, L6-02, L6-03 | AUTO |
| Probe all four heavy steps | L8-02, L8-03, L5-04 | PROBE |
| Prompt size report | MR-07, §6.2 | MANUAL attachment |
| Checklist signed | L8-04 | MANUAL |

### 5.2 Wave 1 gate assertions (mandatory at exit)

| ID | Requirement |
|----|-------------|
| Wave 1 §5 | Module IDs deployed; precedence text; regression; prompt probe; anchors — per [38B-6 §5 Wave 1](observations/38B-6-regression-validation-plan.md#wave-1--shared-module-extraction) |
| **Inflation anchor** | Fixture-based AUTO: L4-01–L4-03; L3-01/02 where applicable; **no** live rerun required for Wave 1 exit |
| **Anchor tier** | Inflation **MANDATORY** (fixtures); Climate/Marx **N/A** unless PR touches L6 or voice-only rhetoric |
| **PREC** | PREC-01–PREC-04 **not** required at Wave 1 exit (Design Page output gate — Wave 3); Wave 1 must not **weaken** precedence **text** |

### 5.3 Planned automation (optional in Wave 1, not blocking)

| ID | Item | Note |
|----|------|------|
| L4-04–L4-06 | Comma-row / pipe / Headers-Rows detectors | 38B-6 AUTO* backlog — may land in PR-W1-1 if materials fidelity owner approves; **not** required for Wave 1 exit |
| L4-07 | GAM upstream pipe capture | Wave 2a MANUAL |

### 5.4 Validation the Wave 1 programme must not claim

- B4-01/B4-02 **closed** on live Inflation JSON  
- PREC-01–PREC-04 PASS on live Design Page rerun  
- Design Page augmented ≤22,000 chars  
- Programme-level 38B-6 §7.5 exit  

---

## 6. Governance requirements (38B-7)

Wave 1 PRs are governed by [38B-7](observations/38B-7-governance-and-maintenance.md). Binding rules:

### 6.1 Maintenance rules (selected)

| ID | Wave 1 application |
|----|-------------------|
| **MR-01** | Every module paragraph tagged L4/L5/L7 + cluster 4, 5, 8, or 1 |
| **MR-02** | Scope declared: steps + `materials` / `page` / `upstream_artefact` |
| **MR-03** | Precedence ladder in L4 modules; no “summarise materials” without overview-only scope |
| **MR-04** | **Reference once** — consumers call shared builder; no full duplicate in pack + two runtime blocks |
| **MR-06** | L4 module PRs run materials fidelity AUTO suite |
| **MR-07** | Prompt size report every PR |
| **MR-08** | **No** Sprint 38 schema, renderer, VEU, or `LD-SPRINT38-AFFORDANCE` edits |
| **MR-09** | Sprint 39 remains gated |
| **MR-10** | `LD-TABLE-FIDELITY` is single authority for table rules referenced by GAM and Design Page paths in code |
| **MR-11** | Figure duplicate/avoid language absent from L4 modules or scoped “figures only” |
| **MR-12** | Reduction claims require PROBE evidence |

### 6.2 Change class

| Work | Class | Approvals |
|------|-------|-----------|
| Module text + `app.js` wiring | **CC-MODULE** | Module owner + LD architecture maintainer + Reviewer |
| Registry / observation log only | **CC-DOC** | Reviewer |
| Pack § one-line cross-ref to `LD-*` | **CC-PROMPT** or **CC-MODULE** (if L4 touched) | Step owner + module owner |

**Forbidden in Wave 1:** **CC-CONTRACT** (full pack rewrite / Design Page compose contract), **CC-SCHEMA**.

### 6.3 Append policy (GAP)

| ID | Wave 1 rule |
|----|-------------|
| **GAP-01** | One module = one append unit per layer group (rhetoric merge allowed L5+L7) |
| **GAP-02** | **No new markers** without removing/merging; net ≤ baseline per step |
| **GAP-03** | Rhetoric extends `LD-SELF-DIRECTED-RHETORIC` only |
| **GAP-04** | Wire order: table/materials modules before any remaining Sprint 38 block on Design Page |
| **GAP-05** | Self-directed gating preserved |
| **GAP-06** | While B4-01/B4-02 **open**: only **L4** clarifiers allowed — **no new L5–L7** content beyond merging existing rhetoric into one module (no new pedagogy) |

### 6.4 Module lifecycle

| Stage | Wave 1 |
|-------|--------|
| Entry | **proposed** in PR-W1-1 design note |
| During PRs | **experimental** — all four consumers may reference |
| Wave exit | **canonical** — achieved PR-W1-5 (2026-06-04) |
| **deprecated** / **removed** | Not used in Wave 1 |

### 6.5 Waivers

P0 test or L4 fixture failures: **no waiver** without programme lead + rollback plan ([38B-7](observations/38B-7-governance-and-maintenance.md) §5). Orange/Red size tiers require sprint owner or LD architecture maintainer per §6.3.

---

## 7. Wave 1 exit criteria (gate before Wave 2a GAM)

Wave 2a (**Generate Activity Materials**) must **not** start until the programme lead confirms **all** exit boxes:

| # | Exit criterion | Owner sign-off |
|---|----------------|----------------|
| E1 | Success criteria **S1–S17** (§3) satisfied | LD architecture maintainer |
| E2 | Four modules lifecycle **canonical** | Module owners |
| E3 | 38B-6 Wave 1 gate **PASS** ([§5](observations/38B-6-regression-validation-plan.md#wave-1--shared-module-extraction)) | QA / validation owner |
| E4 | PROBE baseline table archived (before/after chars + markers for DLA, GAM, Design Page, Assessment) | LD architecture maintainer |
| E5 | No open **P0** rollback triggers (§4) | Sprint owner |
| E6 | `LD-TABLE-FIDELITY` and `LD-MATERIALS-COPY` referenced in code paths for GAM and Design Page | GAM + Design Page step owners |
| E7 | Written note: B4-01/B4-02 remain **OPEN**; Wave 2a owns table **author** output fix | Materials fidelity owner |
| E8 | Sprint 38 freeze verified — no diff in `lib/sprint38-visual-affordances.js`, schema, renderer | Sprint 38 owner |
| E9 | [PLANNING-CLOSURE-SUMMARY](PLANNING-CLOSURE-SUMMARY.md) implementation prerequisites 2–5 satisfied | Programme lead |

**Handoff to Wave 2a:** GAM collapses to ≤3 append units, applies `LD-TABLE-FIDELITY` author role, removes duplicate pack table prose — per [38B-5](observations/38B-5-workflow-wide-review.md).

---

## 8. Out of scope (explicit)

The following are **out of scope** for Wave 1. Doing them in Wave 1 PRs is a **scope violation** unless programme lead amends this charter.

| Item | Deferred to |
|------|-------------|
| `LD-DESIGN-PAGE-COMPOSE-CONTRACT` / Strategy B full compose prose | Wave 3 |
| `LD-SPRINT38-AFFORDANCE` consolidation / pack Sprint 38 trim | Wave 3 |
| `LD-PEL-PRESERVE`, cognition scaffold merge | Wave 2b–3 |
| `LD-SOURCE-MEMBERSHIP`, `LD-ASSESSMENT-PRESERVE` | Waves 3–4 |
| Design Page augmented ≤22k; ≤3 final append units | Wave 3 |
| Pack `defaultPromptNotes` major trim / CC-CONTRACT | Waves 2–4 |
| Live Inflation LLM rerun; golden JSON for B4-01/B4-02 | Wave 2a–3 (EV-38B4-01–03) |
| AUTO* detectors L4-04–L4-06 (optional, not required) | Wave 1–3 implementation |
| Renderer, VEU, CSS, image pipeline, compose validator changes | Frozen (Sprint 38) |
| Sprint 39 reasoning cue specification or prompts | Gated |
| Closing B4-01/B4-02 on production evidence | Waves 2a–3 |
| Wave 4 Assessment / Sequence / MK / Outcomes pack trim | Wave 4 |
| New runtime markers or pedagogy (GAP-06) | Forbidden |
| Behaviour-changing compose/post-process logic | Forbidden unless separate approved fix |

---

## 9. Behaviour preservation principle

> **Unless a change is intentional, validated, and documented, Wave 1 must preserve all existing runtime behaviour.**

### 9.1 What “preserve” means

| Dimension | Requirement |
|-----------|-------------|
| **Test contracts** | Existing AUTO tests pass without weakening assertions. |
| **Output shape** | LLM prompt **effective requirements** remain equal or **stricter** (precedence clarifiers allowed; never silently drop table/materials rules). |
| **Brief gating** | Facilitated workflows do not gain self-directed rhetoric blocks. |
| **Augmentation order** | L4 module application before Sprint 38 on Design Page unchanged in effect. |
| **Sprint 38** | No schema, compose, or renderer behaviour change. |
| **Upstream merge** | `mergeActivityMaterialObjects` and fidelity helpers unchanged in Wave 1 unless fixing unrelated bug with separate approval. |

### 9.2 Intentional changes allowed

- **Consolidation:** Duplicate prose removed where a canonical module restates the same rule with **equal or stronger** precedence.  
- **Clarifiers:** L4 anti-patterns from 38B-4 added to `LD-TABLE-FIDELITY` (stricter).  
- **Marker renames:** Probe block names may change from nine rhetoric names to one module ID — not a behaviour change if text is equivalent.  

### 9.3 Intentional changes forbidden without Wave 2+ charter

- Weakening “verbatim materials” or pipe-table requirements.  
- Removing row-adequacy rules from GAM path.  
- Trimming Sprint 38 JSON examples in pack or runtime.  
- Changing `visual_affordance_schema_version` or affordance types.

### 9.4 Verification before merge (each PR)

1. `node --test tests/*.test.js`  
2. PROBE before/after attached to PR  
3. Reviewer confirms **no** scope item from §8  
4. Checklist Wave 1 section complete  

---

## 10. References and baselines

### 10.1 Probe baselines and Wave 1 trajectory (self-directed augmented)

| Milestone | DLA | GAM | Assessment | Design Page | **Sum** | Δ vs prior |
|-----------|----:|----:|-----------:|------------:|--------:|-----------|
| **38B-1 baseline** | 39,201 | 34,482 | 32,308 | 45,791 | **152,782** | — |
| Post PR-W1-1 | 39,380 | 36,356 | 32,308 | 47,944 | **155,988** | +2.1% |
| Post PR-W1-2 | 39,380 | 37,516 | 32,308 | 48,495 | **157,699** | +1.1% |
| Post PR-W1-3 | 39,106 | 37,226 | 32,034 | 48,205 | **156,571** | −0.7% |
| **Post PR-W1-4 / Wave 1 exit** | 18,054 | 16,370 | 11,109 | 27,345 | **72,878** | −53.5% |
| **Reduction vs 38B-1** | −54.0% | −52.5% | −65.6% | −40.3% | **−52.3%** | S12 target ≤129,865 **met** |

| Step | 38B-1 markers | Wave 1 exit markers |
|------|-------------:|--------------------:|
| DLA | 14 | **5** |
| GAM | 15 | **6** |
| Assessment | 11 | **2** |
| Design Page | 15 | **6** |

**Seeded chars (unchanged by Wave 1):** Design Page 9,648 · DLA 3,470 · GAM 4,377 · Assessment 6,350.

Commands:

```bash
node scripts/probe-38b1-ld-workflow-prompt-audit.js
node scripts/probe-38b1-design-page-prompt-size.js
```

### 10.2 Key code locations (extraction targets)

| Asset | Location |
|-------|----------|
| Runtime augmentation chain | `app.js` → `applyWorkflowStepRuntimePromptAugmentations` |
| Math block | `buildMathSafeOutputContractPromptBlock` |
| GAM table row adequacy | `buildSelfDirectedGamTableRowAdequacyPromptBlock` |
| Design Page materials fidelity | `buildDesignPageActivityMaterialsFidelityPromptBlock` |
| Self-directed scaffolds | `applySelfDirectedLearnerPageStepScaffoldsToDraft` |
| Pack patterns | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Materials tests | `lib/design-page-materials-fidelity.js`, `tests/design-page-materials-fidelity.test.js` |

### 10.3 Programme pointers

| Next phase | Document |
|------------|----------|
| Wave 2a GAM | [38B-5](observations/38B-5-workflow-wide-review.md) § Wave 2a |
| Table regression | [38B-4](observations/38B-4-materials-and-table-fidelity.md) |
| Design Page target | [38B-3](observations/38B-3-design-page-consolidation-plan.md) |
| Programme exit | [38B-6 §7.5](observations/38B-6-regression-validation-plan.md) |

---

## 11. Sign-off

| Role | Name | Date | Wave 1 authorised |
|------|------|------|-------------------|
| Programme lead | | | |
| LD architecture maintainer | | | |
| Materials fidelity owner | | | |
| GAM step owner | | | |

**Charter version:** 1.0 (2026-06-04)  
**Supersedes:** Planning-only mode in [SPRINT-38-B-CHARTER.md](SPRINT-38-B-CHARTER.md) for Wave 1 workstream only.
