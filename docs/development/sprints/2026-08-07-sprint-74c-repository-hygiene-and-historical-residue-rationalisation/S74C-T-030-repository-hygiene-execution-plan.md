# S74C-T-030 — Repository Hygiene Execution Plan

**Sprint:** 74C — Repository Hygiene & Historical Residue Rationalisation  
**Task:** S74C-T-030  
**Status:** **Done** (2026-08-07)  
**Mode:** Execution **planning** only — **no deletions, renames, moves, or non-sprint-doc edits**  
**Authority:** [S74C-T-010](S74C-T-010-repository-hygiene-inventory.md) · [S74C-T-020](S74C-T-020-retention-and-deletion-decisions.md) · [S74C-D02](decisions.md#s74c-d02--git-history-is-the-default-archive-active-copies-need-current-operational-justification) · [SPRINT-74C-CHARTER.md](SPRINT-74C-CHARTER.md) · [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  
**Next:** S74C-T-040 (execute approved slices — **not** this document)

---

## 1. Planning posture

| Rule | Application |
| ---- | ----------- |
| T-020 decisions | **Authoritative** — not re-litigated |
| No second inventory | Path lists taken from T-010/T-020 + `git ls-files` confirmation for planning |
| One slice → one commit | Independently executable and verifiable |
| No archive copies | Per S74C-D02 — delete active copies; Git history remains |
| Protected classes | Untouched (see §7) |
| Group F | **Out of execution** |

**T-040 readiness:** **Yes** — slices A, D, G, B, C, E1, E2 are fully specified below.

---

## 2. Slice refinement (vs T-020 baseline)

| T-020 | T-030 refinement | Why |
| ----- | ---------------- | --- |
| A | **A** unchanged | Homogeneous root scratch |
| B | **B** unchanged | Compose-broken only (3 paths) |
| C | **C** = remaining `probe-*` + sprint-16/19 + `_patch-icons` (**excludes** B’s `probe-design-page-s57-…`) | Avoid double-delete; keep B independently verifiable |
| D | **D** unchanged | Tracked `tools/_tmp_*` dumps |
| E | Split **E1** (`_archive/…`) + **E2** (`captures/…`) | Smaller rollback; different directories |
| G | **G** unchanged | `.gitignore` expansion |

No unrelated merges. Commit count increases by one (E split) for safety.

---

## 3. Definitive T-040 execution order

```text
A → D → G → B → C → E1 → E2
```

| Step | Slice | Rationale |
| ---- | ----- | --------- |
| 1 | **A** | Lowest risk: root dumps only; no script/tooling graph |
| 2 | **D** | Same class (scratch dumps) under `tools/`; still no tooling graph |
| 3 | **G** | Lock ignore policy **after** scratch removals so recreating the same filenames cannot be re-committed; `git rm` of already-deleted paths is done |
| 4 | **B** | Smallest obsolete-tooling slice (compose-broken); fail/grep easy |
| 5 | **C** | Larger obsolete-script set; depends on B only for non-overlap clarity (not hard dependency) |
| 6 | **E1** | Quarantine tree — approved delete; separate from captures |
| 7 | **E2** | Loose captures — last deletion; smallest independent shelf |

**Why this minimises risk**

1. Scratch first → immediate noise reduction with zero tooling risk.  
2. Ignore expansion before obsolete-script deletes → any accidental local regeneration of scratch stays untracked during later slices.  
3. Compose-broken (B) before remaining probes (C) → if C is paused, B’s AC-09 win is already committed.  
4. Archive/captures last → historical shelves removed only after scratch/tooling hygiene is green.  
5. E1/E2 split → rollback one tree without the other.

**Hard dependency:** None require prior slice for *correctness* of `git rm`. **Soft dependency:** G should follow A+D so ignore patterns match what was just removed; B before C avoids path overlap confusion.

---

## 4. Execution slices

### Slice A — Root tracked scratch

| Field | Content |
| ----- | ------- |
| **Purpose** | Remove tracked root dump/scratch and stale root briefing |
| **Files affected** | `test-out.txt`, `test-compose.txt`, `test2.txt`, `test3.txt`, `test4.txt`, `test5.txt`, `test6.txt`, `tmp-ifp-dump.txt`, `tmp-owen-a1-boundary-diagnostics.json`, `tmp-owen-a1-rerender.html`, `page - 2026-08-05T100251.html`, `page - 2026-08-05T100456.html`, `NEXT-CHAT-CONTEXT.md`, `tmp-was-marx-right/learner-page.html`, `tmp-was-marx-right/assets/activity-a1-materials-entry.png`, `tmp-was-marx-right/assets/activity-a3-materials-table-pair-between.png`, `tmp-was-marx-right/assets/activity-a5-assessment-before-checkpoint.png`, `tmp-was-marx-right/assets/knowledge-summary-after-content.png` |
| **Why included** | T-020 Group A **delete**; no consumers |
| **Expected impact** | Root quieter; no product/test change |
| **Verification** | §5 matrix row A |
| **Rollback** | `git revert` of Slice A commit (restores blobs from history) |
| **Commit message** | `S74C hygiene: remove tracked root scratch dumps (slice A)` |
| **Diff characteristics** | Deletes only under `/` and `tmp-was-marx-right/`; no `lib/`, `app.js`, `tests/**/*.test.js` |
| **Risk** | **Low** |
| **Depends on** | None |
| **Browser / Node verification** | **Neither required** (docs/`git` checks only) |

**Exclude:** Any `tests/fixtures/**/*.txt` (must never match root scratch patterns).

---

### Slice D — Tracked `tools/_tmp_*` dumps

| Field | Content |
| ----- | ------- |
| **Purpose** | Remove tracked temporary dumps under `tools/` |
| **Files affected** | `tools/_tmp_hetero_utility.html`, `tools/_tmp_s59_analysis_out.txt` |
| **Optional local** | If present untracked: `tools/_tmp_edpsych_export/` — delete from working tree only (not a tracked commit unless empty dir tracked); do **not** commit new files |
| **Why included** | T-020 Group D **delete** |
| **Expected impact** | `tools/` cleaner; evaluate/live-capture scripts **retained** (Group F) |
| **Verification** | §5 row D |
| **Rollback** | `git revert` Slice D commit |
| **Commit message** | `S74C hygiene: remove tracked tools/_tmp dumps (slice D)` |
| **Diff characteristics** | Two file deletions under `tools/`; no Group F tools |
| **Risk** | **Low** |
| **Depends on** | Soft: after A (order only) |
| **Browser / Node** | **Neither required** |

---

### Slice G — `.gitignore` expansion

| Field | Content |
| ----- | ------- |
| **Purpose** | Prevent re-commit of scratch classes removed in A/D |
| **Files affected** | `.gitignore` **only** |
| **Planned additions** (exact text for T-040; do not apply in T-030) | Keep existing lines. Append a clearly commented block, e.g.: |

```gitignore
# S74C — prevent reintroduction of hygiene scratch (S74C-D02 / T-020 Group G)
/test*.txt
/tmp-*
/page - *.html
/NEXT-CHAT-CONTEXT.md
/tmp-was-marx-right/
tools/_tmp_*/
```

| Field | Content |
| ----- | ------- |
| **Why included** | T-020 Group G; durability after delete |
| **Pattern safety** | Leading `/` on root patterns so `tests/fixtures/**/*.txt` stay trackable; `tools/_tmp_*/` covers dumps + dirs without removing `tools/evaluate-*.js` |
| **Retain existing** | `.env.local`, `node_modules/`, `tools/_tmp_hetero_live_export/` (redundant with `tools/_tmp_*/` but harmless to keep) |
| **Expected impact** | Policy only; no file deletions in this commit |
| **Verification** | §5 row G |
| **Rollback** | `git revert` Slice G commit |
| **Commit message** | `S74C hygiene: expand .gitignore for scratch classes (slice G)` |
| **Diff characteristics** | Single-file edit to `.gitignore` |
| **Risk** | **Low** (wrong glob could ignore fixtures — verify with `git check-ignore -v tests/fixtures/dla/rna-hcv-dla-08-run-raw.txt` → must **not** match) |
| **Depends on** | After **A** and **D** |
| **Browser / Node** | **Neither required**; run `git check-ignore` checks |

**No renames** of tooling paths in 74C.

---

### Slice B — Compose-broken probes/tools

| Field | Content |
| ----- | ------- |
| **Purpose** | Remove tooling that calls or encodes removed compose APIs |
| **Files affected** | `scripts/probe-design-page-s57-audit-metrics.js`, `tools/capture-sprint-42-4-provenance.js`, `scripts/thin-design-page-pack-template.js` |
| **Why included** | T-020 Group B **delete** |
| **Expected impact** | No compose-broken callers remain among these three |
| **Verification** | §5 row B; grep for `applyLdDesignPageComposeContractToDraft` under `scripts/` and `tools/` should be empty **or** only Group F files if any remain (T-010 found these two call sites — both deleted here) |
| **Rollback** | `git revert` Slice B |
| **Commit message** | `S74C hygiene: remove compose-broken probes and pack template (slice B)` |
| **Diff characteristics** | Three deletions; no `lib/` / `app.js` |
| **Risk** | **Low** |
| **Depends on** | Soft: after G |
| **Browser / Node** | **Neither required** |

---

### Slice C — Remaining obsolete probe family / ancient scripts / mutator

| Field | Content |
| ----- | ------- |
| **Purpose** | Remove unreferenced sprint probes, ancient sprint scripts, and dangerous non-test mutator |
| **Files affected** | `scripts/probe-38b1-design-page-prompt-size.js`, `scripts/probe-38b1-ld-workflow-prompt-audit.js`, `scripts/probe-38b4-w3-inflation-gate.js`, `scripts/probe-dla-08-batch.js`, `scripts/probe-dla-08-copy-validation.js`, `scripts/probe-gam-2b-markers.mjs`, `scripts/probe-gam-s57-audit-metrics.js`, `scripts/probe-manual-dla-copy-stale-override.mjs`, `scripts/probe-pf11-sanitized-dla-copy.mjs`, `scripts/probe-w1-4-four-step-sum.js`, `scripts/probe-w1-4-rhetoric-sizes.js`, `scripts/sprint-16-e2e-html-smoke.js`, `scripts/sprint-19-ld-factory-validation.js`, `tests/_patch-icons.js` |
| **Why included** | T-020 Group C **delete**; excludes Slice B’s `probe-design-page-s57-…` |
| **Expected impact** | No `scripts/probe-*` remain; `_patch-icons.js` gone |
| **Verification** | §5 row C; `git ls-files 'scripts/probe-*'` empty; `tests/_patch-icons.js` absent; **all** `*.test.js` and fixtures untouched |
| **Rollback** | `git revert` Slice C |
| **Commit message** | `S74C hygiene: remove obsolete probe family and _patch-icons (slice C)` |
| **Diff characteristics** | Deletes under `scripts/` + one `tests/_patch-icons.js` only — **no** `tests/**/*.test.js` |
| **Risk** | **Low–Medium** (confirm no accidental staging of real tests) |
| **Depends on** | Soft: after B (non-overlap) |
| **Browser / Node** | **Node optional:** after commit, `node --test` on a **small** guardian subset is **optional** confidence only — not required by T-020 (no test files changed). Prefer **no** full suite unless operator requests. Default: **git/grep only**. |

---

### Slice E1 — `_archive` quarantine tree

| Field | Content |
| ----- | ------- |
| **Purpose** | Remove forensic quarantine copy; Git history is archive (S74C-D02) |
| **Files affected** | Entire tree `_archive/failed-investigation-2026-06-29/**` (12 tracked paths per `git ls-files`, including README, orphan tests, fixtures, draft sprint doc) |
| **Why included** | T-020 Group E **delete** for quarantine |
| **Expected impact** | `_archive/failed-investigation-2026-06-29/` gone; do **not** recreate under another archive path |
| **Verification** | §5 row E1; `archive/docs-legacy/**` still present |
| **Rollback** | `git revert` Slice E1 |
| **Commit message** | `S74C hygiene: remove failed-investigation quarantine tree (slice E1)` |
| **Diff characteristics** | Deletes only under `_archive/failed-investigation-2026-06-29/` |
| **Risk** | **Low** (README already forbids reuse) |
| **Depends on** | Soft: after C |
| **Browser / Node** | **Neither required** |

---

### Slice E2 — Loose `captures/sprint-41-impacts`

| Field | Content |
| ----- | ------- |
| **Purpose** | Remove loose historical captures outside sprint packs |
| **Files affected** | `captures/sprint-41-impacts/inflation-page-json.txt`, `captures/sprint-41-impacts/inflation-rendered-page.html` |
| **Why included** | T-020 Group E **delete** for captures |
| **Expected impact** | `captures/sprint-41-impacts/` gone; Sprint 41 pack under `docs/development/sprints/` **retained** |
| **Verification** | §5 row E2 |
| **Rollback** | `git revert` Slice E2 |
| **Commit message** | `S74C hygiene: remove loose sprint-41 captures shelf (slice E2)` |
| **Diff characteristics** | Two deletions under `captures/` |
| **Risk** | **Low** |
| **Depends on** | Soft: after E1 |
| **Browser / Node** | **Neither required** |

---

## 5. Verification matrix

| Slice | `git status` expectations | Grep / path expectations | Runtime? | Browser? | Tests? | Docs? | Clean state afterwards |
| ----- | ------------------------- | ------------------------ | -------- | -------- | ------ | ----- | ---------------------- |
| **A** | Only A paths deleted (or clean after commit); no `lib/`/`app.js` dirt | `git ls-files` root `test*.txt` / `tmp-*` / `page - *` / `NEXT-CHAT*` / `tmp-was-marx-right/*` → empty | No | No | No | Optional note in T-040 evidence | Root scratch gone |
| **D** | Only two `tools/_tmp_*` deletions | `git ls-files 'tools/_tmp_*'` → empty (ignore path `tools/_tmp_hetero_live_export/` may still exist locally ignored) | No | No | No | Optional | Tracked dumps gone |
| **G** | Only `.gitignore` modified | `git check-ignore -v tests/fixtures/dla/rna-hcv-dla-08-run-raw.txt` → **no match**; `git check-ignore -v test-out.txt` → **matches** (even if file absent) | No | No | No | Yes — patterns documented in commit | Scratch classes ignored |
| **B** | Three deletions | `rg applyLdDesignPageComposeContractToDraft scripts tools` → no matches in remaining files; `thin-design-page-pack-template.js` absent | No | No | No | Optional | Compose-broken trio gone |
| **C** | Listed script + `_patch-icons` deletions only | `git ls-files 'scripts/probe-*'` → empty; `Test-Path tests/_patch-icons.js` → false; `git ls-files 'tests/*.test.js'` count unchanged | No | No | Optional smoke only | Optional | Probe family + mutator gone |
| **E1** | Quarantine tree deletions | `_archive/failed-investigation-2026-06-29` absent; `archive/docs-legacy` present | No | No | No | Confirm no new `_archive/` shelf created | Quarantine gone |
| **E2** | Two capture deletions | `captures/sprint-41-impacts` absent; Sprint 41 pack path still present | No | No | No | Optional | Loose captures gone |

**After all slices (T-040 closeout):**

- Protected classes intact (spot-check `package.json` scripts; `artifacts/learner-renderer-vnext-certification.*`; `lib/learner-renderer-vnext-browser.js`; `archive/docs-legacy/`).  
- Group F paths still present.  
- No product behaviour claim required; **no** browser certification rerun mandated for hygiene-only deletes.  
- T-050 may optionally run a focused Node guardian sample if operator wants extra confidence — **not** a per-slice gate.

---

## 6. Estimated commit sequence (T-040)

| # | Slice | Recommended commit message |
| - | ----- | -------------------------- |
| 1 | A | `S74C hygiene: remove tracked root scratch dumps (slice A)` |
| 2 | D | `S74C hygiene: remove tracked tools/_tmp dumps (slice D)` |
| 3 | G | `S74C hygiene: expand .gitignore for scratch classes (slice G)` |
| 4 | B | `S74C hygiene: remove compose-broken probes and pack template (slice B)` |
| 5 | C | `S74C hygiene: remove obsolete probe family and _patch-icons (slice C)` |
| 6 | E1 | `S74C hygiene: remove failed-investigation quarantine tree (slice E1)` |
| 7 | E2 | `S74C hygiene: remove loose sprint-41 captures shelf (slice E2)` |

Optional 8th docs-only commit: T-040 evidence + STATUS updates (if not bundled with E2). Prefer **separate** docs commit after hygiene so revert of E2 does not drop evidence notes.

**Stop between slices** if unexpected paths appear staged (especially under `lib/`, `app.js`, `tests/**/*.test.js`, `tests/fixtures/`).

---

## 7. Out of scope / protected exclusions

### Group F — deferred tooling (no T-040 deletion)

Per T-020: evaluate CLIs, sprint live-capture/verification tools, Roman Roads / VEU / VideoTranscriptTest / IMP builders, phase-sanitize scripts, ad-hoc debug helpers — **defer** until consumer evidence. **Not** in slices A–G.

### Intentionally retained

- All **protected classes** (T-020 § Protected classes)  
- `archive/docs-legacy/**`  
- Sprint evidence under `docs/development/sprints/**`  
- npm-wired scripts and `scripts/audit-learner-surfaces.js`  
- Certification artefacts and generated browser artefact  

### Excluded from execution

- PB-S-001, WR orphans, PB-FA-004  
- Sprint 75  
- Product behaviour / prompt / validation / assemble / UI changes  
- Creating replacement archive shelves  
- Renames of tooling paths  
- Reconsideration of T-020 policy  

### Future investigation (not T-040)

- Group F retain/delete with consumer proof  
- Operator-local untracked `.tmp-*` trees (local hygiene only)

---

## 8. T-040 operator checklist (preview)

1. Confirm clean or intentionally staged docs-only tree before starting.  
2. Execute A → D → G → B → C → E1 → E2 with verification after each commit.  
3. Never `git add -A` blindly — stage explicit paths.  
4. If a slice would require touching a protected path → **STOP** and report (out of 74C).  
5. Do not begin Group F cleanup.

---

## 9. Validation (T-030)

| Check | Result |
| ----- | ------ |
| Runtime / test / fixture changes | **None** |
| Deletions / renames / moves | **None** |
| Planning only | **Yes** |
| T-040 begun | **No** |
| T-040 ready | **Yes** |

---

## Task closure

| Check | Result |
| ----- | ------ |
| Execution plan created | **Yes** — this file |
| Next task | **S74C-T-040** |
