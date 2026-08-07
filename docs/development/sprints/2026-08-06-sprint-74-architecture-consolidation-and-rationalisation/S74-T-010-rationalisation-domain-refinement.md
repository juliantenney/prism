# S74-T-010 — Rationalisation Domain Refinement

**Sprint:** 74 — Architecture Consolidation and Rationalisation  
**Task:** S74-T-010  
**Status:** **Done** (2026-08-06)  
**Mode:** Planning refinement only — **no runtime code changes**  
**Authority:** [S74-T-001-codebase-rationalisation-discovery.md](S74-T-001-codebase-rationalisation-discovery.md)  
**Governing constraints:** [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) (`S74-D03`…`S74-D05`)  
**Decision:** [S74-D02](decisions.md#s74-d02-recommended-first-implementation-domain--authoring-export-path-integrity) (recommended 74A; pack not opened)

---

## Operator supersession (2026-08-06)

This refinement recommended Sprint 74A as docs + production-browser verification + Legacy **inventory** — **not** Legacy deletion. That recommendation text is **preserved**.

Subsequent operator decisions:

1. **`S74-D07`** — programme principle: one definitive codebase around established functionality; Compatibility only for current product requirements.  
2. **`S74A-D02`** — vNext replaces the obsolete learner renderer; **removal** after inventory is the intended 74A outcome.

Discovery content below is not falsified; implementation packs follow the later decisions.

### Post-74A implementation refinement (2026-08-07)

Sprint 74A showed that architectural ambiguity can arise from **duplicate ownership inside the current supported path**, not only from obsolete or deprecated implementations.

For Sprint 74B, the implementation methodology is therefore refined:

- begin with a **generation ownership and duplicate-path inventory**;
- establish definitive ownership before removal or consolidation;
- identify multiple transformations or validators that believe they own the same responsibility;
- distinguish obsolete code from current code with duplicated ownership;
- remove or consolidate only after ownership and behavioural responsibility are evidenced.

This refines the **methodology** for Domain B only. It does not change the approved Domain B scope, ordering, non-scope or programme boundaries.

The original Domain B planning text below remains **historical planning evidence**.

---

## 1. Executive summary

S74-T-001’s three-domain sketch is **directionally correct** but too loose for implementation. This refinement:

- **Keeps three domains** (does not merge into one mega-sprint).
- **Renames and narrows** each domain for ownership, stop conditions, and verification.
- **Removes “split / hygienise app.js” as a domain goal** — `app.js` work is allocated by coherent ownership across domains; most orchestration **stays in `app.js` permanently**.
- **Defers** Legacy renderer *removal*, schema SSOT relocation (`lib/schemas/`), Workflow Resource orphan *cleanup policy*, and PB-FA-004 product work out of early slices.
- **Recommends Sprint 74A** = **Authoring → learner export path integrity** (PB-FA-003-aligned): docs truthfulness, **production browser-path** / **generated browser artefact** verification, Legacy *inventory* — **not** Legacy deletion.

**Sprint 74A / 74B / 74C packs are not opened by this document.** Opening 74A requires **operator approval**.

---

## 2. Review of S74-T-001 findings

| T-001 claim | Refinement stance |
| ----------- | ----------------- |
| Supported path = Create → My Workflows → Authoring → vNext Preview/HTML/ZIP | **Affirmed** — primary verification spine |
| Legacy renderer = Compatibility | **Affirmed** — inventory in 74A; retirement only later with evidence |
| Bundle / browser-deployment consistency (PB-FA-003) | **Affirmed** — core of recommended 74A (production browser path; not “Node/browser runtime parity”) |
| Stale export docs / README drift | **Affirmed** — in 74A (low risk, high clarity) |
| Original 74B = “Prompt / contract / app.js surface hygiene” | **Challenged** — mixes three concerns; “app.js surface” is not a coherent owner |
| Original 74C = WR orphans + fixtures + scratch + PB-FA-004 adjacent | **Challenged** — different risk/policy profiles; split product/research from hygiene |
| Candidate modularisation of `app.js` by size | **Rejected** — extract only by ownership; no dedicated split sprint |

**Programme goal:** smallest coherent slices, lowest architectural risk, highest confidence, easiest verification — not preserving T-001 labels for their own sake.

---

## 3. Refined implementation domains

### Domain changes vs T-001

| T-001 label | Refined label | Change |
| ----------- | ------------- | ------ |
| 74A Renderer & export path integrity | **74A Authoring → learner export path integrity** | Narrowed: no Legacy deletion; no schema file moves; docs + production browser-path verification + inventory |
| 74B Prompt / contract / app.js hygiene | **74B Generation-contract & capture-validator hygiene** | Renamed; `app.js` not the theme — only deprecated/legacy *generation* surfaces |
| 74C WR residuals, fixtures, repo hygiene | **74C Repository & fixture hygiene** | Narrowed: scratch/archive audit + PB-S-001 fixtures; WR orphan *policy* remains research (PB-R-008); PB-FA-004 excluded |

No merge of A+B+C. No fourth domain opened. Optional later domain (Legacy retirement) only after 74A inventory evidence — may become **74A Phase 2** or a **new 74D**, not assumed here.

---

### Domain A — Authoring → learner export path integrity *(recommended Sprint 74A)*

#### Purpose

Make the **supported** Authoring → learner HTML/ZIP path **true in documentation**, **provable on the production browser path**, and **clearly distinguished** from the Legacy compatibility branch — without removing Legacy yet.

#### Responsibilities

- Declare and document **vNext as the supported page export path**
- Strengthen **generated browser artefact** rebuild + **production browser-path** verification (Sprint 72 lesson: Node-based tests ≠ deployment proof)
- Inventory **when Legacy is still invoked** (page vs non-page artefacts)
- Align operator-facing docs (export behavior, README nav labels) with current UI
- Touch `app.js` **only** for export-routing clarity / test seams needed by verification — no mass extraction
- Obey binding constraints: [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) (`S74-D03`…`S74-D05`)

#### Included modules / surfaces

| Include | Role |
| ------- | ---- |
| `app.js` — `runUtilityPageExportPipeline`, `runLearnerRendererVNextExport`, `composeStandaloneVnextLearnerExport`, `handleUtilitiesGenerate`, download/open handlers | Export orchestration |
| `lib/learner-renderer-vnext/*` + generated `learner-renderer-vnext-browser.js` | Supported **browser-loaded** renderer (generated browser artefact) |
| `scripts/build-learner-renderer-vnext-browser.js` + npm `pretest:learner-renderer-vnext` | **Development/test tooling** for artefact generation |
| `lib/learner-package.js` / ZIP helpers (read-only unless browser-path bug found) | Package path |
| `docs/architecture/renderer-export-behavior.md`, root `README.md` (nav labels), architecture pointers | Doc truth |
| Focused production-browser-path / vNext export tests | Verification |

#### Excluded modules / surfaces

- Legacy HTML builder *deletion* (`buildUtilityStructuredHtml` and related)
- Prompt Studio / Prompt Library product changes
- Workflow Resources orphan cleanup implementation
- Schema file relocation to `lib/schemas/`
- Design Page compose vs partial contract merge
- Deprecated prompt-block removals (Domain B)
- Scratch/`_archive` deletion (Domain C)
- PB-FA-004 manually uploaded graphics
- Renaming `utilities*` ids to `authoring*`

#### Supported product paths affected

Create Workflow → My Workflows → **Authoring** → Assemble → **Preview (vNext)** → HTML / ZIP / Open in New Tab.

#### Production browser-path impact

**Primary.** Generated browser artefact rebuild + `window.PRISM_LEARNER_RENDERER_VNEXT` **browser-loaded** path must stay green. UI may gain clearer “supported vs compatibility” labeling later only if scoped and approved inside 74A AC.

#### Development/test-tooling impact

Focused **Node-based test evidence** remains useful for shared logic; new/extended suites must **not** claim that Node-based tests alone prove the **production browser path**.

#### Schema impact

**None intended.** No schema version bumps; no SSOT file moves.

#### Workflow impact

**None intended** to workflow JSON / runstate schema. Assemble-from-run remains as-is unless a verified export bug requires a narrow fix.

#### Tests protecting the area

- `tests/learner-renderer-vnext-*.test.js` (Node-based test evidence)
- Authoring/export focused suites (including any production-browser-path style tests)
- Sprint 70/73 focused suites that exercise preview/export regeneration (as regression net)
- Build script / pretest hook for **generated browser artefact** (development/test tooling)

#### Known technical debt

- Stale `renderer-export-behavior.md` (legacy-only narrative)
- README tab vocabulary drift
- Generated browser artefact can stale while Node-based tests pass
- Legacy still selectable without clear “compatibility” framing

#### Expected cleanup actions

- Rewrite/replace export-path docs to describe **vNext supported** + **Legacy compatibility**
- Align README main-section labels with current UI (Authoring, etc.)
- Ensure rebuild discipline for the **generated browser artefact** is documented and test-gated against the **production browser path**

#### Expected consolidations

- Single documented “supported export path” narrative
- Optional: consolidate duplicate *documentation* of export steps (not code merge)

#### Expected removals

- **None** of Legacy runtime code in 74A  
- Remove only **false claims** from docs (not code)

#### Documentation updates required

- `docs/architecture/renderer-export-behavior.md`
- Root `README.md` (user-facing nav / Authoring)
- Sprint 74A pack (when opened) linking PB-FA-003
- Pointers from `docs/architecture/learner-renderer-vnext.md` if cross-links are stale

#### Verification approach

1. Focused Node-based suites for vNext export/compose (**test evidence**, not deployment proof)  
2. Explicit **production browser-path** check after generating the browser artefact  
3. Browser smoke: Authoring Preview + HTML + ZIP on a known page fixture  
4. Doc review: supported path matches UI default (`utilitiesRendererVersion` default `vnext`)

#### Acceptance criteria (outline)

| ID | Criterion |
| -- | --------- |
| AC-A1 | Architecture/export docs state vNext as supported page path and Legacy as compatibility |
| AC-A2 | Production browser-path / generated-artefact verification is recorded and automated or checklist-gated |
| AC-A3 | Inventory note lists Legacy invocation cases (page / non-page / UI) with evidence |
| AC-A4 | Focused suites named in 74A plan remain green; no broad-suite greenwashing |
| AC-A5 | No Legacy code deleted; no schema moves; no WR orphan cleanup; browser-only/static deployment preserved |

#### Stop conditions

- Stop if fixing browser-deployment consistency requires redesigning the renderer architecture  
- Stop if Legacy deletion is requested without inventory evidence  
- Stop if scope expands into prompt-contract hygiene or fixture enrichment  
- Stop and escalate if **browser-loaded** behaviour diverges from what Node-based tests imply, without a clear owning fix  
- Stop if a change would require backend, runtime Node, or non-static deployment

#### Dependencies

- Sprint 67/73 closed evidence (link only)  
- PB-FA-003 as backlog alignment  
- Operator approval to open Sprint 74A pack  

#### Estimated implementation risk

**Low–medium.** Docs + tests + inventory are low risk; any export routing fix in `app.js` is medium and must stay narrowly scoped.

---

### Domain B — Generation-contract & capture-validator hygiene *(recommended Sprint 74B)*

#### Purpose

Reduce **dead or dual generation surfaces** (deprecated prompt builders, legacy capture validators that always `{ ok: true, legacy: true }`) without changing instructional pedagogy or the Authoring export path.

The first implementation activity must establish **definitive ownership** across prompt generation, generation contracts, capture validation, compose / partial contract roles, and any duplicate transformations or “last writer” behaviour — including cases where multiple **current** stages still believe they own the same responsibility.

#### Responsibilities

- Inventory `@deprecated` prompt helpers and call sites in `app.js` / contracts  
- Inventory legacy capture-validator shims  
- Map generation ownership and duplicate paths **before** deletion or consolidation  
- Removal or consolidation follows **ownership proof**, not just zero-call-site proof. A still-called surface may represent obsolete or duplicate ownership; a seemingly unused surface must still be checked for dynamic/browser/test use  
- Clarify compose vs partial Design Page contract *roles in docs* before any code merge  
- Do **not** treat “make app.js smaller” as a success metric

#### Included modules / surfaces

| Include | Role |
| ------- | ---- |
| `app.js` deprecated PR-W* prompt wrappers and their call sites | Hygiene target |
| `app.js` legacy capture validator returns | Compatibility inventory |
| Relevant `lib/ld-*-contract.js` / compose vs partial modules | Boundary clarity |
| Focused generation/contract tests | Guardians |

#### Excluded modules / surfaces

- Learner-renderer-vNext internals  
- Workflow Resources persistence  
- Legacy HTML renderer deletion  
- Prompt Library IndexedDB model changes  
- Domain pack content rewrites  
- Broad UI–state pathway rewrite (full PB-S-004) — only if a *single* proven duplicate blocks B’s AC

#### Supported product paths affected

Create Workflow / Run prompt assembly; Prompt Studio where it shares builders. Authoring export should remain unchanged.

#### Production browser-path impact

Indirect — only if a removed helper was still on a live **browser-loaded** prompt path (must be proven unused first).

#### Development/test-tooling impact

Primary surface for contracts and prompt-assembly **Node-based test evidence**.

#### Schema impact

None intended. Contract *behaviour* unchanged for supported paths.

#### Workflow impact

None to persisted workflow schema. Prompt text generation must remain byte-stable for supported steps unless AC explicitly allows documented change.

#### Tests protecting the area

- Stage/contract focused suites (`ld-*`, page enrich, compose/partial)  
- Workflow generation / prompt assembly tests that pin supported builders  

#### Known technical debt

- Many `@deprecated` wrappers still present  
- Legacy validators that accept anything  
- Dual compose/partial Design Page contracts  

#### Expected cleanup actions

- Call-site audit spreadsheet/note (**ownership / duplicate-path inventory first**)  
- Delete or consolidate only after **ownership proof** (zero call sites alone is insufficient; still-called surfaces may be obsolete/duplicate ownership)  
- Document remaining shims as Compatibility with owner

#### Expected consolidations

- Prefer **documentation of ownership** over merging compose/partial in the first B slice  
- Optional thin consolidation only where duplication is proven, an ownership matrix exists, and tests exist

#### Expected removals

- Unused deprecated wrappers  
- Dead aliases with no callers  

#### Documentation updates required

- Contract ownership note (compose vs partial)  
- Backlog PB-S-004 partial progress note if applicable  

#### Verification approach

Focused contract/prompt tests + spot-check one Learning Design run prompt for a touched step family.

#### Acceptance criteria (outline)

| ID | Criterion |
| -- | --------- |
| AC-B1 | Inventory of deprecated helpers + legacy validators recorded |
| AC-B2 | Removals limited to proven-unused surfaces; supported builders unchanged |
| AC-B3 | Focused contract/generation suites green |
| AC-B4 | No Authoring export behaviour change |

#### Stop conditions

- Stop if removal requires rewriting live pedagogy prompts without fixtures  
- Stop if compose/partial merge is attempted without ownership matrix + tests  
- Stop if scope drifts into export-path or fixture enrichment  

#### Dependencies

- Prefer **after 74A** so “supported path” is documented (reduces confusion)  
- Technically can proceed in parallel with low coupling — **sequenced after 74A for programme clarity**

#### Estimated implementation risk

**Medium.** Silent prompt drift is the main hazard.

**Silent ownership drift** — multiple current stages or validators may believe they own the same transformation or validation responsibility.

Mitigation: ownership inventory before modification; call-path tracing; behavioural invariants; focused regression coverage; no merge/consolidation without an ownership matrix.

---

### Domain C — Repository & fixture hygiene *(recommended Sprint 74C)*

#### Purpose

Reduce **false confidence and repository noise**: enrich fixtures for known broad-suite failures (PB-S-001) and remove/relocate **proven-unused** scratch/archive artefacts — without implementing WR orphan cleanup or new product features.

#### Responsibilities

- Reference audit for `tmp-*`, root scratch HTML, `_archive/`, unused captures  
- Fixture enrichment targeting the **documented** PB-S-001 failure class  
- Record what must **not** be deleted (certification `artifacts/`, sprint evidence packs)  
- WR orphan/mixed-data: **research note only** unless PB-R-008 yields an approved policy (then a *later* sprint)

#### Included modules / surfaces

| Include | Role |
| ------- | ---- |
| `tests/fixtures/` + failing evidence-centred suite named in PB-S-001 | Fixture work |
| Root/repo scratch paths listed in T-001 | Hygiene |
| `_archive/`, selected `archive/` (after reference audit) | Candidate removal |

#### Excluded modules / surfaces

- Runtime feature changes  
- `lib/prism-workflow-resources.js` behaviour changes (unless a fixture-only test helper)  
- PB-FA-004 product implementation  
- `utilities/visual-enhancement-utility/` product changes  
- Sprint pack historical `experiments/` (leave as historical evidence unless pack owners agree)

#### Supported product paths affected

None intended for runtime. CI/operator confidence only.

#### Production browser-path impact

None intended.

#### Development/test-tooling impact

Primary — broader suite health for the targeted failure class (Node-based test evidence).

#### Schema impact

None.

#### Workflow impact

None.

#### Tests protecting the area

- The specific suite(s) cited by PB-S-001  
- Focused suites must remain green (do not “fix” fixtures by weakening focused guards)

#### Known technical debt

- 28 known pre-existing failures (PB-S-001)  
- Scratch files at repo root  
- Unclear archive retention policy  

#### Expected cleanup actions

- Delete/move scratch after `rg`/reference proof  
- Enrich fixtures for intellectual_coherence_bridge (or documented root cause)  

#### Expected consolidations

- None architectural  

#### Expected removals

- Proven-unused scratch/archive artefacts only  

#### Documentation updates required

- PB-S-001 status update when suite health changes  
- Short hygiene log of deleted paths  

#### Verification approach

Re-run targeted suite; confirm focused S73/S70/vNext suites still green; list deleted paths in sprint note.

#### Acceptance criteria (outline)

| ID | Criterion |
| -- | --------- |
| AC-C1 | Reference audit recorded before any deletion |
| AC-C2 | PB-S-001 targeted failures reduced or root-caused with fixtures (no silent skip) |
| AC-C3 | Focused guardian suites remain green |
| AC-C4 | No WR orphan auto-delete; no PB-FA-004 |

#### Stop conditions

- Stop if fixture “fixes” hide real product regressions  
- Stop if deletion targets sprint evidence or certification artefacts  
- Stop if orphan cleanup implementation is requested without PB-R-008 policy  

#### Dependencies

- Can follow 74A/74B; lowest coupling to export path  
- PB-S-001 understanding  

#### Estimated implementation risk

**Low** for scratch deletion (with audit); **medium** for fixture enrichment (can mask bugs if careless).

---

## 4. app.js responsibility allocation

**Principle:** Binding — [S74-D05](decisions.md#s74-d05-appjs-rationalised-by-ownership-not-size) / [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) Constraint 3. No dedicated “split app.js” sprint. Extract **only** by coherent ownership, and only when a domain’s AC requires it. Most orchestration **remains in `app.js` permanently**.

| Responsibility | Current location | Target owner | Proposed Sprint | Risk | Notes |
| -------------- | ---------------- | ------------ | --------------- | ---- | ----- |
| Tab routing / shell UI wiring | `app.js` `switchTab`, els | **Remain `app.js`** | — | Low | Permanent shell |
| Workflow CRUD / LS persistence | `app.js` | **Remain `app.js`** | — | High if moved | Not in 74A–C |
| Runstate / capture orchestration | `app.js` | **Remain `app.js`** | — | High if moved | Permanent |
| Domain pack prompt assembly (supported) | `app.js` + `lib/*-contract.js` | Contracts in `lib/`; orchestration in `app.js` | **74B** (thin wrappers only) | Medium | Extract wrappers only if unused |
| Deprecated prompt builders | `app.js` | Delete if unused; else keep marked Compatibility | **74B** | Medium | Ownership = generation hygiene |
| Legacy capture validators `{ legacy: true }` | `app.js` | Inventory; thin only with tests | **74B** | Medium | Do not silently tighten without fixtures |
| Authoring export pipeline routing | `app.js` `runUtilityPageExportPipeline` et al. | **Remain `app.js`** (calls into `lib/`) | **74A** (narrow edits only) | Medium | Prerequisite: none; extraction not required for 74A |
| Legacy structured HTML builders | `app.js` `buildUtilityStructuredHtml`… | **Remain** until retirement evidence | Inventory **74A**; removal **later** | High | Not 74A removal |
| vNext export compose bridge | `app.js` `runLearnerRendererVNextExport` / `composeStandaloneVnextLearnerExport` | **Remain `app.js`** calling browser/`lib` APIs | **74A** | Medium | Do not relocate for size |
| Graphics / Video / Resources UI handlers | `app.js` + `utilities-visual-jobs-workspace.js` | Workspace lib + `app.js` event glue | — (Sprint 73 done) | Low | Out of 74A–C unless regression |
| Workflow Resources rehydrate on generate | `app.js` + `lib/prism-workflow-resources.js` | Owner stays lib; glue in `app.js` | — | Low | Do not reopen S73 |
| Prompt Library UI glue | `app.js` + `library.js` | **Remain** | — | Low | Out of scope |
| Test API hooks (`prismTestApi.*`) | `app.js` | **Remain `app.js`** | 74A/B as needed | Low | Add seams only when verification requires |

### Extraction guidance

| Kind | Rule |
| ---- | ---- |
| **Prerequisites** | None required before opening 74A |
| **As part of a domain sprint** | Only deprecated-wrapper deletion (74B); optional tiny export test seams (74A) |
| **Remain permanently in `app.js`** | Shell, workflow/runstate orchestration, Authoring handler wiring, export *routing*, test hooks |

---

## 5. Cross-domain dependencies

```text
74A (export path integrity)
  │
  │  documents supported path; reduces wrong-target cleanup
  ▼
74B (generation-contract hygiene)
  │
  │  independent of fixtures; avoid parallel large doc churn
  ▼
74C (repo & fixture hygiene)

WR orphan cleanup ──► blocked on PB-R-008 policy (not 74A–C implementation)
Legacy renderer deletion ──► blocked on 74A inventory (+ optional later sprint)
PB-FA-004 ──► product backlog (not 74A–C)
Schema SSOT move ──► needs further discovery (not 74A–C)
```

| From → To | Dependency type |
| --------- | --------------- |
| 74A → 74B | Soft (clarity); not a hard code dependency |
| 74A → Legacy retirement | Hard evidence dependency |
| 74B → 74A | Soft sequencing preference |
| 74C → 74A/B | Soft; can run later; must not weaken focused suites |
| 74C → PB-R-008 | Hard for any orphan *deletion* |

---

## 6. Proposed implementation order

1. **Sprint 74A** — Authoring → learner export path integrity  
2. **Sprint 74B** — Generation-contract & capture-validator hygiene  
3. **Sprint 74C** — Repository & fixture hygiene  

**Rationale:** 74A maximises confidence in the supported product spine with lowest architectural risk. 74B next isolates generation debt without touching export. 74C last avoids using fixture work to “prove” export health and keeps deletion behind audits.

**Rejected alternatives:**

| Alternative | Why rejected |
| ----------- | ------------ |
| 74C first (scratch/fixtures) | Does not harden supported architecture; fixture work can mask export issues |
| 74B first | Higher prompt-drift risk before supported-path docs and production browser-path verification exist |
| Merge A+B | Couples export and generation; larger blast radius |
| Dedicated app.js split sprint | Size-driven; violates ownership rule (`S74-D05`) |

---

## 7. Recommended Sprint 74A

**Name:** Authoring → learner export path integrity  
**Backlog alignment:** PB-FA-003 (pipeline integrity / production browser-path & generated-artefact consistency)  
**Slice:** Docs truth + production browser-path / artefact verification + Legacy **inventory**  
**Explicit non-goals:** Legacy deletion; schema moves; WR orphans; prompt-wrapper deletion; id renames; backend or runtime Node  
**Governing constraints:** [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) 

**Open only after operator approval.** Do not create the 74A pack in this task.

---

## 8. Recommended Sprint 74B

**Name:** Generation-contract & capture-validator hygiene  
**Backlog alignment:** Partial PB-S-004 (duplicate/legacy pathways) — generation surfaces only  
**Slice:** Inventory + remove proven-unused deprecated helpers; document remaining shims  
**Explicit non-goals:** Pedagogy redesign; compose/partial forced merge; export-path changes  

**First task (when the 74B pack is opened):** Generation ownership and duplicate-path inventory — map responsibility before any deletion or consolidation. No final task ID assigned here; Sprint 74B is **not opened**.

**Methodology refinement:** See [Post-74A implementation refinement (2026-08-07)](#post-74a-implementation-refinement-2026-08-07). Scope, ordering, non-scope and programme boundaries are unchanged.

---

## 9. Recommended Sprint 74C

**Name:** Repository & fixture hygiene  
**Backlog alignment:** PB-S-001; scratch hygiene; PB-R-008 remains research for orphans  
**Slice:** Reference-audited deletions + targeted fixture enrichment  
**Explicit non-goals:** PB-FA-004; automatic WR orphan deletion; runtime features  

---

## 10. Risks

| Risk | Mitigation |
| ---- | ---------- |
| 74A quietly becomes Legacy deletion | Stop condition + AC-A5 |
| Production browser-path checks skipped “because Node-based tests are green” | AC-A2 mandatory |
| 74B prompt drift | Call-site proof + focused golden prompts |
| 74B silent ownership drift (multiple current stages/validators claim the same responsibility) | Ownership inventory before modification; call-path tracing; behavioural invariants; focused regression; no merge without ownership matrix |
| 74C fixture masking | Keep focused guardians authoritative |
| Premature app.js extraction | Allocation table + `S74-D05` — remain in `app.js` by default |
| Operator opens all three at once | Programme order + planning principle |
| Misreading dual module surfaces as two runtimes | `S74-D03` — browser-only; Node is tooling |

---

## 11. Acceptance criteria outline

See per-domain **AC-A***, **AC-B***, **AC-C*** tables above. Programme-level:

| ID | Criterion |
| -- | --------- |
| AC-P1 | Each opened sub-sprint has approach, ownership, AC, stop conditions before coding |
| AC-P2 | Focused suites remain the quality gate (no broad-suite greenwashing) |
| AC-P3 | Sprint 73 Workflow Resources behaviour not reopened as “cleanup” |

---

## 12. Verification strategy

| Layer | Use |
| ----- | --- |
| Focused Node-based suites | Domain guardians — **test evidence** about shared logic |
| Production browser path | Mandatory for 74A export / generated-artefact work — **deployment confidence** |
| Doc review | 74A path narrative vs UI default; one supported path labelled |
| Inventory artefacts | 74A Legacy usage; 74B deprecated call sites; 74C deletion candidates |
| Continuous verification (`S72-D14`) | On any regression: stop, fix owning layer, add focused coverage |

Do **not** combine unrelated suite totals into a fabricated grand total.  
Do **not** treat Node-based green results as proof of the production browser path.

---

## 13. Stop conditions (programme)

- Stop opening further domains if 74A fails AC or expands into redesign  
- Stop any deletion without reference audit + classification evidence  
- Stop if a domain requests `app.js` split-by-size (`S74-D05`)  
- Stop if product features (PB-FA-002/004) are pulled into rationalisation “while we’re here”  
- Stop if a change would require backend, runtime Node, or non-static deployment (`S74-D03`)  

---

## 14. Open questions

1. After 74A inventory: is Legacy still required for any **supported** non-page artefact, or only historical/debug?  
2. Should Legacy retirement be **74A Phase 2**, a **74D**, or remain Compatibility indefinitely?  
3. For 74B: is compose/partial merge ever in-scope, or docs-only for the first slice? *(Recommendation: docs-only first.)*  
4. For 74C: minimum bar for PB-S-001 — fail-count reduction vs full green?  
5. Operator preference: open 74A immediately after approval, or require a one-page 74A charter draft inside Sprint 74 wrapper first? *(This task does not create that pack.)*

---

## 15. Recommendation

1. Accept the **refined three-domain programme** (names/boundaries above).  
2. Treat **Authoring → learner export path integrity** as **Sprint 74A**.  
3. Sequence **74A → 74B → 74C**.  
4. Keep `app.js` as permanent orchestrator under `S74-D05`; extract only unused generation wrappers under 74B.  
5. Obey [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) (`S74-D03`…`S74-D05`).  
6. **Do not open** 74A/B/C packs until operator approval.  
7. Next action after approval: **Open Sprint 74A** (separate pack) using Domain A’s AC/stop conditions as the charter seed.

---

## Explicit non-actions taken

- No runtime code changes  
- No file moves / renames / refactors  
- No Sprint 74A / 74B / 74C packs created  
- Sprint 74 PLAN not switched into implementation mode beyond marking T-010 complete  
