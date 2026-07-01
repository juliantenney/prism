# Sprint 57 — Open Questions

**Status:** Discovery backlog — not blockers for Sprint 57 start  
**Policy:** Investigate with evidence; do not default to prompt architecture changes

---

## Product / learner experience

| ID | Question | Why it matters | Suggested approach |
| -- | -------- | -------------- | ------------------ |
| OQ-01 | What is the minimum viable **journey navigator** for self-directed pages? | Sprint 55 P1; beat structure exists | UX slice on Marx export |
| OQ-02 | Where does **perceived duplication** hurt most — preamble vs materials vs checklist? | LX backlog priority | Side-by-side HTML audit |
| OQ-03 | Do **visual affordances** improve cognition or add clutter on RNA-scale pages? | Sprint 38 metadata vs learner value | Corpus compare generate vs reject rates in exports |
| OQ-04 | Are **tables** the primary readability pain point across corpora? | PR-02 candidate | Render audit inflation + RNA |
| OQ-05 | How should **page_generation_failure** present to authors vs learners? | Honest limitations vs broken UX | Product copy + UI review |

---

## Generation quality (non-architecture)

| ID | Question | Why it matters | Suggested approach |
| -- | -------- | -------------- | ------------------ |
| OQ-06 | Can DLA mandatory scaffold pass reach ≥80% **reliably** without new prompt layers? | Stabilisation pass: 13.3% batch mean | Batch probes + capture repair metrics — not SSOT rewrite |
| OQ-07 | Which cognition fields fail most often — preamble, self_explanation, bridge? | Targeted teaching vs repair | Histogram from `evaluateGuidedLearningScaffoldEvidence` fixtures |
| OQ-08 | Does external model choice dominate scaffold variance more than prompt wording? | Informs product vs prompt investment | Controlled A/B Copy runs |

---

## Architecture (evidence-triggered only)

| ID | Question | Why it matters | Suggested approach |
| -- | -------- | -------------- | ------------------ |
| OQ-09 | Is F-02 wrapper overlap causing **observable** redundant wrapper prose on exports? | Only justification for dedupe | Diff journey vs rhetoric vs EQF on rendered HTML |
| OQ-10 | Does GAM pack size materially affect material quality vs runtime SP blocks? | GAM rationalisation deferred | Compare facilitated vs self-directed runs — quality rubric first |
| OQ-11 | Should Design Page ever receive a **lightweight** PRE-EMIT for membership only? | Zero PRE-EMIT today | Only if closure failures spike — validation data first |

---

## Process / tooling

| ID | Question | Why it matters | Suggested approach |
| -- | -------- | -------------- | ------------------ |
| OQ-12 | What is the standard **fresh export** workflow for Sprint 57 evidence? | Consistent before/after | Document in first slice |
| OQ-13 | Which regression suite is the Sprint 57 **minimum bar**? | Avoid over-testing prompts | Define in charter slice 1 |
| OQ-14 | Should baseline metrics probe run in CI? | Drift detection | Optional — monitor only per charter |

---

## Closed questions (do not reopen without new evidence)

| Question | Resolution |
| -------- | ---------- |
| Who owns scaffold generation? | **DLA** — ADR-01 |
| Should Design Page generate scaffolds? | **No** — ADR-02 |
| Who owns GAM depth? | **GAM-PRES** — ADR-03 |
| Is PEL on Design Page? | **No** — ADR-05 |
| Is architecture programme ongoing? | **No** — ADR-10 |
| Are orchestration boundaries clean? | **Yes — GREEN** |

---

## Escalation criteria

Promote an open question to **implementation** when:

1. Reproducible on ≥2 fresh exports or fixtures  
2. Learner-visible defect — not prompt-char aesthetic  
3. Fix is scoped to product layer OR single authority with supersession plan  
4. Regression test or visual evidence attached

Promote to **architecture exception** only when:

1. Wrong-stage authority confirmed with learner impact  
2. Cross-prompt matrix would change status to Medium+ severity
