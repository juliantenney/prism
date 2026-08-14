# S77-T-012 — DLA prompt-contract architecture implementation plan

**Task:** S77-T-012  
**Status:** **COMPLETE** (2026-08-14) — implementation **PLANNED**, not executed  
**Mode:** IMPLEMENTATION PLAN ONLY — no production, assembler, P05, test, schema, validator, or generation changes  
**Depends on:** [T-010](S77-T-010-dla-model-visible-prompt-inventory-and-architecture-diagnostic.md) · [T-011](S77-T-011-dla-prompt-contract-architecture-solution-design.md)  
**Live baseline:** `76-DLA-PARTIAL-9` · inventory HEAD `0b5402d`

Supporting ledgers:

- [component → section](S77-T-012-dla-component-section-migration.csv)
- [invariant equivalence](S77-T-012-dla-invariant-equivalence-ledger.csv)
- [test migration](S77-T-012-dla-test-migration.csv)
- [section size budget](S77-T-012-dla-section-size-budget.csv)

---

## 0. Stance

T-011 is authoritative. Option 3: **build canonical assembler behind the live path, switch atomically, then retire old authorities.**

Behaviour change is **not** authorised for P01, P01-R1, P02, P03, P04 evidence semantics, T-033, T-031, Sprint 72. Do not add DLA “must be solvable.”

P05 is **not** a separate first PR. Single injection is the Copy consequence of the assembler switch.

DLA pilot only.

---

## 0.1 U-1 / U-2 / U-3 handling

| ID | Class | Plan |
| -- | ----- | ---- |
| **U-1** | **AUTHORITY CLEANUP** | Pack Task line “It is not a learning-design, sequencing, archetype-selection, or session-arc step” currently competes with T-033. **Target wording class:** keep **consume-not-replan** (beats, page-level archetypes, session arc stay EP). **Remove** the claim that DLA is not learner-production design. Canonical T-033 stays in **§4** from current PB-003 step 1 (T-044 sentences). Do **not** invent new learner behaviour. Gate A: §9 must not contain a sentence denying DLA production design. |
| **U-2** | **PRESERVE OVERLAY** | DLA-WB-06a/08/12/18 and G1–G5 remain in **§9** when workbook/self-directed flags apply. Do **not** delete mandatory rows because they tension with P01. Record residual conflict for a **later semantic review** if still observable after architecture is explicit. First migration: **behaviour-preserving overlay**. |
| **U-3** | **STRUCTURAL ALIGNMENT** | Pack Output `activities, outcome_alignment, delivery_notes` **retires** as emit dialect. Authoritative emit is **§10 partial-page envelope**. Workbook flags (`workbook_contract_applied`, duration, consolidation) may remain as **overlay obligations / optional generation_notes** only if they already fit schema; do **not** add schema fields. `LEARNER_PAGE_DLA_ACTIVITIES_SCHEMA_OUTPUT_LINE` consolidates into §10. |

---

## 1. Current component → target section ledger

Complete table: [S77-T-012-dla-component-section-migration.csv](S77-T-012-dla-component-section-migration.csv).

**Mapped current inventory:** DLA-PB-001–024 (T-010) plus chain no-ops PB-025–028, dual-site mechanics PB-029–030.

**Unmapped live T-010 components:** **none.**

P05 mechanism (must not be hand-waved):

1. `buildWorkflowStepInstructions` prepends `buildDlaV2CopilotSchemaInstructions()` (contract+shape).
2. Core pack is assembled separately via `resolveStepPromptText`.
3. `applyWorkflowStepRuntimePromptAugmentations` runs on the **pack draft**, then `applyEpisodePlanDlaPopulationPromptBlockToDraft` appends contract+shape if skip-regex fails.
4. Skip looks for `DLA partial-page contract` on **pack body**, which does not include the Copy prepend — so Copy always dual-injects.
5. Studio uses augmentations only → one pair.

Target: **never** append PB-003/004 from the v2 branch of `applyEpisodePlanDlaPopulationPromptBlockToDraft` when the canonical assembler already ran.

---

## 2. Invariant preservation ledger

Complete table: [S77-T-012-dla-invariant-equivalence-ledger.csv](S77-T-012-dla-invariant-equivalence-ledger.csv).

Implementation may compress wording **after** an operator-visible OLD vs TARGET review (§18). Every protected invariant remains traceable to one canonical home.

**Protected invariants mapped:** **YES** (all T-011 rows + checklist diagnostic spec).

---

## 3. Source-code architecture

**Smallest inspectable form:** keep the existing UMD file as the façade. Do **not** add a framework or extra `index.html` script unless the file becomes unmaintainable after split.

| Piece | Location |
| ----- | -------- |
| Façade / version / exports | `lib/ld-dla-page-enrich-contract.js` |
| Title library (unchanged API) | `lib/ld-activity-title-contract.js` |
| Overlay source (gated §9) | DLA `promptTemplate` in `domains/learning-design/domain-learning-design-step-patterns.md` **or** extracted overlay string builder in the same lib reading pack flags |
| Path wrap | `app.js` only |
| Conditional prompt **blocks** | existing libs (`ld-guided-learning-scaffold.js`, EQF, `ld-table-fidelity.js`, `ld-math-render.js`) — **called by assembler**, not appended as mini-contracts |

### Recommended functions (names illustrative but intended)

```text
DLA_CANONICAL_SECTION_ORDER = [
  "role","inputs","sources","production","task_inputs",
  "commissioning","evidence","providers","overlay","output","examples"
]

buildDlaSectionRole(ctx)
buildDlaSectionInputs(ctx)
buildDlaSectionSources(ctx)
buildDlaSectionProduction(ctx)      // includes activityTitleGuidanceBlock() ONCE
buildDlaSectionTaskInputs(ctx)
buildDlaSectionCommissioning(ctx)   // includes buildInstructionalArchetypePlanningGuidance()
buildDlaSectionEvidence(ctx)
buildDlaSectionProviders(ctx)
buildDlaSectionOverlay(ctx)         // empty string unless ctx.workbookOverlay
buildDlaSectionOutput(ctx)
buildDlaSectionExamples(ctx)

assembleDlaCanonicalContract(ctx) → string  // joins sections in order, each at most once

// Rollback / Phase A dual-run:
buildDlaPageEnrichContractBlock()           // KEEP until Phase D; legacy monolith
buildCanonicalDlaPageShapeSnippet()         // KEEP until Phase D
```

**Context object (`DlaAssembleCtx`):**

| Field | Role |
| ----- | ---- |
| `path` | `"copy"` \| `"studio"` — **must not** change §§1–11 |
| `pageEnrichmentV2` | must be true for canonical path |
| `partialPageOutputs` | default true |
| `learnerPage` | gate scaffold / OUTPUT copy fields into **§4** |
| `selfDirected` | gate timeline / some WB |
| `workbookOverlay` | gate **§9** |
| `tableFidelityDla` | insert table block into **§6** |
| `mathRender` | insert into **§10** |
| `includeExamples` | default true |

**Circular deps:** section builders call title + archetype functions already in-file or via existing `require("./ld-activity-title-contract.js")`. Scaffold/EQF/table/math remain separate libs; assembler **requires** them; they must **not** require the assembler.

**Do not** split into 11 files for Phase A.

---

## 4. Assembler contract

```text
assembleDlaCanonicalContract(ctx) → {
  text,                    // §§1–11 joined
  sections: { role, ... }, // for tests
  version,                 // CONTRACT_VERSION
  multiplicity: 1
}
```

Guarantees:

- Deterministic `DLA_CANONICAL_SECTION_ORDER`.
- Each semantic section **at most once**.
- Gated modules **concatenate into** the named section string, not after §11.
- Copy and Studio call this **once** with equivalent ctx (path ignored for section text).
- Wrappers cannot pass semantic overrides except documented gates.

**Tests (new):** order of headings; count of each heading = 1; `text` byte-identical for `{...ctx, path:"copy"}` vs `path:"studio"`.

---

## 5. Copy migration

**Current (T-010):**

```text
PB-001 → PB-002 (partial + fence) → PB-003+004 prepend
→ PB-007 runner → PB-008 pack → PB-010…017 scaffolds
→ PB-003+004 append (P05) → PB-018 → PB-019
```

**Target:**

```text
PB-001 → PB-002 wrapper only (no contract pair)
→ assembleDlaCanonicalContract(ctx) ONCE
→ PB-007 runner (UX only)
→ pack = Context + §9 overlay only (or overlay already inside assembler)
→ PB-018 → PB-019
```

| Old call site | Fate |
| ------------- | ---- |
| `buildDlaV2CopilotSchemaInstructions` | **REPLACED** by assembler (or becomes assembler wrapper) |
| `applyEpisodePlanDlaPopulationPromptBlockToDraft` v2 contract/shape push | **REMOVED** when flag on |
| Same function title-guidance extra append | **REMOVED** (§4 already has titles) |
| Pack `promptTemplate` full 14k | **RETAINED AS DATA/OVERLAY** after generic move |
| Scaffold `apply*` on DLA | **RETAINED** as slot fillers invoked from assembler **or** no-op if assembler already included them |
| Fence/footer in PB-002/018 | **RETAINED AS WRAPPER** |

This **is** P05: Copy multiplicity of canonical contract = **1**.

---

## 6. Prompt Studio migration

Studio today: pack + augmentations including **one** contract+shape (no Copy prepend).

**Target:** same `assembleDlaCanonicalContract(ctx)` once; Studio chrome/footer only where the draft UI already differs.

**Equality test:** `assembleDlaCanonicalContract({...shared, path:"copy"}) === assembleDlaCanonicalContract({...shared, path:"studio"})` (byte-identical). Reconstruct Copy vs Studio **full** strings with T-010 successor; compare **canonical substring** not wrappers.

If learner-page gates differ between paths, that is a **bug**, not an allowed semantic split.

---

## 7. Domain / workbook overlay migration

Pack template (~14,279) subsection map:

| Pack slice | Class | Target |
| ---------- | ----- | ------ |
| Context: LOs, episode_plans provided | A generic | **§2** |
| Task: obligation population + **“not a learning-design step”** | D U-1 | **§2 consume-not-replan only**; delete competing denial of production design |
| Scaffold strings / SSOT floors | A | **§4** (scaffold module may still fill) |
| Consume beat order / do not replan archetypes | A | **§2** |
| Canonical contracts name-drops (table, materials-copy, math, scaffold) | A pointers | **§6/§10** one line each or rely on gated modules |
| Titles bullets | A | **§4** (retire pack copy) |
| `Define required_materials as … not bodies` | A | **§6** |
| IFP-04 inference gates (Evaluate-specific, KM-T05…) | B overlay | **§9** |
| IFP-05 AS-01..06 / AS-FAIL | B mixed | **§9**; AS-05 expected_output generic → **§4** |
| IFP-06 anti-spoiler | B | **§9** (and delayed disclosure already §8 — do not duplicate Sprint 72) |
| OBLIGATION POPULATION G1–G5 / DLA-WB-26..31 | B | **§9** (U-2 preserve) |
| DLA-WB-01..22 mandatory rows | B | **§9** |
| DLA-WB-19 30–70w | A | **§4** |
| Evidence sentences in notes | A | **§7** (retire from notes) |
| Output: `activities, outcome_alignment, delivery_notes` | C U-3 | **retire**; **§10** envelope |
| Output activities[] field laundry | C/A | **§10** field names; production fields already §4 |
| `defaultPromptNotes` | A/B mix | merge into §9 or retire duplicates |
| `userOptions` activity_pattern_mix etc. | B data | remain pack **parameters**; assembler interpolates into §9 if still model-visible |

**Target §9 size:** **6,000–10,000** characters when overlay gated on; **0** when off. Uncertainty **HIGH** (G1–G5 + WB rows are dense). Do not “trim pack” without this table.

---

## 8. Conditional modules

| Module | Target slot | Gate | Semantics vs detail | Independent authority today? |
| ------ | ----------- | ---- | ------------------- | ---------------------------- |
| Guided-learning scaffold | **§4** | learner-page SSOT | floors for copy fields | Yes-ish (PRE-EMIT) → become fill |
| EQF DLA | **§4/§6** | learner-page EQF flag | quality overlay | Mild → fill |
| Timeline sequencing | **§4** | self-directed | local reminder | Mild → fill |
| OUTPUT CONTRACT override | **§4+§10** | learner-page | field list | Competing → consolidate |
| Marx example | **§11** | learner-page | **REPLACE** | Example-as-contract |
| Table fidelity DLA | **§6** | DLA table-shape gate | spec intent | Mild |
| Math render | **§10** | DLA producer | notation | No |
| Source runner UX | wrapper | Copy | UX | Local reminder OK |
| Materials-copy / GAM depth / archetype **routing** | n/a | GAM-only | — | Do not insert on DLA |
| PB-020 / PB-021 | legacy / non-partial | flags | keep gated off default | Do not put in canonical v2 partial |

Rule: `apply*` for DLA either **no-ops** after assembler included the block, or **pass fragments into ctx** before assemble. They must not append after §11.

---

## 9. Output / shape migration

**§10 keeps (model still needs):**

- Envelope: `artifact_type`, `schema_version`, `assembly_state.current_stage`, `enriched_by`
- `activities[]` required **field names** (including `task_material_decision`, `evidence_decision`, `required_materials[]` purpose/specification)
- Forbidden: full-page replay, shell fields, `materials[].body`, `page_synthesis`, `learning_sequence`
- Schema line currently `LEARNER_PAGE_DLA_ACTIVITIES_SCHEMA_OUTPUT_LINE`

**Validators already close (do not restated as PRE-EMIT lists):** missing keys, empty purpose/spec, TMD/evidence objects present, some title patterns, bodies rejected.

**§11 one miniature:** dialect-aligned activity with TMD + `evidence_requirement` + one-line `required: false` contrast (today’s shape contrast sentence).

**Remove from 6,698 blob:** second title block; full archetype essay (moved to §6); duplicate forbidden list; verbose JSON once rules exist.

**Archetype-plan fields:** remain discoverable as **§6 lists** (`buildInstructionalArchetypePlanningGuidance`), not a second activity JSON.

**No schema change.** Validity tests: existing `validateDlaPartialPageCapture` / `page-dla-enrich` suites **KEEP UNCHANGED**.

---

## 10. Example migration

| Example | Action | Section | Illustrates | Deletion precondition |
| ------- | ------ | ------- | ----------- | --------------------- |
| Canonical shape JSON | **REDUCE** + **MOVE** | §11 | TMD, evidence_requirement, envelope | §10 field names exist |
| Marx OUTPUT CONTRACT JSON | **REPLACE** | §11 | cognition/bridge **after** rules | replacement miniature uses `material_type` not `type`; includes TMD |
| Title “Activity A1” forbids | **KEEP** | §4 | titles | — |
| Table GOOD pipe | **KEEP** | §6 via table module | table **specification** | wording stays DLA-spec |
| Archetype field skeletons | **KEEP** as lists | §6 | plan completeness | not duplicated in §11 JSON |

No example introduces a new contract. Do not write final replacement Marx JSON in this plan beyond: one activity object, `material_type`, TMD, `evidence_decision`.

---

## 11. Title consolidation

Four live copies: PB-003 nest, PB-004 nest, ×2 injections, plus optional `applyEpisodePlan…` title append if heading missing.

**Keep:** `buildDlaActivityTitleGuidance()` once inside **§4**.  
**Retire:** nest in shape; extra append; pack title bullets.  
**Validators:** `lib/ld-activity-title-contract.js` + `page-dla-enrich.js` **unchanged**.  
**Tests:** `ld-activity-title-contract.test.js` — assert guidance appears **once** in canonical text; validator tests **KEEP UNCHANGED**.

---

## 12. Validator / prompt boundary

| Restatement | Validator | Model still needs | Class |
| ----------- | --------- | ----------------- | ----- |
| Required envelope bullets | partial capture shape/stage | field **names** | KEEP FIELD NAME |
| TMD object keys | object present | **meaning** of operand vs workspace | KEEP SEMANTIC in §5 |
| purpose/spec non-empty | non-empty / not type-token | **what a sufficient spec is** (T-031) | KEEP SEMANTIC in §6 |
| evidence_decision object | present | particulars-as-grounds **meaning** | KEEP SEMANTIC in §7 |
| Forbidden bodies list ×3 | reject bodies | one forbidden list | REDUCE to once §10 |
| Title rules ×4 | length/patterns | semantic distinctness + forbids | KEEP SEMANTIC once §4 |
| PRE-EMIT laundry / FINAL AUDIT (PB-021) | capture | one line: invalid JSON fails capture | RETIRE audit stack |
| Pack Output dialect | partial page schema | envelope | RETIRE dialect |
| Archetype JSON twice | plan completeness if selected | selection judgement + key names | KEEP SEMANTIC lists §6 |

Do **not** recreate pre-P04 self-audit.

---

## 13. Atomic switch (Option 3)

**PHASE A** — Behind live path. Add section builders + `assembleDlaCanonicalContract`. Production still uses `buildDlaPageEnrichContractBlock` + shape + dual inject. New tests run against assembler only.

**PHASE B** — Static equivalence: invariant marker strings present in canonical homes; operator OLD vs TARGET review artefact filled for P01-R1, T-033, T-031, P02, Sprint 72.

**PHASE C** — Atomic switch: `app.js` Copy + Studio call assembler **once**; v2 branch of `applyEpisodePlanDlaPopulationPromptBlockToDraft` does **not** append contract/shape when `useDlaCanonicalAssembler(wf)` is true. Default the flag **on** in the same commit as retirement of dual inject (avoid long mixed instruction). Rollback flag **off** restores legacy pair + old skip behaviour.

**PHASE D** — After Gate B green and operator Gate D: stop calling legacy monolith from production; keep functions as `buildDlaLegacyContractPair()` until cleanup commit.

**PHASE E** — Gate C measurements + Gate D Roman Roads / Lagrangian.

Avoid a prolonged state where pack still states a second constitution **and** canonical contract is live. Pack overlay edit belongs in **the same switch commit** as U-1/U-3 (U-2 overlay preserved).

---

## 14. Rollback

| Mechanism | Detail |
| --------- | ------ |
| Flag | `workflowOutputSpec.dlaCanonicalAssembler` (boolean). **Missing/false** = Sprint 76 assembly (`buildDlaV2CopilotSchemaInstructions` + v2 append). **True** = assembler once. |
| Code | Do not delete `buildDlaPageEnrichContractBlock` / `buildCanonicalDlaPageShapeSnippet` until Phase D cleanup. |
| Baseline artefact | T-010 diagnostic dump + `76-DLA-PARTIAL-9` + this plan’s invariant ledger. |
| Operator revert | Set flag false (or pin previous `index.html` cache + flag) — **no git archaeology required** until Phase D deletes legacy. |
| After Phase D | Git revert of cleanup commit **or** restore legacy functions from `76-DLA-PARTIAL-9` tag/HEAD `0b5402d`. Prefer delaying Phase D until Gate D passes. |

Do not add a second permanent assembler framework.

---

## 15. Size budget

See [S77-T-012-dla-section-size-budget.csv](S77-T-012-dla-section-size-budget.csv).

| | |
| - | - |
| Current Copy | **75,991** |
| Current unique | **~57,118** |
| Planned Copy assembled | **~40,000–52,000** |
| Planned unique | **~38,000–48,000** |
| Exact-dup removal | **~18,873** |
| Semantic consolidation | **~8,000–16,000** unique |
| §9 overlay | **6,000–10,000** gated |

§5 and T-031 sentences **must not** be shrunk for budget. Size is not a pass/fail gate.

---

## 16–17. Test migration and new architecture tests

See [S77-T-012-dla-test-migration.csv](S77-T-012-dla-test-migration.csv).

**New file (planned):** `tests/ld-dla-canonical-assembler.test.js`

- §§1–11 headings once, order stable  
- canonical injected once on Copy reconstruction  
- Copy/Studio canonical byte-identical  
- overlay empty when `workbookOverlay` false  
- §9 forbids T-033 load-bearing paragraph and P01-R1 absence test (generics belong in §4/§5)  
- no pack Output dialect keys as emit instructions  
- examples do not use `type` instead of `material_type`  
- forbidden bodies listed once  
- invariant marker substrings in canonical homes (from equivalence ledger)

Avoid whole-prompt snapshots.

---

## 18. Semantic equivalence review

**Artefact to fill during Phase B (not this task):** `S77-T-0xx-dla-invariant-old-vs-target.md`

For each of P01-R1, T-033, T-031, P02, Sprint 72 sources/providers:

| Column | |
| ------ | - |
| OLD | verbatim from `76-DLA-PARTIAL-9` PB-003 |
| TARGET | verbatim from section builder |
| Diff | editorial only vs meaning |
| Intended behavioural change | **NONE** |

Operator inspects before Phase C switch is authorised.

---

## 19. Gate A — static architecture

- Builders for §§1–11 exist; order exact  
- Invariant ledger complete; every protected invariant has target wording in a builder  
- Canonical contract once per path  
- Copy/Studio canonical equal  
- Overlay gated; U-1 competing denial absent; U-2 WB rows still in §9; U-3 pack emit dialect absent  
- No schema/validator production change  
- No generation  

---

## 20. Gate B — automated regression

Run (expected families; exact counts at implement):

- `tests/ld-dla-evidence-decision-consistency-prompt.test.js`  
- `tests/s76-dla-p01-p02-p03-contract.test.js`  
- `tests/s76-dla-procedural-task-evidence-validation.test.js`  
- `tests/page-dla-enrich.test.js` (updated multiplicity)  
- `tests/ld-activity-title-contract.test.js`  
- `tests/ld-instructional-archetype-production-planning.test.js`  
- `tests/sprint-72-evidence-centred-activity-slice.test.js`  
- `tests/sprint-72-dla-evidence-guidance-ux.test.js`  
- `tests/intellectual-coherence-bridge-coverage.test.js`  
- `tests/s75-dla-evidence-decision-false-positive.test.js`  
- `tests/dla-38l-obligation-smoke.test.js`  
- `tests/workflow-dla-framing-capture-validation-gate.test.js`  
- `tests/sprint-56-dla-capture-repair.test.js`  
- new assembler tests  

T-041/T-044/T-047 protection is **inside** the evidence-decision prompt test + invariant markers (those implementations live in PB-003). Validators for P01–P03 remain **KEEP UNCHANGED**.

---

## 21. Gate C — measurement

Reuse/extend `_t010-reconstruct-dla-prompt.js` (successor). Record:

- Copy total, Studio total, canonical unique, exact duplication of canonical block (must be **0 extra pair**), section sizes, order, multiplicity.

Size ranges are **observational**, not pass/fail. Fail if canonical pair duplicates or unique **exceeds ~57,118 without written semantic justification**.

---

## 22. Gate D — behavioural generation

**Roman Roads** and **Lagrangian** (same exhibits as Sprint 76 Gate C). Inspect:

- P01-R1 (operand vs workspace vs intermediate)  
- T-033 (LO operations in production)  
- T-031 (spec bounds; **no** new DLA solvable rule)  
- P02 (particulars-as-grounds; procedural false)  
- sources/attachments (conversation_attachment)  
- workbook overlay if flags on  
- titles + partial capture validity  

QA score **not** required for architecture equivalence. Optional QA after.

---

## 23. Commit boundaries

| Commit | Contents | Production live path |
| ------ | -------- | -------------------- |
| **1** | Section builders + assembler + architecture tests; flag default **false** | **Old** |
| **2** | Flag default **true**; Copy/Studio switch; pack overlay + U-1/U-3; retire dual inject; update multiplicity tests; pin bump | **New** (rollback = flag false) |
| **3** | After Gate D: delete unused legacy call sites / dead skip-regex; optional leftover cleanup | New only |

Do not land Commit 2 as “assembler on + old pack constitution + dual inject.”

---

## 24. File change plan

| Path | Plan |
| ---- | ---- |
| `lib/ld-dla-page-enrich-contract.js` | **CHANGE** (builders + assembler; keep legacy until Phase D) |
| `lib/ld-activity-title-contract.js` | **VERIFY ONLY** (call once from §4) |
| `app.js` | **CHANGE** (`buildDlaV2CopilotSchemaInstructions`; `applyEpisodePlanDlaPopulationPromptBlockToDraft`; scaffold no-op/slot; flag read) |
| `index.html` | **CHANGE** cache pin on contract lib (+ `app.js` if needed) |
| `domains/learning-design/domain-learning-design-step-patterns.md` | **CHANGE** DLA Prompt Factory only (overlay + U-1/U-3) |
| `lib/episode-plan-dla-integration.js` | **VERIFY ONLY** (legacy PB-020) |
| `lib/page-dla-enrich.js` | **VERIFY ONLY** (validators unchanged) |
| `lib/ld-guided-learning-scaffold.js` / EQF / table / math | **VERIFY ONLY** or **CHANGE** if export slot helpers |
| `tests/ld-dla-canonical-assembler.test.js` | **CREATE** |
| listed Gate B tests | **CHANGE** location/multiplicity as classified |
| `_t010-reconstruct-dla-prompt.js` | **CHANGE** or **CREATE** successor for Gate C |
| Sprint 77 docs | **CHANGE** (this task) |
| GAM/EP/Graphics/QA/Design Page prompts | **VERIFY ONLY** — do not change |
| schemas | **VERIFY ONLY** |

**DELETE LATER:** legacy dual-inject branches; Marx example function; redundant pack Output keys in template.

---

## 25. STOP conditions (before switch)

- Protected invariant has no target wording in a section builder  
- U-1/U-2 **behaviour** changed (not mere authority cleanup)  
- Copy and Studio require divergent §§1–11  
- §9 still restates T-033/P01-R1/P02 as a second constitution  
- Tests still require **two** `buildDlaPageEnrichContractBlock()` call sites  
- Schema change appears necessary  
- Validators would need to **infer** P01-R1/T-033/T-031 meaning  
- Flag rollback cannot restore Sprint 76 assembly  
- Target unique **> current unique (~57k)** without written justification  

---

## 26. Out of scope

GAM D/E, Graphics, EP/Design Page/QA architecture, Settings, cross-stage templates.

---

## 27. Next action

**S77-T-013 (recommended):** Phase A implementation — section builders + assembler + architecture tests, **production still legacy**, flag off. Operator review of this plan first.

---

## Verdict

Architecture implementation is **planned**. Production unchanged. P05 not implemented. Ready for operator review then Phase A.
