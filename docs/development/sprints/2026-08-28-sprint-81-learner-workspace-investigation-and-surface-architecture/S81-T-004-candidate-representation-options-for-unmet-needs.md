# S81-T-004 — Candidate representation options for unmet interaction needs

**Sprint:** 81 — Learner Workspace Investigation & Surface Architecture  
**Status:** **COMPLETE — ACCEPTED** (operator 2026-08-28)  
**Follow-on:** [S81-T-005](S81-T-005-sprint-81-recommendation-and-decision-gate.md) — COMPLETE (awaiting operator decision on recommendation B)

---

## 1. Purpose & binding priors

Investigate **representation approaches** (including retain-current) for the **small** set of interaction needs evidenced in T-003 — not a redesign of all six learner actions.

| Prior | Status in this analysis |
| ----- | ----------------------- |
| T-003: **no material current constraint** on basic pedagogical representations | **Preserved** |
| Strengths inventory (moments, native controls, honest drafts, table semantics, non-pointer ordering, live status, authored self-review, no false free-text diagnosis, reflow) | **Constraints** on every candidate |
| Feedback model: learner diagnoses; PRISM supplies authored criteria | **Hard constraint** — no candidate may silently become “Prism reads & judges production” |
| Control actions (study, select, typical order, typical compose): NONE/MINOR headroom | Prefer **retain** unless new evidence |

---

## 2. Problem set (authoritative)

| ID | Need | Priority |
| -- | ---- | -------- |
| **N1 / N4** | Co-access to **learner production + criterion currently applied** during revision/self-review without excessive scroll-away / scroll-back | **Highest** |
| **N2** | Large editable tables: manageable entry/revisit when many cells / width create cost | Medium |
| **N3** | Multi-field compose: continued clarity between prompt/label and field while drafting/revising | Lower |

Do not broaden without evidence.

---

## 3. Control cases (prefer retain)

| Action | T-003 headroom | Options stance |
| ------ | -------------- | -------------- |
| **LA-study** | NONE | **Retain** document/prose representation |
| **LA-select** | NONE | **Retain** fieldset/radio + local correctness |
| **Typical LA-order** | NONE–MINOR | **Retain** button reorder + in-workspace check |
| **Typical LA-compose** (single / few fields, short Check gap) | NONE–MINOR | **Retain** labelled textarea; N1 applies only when revision loop is costly |

These controls prevent the options exercise from becoming a general redesign programme.

---

## 4. Candidates for N1 / N4 (revision co-access)

Concrete UI concepts below are **options**, not recommendations. All keep existing `text_entry` / `table_entry` / checklist / guided-review **as the production and attestation surfaces** unless noted.

### 4.1 Retain baseline

| ID | Approach |
| -- | -------- |
| **R0 — RETAIN CURRENT** | Keep linear Explore → Task → Check. Accept scroll between production and criteria. |

**If PRISM accepts current cost:** Learners with short Do→Check gaps experience little friction (T-003). Learners with long table/prose production must scroll to apply criteria and scroll back to revise. Pedagogy, evidence model, and a11y strengths remain intact. No new contracts. **Legitimate outcome** consistent with “no material constraint.”

---

### 4.2 Option classes (investigate)

| ID | Class | Sketch (option only) |
| -- | ----- | -------------------- |
| **R1** | Navigation / orientation | In-Check “Back to your response” / in-Do “Jump to review criteria” links or landmarks; optional skip links; heading/ARIA landmarks already partly present via moments |
| **R2** | Temporary criterion context | While a criterion is focused (esp. guided panel), show a compact sticky/summary strip of the **current criterion** (statement + look-for) that travels with scroll — production surfaces unchanged |
| **R3** | Temporary production context near criterion | Near each criterion (or active guided panel), offer progressive enhancement: “Show my response” revealing a **read-only mirror** or deep-link focus into the live fields — still learner-judged; mirror must not look like Prism scoring |
| **R4** | Temporary criterion context near production | During an explicit or implied revision pass, show current criterion guidance adjacent to the production workspace (without removing Check moment) |
| **R5** | Review-phase layout | Dual-pane / side-by-side production \| criteria **only in review/revision**, collapsing to linear document as fallback |
| **R6** | Revision-mode entry | Explicit “Revise with criteria” that densifies or reorders visibility (e.g. collapses Learn, keeps Do+Check paired) then restores normal reading order |
| **R7** | Progressive enhancement only | Keyboard shortcuts / “next incomplete criterion” / focus management between production and checklist — no layout change |
| **R8** | Guided-specific PE | Guided panels include optional “My response” disclosure + keep Prev/Next; flat checklists use R1–R3 patterns |

**Out of scope as N1 “solutions” (would violate feedback constraint or T-003 strengths):** automated free-text/table diagnosis; replacing textareas with opaque canvases; drag-only review UIs; implying checklist ticks mean Prism verified quality.

---

### 4.3 Qualitative comparison (N1/N4)

| ID | Need addressed | Learner benefit | Pedagogical fit | Evidence model | Feedback/self-review | A11y | Mobile/reflow | Complexity | New state/contracts | PE / fallback | Risk of unintended pedagogy |
| -- | -------------- | --------------- | --------------- | -------------- | -------------------- | ---- | ------------- | ---------- | ------------------- | ------------- | --------------------------- |
| **R0** | None (accept cost) | Predictable; zero change | Excellent | Unchanged | Unchanged | Best (status quo) | Best | None | None | n/a | None |
| **R1** | Partial (reduces search cost, not true co-view) | Faster relocate | Excellent | Unchanged | Unchanged | Strong if real links/`id`s | Strong | Low | Stable `id`s / landmarks | Degrades to scroll | Low |
| **R2** | Partial–good for criterion half | Keeps criterion visible while scrolling to production | Good | Unchanged | Still attestation | Sticky can harm small screens / focus order if poorly done | Medium risk | Low–med | Criterion-focus state (client) | Hide sticky → linear | Low if clearly “guidance” |
| **R3** | Strong for co-access | Criteria + production visible in Check | Good if mirror labelled as **your draft**, not “score” | Unchanged (read mirror of draft) | Still learner diagnosis | Need accessible disclosure; avoid duplicate unnamed fields | Disclosure stacks vertically on narrow viewports | Med | Client draft read; clear copy that Prism did not assess | Closed disclosure → R0 | **Med** if wording implies auto-check |
| **R4** | Strong | Guidance at point of edit | Good | Unchanged | Same | Focus management between strip and fields | Similar to R2 | Med | “Active criterion” client state | Strip off → R0 | Low–med |
| **R5** | Strongest co-view | Simultaneous | Can flatten Explore/Task story if overused | Unchanged | Same | **Hard**: two-pane keyboard, resize, linearisation order | Weak on small screens without stacked fallback | High | Review-layout mode; CSS/container queries | Must stack to single column | Med — may feel like “app” not lesson |
| **R6** | Good | Less chrome during revise | Fits Check as a phase | Unchanged | Same | Must restore linear order; announce mode | Mode toggle works if stacked | Med–high | Explicit revision mode flag | Mode off → R0 | Med if Learn content becomes hard to re-open |
| **R7** | Partial | Power-user efficiency | Excellent | Unchanged | Same | Excellent if documented | Excellent | Low | Keybindings optional | No JS → R0 | Low |
| **R8** | Good where guided | Matches guided pedagogy | Excellent for guided | Unchanged | Same | Builds on existing guided a11y | Panels already linear | Med | Guided + disclosure state | Flat checklist ≠ R8 | Low if honesty preserved |

---

## 5. Candidates for N2 (table scale)

### 5.1 Cause distinction (do not treat as one failure)

| Possible cause | Implication |
| -------------- | ----------- |
| Too many learner-owned cells | Often **upstream commissioning** / activity design |
| Too many columns / width | Viewport + `.util-table-scroll` horizontal pressure |
| Hard to relocate prior entries | Orientation / navigation within grid |
| Many large textareas | Input sizing / expected response length mismatch |
| Pedagogical over-structuring | Not a renderer “bug”; may be intentional demand |

### 5.2 Options

| ID | Approach |
| -- | -------- |
| **T0 — RETAIN CURRENT** | Keep semantic table + labelled cell textareas + horizontal scroll. Accept high cell counts as pedagogical load when commissioned. |
| **T1 — Upstream activity design** | Prefer fewer blanks, narrower grids, or sequential smaller tables in DLA/GAM commissioning guidance — **not** a new learner surface |
| **T2 — In-table orientation PE** | Sticky header row/column where feasible; “next empty cell”; stronger incomplete-cell indication; keep native `<table>` / textareas |
| **T3 — Input density** | Shorter default rows where cells expect brief tokens; still textareas; no canvas |
| **T4 — Chunked presentation** | Render one logical section/row-group at a time (authoring split or progressive disclosure) while preserving overall table evidence model |
| **T5 — Replace table surface** | e.g. card-per-row, matrix widgets — **only if** T0–T4 fail; high risk to table semantics / a11y / cognitive fit (T-003: table *is* the thinking frame) |

**If PRISM retains T0:** Large tables remain costly but pedagogically coherent; a11y strengths preserved; no new contracts. Legitimate when cell count is intentional.

### 5.3 Qualitative notes (N2)

| ID | Benefit vs cost | Prefer when… |
| -- | --------------- | ------------ |
| **T0** | Zero risk | Scale is occasional / intentional |
| **T1** | Often highest leverage, no UI family | Commissioning produces gratuitous blanks |
| **T2** | Addresses revisit cost without new surface type | Grids needed but navigation is the pain |
| **T3** | Minor presentational | Cells are short judgements |
| **T4** | Helps entry sequencing | Tables are multi-part by design |
| **T5** | High complexity / a11y risk | Only with strong new evidence — **not** supported by T-003 alone |

---

## 6. Candidates for N3 (multi-field compose)

| ID | Approach |
| -- | -------- |
| **C0 — RETAIN CURRENT** | Keep label + prompt + `aria-describedby` + textarea group |
| **C1 — Modest presentation / orientation** | Stronger grouping, numbering (“Response 2 of 4”), visual association of label↔field; no new control type |
| **C2 — Light PE** | Optional sticky label while focused field scrolled; “jump to field n” within group |
| **C3 — New compose “family”** | Special multi-field editor surface — **not justified** by T-003 (headroom MINOR–mild MEANINGFUL) |

**Assessment:** N3 is **adequately handled** by existing label/field semantics plus **C1** (and optionally **C2**). Do **not** create a new compose family merely because several fields exist.

**If retain C0:** Multi-field compose remains usable; scanning cost accepted for infrequent dense forms.

---

## 7. Mapping back to LA-* actions

| Action | Primary need linkage | Representation stance from options |
| ------ | -------------------- | ---------------------------------- |
| LA-study | — (control) | Retain |
| LA-compose | N3; N1 when Check far | Retain surface; optional C1/C2; N1 via R* **around** compose |
| LA-table | N2; N1 when Check far | Retain table surface; T1–T4 before T5; N1 via R* **around** table |
| LA-self-review | N1/N4 | Retain attestation surfaces; R* enhance **co-access**, not diagnosis |
| LA-order | control (typical) | Retain |
| LA-select | control | Retain |

**Multiplicity findings (Sprint 81 question: is mapping 1:1?)**

| Pattern | Evidenced? |
| ------- | ---------- |
| One LA → multiple representation options | **Yes** for revision (R0–R8) and tables (T0–T5) — options are **enhancements / commissioning**, not new action types |
| Same approach serves compose **and** table | **Yes** — R1–R6 are largely **phase/co-access** patterns independent of whether production is text or table |
| Representation varies by **scale or review phase** more than by LA type | **Yes** — strongest signal from T-003/T-004 |
| Representation as enhancement around existing surface | **Yes** — dominant viable pattern |
| Need for many new LA-level surface types | **Not evidenced** |

---

## 8. Architectural hypothesis test

> “PRISM may not need many new learner surface types. It may instead need contextual/revision enhancements around its existing accessible text/table/self-review surfaces.”

| Verdict | **ACCEPT with qualification** |
| ------- | ----------------------------- |
| Support | T-003: no material constraint on basic representations; unmet needs are co-access and scale; controls already appropriate |
| Qualification | N2 may be partly **upstream commissioning** (T1), not only renderer PE; guided frequency unknown — do not over-build guided-only architecture; ordering/select remain separate successful surfaces already |
| Reject alternative | A programme of many new LA-level widgets (matching, canvases, universal dual-pane for all activities) is **not** justified by N1–N4 alone |

**Implication for “surface families”:**  
Evidence points away from a large **activity-type → widget-family** taxonomy as the primary architecture. A better concept is:

```text
stable LA surfaces (study / compose / table / self-review / order / select)
  + optional contextual / revision-phase enhancements (and commissioning discipline for table scale)
```

That can still map later to charter outcomes **A** (retain) or **B** (targeted enhancement). Outcome **C** (systematic surface-family architecture) is **not required** by current needs evidence; **D** (substantial overhaul) is **unsupported**.

*(Charter letter preference is for the later recommendation task — stated here only as evidence implications, not a selection.)*

---

## 9. Accessibility / fallback implications (candidates)

| Candidate class | Semantic model | Keyboard / focus | Reflow | Fallback |
| --------------- | -------------- | ---------------- | ------ | -------- |
| R0 / T0 / C0 | Current | Current | Current | — |
| R1, R7, C1 | Links, headings, existing controls | Excellent | Excellent | No-JS = normal scroll |
| R2, R4 sticky strips | Prefer `role`/`aria` on guidance regions; don’t trap focus | Manage sticky vs focus order | Stack strip above content on narrow | Disable sticky → linear |
| R3 disclosures | `<button>` + region; mirror as read-only text **or** focus live field — avoid duplicate editable clones without names | Esc/close; restore focus | Stack | Closed = R0 |
| R5 dual-pane | Must define reading order; avoid CSS-only “visual only” panes | Pane switch shortcuts; resize not required for a11y | **Must** collapse to single column | Forced single column = R0/R6 |
| T2–T4 | Keep `<table>` + textareas | Cell-to-cell Tab; optional “next empty” | Horizontal scroll container retained | Plain table |
| T5 replacements | High risk of losing table semantics | Often worse | Often worse | Only with proven need |

**Preference (when benefits comparable):** progressive enhancement of **native** controls over custom interaction primitives.

---

## 10. Complexity & contract / state implications

| Area | Implication |
| ---- | ----------- |
| Evidence schema (`text_entry` / `table_entry` / `checklist_entry`) | **No change required** for R0–R4, R7–R8, T0–T3, C0–C2 |
| `diagnostic_review` | Remains commission-only; do not add runtime consumer |
| Client-only UI state | Likely for active criterion, disclosure open, revision mode, sticky — **presentation state**, not new learner evidence |
| Authoring/GAM | T1/T4 may need commissioning guidance or optional structure hints — product/policy, not a new LA surface |
| Guided vs flat | R8 depends on guided emission frequency (unknown) — prefer patterns that also help **flat** checklists (R1–R3) |
| Export / static HTML | PE must degrade; landmarks/links more portable than dual-pane |

**Possible debt (recorded, not solved):** if dual-pane (R5) were pursued without a mandatory single-column fallback, it would create a11y/reflow debt — see [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md) S81-D-008 (watch item).

---

## 11. Remaining unknowns

1. Guided vs flat frequency on live first-class output (affects R8 weight).  
2. Whether N2 in production is mostly over-commissioning (favours T1) vs unavoidable wide grids (favours T2–T4).  
3. Learner tolerance for scroll cost in the wild (R0 may be enough if rare).  
4. Small-screen behaviour of sticky/disclosure patterns (needs device check before any implementation authorisation).  
5. Whether “revision mode” (R6) confuses Explore/Task/Check mental model — needs design probe, not assumed.

---

## 12. Evidence-supported shortlist (for recommendation stage)

Carry forward — **not** a final A/B/C/D pick:

| Priority | Shortlist item | Rationale |
| -------- | -------------- | --------- |
| 1 | **R0 retain** as always-on baseline option | No material constraint; controls already fine |
| 2 | **R1** landmarks / jump links | Low cost; preserves everything; partial N1 relief |
| 3 | **R3 and/or R4** contextual co-access PE (flat + guided) | Directly targets N1/N4 without new LA surfaces or diagnosis |
| 4 | **T0 + T1** (retain table + upstream commissioning discipline) | N2 often not a “new surface” problem |
| 5 | **T2** in-table orientation PE | If grids must stay large |
| 6 | **C0 + C1** | N3 without a compose family |
| Park / deprioritise | **R5** dual-pane as default | High complexity/a11y unless fallback-first |
| Park | **T5** replace tables | Conflicts with T-003 cognitive fit without new evidence |
| Park | **C3** new compose family | Not justified |
| Park | New matching/canvas/select families | Outside N1–N4; S81-D-002 |

**R6** and **R7** remain **secondary shortlist** (viable; less central than R1+R3/R4).

---

## 13. Acceptance check

| Deliverable | Status |
| ----------- | ------ |
| Option sets N1/N4, N2, N3 + retain baselines | Done |
| Qualitative comparison | Done |
| LA-* mapping + multiplicity | Done |
| Surface-families vs enhancement concept | Hypothesis **accepted with qualification** |
| A11y/fallback + complexity/contracts | Done |
| Shortlist for recommendation stage | Done |
| Final A/B/C/D | **Not selected** |

---

## 14. Recommended next task (not executed)

### S81-T-005 — Sprint 81 recommendation A/B/C/D (evidence gate)

- **Mode:** recommendation / decision support — still **no** product implementation unless operator separately authorises after decision.  
- **Input:** T-001…T-004 (especially T-004 shortlist + hypothesis verdict).  
- **Job:** Recommend **A / B / C / D** with explicit mapping from needs N1–N4 and shortlist; state complexity implications; if not A, outline what would be authorised next (still non-implementing until approved).  
- **Constraint:** Do not treat shortlist items as already chosen product scope.

---

## 15. Out of scope (confirmed not done)

Production code; final A/B/C/D selection; implementing R*/T*/C*; inventing free-text/table diagnosis; redesigning GAM; WCAG remediation programme.
