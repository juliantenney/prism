# S78-T-013 Candidate 2 — GAM malformed JSON / cross-material corruption diagnostic

**Task:** S78-T-013 (bounded diagnostic exhibit)  
**Status:** **DIAGNOSTIC COMPLETE** (2026-08-17)  
**Mode:** DIAGNOSTIC ONLY — no implementation  
**Sprint 78:** OPEN · **Sprint 77:** remains CLOSED  
**Production / tests / prompts / schema / validators / assembly / renderer:** **UNCHANGED**

Do not sanitise. Do not hand-edit this GAM. Do not regenerate in this task. Do not start T-003. Do not treat this artefact as WS2/operational-suitability evidence.

**Preserved artefact:** [S78-T-013-candidate-2-malformed-gam.txt](S78-T-013-candidate-2-malformed-gam.txt)  
**EP / DLA:** **not attached in this paste** — cannot independently verify from repo.

---

## 1. Exact validation failure

Operator-reported Prism rejection:

```text
GAM v2 capture must be valid JSON page artefact
```

This is the live fail-closed message from `validateStrictJsonWorkflowRunStepCapture` when `tryParseWorkflowArtefactJson` returns `null` for a Generate Activity Materials v2 step (`app.js` ~13645–13651).

Reproduced on the preserved paste with `JSON.parse`:

```text
Expected double-quoted property name in JSON at position 5967 (line 79 column 1)
```

Surrounding raw text (exact):

```text
"...- Constraint:\n-",
L=x^2y+\\lambda(12-x-y)\n\\]
```

Prism never reaches `validateGamPartialPageCapture` / GAM semantic validators. Capture **fail-closed correctly**.

---

## 2. DLA validity assessment

**Not independently verified in this diagnostic.**

This paste contained the malformed GAM only. Fresh EP and DLA JSON were not supplied in the same message, so WS1 `response_fulfilment`, WS2 `practice_independence`, P02 evidence closure, and DLA specification integrity **cannot be confirmed from repository artefacts**.

**Inference (not proof):** operator reached GAM paste, which on the live Copy path requires a prior DLA capture. That does **not** substitute for preserving the Candidate 2 DLA.

**Corruption onset:** A1 and A2 GAM materials in this paste are structurally intact JSON. First proven corruption is **inside the GAM response** at A3-M1. There is **no evidence** that DLA material specifications contained these spliced fragments.

---

## 3. First malformed GAM location

| Field | Value |
| ----- | ----- |
| Activity / material | **A3-M1** `worked_example` |
| Expected field | `"body"` (JSON string) |
| First **syntax** break | After premature close of the `body` string at `"Constraint:\n-"`; next line is unquoted `L=x^2y+...` (not a property name) |
| First **content** splice (still inside the quoted prefix) | `\\[\n[\n3m+n=90\n\\3 Multiplier term:` |

A1 and A2 parse as well-formed JSON objects through A2-M3.

---

## 4. Full corruption pattern

**Reproducible pattern:** **previous-material tail spliced into the next material**, concentrated at **TeX `\[` / `[` boundaries**, with **truncation**, **premature JSON string close**, and **object-boundary loss**. Fragments match **earlier materials in the same GAM response**, not prompt-contract prose.

### Region 1 — A3-M1 (syntax-breaking + learner-facing)

| Item | Exact observation |
| ---- | ----------------- |
| Expected | `"body"` string for FOC worked example |
| Inserted (quoted prefix) | `3m+n=90` then A2-M3 template bullets (`Multiplier term:`, `Final Lagrangian:`, `### Problem 2`, `### Problem 3`) |
| Likely source | **A2-M2 Problem 3 constraint** `3m+n=90` **+ A2-M3 template tail** |
| Inside string vs syntax | **Both.** Prefix is inside the JSON string; then the string **closes early**; remainder of intended body is **unquoted** (breaks JSON) |
| Truncation / splice | `\\frac{\\partialect to \\(\\lambda\\)` = truncated `\\partial` spliced onto `with respect to λ` |

Intended A3-M1 continuation (`L=x^2y+\\lambda(12-x-y)` … FOC system) is present **after** the premature close.

### Region 2 — A4-M1 / A4-M2 (independent syntax break)

| Item | Exact observation |
| ---- | ----------------- |
| Expected | `"body": "..."` on A4-M1; separate A4-M2 object |
| Unexpected | After `"body_format": "markdown",` a **non-key** fragment starting `"[\nL=ab+\\lambda(50-a-3b / \\partial x\\):` … concatenated onto `:body"` |
| Likely source | **A3-M2 Problem 2** `L=ab+\\lambda(50-a-3b)` **+ A3-M3 FOC template** (`\\partial L / \\partial x` etc.) |
| A4-M1 body | Starts `Solve the following optimisation problem.` then truncates at `\\[\nL=xy` (unclosed string) |
| A4-M2 | **No** `"material_id": "A4-M2"` object header. Template keys (`material_type: template`, title `Solution Workspace`) appear as **extra keys on A4-M1** |

### Region 3 — A4-M3 / A5 (structurally intact, unreachable)

A4-M3 guided-review JSON body and A5-M1–M3 markdown bodies are **locally well-formed** in the paste. They are **not reachable** by `JSON.parse` because Regions 1–2 already break the artefact.

### Intact prefix

A1-M1, A1-M2, A1-M3, A2-M1, A2-M2, A2-M3: no cross-material splice observed.

### Pattern name

**Intra-response previous-material tail splice at TeX/`[` boundary**, plus **quote/object-boundary loss**. Not a single local typo cascading: **at least two independent splice sites** (A3-M1, A4-M1).

Does **not** match T-015 wording (`S78-OPERATIONAL-SUITABILITY`, `mutually consistent`, `do not pre-solve`).

---

## 5. Assembled GAM prompt

**Candidate 2 live assembled prompt was not reconstructed.** Fresh DLA JSON was not provided, so `buildAuthoritativeDlaMaterialCommissionSectionFromPage` cannot be run on this candidate.

Live injection mechanism (current `app.js`):

```text
JSON.stringify(T-023 commission)
  → close ```json fence
  → optional S78-WS-2 markdown
  → optional S78-OPERATIONAL-SUITABILITY markdown
```

That path emits **DLA commission JSON + markdown obligations**. It does **not** emit GAM material bodies. The spliced fragments here **are GAM bodies from earlier rows of this same response**.

**Verdict:** prompt-as-producer of this splice is **not supported**. Exact Candidate 2 prompt cleanliness is **unverified** (DLA absent). T-015 injection cannot structurally generate A2-M3/A3-M3 tails inside A3-M1/A4-M1.

---

## 6. T-015 structural implication

**NO.**

| Check | Result |
| ----- | ------ |
| T-015 concatenates into Copilot **output** JSON | **No** — prompt-side markdown only |
| T-015 escaping of GAM bodies | **N/A** — does not author bodies |
| Browser/vm fallback parser | Classifies whether to inject the prompt block; does not rewrite capture JSON |
| Fragments match T-015 block | **No** |

Recency of T-015 is **not** causal evidence.

---

## 7. Copy / paste / capture path

Live path (unchanged; T-026 §4):

```text
GAM Copy → Copilot response → operator copy → Prism paste
  → sanitizePrismRunCapturedOutput (STEP N OUTPUT footer + trailing fence only)
  → utilityNormalizeUtilitiesJsonInput (TeX delimiter escapes inside strings)
  → JSON.parse
  → on fail: "GAM v2 capture must be valid JSON page artefact"; do not pretty-print
```

| Transform | Could produce this splice? |
| --------- | -------------------------- |
| Fence / footer strip | **No** |
| TeX delimiter normalizer | **No** — does not insert A2-M3/A3-M3 prose into later keys |
| Clipboard persistence of prior textarea | **Unproven** for this paste; operator-visible artefact already contains the splice |
| Browser vs vm prompt libs | **Not on capture path** |

No byte-compare of Copilot verbatim vs textarea was supplied (T-026 §11 steps 2–6 incomplete). **Prism post-paste mutation of an otherwise valid JSON object is not supported** as the first break: the paste is already invalid JSON with intra-response body splice.

---

## 8. Historical recurrence evidence

Canonical record: [S77-T-026](../../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/S77-T-026-gam-e2-intermittent-corruption-diagnostic.md)

| Item | Status |
| ---- | ------ |
| E2 definition | Intermittent learner-facing **and/or JSON-integrity** corruption in GAM Copilot response |
| Historical tokens | `Pur[` + raw newline; `\rtial` |
| 2026-08-14 recurrence | [post-T-027](../../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/S77-T-026-e2-recurrence-2026-08-14-post-t027-gam.md): spliced prose/TeX (`carries[x+3yA maximise…`); fail-closed |
| E2 status at Sprint 77 close | **OPEN / INTERMITTENT** — wait-state; no sanitiser |
| Recurrence protocol | T-026 §11 |
| Sprint 77 | **Not reopened** |

Candidate 2 matches the **E2 family**, especially the **2026-08-14 splice-at-`[`** exhibit, more than the original `Pur[` / `\rtial` tokens.

---

## 9. Match to prior GAM corruption issue

**YES** — E2-family recurrence.

Token identity with Gate D `Pur[` / `\rtial`: **NO** (different surface tokens).  
Family identity (intermittent operator-visible GAM response corruption; JSON fail-closed; no deterministic repo mutation): **YES**.

---

## 10. Earliest proven causal layer

**Operator-visible GAM response text (invalid JSON)** — same earliest proven layer as T-026.

**Ruled out as first break:**

- Prism post-parse transform (parse never succeeds)
- T-015 prompt-block construction as producer of these fragments
- Deterministic repository mutation inserting prior-material tails

**Unresolved (same as T-026):** model emit vs Copilot UI / clipboard wrapping.

---

## 11. Classification

**Primary: D** — recurrence of known intermittent GAM E2 corruption mechanism.

**Secondary: A** — malformed JSON present in the operator-supplied Copilot/paste text despite no evidence the assembled prompt contained these body fragments.

**Not selected:**

| Code | Why |
| ---- | --- |
| B | Prompt not reconstructed; splice sources are **same-response GAM bodies**, not commission markdown |
| C | Capture path does not invent this splice; fail-closed only |
| E | T-015 not structurally implicated |
| F | Not required |
| G | Family match is sufficient; G remains only for **model vs Copilot UI** |

---

## 12. Regression / new defect / known recurrence

**Known recurrence** of **OPEN / INTERMITTENT E2**. Not a new named production defect. Not a T-015 regression. Not a WS2 semantic failure.

---

## 13. Repair justified?

**NO.** T-026: do not guess a sanitiser; do not weaken fail-closed capture; do not JSON-repair or TeX-correct.

---

## 14. Recurrence protocol (apply; do not implement a sanitiser)

From T-026 §11, still authoritative:

1. **Do not edit** Copilot message or paste to make JSON valid.  
2. Save Copilot message **verbatim**.  
3. Paste once; leave the failed capture.  
4. Dump `__PRISM_FINAL_GAM_PROMPT.prompt` and the GAM textarea / `workflowRunCapturedOutputsRaw`.  
5. Record fail-closed message (this run: `GAM v2 capture must be valid JSON page artefact`).  
6. Byte-compare Copilot file vs textarea.  
7. Keep both files; do not pretty-print.

**Operational action for T-013:** **Discard Candidate 2 GAM. Regenerate GAM only from the same valid DLA.** Do not regenerate EP/DLA unless DLA is independently invalid or missing. Do not use Candidate 2 for WS2/suitability closure.

---

## 15. T-013 status

| Layer | Result |
| ----- | ------ |
| DLA stage | **NOT VERIFIED** in this paste (DLA JSON not attached) |
| GAM structural validity | **FAIL** (invalid JSON; E2-family) |
| WS2 semantic | **Incomplete** — do **not** mark WS2 failed because the artefact is malformed |
| Operational suitability | **Incomplete** — not evaluable |
| Candidate 1 | **Unchanged** — WS2 PASS; suitability FAIL; QA 83/69/0C/2M |
| Workstream 2 | **NOT CLOSED** |
| T-003 | **Queued** — not started |

T-013 remains **OPEN**. Next verification candidate is a **new GAM** (and preserved DLA), not a patched Candidate 2.

---

## 16. Files changed

| File | Role |
| ---- | ---- |
| `S78-T-013-candidate-2-malformed-gam.txt` | Exact operator GAM paste (not repaired) |
| `S78-T-013-candidate-2-gam-malformed-json-diagnostic.md` | This record |
| `S78-T-013-workstream-2-integration-verification.md` | Candidates log / status |
| `STATUS.md` · `PLAN.md` · `SPRINT-78-START-HERE.md` | Sprint snapshot |

---

## 17. Production / test / prompt / schema / validator / assembly / renderer

**ALL NO.**

---

## 18. Exact recommended next action

1. Preserve Candidate 2 **EP + DLA** into the sprint pack if still held (gap in this paste).  
2. **Discard** Candidate 2 GAM. **Do not hand-edit.**  
3. **Regenerate GAM only** from the same DLA (T-026 operational action).  
4. If E2 recurs, complete T-026 §11 byte-compare before any repair discussion.  
5. Resume T-013 semantic checks **only** on a structurally valid GAM.  
6. Do **not** start T-003. Do **not** reopen Sprint 77. Do **not** authorise an E2 sanitiser from this exhibit.

**STOP.**
