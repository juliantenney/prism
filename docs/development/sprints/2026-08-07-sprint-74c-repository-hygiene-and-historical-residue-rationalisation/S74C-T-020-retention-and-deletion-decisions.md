# S74C-T-020 — Retention and Deletion Decisions

**Sprint:** 74C — Repository Hygiene & Historical Residue Rationalisation  
**Task:** S74C-T-020  
**Status:** **Done** (2026-08-07)  
**Mode:** Decisions only — **no deletions, renames, moves, runtime/test/fixture/tooling changes**  
**Authority:** [S74C-T-010-repository-hygiene-inventory.md](S74C-T-010-repository-hygiene-inventory.md) *(authoritative evidence)* · [SPRINT-74C-CHARTER.md](SPRINT-74C-CHARTER.md) (Historical Retention Principle) · [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality) · [S74-D09](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d09--pre-release-compatibility-is-not-a-default-requirement) · [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  
**Formal policy decision:** [S74C-D02](decisions.md#s74c-d02--git-history-is-the-default-archive-active-copies-need-current-operational-justification)  
**Next:** S74C-T-030 (execution **plan** only — not this document)

---

## Governing criteria (applied to every group)

| Criterion | Application |
| --------- | ----------- |
| **Current operational value** | Sole retention test: does the active copy serve today's product or engineering process? |
| **Historical Retention Principle** | Git history is the default archive; active copies need current operational justification |
| **S74-D07** | One definitive codebase; remove plausible-but-wrong / obsolete alternatives when evidence supports |
| **S74-D09** | Pre-release historical existence is not a compatibility or retention requirement |
| **Engineering Disciplines** | “Repository history is the archive”; removal follows evidence; do not retain obsolete active material solely for reference |
| **Age** | **Not** a reason to retain or delete |

**Question every retain must answer:** *Why should this remain in the active repository today?*

No second inventory was performed. T-010 evidence is authoritative unless noted as insufficient → **defer**.

---

## Group A — Tracked root scratch

### Evidence summary (T-010 §2.1)

Tracked root dumps with **no** `tests/` / `package.json` consumers: `test-out.txt`, `test-compose.txt`, `test2.txt`–`test6.txt`, `tmp-ifp-dump.txt`, `tmp-owen-a1-*`, dated `page - 2026-08-05*.html`, `tmp-was-marx-right/**`, stale `NEXT-CHAT-CONTEXT.md`. Not covered by `.gitignore`. Git history already preserves commits that introduced them.

### Governing principle

Scratch and superseded root briefings have **no** current operational justification. Git history archives them (HRP; Engineering Disciplines).

### Decision

| Item | Decision |
| ---- | -------- |
| All Group A paths listed in T-010 §2.1 | **delete** |

### Rationale

None of these paths support active tooling, fixtures, certification, sprint evidence packs, or maintenance. Retention would only preserve accident/noise. Stale `NEXT-CHAT-CONTEXT.md` actively misleads (points at Sprint 38-B).

### Confidence

**High**

### Implementation impact

Hygiene-only file removals at repo root / `tmp-was-marx-right/`. No product behaviour change.

### T-030 execution?

**Yes** — include as **Slice A** (safe bulk deletion).

---

## Group B — Broken compose-era probes / tools

### Evidence summary (T-010 §2.5–2.6)

Post-74B: `applyLdDesignPageComposeContractToDraft` and `lib/ld-design-page-compose-contract.js` are gone. Callers remain:

- `scripts/probe-design-page-s57-audit-metrics.js`
- `tools/capture-sprint-42-4-provenance.js`
- `scripts/thin-design-page-pack-template.js` (still cites `LD-DESIGN-PAGE-COMPOSE-CONTRACT` as runtime authority)

### Governing principle

S74-D07 / AC-09: dead compose-era tooling must not masquerade as current. No operational value once the API is removed.

### Decision

| Item | Decision |
| ---- | -------- |
| Compose-calling probes/tools above | **delete** |
| `scripts/thin-design-page-pack-template.js` | **delete** |

### Rationale

They cannot run successfully against the definitive post-74B surface. Keeping them creates false “current tool” ambiguity for operators and agents.

### Confidence

**High**

### Implementation impact

Delete obsolete scripts/tools only. No runtime/lib changes (compose already removed in 74B).

### T-030 execution?

**Yes** — **Slice B**.

---

## Group C — Sprint probe families / ancient one-shots / dangerous helper

### Evidence summary (T-010 §2.5, §2.7–2.8)

- Entire `scripts/probe-*` family: **not** in `package.json`; consumers only peer probes (e.g. `probe-w1-4-four-step-sum` → `probe-38b1-…`).
- `scripts/sprint-16-e2e-html-smoke.js`, `scripts/sprint-19-ld-factory-validation.js`: no consumers found.
- `tests/_patch-icons.js`: not a test; mutates `app.js`; no package/test require.

### Governing principle

One-shot sprint diagnostics without current npm/test wiring have no operational justification (HRP; S74-D09). Dangerous non-test mutators under `tests/` fail Engineering Disciplines residue accounting.

### Decision

| Item | Decision |
| ---- | -------- |
| All `scripts/probe-*` listed in T-010 §2.5 | **delete** |
| `scripts/sprint-16-e2e-html-smoke.js` | **delete** |
| `scripts/sprint-19-ld-factory-validation.js` | **delete** |
| `tests/_patch-icons.js` | **delete** |

### Rationale

No current operational consumer. Probe families are historical sprint instrumentation preserved adequately in Git. `_patch-icons.js` is a hazard if run accidentally.

### Confidence

**High** for compose-adjacent and `_patch-icons`; **Medium–High** for remaining `probe-*` and sprint-16/19 (inventory found no consumers; age not used as criterion — absence of operational wiring is).

### Implementation impact

Script/helper deletion only. Must **not** touch real `*.test.js` guardians or fixtures.

### T-030 execution?

**Yes** — **Slice C** (may merge with Slice B as one “obsolete scripts” slice if T-030 prefers).

---

## Group D — Temporary tooling dumps (`tools/_tmp_*`)

### Evidence summary (T-010 §2.6)

- `tools/_tmp_hetero_utility.html` (empty, tracked)
- `tools/_tmp_s59_analysis_out.txt` (tracked dump)
- `tools/_tmp_edpsych_export/` (local residue; ignore naming inconsistent with `tools/_tmp_hetero_live_export/`)

### Governing principle

Diagnostic dumps are scratch. No current operational justification for tracked copies.

### Decision

| Item | Decision |
| ---- | -------- |
| Tracked `tools/_tmp_hetero_utility.html`, `tools/_tmp_s59_analysis_out.txt` | **delete** |
| Local `tools/_tmp_edpsych_export/` if present | **delete** (local/untracked cleanup when executing) |
| Ignore-pattern alignment for `_tmp_*` | Deferred to **Group G** (policy for T-030; not a rename of product paths) |

### Rationale

Empty/dump files do not support active engineering. Git history retains prior content.

### Confidence

**High** (tracked dumps); **Medium** (local edpsych dir — delete if present at execution)

### Implementation impact

`tools/` hygiene only.

### T-030 execution?

**Yes** — **Slice D**.

---

## Group E — Archive / quarantine / loose captures

### Evidence summary (T-010 §2.2, §2.4)

| Path | Inventory signal |
| ---- | ---------------- |
| `_archive/failed-investigation-2026-06-29/` | Explicit quarantine; README forbids use; no consumers; compose-era orphans |
| `captures/sprint-41-impacts/*` | Outside authoritative sprint pack; no test/package consumers; fixtures live under `tests/fixtures/` |
| `archive/docs-legacy/**` | Cited by `docs/architecture/decisions.md` as consolidation destination for legacy docs/examples |

### Governing principle

HRP + S74C-D02: Git history is the default archive. Active archive **trees** require current operational justification. Authoritative sprint evidence remains under `docs/development/sprints/**` (protected). A curated legacy-docs shelf designated by architecture ADR is a different case from forensic quarantine / loose captures.

### Decision

| Item | Decision |
| ---- | -------- |
| `_archive/failed-investigation-2026-06-29/**` | **delete** (do **not** copy elsewhere; Git history is the archive) |
| `captures/sprint-41-impacts/**` | **delete** (Git + Sprint 41 pack remain; no new shelf) |
| `archive/docs-legacy/**` | **retain** |
| Creating new “archive” copies of deleted material | **forbidden** |

### Rationale

- **`_archive/…`:** Quarantine README itself states forensic-only / do-not-use. Active tree duplicates Git. No current operational justification → delete active copy.
- **`captures/…`:** Loose historical dumps outside sprint evidence packs. No live consumer. Sprint 41 pack + Git suffice → delete active copy.
- **`archive/docs-legacy/**`:** Architecture decisions still name this path as the consolidated home for legacy concept notes / workflow examples. That is a **current documentation-structure justification** (not retention-by-age). Retain until a future docs sprint deliberately relocates ADR-referenced examples.

### Confidence

**High** (`_archive/`, no-new-archive policy); **Medium–High** (`captures/` — inventory medium, HRP strengthens delete); **High** (`docs-legacy` retain via ADR citation)

### Implementation impact

Delete quarantine tree and `captures/` tree only. **Do not** rewrite architecture ADR in 74C beyond what T-030 needs for link breakage on deleted `captures/` (if any). `docs-legacy` untouched.

### T-030 execution?

**Yes** for `_archive/` and `captures/` — **Slice E**.  
**No** execution against `archive/docs-legacy/**`.

---

## Group F — Deferred engineering tooling

### Evidence summary (T-010 §2.6–2.7 unknowns)

Inventory **did not** prove absence of operator/runbook use for:

- `tools/evaluate-educational-quality-framework.js`, `tools/evaluate-sprint41-benchmarks.js`
- `tools/sprint-42-4-live-capture.mjs`, `tools/sprint-50-marx-verification-run.mjs`
- Roman Roads builders/verifiers (`build-roman-roads-*`, `verify-roman-roads-*`, `trace-roman-roads-*`)
- VideoTranscriptTest / IMP capture pipeline scripts
- VEU builder (`build-veu-v121-json.js`)
- Phase sanitize / metrics scripts (`apply-phase-*.mjs`, etc.)
- Ad-hoc debug helpers (`dump-dla-prompt-surface`, `debug-peer-cognition`, `inspect-ifp`, `analyze-export-html`, `check-dla-patterns`, `count-material-occurrences`, `report-episode-plan-grammar-parity`, `write-heteroscedasticity-vnext-va-export`)

Related fixtures/tests **do** exist for some domains (e.g. Roman Roads fixtures, `sprint-38-veu-v121.test.js`, EQF evaluator lib/tests). Script↔fixture wiring was **not** fully proven in T-010.

### Governing principle

Do not guess. Insufficient evidence → **defer** (explicit). Deletion that might break fixture regeneration or operator diagnostics would require product/engineering-process reasoning beyond T-010 — out of safe bulk hygiene until investigated.

### Decision

| Item class | Decision |
| ---------- | -------- |
| All Group F paths above | **defer** |
| npm-wired / test-referenced scripts (T-010 §2.7 retain list) | **retain** (protected; not Group F) |

### Rationale

Operational value is **possible but unproven**. Per task instruction and T-010 unknowns: retain-as-defer rather than invent delete/retain without consumer proof.

### Confidence

**Medium** (evidence incomplete by design of T-010)

### Implementation impact

**None in 74C T-040** unless a later authorised mini-investigation (outside this decision’s execution mandate) upgrades a row to delete/retain.

### T-030 execution?

**No deletion slices.** T-030 may list Group F as **out-of-execution / parking lot** with a short “final investigation checklist” for post-74C or a separately authorised follow-up — **not** as T-040 work under these decisions.

---

## Group G — Ignore policy

### Evidence summary (T-010 §2.9–§7)

`.gitignore` currently only: `.env.local`, `node_modules/`, `tools/_tmp_hetero_live_export/`. Root scratch was re-committed (e.g. `test2.txt` in 74B docs close). Ignore naming for `_tmp_*` under `tools/` is inconsistent.

### Governing principle

Prevent reintroduction of the same scratch classes after deletion (hygiene durability). Policy change only — no product behaviour.

### Decision

| Item | Decision |
| ---- | -------- |
| Expand `.gitignore` for scratch classes | **Yes — include in T-030** (implement at T-040 with deletions) |
| Suggested patterns (plan guidance, not applied here) | Root/test dumps: e.g. `/test*.txt`, `/tmp-*`, `/page - *.html`, `/tmp-was-marx-right/`; tools dumps: `tools/_tmp_*/` (or broader `tools/_tmp_*`) while preserving intentional exceptions if any |
| Rename product/tooling paths for ignore consistency | **No** required renames in 74C; ignore glob expansion preferred over renaming tracked tools |

### Rationale

Without ignore expansion, Slice A/D deletions will recur. Expansion is repository policy, not age-based cleanup.

### Confidence

**High** that T-030 **should** include ignore expansion; **Medium** on exact glob wording (T-030 specifies precise patterns).

### Implementation impact

`.gitignore` edit only at T-040 (with Slice A/D). No runtime impact.

### T-030 execution?

**Yes** — **Slice G** (gitignore), planned alongside A/D; executed in T-040.

---

## Protected classes (frozen for T-030 / T-040)

These **remain** in the active repository. T-030/T-040 must not delete, move, or weaken them:

| Class | Examples / path pattern | Why today? |
| ----- | ----------------------- | ---------- |
| Product runtime | `app.js`, `index.html`, `lib/**` (current), `domains/**`, `utilities/**` | Supports the product |
| Test guardians | `tests/**/*.test.js` (excl. `_patch-icons.js`) | Protect current intended behaviour |
| Fixtures / bootstrap | `tests/fixtures/**`, `tests/prism-vm-lib-bootstrap.js` | Current regression & assembly evidence |
| Certification artefacts | `artifacts/learner-renderer-vnext-certification.{json,md}` | Current certify CLI output |
| Generated browser artefact | `lib/learner-renderer-vnext-browser.js` | Required build/check/export path |
| npm-wired scripts | `dev-server`, build/check learner-renderer, gam inventory, kitchen-sink fixture, certify | Current engineering process |
| Test-referenced tooling | `scripts/audit-learner-surfaces.js` | Used by current tests |
| Authoritative sprint evidence | `docs/development/sprints/**` packs (incl. frozen context-files / artefacts) | Programme evidence SSOT |
| Curated legacy docs shelf | `archive/docs-legacy/**` | Named by architecture ADR as consolidation home |
| Local secrets / deps ignore | `.env.local`, `node_modules/` | Correct ignore posture |

---

## Permanent archive policy (S74C-D02)

1. **Git history is the default historical archive.**  
2. **Do not** keep active copies of forensic quarantine, scratch dumps, or loose captures solely for reference.  
3. **Do not** create replacement archive trees when deleting such material.  
4. **Authoritative historical narrative** for engineering work lives in **sprint evidence packs** under `docs/development/sprints/**`, not in `_archive/` or root `captures/`.  
5. **`archive/docs-legacy/`** remains the **only** intentional thin legacy-docs shelf retained under these decisions (ADR-backed).  
6. **Certification artefacts and current fixtures** are operational, not “archives.”  
7. After 74C, new scratch must be **gitignored** (Group G) and must not be committed.

---

## Repository policy after 74C

| Policy | Statement |
| ------ | --------- |
| Scratch | Not tracked; covered by expanded `.gitignore` |
| Probes | No compose-era or unreferenced `probe-*` families in active tree |
| Quarantine `_archive/` | Not used as a standing shelf for failed investigations; prefer Git + sprint docs |
| Loose `captures/` | Not a standing evidence location; use sprint packs |
| Deferred tooling (Group F) | Remains until explicit later decision; not “approved current” by silence |
| Product / tests / certify | Untouched by 74C hygiene |
| Compatibility | S74-D09 unchanged — pre-release history ≠ retention requirement |

---

## Safe bulk deletions (authorised for T-030 planning → T-040 execution)

| Slice | Contents |
| ----- | -------- |
| **A** | Root tracked scratch + `tmp-was-marx-right/**` + `NEXT-CHAT-CONTEXT.md` |
| **B** | Compose-broken tools/probes + `thin-design-page-pack-template.js` |
| **C** | Remaining `scripts/probe-*` + sprint-16/19 scripts + `tests/_patch-icons.js` |
| **D** | Tracked `tools/_tmp_*` dumps (+ local edpsych `_tmp` dir if present) |
| **E** | `_archive/failed-investigation-2026-06-29/**` + `captures/sprint-41-impacts/**` |
| **G** | `.gitignore` expansion (with A/D) |

---

## Items needing one final investigation (not T-040 under these decisions)

All **Group F** rows — fixture builders, evaluate CLIs, live-capture tools, phase-sanitize utilities, Roman Roads / VEU / VideoTranscriptTest / IMP scripts, ad-hoc debug helpers. Outcome must be a future **retain** or **delete** with consumer evidence; until then **defer**.

Optional post-74C: confirm no operator-local `.tmp-*` trees; not a tracked-repo decision.

---

## Final decision table

| Item class | Decision | Reason | Execution slice |
| ---------- | -------- | ------ | --------------- |
| Root tracked scratch (`test*.txt`, page dumps, `tmp-*`, `tmp-was-marx-right/`) | **delete** | No current operational value; Git archives | **A** |
| `NEXT-CHAT-CONTEXT.md` | **delete** | Obsolete root briefing; misleading | **A** |
| Compose-calling probes/tools | **delete** | Broken post-74B; plausible-but-wrong tooling | **B** |
| `thin-design-page-pack-template.js` | **delete** | Obsolete compose-era template | **B** |
| `scripts/probe-*` family (remainder) | **delete** | No npm/test operational consumer | **C** |
| `sprint-16` / `sprint-19` scripts | **delete** | No operational consumer | **C** |
| `tests/_patch-icons.js` | **delete** | Non-test mutator; hazard | **C** |
| `tools/_tmp_*` dumps | **delete** | Scratch | **D** |
| `_archive/failed-investigation-2026-06-29/` | **delete** | Quarantine without current use; Git is archive | **E** |
| `captures/sprint-41-impacts/` | **delete** | Loose capture outside sprint pack; no consumer | **E** |
| `archive/docs-legacy/` | **retain** | ADR-named legacy docs shelf | — |
| Group F engineering tooling | **defer** | Insufficient consumer evidence | — (parking lot) |
| Protected classes (§ above) | **retain** | Current operational value | — |
| `.gitignore` expansion | **include in plan** | Prevent scratch reintroduction | **G** |
| New archive copies of deleted material | **forbidden** | HRP / S74C-D02 | — |

---

## Validation (T-020)

| Check | Result |
| ----- | ------ |
| Runtime changes | **None** |
| Test / fixture changes | **None** |
| Repository / archive / tooling modifications | **None** |
| Deletions / renames / moves | **None** |
| Only Sprint documentation updated | **Yes** |
| T-030 begun | **No** |

---

## Task closure

| Check | Result |
| ----- | ------ |
| Decisions document created | **Yes** — this file |
| Formal policy decision recorded | **Yes** — S74C-D02 |
| Execution plan created | **No** (T-030) |
| Next task | **S74C-T-030** |
