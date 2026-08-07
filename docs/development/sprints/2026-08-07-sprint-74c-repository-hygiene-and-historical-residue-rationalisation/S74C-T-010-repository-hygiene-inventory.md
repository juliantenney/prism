# S74C-T-010 — Repository Hygiene Inventory

**Sprint:** 74C — Repository Hygiene & Historical Residue Rationalisation  
**Task:** S74C-T-010  
**Status:** **Done** (2026-08-07)  
**Mode:** Evidence-only inventory — **no deletions, renames, moves, or non-sprint-doc modifications**  
**Authority:** [SPRINT-74C-CHARTER.md](SPRINT-74C-CHARTER.md) · Historical Retention Principle · [PLAN.md](PLAN.md)  
**Next:** S74C-T-020 (retention / deletion **decisions** — not this document)

---

## 1. Executive summary

Repository hygiene residue is concentrated in **tracked scratch at repo root**, **quarantine/archive trees**, **compose-era probes/tools that call removed APIs**, and **one-shot diagnostic dumps under `tools/`**. Current product paths, focused test guardians/fixtures, certification artefacts, and authoritative sprint evidence packs have **current operational justification** and are protect/retain candidates.

Evidence highlights:

| Finding | Evidence |
| ------- | -------- |
| Root `test*.txt` / page dumps / `tmp-*` are **tracked** | `git ls-files`; sizes up to ~885 KB (`test-out.txt`); not covered by `.gitignore` |
| `.gitignore` only excludes `.env.local`, `node_modules/`, `tools/_tmp_hetero_live_export/` | `.gitignore` contents |
| Compose runtime API removed (74B) | `lib/ld-design-page-compose-contract.js` **absent** from tree and `HEAD`; `applyLdDesignPageComposeContractToDraft` **absent** from `app.js` |
| Probes/tools still call removed compose apply | `scripts/probe-design-page-s57-audit-metrics.js:150`; `tools/capture-sprint-42-4-provenance.js:164` |
| No `scripts/probe-*` in `package.json` scripts | `package.json` scripts: `dev`, `build:learner-renderer-vnext-browser`, `check:…`, `pretest:…`, `build:gam-…`, `build:learner-renderer-kitchen-sink-fixture` |
| `_archive/failed-investigation-2026-06-29` is explicit quarantine | `_archive/.../README.md` — forensic only; compose-era orphan tests |
| Certification artefacts are produced by current CLI | `scripts/certify-learner-renderer-vnext.js` writes `artifacts/` |
| Untracked working-tree noise at inventory time is mostly **74C pack docs** (in-scope documentation), not runtime residue | `git status -u --short` |

**This document records recommended dispositions only.** It does **not** decide or plan execution.

**Validation for T-010:** zero runtime / test / fixture changes; zero deletions / renames / moves outside Sprint documentation updates recording this inventory.

---

## 2. Inventory table

Columns: **path** · **category** · **purpose** · **consumer(s)** · **historical value** · **Git history preserves?** · **current operational justification** · **references/callers** · **confidence** · **recommended disposition** · **rationale**

Categories used only: `current / active` · `historical evidence` · `archive` · `probe/tooling` · `scratch` · `obsolete` · `unknown`.

### 2.1 Root scratch / dumps (tracked)

| Path | Category | Purpose | Consumer(s) | Historical value | Git history? | Operational justification | References/callers | Conf. | Disposition | Rationale |
| ---- | -------- | ------- | ----------- | ---------------- | ------------ | ------------------------- | ------------------ | ----- | ----------- | --------- |
| `test-out.txt` (~885 KB) | scratch | Captured Node test / HTML dump output | None found in `tests/` / `package.json` | Low — accidental commit of run output | Yes (once deleted, history retains) | **None** — not a fixture or guardian | Content begins with test pass lines + full exported HTML | High | **delete** | Tracked scratch; Git history is sufficient archive |
| `test-compose.txt` (~267 KB) | scratch | Same class as above | None found | Low | Yes | None | Tracked; root dump | High | **delete** | Same |
| `test2.txt` … `test6.txt` | scratch | Same class; `test2.txt` added in `804b489` (74B docs close) | None found | Low | Yes | None | `git log` tip for `test2.txt` | High | **delete** | Accidental tracking of local probe output |
| `tmp-ifp-dump.txt` (0 B) | scratch | Empty IFP dump placeholder | None found | None | Yes | None | Empty file tracked | High | **delete** | Empty scratch |
| `tmp-owen-a1-boundary-diagnostics.json` | scratch | Owen A1 boundary diagnostics dump | None found in tests as path consumer | Low (Sprint 72 era diagnostic) | Yes | None as live artefact | Root dump; fixtures live under `tests/fixtures/` | High | **delete** | Diagnostic dump; fixtures already cover regression |
| `tmp-owen-a1-rerender.html` | scratch | Rerender HTML dump | None found | Low | Yes | None | Root dump | High | **delete** | Same |
| `page - 2026-08-05T100251.html` | scratch | Dated learner-page HTML dump | None found | Low | Yes (`de62802` add) | None | Filename pattern = export dump | High | **delete** | Tracked export dump |
| `page - 2026-08-05T100456.html` | scratch | Dated learner-page HTML dump | None found | Low | Yes | None | Same | High | **delete** | Same |
| `tmp-was-marx-right/` (`learner-page.html` + 4 PNGs) | scratch | Local Marx-right export package dump | None found in tests/package.json | Low — local verification residue | Yes | None | Entire tree tracked under `tmp-was-marx-right/` | High | **delete** | Scratch export tree; not a fixture path |
| `NEXT-CHAT-CONTEXT.md` | obsolete | Stale root “resume here” pointer (last updated 2026-06-03; Sprint 38-B) | Humans only; superseded by per-sprint `next-chat-briefing.md` / START-HERE | Historical pointer only | Yes | **None** — misleading if treated as current | Points at Sprint 38-B / deferred 39 paths | High | **delete** | Obsolete root briefing; sprint packs own handover |

### 2.2 Archive / quarantine trees

| Path | Category | Purpose | Consumer(s) | Historical value | Git history? | Operational justification | References/callers | Conf. | Disposition | Rationale |
| ---- | -------- | ------- | ----------- | ---------------- | ------------ | ------------------------- | ------------------ | ----- | ----------- | --------- |
| `_archive/failed-investigation-2026-06-29/` | archive | Quarantined failed 2026-06-29 Design Page fidelity investigation (Sprint 53 bootstrap) | **None** — README: do not use without re-verification; APIs cited do not exist | Forensic narrative of failed investigation | Yes (and README names baseline `04c9e81`) | **Weak** — active tree duplicates what Git + README already explain | `_archive/.../README.md`; orphan compose-era tests/fixtures inside | High | **delete** *(or archive→delete after T-020 policy)* | Historical Retention Principle: Git history is default archive; quarantine copy lacks current consumer |
| `archive/docs-legacy/concept-notes/prism_readme.txt` | archive | Legacy concept note | Doc references only | Low–medium conceptual history | Yes | Unclear for day-to-day engineering | Cited from `docs/architecture/decisions.md` and a sprint-01 decisions copy | Medium | **defer** | Need T-020 policy: keep thin legacy examples vs delete with doc-link updates |
| `archive/docs-legacy/examples/workflow-example-*.json` | archive | Legacy workflow example JSON | Same doc surface | Medium as examples | Yes | Unclear | Same | Medium | **defer** | Same — may still be intentional legacy examples |

### 2.3 Certification / generated artefacts (inspected)

| Path | Category | Purpose | Consumer(s) | Historical value | Git history? | Operational justification | References/callers | Conf. | Disposition | Rationale |
| ---- | -------- | ------- | ----------- | ---------------- | ------------ | ------------------------- | ------------------ | ----- | ----------- | --------- |
| `artifacts/learner-renderer-vnext-certification.json` | current / active | Latest vNext certification report (JSON) | Operators / CI-style local certify runs; programme evidence | Snapshot of last certify | Yes (regenerated content also history) | **Yes** — certify CLI default output | `scripts/certify-learner-renderer-vnext.js` (`artifactsDir` default) | High | **retain** | Current operational certification artefact (protect list) |
| `artifacts/learner-renderer-vnext-certification.md` | current / active | Same, markdown | Same | Same | Yes | **Yes** | Same | High | **retain** | Same |
| `lib/learner-renderer-vnext-browser.js` | current / active | Built browser bundle for learner renderer vNext | Runtime / export path; `check:` / `build:` npm scripts | N/A (generated current) | Yes | **Yes** — product build output checked into tree by convention | `package.json` `build:learner-renderer-vnext-browser` / `check:…` | High | **retain** | Frequently regenerated but **currently required** operational artefact |

### 2.4 Captures outside sprint packs

| Path | Category | Purpose | Consumer(s) | Historical value | Git history? | Operational justification | References/callers | Conf. | Disposition | Rationale |
| ---- | -------- | ------- | ----------- | ---------------- | ------------ | ------------------------- | ------------------ | ----- | ----------- | --------- |
| `captures/sprint-41-impacts/inflation-page-json.txt` | historical evidence | Sprint 41 impact capture (page JSON text) | No `tests/` / `package.json` path consumer found | Medium — contemporaneous capture | Yes | **None** as live fixture (fixtures live under `tests/fixtures/`) | Tracked under `captures/` | Medium | **archive** → prefer **delete** if T-020 treats Git+sprint pack as enough | Outside authoritative sprint evidence pack; duplicate class of evidence |
| `captures/sprint-41-impacts/inflation-rendered-page.html` | historical evidence | Sprint 41 rendered HTML capture | Same | Medium | Yes | None | Same | Medium | **archive** → prefer **delete** (same caveat) | Same |

### 2.5 `scripts/probe-*` and related obsolete probes

| Path | Category | Purpose | Consumer(s) | Historical value | Git history? | Operational justification | References/callers | Conf. | Disposition | Rationale |
| ---- | -------- | ------- | ----------- | ---------------- | ------------ | ------------------------- | ------------------ | ----- | ----------- | --------- |
| `scripts/probe-design-page-s57-audit-metrics.js` | obsolete | S57 Design Page audit metrics probe | None in package.json/tests | Documents compose-era metrics workflow | Yes | **None** — calls removed `applyLdDesignPageComposeContractToDraft` | Self; line ~150 compose apply | High | **delete** | Broken against post-74B surface |
| `scripts/probe-38b1-ld-workflow-prompt-audit.js` | probe/tooling | Sprint 38-B1 LD workflow prompt audit | Called by `probe-w1-4-four-step-sum.js` only | Sprint 38-B audit | Yes | None in npm scripts | Header “Run: node scripts/…”; peer probes | Medium–High | **delete** | One-shot sprint probe; no current package consumer |
| `scripts/probe-38b1-design-page-prompt-size.js` | probe/tooling | Design Page prompt size probe | None beyond peer probes | Same | Yes | None | Same | Medium–High | **delete** | Same |
| `scripts/probe-38b4-w3-inflation-gate.js` | probe/tooling | 38-B4 W3 inflation gate | None | Same | Yes | None | Same | Medium–High | **delete** | Same |
| `scripts/probe-w1-4-four-step-sum.js` | probe/tooling | Aggregates 38b1 probe | None outside probe family | Same | Yes | None | `execSync` → `probe-38b1-ld-workflow-prompt-audit.js` | Medium–High | **delete** | Depends on obsolete probe family |
| `scripts/probe-w1-4-rhetoric-sizes.js` | probe/tooling | Rhetoric size probe | None | Same | Yes | None | Probe family | Medium | **delete** | Same class |
| `scripts/probe-gam-s57-audit-metrics.js` | probe/tooling | GAM S57 audit metrics | None | S57 | Yes | None | Header run instructions only | Medium | **delete** | Not in package.json; sprint-era |
| `scripts/probe-dla-08-batch.js` | probe/tooling | DLA-08 batch probe | None | DLA-08 experiment | Yes | None | Header run instructions | Medium | **delete** | Same |
| `scripts/probe-dla-08-copy-validation.js` | probe/tooling | DLA-08 copy validation | None | Same | Yes | None | Same | Medium | **delete** | Same |
| `scripts/probe-gam-2b-markers.mjs` | probe/tooling | GAM 2b markers probe | None found | Phase sanitize era | Yes | None | Scripts only | Medium | **delete** | Same |
| `scripts/probe-manual-dla-copy-stale-override.mjs` | probe/tooling | Manual DLA copy override probe | None found | Same | Yes | None | Scripts only | Medium | **delete** | Same |
| `scripts/probe-pf11-sanitized-dla-copy.mjs` | probe/tooling | PF11 sanitized DLA copy probe | None found | Same | Yes | None | Scripts only | Medium | **delete** | Same |
| `scripts/thin-design-page-pack-template.js` | obsolete | Thin Design Page pack template text | None found in tests/package.json | Documents compose-era pack wording | Yes | **None** — still embeds `LD-DESIGN-PAGE-COMPOSE-CONTRACT` obligations | File content cites compose contract as runtime authority | High | **delete** | Obsolete compose-era template after 74B |

### 2.6 `tools/*`

| Path | Category | Purpose | Consumer(s) | Historical value | Git history? | Operational justification | References/callers | Conf. | Disposition | Rationale |
| ---- | -------- | ------- | ----------- | ---------------- | ------------ | ------------------------- | ------------------ | ----- | ----------- | --------- |
| `tools/capture-sprint-42-4-provenance.js` | obsolete | Sprint 42-4 provenance capture | None in package.json/tests | Sprint 42 capture tooling | Yes | **None** — calls removed compose apply | ~164 `applyLdDesignPageComposeContractToDraft` | High | **delete** | Broken post-74B |
| `tools/sprint-42-4-live-capture.mjs` | probe/tooling | Sprint 42-4 live capture | None found in package.json/tests | Sprint 42 | Yes | None evidenced | Tracked tooling | Medium | **defer** | Confirm no operator runbook dependency in T-020 |
| `tools/sprint-50-marx-verification-run.mjs` | probe/tooling | Sprint 50 Marx verification | None found in package.json/tests | Sprint 50 | Yes | None evidenced | Tracked tooling | Medium | **defer** | Same |
| `tools/evaluate-educational-quality-framework.js` | probe/tooling | EQF diagnostic CLI (Sprint 41 Slice 4); evaluates saved artefacts only | Manual / docs; evaluator lib still exists | Medium | Yes | Optional diagnostic — **not** npm script | Header: no workflow/runtime integration; uses `lib/educational-quality-framework-evaluator.js` | Medium | **defer** | Useful offline diagnostic vs residue — T-020 |
| `tools/evaluate-sprint41-benchmarks.js` | probe/tooling | Sprint 41 benchmarks CLI | Manual | Medium | Yes | Optional | Tracked | Medium | **defer** | Same |
| `tools/_tmp_hetero_utility.html` (0 B) | scratch | Empty temp HTML | None | None | Yes | None | Tracked empty | High | **delete** | Scratch |
| `tools/_tmp_s59_analysis_out.txt` (~46 KB) | scratch | S59 analysis output dump | None | Low | Yes | None | Tracked dump | High | **delete** | Scratch log |
| `tools/_tmp_edpsych_export/` | scratch | Local export dir (gitignored sibling class; live export path ignored separately) | Local only | None for repo | N/A if untracked | None | Directory present locally; `.gitignore` has `tools/_tmp_hetero_live_export/` not this name | Medium | **delete** *(local)* / **rename** ignore rule in T-030 if kept pattern | Residue directory; align ignore naming in later task |

### 2.7 Other `scripts/` — active vs ambiguous

| Path | Category | Purpose | Consumer(s) | Historical value | Git history? | Operational justification | References/callers | Conf. | Disposition | Rationale |
| ---- | -------- | ------- | ----------- | ---------------- | ------------ | ------------------------- | ------------------ | ----- | ----------- | --------- |
| `scripts/dev-server.js` | current / active | Local dev server | `npm run dev` | N/A | Yes | **Yes** | `package.json` `dev` | High | **retain** | Active |
| `scripts/build-learner-renderer-vnext-browser.js` | current / active | Build browser artefact | npm build / pretest | N/A | Yes | **Yes** | `package.json` | High | **retain** | Active |
| `scripts/check-learner-renderer-vnext-browser.js` | current / active | Check built artefact | npm check / pretest | N/A | Yes | **Yes** | `package.json` | High | **retain** | Active |
| `scripts/build-gam-renderer-type-inventory.js` | current / active | Build GAM type inventory | `npm run build:gam-renderer-type-inventory` | Supports Sprint 68+ inventories | Yes | **Yes** | `package.json` | High | **retain** | Active |
| `scripts/build-learner-renderer-kitchen-sink-fixture.js` | current / active | Kitchen-sink fixture builder | npm script | N/A | Yes | **Yes** | `package.json` | High | **retain** | Active |
| `scripts/certify-learner-renderer-vnext.js` | current / active | Production certification CLI | Operators; writes `artifacts/` | N/A | Yes | **Yes** | Script header S68-IMP-020 | High | **retain** | Active |
| `scripts/audit-learner-surfaces.js` | current / active | Learner surface audit helper | Tests (IMP-016 family and related) | N/A | Yes | **Yes** | Referenced from `tests/learner-renderer-vnext-audit-surfaces-imp016.test.js` (and related) | High | **retain** | Active test support |
| `scripts/build-roman-roads-association-fixture.js` (+ `verify-roman-roads-*.js`, `trace-roman-roads-composition.js`) | current / active *or* probe | Roman roads fixture/verification helpers | Likely Sprint 70 regression support | Medium | Yes | Likely yes via fixture/regression workflow | Present under `scripts/`; fixtures under `tests/fixtures/` | Medium | **defer** | Confirm wiring in T-020 before delete |
| `scripts/build-videotranscripttest-authoritative-fixture.js` (+ assemble/capture-imp-014*) | probe/tooling | Videotranscripttest fixture pipeline | Fixture maintainers | Medium | Yes | Unclear frequency | Scripts + fixtures | Medium | **defer** | Fixture builders vs one-shots |
| `scripts/capture-imp-013-generic-moments-artefacts.js` / `capture-imp-014a-rna-table-artefacts.js` | probe/tooling | IMP artefact capture | Manual | Medium | Yes | Unclear | Scripts only | Medium | **defer** | Same |
| `scripts/apply-phase-*.mjs` / `phase-2a-dla-sanitize.mjs` / `refresh-wave-a-metrics.mjs` / `audit-gam-phase-2b-readonly.mjs` | probe/tooling | Historical phase sanitize / metrics | None in package.json | High for sprint forensics | Yes | **None** evidenced as current CI | Not in `package.json` | Medium | **defer** | May mutate content if run — treat carefully in T-020 |
| `scripts/dump-dla-prompt-surface.mjs` | probe/tooling | Dump DLA prompt surface | Manual | Medium | Yes | Optional debug | None in tests require | Medium | **defer** | Debug utility |
| `scripts/debug-peer-cognition.js` | probe/tooling | Peer cognition debug | Manual | Low–medium | Yes | Optional | None found | Medium | **defer** | Debug |
| `scripts/inspect-ifp.mjs` | probe/tooling | IFP inspector | Manual | Medium | Yes | Optional | None found | Medium | **defer** | Debug |
| `scripts/analyze-export-html.js` | probe/tooling | Export HTML analyser | Manual | Medium | Yes | Optional | None found requiring it | Medium | **defer** | Debug |
| `scripts/check-dla-patterns.mjs` | probe/tooling | DLA pattern check | Manual | Medium | Yes | Optional | None in package.json | Medium | **defer** | Possibly still useful lint-like |
| `scripts/count-material-occurrences.js` | probe/tooling | Material occurrence counter | Manual | Low | Yes | Optional | None found | Medium | **defer** | Ad-hoc |
| `scripts/report-episode-plan-grammar-parity.js` | probe/tooling | Episode plan grammar parity report | Manual | Medium | Yes | Optional | None found | Medium | **defer** | Ad-hoc |
| `scripts/sprint-16-e2e-html-smoke.js` | obsolete | Sprint 16 HTML smoke | None found | Historical | Yes | None | Sprint-numbered script | Medium–High | **delete** | Ancient one-shot |
| `scripts/sprint-19-ld-factory-validation.js` | obsolete | Sprint 19 LD factory validation | None found | Historical | Yes | None | Sprint-numbered script | Medium–High | **delete** | Ancient one-shot |
| `scripts/write-heteroscedasticity-vnext-va-export.js` | probe/tooling | Hetero vNext VA export writer | Manual | Medium | Yes | Unclear | None found in tests require | Medium | **defer** | May still support local export recipes |
| `scripts/build-veu-v121-json.js` | probe/tooling | VEU v121 JSON builder | Likely Sprint 38 VEU tests/fixtures | Medium | Yes | Unclear | Related tests exist (`sprint-38-veu-v121.test.js`) | Medium | **defer** | Confirm fixture regeneration path |

### 2.8 Obsolete / dangerous test helper

| Path | Category | Purpose | Consumer(s) | Historical value | Git history? | Operational justification | References/callers | Conf. | Disposition | Rationale |
| ---- | -------- | ------- | ----------- | ---------------- | ------------ | ------------------------- | ------------------ | ----- | ----------- | --------- |
| `tests/_patch-icons.js` | obsolete | One-shot mutator that rewrites `app.js` icon/template HTML strings | **None** in `package.json` / no test require found | Records a past icon patch attempt | Yes | **None** — unsafe as accidental `node tests/_patch-icons.js` | Standalone script under `tests/` | High | **delete** | Not a test; mutates product source |

### 2.9 Protect / retain classes inspected (not residue)

These were inspected because the task requires confirming certification, sprint evidence, fixtures, and active surfaces. They are **not** deletion candidates.

| Path / class | Category | Purpose | Consumer(s) | Historical value | Git history? | Operational justification | Conf. | Disposition | Rationale |
| ------------ | -------- | ------- | ----------- | ---------------- | ------------ | ------------------------- | ----- | ----------- | --------- |
| `app.js`, `index.html`, `lib/**` (current modules), `domains/**`, `utilities/**` | current / active | Product runtime | Browser app / workflows | N/A | Yes | **Yes** | High | **retain** | Product |
| `tests/**/*.test.js`, `tests/fixtures/**`, `tests/prism-vm-lib-bootstrap.js` (excl. `_patch-icons.js`) | current / active | Guardians + fixtures | `node --test` / CI-local | Also historical regression memory | Yes | **Yes** | High | **retain** | Protect guardians/fixtures |
| `docs/development/sprints/**` evidence packs (incl. 74A/74B/74C, Sprint 41 `context-files/` frozen copies) | historical evidence | Authoritative sprint evidence & frozen context snapshots | Humans / audits | **High** | Yes | **Yes** — charter protect list | High | **retain** | Do not treat as scratch; frozen compose copy under Sprint 41 `context-files/` is **pack evidence**, not live `lib/` |
| `docs/development/sprints/.../artefacts/gam-*.json` (e.g. Sprint 68) | historical evidence / current regen target | Inventory maps produced by build script | Programme evidence; may be refreshed by `build:gam-renderer-type-inventory` | High | Yes | Yes within sprint evidence + regen script | High | **retain** | Sprint artefacts; regen is operational |
| `.env.local` | current / active (local secret) | Local env | Runtime config | N/A | **Ignored** | Yes locally; must stay untracked | High | **retain** | Already gitignored — correct |
| `node_modules/` | current / active | Dependencies | Tooling | N/A | Ignored | Yes | High | **retain** | Ignored correctly |
| `.gitignore` | current / active | Ignore rules | Git | N/A | Yes | Yes — but **incomplete** vs root scratch pattern | High | **retain** *(consider expand in T-030)* | Hygiene gap: root dumps not ignored (caused tracking) |

### 2.10 Untracked / working-tree observations (inventory time)

| Path | Category | Purpose | Consumer(s) | Historical value | Git history? | Operational justification | Conf. | Disposition | Rationale |
| ---- | -------- | ------- | ----------- | ---------------- | ------------ | ------------------------- | ----- | ----------- | --------- |
| `docs/development/sprints/2026-08-07-sprint-74c-.../*` (untracked pack) | current / active | Sprint 74C documentation | 74C programme | N/A | Pending commit | **Yes** | High | **retain** | In-scope sprint docs — not residue |
| Wrapper / parent STATUS·PLAN·HANDOVER dirty docs | current / active | Programme tracking | Humans | N/A | Pending | Yes | High | **retain** | Programme docs |
| `.tmp-s74b-t040-final/` | scratch | Previously observed untracked staging tree (conversation/git_status snapshot) | None | Low | If never committed, only local | None | Low | **delete** if present locally | **Not present on disk at inventory completion** (`Test-Path` false); record as discovered class |

---

## 3. Category summary

| Category | Approx. inventory weight | Typical recommended disposition |
| -------- | ------------------------ | -------------------------------- |
| **scratch** | Root `test*` / `tmp-*` / page dumps; `tools/_tmp_*`; absent `.tmp-*` class | **delete** (Git history preserves) |
| **obsolete** | Compose-calling probes/tools; thin compose pack template; stale `NEXT-CHAT-CONTEXT.md`; `tests/_patch-icons.js`; ancient sprint-16/19 scripts | **delete** |
| **probe/tooling** | Remaining `scripts/probe-*`; many non-npm `scripts/*` diagnostics; some `tools/*` | Mix **delete** (clear) / **defer** (needs T-020 consumer check) |
| **archive** | `_archive/failed-investigation-…`; `archive/docs-legacy/…` | Quarantine tree → **delete** preferred; docs-legacy → **defer** |
| **historical evidence** | `captures/sprint-41-impacts/*`; sprint pack context-files & artefacts | Packs **retain**; loose `captures/` → **archive/delete** |
| **current / active** | Product, tests/fixtures, certify artefacts, npm-wired scripts, 74C docs | **retain** |
| **unknown** | (folded into **defer** rows where evidence incomplete) | **defer** to T-020 investigation |

---

## 4. Candidate retain list

- Product surfaces: `app.js`, `index.html`, `lib/**` (current), `domains/**`, `utilities/**`
- Test guardians + fixtures + `tests/prism-vm-lib-bootstrap.js` (exclude `_patch-icons.js`)
- `artifacts/learner-renderer-vnext-certification.{json,md}`
- `lib/learner-renderer-vnext-browser.js`
- npm-wired scripts: `dev-server`, `build/check-learner-renderer-vnext-browser`, `build-gam-renderer-type-inventory`, `build-learner-renderer-kitchen-sink-fixture`, `certify-learner-renderer-vnext`, plus `audit-learner-surfaces.js` (test-referenced)
- Authoritative `docs/development/sprints/**` evidence packs (including frozen Sprint 41 `context-files/`)
- Sprint 68+ `artefacts/gam-*.json` (and regen script path)
- `.env.local` / `node_modules/` ignore posture; `.gitignore` itself
- Sprint 74C documentation pack

---

## 5. Candidate archive list

| Item | Note |
| ---- | ---- |
| `captures/sprint-41-impacts/*` | Prefer Git + Sprint 41 pack over a second live capture tree; “archive” only if T-020 requires a visible non-Git shelf |
| `_archive/failed-investigation-2026-06-29/` | Already labelled archive/quarantine; Historical Retention Principle prefers **removing the live copy** after decision (history remains) |
| `archive/docs-legacy/**` | Only if T-020 keeps a curated legacy examples shelf; otherwise delete or leave with explicit retain |

**Recommendation signal:** do **not** create new archive copies of scratch; Git history is the default archive.

---

## 6. Candidate deletion list

**High confidence (evidence of no consumer + scratch/obsolete/broken):**

- `test-out.txt`, `test-compose.txt`, `test2.txt`–`test6.txt`
- `tmp-ifp-dump.txt`, `tmp-owen-a1-boundary-diagnostics.json`, `tmp-owen-a1-rerender.html`
- `page - 2026-08-05T100251.html`, `page - 2026-08-05T100456.html`
- `tmp-was-marx-right/**`
- `NEXT-CHAT-CONTEXT.md`
- `tools/_tmp_hetero_utility.html`, `tools/_tmp_s59_analysis_out.txt`
- `tools/capture-sprint-42-4-provenance.js` (removed compose API)
- `scripts/probe-design-page-s57-audit-metrics.js` (removed compose API)
- `scripts/thin-design-page-pack-template.js`
- `tests/_patch-icons.js`
- Full `scripts/probe-*` family listed in §2.5 (no package.json consumers)
- `scripts/sprint-16-e2e-html-smoke.js`, `scripts/sprint-19-ld-factory-validation.js`
- `_archive/failed-investigation-2026-06-29/**` (after T-020 confirms Git-history-as-archive policy)

**Medium confidence (delete after short T-020 confirm):**

- `captures/sprint-41-impacts/**`
- Local `tools/_tmp_edpsych_export/` if still present

---

## 7. Unknowns requiring investigation (T-020)

1. **`archive/docs-legacy/**`** — are architecture decision links normative enough to require retain, or can links be updated and files deleted?
2. **Non-npm `scripts/*` fixture builders** (Roman roads, videotranscripttest, VEU v121, IMP captures) — still used for fixture regeneration?
3. **`tools/evaluate-*.js` / `tools/sprint-*-*.mjs`** — any operator runbooks outside repo grep surface?
4. **Phase sanitize / metrics scripts** (`apply-phase-*.mjs`, etc.) — historical only, or still used for controlled content surgery?
5. **Ignore-policy gap** — should `.gitignore` gain `test*.txt`, `tmp-*`, `page - *.html`, `tools/_tmp_*` patterns so scratch cannot be re-committed? (policy/decision; not executed here)
6. **Rename candidates** — none evidenced as *required* renames; only ignore-path naming inconsistency (`_tmp_edpsych_export` vs `_tmp_hetero_live_export`). Disposition **rename** reserved for T-020 if standardising `_tmp_` ignore globs.
7. Confirm no remaining untracked `.tmp-*` / dump trees on operator machines beyond this clone.

---

## 8. Risks

| Risk | Detail |
| ---- | ------ |
| Accidental deletion of sprint evidence | Mitigate by protecting `docs/development/sprints/**` packs and certification artefacts |
| Deleting a still-used fixture builder | Medium-confidence script rows must stay **defer** until T-020 consumer proof |
| Removing `_archive/` before operators finish forensic reads | Low probability; README already forbids reuse; Git history remains |
| Broken probes left in tree | Confusion cost — operators may run compose-calling tools and misread failures as product regressions |
| Incomplete `.gitignore` | Scratch will be re-added (already happened with `test2.txt` in 74B docs commit) |
| Scope creep into product rationalisation | Anything needing product-behaviour reasoning to remove must **defer/unknown** and leave 74C (charter) |

---

## 9. Recommended priorities for T-020

1. **Decide Git-history-as-archive policy application** to `_archive/failed-investigation-2026-06-29/` and loose `captures/` (charter principle → expect delete-active-copy).
2. **Approve bulk deletion class A:** root tracked scratch + `tools/_tmp_*` dumps + stale `NEXT-CHAT-CONTEXT.md`.
3. **Approve bulk deletion class B:** compose-broken tools/probes + entire unreferenced `scripts/probe-*` family + `thin-design-page-pack-template.js` + `tests/_patch-icons.js`.
4. **Resolve defer set** for evaluate/live-capture tools and non-npm fixture builders (retain vs delete).
5. **Resolve `archive/docs-legacy`** retain vs delete (+ doc link updates if delete).
6. **Decide `.gitignore` expansion** so T-030/T-040 do not fight reintroduction of scratch.
7. **Explicit protect list freeze** for T-030: certification artefacts, fixtures/guardians, npm-wired scripts, sprint packs, generated browser artefact.
8. **Do not** open deletion execution (T-040) or Sprint 75; T-030 remains planning after decisions.

---

## Evidence index (inspection performed)

| Area | Method |
| ---- | ------ |
| Root scratch | `git ls-files`; file sizes; content head of dumps; `git log` tips |
| `_archive/` / `archive/` | README; `git ls-files`; doc references via search |
| `artifacts/` | Tracked pair; certify script default `--out artifacts` |
| `captures/` | `git ls-files captures/` |
| `scripts/probe-*` | Directory listing; headers; compose API call sites; no package.json entries |
| `tools/*` | Directory listing; compose call in capture script; empty `_tmp_` file; gitignore |
| Obsolete test helper | `tests/_patch-icons.js` read; no package/test require |
| Compose removal confirmation | File missing on disk; missing in `HEAD`; no `applyLdDesignPageComposeContractToDraft` in `app.js` |
| Active scripts | `package.json` scripts keys; test references to `audit-learner-surfaces.js` |
| Untracked | `git status -u --short` at inventory time |
| `.gitignore` | Full file read |

---

## Task closure

| Check | Result |
| ----- | ------ |
| Inventory deliverable created | **Yes** — this file |
| Decisions created | **No** (T-020) |
| Deletion plan created | **No** (T-030) |
| Runtime / test / fixture changes | **None** |
| Deletions / renames / moves | **None** |
| Next task | **S74C-T-020** |
