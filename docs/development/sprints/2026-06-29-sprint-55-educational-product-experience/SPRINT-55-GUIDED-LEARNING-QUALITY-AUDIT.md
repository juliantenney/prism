# Sprint 55 — Guided Learning Quality Pass

**Goal:** Existing learner-facing scaffold fields read as educational prose, not metadata labels. No new fields, structures, or hierarchy.

---

## 1. Audit — where terse scaffold text is generated

| Field | Primary generation step | Root cause of terseness |
|-------|-------------------------|-------------------------|
| `activity_preamble` | Design Learning Activities | Old contract allowed 1–3 sentences; procedural openers; topic-label stubs |
| `reasoning_orientation` | DLA (`LD-COGNITION-ORIENTATION`) | “WHAT KIND OF THINKING” without word floor; weak exemplars |
| `conceptual_contrast_prompt` | DLA | “name concepts + merge error” without comparison criteria prose |
| `argument_structure_hint` | DLA | Arrow-chain scaffolds accepted without unpacking |
| `self_explanation_prompt` | DLA | Single-token prompts (“Explain your answer”) permitted |
| `expected_output` | DLA | Treated as deliverable label, not quality target |
| `support_note` | DLA | “1–2 sentences” without depth guidance |
| `intellectual_coherence_bridge` | DLA | “one sentence” bridge rule |
| `**Bridge:**` in worked examples | GAM (`INSTRUCTIONAL-PATTERN-SP-06`) | Single-sentence bridge allowed |
| `transition_to_next` | Construct Learning Sequence → assimilated in Design Page wrappers | Scheduling voice; no word target |
| GAM `sample_output` / `worked_example` | Design Page compose | Paraphrase at ~99% length escaped L4 merge |

**Renderer:** Instructional grammar already renders Orient / Think / Check when fields are present. The weak layer is **generation and compose thinning**, not missing render slots.

---

## 2. Code changes

### New module
- **`lib/ld-guided-learning-scaffold.js`** — word-count targets, terse-label detection, RNA exemplar contrasts, compose anti-thinning rules, `evaluateGuidedLearningScaffoldEvidence()`.

### Contract updates
- **`app.js`** — DLA OUTPUT CONTRACT word targets (50–120 preamble; 35–80 cognition; 30–70 expected_output; 30–60 bridge).
- **`lib/ld-cognition-orientation.js`** — RNA-style strong/weak exemplars; prose depth lines.
- **`lib/ld-activity-preamble-exposition.js`** — forbid Begin by / Develop understanding / Analyse how openers.
- **`lib/ld-self-directed-rhetoric.js`** — expected_output as quality target.
- **`lib/ld-journey-assimilation.js`** — transition_to_next 30–60 word continuity prose.
- **`lib/ld-design-page-compose-contract.js`** — anti label-ify scaffold fields on compose.
- **`lib/instructional-pattern-prompt.js`** — SP-06 bridge 35–70 words with coaching exemplar.

### Wiring
- **`applyLdGuidedLearningScaffoldContractToDraft`** on DLA + Design Page (learner-page briefs).
- **`page-gam-materials-preserve.js`** — merge when `worked_example` / `sample_output` / `text` bodies are not equivalent to GAM (blocks paraphrase GAM-lite).

### Preservation (from prior slice, retained)
- Upstream-wins compression repair for scaffold fields via `page-activity-field-preserve.js`.

---

## 3. RNA/HCV before → after (contract targets)

### reasoning_orientation
**Before (A1 live artefact):**  
`Compare and contrast key mechanistic features of two virus genome types to clarify functional differences.`

**After (contract exemplar):**  
`As you analyse each stage, ask two questions: what is the virus doing, and what problem does this solve? Avoid simply listing lifecycle events. Strong answers connect each mechanism to a functional consequence such as entry, replication, persistence, or spread.`

### conceptual_contrast_prompt
**Before:**  
`Focus on contrasting genome polarity and its impact on translation and replication, avoiding confusion between genome type and virus family.`

**After:**  
`When comparing genome types, focus on whether the genome can be translated immediately and whether a transcription step is needed first. The key distinction is not just polarity, but how polarity changes the route from genome entry to protein production.`

### expected_output
**Before:**  
`A completed comparison table accurately showing distinctions in genome type, translation process, replication enzyme requirements, and examples of each virus type.`

**After:**  
`Your completed table should explain what happens at each lifecycle stage and why it matters. Strong entries should include specific mechanisms, a clear functional purpose, and a short reasoning statement that links the mechanism to viral survival, replication, or persistence.`

### worked_example Bridge
**Before:**  
`Apply this reasoning to all stages.`

**After:**  
`Use the same reasoning pattern for the remaining stages: identify the mechanism, ask what biological problem it solves, then explain the functional consequence. Do not simply describe the next step in the lifecycle; show how that step contributes to infection, replication, or persistence.`

---

## 4. Tests

```bash
node --test tests/sprint-55-guided-learning-quality.test.js
node --test tests/sprint-55-content-preservation.test.js
node --test tests/workflow-learner-page-design-page-preservation.test.js
```

| Test | Acceptance criterion |
|------|---------------------|
| Terse RNA labels detected | A |
| RNA live DLA fails quality eval | B–D (documents current gap) |
| Rich exemplar passes | B–E |
| GAM paraphrase triggers merge | G |
| Scaffold compression repaired from upstream | A, G |
| Marx A1 expected_output in export | H (renderer) |

---

## 5. Acceptance criteria status

| Criterion | Status |
|-----------|--------|
| A. No terse labels when upstream is expandable | **Repair + compose contracts** |
| B. Preamble 50–120 words in fresh runs | **Generation contract** (requires re-run DLA) |
| C. Cognition fields as guidance | **LD-GUIDED-LEARNING-SCAFFOLD** |
| D. expected_output as quality target | **OUTPUT CONTRACT + rhetoric** |
| E. Bridge coaches transfer | **SP-06** |
| F. Sequence transitions as continuity | **Journey assimilation** |
| G. GAM not compressed | **Stricter merge for worked_example/sample_output** |
| H. Minimal renderer changes | **No new render structure** |

**Note:** Fresh workflow runs must regenerate DLA/GAM to replace existing terse strings in captures. Compose/repair will preserve upstream prose once generated.
