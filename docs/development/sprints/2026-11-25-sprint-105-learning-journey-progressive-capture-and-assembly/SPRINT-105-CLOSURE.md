# Sprint 105 — Closure Record

**Sprint:** 105 — Learning Journey Progressive Capture and Assembly  
**Opened:** 2026-11-25  
**Closed:** 2026-11-25  
**Status:** **CLOSED — COMPLETE**  
**Type:** Architectural remediation & progressive capture/assembly delivery (Learning Journey), plus live-acceptance Expository anchoring (`S105-D03`) and representational necessity  
**Opening decision:** [S105-D01](decisions.md#s105-d01--open-sprint-105--learning-journey-progressive-capture-and-assembly)  
**Architectural decisions:** [S105-D02 (Accepted)](decisions.md#s105-d02--stage-authority-progressive-capture-and-deterministic-assembly-contract) · [S105-D03 (Accepted)](decisions.md#s105-d03--optional-block-level-material-anchors-in-expository-exposition)  
**Final close:** [S105-D04](decisions.md#s105-d04--close-sprint-105--complete-and-hand-back-to-sprint-104)  
**Implementation commits:** `4b698db` (M1) · `09cfbfc` (M2) · `83e7aec` (M3) · `a7ad249` (M4 live-acceptance fixes, Workstream 1, `S105-D03`, and Economics C1 live acceptance)  
**Development pack:** this folder  
**Programme pointer:** [docs/sprints/sprint-105-learning-journey-progressive-capture-and-assembly.md](../../../sprints/sprint-105-learning-journey-progressive-capture-and-assembly.md)  
**Handback target:** [Sprint 104 — Workload Fidelity and Proportionate Authoring](../2026-11-24-sprint-104-workload-fidelity-and-proportionate-authoring/SPRINT-104-START-HERE.md) (resumed at live acceptance via `S104-D05`)

---

## Closure statement

Sprint 105 is **CLOSED — COMPLETE**.

The sprint resolved the monolithic Step 5 Learning Journey output-length failure (`S105-AD-001`) by retaining the 5-stage educational design process (`Requirements` → `Progression` → `Elements` → `Commissioning` → `Design Page`) and moving Learning Journey authoring to **progressive structured capture, validation, persistence, and deterministic final assembly** (`progressive_capture_version: "s105_v1"`), while keeping the canonical final Learning Journey Design Page schema (`2.0.0`) and all downstream consumers unchanged. Confirmed Learning Journey prompt, continuity, and duplication defects (`S105-AD-002`, `S105-AD-003`, `S105-AD-004`) were fixed and verified.

During Milestone 4 live acceptance, focused fixes were also delivered and verified for `evaluate` evaluative-refinement sequencing, Expository Design Page visual-affordance vocabulary & native scatterplot distinction, client-side SVG intake & 2× PNG rasterisation, graphical construction-prose suppression, nested scatterplot and structured-comparison publication across Expository sections, **Workstream 1** (Expository representational necessity and workload proportionality), and **`S105-D03`** (optional block-level material anchors in Expository exposition).

**Closing Sprint 105 does not claim:**
- that all components of the 30-hour, 50-component Political Economy Learning Journey have been generated or that its integrated learner runtime has been validated (it provides scalability evidence for progressive 5-stage capture and deterministic assembly only);
- that all remaining Economics Learning Journey components have been regenerated or that full-journey workload fidelity and unified runtime acceptance are complete (those belong to resumed Sprint 104 M1/M6/M7);
- that actual learner completion times have been empirically measured (C1's estimated ~12–15 min workload vs 10 min commissioned duration remains an unmeasured estimate); or
- that brief-provided source material preservation has been separately exercised in a dedicated live manual run (its verbatim transport and preservation across duplication, invalidation, and clear-run are verified by automated regression tests; see §4 below).

Do not reopen Sprint 105 for polish or component-type expansion. Formal work hands back immediately to **Sprint 104** live acceptance (`M1`, `M6`, `M7`).

---

## 1. Completed milestones & commits

| Milestone | Scope | Commit | Status |
| --------- | ----- | ------ | ------ |
| **105A** | Investigation, stage-authority map, confirmed defect audit, Sprint 104 suspension (`S104-D04`) & sprint pack | Pre-M1 docs | **Complete (`S105-D02` accepted)** |
| **Milestone 1** | Stage 1–5 partial contracts (`lib/learning-journey-assemble.js`), deterministic final LJ assembler, workflow versioning (`s105_v1`), strict legacy separation, `lib/page-vnext-assemble.js` delegation & `lib/first-class-workflow-family.js` stamping | `4b698db` | **Complete & verified** |
| **Milestone 2** | Economical Stage 1–5 prompts, authoritative stored-capture handoff, Step 5 Interactive runner-guidance suppression (`S105-AD-002`), and learner artefact continuity reconciliation (`S105-AD-003`) | `09cfbfc` | **Complete & verified** |
| **Milestone 3** | Progressive LJ run orchestration, per-stage validation, upstream invalidation, reload persistence & durable `ABSENT≠DELETE` purge, stale async write abort, origin-aware clear-run & clean workflow duplication (`S105-AD-004`), and legacy pre-105 compatibility | `83e7aec` | **Complete & verified** |
| **Milestone 4** | Pre-live browser readiness (`112/112` HTTP 200 scripts, `109` globals), live-acceptance fixes (incl. Workstream 1 & `S105-D03`), live 90-min Economics LJ & 50-component Political Economy LJ generation, regenerated Economics C1 acceptance (`91/100`), and all 6 user-confirmed manual lifecycle/compatibility checks | `a7ad249` + closure commit | **Complete & accepted** |

---

## 2. Implemented architectural decisions

1. **[S105-D01](decisions.md#s105-d01--open-sprint-105--learning-journey-progressive-capture-and-assembly):** Opened Sprint 105 with priority ahead of Connect More, preserving the 5-stage LJ educational process and preserving both historical Economics baselines untouched.
2. **[S105-D02](decisions.md#s105-d02--stage-authority-progressive-capture-and-deterministic-assembly-contract):** Ratified the 9-refinement progressive capture & deterministic assembly architecture: immutable final LJ Design Page contract (`2.0.0`) with zero intermediate-field leakage; minimum sufficient field-purpose/consumer stage contracts; reasoning-vs-capture economy; single-stage ownership & deterministic transport of Stage 1 outcomes and brief-provided source material; mandatory 5-stage assembly; strict legacy separation with zero monolithic bypass on progressive workflows; stored-captures-authoritative handoff & invalidation; Sprint 104 contract preservation; and Economics baseline preservation.
3. **[S105-D03](decisions.md#s105-d03--optional-block-level-material-anchors-in-expository-exposition):** Established optional standalone block-level material anchors (`[[material:<commission_id>]]`) in Expository `sections[].exposition` (`lib/expository-material-anchors.js`), binding exclusively to same-section `commission_id`, failing fast at XD capture / commission-lock / assembly, rendering defensively with actionable diagnostics, placing explicitly linked fulfilled visual affordances inline without duplication, preserving EQ8 terminal consolidation and backwards compatibility, and maintaining preview / standalone-ZIP / unified-LJ parity. Implemented alongside **Workstream 1** (Expository representational necessity and workload proportionality across EJP, XD, and XM).
4. **[S105-D04](decisions.md#s105-d04--close-sprint-105--complete-and-hand-back-to-sprint-104):** Closed Sprint 105 as complete and handed back to Sprint 104 live acceptance (`S104-D05`).

---

## 3. Automated regression evidence vs confirmed live acceptance evidence

See [VALIDATION.md](VALIDATION.md) and [MANUAL-ACCEPTANCE-CHECKLIST.md](MANUAL-ACCEPTANCE-CHECKLIST.md) for full details.

### Automated regression evidence (all green)

| Verification Gate | Result | Scope |
| ----------------- | ------ | ----- |
| Milestone 1 focused suite (`tests/s105-m1-lj-assembly.test.js` + 4 non-regression suites) | **71 / 71 pass** | 5-stage contracts, deterministic assembler, zero intermediate leakage, mandatory 5 stages, brief-provided source & Stage 1 outcome transport, strict legacy separation, downstream compatibility |
| Milestone 2 focused suite (`tests/s105-m2-prompts-and-continuity.test.js` + 10 non-regression suites) | **100 / 100 pass** | Economical Stage 1–5 prompts, authoritative stored-capture handoff, `S105-AD-002` Step 5 fix, `S105-AD-003` continuity reconciliation, non-LJ product isolation |
| Milestone 3 focused suite (`tests/s105-m3-lifecycle-and-orchestration.test.js` + 16 non-regression suites) | **140 / 140 pass** | Progressive orchestration, upstream invalidation, reload persistence & `ABSENT≠DELETE` non-resurrection, stale persist abort, origin-aware clear-run & duplication (`S105-AD-004`), legacy compatibility, Sprint 104 M2–M5 safeguards |
| Milestone 4 pre-live browser & gap coverage | **59 / 59 pass** + **`112/112` HTTP 200 scripts / `109` globals** | Component LO binding, commission-native runtime, 4-product artefact consumers, unified shell, publishing UI, editorial opening, plus `7/7` functional Journal pipeline assertions |
| Milestone 4 live-acceptance fixes (`evaluate` sequencing, Expository DP visual affordances, SVG intake, C1 construction-prose suppression, C1 6-section scatterplots/tables & S4/S5 comparisons) | **31/31**, **32/32**, **59/59**, **45/45**, **47/47**, **57/57 pass** | Targeted defect fixes verified with browser-bundle parity (`npm run check:learner-renderer-vnext-browser`) |
| Workstream 1 (Expository representational necessity & proportionality) | **50 / 50 pass** | EJP/XD/XM proportionality principle, 3-way distinction, prohibition on uncommissioned derived series, zero arbitrary caps/tiers |
| Workstream 2 (`S105-D03` optional block-level material anchors) | **106 / 106 pass** (14 suites) | Parser, exclusive `commission_id` validation, defensive rendering, inline visual-affordance linking, EQ8 preservation, preview/ZIP/unified-LJ parity |

### Confirmed live acceptance evidence (user-confirmed)

| Live Evidence Item | Result | Scope & Qualification |
| ------------------ | ------ | --------------------- |
| Fresh 90-minute Economics Learning Journey (*Correlation and Causation: Making Sense of Economic Evidence*) | **PASS (live authoring)** | Completed progressive Steps 1–5 cleanly without output-length failure; deterministically assembled; actively used for downstream component commissioning (adopted as canonical Sprint 104 parent workflow) |
| 30-hour, 10-week, 50-component Political Economy Learning Journey | **PASS (live LJ scalability evidence)** | Successfully generated through all five progressive capture stages and deterministically assembled. **Qualification:** Evidence of progressive LJ capture and assembly scalability only — does **not** claim all 50 components have been produced or that its integrated learner runtime has been validated. Remains an independent large-scale reference implementation and stress test outside Sprint 104 closure dependencies. |
| Regenerated Economics C1 Expository Resource (*Reading relationships in economic data*, 10 min) | **PASS (`91 / 100` — Professional / Excellent)** | Zero production cap, zero critical/major defects; 6 sections, 4 inline material placements (`S105-D03`), 3 native SVG scatterplots, 4 data/comparison tables, 0 unnecessary derived series, 0 raw anchor leaks, ~1,994 prose words. Export ZIP and QA record archived under [evidence/c1-expository-live-acceptance/](evidence/c1-expository-live-acceptance/C1-LIVE-ACCEPTANCE-QA-RECORD.md). |
| User-confirmed manual check 1 — Reload persistence | **PASS (manual browser)** | Hard reload restored accepted 5-stage captures and assembled Design Page identically with zero phantom captures |
| User-confirmed manual check 2 — Parent Learning Journey Overview preview | **PASS (manual browser)** | Parent Overview rendered cleanly without raw commissioning or continuity metadata |
| User-confirmed manual check 3 — Legacy compatibility & baseline preservation | **PASS (manual browser, read-only)** | Untouched pre-Sprint 105 Economics baseline opened cleanly in legacy mode without mutation; both historical Economics baselines remain preserved |
| User-confirmed manual check 4 — Workflow duplication (`S105-AD-004`) | **PASS (manual browser, disposable duplicate)** | Duplication preserved brief and progressive mode while cleanly stripping stage captures and run-derived state |
| User-confirmed manual check 5 — Upstream invalidation, authoritative edits, prompt propagation & non-resurrection | **PASS (manual browser, disposable duplicate)** | Editing an upstream stage invalidated downstream stages, propagated the edit into downstream Copy prompts as authoritative, and did not resurrect invalidated captures after reload |
| User-confirmed manual check 6 — Clear-run behaviour & brief preservation | **PASS (manual browser, disposable duplicate)** | `Clear run data` cleared captures and run-derived state with zero phantom captures after reload while preserving brief data |

---

## 4. Qualifications, deferred defects, architectural debt & non-blocking observations

All deferred items and qualifications are preserved transparently and carried forward without reopening Sprint 105:

1. **Brief-provided source material preservation (automated vs live distinction):** Deterministic verbatim transport of brief-provided source material (`{ status: "provided" }`, no retranscription) and its preservation across upstream invalidation, `Clear run data`, and workflow duplication are **thoroughly verified by automated regression tests** (`tests/s105-m1-lj-assembly.test.js`, `tests/s105-m2-prompts-and-continuity.test.js`, `tests/s105-m3-lifecycle-and-orchestration.test.js`, `tests/s96-lj-shared-source-design-page-boundary.test.js`). Separate live manual execution specifically exercising a brief-provided source corpus across duplication/clear-run was not separately recorded.
2. **Residual C1 workload-fidelity observation (non-blocking, carried into Sprint 104):** Regenerated Economics C1 is commissioned for **10 minutes**; estimated learner workload is approximately **12–15 minutes**. **Actual learner completion times remain unmeasured.** Workload fidelity will be evaluated holistically across the remaining Economics Learning Journey components in resumed Sprint 104 without regenerating accepted C1.
3. **`S105-AD-005` (Open — Minor, deferred):** In `lib/learner-renderer-vnext/render-html-utils.js` (`renderMarkdownBlock`), leading Markdown blockquote syntax (`> ...`) in Expository prose rendered as literal `&gt;` inside `<p>` once in regenerated C1 instead of `<blockquote>`. Logged in [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md) for subsequent attention; C1 was not regenerated.
4. **`D-016` (Deferred architectural enhancement):** Native deterministic inline SVG rendering for structured number-line and quantitative scale specifications (`number_line_segments`, e.g., Pearson correlation scales), logged in programme `docs/development/governance/ARCHITECTURAL-DEBT.md` and Sprint 105 [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md). Existing `number_line_segments` routing and client-side SVG intake + 2× PNG rasterisation remain active.
5. **Pre-existing / external exclusions preserved untouched:** `PB-S-008` pre-existing full-suite failures; `S104-AD-009` remaining Practice criterion caps (tracked under Sprint 104); both historical Economics baselines preserved untouched.

---

## 5. Formal handback to Sprint 104

Sprint 105 formally hands back active programme execution to **[Sprint 104 — Workload Fidelity and Proportionate Authoring](../2026-11-24-sprint-104-workload-fidelity-and-proportionate-authoring/SPRINT-104-START-HERE.md)** (`S104-D05`) at its outstanding live acceptance milestones:
- **Milestone 1** — Integrated live acceptance;
- **Milestone 6** — Practice duration sensitivity probes at **5, 15, and 30 minutes**;
- **Milestone 7** — Remaining Economics component generation (using the fresh 90-minute Economics Learning Journey as canonical parent, with accepted C1 retained), workload assessment, baseline comparison against preserved pre-intervention captures, educational QA, and unified learner-runtime acceptance.
