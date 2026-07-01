# Sprint 56 — DLA Rationalisation Programme

**Status:** Planning only — no implementation in this document  
**Traceability:** [SPRINT-55-DLA-PROMPT-RATIONALISATION-AUDIT.md](../2026-06-29-sprint-55-educational-product-experience/SPRINT-55-DLA-PROMPT-RATIONALISATION-AUDIT.md) · [SPRINT-56-BASELINE-METRICS.md](SPRINT-56-BASELINE-METRICS.md)

---

## Current Architecture

```
Domain pack promptTemplate (~13k)
  ↓ buildSeededStepPromptForWorkflowStep / resolveStepPromptText
applyWorkflowStepRuntimePromptAugmentations
  ├─ applyPedagogicCognitionContractScaffoldToDraft (conditional)
  ├─ applyEducationalQualityFrameworkPromptBlockToDraft
  ├─ applyInstructionalPatternPromptBlockToDraft (GAM only)
  ├─ applySelfDirectedLearnerPageStepScaffoldsToDraft  ← 82% of augmentation
  │    ├─ material shape + timeline blocks
  │    ├─ activity framing + OUTPUT CONTRACT + JSON example
  │    ├─ augmentSelfDirectedDlaDraftOutputSection (schema reinforce)
  │    ├─ LD-ACTIVITY-PREAMBLE-EXPOSITION
  │    ├─ LD-COGNITION-ORIENTATION
  │    ├─ LD-GUIDED-LEARNING-SCAFFOLD (+ PRE-EMIT)
  │    └─ (rhetoric via separate call in same parent)
  ├─ applyLdTableFidelityContractToDraft
  ├─ applyPedagogicEnrichmentContractScaffoldToDraft (PEL)
  ├─ applyMathSafeOutputContractToDraft
  └─ applyEpisodePlanDlaPopulationPromptBlockToDraft (conditional)
```

Copy path: `buildWorkflowStepInstructions` wraps augmented core with runner/footer (~1.1k).

---

## Prompt Composition Breakdown (baseline)

| Segment | Chars | % of emitted |
|---------|------:|-------------:|
| Base domain-pack | 13,201 | 26% |
| Self-directed scaffolds step | 30,164 | 60% |
| Table fidelity | 1,967 | 4% |
| EQF | 1,751 | 4% |
| PEL orientation + reasoning | 1,646 | 3% |
| Math render | 1,220 | 2% |
| Other / in-place edits | ~hundreds | <1% |

---

## Augmentation Inventory

See rationalisation audit table. **Applied for RNA HCV DLA:** 6 runtime steps, 14 distinct text blocks (including sub-blocks).

---

## Duplication Sources

| Source A | Source B | Duplicated content |
|----------|----------|-------------------|
| Base `activities[]` line | OUTPUT CONTRACT | preamble + cognition REQUIRED |
| Activity framing | OUTPUT CONTRACT | 50–120 preamble, field list |
| OUTPUT CONTRACT | LD-ACTIVITY-PREAMBLE | preamble purpose, forbidden openers |
| OUTPUT CONTRACT | LD-COGNITION | 35–80 fields, mandatory set |
| OUTPUT CONTRACT | LD-GUIDED | ranges, PRE-EMIT, exemplars |
| LD-COGNITION | LD-GUIDED | weak/strong RNA exemplars |
| LD-ACTIVITY-PREAMBLE | LD-GUIDED | preamble rules |
| PEL orientation | OUTPUT CONTRACT + rhetoric | “follow OUTPUT CONTRACT” |
| EQF | Activity framing | developmental purpose, avoid shells |

**Estimated recoverable:** ~19,000 chars.

---

## Conflicting Contracts

| Conflict | Parties | Resolution direction |
|----------|---------|-------------------|
| Scaffold depth vs journey compression | EQF vs PRE-EMIT | Scope EQF to non-scaffold; remove “reduce scaffolding” for DLA or qualify |
| Evidence label vs quality prose | AS-05 vs expected_output 30–70 | AS-05 scoped to materials obligations; scaffold expected_output under SSOT |
| Concise learner_task vs scaffold prose | LD-GUIDED scope line | Explicit: “scaffold fields may not stay concise” |
| One cue vs rich cognition | PEL reasoning | Align with SSOT word floors |
| Return only JSON vs rich strings | Base output vs SSOT | Keep JSON format rule; SSOT states scaffold strings are not minimised |

---

## Conflicting Word Ranges

Consolidated SSOT must publish **one** range per field:

| Field | Authoritative range (proposed) |
|-------|-------------------------------|
| activity_preamble | 50–120 words |
| reasoning_orientation | 35–80 words |
| self_explanation_prompt | 35–80 words |
| conceptual_contrast_prompt | 35–80 words |
| argument_structure_hint | 35–80 words |
| transfer_or_application_task | 35–80 words |
| expected_output | 30–70 words |
| intellectual_coherence_bridge | 30–60 words |
| support_note | 20–70 words |

Remove 25–80 and duplicate 30–70 transfer rule from OUTPUT CONTRACT.

---

## Presence-Only Gates

| Gate | Action |
|------|--------|
| LD-COGNITION PRE-EMIT | **Deprecate** — merge into SSOT PRE-EMIT |
| Activity framing archetype (presence only) | **Fold** — reference SSOT ranges |
| Schema line reinforcement | **Keep** field names only; point to SSOT for quality |
| IFP-05 preamble leg | **Clarify** — non-empty insufficient; word minimum in SSOT |
| PEL one cue set | **Remove or align** with word floors |

Unified PRE-EMIT (proposed):

1. Every scaffold field meets word minimum.  
2. No terse patterns (FORBIDDEN list).  
3. Self-check: count words before emit.  
4. No separate presence-only checklist above this gate.

---

## Contradictory Exemplars

| Exemplar | Issue | Action |
|----------|-------|--------|
| LD-COGNITION Strong self_explanation (~17w) | Below 35–80 | Replace or remove; single set in SSOT |
| uncertainty_tension “one sentence” | Brevity adjacent to 35–80 | Keep field optional; document outside scaffold SSOT |
| JSON example (Marx) | Compliant | **Retain** as sole positive exemplar |

---

## Instruction Competition Sources

| Source | Competition mechanism |
|--------|----------------------|
| Obligation population task framing | Attention on `required_materials` |
| IFP / DLA-WB gates | Hundreds of mandatory rows before scaffold PRE-EMIT |
| Return only the JSON | Token minimisation bias |
| 2–4 sentences without word floor | Short preamble compliance |
| Late PRE-EMIT position (~90% into prompt) | Recency insufficient vs mass of prior text |
| Three weak exemplar sets | Model mimics weak pattern shape |

**Rationalisation response:** Move SSOT scaffold block **earlier** in augmentation order (after base, before obligation detail) OR trim obligation prompt in separate initiative; minimum: consolidate + dedupe + align.

---

## Candidate Deletions

| Candidate | Est. savings | Risk |
|-----------|-------------:|------|
| Standalone LD-ACTIVITY-PREAMBLE block (merged) | ~2,945 | Low if merged |
| Standalone LD-COGNITION block (merged) | ~3,172 | Low if merged |
| Activity framing block (merged) | ~2,822 | Low |
| Duplicate OUTPUT CONTRACT prose (retain thin pointer) | ~3,500 | Medium — keep field list once |
| LD-SELF-DIRECTED-RHETORIC DLA rider (facilitator ban → 3 lines in SSOT) | ~3,500 | Medium |
| EQF on DLA (or DLA-specific trim) | ~1,751 | Medium — verify brief matrix |
| PEL orientation + reasoning pointers | ~1,646 | Low if SSOT is authoritative |
| Duplicate weak/strong exemplar sets (×2) | ~2,000 | Low |

---

## Candidate Consolidations

**Proposed SSOT:** `LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT` (extended)

Single block containing:

- Module marker + scope  
- Field word ranges (aligned)  
- FORBIDDEN terse patterns  
- One weak/strong exemplar set (RNA-relevant)  
- One compliant JSON example (or pointer to example embedded once)  
- DLA PRE-EMIT gate (presence + word count)  
- Explicit learner_task vs scaffold brevity rule  

**Retain separate (orthogonal concerns):**

- LD-TABLE-FIDELITY (DLA spec role)  
- LD-MATH-RENDER  
- Material shape + timeline (spec authoring)  
- Episode plan population block (when upstream present)  

---

## Candidate Authoritative Contracts

| Concern | SSOT owner (proposed) |
|---------|----------------------|
| Scaffold prose quality | `lib/ld-guided-learning-scaffold.js` |
| Scaffold prompt emission | `applyLdGuidedLearningScaffoldContractToDraft` only |
| Field semantics (learner-page) | Thin OUTPUT CONTRACT index → “see SSOT” |
| Table spec shape | `lib/ld-table-fidelity.js` |
| Math notation | `lib/ld-math-render.js` |
| Obligation population | Domain pack (base template) |

**Deprecate as standalone DLA emitters:** duplicate preamble/cognition blocks, redundant activity framing prose, rhetoric DLA rider overlap.

---

## Phased Plan

### Phase 1 — Mapping (Sprint 56 week 1)

- Confirm baseline metrics on CI script (char count test)  
- Map every `apply*ToDraft` for DLA across brief matrix  
- Document brief × augmentation matrix  
- **Deliverable:** DLA augmentation map (no code change required for map)

### Phase 2 — Consolidation Design (week 1–2)

- Author SSOT spec (single markdown + lib prompt builder)  
- Deprecation register for superseded blocks  
- Word-range alignment table  
- Unified PRE-EMIT specification  
- **Deliverable:** SSOT design doc + deprecation list

### Phase 3 — Removal of Superseded Layers (week 2–3)

- Implement SSOT-only emission path  
- Remove or gate deprecated `build*PromptBlock` appends  
- Thin OUTPUT CONTRACT to index + non-scaffold fields  
- Re-order augmentation if approved  
- **Deliverable:** PR(s) with char reduction

### Phase 4 — Validation (week 3–4)

- Automated: emitted prompt char count, conflict regex tests, single-marker tests  
- Manual: Copy → external model spot-check (RNA/HCV)  
- Regression: sprint-55 tests updated for SSOT  
- **Deliverable:** Before/after metrics doc

### Phase 5 — Governance Safeguards (week 4)

- Prompt size budget in CI  
- PR checklist enforced  
- Deprecation process live  
- **Deliverable:** [SPRINT-56-PROMPT-GOVERNANCE.md](SPRINT-56-PROMPT-GOVERNANCE.md) adopted

---

## Traceability matrix

| Audit finding | Programme phase |
|---------------|-----------------|
| 30,164 chars scaffolds step | Phase 3 consolidation |
| ~19k duplicate | Phase 2 design, Phase 3 removal |
| 7 conflict classes | Phase 2 alignment |
| 7 presence gates | Phase 2 unified PRE-EMIT |
| Short Strong exemplar | Phase 3 exemplar cull |
| 13k→50k size | Phase 4 validation |
