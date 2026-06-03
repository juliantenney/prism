# Sprint 37 — observations

Store **session-level rhetorical review notes** here: orientation, stakes, progression, synthesis, transfer, and verbosity risk.

Prefer short markdown with fixture IDs, prompt/domain paths touched, and date. Do not commit large HTML dumps unless needed for diff review; reference test render paths or manual anchor filenames instead.

---

## Rhetorical review template (copy per slice)

```markdown
# Slice 37-X — [title]

**Date:** YYYY-MM-DD  
**Reviewer lens:** learning designer | academic author | self-study learner | assessment designer | session reviewer  
**Anchors:** [fixture paths, RNAOLD.html, climate change.html, etc.]  
**Change type:** observation only | prompt/domain | test fixture (if stable)

## Render / review method
- Fixture: `tests/fixtures/page-render/….json` (if applicable)
- Manual HTML: [filename]
- API: `buildUtilityStructuredHtmlForTest` (see `tests/utility-page-render.test.js`)
- Fields reviewed: section `content`, `study_orientation`, `study_tips`, activity bridges, etc.

## Current opening / closure
- Opening: …
- Closure / study_tips: …

## Intellectual stakes
- What the session claims matters: …
- Gap vs coverage-only summary: …

## Conceptual tension
- Why-this-is-hard signalled: yes / partial / no
- Notes: …

## Progression signalling
- Cross-activity arc visible: …
- Bridges (`intellectual_coherence_bridge`, etc.): …

## Synthesis strength
- What should be clearer by the end: …
- Epistemic closure quality: Pass / Partial / Fail

## Transfer quality
- Application / durable understanding: …

## Verbosity risk
- Fluff, generic reflection, facilitator leakage: …

## Before / after judgement
- Before (anchor): …
- After (if guidance landed): …
- Keep / reject patterns: …

## Proposed changes (prompt/domain only unless justified)
1. …

## Rejected scope creep
- …

## Regression
- `node --test tests/*.test.js` → pass / fail count
```

---

## Rubric categories (session level)

Score **Pass / Partial / Fail** unless noted.

### Opening / orientation

- Topic and intellectual plan explicit in first screenful (not only section headings).
- Stakes and why-reasoning-matters present without motivational hype.
- Learner knows what they will **do intellectually**, not only what topics appear.

### Conceptual tension

- Difficulty and misconception pressure named honestly.
- No faux drama; discipline-appropriate precision.

### Progression signalling

- Activities read as a sequence (build → challenge → integrate → judge).
- Bridges between activities visible in copy, not only in titles.

### Synthesis / closure

- Ending states what should now be **clearer** (epistemic), not only what was **completed** (procedural).
- `study_tips` and debrief support durable understanding.

### Transfer

- Application or comparison review where anchor discipline expects it.
- Transfer cues tied to session arc, not bolt-on “real world” paragraphs.

### Verbosity / tone

- Concise, academic, self-study appropriate.
- No generic “reflect on your learning” filler.

---

## File naming

- `37-1-session-orientation-rna-climate.md`
- `37-4-synthesis-closure-ci-marx.md`

---

## Cross-references

| Source | Path |
|--------|------|
| Sprint 35 pedagogical observations | `../2026-06-03-sprint-35-pedagogical-refinement/observations/` |
| Sprint 36 visual observations | `../2026-06-03-sprint-36-session-design-visual-pedagogy/observations/` |
| Sprint 37 fixtures README | `../fixtures/README.md` |
