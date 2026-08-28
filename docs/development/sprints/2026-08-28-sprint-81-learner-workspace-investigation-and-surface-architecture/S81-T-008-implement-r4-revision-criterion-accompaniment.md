# S81-T-008 — Implement R4 revision-pass criterion accompaniment

**Sprint:** 81 — Learner Workspace Investigation & Surface Architecture  
**Status:** **COMPLETE / ACCEPTED** (operator closeout 2026-08-28 — revision interaction accepted)  
**Executed:** 2026-08-28  
**Mode:** Implementation — R4 only (activity-level Task landing)  
**Authority:** [S81-D02](decisions.md#s81-d02--b-targeted-enhancement-narrowed); [S81-T-006](S81-T-006-revision-co-access-design-validation-r3-vs-r4.md) (R4 primary); operator authorisation 2026-08-28; criterion→locus diagnostic (activity-level only)  
**Related:** [S81-T-007](S81-T-007-implement-r1-task-check-navigation.md) (R1 asymmetric; Task→Check removed); [SPRINT-81-CLOSURE.md](SPRINT-81-CLOSURE.md)

---

## 0. Manual UX correction (2026-08-28)

Operator testing found the R1 **Task → Check** link redundant and mistimed in the linear document (Task already flows into Check).

**Removed:** learner-visible Task → Check shortcut (not relocated to end of production).  
**Retained:** Task/Check landmark ids; Check → **Back to your task**; R4 **Revise with this criterion**.

Intended first-pass: Explore → Your task → production → Check (no premature Check chrome in Task).

### Compact revision reminder (same day)

Operator rejected sticky **full** Review guidance (too much viewport loss).

**Added (PE):** when an active criterion’s full Review guidance scrolls out of view, a **compact reminder** shows: “Revising against” + criterion statement + **View guidance** (scrolls/focuses the existing full panel). Reminder clears with **Hide guidance**. No modal/drawer; no sticky full panel.

### Defect fix — reminder not appearing (manual test)

**Root cause:** (1) `tmp-r4-hetero-preview.html` / static learner HTML lacked reminder CSS, so un-hiding left the reminder in its natural slot already above the fold with no sticky/fixed presentation; (2) `position:sticky` from a slot already scrolled off-screen does not re-enter the viewport; (3) scroll listening was window-only (misses nested overflow roots).

**Fix:** reminder uses `position:fixed` when `data-revision-reminder-active`; PE CSS inlined into learner page; scroll capture + scroll-parent-aware in-view checks; show only when guidance out of view and task still in view.

### Second manual repro — runtime investigation (2026-08-28)

Operator reported hard-refreshed regenerated `tmp-r4-hetero-preview.html` still showed no compact reminder.

**1. Artefact identity (on-disk proof):** refreshed preview contains `#prism-revision-reminder-css`, `position:fixed` active rule, compact reminder markup, single `syncReminderFromGuidance` PE, `getScrollParent` / `taskInView=isInView(task)`. No duplicate PE. Generation path is current `renderLearnerPageHtml` (prefer `node tmp-regen-r4-preview.js`).

**2. What “Task” means in the condition:** `task` = the entire Do section `section[data-composition-moment=do]` — **not** the “Your task” heading alone.

**3. Live visibility dump (Cursor browser, after Revise → scroll past guidance into production):**  
`guidanceInView=false`, `headingInView=false`, `taskInView=true`, `bodyInView=true`, `shouldShowReminder=true`, `data-revision-reminder-active=true`, computed `display:block; position:fixed; top:0; opacity:1`, reminder rect at viewport top. Screenshot confirmed “Revising against” / statement / “View guidance” on screen. Scroll root = WINDOW. No transform/filter containing-block issues.

**4. Condition implication:** if the gate had required the **heading** to stay in view, reminder would be impossible at the intended production scroll point (`headingInView=false` while production still visible). Current Do-region gate is the correct activity-extent boundary; **no condition change** after this proof.

**5. Root cause of second operator failure:** **not reproduced** against the current artefact in a real layout browser. Implementation + fixed rendering verified active. Temporary diagnostics left for operator one-shot confirmation:

- Preview sets `window.__PRISM_R4_DEBUG__=true` (also `?r4debug=1`).
- Console: `[PRISM_R4]` logs on activate/scroll when the decision changes.
- DevTools: `__PRISM_R4_DUMP__('A1')` — compare `guidanceInView`, `headingInView`, `taskInView`, `bodyInView`, `shouldShowReminder`, `computed`.

**6. No further UX/design change.** Sprint 81 remains open for operator review.

### Shell occlusion fix (2026-08-28)

Operator screenshot (full learner shell) showed production scrolled into view with reminder still not visible. Prior dumps already had `shouldShowReminder=true` / `position:fixed;top:0;z-index:40`.

**Confirmed:** sticky `.util-journey-nav` is `position:sticky; top:0; z-index:50` and occupies `--learner-sticky-nav-height` (live-measured; e.g. 215px). Reminder at `top:0` / `z-index:40` rendered **under** that nav.

**Fix (positioning only):** active reminder uses `top: var(--learner-sticky-nav-height, 0px)` (same shell token used for `scroll-margin-top`); keep `z-index:40` below nav `50`. Sources: `revision-criterion-accompaniment.js` + `app.js` presentation CSS. Bare fixture without the token falls back to `0px`.

**Browser proof (full shell `tmp-r4-hetero-shell-preview.html`):** nav rect bottom≈214.5; reminder `top:215px`, `z-index:40`, `overlapNavReminder=false`, gap≈0.5px; reminder visible below journey nav over production.
---

## 1. Implementation

| Area | Change |
| ---- | ------ |
| `lib/learner-renderer-vnext/revision-criterion-runtime.js` | PE: activate / switch / hide + compact sticky reminder when full guidance leaves viewport |
| `lib/learner-renderer-vnext/revision-criterion-accompaniment.js` | Revise control + reminder host + full guidance host |
| `lib/learner-renderer-vnext/render-material.js` | Per-criterion “Revise with this criterion” on flat + guided checklists when R1 gate on |
| `lib/learner-renderer-vnext/render-composed-moment.js` | Hidden guidance host in Do when Task↔Check nav enabled; Task heading `tabindex="-1"` |
| `lib/learner-renderer-vnext/render-page.js` | Inject revision PE script when revise controls present |
| `app.js` | Light CSS for revise link + guidance region |
| Browser bundles | Regenerated |
| `tests/s81-t-008-revision-criterion-accompaniment.test.js` | **New** focused tests |
| `tests/s81-t-007-task-check-navigation.test.js` | Allow R4 revise wording alongside R1 |

**Not changed:** evidence schemas, draft adapters, `diagnostic_review` / `covers_response_material_ids`, field/cell targeting, R3.

---

## 2. Learner-visible behaviour

On each interactive self-review criterion (flat item or guided panel), when the activity has both Task and Check:

- Link **Revise with this criterion** (beside that criterion).
- Activates that criterion as the only active guidance for **that activity**.
- Navigates to `learner-task-{slug}` (same activity-level R1 Task target).
- Shows a **Review guidance** region above production with authored criterion content + honesty copy.
- **Hide guidance** dismisses accompaniment **and** the compact reminder (drafts and checklist checks unchanged).
- Selecting another criterion replaces guidance (and reminder statement).
- After scrolling past the full panel: compact sticky **Revising against** + statement + **View guidance** (returns to full panel).

**Back to your task** (R1 Check→Task) remains navigate-only.  
**Task → Check** shortcut is **not** shown (manual UX correction).

---

## 3. Exact state model

Per activity Task region:

```text
activeRevisionCriterionId = null | criterionId
```

Stored as `data-active-revision-criterion-id` on the Do section (and guidance/reminder hosts).  
Full guidance visible iff that attribute is set.  
Compact reminder visible iff active **and** full guidance is not meaningfully in the viewport (scroll/IO).  
No separate revision-mode or evidence state.

---

## 4. Focus / navigation

After revise: hash → Task landmark; focus → guidance heading (`tabindex="-1"`).  
Does **not** focus a guessed field/cell.  
After hide: focus → Task heading.  
Without JS: revise link still jumps to Task; guidance host stays hidden (content not required).

---

## 5. Compose / table

Same behaviour: activity Task region + one active criterion. Multi-field compose and table workspaces remain the editable SoT below the guidance strip.

---

## 6. Accessibility / fallback

Native `<a>` / `<button>`; labelled `<aside>`; keyboard operable; no focus trap; stacked layout; linear order; static page usable without accompaniment.

---

## 7. Tests / first-class gate

| Suite | Result |
| ----- | ------ |
| `node --test tests/s81-t-008-… tests/s81-t-007-…` | **9/9 pass** |
| `tests/learner-renderer-vnext-guided-review.test.js` | **9/9 pass** |
| `npm run test:first-class` | **339/339 pass** |

---

## 8. Manual test route

Same representative page as R1:

`tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json`

```bash
node tmp-regen-r4-shell-preview.js
```

Open `tmp-r4-hetero-shell-preview.html` (full sticky journey nav) — preferred for this defect — or:

```bash
node tmp-regen-r4-preview.js
```

(Equivalent bare fragment without shell.) Hard-refresh, then check:

1. Revise with this criterion → full guidance at Task.  
2. Scroll toward response fields → full guidance leaves view → compact reminder appears.  
3. Edit with reminder visible; use **View guidance**; **Hide guidance**.  
4. Repeat on a table activity; try a narrower viewport.  
5. Confirm no Task→Check shortcut; R1 Back to your task still works.

**Operator acceptance (2026-08-28):** final revision interaction accepted; Sprint 81 closed. See [SPRINT-81-CLOSURE.md](SPRINT-81-CLOSURE.md).

---

## 9. Surprising UX consequence

Guidance clones criterion statement (and guided why / look-for / repair when present). Flat checklists only carry the criterion statement text — no invented look-for. Activity-level land means the learner may still scroll within Task to the relevant field; that is intentional given the diagnostic.

---

## 10. Acceptance check

| Criterion | Met |
| --------- | --- |
| Explicit revise action per criterion | Yes |
| One active criterion; switch replaces | Yes |
| Hide guidance; drafts/attestation untouched | Yes |
| Activity-level Task target (R1 ids) | Yes |
| Compact reminder below sticky nav | Yes |
| No field/cell mapping / no DR propagation | Yes |
| Compose + table | Yes |
| `test:first-class` | **339/339** |
| No R3 / other S81 candidates | Yes |
| Operator manual acceptance | **Yes** (Sprint 81 closeout) |
