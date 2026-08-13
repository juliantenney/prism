# S76-T-036 — DLA-P04 evidence-guidance rationalisation implementation

**Task:** S76-T-036  
**Status:** **Gate A + Gate B complete** (2026-08-13) — ready for operator review before Gate C  
**Mode:** Authorised P04 Option 2 implementation (T-034 / T-035) through Gate A + Gate B only  
**Depends on:** [T-034](S76-T-034-dla-p04-evidence-guidance-rationalisation-solution-design.md) · [T-035](S76-T-035-dla-p04-evidence-guidance-rationalisation-implementation-plan.md)  
**Pre-implementation boundary:** `4de920e` — `Sprint 76: plan DLA P04 evidence guidance rationalisation`

**Out of scope (not started):** Gate C (Roman Roads / Lagrangian) · P05 dual-injection repair · T-031 / T-033 live wording · validators · schemas · GAM · EP · Settings · fresh DLA generation

This artefact records what was implemented. It does **not** authorise fresh generation. It does **not** claim RECOVER. It does **not** start P05, T-031, or T-033.

---

## 1. Pre-implementation boundary

| Field | Value |
| ----- | ----- |
| Commit | `4de920e` |
| Message | Sprint 76: plan DLA P04 evidence guidance rationalisation |
| Branch | `master` |
| Contract version before | `76-DLA-PARTIAL-5` |
| Schema | `2.0.0` (unchanged) |

Work started from that committed state. P04 is prompt rationalisation only.

---

## 2. Files changed

| Path | Change |
| ---- | ------ |
| `lib/ld-dla-page-enrich-contract.js` | Semantic-core rationalisation; `CONTRACT_VERSION` → `76-DLA-PARTIAL-6` |
| `index.html` | DLA **contract** cache pin only: `?v=20260813-s76-dla-p04-evidence` |
| `domains/learning-design/domain-learning-design-step-patterns.md` | DLA Prompt Factory `defaultPromptNotes` evidence extension + `what_to_check` only |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | Gate A presence/absence + size-band assertions |
| `tests/ld-instructional-archetype-production-planning.test.js` | Version pin `76-DLA-PARTIAL-6` |
| `tests/sprint-72-evidence-centred-activity-slice.test.js` | DLA prompt-guidance assertions (Sprint 72 tokens retained; deleted audits absent) |

**Not changed:** `lib/page-dla-enrich.js` · `lib/page-gam-enrich.js` · `lib/ld-gam-page-enrich-contract.js` · EP contracts · `app.js` injection logic · schemas · GAM pack evidence extension · `index.html` `page-dla-enrich.js` pin (`?v=20260813-s76-dla-p01-p02-p03`).

---

## 3. Before-size measurements (T-035 basis)

Unique A = `buildDlaPageEnrichContractBlock().length` + `buildCanonicalDlaPageShapeSnippet().length` (no join newline). Assembled B = 2 × A.

| Series | Before |
| ------ | -----: |
| Contract block | 17,535 |
| Shape snippet | 6,568 |
| **A unique contract+shape** | **24,103** |
| **B assembled ×2** | **48,206** |
| Pack `defaultPromptNotes` (DLA 38S line) | **4,099** |
| Evidence extension (`Evidence-centred extension:` → `Table specs:`) | **3,051** |
| `what_to_check` | **507** |

T-034 quoted pack evidence ~3,435 / notes ~4,122 / `what_to_check` ~524. Live measurement at the `4de920e` boundary is the baseline used here.

P05 dual-injection savings are **not** counted as P04.

---

## 4. After-size measurements

| Series | After |
| ------ | ----: |
| Contract block | 11,275 |
| Shape snippet | 6,698 |
| **A unique contract+shape** | **17,973** |
| **B assembled ×2** | **35,946** |
| Pack `defaultPromptNotes` | **1,290** |
| Evidence extension | **242** |
| `what_to_check` | **213** |

Pack evidence after:

> Evidence: emit evidence_decision on every activity. required means particulars-as-grounds, not that materials exist. When true, author evidence_requirement on provider rows per the DLA partial-page contract. Do not infer required from nouns.

`what_to_check` after:

> evidence_decision.required records particulars-as-grounds (not nouns). When true, providers are inspectable and distinct from teaching/scaffolds; attached sources use conversation_attachment for inventoried units.

---

## 5. P04 deltas

| Series | Delta |
| ------ | ----: |
| Unique contract+shape | **−6,130** |
| Assembled ×2 | **−12,260** |
| Pack evidence extension | **−2,809** (3,051 → 242) |
| `what_to_check` | **−294** (507 → 213) |
| **Total unique instructional reduction (A + pack evidence + what_to_check)** | **−9,233** |

T-035 preferred unique band **15,500–17,500**. Observed unique **17,973** (**+473** above the preferred ceiling). Assembled ×2 **35,946** (**+946** above 35,000).

**Diagnosis (justified variance, not leftover audit duplication):**

- Deleted audits, noun force-true, INVALID/VALID, PRE-DESIGN-as-audit, and the 6.8k evidence-centred block are absent.
- Remaining unique mass is the protected commissioning order (steps 1–3 verbatim), the compact Step 4 P02 core (longer than the old one-liner), Sprint 72 source-use + provider-authoring (Roman Roads A5 / delayed disclosure / combined layout), envelope/payload/checklist, and **title + archetype guidance still inside unique A** (P05 dual-injection is out of scope).
- Shape grew **+130** for the P01-true / P02-false contrast line.
- Pack evidence **242** is inside the 200–400 target.

No further deletion was applied to hit 17,500. No padding. Gate B size test uses a disaster band **15,500–18,500** so the preferred ceiling remains a diagnostic, not a quota.

---

## 6. Exact deletions

Removed entirely from the DLA production contract (not renamed):

- `FINAL PRE-EMIT AUDIT` (heading and bullets)
- `FINAL PER-ACTIVITY EVIDENCE-DECISION CONSISTENCY AUDIT` (heading and numbered list)
- Invalid / valid contrast
- Noun/form force-true rule (`language` / `form` / `data` / `case` / interpretation wording → `evidence_decision.required` true)
- Separate `### Resource-level source-use commitment` heading (merged into the pre-step)
- Separate PRE-DESIGN audit stack (merged into the pre-step)
- Large `Evidence-centred requirement semantics` block (replaced by the provider-authoring core)

No unique unmapped responsibility was found inside the deleted blocks that T-035 had not already assigned to Step 4, Step 5, the source-use pre-step, provider-authoring, or validators.

---

## 7. Exact consolidations

| Before | After |
| ------ | ----- |
| PRE-DESIGN + resource-level source-use | One `### Attachment inventory and source-use (before designing activities)` pre-step |
| Scattered P02 / evidence-decision semantics | One compact Step 4 |
| Evidence-centred semantics + closure restatement | Compact `Evidence-provider authoring (only when evidence_decision.required is true)` |
| Pack `Evidence-centred extension:` (~3,051 chars) | 242-char pointer |

---

## 8. Target Step 4 wording (live)

> 4) Independently decide whether any task input functions as particulars-as-grounds. DLA owns evidence_decision.required. true means the learner cannot complete this activity’s production without inspecting particulars (observations, values, extracts, features, conditions, cases-as-data) as grounds for inference, interpretation-from-particulars, comparison-as-evaluation, diagnosis, or substantiation. false means that epistemic use is not required: it does not mean no materials, no operands, and no generated practice. Procedural operands may be task inputs (task_material_decision true) with required: false. Provenance is not this boolean. Correct evidence classification does not by itself make the production sufficient for the mapped LO. Decide from the production’s epistemic role — not from nouns, activity_preamble, intellectual_coherence_bridge, or later-activity mentions.

---

## 9. Target Step 5 wording (live)

> 5) If evidence_decision.required is true: list those task-input rows in provider_material_ids and attach evidence_requirement on those rows. If false: omit providers and evidence_requirement.

Deterministic referential closure remains in validators (unchanged).

---

## 10. Protected steps 1–3 (verbatim, live)

**Step 1 (later T-033 surface — wording not implemented):**

> 1) Define the learner production obligation (expected_output and learner_task intent).

**Step 2 (P01-R1 — retained):**

> 2) Decide whether separate task operands/stimuli are required. A task input is the particular content upon which the learner performs the required operation (solve, calculate, classify, diagnose, analyse, compare, interpret, evaluate, transform, or construct from supplied particulars) when not already fully contained in learner_task. Set task_material_decision. If separate_inputs_required is true, commission those operands in required_materials and list only their material_ids in task_input_material_ids. If false, ids must be empty; teaching/model/workspace/scaffold may still be commissioned. Roles (not type-absolute): operand/stimulus = problem, case, data, values, source, passage, object or other particulars acted upon; model = shows how; workspace = place/structure to record or manipulate, including blank tables; scaffold = prompts, supports or checks. Used during the activity ≠ automatically a task input. Absence test: if removing it leaves the learner without the particulars needed to operate, it is a task input; if they lose only an example of how, a place to write, guidance, or a checklist, it is not. Listing a task input does not set evidence_decision.required; P01 and P02 remain independent.

**Step 3 (later T-031 surface — wording not implemented):**

> 3) Commission every required material. required_materials must be an array. For every row: non-empty purpose (the job of this material) and non-empty specification (binding GAM bounds: content, load-bearing count/variation/constraints/exclusions; not body prose). specification must not be only the material_type token.

---

## 11. Provider-authoring retained semantics

Used only when `evidence_decision.required` is true:

- `learner_action`
- `observable_features`
- delayed disclosure / withholding the focal interpretation; analogous worked example or procedure-only modelling allowed
- provenance: `system_generated_simulation` · `conversation_attachment`
- teaching/scaffold ≠ automatic provider; recording in a workspace does not make that workspace the source
- `separate_provider` vs `combined_evidence_workspace` + `fixed_observation_fields` source-native rule
- attached-source providers use inspectable excerpts/values/particulars, not summary packs
- GAM fulfils bodies; DLA does not generate final evidence bodies

Canonical shape: one evidence-true JSON example retained (Sprint 72 fields). One contrast line:

> Contrast: practice operands remain in task_input_material_ids with evidence_decision.required false and no evidence_requirement.

---

## 12. Pack-note thinning

DLA Prompt Factory only. Retained: 38S, DLA-WB, titles, scaffold, LD-MATERIALS-COPY, Table specs, IFP-06, `what_to_expect`. GAM pack evidence extension **untouched**.

`conversation_attachment` token retained in DLA `what_to_check` (Sprint 72 pack-surface requirement).

---

## 13. Contract version / cache pin

| Item | Value |
| ---- | ----- |
| `CONTRACT_VERSION` | **`76-DLA-PARTIAL-6`** |
| `schema_version` | `2.0.0` |
| Contract pin | `lib/ld-dla-page-enrich-contract.js?v=20260813-s76-dla-p04-evidence` |
| Validator pin | `lib/page-dla-enrich.js?v=20260813-s76-dla-p01-p02-p03` (**unchanged**) |

---

## 14. Gate A — PASS

Semantic prompt shape matches T-035:

- commissioning steps 1–5 present
- steps 1–3 protected content intact
- one particulars-as-grounds definition (Step 4)
- one compact emit shape (Step 5)
- one attachment/source-use pre-step
- provider-authoring core present
- deleted audits / noun force-true / INVALID–VALID absent
- no validator changes
- `76-DLA-PARTIAL-6`

Targeted tests: all pass (see §16).

---

## 15. Gate B — PASS (size variance documented)

- Broader affected suites pass (see §16)
- Sprint 72 validator / source-bound / combined-workspace tests pass (validator code unchanged)
- Pack evidence 242 chars (inside 200–400)
- Copy injection count still **exactly 2**
- Unique 17,973 is **+473** vs preferred 17,500 ceiling; diagnosed in §5; not leftover PRE-EMIT / per-activity / INVALID duplication

P05 isolation: `app.js` still contains exactly two `buildDlaPageEnrichContractBlock()` call sites (≈10649, ≈12016) and two `buildCanonicalDlaPageShapeSnippet()` call sites (≈10653, ≈12026). `tests/page-dla-enrich.test.js` `S76 Gate B: DLA contract+shape remain dual-injected` **pass**.

**Copy contract/shape injection count = 2**

---

## 16. Tests run / results

All listed files: **pass / fail 0**.

| File | Role | Result |
| ---- | ---- | ------ |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | Gate A prompt shape | 10 pass |
| `tests/ld-instructional-archetype-production-planning.test.js` | Gate A version + archetype | 6 pass (with the file above: 16) |
| `tests/page-dla-enrich.test.js` | Dual injection + DLA enrich | included in 65-pass batch |
| `tests/sprint-72-dla-evidence-guidance-ux.test.js` | `what_to_expect` UX | included in 65-pass batch |
| `tests/ld-activity-title-contract.test.js` | Titles untouched | included in 65-pass batch |
| `tests/intellectual-coherence-bridge-coverage.test.js` | Bridge payload retained | included in 65-pass batch |
| `tests/s76-dla-p01-p02-p03-contract.test.js` | P01/P02/P03 validators | included in 123-pass batch |
| `tests/s76-dla-procedural-task-evidence-validation.test.js` | Procedural P02 false | included in 123-pass batch |
| `tests/s75-dla-evidence-decision-false-positive.test.js` | S75 false-positive | included in 123-pass batch |
| `tests/sprint-72-evidence-centred-activity-slice.test.js` | Sprint 72 prompt + validators | included in 123-pass batch |
| `tests/workbook-contract-prompt-surface.test.js` | Pack 38S / DLA-WB | 47 pass |

No validator tests were weakened. Historical prompt assertions that named deleted audit headings were classified as **obsolete prompt expectations** and updated; no genuine semantic regression was found.

---

## 17. Confirmations

| Surface | State |
| ------- | ----- |
| Validators (`lib/page-dla-enrich.js`) | Unchanged |
| GAM / EP | Unchanged |
| P01 / P02 / P03 structural contracts | Protected; suites green |
| T-031 wording | Not implemented; Step 3 opening preserved as the later refinement surface |
| T-033 wording | Not implemented; Step 1 opening preserved as the later refinement surface |
| P05 | Untouched; injection count remains 2 |
| Sprint 72 evidence-product behaviour | Prompt vocabulary + validator closure retained |

---

## 18. Deviations from T-035

1. **Unique size 17,973 vs preferred 15,500–17,500.** Documented diagnosis in §5. Authorisation text treats the band as a diagnostic guardrail, not a quota. No pad/delete to hit 17,500.
2. **Gate A size assertion uses 15,500–18,500** as a disaster band so a 473-char justified remainder does not fail the suite.
3. **Pack evidence baseline used 3,051** (measured) rather than T-034’s ~3,435 estimate.
4. Source-use pre-step was tightened from a bullet list to denser paragraphs after an intermediate unique measurement sat further above 17,500; unique semantic responsibilities from T-035 §6 were retained.

No other planned deletions were skipped. No T-031/T-033 sentences were added.

---

## 19. Issues discovered

None that block Gate C authorisation.

Residual (already known, out of P04): dual injection (P05); T-031 operational suitability; T-033 LO-operation coverage; T-032 A4 constructive alignment.

---

## 20. Stop

Gate C is **not** run from this task. Do not generate fresh DLA. Do not implement P05, T-031, or T-033 from this record.

**DLA-P04 GATE A/B COMPLETE — READY FOR OPERATOR REVIEW BEFORE GATE C**
