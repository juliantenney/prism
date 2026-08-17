# S78-T-008 — Fresh DLA assembled-prompt reliability diagnostic (candidate 1)

**Task:** T-008 sub-record — assembled-prompt reliability (reframed)  
**Status:** **COMPLETE** (2026-08-17)  
**Mode:** DIAGNOSTIC ONLY — no implementation  
**Supersedes (partial):** [S78-T-008-candidate-1-a4-evidence-diagnostic.md](S78-T-008-candidate-1-a4-evidence-diagnostic.md) classification for prompt-reliability question only — validator/trace sections there remain valid.

---

## 1. Fresh exhibit confirmed

**Preserved artefact:** [S78-T-008-candidate-1-fresh-dla-exhibit.json](S78-T-008-candidate-1-fresh-dla-exhibit.json)

**Validation (re-run 2026-08-17):**

```text
activities[3].evidence_decision provider material_id A4-M1 must include evidence_requirement
```

Single error only — `validateDlaPartialPageCapture` → `validateEvidenceDecisionClosure` in `lib/page-dla-enrich.js`.

### A4 exhibit (evidence failure)

| Element | State |
| ------- | ----- |
| `learner_task` | Review solved scenario + multiplier; explain relaxation effect; relate to shadow price |
| `expected_output` | Clear economic interpretation linking multiplier to constraint relaxation; shadow-price terminology |
| `task_material_decision.separate_inputs_required` | `true` |
| `task_material_decision.task_input_material_ids` | `["A4-M1"]` |
| `A4-M1.material_type` | `scenario` |
| `A4-M1.purpose` | Provide solved optimisation context including multiplier value for interpretation |
| `A4-M1.specification` | One solved scenario with solution values and multiplier; no interpretation |
| `A4-M1.evidence_requirement` | **Absent** |
| `evidence_decision.required` | `true` |
| `evidence_decision.provider_material_ids` | `["A4-M1"]` |

**Partial P02 compliance:** decision-level provider closure correct; row-level provider payload omitted.

### A1–A3 S78-WS-1 observation (not WS1 failure)

| Activity | Workspace row | `response_fulfilment` |
| -------- | ------------- | --------------------- |
| A1 | A1-M2 `prompt_set` | `learner_text_production` / `text_compose` |
| A2 | A2-M3 `template` | `learner_workspace` / `table_complete` |
| A3 | A3-M3 `analysis_table` | `learner_workspace` / `table_complete` |

WS1 commissioning appears present on all four activities’ load-bearing surfaces. Rejection is **unrelated** to WS1.

---

## 2. Exact canonical DLA prompt assembly path

**UI Copy path (authoritative for Copilot):**

```
buildWorkflowStepInstructions(step, index)
  → buildDlaV2CopilotSchemaInstructions(wf, step)          [app.js ~10727]
      → assembleLiveDlaCanonicalPrompt(ctx, wf)            [app.js ~10288]
          → assembleDlaCanonicalContract(buildDlaCanonicalSlotContext(...))  [lib/ld-dla-page-enrich-contract.js]
  → promptBody cleared when isDlaCanonicalAssemblerEnabled(wf)               [app.js ~33088]
  → partial-mode wrapper lines + runner footer appended
```

**Studio / seeded draft path:**

```
applyWorkflowStepRuntimePromptAugmentations(draft, step, wf)
  → applyEpisodePlanDlaPopulationPromptBlockToDraft          [app.js ~12193]
      → replaces draft with assembleLiveDlaCanonicalPrompt when canonical heading absent
```

**Slot injections via `buildDlaCanonicalSlotContext`:** guided-learning scaffold (production slot), self-directed timeline + table fidelity (commissioning slot), math render (output slot), workbook overlay (§9 when self-directed learner page).

**Exhibits:**

- Canonical contract only: [S78-T-008-assembled-dla-prompt-exhibit.txt](S78-T-008-assembled-dla-prompt-exhibit.txt)
- Full Copy instructions (self-directed partial workflow): [S78-T-008-full-copy-instructions-exhibit.txt](S78-T-008-full-copy-instructions-exhibit.txt)

---

## 3. Contract version

**`78-DLA-WS-1`** (`lib/ld-dla-page-enrich-contract.js` — `CONTRACT_VERSION`)

---

## 4. Final assembled prompt size/structure

| Surface | Chars | Lines | Notes |
| ------- | ----- | ----- | ----- |
| Canonical contract (workbook overlay on) | 28,698 | 253 | §§1–11 |
| Full Copy instructions (typical self-study partial) | 39,956 | 351 | + execution header, scaffold slots, table/math blocks, runner footer |

**Section order (canonical):** §1 Role → §2 Inputs → §3 Sources → §4 Production → §5 Task inputs → §6 Commissioning → §7 Evidence → §8 Providers → §9 Workbook overlay → §10 Output → §11 Examples

**Approximate section positions (% through canonical text):**

| § | Heading | Start % |
| - | ------- | ------- |
| 7 | EVIDENCE DECISION | 51.2% |
| 8 | PROVIDER AUTHORING | 55.3% |
| 9 | DOMAIN / WORKBOOK OVERLAY | 63.3% |
| 10 | OUTPUT CONTRACT AND SHAPE | 86.1% |
| 11 | ILLUSTRATIVE EXAMPLES | 94.1% |

---

## 5. All provider / `evidence_requirement` instructions in assembled prompt

| # | Section | Order | Wording (concise) | MUST vs descriptive | Provider id + `evidence_requirement` together? | Near output schema? |
| - | ------- | ----- | ----------------- | --------------------- | ---------------------------------------------- | ------------------- |
| 1 | §3 Sources | ~4% | Supporting-knowledge attachments may inform teaching specs **without becoming evidence_requirement providers** | Descriptive (negative) | No | No |
| 2 | §3 Sources | ~4% | Mixed excerpts… **provider_material_ids lists both** | Descriptive | ids only | No |
| 3 | §5 Task inputs | ~21% | **Listing a task input does not set evidence_decision.required; P01 and P02 remain independent** | Normative | No | No |
| 4 | §6 Commissioning | ~32% | **Response fulfilment… optional object… parallel to evidence_requirement** | Parallel optional pattern | No | No |
| 5 | §7 Evidence | ~51% | **If evidence_decision.required is true: list those task-input rows in provider_material_ids and attach evidence_requirement on those rows.** | **MUST** (conditional) | **Yes — single authoritative binding** | No (~35% before output) |
| 6 | §7 Evidence | ~51% | P01 and P02 remain independent | Normative | No | No |
| 7 | §8 Providers | ~55% | Evidence-provider authoring (**only when** required true); kind/purpose/learner_action/observable_features | Conditional field spec | Subfields only | No |
| 8 | §8 Providers | ~55% | Teaching/scaffold rows must not analyse focal evidence provider | Conditional guard | No | No |
| 9 | §9 Overlay | ~63% | Do not replace evidence decisions in §§4–8 | Subordinate guard | No | No (large interrupt) |
| 10 | §10 Output | ~86% | `evidence_decision { required, reason, provider_material_ids[] }` | Required activity field | ids in activity, not row | **Yes** |
| 11 | §10 Output | ~86% | **optional only on evidence-provider required_materials[] rows: evidence_requirement** | **Labels field optional** | **No — “optional” dominates** | **Yes — primary emission surface** |
| 12 | §10 Output | ~86% | when evidence_requirement is present it **MUST** include kind/purpose/learner_action/observable_features | Conditional MUST on presence | Subfields only | Yes |
| 13 | §11 Examples | ~94% | Miniature JSON: A1-M1 row **with** `evidence_requirement` + `evidence_decision.required: true` | Illustrative | **Yes — correct shape** | Yes (late) |
| 14 | §11 Examples | ~94% | Contrast: practice operands… **no evidence_requirement** | Contrast | Negative example | Yes |

**Pattern counts (canonical text):** `evidence_requirement` ×13 · `provider_material_ids` ×4 · `evidence_decision` ×9 · `response_fulfilment` ×8

---

## 6. Output schema / example treatment

| Question | Finding |
| -------- | ------- |
| Provider row example with `evidence_requirement`? | **Yes** — §11 shows full object on provider `scenario` row |
| Relationship to `provider_material_ids` visually obvious at output? | **Weak** — §10 lists `provider_material_ids` on activity and `evidence_requirement` on row as **separate bullets**; no invariant tying id ∈ provider_material_ids ⇒ row MUST carry object |
| Does generic `required_materials` shape make `evidence_requirement` look optional? | **Yes** — §10 lead line: **“optional only on evidence-provider… rows”** without restating the conditional MUST from §7 |
| Optional vs conditional distinguished? | **No** — same “optional only on X rows” pattern used for `response_fulfilment` and `evidence_requirement`; reader must infer conditional mandatory from distant §7 |
| Could model copy row shape without provider field? | **Yes** — A4 exhibit: correct `scenario` operand row (purpose/specification/material_type) + correct `evidence_decision` — exactly the shape minus the conditionally mandatory nested object |

**Example authority:** §11 prefixed “Illustrative miniature only — follows rules already stated above” — weakens worked evidence-provider example as emission anchor.

---

## 7. Instruction competition / salience findings

| Factor | Evidenced impact |
| ------ | ---------------- |
| Contract length | ~29k canonical / ~40k Copy — high competing instruction load |
| Mandatory rule far from JSON construction | §7 binding at 51%; §10 output schema at 86%; example at 94% |
| §9 workbook overlay between §8 and §10 | ~6.5k chars (IFP/G-gates/DLA-WB) **interrupts** provider authoring → output-shape flow |
| “Optional” output-schema label vs §7 MUST | **Primary structural defect** — model completed provider id closure but omitted nested object |
| Parallel optional-conditional fields | §6 `response_fulfilment` uses same “optional only on… rows” framing but §4 adds **explicit MUST bind** for load-bearing production — WS1 succeeded on A1–A4 while P02 row payload failed on A4 |
| Scaffold PRE-EMIT gates | §4 guided-learning PRE-EMIT gate (word counts) — **no equivalent deterministic P02 row-closure gate before emit** |
| S78 prompt growth | `response_fulfilment` block + §4 WS1 MUST added commissioning surface area; did not remove evidence rules |
| Truncation | Not observed — full prompt rendered in dump |
| Example gap for A4-like pattern | §11 example is evidence-true provider case (diagnosis scenario) — structurally applicable; salience problem is label/conflict not missing example genre |

**Candidate-specific:** Model behaviour matches **partial conditional compliance** — understands `evidence_decision.required: true` and lists provider, treats `evidence_requirement` as skippable optional nested object at emit time.

---

## 8. Source contract vs assembled prompt comparison

| Dimension | Source (`ld-dla-page-enrich-contract.js`) | Assembled prompt |
| --------- | ------------------------------------------- | ---------------- |
| §7 conditional MUST | Present | **Preserved verbatim** |
| §8 provider subfields | Present | **Preserved verbatim** |
| §10 output listing | “optional only on evidence-provider rows” | **Same — weakens §7 at emission point** |
| §11 example | Provider row + decision linked | **Preserved** |
| Workbook overlay | Injected §9 | **Present for self-study Lagrangian path** |

**Classification:** **Source strong / assembled weak** — guarantee exists in source but final prompt presentation at §10 output schema **dilutes conditional mandatory into optional-field framing**, with large §9 interruption before emission instructions.

Not **source/assembled conflict** in logic — **presentation conflict** between §7 MUST and §10 “optional”.

---

## 9. Relevant recent git-history finding

| Query | Result |
| ----- | ------ |
| `optional only on evidence-provider` introduction | Sprint 72 (`3cb1a4f`) — **not a Sprint 78 regression** |
| Canonical assembler | Sprint 77 (`d6041a5`) — preserved §7/§8/§10 structure |
| `response_fulfilment commissioning` | Present from Sprint 77 close / S78 contract version bump — **increased §4/§6 surface area** |
| Provider rule moved or removed? | **No** |
| Output example changed? | §11 evidence-true miniature retained from canonical assembler |

**Conclusion:** Not classification **D**. A **pre-existing intermittent prompt-reliability weakness** is easier to expose when the contract is more deterministic (more conditional row objects: archetype_plan, response_fulfilment, evidence_requirement) and fail-closed validation catches partial compliance.

---

## 10. Primary classification

### **A — Assembled prompt structurally weak / non-salient**

The source guarantee exists but final prompt presentation — especially §10 “optional only on evidence-provider rows” — makes reliable first-pass compliance unnecessarily fragile for Copilot-mediated paste workflow.

---

## 11. Is prompt reliability repair justified?

**YES**

Validator is correct; manual retry is not an acceptable product workflow; a **small structural prompt-contract repair** can materially improve first-pass P02 row closure without weakening validation.

---

## 12. Smallest semantically correct repair direction (DESIGN ONLY)

**Target:** `lib/ld-dla-page-enrich-contract.js` — §10 OUTPUT (primary); optional one-line cross-ref in §7.

1. **Replace optional-field framing with conditional row invariant in §10** (do not add duplicate prose blocks):

   ```
   REQUIRED on each required_materials[] row whose material_id appears in
   evidence_decision.provider_material_ids when evidence_decision.required is true;
   MUST NOT appear on other rows.
   When present (mandatory on provider rows above): kind, purpose, learner_action, observable_features …
   ```

2. **Add compact pre-output deterministic capture checklist in §10** (3–4 bullets max), including:

   - `provider_material_ids[i]` ⇒ matching row carries complete `evidence_requirement`
   - provider row ∈ `task_input_material_ids`

3. **Do not** repeat the same sentence in §3/§6/§8 — structural salience at **output construction** only.

4. **Optional:** Align phrasing with successful WS1 pattern — one explicit “P02 closure” label mirroring P01 independence note already in §5/§7.

5. **Tests:** extend `tests/ld-dla-evidence-decision-consistency-prompt.test.js` to assert §10 no longer leads with “optional only” without conditional REQUIRED invariant; no validator changes.

**Out of scope:** synthesising `evidence_requirement` post-paste, weakening P02, manual JSON repair, extra prompt bloat.

---

## 13. Why validator-only / manual retry is not sufficient

Prism workflow: **assemble prompt → Copilot → paste → validate**. No internal auto-retry. A deterministic contract violation that the prompt structurally invites (optional nested object after correct provider id listing) forces the operator into repeated regeneration with no guaranteed convergence — unacceptable as normal UX even when validation is correct.

---

## 14. Relationship to S78-WS-1 / T-008

- Candidate 1 remains T-008 evidence; **do not mark WS1 failed** on this rejection.
- **Do not continue benchmark** on “retry until valid” as the product strategy.
- **Block T-008 DLA regeneration benchmark** on a bounded prompt-contract repair task (below) before further operator-led fresh runs — otherwise repeated partial P02 omissions are predictable.

---

## 15. Files changed

| File | Change |
| ---- | ------ |
| `S78-T-008-candidate-1-prompt-reliability-diagnostic.md` | **Added** (this record) |
| `S78-T-008-candidate-1-fresh-dla-exhibit.json` | **Added** (preserved rejected candidate) |
| `S78-T-008-assembled-dla-prompt-exhibit.txt` | **Added** (canonical prompt dump) |
| `S78-T-008-full-copy-instructions-exhibit.txt` | **Added** (UI Copy path dump) |
| `S78-T-008-workstream-1-integration-verification.md` | **Updated** (classification + next task) |
| `STATUS.md` | **Updated** (T-008 prompt-reliability finding) |

---

## 16. Production / test / prompt / schema / validator / renderer changes

**All NO** (diagnostic session — no code edits).

---

## 17. Exact recommended next task

**S78-T-009 — DLA P02 provider-row output-shape salience repair (bounded prompt-contract only)**

- **Scope:** `lib/ld-dla-page-enrich-contract.js` §10 (+ minimal §7 cross-ref if needed); prompt consistency tests only.
- **Goal:** First-pass Copilot compliance for `provider_material_ids` ⇒ `evidence_requirement` row closure.
- **Exit:** Assembled prompt §10 expresses conditional REQUIRED invariant; tests green; no validator/schema weakening.
- **Then:** Resume S78-T-008 operator-led fresh DLA regeneration for WS1 benchmark.

**STOP — no implementation in this diagnostic.**
