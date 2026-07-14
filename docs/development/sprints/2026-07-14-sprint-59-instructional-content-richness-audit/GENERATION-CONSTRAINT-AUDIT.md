# Sprint 59 — Generation-Constraint Audit

**Date:** 2026-07-14  
**Type:** Read-only causal evidence investigation  
**Scope:** EP, DLA, GAM, Design Assessment (DA), Generate Assessment Items (GAI), LS, DP, and shared generation utilities  
**Evidence base:** Current implementation (`app.js`, `domains/learning-design/domain-learning-design-step-patterns.md`, `lib/*` contracts/validators), Sprint 58 partial architecture, first-audit stage captures (`artefacts/first-audit/`), historical sprint documentation  
**Related:** [FIRST-AUDIT-SUMMARY.md](FIRST-AUDIT-SUMMARY.md), [FIRST-AUDIT-HYPOTHESES.md](FIRST-AUDIT-HYPOTHESES.md), [instructional-archetype-audit.md](instructional-archetype-audit.md) (later root-cause: archetype support asymmetry), [backlog.md](backlog.md)

**Constraints respected (this document):** No runtime, prompt, schema, validator, or workflow changes were made *during this audit document’s production*. Subsequent Sprint 59 Iterations 1–7 and archetype-framework work **did** change GAM guidance (see [decisions.md](decisions.md) S59-D06).

---

## 1. Executive conclusion

The codebase contains **strong anti-compression intent** for GAM and Design Page material bodies, paired with **explicit depth floors in pack prompts** (GAM-PRES-07/08/09: text ≥120 words, scenario perspectives ≥40 words each, transfer ≥80 words, etc.). However, the **active Sprint 58 partial-page path** (`pageEnrichmentV2` + `partialPageOutputs`) validates GAM captures with **presence-only checks** (`materials[].body` non-empty). Word-count and depth-floor rules exist in prompts and legacy pack-text heuristics but are **not blocking** on the v2 GAM capture gate used by the three first-audit workflows.

**Confirmed structural asymmetry:** DLA scaffold fields are enforced with **blocking word minimums** at capture (`applyGuidedLearningScaffoldRepairToDlaCapture` → `LD-GUIDED-LEARNING-SCAFFOLD`). GAM material bodies have **no equivalent blocking depth gate** on v2 partial captures.

**Confirmed prompt tension on GAM:** The canonical GAM pack template instructs the model to *“keep wording concise while still realising every required material body in this single response”* in the same block that forbids compression and defines ≥120-word exposition floors. This is **legacy output-limit mitigation wording** coexisting with anti-thinning rules.

**Confirmed model-output limits:** PRISM sets `max_output_tokens` only for **workflow design/review** and **refinement/QA** API calls (`getTokenBudgets()` in `app.js`). **Workflow run-mode generation steps** (DLA, GAM, GAI, LS, DP) copy augmented prompts to **Copilot**; PRISM does not apply a stage-specific output token cap on those steps. Effective limits are **external and unknown** from repository configuration alone.

**Assessment “missing feedback” in first audit:** **Not supported as a generation absence.** Stage captures for FA-01 and FA-02 include populated `explanation_or_rationale` on all five MCQ items. The first audit searched for `feedback` / `rationale` field names, not the canonical `explanation_or_rationale`. GAI prompts **do** instruct concise one-sentence rationales; renderer `feedback_display: answer_grid_end` affects **display placement**, not capture field presence.

**Most plausible causal chain for systematic GAM thinness (Strongly supported, not Confirmed without live Copilot traces):**

1. Pack + runtime prompts ask for depth but also say “concise” and require all materials in one partial JSON response.
2. v2 validators accept any non-empty `body` — thin bodies pass capture.
3. Legacy GAM-FMT thin-body heuristics (char-based) are **warning-only** and bypassed entirely on the v2 enrichment path.
4. External model output pressure (Copilot context window / response length) is uninstrumented in PRISM.

**Additive-architecture residue:** Sprint 56F–58 moved from full-page / enrich-in-place generation toward **partial stage outputs**. Residue includes: enrich-in-place module names, compose-contract anti-compression rules (rollback path), `LD-THIN-ASSEMBLY-COHERENCE` word caps on DP wrapper fallback, and historical documentation citing page-composition compression. The **abandoned single-shot full-page additive compose path** is not the active path for audited workflows, but **wording and non-blocking validators** from the output-limit era remain on GAM.

---

## 2. Exact current model-output limits by stage

PRISM workflow **run mode** does not call OpenAI (or other providers) for instructional generation steps. Steps copy prompts to Copilot; the operator pastes model output back. **No in-repo `max_output_tokens` applies to run-mode DLA/GAM/GAI/LS/DP.**

### 2.1 Run-mode instructional stages (DLA, GAM, GAI, LS, DP)

| Stage | PRISM `max_output_tokens` | Timeout / truncation handling | Effective limit |
| ----- | --------------------------- | ----------------------------- | --------------- |
| **EP** | N/A — deterministic derive (`executionMode: deterministic_derive`) | N/A | No LLM call |
| **DLA** | None | Capture validators only; no token retry | **External (Copilot)** — Unknown |
| **GAM** | None | `applyGamPackTextValidationToCapture`: v2 uses structural validation only; legacy pack-text path uses `validateGamPackTextCaptureGate` (thin bodies = warning) | **External (Copilot)** — Unknown |
| **DA** | None | `validateDesignAssessmentPartialPageCapture` (structure only) | **External (Copilot)** — Unknown |
| **GAI** | None | `validateGenerateAssessmentItemsPartialPageCapture` (envelope only) | **External (Copilot)** — Unknown |
| **LS** | None | `validateLearningSequencePartialPageCapture` (structure only) | **External (Copilot)** — Unknown |
| **DP** | None | `validateDesignPagePartialPageCapture` (`knowledge_summary` required) | **External (Copilot)** — Unknown |

**Confidence:** Confirmed (no run-mode token settings in code trace).

### 2.2 PRISM-managed OpenAI token budgets (not run-mode instructional steps)

`getTokenBudgets()` (`app.js` ~5341–5367) — preset `standard` / `short` / `detailed`:

| Budget key | Standard | Short | Detailed | Used by |
| ---------- | -------- | ----- | -------- | ------- |
| `workflowDesign` | 2600 | 1800 | 3600 | Workflow design API (`requestWorkflowDesign`) |
| `workflowReview` | 512 | 320 | 768 | Workflow review |
| `refinementQa` | 256 | 160 | 384 | Refinement QA |
| `refinementFinal` | 1600 | 900 | 2400 | Refinement final |
| `refinementReview` | 384 | 256 | 640 | Refinement review |

Workflow design retry on `max_output_tokens` incomplete (`app.js` ~24393–24421): retries in **compact mode** at same budget, then compact mode with **increased budget** (up to `maxWorkflowDesignRetryTokens`). Throws if still incomplete. **Does not apply to GAM/DLA run captures.**

Other API calls with fixed caps (examples): brief extraction `max_output_tokens: 500` (~17738); refinement paths up to ~900–2400 depending on preset.

**Confidence:** Confirmed.

### 2.3 Stop sequences

No stop-sequence configuration found for run-mode instructional generation. Workflow design API uses model + input + `max_output_tokens` + temperature only.

**Confidence:** Confirmed (for inspected paths).

---

## 3. Prompt-level compression findings

Classification key:

- **Structural concision** — output shape, JSON discipline, no prose wrappers.
- **Explicit content-thinning** — instructions that directly encourage shorter instructional prose.
- **Legacy output-limit mitigation** — wording introduced to fit single-response / token limits; often paired with anti-compression elsewhere.

### 3.1 GAM (Generate Activity Materials)

**File:** `domains/learning-design/domain-learning-design-step-patterns.md` (GAM Prompt Factory, ~2712–2716)

| Wording | Classification | Excerpt |
| ------- | -------------- | ------- |
| “Preserve full pedagogical depth… do not compress/thin for brevity” | Anti-thinning | `defaultPromptNotes` |
| “Never refuse due to response-size, token, or context-window claims” | Legacy limit mitigation | `promptTemplate` |
| “If content is long, **keep wording concise** while still realising every required material body **in this single response**” | **Legacy limit mitigation + explicit thinning signal** | `promptTemplate` |
| “do not ask to split output across multiple responses” | Legacy limit mitigation | `promptTemplate` |
| GAM-PRES-07/08/09 depth floors (text ≥120w, scenario ≥40w each, transfer ≥80w, worked ≥120w) | **Anti-thinning (depth floors)** | `promptTemplate` |
| GAM-WB-10 / AP-04: scenario ≥2 named cases ≥40 words each | Anti-thinning | `promptTemplate` |

**Runtime augmentation** (`app.js`):

| Block | Classification | Excerpt |
| ----- | -------------- | ------- |
| `buildSelfDirectedGamReadingSufficiencyPromptBlock` | Anti-thinning | “roughly **150–300+ words**” for shared readings |
| `buildSelfDirectedGamLearnerVoicePromptBlock` | Anti-thinning | “**Prefer instructional completeness over brevity**”; “do not shorten, compress, or omit reasoning” |
| `LD-MATERIALS-COPY` (author role) | Anti-thinning | “Do not truncate… for any reason including **output limits**” (`lib/ld-materials-copy.js` ~142–143) |
| `LD-GAM-PAGE-ENRICH-CONTRACT` | Structural | Partial JSON shape only; **no word floors** (`lib/ld-gam-page-enrich-contract.js`) |

**Confidence:** Confirmed (file excerpts).

### 3.2 DLA (Design Learning Activities)

**File:** `domain-learning-design-step-patterns.md` (~2548–2550)

| Wording | Classification |
| ------- | -------------- |
| “Do not produce discussion-only… delivery-impossible activities” | Structural |
| DLA-WB-18: scenario row “≥2 cases with specific names, numbers, or context” | Anti-thinning (spec-level, not body) |
| “expected_output = SSOT **30–70w** quality-threshold prose” | Structural floor (task description, not GAM body) |
| “materials[].body forbidden at DLA stage” | Architectural split (GAM authors bodies) |

**Runtime:** `lib/ld-guided-learning-scaffold.js` — **AUTHORITATIVE WORD RANGES** with blocking PRE-EMIT gate (preamble 50–120w, expected_output 30–70w, cognition fields 35–80w, etc.).

**Confidence:** Confirmed.

### 3.3 GAI (Generate Assessment Items)

**File:** `domain-learning-design-step-patterns.md` (~3017–3019)

| Wording | Classification |
| ------- | -------------- |
| “For true_false items… **concise** explanation_or_rationale” | Explicit content-thinning (item-level) |
| “If feedback_timing = immediate_self_check, **concise** explanation_or_rationale may support immediate learner feedback” | Explicit content-thinning |
| `defaultPromptNotes`: “explanation_or_rationale should… in **one concise sentence** — not a full worked solution” | **Explicit content-thinning** |
| “ALWAYS populate answer-bearing fields… explanation_or_rationale” | Anti-absence (requires field) |

**User option `feedback_mode`:** “Include **concise** learner-facing feedback for each item” (`per_item` default).

**Confidence:** Confirmed.

### 3.4 DP (Design Page)

**File:** `domain-learning-design-step-patterns.md` (~3287–3349); `lib/ld-design-page-partial-contract.js`; `lib/ld-thin-assembly-coherence.js`

| Wording | Classification |
| ------- | -------------- |
| Partial identity: “NOT FULL-PAGE COMPOSE”; do not regenerate GAM bodies | Structural (Sprint 58) |
| `knowledge_summary` mandatory — “substantive concept synthesis” | Anti-thinning (one wrapper field) |
| `LD-THIN-ASSEMBLY-COHERENCE`: overview/learning_purpose bridge fallback “**≤ 80 words**”; transition glue “**≤ 60 words**” | **Explicit cap** (wrapper-gap fallback only) |
| “Do not synthesize study_tips from scratch” | Structural |

**Confidence:** Confirmed.

### 3.5 LS (Construct Learning Sequence)

**File:** `domain-learning-design-step-patterns.md` (~3184)

| Wording | Classification |
| ------- | -------------- |
| “Build a concrete session plan, not pedagogical commentary” | Structural |
| “If time is too short, reduce, merge, or simplify activities rather than **compressing them unrealistically**” | Anti-unrealistic-compression (timing, not material bodies) |
| single_activity: “minimal one-step structure” | Structural scope |

No material-body word limits. LS does not author GAM content.

**Confidence:** Confirmed.

### 3.6 DA (Design Assessment)

**File:** `domain-learning-design-step-patterns.md` (~2754+)

| Wording | Classification |
| ------- | -------------- |
| “Treat feedback_display as prompt-shaping guidance only” | Structural |
| No material-body generation in this step | N/A |

**Confidence:** Confirmed.

### 3.7 EP (Episode Plan)

Deterministic derive — no LLM prompt compression.

**Confidence:** Confirmed.

### 3.8 Shared / workflow-design-only compression

`compressWorkflowConstraints()` (`app.js` ~29157): compresses brief constraint text for **workflow design** prompts into critical/secondary/compact form. **Not injected into GAM/DLA run prompts.**

**Confidence:** Confirmed.

---

## 4. Schema and validator findings

### 4.1 Structural vs richness vs incidental

| Stage | Structural requirements | Richness-related | Incidental / non-blocking |
| ----- | ---------------------- | ---------------- | ------------------------- |
| **GAM v2** | `activities[].materials[]` with `material_id`, `title`, `body`, `body_format: markdown`; count match `required_materials`; DLA field preservation | Pack prompts: GAM-PRES word floors | **No `maxLength` on `body`**. `validateGamEnrichedPage` / `validateGamPartialPageCapture` require **non-empty `body` only** (`lib/page-gam-enrich.js` ~698–700, ~784–786) |
| **GAM legacy pack-text** | Material:/Content: structure; coverage count | `gam-output-format.js`: MIN_TEACHING_BODY=120, MIN_CHECKLIST_BODY=80 **char heuristics** | `GAM-FMT-04: thin Content bodies` → **warning only**, not blocking (~413–419) |
| **DLA v2** | Activity IDs, `required_materials`, scaffold fields present | `applyGuidedLearningScaffoldRepairToDlaCapture` — **blocking word minimums** | `materials[].body` **forbidden** at DLA (`lib/ld-dla-page-enrich-contract.js` ~43) |
| **GAI v2** | Page envelope + `assessment_check` or section mirror | Contract lists `explanation_or_rationale` per item (`lib/ld-gai-page-enrich-contract.js` ~38) | **`validateGenerateAssessmentItemsPartialPageCapture` does not validate per-item fields** (`app.js` ~9514–9543) |
| **DP v2** | `page_synthesis.knowledge_summary` required | Prompt asks for substantive synthesis | overview/purpose/study_tips **not validated**; thin fallback capped at 80/60w via thin-assembly contract |
| **LS v2** | `learning_sequence` object required | None on instructional depth | Timeline content not word-gated |

### 4.2 Examples in schemas / contracts

- GAM partial canonical example shows a short illustrative `body` string — **incidental**, not a max cap (`lib/ld-gam-page-enrich-contract.js` ~72).
- GAI partial example includes `explanation_or_rationale` — structural documentation.

### 4.3 Validators that trim or reject longer content

No validator **truncates** GAM `body` text on successful capture. `sanitizeSelfDirectedGamMaterialsOutput` may strip facilitator blocks and **duplicate paragraphs** (legacy pack-text / self-directed path); v2 JSON partial impact is **Unknown** (sanitize runs on raw capture string before validation).

**Confidence:** Confirmed for validation logic; Unknown for sanitize effect on v2 JSON bodies.

---

## 5. Retry and failure handling findings

| Mechanism | Stage | Active? | Compression behaviour |
| --------- | ----- | ------- | ---------------------- |
| Workflow design `requestWithRetryPlan` | Workflow design API only | Yes | On `max_output_tokens` incomplete: retry **compact mode**, then higher token budget; error if still incomplete |
| `buildGamOutputContractRetryHint` | GAM pack-text | **No** — defined in `lib/gam-output-format.js` ~540; **not referenced in `app.js`** | Would ask for full pack text on rejection |
| `GAM-FMT-04` thin warning | GAM legacy pack-text | Yes when `pageEnrichmentV2` off | Warning only — capture can complete |
| `applyGamPackTextValidationToCapture` v2 branch | GAM | Yes for audited workflows | Blocks on structure/coverage, **not depth** |
| Partial acceptance | All v2 partials | Yes | Any non-empty required fields pass |
| Field omission | GAI | Plausible | Envelope validator does not require per-item `explanation_or_rationale` |
| `applyGuidedLearningScaffoldRepairToDlaCapture` | DLA | Yes (self-directed) | **Blocks** capture completion on scaffold word floors (~14340–14352) |

**No active retry path** was found that re-prompts GAM with “shorter output” on run-mode capture.

**Confidence:** Confirmed (code paths traced).

---

## 6. Additive-architecture residue findings

| Residue | Introduced (evidence) | Why | Still active? | Applies to partial GAM path? |
| ------- | --------------------- | --- | ------------- | ---------------------------- |
| Full-page compose / additive page-root metadata | Sprint 38B, 38L | Single LLM composed entire page | Rollback only when `partialPageOutputs: false` | **No** for audited workflows |
| `LD-DESIGN-PAGE-COMPOSE-CONTRACT` anti-compression | Sprint 38M, 53, 55 | Page composition was compressing GAM bodies | Legacy/rollback compose | **No** on partial DP path |
| `page-gam-enrich.js` “enrich-in-place” | Sprint 56F | Progressive enrichment before partial split | Yes — **normalise/validate** v2 GAM captures | **Yes** |
| Sprint 56F handover question on output limits | `docs/.../sprint-56f.../handover-context.md` | Full-page GAM at depth within limits | Historical context | Motivated Sprint 58 partials |
| Sprint 58 partial contracts | `lib/ld-*-page-enrich-contract.js` | Split stage outputs to reduce single-response pressure | **Yes** — canonical for `pageEnrichmentV2` + `partialPageOutputs` | **Yes** |
| GAM “keep wording concise… single response” | Pack template (38L era + limit mitigation) | Fit all materials in one model response | **Yes** — still in pack template | **Yes** |
| `LD-THIN-ASSEMBLY-COHERENCE` 80/60 word caps | Sprint 56C | Wrapper-gap fallback only | Yes — appended to DP partial prompts | DP only, not GAM |
| `compressWorkflowConstraints` | Workflow design | Shorter design prompts | Workflow design only | **No** |
| 38S obligation population | DLA pack | DLA specifies; GAM realises | Yes | Specs without body depth enforcement at GAM capture |

**Confidence:** Strongly supported (documentation + code flags); partial path activation Confirmed for first-audit workflows (`pageEnrichmentV2` + `partialPageOutputs` in findings).

---

## 7. Stage comparison table

| Stage | Prompt compression | Output cap | Schema pressure | Retry compression | Likely richness impact |
| ----- | ------------------ | ---------- | --------------- | ----------------- | ---------------------- |
| **EP** | None (deterministic) | None | Shell JSON shape | None | Neutral — no generative prose |
| **DLA** | Low — scaffold floors **require** length | External only | **Blocking** word mins on scaffolds; **no** material bodies | None active | **Comparatively rich** tasks/scaffolds; creates **demand** GAM may not meet |
| **GAM** | **High tension** — “concise” + depth floors + single-response | External only | **Presence-only** `body` on v2 | None active; legacy thin = warn | **Primary thinness locus** — bodies pass while under pack floors |
| **DA** | Low | External only | Blueprint structure | None | Indirect — not run in first audit |
| **GAI** | **Moderate** — “concise” rationale | External only | Envelope only; contract documents `explanation_or_rationale` | None | Rationales present but **brief by design**; not absent in captures |
| **LS** | Low (timing realism) | External only | Sequence object only | None | Metadata richness OK; doesn’t fix GAM bodies |
| **DP** | **Moderate** on wrapper fallback (80/60w caps) | External only | **`knowledge_summary` only** required | None | Wrapper often thin/incomplete; **cannot** re-expand GAM |

---

## 8. Evidence-backed explanation for GAM thinness

| Mechanism | Confidence | Evidence |
| --------- | ---------- | -------- |
| v2 validator accepts any non-empty `body` regardless of word count | **Confirmed** | `validateGamEnrichedPage` / `validateGamPartialPageCapture` (`lib/page-gam-enrich.js`) |
| Pack prompt “keep wording concise… single response” conflicts with GAM-PRES ≥120w floors | **Confirmed** | `domain-learning-design-step-patterns.md` GAM `promptTemplate` |
| Legacy GAM-FMT thin detection is non-blocking | **Confirmed** | `validateGamPackTextCaptureGate` warnings (`lib/gam-output-format.js` ~413–419); v2 path skips this gate (`app.js` ~14375–14407) |
| External Copilot output limit causes model to prioritise concision | **Plausible** | No PRISM cap on run steps; prompt explicitly addresses token/size refusal and single-response constraint |
| Post-capture sanitization shortens GAM bodies | **Unknown** | `sanitizeWorkflowRunCapturedOutputForStep` runs before validation; v2 JSON body-level effect not traced |
| DLA forbids bodies — GAM must invent all exposition in one step | **Confirmed** | `ld-dla-page-enrich-contract.js` ~43; architectural split |
| Deterministic PRISM fallback bodies in `page-gam-enrich.js` | **Not supported** for audited captures | `bodyForTextMaterial` etc. used in normalise/enrich helpers for tests/shell — audited captures contain model-authored bodies |

**Synthesis:** GAM thinness is **not explained by PRISM token caps** on the run path. It **is explained by** (1) prompt-level concision signal vs weak enforcement, (2) presence-only v2 validation, and (3) plausible external model length behaviour. This matches first-audit observation: ~100% of GAM bodies &lt;80 words despite pack floors of 120+ for exposition.

---

## 9. Evidence-backed explanation for scenario thinness

| Mechanism | Confidence | Evidence |
| --------- | ---------- | -------- |
| DLA requires scenario **row** with spec “≥2 cases with names, numbers, or context” — not a body | **Confirmed** | DLA-WB-18 in pack (~2548) |
| GAM requires scenario Material ≥40 words **per case** (≥2 cases) | **Confirmed** | GAM-PRES-06/07, GAM-WB-10 in pack (~2716) |
| No validator enforces scenario word count on captured `materials[].body` | **Confirmed** | GAM v2 validators |
| DLA can satisfy contract with **label-only specifications**; GAM may echo spec | **Strongly supported** | First audit: scenarios 18–39 words with names only; spec-level DLA gate ≠ body depth gate |
| LS forbids inventing new scenarios | **Confirmed** | LS prompt material rules — cannot compensate for thin GAM |

**Synthesis:** Scenarios are thin because **depth rules exist in prompts but not in capture validators**, and DLA obligation rows can be met with **minimal specification text** that GAM realises as short named stubs rather than ≥40-word cases.

---

## 10. Evidence-backed explanation for missing assessment feedback

| Claim | Confidence | Evidence |
| ----- | ---------- | -------- |
| First audit “zero feedback” = generation failure | **Not supported** | FA-01/02 JSON: all items have `explanation_or_rationale` (e.g. `WasMarxRight_ba3f2a76.json` lines ~921–1003) |
| Audit rubric field mismatch | **Confirmed** | `S59-FA-01-WasMarxRight.md` checked `feedback` / `rationale`, not `explanation_or_rationale` |
| GAI prompt requests **concise** one-sentence rationales | **Confirmed** | GAI `defaultPromptNotes` + `promptTemplate` |
| `feedback_display: answer_grid_end` hides inline feedback in render | **Strongly supported** | Workflow constraints on FA-01; renderer resolves `feedback_display` (historical `app.js` patterns) |
| No `feedback_pack` step in audited workflows | **Confirmed** | Three-workflow inventory — GAI only |
| Validator does not enforce rationale presence | **Confirmed** | `validateGenerateAssessmentItemsPartialPageCapture` |

**Synthesis:** Assessment **generation** produced brief `explanation_or_rationale` fields. **Apparent absence** in learner-facing output is likely **renderer/display configuration** (`answer_grid_end`) plus **audit field naming**, not missing generation. Instructional **richness** of feedback is limited by **explicit “concise sentence” prompt shaping** — Class A quality issue if rationales are too thin for formative use, not Class A “absent field.”

---

## 11. Unknowns requiring live-run observation

1. **Copilot effective max output tokens** and whether GAM partial JSON hits truncation mid-response on 5-activity / 25-material workflows.
2. Whether **`GAM-FMT-04` warnings** appeared in run UI during capture (`state.workflowRunGamFormatWarnings`) for any audited run.
3. Whether **`sanitizeSelfDirectedGamMaterialsOutput`** altered v2 JSON `materials[].body` content (dropped paragraphs) on paste/sync.
4. **Model behaviour** when both “keep wording concise” and “text exposition ≥120 words” appear — which instruction dominates in practice.
5. Whether operators **ignored** non-blocking warnings or **marked steps complete** despite scaffold/GAM quality slots.
6. **DP FA-02** mispartial (`learning_sequence` vs `page_synthesis`) — operator error vs prompt confusion; not derivable from constraints alone.

---

## 12. Hypotheses to test during next manually operated workflows

1. **GAM concision override:** Re-run GAM only with existing DLA capture; compare body word counts to first audit. If still &lt;80w, concision/limit behaviour dominates pack depth floors.
2. **Validator blind spot:** Deliberately capture one material with 15-word body — confirm v2 capture **accepts** completion (validates presence-only hypothesis).
3. **Warning visibility:** On legacy-flag workflow (`partialPageOutputs: false`), capture thin pack-text GAM — confirm `GAM-FMT-04` is warning-only and step can complete.
4. **Assessment rationale richness:** Inspect `explanation_or_rationale` word count per item vs GAI “one concise sentence” instruction; compare rendered page with `feedback_display: answer_grid_end` vs `inline`.
5. **Scenario spec echo:** Compare DLA `required_materials[].specification` length/word count for scenario rows to matching GAM `body` — test spec→body echo vs independent expansion.
6. **Sanitize trace:** Paste rich GAM v2 JSON with duplicate preamble text; sync capture and diff raw vs sanitized output.
7. **External limit signature:** Look for model-added “due to length limit” disclaimers (forbidden by prompt) or truncated JSON / incomplete `materials[]` arrays.

---

## Appendix A — Key file index

| Area | Path |
| ---- | ---- |
| Pack prompts (all stages) | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Token budgets (design/refinement only) | `app.js` — `getTokenBudgets`, `requestWithRetryPlan` |
| DLA scaffold enforcement | `lib/ld-guided-learning-scaffold.js`, `applyGuidedLearningScaffoldRepairToDlaCapture` in `app.js` |
| GAM v2 validation | `lib/page-gam-enrich.js` |
| GAM legacy format gate | `lib/gam-output-format.js` |
| Partial contracts | `lib/ld-gam-page-enrich-contract.js`, `lib/ld-dla-page-enrich-contract.js`, `lib/ld-gai-page-enrich-contract.js`, `lib/ld-design-page-partial-contract.js` |
| DP thin wrapper caps | `lib/ld-thin-assembly-coherence.js` |
| Anti-compression (compose/legacy) | `lib/ld-materials-copy.js`, `lib/ld-design-page-compose-contract.js` |
| First-audit captures | `artefacts/first-audit/*.json` |

---

## Appendix B — Correction note for first audit

The first audit row **“Assessment feedback: zero items include feedback/rationale”** should be reinterpreted:

- **Generation:** Items include `explanation_or_rationale` (populate confirmed in FA-01, FA-02 artefacts).
- **Quality:** Rationales may still be **instructionally thin** (concise-by-prompt).
- **Display:** `feedback_display: answer_grid_end` may suppress inline learner-visible feedback regardless of capture content.

Recommend a **field-name correction** in future richness passes, not a generation-constraint fix, until live-run evidence shows empty `explanation_or_rationale` on new captures.
