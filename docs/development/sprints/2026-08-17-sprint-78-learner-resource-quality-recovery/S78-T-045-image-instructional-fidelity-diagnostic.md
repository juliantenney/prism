# S78-T-045 — Image instructional-fidelity diagnostic

**Task:** S78-T-045  
**Status:** **DIAGNOSTIC COMPLETE** (2026-08-25) — **full specimen set deposited; synthesis claim pixels confirmed**  
**Mode:** DIAGNOSTIC ONLY — **no production code changes**  
**Sprint 78:** OPEN · **T-013:** remains OPEN  

**Parked (out of scope):** Hydrology learner-workspace / interactivity findings — separate pre-alpha product question.

---

## 0. Specimen availability

| Artefact | Status |
| -------- | ------ |
| Design Page visual planning + `page_synthesis` | **Deposited** (operator paste, 2026-08-25) |
| Assembled page (`Water Through the Earth System`) | **Deposited** (operator paste; activities A1–A5 + GAM materials + DP visuals) |
| Reconstructed live human/canonical prompts for key affordances | **Compiled locally** → `artefacts/hydrology-va-*-prompt*.txt` (not operator-exported; same assembler) |
| Generated synthesis / activity images | **Complete** — A1–A5 + `va-page-knowledge-summary-01` deposited |
| Operator-copied live prompts from Graphics UI | **Complete** — A1–A5 + synthesis operator human prompts deposited |

Primary synthesis figure under investigation: **`va-page-knowledge-summary-01`** (`scope: page`, `purpose: synthesis`, `preferred_representation: concept_map`, slot `knowledge-summary-after-content`).

Related activity commissions that can bleed labels into a “basin + cycle” reading: **`va-A1-system-01`** (authorises “atmospheric…”), **`va-A3-basin-system-01`** (boundary crossing), **`va-A4-balance-01`** (residence time).

---

## 0A. Specimen claim-fidelity — final after all figures

Authorised learner prose for the integrated model is strongest in `page_synthesis.knowledge_summary` + study tips + A3/A4 teaching text.

| Image claim / relationship (QA) | Authorisation vs THIS resource | Final on-image evidence | Final class |
| -------------------------------- | ------------------------------ | ----------------------- | ----------- |
| **“Atmospheric inputs”** | Unsupported as basin-input category (KS input = precipitation; A1 atmosphere = store/location) | **Synthesis panel 2:** peer icon/label beside Precipitation + Upstream inflows. Absent as that phrase on A1–A5. | **B → D** |
| **Upstream inflows** | Unsupported (A3 input = precipitation) | **A3** stream into basin → **A4** “other inflows” → **Synthesis** peer label “Upstream inflows” | **B → D** (escalating) |
| **Cross-basin outflows** | Mouth discharge + ET authorised; inter-basin exit unsupported | **A3** lateral exit precursor → **Synthesis** peer label **“Outflows to other basins”** (alongside authorised discharge + ET) | **B → D** |
| **Overly deterministic residence→response** | Residence qualifies timescale; must not set storage direction | **A4 + synthesis:** separate from balance; “influences” / “helps explain differences in response timescale”. Direction-collapse **not realised**. | **Direction: A.** Speed: soft **D?** only |

**Commission quality note (synthesis):** Careful on residence→direction and conditional controls, but Show list “drainage-basin **inputs and outputs around the system**” is underspecified. Synthesis **human** prompt has **no Concept boundary**, invites “integrate relationships across the lesson”, and includes **no evidence prose** — model filled textbook open-system completions.

**Compiled / operator live human prompt facts** (`artefacts/hydrology-va-page-knowledge-summary-01-human-prompt.txt` + `*-operator-human-prompt.txt`):

- `knowledge_synthesis` mode present  
- **No** `Concept boundary` section  
- **No** Evidence basis / KS body text  
- Show list repeats underspecified “drainage-basin inputs and outputs around the system”  
- Claim discipline includes disallowed “Residence time alone determines storage direction” (honoured on figure)

---

## 0B. Activity 1 figure — `va-A1-system-01` (image + operator human prompt deposited)

**Affordance:** activity-scoped annotated_system · pre_classification · concept boundary **present** in live prompt.  
**Artefacts:** `artefacts/hydrology-va-A1-system-01.jpg` · `hydrology-va-A1-system-01-operator-human-prompt.txt`

### Pedagogical hit (what worked)

| Requirement | On-image evidence |
| ----------- | ----------------- |
| Atmospheric / surface / subsurface parts | Right-side brackets: Atmospheric / Surface / Subsurface part |
| Store vs transfer discrimination | Legend: light-blue “Water store” boxes vs dark-blue “Transfer (movement)” arrows |
| Multiple directional movements + branching | Precipitation can route to surface/ocean/infiltration; groundwater flow vs return to rivers |
| Not a single mandatory circle | Landscape cross-section with branching arrows, not one loop |
| Anti-spoiler vs ten-component table | Does **not** enumerate completed Store/Transfer answers for the ten task-card items |

### On-image inventory (observed labels)

**Stores:** Water in the atmosphere; Ice and snow store; Rivers and streams store; Lakes store; Ocean store; Soil moisture store; Groundwater store.  
**Transfers (named):** Precipitation; Condensation; Evaporation; Runoff; Infiltration; Percolation; Groundwater flow.  
**Also shown:** melt/ice→river arrow; groundwater→river return; ocean/land evaporation dashed arrows.

### Claim-fidelity (A1 only)

| On-image claim / element | Authorised in A1 prose / commission? | Class | Notes |
| ------------------------ | ------------------------------------ | ----- | ----- |
| Atmospheric / surface / subsurface parts | Yes — A1 must_show + context | **A/B** | Commissioned and realised |
| Water in the atmosphere (store) | Yes — A1-M1 oceans/atmosphere/stores; task “Atmosphere” | **A** | Correct store framing (not “atmospheric inputs”) |
| Ice and snow / glacier ice | Yes — A1-M1 glaciers; task “Glacier ice” | **A** | |
| Rivers and streams / river water | Yes — A1-M1; task | **A** | |
| Lakes / oceans as stores | Yes — A1-M1 lists lakes, oceans | **A** | |
| Soil moisture / groundwater stores | Yes — A1-M1; task | **A** | |
| Precipitation, evaporation, infiltration, percolation, runoff, groundwater flow | Yes — A1-M1 transfers | **A** | |
| **Condensation** (named transfer) | **No** in A1-M1 / A1 task cards / A1 must_show. Taught later in **A2**. Prompt Concept boundary forbids additional concepts | **D** | Model adds scientifically plausible transfer not commissioned for A1 |
| Store/transfer legend as classification key for the ten items | Intentionally structural hint, not filled worksheet | **OK** | Matches allow_structural_hint / anti-spoiler |

### Implications for QA synthesis issues

| QA synthesis concern | After seeing A1 |
| -------------------- | --------------- |
| “Atmospheric inputs” | **Not present on A1.** A1 correctly shows atmosphere as a **store** (“Water in the atmosphere”) and “Atmospheric part”. Strengthens hypothesis that the bad phrase is a **synthesis-figure** (or other later figure) invention / merge, not copied verbatim from A1. |
| Upstream inflows / cross-basin outflows | **Not present on A1.** Still await A3 + synthesis figures. |
| Residence-time determinism | N/A for A1 |

### Prompt-path note

Operator A1 prompt includes full **Concept boundary** and activity-learning-support mode — confirms live copy used the **human** assembler path. Despite that, **Condensation** still appears → concept-boundary language is **soft**; model can still add standard-cycle extras not in Show/must_show.

**Standby:** A3 / A4 / synthesis images + prompts.

---

## 0C. Activity 3 figure — `va-A3-basin-system-01` (image + operator human prompt deposited)

**Affordance:** activity-scoped annotated_system · pre_classification · concept boundary present.  
**Artefacts:** `artefacts/hydrology-va-A3-basin-system-01.jpg` · `hydrology-va-A3-basin-system-01-operator-human-prompt.txt`

### Pedagogical hit (what worked)

| Requirement | On-image evidence |
| ----------- | ----------------- |
| Clearly defined drainage-basin boundary | Dashed blue “System boundary” along ridgeline |
| Crossing into / within / out | Legend + colour coding: blue into, green within, orange out |
| Boundary as classification cue | Labels stay functional (“crossing into/out”, “moving or held within”) — does **not** name the twelve task-card classifications |
| Open-system idea | Water enters and leaves across the boundary |

### Critical fidelity findings (maps to QA)

| On-image element | Authorised in A3 / KS? | Class | Notes |
| ---------------- | ---------------------- | ----- | ----- |
| Basin boundary + functional into/within/out scaffold | Yes — A3 must_show + allowed claims | **A/B** | Commissioned structure realised |
| Rain cloud → “Water crossing into system” | Yes — A3-M1: precipitation is the major input | **A** | Aligns with taught input |
| Main river outlet → “Water crossing out of system” | Yes — river discharge as output | **A** | Aligns with taught output |
| **Stream entering across the boundary from outside** (“Water crossing into system”, left) | **No.** Taught model: precipitation is the major input; watershed divide should not admit streamflow from outside the basin | **D** (enabled by **B**) | This is the QA **upstream inflow** pattern. Commission only said “water movement crossing into the boundary” without restricting to precipitation / excluding external channel inflow |
| Snow/ice arrow from **outside** the dashed line into the basin as input | Weak/unsupported — ice/snow within basin is a **store**; melt is internal unless precipitation/snowfall is the crossing | **D** / weak **B** | Treats external snowpack as basin input |
| Secondary stream exiting boundary to the side (not only mouth discharge) | Partially overlaps discharge/output; can read as **cross-basin / adjacent-catchment outflow** | **B→D?** | QA “cross-basin outflows”: main-mouth exit is authorised; **lateral** exit invites over-reading as inter-basin transfer |

### Commission gap (earliest divergence for upstream inflow)

A3 `must_show` / context authorise generic “crossing into” without:

- requiring precipitation (or atmospheric water) as the exemplar input, or  
- prohibiting channel inflow from outside the watershed.

Live prompt Concept boundary did **not** stop the model from inventing a textbook-plausible but **unauthorised** upstream stream input. Soft claim discipline also never listed “no upstream channel inflows” / “no cross-basin transfers.”

### Update to §0A QA rows

| QA claim | After A3 image |
| -------- | -------------- |
| Upstream inflows | **Confirmed on A3** — stream crossing into basin from outside → **B (underspecified must_show) → D (image model)** |
| Cross-basin outflows | **Partially present** — authorised mouth discharge **A**; lateral orange exit **B→D?** (over-read risk). Still check synthesis figure |
| Atmospheric inputs | Still **not** on A3 (generic “crossing into”; rain is unlabelled as precipitation). Await synthesis |
| Residence-time determinism | N/A for A3 |

**Standby:** A5 (optional) + synthesis.

---

## 0D. Activity 4 figure — `va-A4-balance-01` (image + operator human prompt deposited)

**Affordance:** activity-scoped causal_model · separates balance vs residence-time pathways.  
**Artefacts:** `artefacts/hydrology-va-A4-balance-01.jpg` · `hydrology-va-A4-balance-01-operator-human-prompt.txt`

### Pedagogical hit (what worked)

| Requirement | On-image evidence |
| ----------- | ----------------- |
| Two-stage structure | Stage 1 (blue) Balance→Storage Direction · Stage 2 (green) Residence Time→Response Speed |
| Balance → increasing/decreasing storage | Inputs vs outputs → Inputs>Outputs / Outputs>Inputs → storage up/down |
| Separate residence-time branch | Parallel column; does **not** feed into storage-direction decision |
| Faster soil moisture vs slower groundwater | Explicit short/long residence + “change appears faster/slower” |
| No Alpha/Beta solutions | No scenario values, no worked numeric conclusion |
| Explicit pathway separation caption | Footer: “Balance determines direction…” / “Residence time influences how quickly…” |

### Critical fidelity findings

| On-image element | Authorised? | Class | Notes |
| ---------------- | ----------- | ----- | ----- |
| Residence does **not** determine storage direction | Yes — central A4/KS claim discipline | **A** | Strong compliance; primary QA risk **avoided** on this figure |
| Soil short / GW long → faster / slower response | Yes as qualitative contrast; commission Show list | **A** / soft **D?** | Fixed mapping slightly harder than “influences / helps explain”; footer uses “influences” |
| **“Precipitation + other inflows”** | Taught major input = precipitation; “other inflows” **not** authorised | **D** | Continues A3 upstream-inflow pattern into A4 labels |
| **“Evapotranspiration + other outflows”** | Taught outputs = ET + river discharge; vague “other outflows” | **D** / **B→D** | Opens cross-basin / extra-output reading; discharge not even named |
| Footer sentences finishing the model | Structural scaffold permitted | **A/B** | Short; still leaves Alpha/Beta application to learner |

### Update to QA rows

| QA claim | After A4 image |
| -------- | -------------- |
| Overly deterministic residence→**direction** | **Not on A4** — figure correctly separates; footer denies that reading |
| Overly deterministic residence→**speed** | Mild fixed short→fast / long→slow; soft claim-strength issue only |
| Upstream inflows / extra outputs | **Label bleed on A4:** “other inflows/outflows” — concept-boundary miss |
| Atmospheric inputs | Still await synthesis |

**Standby:** synthesis concept map (primary remaining QA target).

---

## 0E. Activity 5 figure — `va-A5-causal-chain-01` (image + operator human prompt deposited)

**Affordance:** activity-scoped causal_chain · reusable condition→process→consequence scaffold.  
**Artefacts:** `artefacts/hydrology-va-A5-causal-chain-01.jpg` · `hydrology-va-A5-causal-chain-01-operator-human-prompt.txt`

### Pedagogical hit

| Requirement | On-image evidence |
| ----------- | ----------------- |
| Three-stage ordered chain | Observed condition → Hydrological process → Affected store or flow |
| Conditional connection | “CONDITIONAL LINK — Under the stated catchment circumstances” under all stages |
| No Catchment 1/2/3 / transfer answers | Stages unfilled for scenario content |
| Claim discipline vs unconditional outcomes | Footer: strength/direction “depend on catchment circumstances” |

### Fidelity / mode conflicts

| On-image element | Brief tension | Class |
| ---------------- | ------------- | ----- |
| Three **dashed empty boxes** under stages | Context asks “unfilled” structure; Avoid list forbids answer boxes / writing frames / blank organisers / moving exercises into the image | **Mode conflict (commission vs global avoid)** — empty response fields on the figure itself |
| Generic icons (mountain/excavator; drop/infiltration; river/store) | Illustrative stage cues; not scenario answers | **A/B** — acceptable structural hints |
| Footer explanatory strip | Short scaffold captions | **A/B** |

### Relation to QA synthesis claims

A5 does **not** depict atmospheric inputs, upstream inflows, cross-basin outflows, or residence-time→direction. No update to those four rows from this figure.

**Secondary finding:** A5 shows the known risk of **worksheet affordances bleeding into the image** when Context says “unfilled” and Avoid forbids fill-in fields — prompt self-conflict.

---

## 0F. Synthesis figure — `va-page-knowledge-summary-01` (image + operator human prompt deposited)

**Affordance:** page-scoped concept_map · knowledge_synthesis · **no Concept boundary** in live human prompt.  
**Artefacts:** `artefacts/hydrology-va-page-knowledge-summary-01.jpg` · `hydrology-va-page-knowledge-summary-01-operator-human-prompt.txt`

### Pedagogical hit

| Requirement | On-image evidence |
| ----------- | ----------------- |
| Stores connected by transfers | Central landscape: snow & ice, surface water, soil moisture, groundwater + transfer arrows |
| Balance → storage direction | Panel 4: Inputs >/≈/< Outputs → storage tends to increase / steady / decrease |
| Residence → response timescale (not direction) | Panel 5: “Helps explain differences in response timescale”; separate from panel 4 |
| Conditional catchment controls | Panel 6 + footer: “All relationships are conditional within the simplified model” |
| Authorised outputs present | River discharge at basin outlet; Evapotranspiration to atmosphere |

### Critical fidelity findings (QA smoking guns)

| On-image label / element | In KS / must_show / allowed_claims? | Class | Notes |
| ------------------------ | ----------------------------------- | ----- | ----- |
| **“Atmospheric inputs”** (panel 2 peer to Precipitation) | **No** as basin input | **D** | Merges A1 atmospheric *part/store* vocabulary with basin “inputs” framing |
| **“Upstream inflows”** (panel 2 peer) | **No** | **D** | Promotes A3 invented channel inflow + A4 “other inflows” to synthesis category |
| **“Outflows to other basins”** (panel 3 peer to discharge + ET) | **No** | **D** | Explicit cross-basin outflow category; KS only discharge + ET |
| Precipitation as input | **Yes** | **A** | Correct taught input |
| River discharge + ET as outputs | **Yes** | **A** | Correct taught outputs |
| Residence does not set storage direction | **Yes** (disallowed claim honoured) | **A** | Primary “deterministic residence→direction” QA reading **not** on this figure |
| Vegetation as named store | KS lists vegetation among stores | soft **B** omission | Snow/ice, surface, soil, groundwater shown |

### Bleed / escalation path (confirmed)

```text
A1 “Atmospheric part” / atmosphere-as-store
  + synthesis Show “inputs … around the system”
  → synthesis “Atmospheric inputs”

A3 stream crossing into basin (B→D)
  + A4 “other inflows”
  → synthesis “Upstream inflows”

A3 lateral “crossing out”
  + synthesis Show “outputs around the system”
  → synthesis “Outflows to other basins”
```

### Earliest divergence for the three invented synthesis labels

| Step | What happened |
| ---- | ------------- |
| **B** | DP Show/context: generic “inputs and outputs around the system” without enumerating precipitation-only / discharge+ET-only or forbidding upstream/cross-basin |
| **C (mode)** | Synthesis human assembler: no Concept boundary; no evidence prose; “integrate across the lesson” |
| **D** | Image model supplies textbook-complete open-system triad (atmospheric inputs, upstream inflows, outflows to other basins) |

Activity figures were precursors; **synthesis is where the unsupported categories become explicit peer labels**.

---

## 1. Exact live image-generation path

```text
DLA
  → activities[] (+ required_materials); may imply visual need only indirectly
GAM
  → materials[] bodies (instructional prose) — does NOT author visual_affordances[]
Learning Sequence / other stages
  → (no image commission ownership)
Design Page (authoritative visual planning)
  → visual_affordance_schema_version
  → activities_visual_review[]
  → visual_affordances[]   ← WHAT to show, claim bounds, evidence_anchors, must_show/must_not_show
Assemble (page-vnext-assemble)
  → copies Design Page visual fields onto assembled page; attaches GAM materials to activities
Utilities / Graphics workspace
  → validateVisualPlanningContract(page)
  → planPrismVisualJobs(page)     ← resolves evidence_anchors → resolved_sources
  → compilePrismImageBriefs(...)  ← generation_instruction (canonical) + source_evidence
  → buildVisualJobHumanPrompt(brief)  ← LIVE operator copy path for image models
Image model (external)
  → generated image bytes (session / Workflow Resources association)
Capture / associate
  → asset bound to affordance / figure slot
Learner renderer (vNext)
  → figure with alt_text + detailed_description (not generation_instruction)
```

**Primary modules:** `lib/ld-design-page-partial-contract.js`, `lib/sprint38-visual-affordances.js`, `lib/visual-planning-contract.js`, `lib/prism-visual-jobs-planner.js`, `lib/prism-image-brief-compiler.js`, `lib/utilities-visual-jobs-workspace.js`, `lib/learner-figure-description-contract.js`.

---

## 2. Hydrology synthesis-image commissioning source

**Identified:** Design Page affordance **`va-page-knowledge-summary-01`**.

| Field | Value |
| ----- | ----- |
| Scope / region | `page` / `knowledge_summary` |
| Purpose / representation | `synthesis` / `concept_map` |
| Evidence anchors | `page_synthesis.knowledge_summary`, `learning_purpose`, `study_tips` |
| Subject | Integrated hydrological systems model |
| Tier / risk | essential / medium |

**Not GAM-owned.** Activity materials supply teaching content; DP authored the visual commission. A2 visual is **defer**.

---

## 3. Instructional context available at prompt assembly

When a page **is** assembled and a generate affordance validates, the planner/compiler can access:

| Field family | Available? |
| ------------ | ---------- |
| Affordance `subject`, `context`, `purpose`, `preferred_representation` | Yes (DP) |
| `must_show[]`, `must_not_show[]`, `allowed_claims[]`, `disallowed_claims[]` | Yes (DP; schema-required for generate) |
| `canonical_discipline_note`, `discipline_risk_level`, S78-DP salience text in DP contract | Yes (contract-level; quality depends on authoring) |
| `evidence_anchors[]` → `resolved_sources[]` with full `content_text` from activity fields / materials / `page_synthesis.*` | Yes in **job/brief** |
| Activity title, learner_task, expected_output, material bodies | Yes **if** anchored and present on page |
| Surrounding non-anchored activities | **No** (no crawl; only explicit anchors) |
| Entire page dump | **No** (by design) |

---

## 4. Instructional context actually supplied to the **live** image prompt

There are **two** prompt artefacts:

| Artefact | Role | Includes resolved evidence prose? |
| -------- | ---- | --------------------------------- |
| `generation_instruction` (canonical) | Structured brief; UI “Canonical prompt” | **Yes** — “Evidence basis” with **~240-char clips** per source (`prism-image-brief-compiler.formatEvidenceBasis`) |
| `human_prompt` (`buildVisualJobHumanPrompt`) | **Primary operator copy path** for image generation | **No** — subject/context/`must_show`/claim lists/representation guidance only |

Verified on fixture `tests/fixtures/page-assemble/roman-roads-visual-jobs-valid.json` page-scoped Knowledge Summary brief:

- Human prompt carries synthesis mode, subject, context, Show/Avoid, Claim discipline.
- Human prompt does **not** include an Evidence basis section or full knowledge-summary body.
- Canonical prompt **does** include Evidence basis (clipped).

So live generation typically operates from a **mixture**: Design Page commission fields + short claim lists — **not** full instructional evidence — unless the operator manually pastes canonical evidence or UI evidence panels.

**Hydrology synthesis confirmation:** reconstructed human prompt for `va-page-knowledge-summary-01` matches this pattern (`human_has_evidence_basis: false`, `human_has_concept_boundary: false`, `human_has_synthesis_mode: true`).

---

## 5–6. Claim-fidelity table (QA-reported issues) + earliest divergence

**Authoritative specimen table is §0A**; pixel confirmation is §0F. Final:

| Claim | Final class | Earliest divergence |
| ----- | ----------- | ------------------- |
| Atmospheric inputs | **B → D** | Underspecified synthesis “inputs around system” + A1 atmospheric vocab → model coins peer label on synthesis |
| Upstream inflows | **B → D** | Underspecified A3 “crossing into” → A3/A4 precursors → synthesis peer label |
| Cross-basin outflows | **B → D** | Underspecified “outputs around system” → A3 lateral precursor → synthesis “Outflows to other basins” |
| Deterministic residence→direction | **A** (not realised) | Commission + A4/synthesis captions correctly separate pathways |
| Soft fixed residence→speed | soft **D?** | Qualitative contrast slightly harder than “helps explain” |

Operator-deposited prompts match the **human** assembler path (synthesis: no Concept boundary; no Evidence basis).

**Classification key:**

| Code | Meaning |
| ---- | ------- |
| A | Already in authorised learner prose/material |
| B | Introduced by DP image commission (`subject`/`context`/`must_show`/`allowed_claims`/alt/detailed_description) — *not GAM; GAM does not own affordances* |
| C | Introduced only by prompt assembly (human/canonical wording not present upstream) |
| D | Introduced by image model despite a bounded prompt |
| E | Cannot be determined from available artefacts |

---

## 7. Current ownership boundary

| Concern | Owner |
| ------- | ----- |
| Instructional content of the image (what claims/entities/relationships) | **Design Page** `visual_affordances[]` (+ S78-DP salience) |
| Source prose grounding | **Anchored** DLA/GAM/page_synthesis fields via `evidence_anchors` → planner `resolved_sources` |
| Visual composition / representation template | Affordance `preferred_representation` + human/canonical structural guidance |
| Live prompt packaging | `utilities-visual-jobs-workspace.buildVisualJobHumanPrompt` (+ compiler `generation_instruction`) |
| Pixel realisation | **External image model** |
| Learner-facing figure copy | DP `alt_text` / `detailed_description` / caption_intent (renderer) |

**Intended split (already stated in contracts):** PRISM/DP determine instructional content and constraints; image model determines visual realisation within those constraints. **Enforcement is soft** (prompt language), not hard validation of on-image labels.

---

## 8. Existing anti-hallucination / claim-bounding protections

| Protection | Where | Strength |
| ---------- | ----- | -------- |
| Required `must_show` / `must_not_show` / `allowed_claims` / `disallowed_claims` | Sprint 38 generate schema | Structural presence only — content quality not checked |
| S78-DP: visuals must not introduce stronger conclusions / broader representation classes | Design Page contract | Salience; no verifier |
| Human prompt “Claim discipline” + “Use only claims supported by the supplied brief” | Human prompt assembler | Soft |
| Activity-only “Concept boundary” (“Only depict concepts supplied… Do not introduce additional…”) | Human prompt | **Stronger for activity scope** |
| Synthesis soft line: “Do not invent unsupported concepts beyond the authored Knowledge Summary brief” | Human prompt | Soft; “brief” ≠ full KS body |
| Canonical “source-supported” representation templates | Image brief compiler | Soft; evidence clipped |
| Anti-spoiler / worksheet-style avoids | Human prompt | Different concern (task leakage), not claim fidelity |

---

## 9. Gaps in those protections

1. **Synthesis / page-scoped prompts intentionally omit the activity Concept boundary** (Slice 7B tests assert this). Diagnostics even treat absence of “no extra concepts” language as expected for synthesis.
2. **Synthesis mode invites integration:** “Reveal system organisation and integrate relationships across the lesson” — pedagogically useful, but increases risk of plausible-but-uncommissioned structure.
3. **Live human prompt omits resolved evidence prose** that the planner already resolved — grounding is available but not in the operator copy path.
4. **Canonical evidence is clipped (~240 chars)** — insufficient for dense synthesis diagrams even when canonical is used.
5. **No requirement that every on-image label map 1:1 to `must_show` / allowed claims** — cannot fail-closed at compile time.
6. **No special “synthesis = higher instructional authority / risk” enforcement** beyond `purpose: synthesis` and softer prompt mode (discipline_risk_level exists but is not a separate synthesis policy).
7. **GAM does not participate** in image claim bounding — if DP commissions from topic-level subject/context, activity materials may never constrain the figure.

---

## 10. Root problem class

**Combination**, weighted:

| Factor | Role for Hydrology-class failures |
| ------ | --------------------------------- |
| Insufficient source context in **live** prompt | **High** — evidence not in human prompt; clips in canonical |
| Weak / topic-oriented image commission (DP) | **Likely high** — hypothesis fits; specimen E |
| Weak prompt assembly for **synthesis** | **High** — intentional omission of concept boundary + integrate-across-lesson wording |
| Image-model non-compliance | **Possible** (D) once prompt is proven tight — specimen E |
| Insufficient full-page dump | **Not** the primary gap — dumping the page is not required; **selected authorised claims + grounded excerpts** are |

Hypothesis after architecture trace (not specimen-proven):

> Synthesis images are commissioned and prompted more like integrative topic visuals than like strict visualisations of already-authorised instructional claims.

---

## 11. Smallest recommended hardening (design only — do not implement here)

Prefer strengthening existing commission/prompt boundary (no new schema if fields already exist):

1. **Synthesis claim-grounding rule (human prompt):** For `knowledge_synthesis` / `purpose: synthesis` / page-scoped jobs, add an explicit boundary equivalent to activity concept boundary, framed for synthesis:
   - Visualise only `must_show` + `allowed_claims` (+ exact labels if authored).
   - Do **not** add processes, fluxes, categories, or causal strength beyond those lists.
   - Soften or replace “integrate relationships across the lesson” with “integrate **only** relationships authorised in Show / Supported claim boundary.”
2. **Include compact grounded evidence in the live human prompt** for synthesis (and optionally high `discipline_risk_level`): short excerpts from `source_evidence` / resolved anchors — not the whole page; prefer knowledge_summary + explicitly anchored materials.
3. **Design Page salience (S78-DP extension):** For synthesis/generate rows, require that `must_show` / `allowed_claims` / `disallowed_claims` name the **taught basin/cycle entities and claim strength**, and list plausible-but-out-of-scope hydrology extensions under `must_not_show` / `disallowed_claims` when risk is high.
4. **Keep ownership split:** DP owns instructional content; image model owns layout within bounds. Do not move image authorship to GAM.

Optional later: soft diagnostic when `must_show` is generic (“water cycle”) while `discipline_risk_level` is medium/high.

---

## 12. Proposed live-path regression strategy

1. **Fixture:** page-scoped synthesis affordance with tight `must_show` / `allowed_claims` / `disallowed_claims` and anchored `page_synthesis.knowledge_summary`.
2. **Assert human prompt contains:** explicit no-extra-process/relationship language; Show/claim lists; (after hardening) evidence excerpts or labelled “Authorised source claims” section.
3. **Assert human prompt does not contain:** open-ended “integrate across the lesson” without bound, if that wording is narrowed.
4. **Golden/snapshot** optional for human prompt string stability.
5. **Operator specimen gate (Hydrology):** once package deposited — classify A–D for the four QA claims; prove earliest divergence before coding.

Do **not** treat image-model pixel QA as unit-testable; bound the commission/prompt.

---

## 13. Regeneration after implementation

| Change | Regen needed? |
| ------ | ------------- |
| Human-prompt assembler only | **Image regeneration** (and re-associate assets); instructional page text may stand |
| Design Page salience / re-authored affordance fields | **Design Page re-run** (or edit) + recompile briefs + **image regen** |
| Full EP→GAM path | Only if upstream prose must change; **not** required for prompt-boundary fix alone |

---

## 14. Files inspected

- `lib/utilities-visual-jobs-workspace.js` (human prompt; activity vs synthesis modes)
- `lib/prism-image-brief-compiler.js` (canonical `generation_instruction`; 240-char evidence clips)
- `lib/prism-visual-jobs-planner.js` (evidence resolution)
- `lib/visual-planning-contract.js`, `lib/sprint38-visual-affordances.js`
- `lib/ld-design-page-partial-contract.js` (S78-DP + visual ownership)
- `lib/learner-figure-description-contract.js`
- `lib/ld-gam-page-enrich-contract.js` (no visual affordance ownership)
- `tests/sprint-70-slice-7b-activity-vs-synthesis-prompt.test.js`
- `tests/fixtures/page-assemble/roman-roads-visual-jobs-valid.json`
- Sprint docs: S78-T-025, COMPLETENESS-VALIDATION-ALPHA-1.0 (Hydrology misbind note), S73-T-001 lifecycle note path under Sprint 73

---

## 15. Files changed (docs only)

- This record: `S78-T-045-image-instructional-fidelity-diagnostic.md`
- Specimen helpers + deposited figures/prompts under `artefacts/hydrology-va-*` (A1–A5 + synthesis jpg + operator human prompts)
- Minimal sprint navigation: STATUS, HANDOVER, PLAN, SPRINT-78-START-HERE, next-chat-briefing

**Production code:** unchanged.

---

## 16. Unresolved risks

- Closing synthesis concept-boundary too hard could reduce legitimate consolidation visuals — tune wording carefully.
- Operators may still copy an incomplete prompt if UI encourages human-only copy.
- Prior Hydrology A3/A5 misbind (older run) shows semantic conformance remains outside Alpha structural validation; this deposit’s activity bindings look coherent.
- Soft residence→speed determinism and A5 fill-in-box mode conflict are secondary; not the principal QA synthesis failures.

---

## 17. Sprint state

**Sprint 78:** OPEN  
**T-013:** OPEN  
**T-045:** diagnostic complete; **full specimen (page + A1–A5 + synthesis) claim pixels confirmed** — hardening still design-only (§11)  
**Learner-workspace/interactivity (Hydrology):** PARKED — separate pre-alpha scope decision

---

## Appendix — Principle under investigation (not adopted as solution yet)

> A learner-resource image should visualise authorised instructional content and relationships; it should not extend the taught model merely because an extension is scientifically plausible.

**Architecture verdict (confirmed on specimen):** Activity prompts partially encode this (Concept boundary present; still soft — A1 Condensation, A3 upstream stream). **Synthesis prompts intentionally omit Concept boundary and evidence prose**; underspecified “inputs/outputs around the system” + integrate-across-lesson mode let the image model mint textbook-complete categories. Hardening should make the principle **operational for synthesis** via enumerated `must_show` / `must_not_show` / `allowed_claims` + live human-prompt grounding (§11) — **not** by treating the image model as the instructional author.
