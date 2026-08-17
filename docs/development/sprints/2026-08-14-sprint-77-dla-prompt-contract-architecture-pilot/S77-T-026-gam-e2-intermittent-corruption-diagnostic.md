# S77-T-026 — GAM E2 intermittent learner-facing / JSON corruption diagnostic

**Status:** **DIAGNOSTIC COMPLETE** (2026-08-14) — **E2 remains OPEN / INTERMITTENT**  
**Mode:** DIAGNOSTIC ONLY  
**Authorised by:** operator (this task)  
**Production / tests / schema / validators:** **UNCHANGED**

Do not guess a sanitiser. Do not implement JSON repair or TeX correction. Do not weaken fail-closed capture. Do not reopen E1, Case 1, GAM D, T-031, or DLA architecture.

---

## 1. Exact E2 definition

**E2** is intermittent **learner-facing and/or JSON-integrity corruption** in a GAM Copilot response, historically seen as:

1. an **unescaped newline inside a JSON string** (parse-breaking), observed after `Pur[`;
2. malformed TeX **`\rtial`** where **`\partial`** was intended.

It is **not** E1 (commission binding), **not** Case 1 (operand executability), **not** GAM D (pedagogical-function fulfilment), and **not** DLA architecture.

Absence on a later run **does not close** E2.

---

## 2. Historical exhibit

**Source:** Lagrangian A5 on the DLA architecture Gate D chain ([T-017](S77-T-017-dla-canonical-architecture-lagrangian-gate-d.md) §8; [T-018](S77-T-018-dla-architecture-pilot-gated-and-gam-e-handover.md)).

Visible in the GAM response:

- `Simulated Evidence for Learning Pur[ poses` (`Pur[` then a **raw newline** inside the JSON string — T-019)
- TeX `\rtial` instead of `\partial`

**Capture:** GAM v2 capture **failed** because the paste was **not valid JSON** (operator-authoritative). Fail-closed behaved correctly for that occurrence.

Raw Copilot bytes / `workflowRunCapturedOutputsRaw` dump from that run: **not in git**.

---

## 3. Non-reproduction evidence

| Run | E2 tokens |
| --- | --------- |
| Gate D historical A5 | **PRESENT** (`Pur[`, raw newline, `\rtial`) |
| T-019 instrumented GAM (same programme, later chain) | **ABSENT** — valid JSON; `\partial` present as JSON-escaped `\\partial` |
| T-021 blocked Gate C / T-024 bound Gate C | **Not reported** as E2 |

T-019: those corruptions were **not** in `window.__PRISM_FINAL_GAM_PROMPT.prompt` (outbound model-visible **prompt**, not the response).

---

## 4. Pipeline / layer trace (live Copy → paste path)

GAM production is **Copy prompt → Copilot → paste capture**, not an in-app model HTTP call.

```text
[1] buildWorkflowStepInstructions + publishFinalGamPromptSnapshot
      window.__PRISM_FINAL_GAM_PROMPT.prompt     ← OUTBOUND ONLY
[2] Operator copies into Copilot
[3] Model generates response  (Prism does not receive this stream)
[4] Copilot UI / clipboard
[5] Paste into workflow run textarea
[6] syncWorkflowRunCapturedOutputToState
      parsePageArtefactCaptureForStorage → JSON.parse
        on fail: workflowRunPageValidation; do not pretty-print; keep textarea
      sanitizePrismRunCapturedOutput (strip STEP N OUTPUT / trailing fence only)
      store workflowRunCapturedOutputsRaw[sid] = textarea
      store workflowRunCapturedOutputs[sid] = sanitized footer-stripped text
[7] Downstream merge/render only if parse succeeded
```

`utilityNormalizeUtilitiesJsonInput` runs **inside** parse helpers (math-delimiter / invalid TeX-spacing / markdown `\[` tolerance) **before** `JSON.parse`. It does **not** rewrite `Purposes` → `Pur[`, and it does **not** turn `\partial` into `\rtial` (see §7). If a raw newline is already inside a JSON string, `JSON.parse` still fails → fail-closed.

Partial GAM finalize path uses `sanitizePrismRunCapturedOutput` only (footer/fence strip). It does **not** run `sanitizeSelfDirectedGamMaterialsOutput` on that branch.

There is **no** `__PRISM_RAW_GAM_RESPONSE` equivalent of the prompt snapshot.

---

## 5. Earliest proven corruption layer

**Proven:** corruption was present in the **operator-visible GAM response text** (Copilot / paste) **and** that text was **invalid JSON**, so Prism capture **rejected** it.

**Not proven:** whether the model emitted that text, or Copilot/clipboard wrapping inserted the newline / `[` / dropped `p`.

**Ruled out as the first break:**

- Outbound GAM **prompt** (T-019).
- Prism **post-parse** transform / renderer (parse never succeeded on the historical paste).
- Capture **inventing** `Pur[` after a successful parse (no successful parse).

**Classification:** **5 — evidence insufficient to distinguish (1) model emit vs (3) Copilot/UI/clipboard transport.**  
**(2) Prism extraction of an HTTP body** does not apply on this Copy path (no model response object).  
**(4) parser transforming otherwise valid content into `Pur[` / `\rtial`:** **not supported** by code inspection (§7). Parser **correctly fail-closes** on unescaped newline.

---

## 6. Hypotheses

| Hypothesis | Status |
| ---------- | ------ |
| Model emitted malformed JSON / TeX | **UNRESOLVED** (compatible with exhibit; no raw model dump) |
| Copilot UI wrap / clipboard inserted newline and/or `[` | **UNRESOLVED** (compatible; `Pur[` + newline splits `Purposes`) |
| Prism outbound prompt contained E2 | **RULED OUT** (T-019) |
| Prism HTTP extract / Workflow-Factory repair path | **RULED OUT** for GAM Copy (not on that path) |
| Deterministic Prism mutation `Purposes`→`Pur[` or `\partial`→`\rtial` | **NOT FOUND** in repository |
| `utilityNormalizeUtilitiesJsonInput` caused E2 | **NOT SUPPORTED** as producer of those tokens; it may only help/hurt **parse** of other TeX escapes |
| Capture/parser weakened or auto-repaired the exhibit into storage | **RULED OUT** — capture failed |
| E2 closed because later runs were clean | **RULED OUT** — intermittent |

---

## 7. Repository mutation search

Inspected: `sanitizePrismRunCapturedOutput`, GAM partial finalize, `parsePageArtefactCaptureForStorage`, `tryParseWorkflowArtefactJson`, `utilityNormalizeUtilitiesJsonInput`, `sanitizeSelfDirectedGamMaterialsOutput` (not on GAM partial finalize), `lib/page-gam-enrich.js`, `lib/ld-math-render.js`.

| Token | Deterministic producer in repo? |
| ----- | -------------------------------- |
| `Pur[` | **NO** |
| unescaped newline inserted into JSON strings | **NO** (normalizer *replaces* `\`+whitespace with a space; does not insert `Pur[`) |
| `\rtial` from `\partial` | **NO** (`\p` is not a math-delimiter pair; `p` is not stripped) |

Math-delimiter pass only special-cases `\(` `\)` `\[` `\]`. Second pass unescapes markdown `\[` `\]` `\_` under even backslash runs. Neither yields `\rtial`.

---

## 8. Current raw-response observability

| Surface | What it stores |
| -------- | -------------- |
| `__PRISM_FINAL_GAM_PROMPT` | Final **prompt** + archetype_delivery — **not** the model response |
| `workflowRunCapturedOutputsRaw[stepId]` | Textarea at sync (paste). Survives failed parse. **Only if the operator pasted.** Not auto-exported. |
| `workflowRunCapturedOutputs[stepId]` | Footer-stripped copy of that text |
| Copilot thread | Authoritative for Copy-path generation; **not** instrumented by Prism |

**Verdict:** existing instrumentation **cannot** preserve a Copilot raw response *before* human paste. It **can** preserve the paste if the operator leaves the failed capture in the box and dumps `workflowRunCapturedOutputsRaw`.

---

## 9. Capture fail-closed

**YES.** `parsePageArtefactCaptureForStorage` returns `ok: false` / `invalid_json` on `JSON.parse` throw; `syncWorkflowRunCapturedOutputToState` sets `workflowRunPageValidation` and clears step completed; it does **not** replace the textarea with pretty-printed JSON.

**Do not weaken this.** An unescaped newline **must** remain a failed capture.

---

## 10. Repairable now?

**NO.** E2 is **not repairable from current evidence** without guessing a sanitiser or a Copilot/model cause.

**Requires recurrence evidence** plus the protocol in §11.

Optional later (not this task): authorised **observability only** — snapshot first paste to e.g. `window.__PRISM_GAM_CAPTURE_RAW` before parse. That is instrumentation, not a sanitiser. **Not implemented here.**

---

## 11. Minimal capture protocol (next occurrence)

Do **not** regenerate hoping to hit E2. When it appears:

1. **Do not edit** the Copilot message or the paste to “make JSON valid.”
2. Save the Copilot message **verbatim** (full file).
3. Paste once into the GAM capture field; leave it.
4. In console, copy:
   - `window.__PRISM_FINAL_GAM_PROMPT.prompt` (confirm still no `Pur[` / `\rtial`)
   - `state` is not global; dump the textarea value and, if reachable, `workflowRunCapturedOutputsRaw` for the GAM step via existing test API / debugger on `sync` 
   - `document.querySelector('[data-field="runStepOutput"]')` value for the GAM step (exact paste)
5. Record whether page-validation fail-closed (`Invalid page artefact JSON` / parse failed).
6. Byte-compare Copilot file vs textarea. **Match ⇒ Prism did not mutate on paste. Mismatch ⇒ capture/sync mutation (new evidence).**
7. Keep both files; do not pretty-print; do not TeX-correct.

That is sufficient to split (1) vs (3) vs (2)/(4).

---

## 12. Boundaries (explicit)

- No sanitiser for `Pur[`, raw newlines in strings, or `\rtial`.
- No broad JSON repair / `JSON.parse` recovery that accepts unescaped newlines.
- No silent TeX correction (`\rtial` → `\partial`).
- No fail-closed weakening.
- No production, test, schema, or validator changes in T-026.
- E1 / Case 1 / GAM D / T-031 / DLA architecture stay closed / ungated as already recorded.

---

## 13. Exact recommended next action

**No implementation.** Keep **E2 OPEN / INTERMITTENT**.

Apply §11 on the next sighting. Do not authorise a repair task from T-026.

Unrelated remaining queue (not E2 work): Graphics / T-032 — only if the operator selects them separately.

---

## Verdict

**T-026 COMPLETE — E2 OPEN / INTERMITTENT — EARLIEST PROVEN LAYER = OPERATOR-VISIBLE RESPONSE TEXT (INVALID JSON) — PROMPT AND POST-PARSE PRISM RULED OUT — MODEL VS COPILOT UI UNRESOLVED — NO DETERMINISTIC REPO MUTATION FOUND — RECURRENCE PROTOCOL REQUIRED — NO SANITISER.**

---

## Recurrence log

**2026-08-14 — post–T-027 GAM (record only):** [S77-T-026-e2-recurrence-2026-08-14-post-t027-gam.md](S77-T-026-e2-recurrence-2026-08-14-post-t027-gam.md)

Ordinary markdown bodies were followed (T-027). A2-M2 `reference_note` showed spliced prose/TeX (`carries[x+3yA maximise…`); math-integrity capture fail-closed as **detector**. Same response nested A4-M1/A4-M2 under A3 (output non-compliance; **E1 not reopened**). E2-family recurrence; no sanitiser; discard and regenerate GAM from the same DLA.

**2026-08-17 — Sprint 78 Candidate 6 (record only; Sprint 77 remains CLOSED):** [S78-T-013-candidate-6-malformed-gam-e2-diagnostic.md](../2026-08-17-sprint-78-learner-resource-quality-recovery/S78-T-013-candidate-6-malformed-gam-e2-diagnostic.md). A1-M3 → A2-M1 splice at `links[`; Copilot-visible independent copy already malformed (**upstream of Prism capture**). Confirmed E2-family. No sanitiser. Remaining interval: model generation vs Copilot rendering.
