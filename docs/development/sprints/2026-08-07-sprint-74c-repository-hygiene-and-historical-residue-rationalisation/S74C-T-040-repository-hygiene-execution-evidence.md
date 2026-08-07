# S74C-T-040 — Repository Hygiene Execution Evidence

**Sprint:** 74C — Repository Hygiene & Historical Residue Rationalisation  
**Task:** S74C-T-040  
**Status:** **Done** (2026-08-07)  
**Authority:** [S74C-T-030-repository-hygiene-execution-plan.md](S74C-T-030-repository-hygiene-execution-plan.md) · [S74C-T-020](S74C-T-020-retention-and-deletion-decisions.md) · [S74C-D02](decisions.md)  
**Mode:** Executed approved slices only — **no Group F**, **no T-050**, **no product behaviour changes**  
**Next:** S74C-T-050 (verify and close — **not** begun here)

---

## Execution order

`A → D → G → B → C → E1 → E2` — one commit each, explicit path staging only (no `git add -A`).

---

## Slice A — Root tracked scratch

| Field | Content |
| ----- | ------- |
| **Purpose** | Remove tracked root dump/scratch and stale root briefing |
| **Files removed** | `test-out.txt`, `test-compose.txt`, `test2.txt`–`test6.txt`, `tmp-ifp-dump.txt`, `tmp-owen-a1-boundary-diagnostics.json`, `tmp-owen-a1-rerender.html`, `page - 2026-08-05T100251.html`, `page - 2026-08-05T100456.html`, `NEXT-CHAT-CONTEXT.md`, `tmp-was-marx-right/learner-page.html`, four PNGs under `tmp-was-marx-right/assets/` (**18 paths**) |
| **Verification** | Staged names = A list only; post-commit `git ls-files` for those paths empty; no `lib/` / `app.js` staged |
| **Commit hash** | `218cc97f83fdf2fd93dab7ad2f5b929e8b062ffb` |
| **Result** | **Pass** |
| **Unexpected findings** | None |
| **Rollback** | `git revert 218cc97` |

---

## Slice D — Tracked `tools/_tmp_*` dumps

| Field | Content |
| ----- | ------- |
| **Purpose** | Remove tracked temporary dumps under `tools/` |
| **Files removed** | `tools/_tmp_hetero_utility.html`, `tools/_tmp_s59_analysis_out.txt` |
| **Local only** | Untracked `tools/_tmp_edpsych_export/` removed from working tree (not a git commit) |
| **Verification** | `git ls-files 'tools/_tmp_*'` empty; Group F `tools/evaluate-educational-quality-framework.js` and `tools/sprint-50-marx-verification-run.mjs` still present |
| **Commit hash** | `9772aa16d4d95b03772016ba513ccc289da44050` |
| **Result** | **Pass** |
| **Unexpected findings** | None |
| **Rollback** | `git revert 9772aa1` |

---

## Slice G — `.gitignore` expansion

| Field | Content |
| ----- | ------- |
| **Purpose** | Prevent reintroduction of scratch classes |
| **Files changed** | `.gitignore` only (append S74C block per T-030) |
| **Verification** | `git check-ignore -v tests/fixtures/dla/rna-hcv-dla-08-run-raw.txt` → **no match** (PASS); `git check-ignore -v test-out.txt` → matches `/test*.txt`; `tools/_tmp_foo/bar.txt` matches `tools/_tmp_*/` |
| **Commit hash** | `43cbd0a2d0305b31baffcab49431628b1e49ca27` |
| **Result** | **Pass** |
| **Unexpected findings** | None |
| **Rollback** | `git revert 43cbd0a` |

---

## Slice B — Compose-broken probes/tools

| Field | Content |
| ----- | ------- |
| **Purpose** | Remove tooling calling/encoding removed compose APIs |
| **Files removed** | `scripts/probe-design-page-s57-audit-metrics.js`, `tools/capture-sprint-42-4-provenance.js`, `scripts/thin-design-page-pack-template.js` |
| **Verification** | Staged = 3 paths only; `rg applyLdDesignPageComposeContractToDraft scripts tools` → no matches; Group F evaluate tool retained |
| **Commit hash** | `49f6f4a2b2ed0d4393ec5637c1a9180b591bb8ff` |
| **Result** | **Pass** |
| **Unexpected findings** | None |
| **Rollback** | `git revert 49f6f4a` |

---

## Slice C — Remaining obsolete probe family / mutator

| Field | Content |
| ----- | ------- |
| **Purpose** | Remove remaining `probe-*`, sprint-16/19 scripts, `tests/_patch-icons.js` |
| **Files removed** | 11 remaining `scripts/probe-*`, `scripts/sprint-16-e2e-html-smoke.js`, `scripts/sprint-19-ld-factory-validation.js`, `tests/_patch-icons.js` (**14 paths**) |
| **Verification** | No `.test.js` / fixtures in staged set; `git ls-files 'tests/*.test.js'` count **288 → 288**; `git ls-files 'scripts/probe-*'` empty; `_patch-icons.js` absent |
| **Commit hash** | `5650d54c6383315cc688ab75293a361aec9c1bea` |
| **Result** | **Pass** |
| **Unexpected findings** | None |
| **Rollback** | `git revert 5650d54` |

---

## Slice E1 — `_archive` quarantine tree

| Field | Content |
| ----- | ------- |
| **Purpose** | Remove forensic quarantine; Git history is archive (S74C-D02) |
| **Files removed** | Entire `_archive/failed-investigation-2026-06-29/**` (**12 paths**) |
| **Verification** | Quarantine path absent; `archive/docs-legacy` still present; no new `_archive/` shelf created |
| **Commit hash** | `7004ef1dc71a0cc7e433678abe0b2ba0589d2607` |
| **Result** | **Pass** |
| **Unexpected findings** | None |
| **Rollback** | `git revert 7004ef1` |

---

## Slice E2 — Loose `captures/sprint-41-impacts`

| Field | Content |
| ----- | ------- |
| **Purpose** | Remove loose historical captures outside sprint packs |
| **Files removed** | `captures/sprint-41-impacts/inflation-page-json.txt`, `captures/sprint-41-impacts/inflation-rendered-page.html` |
| **Verification** | `captures/sprint-41-impacts` absent; Sprint 41 pack under `docs/development/sprints/2026-06-11-sprint-41-educational-framework-integration` present |
| **Commit hash** | `fec8a52616dda168025bf5c6512a1d6e5ef13a7a` |
| **Result** | **Pass** |
| **Unexpected findings** | None |
| **Rollback** | `git revert fec8a52` |

---

## Repository impact

| Metric | Result |
| ------ | ------ |
| Hygiene commits | **7** (A–E2) |
| Paths removed (approx.) | **18 + 2 + 3 + 14 + 12 + 2 = 51** tracked deletions (+ `.gitignore` edit) |
| Runtime / `app.js` / `lib/**` | **Unchanged** |
| `tests/**/*.test.js` | **Unchanged** (288 tracked) |
| Fixtures | **Unchanged** |
| Behaviour | **No product behaviour changes** |
| Repository | **Cleaner** — scratch, obsolete probes, quarantine, loose captures gone; ignore policy expanded |

---

## Protected classes preserved (spot-check)

| Path / class | Present after E2 |
| ------------ | ---------------- |
| `app.js` | Yes |
| `lib/learner-renderer-vnext-browser.js` | Yes |
| `artifacts/learner-renderer-vnext-certification.json` | Yes |
| `archive/docs-legacy/examples/workflow-example-pedagogy.json` | Yes |
| `scripts/dev-server.js` | Yes |
| `scripts/audit-learner-surfaces.js` | Yes |
| Group F: `tools/evaluate-educational-quality-framework.js` | Yes |
| Group F: `tools/sprint-50-marx-verification-run.mjs` | Yes |
| Group F: `scripts/build-roman-roads-association-fixture.js` | Yes |
| Sprint evidence packs | Untouched (docs only updated for 74C status) |

---

## Verification summary

| Slice | Commit | Pass |
| ----- | ------ | ---- |
| A | `218cc97` | Yes |
| D | `9772aa1` | Yes |
| G | `43cbd0a` | Yes |
| B | `49f6f4a` | Yes |
| C | `5650d54` | Yes |
| E1 | `7004ef1` | Yes |
| E2 | `fec8a52` | Yes |

Hard-stop conditions: **none triggered**.

---

## Remaining residue

| Item | Status |
| ---- | ------ |
| **Group F** deferred tooling | **Intentionally retained** (evaluate CLIs, live-capture tools, Roman Roads / VEU / VideoTranscriptTest / IMP / phase-sanitize / debug helpers) |
| `archive/docs-legacy/` | **Retained** (ADR shelf) |
| Uncommitted 74C / parent wrapper docs (pre-existing dirty docs tree) | Documentation packaging — not hygiene residue; recorded/updated after execution |
| Empty parent dirs (`_archive/`, `captures/` if empty) | May remain as empty dirs locally; not tracked content |

---

## Ready for T-050

**Yes.** Hygiene execution complete per T-030. T-050 may verify/close 74C (and programme if authorised). **T-050 not begun in this task.**

---

## Validation checklist

| Check | Result |
| ----- | ------ |
| Slices in approved order | ✓ |
| One commit per slice | ✓ |
| Protected classes untouched | ✓ |
| Group F untouched | ✓ |
| Runtime unchanged | ✓ |
| Tests unchanged | ✓ |
| Fixtures unchanged | ✓ |
| No behavioural changes | ✓ |
| Repository cleaner | ✓ |
