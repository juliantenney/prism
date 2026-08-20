# Prism Engineering Evidence Review — Sprint 68 to Sprint 74 Closure

**Document type:** Engineering evidence pack (not an executive report)  
**Scope:** Significant development from Sprint **68** through programme closure of Sprint **74** (including **74A / 74B / 74C**)  
**Prepared:** 2026-08-07  
**Method:** Repository evidence only (sprint packs, closeouts, decisions, STATUS/PLAN/HANDOVER, architecture docs, certification artefacts, git history). Not summarised from conversation memory.  
**Out of scope for this document:** Management recommendations; detailed backlog triage; Sprint 75 planning.

---

## Sources reviewed

| Class | Paths / artefacts used |
| ----- | ---------------------- |
| Top-level closeouts / overviews | `docs/sprints/sprint-68-closeout.md`, `sprint-68-learning-coherence-narrative-flow.md`, `sprint-69-archetype-grammar-validation.md`, `sprint-70-closeout.md`, `sprint-71-closeout.md`, `sprint-72-closeout.md`, `sprint-73-closeout.md`, `sprint-74a-closeout.md`, `sprint-74-architecture-consolidation-and-rationalisation.md`, `sprint-74c-…md` |
| Sprint packs 68–74C | Under `docs/development/sprints/2026-07-21-sprint-68-…` through `2026-08-07-sprint-74c-…` (START-HERE, STATUS, PLAN, HANDOVER, CHARTER, FINAL/CLOSURE/T-050 where present) |
| Decision logs | Sprint 69 `DECISIONS.md`; Sprint 70 closure decision table; Sprint 71–74C `decisions.md` |
| Architecture | `docs/architecture/adr/ADR-012-…`, `docs/architecture/learner-renderer-vnext.md` (referenced), `episode-plan-ownership-boundary.md` (existence verified), Sprint 74 `ARCHITECTURAL-CONSTRAINTS.md` |
| Governance | `docs/development/ENGINEERING-DISCIPLINES.md` (introduced commit `c32408e`, 2026-08-07) |
| Verification artefacts | `artifacts/learner-renderer-vnext-certification.{json,md}`; S74A/B/C T-050 evidence reports |
| Git history | `git log` since ~2026-07-21; milestone `8b90940`; slice commits for 74A-T-045, 74B-T-040, 74C hygiene |

**Evidence confidence:** High for closed sprints with FINAL/CLOSURE/T-050 reports (68, 71, 72, 73, 74A, 74B, 74C). Medium for Sprint 69 (STATUS Phases 1–5B complete; Phase 6 certification closeout unchecked; top-level/README still “Planned”). Medium–High for Sprint 70 (dual charter/outcome tracks with documented factual gaps). Parallel pack audits ([Review sprints 68-71 evidence](ed644e18-3de8-4b99-a7ac-3794ae821d6a), [Review sprints 72-74 evidence](5083c643-b5c6-40c9-8002-4bb0c1b5d520)) cross-checked and folded into Appendix E refinements.

---

## 1. Executive engineering summary

### Overall objectives (68→74)

Across this window, Prism’s engineering work pursued three converging aims:

1. **Make learner-renderer-vNext a trustworthy educational presentation and interaction surface** (semantic composition, capabilities, certification) without relocating pedagogical ownership into the renderer (**ADR-012**, Sprint 68).
2. **Harden the Learning Design pipeline’s educational legality and instructional product quality** (archetype grammar / fail-closed validation; evidence-centred activities; QA and attribution methodology) while keeping stage ownership explicit (Sprints 69–72).
3. **Converge the codebase onto one definitive implementation per major responsibility** and clean repository residue (Workflow Resources; sole vNext export; partial+assemble generation; hygiene) under explicit architectural constraints and Engineering Disciplines (Sprints 73–74).

### Major outcomes

| Outcome | Evidence anchor |
| ------- | --------------- |
| vNext renderer certified on authoritative corpus; capability surfaces + Orient/Learn/Do/Check composition | Sprint 68 closeout; certification artefacts; ADR-012 |
| Shared archetype grammar as production educational validation route; pre-launch compatibility registries removed | Sprint 69 STATUS Phase 5B; D69-13 |
| Systematic resource QA / attribution methodology; then evidence-centred instructional productisation in the existing pipeline | Sprint 70–72 closeouts / final reports |
| First-class Workflow Resources with IndexedDB image persistence and bounded generalisation | Sprint 73 final report |
| Sole learner-page renderer (obsolete parallel path removed) | Sprint 74A final report / T-045–T-050 |
| Sole page-construction architecture: partial contract → capture → validation → deterministic assemble | Sprint 74B T-050 |
| Repository hygiene under Historical Retention Principle; Sprint 74 programme closed | Sprint 74C T-050; S74-D11 |

### Programme assessment

Engineering evidence supports that **Sprint 68–74 delivered a coherent maturation arc**: from **certified learner presentation** → **fail-closed educational legality** → **instructional quality system** → **productised evidence-centred activities** → **workflow resource durability** → **definitive codebase consolidation** → **repository rationalisation**.

Sprint **74** specifically achieved its rationalisation programme objectives as refined after 74B (narrowed 74C hygiene; PB-S-001 excluded). Sprint **75** is recorded as the next programme and was **not opened** at 74 closure (`S74-D11`, S74C-T-050).

---

## 2. Chronological programme review

### Sprint 68 — Learning Coherence and Narrative Flow (2026-07-21 → 2026-07-22)

| Field | Evidence |
| ----- | -------- |
| **Purpose** | Improve learner coherence where authoritative data supports it; validate pipeline↔renderer boundary; capability-based interaction; production certification ([sprint-68-closeout.md](../sprints/sprint-68-closeout.md)) |
| **Major achievements** | IMP-013 semantic Orient/Learn/Do/Check composition; IMP-014A–019 capability surfaces (tables, multi-part text, ordering, local drafts); IMP-020 certification runner/corpus; IMP-021 architecture docs |
| **Architectural significance** | Expanded learner functionality **without modifying upstream educational pipeline**; ADR-012: renderer interprets semantics, does not author pedagogy |
| **Verification** | Certification **CERTIFIED**: 6 workflows, 25 activities, 88 semantic moments; 0 beat fallbacks / unknown archetypes / unexpected diagnostics; reported **469** vNext tests passed; `node scripts/certify-learner-renderer-vnext.js` → `artifacts/learner-renderer-vnext-certification.*` |
| **Outcome** | **COMPLETE** (closed 2026-07-22) |

### Sprint 69 — Archetype Grammar Validation (opened 2026-07-23)

| Field | Evidence |
| ----- | -------- |
| **Purpose** | Move exact validation from sequence enumeration to **shared archetype grammar** across producer/renderer; **no fuzzy matching** ([sprint-69 overview](../sprints/sprint-69-archetype-grammar-validation.md); WHY/DECISIONS pack) |
| **Major achievements** | Shared FunctionEnum vocabulary + archetype grammar modules; dual validation then renderer migration; Phase 5B removal of journey-compressed / whole-sequence compatibility from production runtime; fixtures migrated to canonical FunctionEnum (STATUS) |
| **Architectural significance** | Sole educational validation route: Episode Plan → FunctionEnum → shared grammar → deterministic canonical binding; fail-closed on mixed/compressed vocabulary (**D69-13**) |
| **Verification** | STATUS: Phases 1–5B checked; residual hetero interactive failure diagnosed as stale runstate (resolved notes); `NOTES.md` cites renderer suite **536 pass / 0 fail** and certification still **CERTIFIED**; certification artefacts updated in commits (`2e44803`, `6853376`) |
| **Outcome** | Implementation Phases 1–5B **complete per STATUS**; **Phase 6 certification closeout checkbox unchecked**; top-level `docs/sprints/sprint-69-….md` and pack README still say “Planned” / “implementation not started” (**documentation inconsistency / gap**); **no** `sprint-69-closeout.md` |
| **Git** | `2e44803` “Sprint 69 complete…” later **reverted** (`541285e`); `6853376` “Stabilise Sprint 69 renderer baseline” (Sprint 70 cites this as recovery baseline) |

### Sprint 70 — Visual Planning and Synthesis / Resource Quality QA (2026-07-28 → 2026-07-30)

| Field | Evidence |
| ----- | -------- |
| **Purpose (charter)** | Visual planning and synthesis portable pack |
| **Purpose (closed outcome track)** | Systematic QA methodology for generated learning resources ([SPRINT-70-CLOSURE.md](../development/sprints/2026-07-28-sprint-70-visual-planning-and-synthesis/SPRINT-70-CLOSURE.md); [sprint-70-closeout.md](../sprints/sprint-70-closeout.md)) |
| **Major achievements** | Benchmark v2.1 / Validation Review v2.0 methodology (closure claims); separation of production vs instructional findings; attribution-before-prompt-change; decisions S70-D01… for Sprint 71 scope |
| **Architectural significance** | Established that defects must be attributed to **owning pipeline stage**; deferred premature prompt rewrite / workflow redesign |
| **Verification** | Closure records completed QA-methodology outcomes; **explicit gap**: visual-planning slice log not updated to verified completion matrix; in-repo paths for some benchmark artefacts noted as gaps |
| **Outcome** | **Complete** (closed 2026-07-30) |
| **Related git** | `a7d6f23` “complete end-to-end visual jobs and inline learner rendering” (engineering work during period; not fully reconciled into QA closure ledger) |

### Sprint 71 — Learner-Facing Pipeline Quality Evidence and Prompt Attribution (2026-07-30 → 2026-07-31)

| Field | Evidence |
| ----- | -------- |
| **Purpose** | Evidence gathering and pipeline-stage attribution; not authoring redesign ([sprint-71-closeout.md](../sprints/sprint-71-closeout.md)) |
| **Major achievements** | Eleven validated reviews; controlled experiment (Wilfred Owen S71-R-010 **88/100** → S71-R-011 **91/100**); frozen three-layer model (Platform instructional architecture · Workflow elicitation · Author-supplied evidence); candidate architectural principles |
| **Architectural significance** | Proved steerability via pedagogically informed workflow guidance; remaining critical limits increasingly concern **evidence availability**; authors should not be asked simply to write longer prompts |
| **Verification** | Final Report / CLOSURE; benchmark–validation–synthesis–experiment chain |
| **Outcome** | **COMPLETE** (closed 2026-07-31); evidence frozen for successors |

### Sprint 72 — Productising Instructional Architecture (2026-07-31 → 2026-08-05)

| Field | Evidence |
| ----- | -------- |
| **Purpose** | Productise Sprint 71 architecture into existing activity pipeline without new stage/page type (`S72-D11`; [SPRINT-72-FINAL-REPORT.md](../development/sprints/2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-72-FINAL-REPORT.md)) |
| **Major achievements** | Evidence-centred activity contracts (`evidence_decision`, provider/scaffold separation, simulated and conversation-attachment paths); guided-review diagnostics; intellectual-coherence bridges; learner-page presentation refinements; public-export/browser-bundle parity; Copilot follow-up suppression |
| **Architectural significance** | Instructional architecture became **runtime product behaviour** in the Learning Design pipeline |
| **Verification** | Indicative scores ~92–93 on key resources (final report); focused suites cited green (e.g. bridges 73/73, presentation 118/118); broader evidence-centred suite **not green** — **28** known failures recorded at close; continuous verification (`S72-D14`) replaces a final cross-disciplinary sweep; unfinished streams moved to product backlog |
| **Outcome** | **COMPLETE / CLOSED** against primary objective; large unfinished streams explicitly backlog-migrated (`S72-T-077` → `PRODUCT-BACKLOG.md`) |

### Sprint 73 — Workflow Resources (2026-08-06)

| Field | Evidence |
| ----- | -------- |
| **Purpose** | First-class Workflow Resources starting with durable generated images ([SPRINT-73-FINAL-REPORT.md](../development/sprints/2026-08-06-sprint-73-workflow-resources/SPRINT-73-FINAL-REPORT.md)) |
| **Major achievements** | Discovery-led ownership (workflow-scoped resources); IndexedDB image persistence; derived Preview/HTML/ZIP regeneration; Additional Resources + one provider video embed; authoring/learner presentation surfaces |
| **Architectural significance** | Canonical durable owner for learner-facing binaries; Utilities/manifests as projections |
| **Verification** | Heavy verify cited ~10 images / ~23.7 MB (closeout summary); Phase 1 discovery gates before Phase 2 |
| **Outcome** | **COMPLETE / Closed**; known limitations retained (orphans, same-browser scope, embeds); PB-FA-004 captured for manual uploads |

### Sprint 74 programme — Architecture Consolidation and Rationalisation (2026-08-06 → 2026-08-07)

Wrapper discovery/constraints then three implementation packs:

#### 74A — Authoring → Learner Export Path Integrity (2026-08-06)

| Field | Evidence |
| ----- | -------- |
| **Purpose** | Sole definitive learner-page path; remove obsolete parallel renderer (`S74-D07`, `S74A-D02`) |
| **Major achievements** | vNext-only export routing; obsolete selector/routing/Legacy page path removal (T-045); activity/task interleaving repair (T-042); generated browser artefact freshness gate (T-020); production-browser verification (T-050) |
| **Architectural significance** | Eliminated plausible-but-wrong selectable renderer alternative |
| **Verification** | Preview / HTML / ZIP / Open on production browser path; Node supporting evidence labelled separately (Engineering Disciplines) |
| **Outcome** | **COMPLETE / Closed** |

#### 74B — Generation-contract & capture-validator hygiene (2026-08-07)

| Field | Evidence |
| ----- | -------- |
| **Purpose** | Converge page construction onto partial + deterministic assemble; remove compose ownership and legacy always-pass validators (`S74B-D02`, `S74-D09`) |
| **Major achievements** | Removed live Design Page compose injection and compose module; removed deprecated prompt aliases; removed legacy always-pass capture shims; docs aligned |
| **Architectural significance** | Supported generation path: **partial → capture → validation → assemble → learner renderer** (S74B-T-050) |
| **Verification** | Browser: compose script/globals absent; partial + assemble globals present; Authoring export path intact; supporting Node **134/134** focused batch |
| **Outcome** | **COMPLETE / Closed** |

#### 74C — Repository Hygiene & Historical Residue Rationalisation (2026-08-07)

| Field | Evidence |
| ----- | -------- |
| **Purpose** | Narrowed R1 hygiene only; no product behaviour change; Historical Retention Principle (`S74C-D02`) |
| **Major achievements** | Inventory → decisions → plan → seven hygiene commits (scratch, obsolete probes, compose-broken tools, quarantine, captures, `.gitignore`); programme close |
| **Architectural significance** | Active tree no longer presents obsolete compose tooling / scratch as current; Git history is default archive |
| **Verification** | S74C-T-050 acceptance matrix AC-01…AC-13 met; protected classes preserved; Group F deferred |
| **Outcome** | **COMPLETE / Closed**; Sprint 74 programme **COMPLETE / Closed** (`S74-D11`); Sprint 75 **not opened** |

---

## 3. Major architectural evolution

| Change | Why it mattered | Primary evidence |
| ------ | --------------- | ---------------- |
| **Learner-renderer-vNext as certified educational presenter** | Separates presentation/interaction from pipeline authority; enables capability growth without upstream churn | Sprint 68; ADR-012; certification artefacts |
| **Capability-based learner surfaces** | Interaction expressed as capabilities (`text_entry`, `table_entry`, `ordering`, …) with fail-closed unknowns | Sprint 68 IMP-016…019 |
| **Semantic moment composition (Orient/Learn/Do/Check)** | Learner journey coherence without inventing pedagogy in CSS/HTML alone | Sprint 68 IMP-013 |
| **Shared archetype grammar validation** | Replaces brittle whole-sequence registries; fail-closed legality at producer/renderer boundary | Sprint 69 D69-07…D69-13; STATUS Phase 5B |
| **Pre-launch compatibility removal** | Removes dual validation routes that confuse maintainers/agents before external users exist | D69-13; later reinforced by S74-D09 |
| **QA + stage attribution methodology** | Prevents mis-targeted prompt/renderer changes; findings owned by pipeline stage | Sprint 70–71 |
| **Three-layer instructional model** | Clarifies Platform vs Workflow elicitation vs Author evidence | Sprint 71 closeout |
| **Evidence-centred activity productisation** | Turns validated instructional architecture into generation contracts and learner UX | Sprint 72 final report |
| **Workflow Resources durability** | Canonical persistence for generated binaries; exports derived | Sprint 73 |
| **Sole vNext learner-page path** | One definitive renderer implementation | Sprint 74A |
| **Partial + deterministic assemble as sole page construction** | Removes compose as parallel architecture | Sprint 74B T-050; compose module absent on disk |
| **Historical Retention / repository hygiene** | Active copies need operational justification; reduces agent/maintainer noise | Sprint 74C; S74C-D02 |
| **Binding Architectural Constraints + Engineering Disciplines** | Codifies browser-only runtime, one definitive path, ownership-before-removal, inventory-before-deletion | Sprint 74 constraints; Engineering Disciplines (from 74A practice, committed 2026-08-07) |

**Note:** Progressive page enrichment / partial-page foundations predate Sprint 68 (e.g. Sprint 56F/58 packs exist in-repo). From Sprint 68 onward, the decisive consolidation of **partial+assemble as sole architecture** is evidenced in **74B**, not newly invented in 68.

---

## 4. Engineering quality improvements

| Improvement | Evidence |
| ----------- | -------- |
| **Reduced parallel implementations** | Obsolete learner renderer removed (74A T-045); Design Page compose removed (74B T-040); Sprint 69 Phase 5B registry removal |
| **Clear ownership** | ADR-012 renderer role; Episode Plan ownership (D69-01); Workflow Resources ownership (73); S74B-D02 page construction; Engineering Disciplines “ownership before change” |
| **Single authoritative paths** | Sole vNext export; sole partial+assemble construction; sole FunctionEnum grammar route (69 STATUS) |
| **Technical debt reduction** | Milestone commit `8b90940` states foundations strengthened / debt reduced / repo rationalised; hygiene deletes ~51 tracked paths (74C T-040 evidence); compose-broken probes removed |
| **Repository quality** | Scratch ignored via `.gitignore` expansion (74C Slice G); quarantine/captures removed; Group F classified as defer |
| **Test / guardian posture** | Sprint 68 reported 469 vNext tests; at 74C close **288** tracked `tests/*.test.js` (count method: `git ls-files`); 74B focused Node **134/134**; guardians protected during hygiene |
| **Verification improvements** | Production certification corpus (68); browser-vs-Node labelling (Engineering Disciplines); 74A/74B production-browser T-050; 74C slice-level verify-then-commit |
| **Manual / educational acceptance** | Sprint 70–71 benchmark/validation reviews; Sprint 72 indicative resource scores |
| **Engineering governance** | Decision logs proliferate (e.g. S72 ~15 decision headings; S74-D01…D11; S74A/B/C decisions); Context/Handover/START-HERE packs standard |

---

## 5. Engineering methodology evolution

| Practice | When evidenced as established | Notes |
| -------- | ----------------------------- | ----- |
| Portable sprint packs (START-HERE, CONTEXT, HANDOVER, STATUS, PLAN) | Already present by Sprint 68; continuous through 74 | Structural consistency across packs |
| Closeout / FINAL-REPORT / T-050 acceptance | Strong from 68, 71–74C | Sprint 69 lacks top-level closeout |
| Evidence-first / inventory before removal | Explicit in Engineering Disciplines; practiced in 74A T-040 inventory, 74B T-010, 74C T-010 | Formalised after 74A |
| Ownership analysis before change | Engineering Disciplines; 74A/74B discovery tasks | |
| Binding architectural decisions | ADR-012 (68); Architectural Constraints (74, `1103a14` 2026-08-06) | |
| Engineering Disciplines document | Provenance: practices from **74A**; file added `c32408e` (2026-08-07) | Used as inherited authority in 74B/74C |
| Browser authority vs Node supporting evidence | Engineering Disciplines; 74A/74B T-050 | |
| Small reversible commits + residue sweeps | Engineering Disciplines; 74A T-045 multi-slice; 74B T-040 slices; 74C A…E2 | |
| AI-assisted workflow with decision gates | Evident in pack structure, operator-authorised opens (S74-D06/D08/D10), stop-on-unexpected-behaviour | Not a product feature—process pattern |
| Pre-release Compatibility non-default | `S74-D09` (2026-08-07); anticipated by D69-13 | |
| Historical Retention Principle | Sprint 74C charter / `S74C-D02` | Git history as default archive |

---

## 6. Programme metrics

**Only figures with repository support:**

| Metric | Value | Source |
| ------ | ----- | ------ |
| Commits since 2026-07-21 | **74** | `git rev-list --count --since=2026-07-21 HEAD` |
| Sprint 68 certification corpus | **6** workflows, **25** activities, **88** semantic moments | sprint-68-closeout |
| Sprint 68 reported vNext tests | **469** passed / 0 failed | sprint-68-closeout |
| Tracked `*.test.js` at 74C close verification | **288** | S74C-T-050 / `git ls-files` |
| Sprint 71 validated reviews | **11** | sprint-71-closeout |
| Sprint 71 Owen scores | **88 → 91** | sprint-71-closeout |
| Sprint 72 indicative scores | **~92–93** on key resources; broader suite **28** known failures at close | SPRINT-72-FINAL-REPORT / STATUS |
| Sprint 73 heavy verify scale | **~10** images / **~23.7 MB** | sprint-73-closeout |
| Sprint 74B focused Node batch | **134/134** | S74B-T-050 |
| S74A-T-045 commits (grep) | **7** | git log |
| S74B-T-040 commits (grep) | **6** | git log |
| S74C hygiene slice commits | **7** | git log `S74C hygiene` |
| Approximate tracked paths removed in 74C hygiene | **~51** (+ `.gitignore` edit) | S74C-T-040 evidence |
| Parent programme decisions S74-D* headings | **11** | decisions.md count |
| S74A / S74B / S74C decision headings | **2 / 3 / 3** | decisions.md counts |
| S72 decision headings | **15** | decisions.md count |
| S73 decision headings | **3** | decisions.md count |
| Certification artefacts tracked | **2** files under `artifacts/` | `git ls-files artifacts/` |

**Not invented here:** line-of-code deltas; total decision objects across all sprints; full test suite wall-clock; LLM cost; exact visual-planning slice completion counts (Sprint 70 gap).

---

## 7. Risk reduction

| Risk reduced | How evidenced |
| ------------ | ------------- |
| Architectural ambiguity (which renderer?) | 74A sole vNext |
| Architectural ambiguity (compose vs partial?) | 74B sole partial+assemble; compose absent |
| Duplicate / dual educational validation routes | Sprint 69 Phase 5B; D69-13 |
| Obsolete Compatibility as default | D69-13; S74-D09; Engineering Disciplines |
| Silent fallback / silent always-pass validators | 69 fail-closed; 74B removal of always-pass capture shims |
| Unclear pipeline ownership for defects | 70–71 attribution methodology |
| Mis-targeted prompt rewrites | 70–71 defer until patterns established |
| Transient resource loss on refresh | 73 Workflow Resources persistence |
| Stale generated browser artefacts | 74A freshness gate |
| Repository clutter / agent-misleading residue | 74C hygiene + ignore policy |
| Retaining obsolete code “for history” in active tree | S74C-D02 / Engineering Disciplines |

---

## 8. Current state of Prism (after Sprint 74)

### Architecture

- **Browser-only** standalone application (Architectural Constraints / S74-D03).
- **Learner pages:** sole vNext renderer/export path (74A).
- **Page construction:** partial contract → capture → validation → deterministic assemble (74B).
- **Educational legality:** FunctionEnum + shared archetype grammar route (69 STATUS / D69-13).
- **Instructional product:** evidence-centred activity contracts productised (72).
- **Resources:** workflow-scoped Workflow Resources with durable image payloads (73).
- **Renderer philosophy:** interprets educational semantics (ADR-012).

### Repository

- Hygiene slices executed; scratch patterns gitignored; compose-era broken probes removed; quarantine/loose captures removed.
- **Group F** tooling intentionally deferred (not classified as open Sprint 74 debt).
- `archive/docs-legacy/` retained as ADR-named shelf.

### Maintainability

- Binding constraints + Engineering Disciplines available for future consolidation.
- Decision/evidence packs for 68–74C provide recoverable rationale.
- Known documentation staleness (Sprint 69 top-level overview; Sprint 70 dual-track gaps) remains a maintainability caveat.

### Known deferred work (explicit)

- Group F consumer audit  
- PB-S-001 fixture enrichment  
- WR orphan cleanup / PB-FA-004  
- Post-alpha Compatibility policy revisit (S74-D09)  
- Sprint 69 Phase 6 certification closeout checkbox (STATUS) if still outstanding operationally  

### Readiness for Sprint 75

Engineering evidence at 74 closure states foundations strengthened and repository rationalised (`8b90940`; S74C-T-050). Sprint 75 is the **next programme** and was **not opened**. Entry should treat deferred items as **candidates**, not inherited open Sprint 74 tasks.

---

## 9. Remaining strategic work (themes only)

Without backlog detail:

1. **Learner / UI experience programme** (named as Sprint 75 direction in closure docs).  
2. **Deferred tooling & fixture hygiene** (Group F; PB-S-001) when evidence-ready.  
3. **Workflow resource maturity** (orphans, upload paths, multi-profile limits).  
4. **Release Compatibility policy** when external users exist.  
5. **Continued instructional quality / evidence-centred generation** improvements using the attribution methodology.

---

## 10. Appendix

### A. Timeline (evidenced open→close)

| Programme | Opened | Closed | Status |
| --------- | ------ | ------ | ------ |
| Sprint 68 | 2026-07-21 | 2026-07-22 | COMPLETE |
| Sprint 69 | 2026-07-23 | — | Phases 1–5B complete per STATUS; Phase 6 unchecked; top-level docs stale |
| Sprint 70 | 2026-07-28 | 2026-07-30 | Complete |
| Sprint 71 | 2026-07-30 | 2026-07-31 | COMPLETE |
| Sprint 72 | 2026-07-31 | 2026-08-05 | COMPLETE / CLOSED |
| Sprint 73 | 2026-08-06 | 2026-08-06 | COMPLETE / Closed |
| Sprint 74 wrapper | 2026-08-06 | 2026-08-07 | COMPLETE / Closed |
| Sprint 74A | 2026-08-06 | 2026-08-06 | COMPLETE / Closed |
| Sprint 74B | 2026-08-07 | 2026-08-07 | COMPLETE / Closed |
| Sprint 74C | 2026-08-07 | 2026-08-07 | COMPLETE / Closed |
| Sprint 75 | — | — | **Not opened** |

### B. Major decisions (selected)

| ID | One-line |
| -- | -------- |
| ADR-012 | Renderer interprets educational semantics; does not own authoring |
| D69-01…06 | Episode Plan ownership; FunctionEnum vocabulary; fail-closed; renderer non-invention |
| D69-13 | Pre-launch compatibility removal; sole FunctionEnum grammar route |
| S70-D01…05 | No authoring redesign / post-gen questioning in 71; retain rejected findings; attribution |
| S72-D11 | Productise without new pipeline stage/page type (cited in final report) |
| S73-D01/D02 | Discovery-led open; persistence feasible with conditions |
| S74-D03 | Browser-only runtime / static deployment |
| S74-D07 | One definitive codebase; remove obsolete alternatives |
| S74-D09 | Pre-release Compatibility not default |
| S74A-D02 | vNext replaces obsolete learner renderer |
| S74B-D02 | Partial + deterministic assemble sole page construction |
| S74B-D03 | Historical pre-release workflow/runstate compatibility does not block rationalisation |
| S74C-D02 | Git history default archive; active copies need operational justification |
| S74C-D03 / S74-D11 | Close 74C; close Sprint 74 programme |

### C. Important programmes / packs

- `docs/development/sprints/2026-07-21-sprint-68-learning-coherence-narrative-flow/`  
- `…/2026-07-23-sprint-69-archetype-grammar-validation/`  
- `…/2026-07-28-sprint-70-visual-planning-and-synthesis/`  
- `…/2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/`  
- `…/2026-07-31-sprint-72-productising-instructional-architecture/`  
- `…/2026-08-06-sprint-73-workflow-resources/`  
- `…/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/`  
- `…/2026-08-06-sprint-74a-authoring-learner-export-path-integrity/`  
- `…/2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/`  
- `…/2026-08-07-sprint-74c-repository-hygiene-and-historical-residue-rationalisation/`  

### D. Key evidence documents

- Sprint 68 closeout; ADR-012; certification artefacts  
- Sprint 69 STATUS / DECISIONS (D69-13)  
- Sprint 70 CLOSURE (+ explicit gaps)  
- Sprint 71 FINAL-REPORT / CLOSURE  
- Sprint 72 FINAL-REPORT / CLOSURE  
- Sprint 73 FINAL-REPORT / CLOSURE  
- Sprint 74 ARCHITECTURAL-CONSTRAINTS; ENGINEERING-DISCIPLINES  
- S74A-FINAL-REPORT; S74A-T-050  
- S74B-T-050; S74B-T-040 evidence  
- S74C-T-010…T-050; S74C-T-040 evidence  
- Milestone commit `8b90940`

### E. Gaps discovered

1. **Sprint 68 pack staleness:** Portable pack README/START-HERE / some DoD checkboxes still read as pre-implementation; authoritative outcome is top-level `sprint-68-closeout.md` (**COMPLETE** / **CERTIFIED**). Pack lacks its own `SPRINT-68-CLOSURE.md` / `STATUS.md` / `PLAN.md`.  
2. **Sprint 69 incomplete formal close:** STATUS Phases 1–5B done; Phase 6 certification closeout unchecked; no `sprint-69-closeout.md`; top-level/README still “Planned”; one “Sprint 69 complete” commit was reverted then baseline restabilised (`6853376`).  
3. **Sprint 70 dual narrative:** Visual-planning charter vs QA-methodology closure; Benchmark/Validation Review **in-repo paths** unresolved at close; visual slice log not reconciled; dual decision ID namespaces (`S70-D0x` authoritative at closure; `D70-xx` visual-planning log).  
4. **Sprint 71 sample size:** 11 reviews vs ~15–20 target (documented Partial at close); Benchmark/Validation in-repo paths still unresolved.  
5. **Sprint 72 broader suite:** Primary objective closed with continuous verification; **28** known failures in broader evidence-centred suite at close — do not read as “full green.” Asset-byte persistence deferred (PB-FA-001 lineage).  
6. **Test counts** are not a single continuous series (68: **469** vNext; 69 NOTES: **536** renderer; 74C: **288** tracked `*.test.js`) — different scopes/methods.  
7. **Stale “OPEN” headers** in some mid-programme docs (e.g. older 74B `decisions.md` header; some constraints notes) despite programme close — authoritative closure is **S74-D11** / **S74C-T-050** / milestone `8b90940`. No dedicated `docs/sprints/sprint-74-closeout.md` or `sprint-74b-closeout.md` / `sprint-74c-closeout.md` (closure lives in pack T-050 / STATUS).

---

## Report to operator (meta)

| Item | Content |
| ---- | ------- |
| **Sources reviewed** | Closeouts, packs 68–74C, decisions, constraints, disciplines, certification artefacts, git since 2026-07-21; parallel pack audits [68–71](ed644e18-3de8-4b99-a7ac-3794ae821d6a) · [72–74](5083c643-b5c6-40c9-8002-4bb0c1b5d520) |
| **Major programmes** | 68 certified vNext coherence; 69 grammar; 70–71 QA/attribution; 72 evidence-centred productisation; 73 Workflow Resources; 74A–C rationalisation + hygiene |
| **Major architectural milestones** | ADR-012; sole grammar route; sole vNext; sole partial+assemble; Workflow Resources; Historical Retention |
| **Methodology evolution** | Pack discipline → certification → attribution → Engineering Disciplines + constraints → inventory-decide-plan-execute |
| **Evidence confidence** | High overall; medium on 69 formal closeout and 70 dual-track reconciliation |
| **Gaps** | Listed in Appendix E (refined after pack audits) |

**This document is the evidence base for a later executive report. It is not that executive report.**
