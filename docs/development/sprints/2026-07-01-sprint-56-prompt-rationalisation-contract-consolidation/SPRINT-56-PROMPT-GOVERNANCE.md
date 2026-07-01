# Sprint 56 — Prompt Governance Proposal

**Status:** Proposed — adoption target Sprint 56 Phase 5  
**Applies to:** DLA, GAM, Design Page, assessment producers, domain-pack templates  

---

## Goal

Prevent future prompt accretion by enforcing **single source of truth (SSOT)**, measurable size budgets, and explicit supersession — so new requirements consolidate or replace old guidance rather than append duplicate layers.

---

## Single Source Of Truth (SSOT) Contracts

| Concern | SSOT module | Prompt marker | May not duplicate |
|---------|-------------|---------------|-------------------|
| Guided learning scaffold prose | `lib/ld-guided-learning-scaffold.js` | `LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT` | Word ranges, PRE-EMIT, scaffold exemplars |
| Cognition orientation semantics | *Merged into scaffold SSOT for DLA* | — | Field mandatory sets |
| Activity preamble exposition | *Merged into scaffold SSOT for DLA* | — | Preamble ranges |
| Table fidelity (spec role) | `lib/ld-table-fidelity.js` | `LD-TABLE-FIDELITY` | Pipe-table rules |
| Materials copy (GAM) | `lib/ld-materials-copy.js` | `LD-MATERIALS-COPY` | Verbatim copy rules |
| Design Page compose | `lib/ld-design-page-compose-contract.js` | `LD-DESIGN-PAGE-COMPOSE-CONTRACT` | Preservation boundary |
| Math notation | `lib/ld-math-render.js` | `LD-MATH-RENDER` | TeX delimiter rules |
| Obligation population | Domain pack step template | Base `Task:` section | Beat/material gates |

**Rule:** If text appears in SSOT, other blocks may **reference** SSOT by marker only (≤2 lines), not restate rules.

---

## Contract Ownership

| Role | Responsibility |
|------|----------------|
| **Contract owner** | Named module maintainer; approves SSOT changes |
| **Prompt assembler** | `app.js` `apply*ToDraft` chain — no inline duplicate rules |
| **Domain pack editor** | Base templates — no learner-page scaffold ranges (defer to SSOT) |
| **Sprint lead** | Size budget exceptions |

---

## Contract Lifecycle

```
Proposed → Active (SSOT) → Deprecated (pointer only) → Removed
```

| State | Emitted in prompt? | Tests |
|-------|---------------------|-------|
| Proposed | No | Design doc only |
| Active | Yes, once | SSOT marker + content tests |
| Deprecated | Pointer line only | Assert deprecated marker absent full text |
| Removed | No | grep guard |

---

## Deprecation Process

1. Log in `docs/development/prompt-contracts/DEPRECATION-REGISTER.md`  
2. State superseded-by marker  
3. Set removal sprint target  
4. Replace duplicate emitters with pointer or silence  
5. Remove deprecated text after one sprint soak  

---

## Supersession Process

**Required for any new prompt block:**

1. **Supersedes:** list of markers/blocks replaced  
2. **Changelog:** what merged, what deleted  
3. **Net char delta:** must be ≤0 unless exception approved  
4. **Conflict check:** no overlapping numeric ranges  

**Forbidden:** `applyNewContractToDraft` without corresponding deprecation PR.

---

## Prompt Rationalisation Reviews

| Trigger | Review |
|---------|--------|
| Emitted prompt +10% chars for step | Mandatory rationalisation review |
| New `apply*ToDraft` function | Architecture review |
| Sprint closure | Char count vs baseline |
| External quality failure despite “rules present” | Accretion audit |

---

## Prompt Size Monitoring

| Step | Baseline (Sprint 55) | Budget (Sprint 56+) |
|------|---------------------|---------------------|
| DLA emitted core | 49,949 | ≤32,000 (hard); ≤27,000 (stretch) |
| DLA augmentation | 36,748 | ≤18,000 |
| GAM emitted core | TBD audit | Set post GAM-01 |
| Design Page emitted core | TBD audit | Set post DP-01 |

**CI recommendation:** Node test loads RNA HCV brief, measures `resolveStepPromptText` length, fails on budget exceedance.

---

## Duplicate Rule Detection

Automated checks (recommended):

- Regex for repeated word-range lines (e.g. `35–80 words` count ≤1 per field per prompt)  
- Marker count: each `*-CONTRACT (auto-applied)` once per concern  
- Exemplar fingerprint: `reasoning_orientation — Weak` count ≤1  

---

## Conflict Detection

- Numeric range parser: same field_id with two distinct min/max → fail  
- Brevity tokens near scaffold fields: `concise`, `one sentence`, `brief` flagged for review  
- `reduce scaffolding` in DLA prompt flagged if scaffold SSOT present  

---

## Prompt Audit Checkpoints

| Checkpoint | When |
|------------|------|
| **Emit audit** | Before merge — char count + marker inventory |
| **Copy path audit** | DLA/GAM/Design Page — full `buildWorkflowStepInstructions` |
| **Brief matrix spot-check** | Self-directed + facilitated × learner-page |
| **Sprint baseline** | Record in `SPRINT-NN-BASELINE-METRICS.md` |

---

## Definition of Done Additions

For any PR touching `apply*ToDraft`, `build*PromptBlock`, or domain-pack prompt templates:

- [ ] SSOT ownership identified  
- [ ] No duplicate word-range lines for scaffold fields  
- [ ] Net prompt char delta documented  
- [ ] Supersedes / deprecates section filled  
- [ ] Tests assert SSOT marker once  
- [ ] Emitted prompt size within budget OR exception logged  

---

## Recommended Engineering Workflow

1. **Design in lib** — prompt text lives in `lib/*.js`, not scattered `app.js` strings  
2. **One emitter per SSOT** — single `applyLdGuidedLearningScaffoldContractToDraft`  
3. **Pointer blocks** — OUTPUT CONTRACT becomes index, not duplicate prose  
4. **Rationalise before extend** — edit SSOT in place; don’t add parallel module  
5. **Measure in PR** — paste before/after char counts in description  

---

## Review Checklist (PR template snippet)

```markdown
## Prompt governance
- [ ] Identifies SSOT module for each new/changed rule
- [ ] Lists superseded blocks (or N/A)
- [ ] Emitted DLA prompt chars: before ___ / after ___
- [ ] No new conflicting word ranges
- [ ] No second exemplar set for same field
- [ ] Deprecation register updated if applicable
```

---

## Architectural Principles

1. **Simplify, don’t accrete** — consolidation is the default response to new requirements.  
2. **One authority per concern** — ranges, gates, and exemplars have exactly one owner.  
3. **Quality gates beat presence gates** — non-empty is never sufficient for scaffold fields.  
4. **Exemplars must comply** — training examples meet the same numeric floors.  
5. **Size is a signal** — growth without supersession is technical debt.  
6. **Evaluation path = fix path** — optimise the path users actually run (Copy for DLA).  
7. **Orthogonal concerns stay separate** — table/math/obligation ≠ scaffold prose.  

---

## Traceability

Implements Sprint 56 charter guiding principle and Phase 5 of [SPRINT-56-DLA-RATIONALISATION-PROGRAMME.md](SPRINT-56-DLA-RATIONALISATION-PROGRAMME.md).
