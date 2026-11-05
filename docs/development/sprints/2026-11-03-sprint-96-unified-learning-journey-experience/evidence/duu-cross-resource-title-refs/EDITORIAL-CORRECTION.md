# DUU — Learner-facing cross-resource identifier leaks

**Date:** 2026-11-05  
**Status:** **Investigation complete — stored-source correction pending author action**  
**Sprint:** 96 (post-closure content defect; runtime/shell closure unchanged)  
**Export inspected:** `.tmp-artefact-inspect-14/` (unified `index.html` + `standalone-pkg/c1…c6/`)

This is an **editorial content** issue in stored generated resources. It is **not** a unified-shell packaging defect.

---

## 1. Root cause and responsible layer

| Question | Finding |
| -------- | ------- |
| Where do the C3 `c4` strings live? | Inside **stored generated Interactive HTML** for commission **c3** (learner-facing headings, guidance, success criteria). Present in both standalone package and unified mount of the same fragment. |
| Publishing layer? | **No** — identifiers are already in the constituent package HTML before unified assembly. |
| Commissioning / generation? | **Likely contributory.** Learning Journey Design Page metadata uses `commission_id` values (`c1`…`c6`) in `dependencies` and examples; continuity handoff (`journey_context_text`) is meant to use meaningful activity descriptions, but generators still echo bare `cN` into learner prose. Assessment Pack / Interactive commissioning already forbids save/copy/transfer mechanics, but does **not** yet forbid internal commission identifiers in learner-facing prose. |
| Repo-editable source? | **No.** Live DUU lives in the author’s browser / owner store (same constraint as [M3-CANDIDATE-CONTENT.md](../../M3-CANDIDATE-CONTENT.md)). Temporary export folders are inspection copies only. |

**Responsible layer for correction:** stored constituent content (author Design Page / Adjustments / targeted regenerate of affected constituents) — **not** `learning-journey-unified-shell.js`.

---

## 2. Verified published titles (journey metadata)

From unified shell TOC / `data-lj-resource-title` (authoritative for cross-resource learner references):

| Id | Journey published title |
| -- | ----------------------- |
| c1 | Recognising Evidence, Interpretation and Uncertainty |
| c2 | Evaluating and Weighing Evidence |
| c3 | From Evidence to Justified Action |
| c4 | Reconsidering a Provisional Decision |
| c5 | Independent Evidence-Informed Judgement |
| c6 | Evaluating the Quality of Independent Judgement |

**Note:** Some standalone package `<h1>` titles differ (e.g. c3 H1 “Choosing and Justifying a Library Policy”, c4 H1 “When New Evidence Changes the Picture”). Per author decision, cross-resource references must use the **journey published title** above — not invent titles, and not use positional “next/previous”.

---

## 3. Confirmed learner-facing occurrences

Legitimate technical ids in attributes (`id=`, `name=`, `data-learner-cell=`, artefact contracts, nav `data-lj-nav-id`) are **out of scope**.

### C1 / C2

No learner-facing `cN` prose found in the inspected export.

### C3 — *From Evidence to Justified Action* (author-confirmed theme)

Author-quoted wording was not byte-identical in this export; the following **confirmed** leaks are the same defect class:

| # | Current (excerpt) | Proposed rewrite |
| - | ----------------- | ---------------- |
| C3-1 | Heading: **Save Your Original Decision for c4** | **Save your original decision for later reconsideration** |
| C3-2 | Keep an accessible copy of your original work so that you can return to it in **c4**. | Keep an accessible copy of your original work so you can return to it in *Reconsidering a Provisional Decision*, where you'll consider whether new evidence changes your recommendation. |
| C3-3 | In c4, you will be asked to revisit your own original action, reasons, assumptions and confidence. Preserve the original record rather than rewriting it retrospectively; this will allow you to examine how your reasoning develops. | In *Reconsidering a Provisional Decision*, you will be asked to revisit your own original action, reasons, assumptions and confidence. Preserve the original record rather than rewriting it retrospectively, so you can examine how your reasoning develops. |
| C3-4 | Retain an accessible copy of your original selected action and complete justification, including its assumptions and confidence, for c4. | Retain an accessible copy of your original selected action and complete justification, including its assumptions and confidence, so you can use them in *Reconsidering a Provisional Decision*. |
| C3-5 | …for later reconsideration in c4. (success / transfer briefing criterion) | …for later reconsideration in *Reconsidering a Provisional Decision*. |
| C3-6 | …so that you can reconsider it meaningfully in c4. (appears twice in guidance) | …so that you can reconsider it meaningfully in *Reconsidering a Provisional Decision*. |
| C3-7 | If you completed the earlier evidence-evaluation activity (c2), revisit your own judgements… | If you completed *Evaluating and Weighing Evidence*, revisit your own judgements… |

### C4 — *Reconsidering a Provisional Decision* (many leaks)

Representative set (all `c2`/`c3`/`c5` in learner prose should be replaced similarly):

| Current pattern | Replace with |
| --------------- | ------------ |
| recorded in c3 / from c3 / retained c3 / activity (c3) / Original c3 recommendation | *From Evidence to Justified Action* (or “your retained recommendation from *From Evidence to Justified Action*”) |
| work in c2 / evidence considered in c2 | *Evaluating and Weighing Evidence* |
| independent … judgement in c5 | *Independent Evidence-Informed Judgement* |

Rewrite surrounding sentences so titles read naturally; do not leave “in *Title*” bolted onto awkward fragments.

### C5 — *Independent Evidence-Informed Judgement*

| Current pattern | Replace with |
| --------------- | ------------ |
| self-evaluation in c6 / for c6 / In c6, you will… / When you reach c6… | *Evaluating the Quality of Independent Judgement* |

Also remove/neutralize obsolete “will not automatically transfer” delivery mechanics if still present in source (unified runtime already handles this when an artefact contract applies; source cleanup remains desirable).

### C6 — *Evaluating the Quality of Independent Judgement*

| Current pattern | Replace with |
| --------------- | ------------ |
| activity c5 / judgement in c5 / retained c5 / original c5 response | *Independent Evidence-Informed Judgement* |

---

## 4. Smallest safe correction path (author action)

Because the live journey is **not** in the repository:

1. **Backup:** Download Learning Journey (unified) and optional standalone ZIPs for c3–c6.  
2. Open each affected constituent workflow (c3, c4, c5, c6) in PRISM Authoring Preview / Design Page.  
3. Edit learner-facing fields only (exposition, activity titles/guidance, success criteria, attempt instructions, bring-forward / pack-forward prose). Replace every learner-visible `cN` with the journey published title and a short purpose clause.  
4. Do **not** change commission ids, workspace ids, elicitation ids, or artefact contracts (`c5.E1` etc.).  
5. Re-publish / re-download **Download Learning Journey** and confirm unified C3 no longer shows `c4`, and spot-check C4–C6.  
6. Optional: targeted regenerate of a single constituent **only if** editorial fields are not directly editable — still not a whole-journey regenerate.

If Adjustments cannot reach a string (e.g. baked success-criteria blob), regenerate **that constituent only** after snapshot.

---

## 5. Reusable prevention — **implemented (await author review / commit)**

**Convention:** When referring learners to another learning resource, use its **published title** and explain the purpose of the connection. Internal resource identifiers must **never** appear in learner-facing prose.

| Layer | Change |
| ----- | ------ |
| `lib/learning-journey-design-page.js` | `buildCommissionPublishedTitleDirectory(page)` + envelope fields on `commissionToIntakeEnvelope` |
| `lib/first-class-commission-intake.js` | Persist `commission_published_titles` on deliverySeed / createSeed |
| `app.js` | Original brief includes title directory; shared **CROSS-RESOURCE REFERENCES IN LEARNER-FACING PROSE** constraint on brief / honour / bring-forward (Interactive, Assessment Pack, Expository, Situated Task via shared composers) |
| Tests | `tests/s96-learner-facing-resource-title-refs.test.js` |

`dependencies` remain machine metadata (ids allowed). No publication-time HTML rewrite. QA v1.2 unchanged. **Does not rewrite stored DUU.**
---

## 6. Verification status (this chat)

| Check | Result |
| ----- | ------ |
| Confirmed C3 `c4` leaks inventoried | **Yes** (export); author quotes close variants |
| Other DUU learner-facing id leaks inventoried | **Yes** — C3–C6; C1/C2 clean |
| Titles verified from journey metadata | **Yes** (unified TOC / resource titles) |
| Stored source corrected in repo | **No** — not safely editable here |
| Published unified output corrected | **Pending** author edit + republish |
| Functional ids / contracts unchanged | **N/A** (no code/content write performed) |
| Regression tests | Not re-run for content (no production change); existing suites remain applicable after author edit |

---

## 7. S96 posture

Technical Sprint 96 closure (S96-D20) covered runtime/shell/maths/publishing. This defect is **stored educational prose**. Track as post-closure content debt until the author applies the editorial correction and republishes.
