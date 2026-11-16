# Sprint 98 — Initial investigation (M1 baseline)

**Date:** 2026-11-16  
**Decision:** [S98-D02](decisions.md#s98-d02--accept-m1--sprint-opening-verification-and-evidence-baseline)

---

## Repository state

| Item | Value |
| ---- | ----- |
| Branch | `master` (tracks `origin/master`) |
| HEAD | `54774cde3810bea1f666b2456c6edff4bb6181ee` |
| HEAD subject | `various fixes and UI enhancements from the QA / corpus work` |
| Sprint 97 close commit | `4342bff` (2026-11-13) — Learning Journal / runtime integration |
| Open sprint before M1 | **None** ([NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md)) |
| Next number | **98** (available; consistent with governance) |

### Working tree at opening (not committed)

**Modified:** `app.js`; `lib/ld-design-page-partial-contract.js`; `lib/ld-gam-instructional-depth.js`; `lib/ld-gam-page-enrich-contract.js`; `lib/ld-self-directed-rhetoric.js`; Design Page / GAM / rhetoric / PEL / bootstrap tests.

**Untracked:** `tests/interactive-academic-plain-english-guidance.test.js`; `tests/interactive-commissioned-resource-title-preservation.test.js`.

**Policy:** Left intact. No overwrite, revert, commit or push during M1.

---

## Sprint 97 conventions followed

Portable pack under `docs/development/sprints/YYYY-MM-DD-sprint-N-…/` with charter, decisions, status, implementation map, architectural debt, start-here, handover, README; programme stub under `docs/sprints/`; NEXT-SPRINT updated. Sprint 97 **not** closed or altered to open 98 (already closed).

---

## Design Page guidance diff (summary)

In `lib/ld-design-page-partial-contract.js` (Interactive opening orientation block):

- Replaced generic “substantive briefing / conceptual synthesis” lines with **NEWLY AUTHORED page_synthesis responsibilities** for overview, learning_purpose, knowledge_summary.
- Added **TRANSPORT AUTHORITY** (verbatim upstream bodies).
- Added **instructional economy** rule (no same activity-by-activity progression in both overview and learning_purpose).
- Updated canonical shape snippet: Knowledge Summary = “Substantive advance organiser…”.
- Same file also carries authoritative-title emit rules from related prior work.
- Discovery / attempt-before / precision / visual lines retained.
- No `\d+ words?` limits in the contract text.

Injection path: `applyLdDesignPagePartialContractToDraft` — Design Page step + partial page outputs enabled; **Assessment Pack excluded**.

---

## Discrepancies reported (not silently corrected)

1. Prior report’s exact “**40** relevant tests passed” count was not reproduced as a labelled set; M1 verified the named files and a related **78/1** opening set instead.  
2. Working tree contains **more** than the three Design Page files (APE + title preservation). Recorded as baseline, not trimmed.  
3. `s96-interactive-editorial-opening` remains red for figcaption/subject; independent of this guidance change; left unfixed.

---

## Conclusion

M1 baseline is sufficient to open Sprint 98. Next substantive work is **M2 regeneration evaluation**, only when explicitly authorised.
