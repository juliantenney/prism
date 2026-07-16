# Sprint 62 — Minimum Learner-Journey Presentation Slice

**Status:** Implemented (renderer-only)  
**Updated:** 2026-07-16  
**Primary acceptance:** RNA Activity A2  
**Boundary case:** RNA Activity A6  

---

## 1. Sprint boundary

Sprint 62 may **reorganise, relabel, and deduplicate existing meaning**, but it **does not invent new instructional meaning**.

This slice is presentation-only. It must not:

- modify DLA or GAM;
- change SSOT schemas;
- introduce new authored fields;
- generate goals, rationales, success criteria, closure copy, or contextual labels from body content.

---

## 2. Learner journey direction (presentation, not schema)

Target presentation direction:

**Frame → Understand → [Model] → Apply → Verify → Complete**  
(optional **Transfer**)

This is a **renderer presentation direction**, not a new activity schema or planning contract. Beat order and material assignment remain as authored/assembled.

---

## 3. Implementation map (renderer locations)

| Concern | Location | Slice change |
| ------- | -------- | ------------ |
| Activity opening / `learner_task` | `app.js` — `buildLearnerJourneyFrameHtml`, instructional grammar + legacy activity cards | Goal-shaped tasks → “Your goal”; inventory tasks keep “What to do” |
| Beat heading labels | `lib/beat-material-registry.js` — `learnerFacingEpisodeFunctionLabel`; `app.js` — `learnerFacingBeatLabel` | Structural labels → learner-facing phase labels |
| `expected_output` | `buildLearnerJourneyFrameHtml` + trailing Check/Output render | Promote into “Success looks like”; suppress deterministic trailing Output duplicate |
| Checklist | Frame promotion + Verify beat materials | Criteria may appear in Frame; checklist material remains in Verify |
| Activity closure | Trailing Output → optional “Done” when success already framed | Only reuses existing `expected_output` wording |
| Material headings | `isFixtureTestMaterialTitle`, `learnerTitleFromMaterialValue`, `renderMaterialValue` | Suppress only explicit RNA fixture title pattern |

**Unchanged by this slice:** material resolution, material ordering, beat assignment, diagnostics (`validatePageBeatMaterialClosure`), source data, upstream pipeline outputs.

---

## 4. Renderer may / must not

### May

- map structural beat functions to learner-facing phase labels;
- reposition existing success information into an opening Frame;
- suppress deterministic duplicates (Output vs promoted success);
- simplify visible hierarchy (labels/wrappers only).

### Must not

- invent goals;
- invent success criteria;
- infer pedagogical rationale;
- generate contextual headings from body text;
- rewrite instructional meaning.

---

## 5. Renderer rules introduced

### 5.1 Learner-facing beat labels

Fixed mapping via `LEARNER_FACING_EPISODE_FUNCTION_LABELS`:

| Functions | Label |
| --------- | ----- |
| explanation / observation / criteria_exposition | Understand |
| worked_thinking / worked_judgement / example / non_example | See it modelled |
| guided_practice / guided_reasoning / guided_inquiry / independent_performance (+ revision, guided_judgement) | Your turn |
| verification / evaluative_judgement | Check your work |
| transfer / reflection | Apply elsewhere |

**Fallback:** unknown functions use existing structural `episodeFunctionLabel` (no invented phase name). Planning/diagnostics continue to use structural labels.

### 5.2 Goal-shaped `learner_task` eligibility (conservative)

`isGoalShapedLearnerTask` requires all of:

1. exactly one sentence;
2. not a 3+-item comma list;
3. not a multi-noun inventory (2+ inventory nouns joined by “and” without using/with/from);
4. starts with an action verb from a fixed allow-list (Complete, Analyse, Compare, …).

Safe example (A2): “Complete the analysis table comparing direct-acting antivirals.”  
Unsafe (A1/A6): inventory-style study/complete lists — retain “What to do”, unchanged text.

**Lower-risk choice:** when not goal-shaped, **retain** existing “What to do” content rather than suppress or rewrite.

### 5.3 Success promotion and Output deduplication

Precedence in `buildLearnerJourneyFrameHtml`:

1. Checklist criteria lines (original wording) → “Success looks like”.
2. `expected_output` added only if not already covered by checklist wording and not a **tight** checklist-restatement (`/^(?:.+?\s+)?verified (?:with|against)(?: the)? checklist\.?$/i`).
3. Trailing Output/Check duplicate suppressed when success was promoted from checklist/output, or when output equals the goal-shaped task.
4. Checklist material remains rendered in the Verify beat.
5. Checklist meta-lines (e.g. “Use this checklist…”, “If any check is not met”) are not promoted into Success looks like.
6. When equivalence confidence is low, content is preserved (not removed).
7. Substantive deliverables that merely mention a checklist (e.g. “revised using the checklist”) are promoted, not dropped.

### 5.4 Minimal completion cue

If trailing Output is not suppressed and success was already promoted, the trailing heading may be labelled **Done** wrapping the **unchanged** `expected_output` text. No “You can now…” capability statements; no next-activity transitions; no body-derived closure.

### 5.5 Fixture material-title suppression

Only titles matching:

`/^S\d{2}\s+RNA\s+[A-Z]\d+-M\d+\b/i`

(e.g. `S62 RNA A2-M1 Replication Overview`) are suppressed.  
Other titles (including `S62 Fallback Experimental Card`) remain visible. No subjective title-quality heuristics.

---

## 6. Known upstream gaps (deferred — not solved here)

Future DLA / GAM / authoring-contract candidates:

- explicit activity goal;
- explicit success criteria;
- why-this-matters framing;
- completion/transition copy;
- authored contextual phase labels.

### A6 limitation

Inventory-style `learner_task` cannot safely provide an activity goal without upstream authoring support. This slice therefore keeps “What to do” and does not invent an evaluative goal. Transfer remains in authored beat order (before Verify) unless a later presentation-only rule is explicitly agreed.

---

## 7. Acceptance evidence

### A2 (primary)

Hierarchy:

1. Activity title + duration/grouping  
2. Your goal (existing `learner_task` unchanged)  
3. Success looks like (checklist / output wording unchanged)  
4. Understand → See it modelled → Your turn → Check your work  
5. No duplicate trailing Output  
6. All four materials present; bodies and order unchanged  

### A6 (boundary)

- Learner-facing beat labels apply  
- No invented goal  
- Inventory `learner_task` retained under “What to do”  
- All practice artefacts present and ordered  
- Transfer order unchanged in this slice  
- Output/checklist deduplication conservative  
- No Apply-cluster meaning invented  

### Tests

`tests/utility-renderer-learner-journey-presentation.test.js` plus updated beat-label assertions in beat-first / typography tests.
