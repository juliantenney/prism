# S81-T-006 — Revision co-access design validation: R3 vs R4

**Sprint:** 81 — Learner Workspace Investigation & Surface Architecture  
**Status:** **ACCEPTED** (operator 2026-08-28; R4 implementation authorised via T-008)  
**Predecessors:** T-001…T-005 (ACCEPTED)  
**Related:** [S81-T-007](S81-T-007-implement-r1-task-check-navigation.md) (R1); [S81-T-008](S81-T-008-implement-r4-revision-criterion-accompaniment.md) (R4 implementation)

---

## 1. Purpose & recommendation (up front)

| Pattern | Intent |
| ------- | ------ |
| **R3** | Read-only / contextual view of learner production inside **Check** |
| **R4** | Active criterion / guidance available in **production** during an intentional **revision** pass |

### Recommendation

**Primary pattern: R4** — criterion context accompanies an **intentional revision pass** after the learner has entered Check — **not** permanent criterion chrome around production.

**Not selected as primary:** R3 (valuable for review/reference, weaker for revision efficiency and for large tables).  
**Not selected:** retain-current alone — R4 + R1 together address N1/N4 at proportionate complexity; R1 alone does not provide true co-access.

**Disposition at closeout:** R4 **shipped** via [T-008](S81-T-008-implement-r4-revision-criterion-accompaniment.md) (**ACCEPTED**). R3 remains **PARKED / NOT PURSUED** as primary.

---

## 2. Binding priors

- Surfaces and Explore → Task → Check → revise retained (S81-D02).  
- Authoritative draft = existing production workspace only.  
- Check = learner evaluates against authored criteria; Revise = learner changes production — co-access must not erase that distinction.  
- No second editable draft; no Prism free-text/table diagnosis; no dual-pane framework.  
- Smallest behavioural contract that solves N1/N4.

**Architecture fact (first-class):** moments render as sequential sections `data-composition-moment="do" | "check"` with headings “Your task” / “Check your response” (`render-composed-moment.js`). Production and criteria are already separate regions — co-access is a **loop/navigation** problem, not a missing surface type.

---

## 3. Revision loop under test

```text
produce (Do — authoritative edit)
  → enter Check
  → inspect criterion (+ look-for / repair when guided)
  → decide revision is needed
  → revise production (must edit authoritative fields)
  → continue / revisit review
```

| Loop step | Context that must survive | Failure mode today (T-003) |
| --------- | ------------------------- | -------------------------- |
| Inspect criterion | Criterion text + memory of production | Scroll away from production → weak co-view |
| Decide to revise | Which criterion failed; what to change | Criterion forgotten while scrolling to Do |
| Revise | Authoritative fields + that criterion’s guidance | Scroll thrash; guidance left behind in Check |
| Revisit review | Updated production + next criterion | Repeat scroll; R1 helps relocate only |

N1/N4 is about **co-access across this loop**, not prettier static layouts.

---

## 4. R3 analysis — production context in Check

### 4.1 Behavioural sketch

While in Check (flat checklist or guided panel), show a **read-only** presentation of current draft production (compose text and/or table cell values), derived from the live draft — **not** a second editable surface.

### 4.2 Loop fit

| Step | R3 effect |
| ---- | --------- |
| Inspect criterion | **Strong** — criterion and production co-visible in Check (review/reference) |
| Decide revision | **Strong** — can judge without scrolling to Do |
| Revise | **Weak** — edit still requires leaving Check to authoritative Do fields (even with R1) |
| Revisit review | **Good** — return to Check; mirror should refresh from live draft |

### 4.3 Review/reference vs revision efficiency

| Dimension | Assessment |
| --------- | ---------- |
| Review/reference value | **High** — genuine co-view while evaluating |
| Revision efficiency | **Limited** — mirror does not shorten the edit hop; learner still navigates to Do, edits, returns |

A read-only mirror that cannot be edited **by design** (correct SoT) therefore solves half the loop well and the revise half poorly.

### 4.4 Compose vs table

| | Compose | Table |
| - | ------- | ----- |
| Mirror usefulness | High for 1–few text fields | Lower: large cell maps are hard to scan as a secondary read-only block; duplicates visual weight of Do |
| Stale risk | Manageable if bound to live draft text | Higher complexity: many cells; partial updates; wide layout on narrow viewports |
| Universal success? | Elegant for prose | **Awkward as universal primary** for large tables (operator test #5) |

### 4.5 Flat vs guided

| | Fit |
| - | --- |
| Flat | One production mirror above/beside criterion list — workable |
| Guided | Mirror + current panel — strong for inspect; still weak for revise |

### 4.6 Source of truth / duplication

- Authoritative: Do workspaces only.  
- Mirror: **projection** of draft (DOM values or draft adapters) — must update when draft changes.  
- Snapshot-at-Check-open: **stale after revise** — reject as default.  
- Second editable copy: **out of scope / rejected** (sync complexity).

### 4.7 Honesty / a11y / complexity

| Topic | Notes |
| ----- | ----- |
| Honesty | Must label as “Your draft (read-only)” / “for review — edit in Your task”; never “score” or “Prism checked” |
| A11y | Extra region; avoid duplicate names that sound like second inputs; live update announcements careful |
| No-JS | Mirror absent or static empty → linear Check only (R0) |
| Complexity | Med — live binding compose OK; tables materially harder |
| Client state | Mirror open/closed optional; live-bind preferred over snapshot |

### 4.8 R3 verdict

R3 is a **credible Check-phase enhancement** for compose and guided inspect. It is **not** the best **universal** primary for N1/N4 because (a) revision still requires a hop to edit, and (b) large-table mirrors are a poor fit.

---

## 5. R4 analysis — criterion context in production (revision pass)

### 5.1 Behavioural sketch

After the learner has **entered Check** (and optionally focused a criterion), an **intentional revision pass** makes **one active criterion’s** statement / look-for / repair available adjacent to the **authoritative** Do production — without pasting all criteria around every field permanently.

### 5.2 How criterion context becomes active (constraint #4)

| Anti-pattern | Reject |
| ------------ | ------ |
| All criteria always visible beside every textarea/cell | Permanent clutter; flattens Check |

| Acceptable activation (smallest contract) | |
| ----------------------------------------- | - |
| Learner has visited Check in this activity | Gate |
| Then either: uses R1 “back to response”, or an explicit “Revise with this criterion” from a criterion | Enters revision accompaniment |
| **One** active criterion at a time | Strip / region near Do |
| Clearing / leaving revision accompaniment restores normal Do chrome | Check remains the evaluation home |

R4 **belongs to the revise act after Check**, not to first-pass production.

### 5.3 Loop fit

| Step | R4 effect |
| ---- | --------- |
| Inspect criterion | Still happens in **Check** (pedagogy preserved) |
| Decide revision | In Check; activation chooses which criterion travels |
| Revise | **Strong** — edit authoritative fields with that guidance present |
| Revisit review | R1 (or sequential) back to Check; next criterion |

### 5.4 Review/reference vs revision efficiency

| Dimension | Assessment |
| --------- | ---------- |
| Review/reference (first evaluation) | Remains in Check — **correct** |
| Revision efficiency | **High** — guidance survives into the edit locus |

This matches the pedagogical split: Check evaluates; Revise changes production **with** remembered criterion context.

### 5.5 Compose vs table

| | Compose | Table |
| - | ------- | ----- |
| Criterion strip near production | Natural | Natural — does not duplicate the grid |
| Large grids | One sticky/guidance region above/beside table | **Better universal fit than R3 mirror** |
| Multi-field compose | Same active criterion for the activity’s production set (not per-field spam) | Same |

One pattern can serve compose and table **cleanly** if the unit is **activity production region + one active criterion**, not per-cell chrome.

### 5.6 Flat vs guided

| | Fit |
| - | --- |
| Flat | Need explicit “use this criterion while revising” (or “active” = last focused / first unchecked) — small presentation state |
| Guided | Current panel criterion is a natural active criterion when learner chooses revise |

### 5.7 Source of truth

- Production: unchanged authoritative fields.  
- Criterion: authored Check content (no draft sync).  
- **No duplicate response body** — avoids R3’s stale/mirror problem.  
- SoT simplicity is a **real** advantage for tables, not a bias to dismiss R3’s review value — R3 still loses on revise efficiency + table mirror cost.

### 5.8 Honesty / a11y / complexity

| Topic | Notes |
| ----- | ----- |
| Honesty | “Review guidance (you decide)” / criterion text as guidance; never auto-pass |
| A11y | Guidance region labelled; focus move Do ↔ criterion control; don’t trap focus in sticky |
| Narrow viewport | Stack guidance **above** production; dismissible |
| No-JS | No accompaniment → R0 + R1 links only |
| Complexity | Low–med — presentation state: `checkVisited`, `activeCriterionId`, accompaniment visible |
| Client state | Intentionally small; not a revision subsystem |

### 5.9 R4 verdict

R4 is the better **primary** for the evidenced N1/N4 **revision loop**, works for **compose and table**, preserves Check as evaluation home, and keeps the behavioural contract small.

---

## 6. Direct comparison

| Criterion | R3 | R4 |
| --------- | -- | -- |
| Inspect criterion + see production | **Better** | Check-only (by design) |
| Revise with guidance at edit locus | Weaker (hop to Do) | **Better** |
| Compose fit | Strong | Strong |
| Large table fit | Weak / heavy mirror | **Stronger** |
| Flat self-review | Good | Needs active-criterion rule |
| Guided self-review | Good inspect | Natural revise handoff |
| SoT / stale risk | Live-bind required; table hard | Authored criterion; no response clone |
| Permanent clutter risk | Low (in Check) | Must gate to revision pass |
| Pedagogy Check vs Revise | Strengthens Check | Strengthens Revise; Check stays primary for evaluate |
| Complexity | Med (esp. tables) | Low–med |
| Beats R1 alone on co-access? | Yes for inspect | Yes for revise |
| Universal primary for N1/N4? | No | **Yes (qualified)** |

**Bias check:** R4 is not preferred merely because SoT is simpler. It is preferred because (1) the costly loop step after “decide to revise” is **editing**, (2) tables make R3 mirrors a poor universal, and (3) R4 preserves Check as the evaluate phase while solving revise co-access.

---

## 7. Retain-current?

**Not recommended as the primary outcome of T-006.**

R1 alone (T-007) reduces *search* cost but does not provide *co-access*. R4 adds a small, gated presentation contract that materially targets N1/N4 revise without new surfaces. Complexity is proportionate.

Retain-current remains available if operator rejects R4 after review.

---

## 8. Recommended primary pattern

# **R4 — revision-pass criterion accompaniment**

**Companion (already authorised as separate task):** **R1** navigation Task ↔ Check (T-007) — complementary, not replaced by R4.

**R3:** not primary; do not open R3 implementation under this recommendation. (Future optional Check-phase mirror would need a separate evidence case, especially for table-safe design.)

---

## 9. Proposed behavioural contract (R4)

### 9.1 States (client presentation only)

| State | Meaning |
| ----- | ------- |
| `checkEncountered` | Learner has focused/scrolled to / activated the activity Check region at least once this page session (exact signal to be chosen in impl; must be intentional enough to avoid accidental activation) |
| `activeCriterionId` | At most one criterion from this activity’s Check (flat item or guided panel) |
| `revisionAccompaniment` | Boolean — criterion guidance region visible adjacent to Do production |

### 9.2 Rules

1. **Default first-pass Do:** no criterion accompaniment (`revisionAccompaniment = false`).  
2. Accompaniment may turn on only if `checkEncountered` and an `activeCriterionId` is set.  
3. Setting `activeCriterionId`: learner action in Check (focus criterion, “Revise with this criterion”, or guided panel’s revise handoff). Prefer explicit control over silent heuristics where possible.  
4. Accompaniment renders **authored** criterion content (statement; optional why / look-for / repair). It does **not** write learner evidence.  
5. Production fields remain the **only** editable draft surface.  
6. Dismiss / “Hide guidance” / navigating away may clear accompaniment without clearing drafts.  
7. Changing `activeCriterionId` replaces guidance content (one at a time).  
8. Wording must not imply Prism scored production.  
9. No-JS / failed PE: no accompaniment; page remains linear (R0). R1 links still apply when implemented.  
10. Scope unit: **one activity’s** Do production region (all compose fields and/or table workspace for that activity), not per-cell criterion chrome.

### 9.3 Evidence / feedback model

- Unchanged draft kinds and schemas.  
- Checklist attestation unchanged.  
- `diagnostic_review` remains commission-only.

---

## 10. Accessibility / fallback contract

| Requirement | Contract |
| ----------- | -------- |
| Semantics | Guidance in a labelled region (`aria-label` / heading); not a fake dialog unless necessary |
| Keyboard | Reachable dismiss; R1-compatible; Tab order: guidance then production (or documented reverse); no focus trap |
| Focus | On activating revise-from-Check, move focus to a sensible production control **or** to guidance then production — pick one in impl AC and test |
| Reflow | Stack guidance above production under ~narrow viewport; no dual-pane requirement |
| AT | Criterion text available as text; live region only for state changes that need announcement (optional, restrained) |
| Fallback | Without JS: no accompaniment; Check and Do still complete linear document |
| Export | Static HTML must not depend on accompaniment for correctness |

---

## 11. Implementation acceptance criteria (if operator accepts R4)

Tight bound for a **future** implementation task (not opened here; not T-007):

1. First visit to Do shows **no** criterion accompaniment.  
2. After Check encounter + explicit revise/active-criterion action, Do shows **one** active criterion’s guidance.  
3. Learner can edit authoritative compose **and** table fields with guidance visible.  
4. Learner can dismiss guidance; drafts persist.  
5. Switching active criterion updates guidance once.  
6. Flat and guided Check can set `activeCriterionId` (guided: current panel or explicit revise).  
7. Copy is honesty-safe (no Prism-assessed claim).  
8. Narrow viewport: stacked layout usable.  
9. Keyboard path completes revise loop without pointer.  
10. No second editable mirror; no evidence schema change.  
11. No-JS: linear page usable; accompaniment absent.  
12. `npm run test:first-class` passes; focused tests cover activation gating + single active criterion + dismiss.  
13. Does **not** implement R3, R5, T2, C1, or a general revision framework.

**R1 (T-007)** remains separately scoped: landmarks/jump only; may share `id`s with R4 activation targets when both ship.

---

## 12. Explicit non-goals

- Implementing R3 or R4 in this task.  
- Executing T-007.  
- Opening R4 implementation task before operator accepts T-006.  
- Second editable draft / sync engine.  
- Permanent criteria around production.  
- Dual-pane default; table replacement; new compose family.  
- Free-text/table diagnostic engine.  
- Representation registry / general revision subsystem.  
- T1/T2/C1 implementation.

---

## 13. Operator decision ask

1. Accept **R4 as primary** for subsequent implementation scoping?  
2. Confirm **R3 not in current implementation path**?  
3. When ready, authorise a **bounded R4 implementation task** (separate from T-007) and/or authorise **T-007 (R1)** independently?

---

## 14. Out of scope (confirmed not done)

Production code; T-007 execution; R3/R4 implementation; new implementation task creation beyond updating READY records.
