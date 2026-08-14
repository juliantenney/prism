# S77-T-010 — DLA model-visible prompt inventory and architecture diagnostic

**Task:** S77-T-010  
**Status:** **COMPLETE** (2026-08-14)  
**Mode:** DIAGNOSTIC / INVENTORY ONLY — no production, prompt, schema, validator, P05, GAM, EP, Graphics, or architecture-design changes  
**Baseline HEAD:** `0b5402dcd989299bd284076efa1398d65eee63b5` — `Sprint 76: close DLA semantic repair chain and hand over prompt architecture`  
**Live contract:** `76-DLA-PARTIAL-9`

Supporting: [component inventory](S77-T-010-dla-prompt-component-inventory.csv) · [assembled map](S77-T-010-dla-assembled-prompt-map.md) · [delimited dump](S77-T-010-dla-assembled-prompt-diagnostic.txt) · [reconstructor](_t010-reconstruct-dla-prompt.js)

---

## 0. Amendments before inventory

1. Removed stale “T-031 may still be uncommitted” wording. Sprint 76 is committed; HEAD above is the inventory baseline.  
2. Charter/START-HERE now state the intended model-visible end state as a **coherent instruction contract** (not arbitrary prompt fragments). Length-reduction remains not the initial goal. No section hierarchy designed.

---

## 1. Live DLA generation entry points

| ID | Entry | File | Class | Prompt builders | Shared? |
| -- | ----- | ---- | ----- | --------------- | ------- |
| **EP-COPY** | Run Copy → `buildWorkflowStepInstructions` | `app.js` | **LIVE (primary)** | Wrapper + `buildDlaV2CopilotSchemaInstructions` + `resolveStepPromptText` → augmentations | Contract/shape shared with Studio |
| **EP-STUDIO** | Prompt Studio generate/draft → `applyWorkflowStepRuntimePromptAugmentations` | `app.js` | **LIVE (alternate)** | Pack seed + same augmentation chain; **one** contract+shape | Same libs |
| **EP-OVERRIDE** | Local override / library body | `app.js` `resolveStepPromptText` | **LIVE** | Same as Studio then embedded in Copy | Yes |
| **EP-LEGACY-V1** | `pageEnrichmentV2` false | `app.js` + `lib/episode-plan-dla-integration.js` | **LEGACY-LIVE** | `buildEpisodePlanDlaPopulationPromptBlock` | No |
| **EP-EMBED** | Copy when `partialPageOutputs` false | `buildUpstreamPageShellEmbedSectionForDlaCopy` | **LEGACY-LIVE** | Long evidence/source prose + optional JSON shell | Overlaps contract source-use |
| **EP-DET** | `enrichPageWithDla` / capture repair / validators | `lib/page-dla-enrich.js` | **DEAD for model** | None | n/a |
| **EP-TEST** | tests calling builders | `tests/*` | **TEST-ONLY** | Direct `buildDlaPageEnrichContractBlock` | n/a |

Do not treat `enrichPageWithDla` as model-visible. Capture repair is post-hoc.

**Live generation entry points counted for T-010:** **2** primary product paths (Copy, Studio), plus override as the same Copy/Studio machinery.

---

## 2–3. Components and primary assembled order

See CSV and assembled map. **24** inventoried components (including nested, legacy, and gated). **~16** appear on the reconstructed learner-page Copy prompt.

Primary Copy is **not** a single linear spec. It is a **wrapper + dual contract/shape + pack/obligation/workbook + runtime scaffolds + output restatement**.

---

## 4. Total cost (measured)

Reconstruction: v2 + **partial outputs** + **learner-facing page** brief (Marx self-study) so learner-page scaffolds apply. That is the typical LD learner-page Copy, not a facilitator-only minimum.

| ID | Measure | Value |
| -- | ------- | ----- |
| **A** | Total assembled DLA Copy characters | **75,991** |
| **B** | Token estimate (chars/4; no repo tiktoken) | **~18,998** (Copy) / **~13,628** (Studio) |
| **C** | Unique instruction characters (Copy minus second pair) | **~57,118** |
| **D** | Byte-identical duplicated characters (second contract+shape pair) | **18,873** (join newline) |
| **E** | Approximate semantic-restatement cost | **~14k–20k** (pack 14,279 overlaps commissioning/evidence/titles; OUTPUT CONTRACT; runner; WB vs T-033) |
| **F** | DLA contract block | **12,174** |
| **G** | Canonical shape | **6,698** |
| **H** | contract+shape unique | **18,872** (F+G) / **18,873** joined |
| **I** | contract+shape assembled contribution | **37,744–37,746** (×2) |
| **J** | Pack template + notes | **14,279 + 1,290** |
| **K** | Wrapper/output (pipeline, Copilot fence, runner, strict footer, completion) | **~2.5–3.5k** (residual after pair+pack+scaffolds) |
| **L** | Examples (shape JSON + OUTPUT CONTRACT Marx example + table GOOD example) | shape example nested in G; Marx example **~1.6k** (block from 47216 to table fidelity) |
| **M** | Runtime scaffolds (scaffold, EQF, timeline, OUTPUT CONTRACT, table, math) | Studio 54,511 − pack 14,279 − pair 18,873 ≈ **~21k** |

**Vs Sprint 76 18,872 / 37,744:** unique F+G **matches 18,872**. Joined pair is **+1**. Dual assembled **+2** vs 37,744 from two joins. Not a behavioural change.

**Vs ~62k operator estimate:** measured Copy is **75,991**. The 62k figure is **low** for this learner-page v2 partial Copy: it likely omitted learner-page scaffolds, dual injection, or pack WB. Studio (no Copy wrapper / no first pair) is **54,511**, nearer 62k if someone mixed paths.

No optimisation performed.

---

## 5. Semantic invariant map (today — not future homes)

| Invariant | PRIMARY HOME TODAY | SECONDARY | EXAMPLE | VALIDATOR | OWNERSHIP |
| --------- | ------------------ | --------- | ------- | --------- | --------- |
| DLA role / not full page | PB-003 + Copy wrapper | Pack still says populate `learning_activities` JSON | Shape forbidden list | Partial capture validators | **PARTIAL** |
| Mapped LO interpretation | PB-003 step 1 | Pack IFP/AS; DLA-WB-02 | Weak | Capture mapping checks | **PARTIAL** |
| Learner production / expected_output / learner_task | PB-003 step 1; pack AS-05 / WB-19 | OUTPUT CONTRACT | Marx example | Some length/presence | **PARTIAL** |
| LO-operation coverage T-033 | PB-003 step 1 | Pack AS-02 beat segments | No | Not a full LO-ops validator | **CLEAR** in contract; pack competes |
| task_material_decision / operand vs workspace P01-R1 | PB-003 step 2 | Shape contrast line | Shape has ids; Marx example **omits** TMD | Structural TMD fields | **CLEAR** in contract; examples lag |
| Intermediate object/state | PB-003 step 2 | — | — | Structural only | **CLEAR** |
| Prior-product boundary | PB-003 step 2 | — | — | No | **CLEAR** |
| P01/P02 independence | PB-003 steps 2+4 | Pack notes `required means particulars-as-grounds` | Shape contrast | Presence of both objects | **CLEAR** |
| required_materials purpose/spec P03 | PB-003 step 3 | Pack type/purpose/spec; WB depth_floor | Shape spec string | Non-empty purpose/spec | **CLEAR** + pack extra |
| Pedagogical bounds / T-031 DLA | PB-003 step 3 | — | — | Spec non-empty; not “solvable” | **CLEAR** |
| GAM commissioning | PB-003 “GAM fulfils”; pack LD-MATERIALS-COPY | OUTPUT CONTRACT | — | No bodies in DLA | **CLEAR** |
| evidence_decision P02/P04 | PB-003 steps 4–5 | Pack notes; runner what_to_check; **legacy embed** | Shape evidence_requirement | evidence_decision required | **CLEAR** + restated |
| Sprint 72 provider authoring | PB-003 evidence-provider section | Embed path; pack thinner | Shape evidence_requirement object | evidence_requirement shape | **CLEAR** |
| Source/attachment | PB-003 opening | Embed; runner expect upload | — | Optional generation_notes | **PARTIAL** (Prism cannot read bytes — stated) |
| Archetypes | Nested in shape PB-006 | Not in contract prose body | Shape has instructional_function not full plan | Archetype validators | **PARTIAL** (shape not contract steps) |
| Workbook DLA-WB | Pack PB-008 | Notes | — | Some obligation-row enforcement | **AMBIGUOUS** vs LO production |
| Output shape | Wrapper + PB-003/004 + pack Output + schema line | Dual shape | Two JSON dialects | Partial page schema | **AMBIGUOUS** |
| Activity title | PB-005 nested ×4 | Pack title bullets | — | Title validators | **CLEAR** but **D1** |

**Invariants with AMBIGUOUS ownership:** **3** (DLA-WB vs mapped-LO production; output-shape multiplicity; pack “obligation population not a learning-design step” vs contract commissioning).

---

## 6. Duplication classification

| Cluster | Class | Notes |
| ------- | ----- | ----- |
| Contract+shape Copy ×2 | **D1** | P05; tests assert exactly two `buildDlaPageEnrichContractBlock()` call sites |
| Title guidance in contract **and** shape, each ×2 | **D1** | 4 model-visible copies |
| Archetype guidance in both shape injections | **D1** | |
| Commissioning order vs pack obligation/WB gates | **D2** / **D7** | Pack is beat-population; contract is P01–P04/T-031/T-033 |
| Evidence particulars-as-grounds | **D2** / **D3** | Contract + pack notes + runner |
| OUTPUT CONTRACT vs contract payload list | **D2** / **D6** | Cognition/bridge restated; schema line rewrites pack Output |
| Shape JSON vs Marx JSON example | **D4** / **D5** | Marx example uses `type` not `material_type`; omits TMD/evidence_decision |
| Table fidelity GOOD example | **D4** | |
| Forbidden full-page lists | **D2** / **D6** | Wrapper + contract + shape |

**Significant clusters:** **9**. Do not delete from this finding.

---

## 7. Prompt topology (current)

**Repeated contract+shape** wrapped around a **domain pack** (obligation population + workbook), then **appended historical/runtime scaffolds**, then **output-protocol restatement**.

Not a single linear specification. Multiple authorities: contract file, pack markdown, app.js learner-page blocks, EQF, scaffold SSOT, table/math modules.

| Conceptual region | Explicitness |
| ----------------- | ------------ |
| Role/context | MIXED (wrapper vs pack “obligation population”) |
| Inputs | MIXED (pack episode_plans vs v2 page / omitted embeds) |
| Learner-production / LO ops | EXPLICIT in contract; MIXED with pack AS-* |
| Task-input | EXPLICIT in contract; ABSENT in pack/example |
| Materials commissioning | MIXED (P03 vs WB/G1–G5) |
| Evidence | EXPLICIT in contract; restated |
| Provider authoring | EXPLICIT in contract |
| Source/attachments | EXPLICIT in contract; runner UX |
| Archetypes/workbook | MIXED (shape vs pack WB) |
| Examples | MIXED / competing dialects |
| Schema/shape | EXPLICIT and **repeated** |
| Output protocol | EXPLICIT and **repeated** |
| Validator boundary | IMPLICIT (PRE-EMIT / “validators enforce”) |

**Do not treat this as a designed hierarchy.**

---

## 8. Order / distance / salience (protected invariants)

| Invariant | First | Last | Occurrences (approx) | Distance to governed JSON | Flag |
| --------- | ----- | ---- | -------------------- | ------------------------- | ---- |
| T-033 production | Contract inj.1 (~0.7k) | Contract inj.2 (~56k) | 2 strong | HIGH: output fence mentioned early; JSON authored after 75k | **HIGH-DISTANCE** |
| P01-R1 operand | Contract step 2 | Inj.2 | 2 | HIGH | **HIGH-DISTANCE** |
| P03 spec bounds / T-031 | Contract step 3 | Inj.2 | 2 | HIGH; pack WB sits **between** inj.1 and inj.2 | **HIGH-DISTANCE** |
| P02 evidence | Contract 4–5 + pack notes | Inj.2 | 3+ | MEDIUM–HIGH | **MEDIUM-DISTANCE** |
| Sprint 72 provider | After commissioning in contract | Shape example | 2–4 | Shape example **after** rule in each pair | **MEDIUM-DISTANCE** |
| Titles | Nested immediately in contract | ×4 | 4 | LOW locally, noisy globally | **LOW-DISTANCE** locally |

Competing pack/WB blocks sit **between** first contract and the second copy, and **before** the second copy’s restatement. Observation only — not a causal LLM claim.

---

## 9. Competing instruction clusters

| Cluster | Quote (concise) | Source | Competing | Kind | Severity | Current resolver |
| ------- | --------------- | ------ | --------- | ---- | -------- | ---------------- |
| LO production vs workbook | Pack: “not a learning-design step”; WB capstone ≥3 LOs, G1 checklist every activity | PB-008 | T-033 / P01 | **REAL** | HIGH | Contract step 1 should win for LO ops; pack not updated to say so |
| Operand vs workspace | Contract absence test | PB-003 | Pack silent; example omits TMD | **REAL** (example lag) | MEDIUM | Contract |
| Spec shape vs bounds | Pack `depth_floor: L3` vs T-031 pedagogical bounds | PB-008 vs PB-003 | **CONTEXT-DEPENDENT** | MEDIUM | Contract for method/scope; pack for WB depth |
| Evidence vs LO sufficiency | Contract: correct evidence ≠ LO sufficiency | PB-003 | Pack evidence notes | **APPARENT** | LOW | Contract |
| Nouns vs epistemic role | Contract + pack notes | Both | **APPARENT** | LOW | Aligned |
| Source preference vs production | Contract attachment inventory | PB-003 | Runner “upload evidence” | **CONTEXT-DEPENDENT** | MEDIUM | Contract “do not force irrelevant attachments” |
| Worked-example/table vs need | DLA-WB-08/06a mandatory rows | Pack | P01 separate_inputs | **REAL** | HIGH | Unresolved architecturally; both live |
| Semantic vs validators | PRE-EMIT add materials; dual shape | Pack + PB-004 | **REAL** | MEDIUM | Validators close structure; model still sees prose |

No fixes.

---

## 10. Examples

| Source | Size | Illustrates | Prose already? | New semantics? | Stale? | EXAMPLE AS CONTRACT |
| ------ | ---- | ----------- | -------------- | -------------- | ------ | ------------------- |
| Shape canonical activity JSON | inside 6,698 | TMD true + evidence_requirement | Yes in contract | Contrast line for practice operands | `instructional_function` vs archetype_plan mix | **YES** (shape-as-schema) |
| Title examples (“Activity A1”) | inside title block | Forbidden titles | Yes | No | No | NO |
| OUTPUT CONTRACT Marx/compare JSON | ~1.5–2k | preamble/bridge/cognition | OUTPUT CONTRACT yes | Uses `type` not `material_type`; **no** TMD/evidence_decision; topic-specific Marx | **YES** dialect | **YES** |
| Table fidelity GOOD pipe table | short | pipe table shape | Table module | GAM-oriented table in materials.* | Slightly GAM-flavoured on DLA | NO |
| Archetype field lists | in shape | plan skeletons | Selection rules in same block | Plan field names | No | **YES** (schema-by-example) |

**Example-introduced contracts:** **2** (Marx JSON dialect; shape/archetype as schema).

---

## 11. Authoring vs validators

**A. Model-only:** T-033 sufficiency; P01-R1 operand vs workspace; P02 epistemic required; T-031 which bounds to state; Sprint 72 delayed disclosure / layout choice; WB pedagogical mix.

**B. Deterministic:** envelope; activity_id; TMD object presence; purpose/spec non-empty; evidence_decision object; title length; partial vs full page; some obligation-row presence.

**C. Mixed:** archetype_plan completeness; checklist 3–4 criteria; WB row types.

P04 removed some evidence self-audit. **Remaining validator-restatement:** dual shape JSON; activities[] schema line; forbidden-field lists; PRE-EMIT “add missing Materials”; title rules ×4; “Return one pretty-printed fenced JSON” in wrapper + contract + pack Output.

Do not delete.

---

## 12. Dead / legacy / non-live

| Surface | Class |
| ------- | ----- |
| `buildDlaPopulationOnlyPromptBlock` | **LEGACY** (v2 off) |
| `buildUpstreamPageShellEmbedSectionForDlaCopy` long heuristic | **LEGACY-LIVE** when partial mode off; **empty** (`""`) when partial on — historically the “72k embed” family; **not** on current default Copy |
| `enrichPageWithDla` | **DEAD** for model |
| Sprint 59 `selected_dla_test` | **TEST-ONLY** / regression |
| Historical pack copies under `docs/development/sprints/.../context-files/` | **DEAD** |
| Dual injection skip-regex on **pack body only** (not full Copy) | LIVE bug/architecture: causes P05 |

The historically mentioned long `app.js` full-page/embed heuristic **is not live on Sprint 58 partial Copy**. It is live only on enrich-in-place (non-partial) v2.

---

## 13. Dual injection / P05 evidence

| | |
| - | - |
| First site | `buildDlaV2CopilotSchemaInstructions` (`app.js` ~10645), pushed from Copy DLA branch ~32467 |
| Second site | `applyEpisodePlanDlaPopulationPromptBlockToDraft` (~12015–12026), via `resolveStepPromptText` → `finalizePromptBody` → augmentations, then inserted as “core prompt” |
| Surrounding | First: after Copilot fence instructions. Second: after pack + scaffolds (indexes 56388 / 68481) |
| Byte-identical | **YES** (same builders) |
| Both include contract and shape | **YES** |
| Why | Copy always prepends v2 schema; pack path independently appends if pack text lacks `DLA partial-page contract` — pack template **does not** contain that heading |
| Tests | `tests/page-dla-enrich.test.js` asserts **exactly two** call sites |
| Downstream | Copy assembly concatenates wrapper + augmented pack; **assumes** both |

**P05 duplicated contribution:** **18,873** characters (second pair). **Do not implement P05.**

Studio path: **one** pair (no Copy prepend).

---

## 14. Domain / workbook pressure

**Source:** `domains/learning-design/domain-learning-design-step-patterns.md` §5 Prompt Factory.  
**Live injection:** Copy “core prompt” + notes/runner. **Length:** 14,279 template.  
**Stage-specific:** DLA.  
**Jobs:** obligation population from episode_plans; DLA-WB ~60 min workbook rows; anti-shell/anti-spoiler.  
**Overlap:** titles, evidence_decision notes, materials purpose/spec, expected_output quality.  
**Separate material-shape pressure:** G1–G5, WB-08/12/06a/18 mandatory types.  
**Semantics not in core contract:** workbook session arithmetic, capstone ≥3 LOs, “not a learning-design step”.

---

## 15. Source / attachment

**Not one section.** Distributed: contract opening (inventory/source-use); optional `generation_notes`; runner “upload evidence”; legacy embed paragraph. Partly validator (`conversation_attachment` provenance). Roman Roads conversation_attachment behaviour remains in contract — **protected**. Duplicated on dual inject.

---

## 16. Output shape / schema

Places specifying shape: Copilot wrapper; contract envelope; **canonical shape ×2**; pack Output JSON keys (`activities, outcome_alignment, delivery_notes` — **legacy dialect**); rewritten `activities[]:` schema line; Marx example; strict footer. Structural volume is large vs semantic. Validators enforce partial page, **not** pack top-level `delivery_notes` dialect. Canonical shape appears **twice** on Copy.

---

## 17. Defect-to-instruction traceability (retrospective)

**A. P01-R1 intermediate operand**  
Surfaces: contract step 2; shape contrast; pack (silent); Marx example (silent); WB tables. **Primary:** PB-003 step 2. **Difficulty: HARD.**

**B. T-033 LO-operation coverage**  
Surfaces: contract step 1; pack AS-02 / IFP / WB. **Primary:** PB-003 step 1. **Difficulty: MODERATE.**

**C. T-031 DLA/GAM ownership**  
Surfaces: contract step 3; pack LD-MATERIALS-COPY; no “must be solvable”. GAM brief not in DLA Copy. **Primary:** PB-003 step 3. **Difficulty: MODERATE** (easy if engineer starts at contract; hard if they start at pack WB).

---

## 18. Maintainability proxies

| Proxy | Runtime LLM | Operator | Coding agent | Future diagnostic |
| ----- | ----------- | -------- | ------------ | ----------------- |
| Rule dispersion | HIGH | HIGH | HIGH | HIGH |
| Repetition | HIGH | HIGH | MEDIUM | HIGH |
| Long-distance deps | HIGH | MEDIUM | MEDIUM | HIGH |
| Multiple authorities | HIGH | HIGH | HIGH | HIGH |
| Examples hidden semantics | MEDIUM | HIGH | HIGH | HIGH |
| Dead/live ambiguity | MEDIUM | HIGH | HIGH | HIGH |
| Output/schema interleaving | HIGH | HIGH | MEDIUM | HIGH |
| Duplicated injection | HIGH | MEDIUM | LOW (tests pin 2) | MEDIUM |

---

## 19. What T-010 did not do

No architecture proposal, no section names as design, no prose rewrite, no P05, no generation, no contract change.

---

## 20. Obvious next phase (not an executable task)

**DLA prompt-contract architecture design** (inventory-complete). Behaviour preservation first. Do not implement P05 in that design’s first hour.

---

**Verdict:** Inventory complete from production assembly. Highest-cost problem is **multiple authorities + dual identical contract/shape + pack/WB overlay**, not character count alone.
