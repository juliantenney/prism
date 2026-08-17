# S78-T-013 Candidate 6 — malformed GAM / E2 recurrence diagnostic

**Task:** Bounded diagnostic within **S78-T-013**  
**Status:** **COMPLETE** (2026-08-17)  
**Mode:** DIAGNOSIS ONLY — no implementation  
**Sprint 78:** OPEN · **Sprint 77:** remains CLOSED  
**Provenance addendum:** 2026-08-17 — Copilot-visible independent copy already contains the splice (upstream of Prism capture). Forensic parse findings unchanged.

**Production / prompt / schema / validator / assembly / renderer changes:** **NO**

Do not sanitise. Do not hand-edit this GAM. Do not regenerate in this task. Do not start T-019. Do not score Candidate 6. Do not mark WS2/suitability from unreachable content.

**Preserved artefacts (operator-supplied, this paste):**

- DLA: [S78-T-013-candidate-6-dla.json](S78-T-013-candidate-6-dla.json)
- Malformed GAM: [S78-T-013-candidate-6-malformed-gam.txt](S78-T-013-candidate-6-malformed-gam.txt)
- EP: **not supplied**

Operator capture error (verbatim):

```text
GAM v2 capture must be valid JSON page artefact
```

---

## 1. First structural failure

`JSON.parse` of the preserved GAM (Node):

```text
Bad control character in string literal in JSON at position 7064 (line 109 column 557)
```

| Field | Value |
| ----- | ----- |
| Character | U+000D CR (`\r`) immediately followed by LF |
| Context | Inside the open JSON **string** `activities[1].materials[0].body` (**A2-M1**) |
| Prefix still inside the string | `…introduce a Lagrange multiplier \\(\\lambda\\). The multiplier links[` |
| Next bytes | raw CRLF, then spliced A1-M3 checklist prose |

Smallest surrounding excerpt (exact):

```text
The multiplier links[
 explicitly that unconstrained optimisation has no imposed restriction whereas constrained optimisation requires a condition to be satisfied."
                 ": "Describe how constraints reduce the feasible set of choices available to theHave you explained the role ofters": "The objective function provides the quantity being optimised and anchors the entire target such as utility,monstrates the construction process only. It uses a different optimisation problem from the independent practice task."
```

**First affected activity/material:** **A2 / A2-M1** (`worked_example`, `body`).

A1-M1, A1-M2, A1-M3 parse as well-formed JSON objects through the close of A1. The first syntax break is the **unescaped newline after `links[`** inside A2-M1’s `body` string.

No JSON was repaired to inspect later content. Later materials were read only as **raw text** after the break.

---

## 2. Corruption pattern

**Combination (H):** primarily **E** previous-material tail/body splice, plus **C** premature string termination, **F** object-boundary loss, **D** duplicated/truncated fragments, **A**-adjacent truncation of the intended A2-M1 close, and a **`[` / TeX-boundary** break (G-adjacent). Not a simple end-of-file truncation. Not a lone escaping typo.

### Source → destination

Spliced fragments are from **A1-M3** (`checklist`, `body_format: "json"`, `guided_criteria`) in the **same GAM response**:

| Destination (inside/after A2-M1 `body`) | Source in A1-M3 |
| --------------------------------------- | --------------- |
| `explicitly that unconstrained optimisation has no imposed restriction whereas constrained optimisation requires a condition to be satisfied.` | `"repair": "State explicitly that unconstrained…"` (leading `State ` dropped) |
| `": "Describe how constraints reduce the feasible set of choices available to the` | `"repair": "Describe how constraints reduce the feasible set of choices available to the decision-maker."` (key truncated to `":`; `decision-maker.` dropped) |
| `Have you explained the role of` | `"statement": "Have you explained the role of the objective function accurately?"` |
| `ters": "The objective function provides the quantity being optimised and anchors the entire` | `"why_it_matters": "The objective function…anchors the entire comparison."` (`why_it_mat` dropped; ` comparison` dropped) |
| `target such as utility,` | `"repair": "Identify a specific target such as utility, profit, cost, or welfare."` |
| `monstrates the construction process only. It uses a different optimisation problem from the independent practice task.` | Intended **A2-M1 close** (`This worked example demonstrates…`) truncated onto the splice |

Break landmark: **`The multiplier links[`** then raw newline — same family as historical `Pur[` and post-T-027 `carries[`.

After the first quoted close at `satisfied."`, leftover A1-M3 JSON keys appear **outside** a valid object (`": "Describe…`, `ters": "…"`). A2-M2 then resumes as a new material object in the paste (locally well-formed **text**, unreachable by `JSON.parse`).

A single proven splice site (unlike Candidate 2’s two independent sites). A3 and A4 bodies in the paste are locally well-formed markdown/JSON **as text**.

---

## 3. Comparison with S77-T-026 E2

Canonical: [S77-T-026](../../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/S77-T-026-gam-e2-intermittent-corruption-diagnostic.md). Recurrences: [post-T-027](../../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/S77-T-026-e2-recurrence-2026-08-14-post-t027-gam.md); [T-013 Candidate 2](S78-T-013-candidate-2-gam-malformed-json-diagnostic.md).

| E2 characteristic | Candidate 6 |
| ----------------- | ----------- |
| Intra-response splice | **YES** — A1-M3 into A2-M1 |
| Previous material inside later material | **YES** |
| Corruption at body/string/`[` / TeX boundary | **YES** — `links[` + unescaped newline |
| Truncation | **YES** — intended A2-M1 close and A1-M3 strings clipped |
| Object-boundary loss | **YES** — checklist keys leak after premature string close |
| Invalid JSON at operator-visible response | **YES** |
| Fail-closed capture | **YES** — same message as Candidate 2 |
| Historical tokens `Pur[` / `\rtial` | **NO** (different surface tokens; same mechanism) |
| Candidate 2 A3-M1 / A4 dual splice | **NO** — one proven site here |

**Classification: A — confirmed E2-family recurrence.**

Candidate 6 is **stronger** than the first C6 write-up alone: intact earlier material; fragments from that material recur in a later material; `[` boundary; malformed JSON; **splice exists upstream of Prism capture**; Prism correctly fail-closes.

Not a new malformed-output class. Sprint 77 **not** reopened. E2 remains **OPEN / INTERMITTENT**.

---

## 4. Earliest proven causal layer

### 4.1 Previous conclusion (superseded for Candidate 6 Prism-side)

The first diagnostic concluded:

- earliest proven bad representation = **operator-visible / pasted GAM text**;
- **model vs Copilot/UI unresolved**;
- T-026 Copilot-vs-textarea **byte-compare required** to split Prism paste mutation from upstream.

That Prism-side uncertainty is **now closed for Candidate 6**.

### 4.2 New operator provenance evidence (authoritative)

After Prism rejected Candidate 6, the operator returned to the **Copilot-visible GAM response** and **manually selected/copied the JSON independently of Prism’s GAM textarea/paste workflow**.

That independently copied Copilot-visible text already contains the **same** A1-M3 → A2-M1 splice:

- A1 materials intact;
- A1-M3 `guided_criteria` present;
- A2-M1 begins normally, then `The multiplier links[`;
- A1-M3 fragments appear inside/beside A2-M1;
- JSON already malformed;
- later A2 materials and subsequent activities resume.

This is **not** text copied back out of Prism.

Exact Copilot-vs-textarea **byte-for-byte** files were **not** captured. Ordinary structured-pattern identity is proven; byte-identity is **not** claimed.

### 4.3 Revised earliest proven bad representation

**Copilot-visible / copyable GAM response** — already malformed **before** any Prism GAM capture textarea.

### 4.4 Revised proven path

```text
Prism final GAM prompt
    ↓
Copilot/model generation and/or Copilot response rendering
    ↓
CORRUPTION ALREADY PRESENT IN COPILOT-VISIBLE/COPYABLE RESPONSE
    ↓
manual copy / clipboard
    ↓
Prism textarea
    ↓
Prism preprocessing
    ↓
JSON.parse rejection (correct fail-closed)
```

**Remaining unresolved interval:** **model generation** vs **Copilot response / rendering**. Do **not** claim which is responsible.

### 4.5 Candidate 6 exclusions (origin of this splice)

These stages **encountered** the malformed text; they did **not originate** the A1-M3 → A2-M1 splice **in this occurrence**:

- Prism GAM textarea handling;
- Prism paste/input handling;
- Prism fence stripping;
- Prism TeX normalisation;
- Prism pre-parse processing;
- `JSON.parse`;
- GAM semantic validators.

This is a **Candidate 6 provenance** conclusion, **not** proof about every historical E2 occurrence.

Ordinary **clipboard transfer is no longer a useful primary suspect** for Candidate 6: the Copilot-visible/copyable representation was already malformed.

---

## 5. Prism preprocessing assessment

Live path (T-026 §4; unchanged):

```text
Copy → Copilot → paste → sanitizePrismRunCapturedOutput (footer/fence only)
  → utilityNormalizeUtilitiesJsonInput (TeX delimiter / `\ `+whitespace inside strings)
  → JSON.parse
  → on fail: "GAM v2 capture must be valid JSON page artefact"
```

| Transform | Could produce this splice? |
| --------- | -------------------------- |
| Fence / footer strip | **No** — does not insert A1-M3 criteria into A2-M1 |
| TeX delimiter normalizer | **No** — upgrades `\(` / `\[` escapes; does not insert previous-material prose; does **not** remove a raw CR that is **not** preceded by `\` |
| Concatenate / duplicate earlier body | **No** deterministic producer in repo (T-026 §7; Candidate 2 §7) |

A raw `\r` inside a JSON string (here: after `links[`, **not** `\[` + newline) is exactly what `JSON.parse` rejects. The normalizer’s `\ `+whitespace tolerance does not apply.

Candidate 6 Copilot-visible copy **already** contains the splice. Prism preprocessing is **not** the origin for this occurrence. T-026 Copilot-vs-textarea byte-compare is **not required** to establish that Prism capture caused Candidate 6 — Candidate 6 already excludes that.

---

## 6. Gate that stopped Candidate 6

`validateStrictJsonWorkflowRunStepCapture` for Generate Activity Materials v2 (`app.js`):

```text
tryParseWorkflowArtefactJson(raw) → null
  → errors: ["invalid_json"]
  → message: "GAM v2 capture must be valid JSON page artefact"
```

Failure is **at JSON parsing**, **before**:

- `validateGamOrPageCapture` / GAM semantic validators
- WS1 / WS2 / WS3 GAM checks
- operational-suitability review (T-017/T-018)
- assembly

**Fail-closed behaviour is correct.** Prism **MUST** continue to fail closed on malformed GAM.

Do **not**: auto-repair JSON; sanitise spliced output; infer missing object boundaries; silently discard malformed material; allow malformed GAM to reach verification or assembly.

The desirable fix is to **prevent malformed generation/output**, not make Prism more tolerant of it.

---

## 7. Secondary pedagogical observations (not scores)

Readable **text** after the break is not a captured artefact. Observations only:

### A2 equality-constraint commission

DLA A2-M2: “single **equality** constraint.” Intact A2-M2 body: `P(x,y)=4xy` subject to `2x+y=20` (equality). Intact A2-M1 prefix: `U(a,b)=ab` with `a+b=12` (equality), distinct symbols/numbers, then **splice before the Lagrangian is completed**. Equality-constraint commission appears **obeyed** in the readable operands. **Not** a WS2/suitability PASS.

### A3 distinct model/attempt

A3-M1: maximise `mn` s.t. `m+n=8`, worked through to `m=4`, `n=4`.  
A3-M2: maximise `xy` s.t. `x+y=10`, unsolved. Distinct operands in the paste text. **Not** a WS2 closure.

### A4 shadow-price overclaim

A4-M1 supplies three scenarios with multipliers 2.4 / 18 / 0.8 and does **not** state interpretations. A4-M3 criteria talk about **value of relaxing the constraint** / additional unit of the scarce resource. No readable “larger lambda = tighter constraint” overclaim in this paste. **Not** a suitability PASS.

Do **not** score Candidate 6.

---

## 8. Sprint 78 work implication

| Item | Implicated? |
| ---- | ----------- |
| T-015 collector repair | **NO** — prompt-side obligation listing; does not author GAM bodies; verifier never reached |
| T-017 / T-017A / T-018 / T-018A | **NO** — review UI/gate never reached |
| T-022 WS3 diagnostic_review | **NO** — DLA `diagnostic_review` bindings are valid commission; splice source is **GAM A1-M3 generated body**, not DLA metadata |
| Recent disciplinary-quality discussion | **NO** as causal for JSON corruption. Secondary readable A2/A4 probes look consistent with the DLA commissions; that does not repair the GAM |

Default holds: none of the recent Sprint 78 instrumentation caused this failure.

---

## 9. Repair decision

**C — no production sanitiser; retain fail-closed.**  
Prompt/output **architecture** diagnosis is now the justified next *investigation* (not implemented here). Model vs Copilot **rendering** remains unresolved; that gap does **not** justify a sanitiser.

| Question | Answer |
| -------- | ------ |
| Production repair justified now? | **NO** (no sanitiser; no capture-path change) |
| JSON auto-repair / sanitiser? | **Forbidden** (hides E2) |
| Prism clipboard/textarea instrumentation for C6? | **Not recommended** — C6 already excludes Prism capture as origin |
| Next investigation | Bounded **E2 upstream-response architecture** diagnostic (prompt/output size, nested `guided_criteria`, TeX density, material transitions). Hypotheses only — none proven as cause |

---

## 10. Recurrence protocol

**T-026 §11** remains available if a **future** occurrence has **ambiguous** Prism-side provenance.

**For Candidate 6:** Copilot-visible independent copy already answers the main Prism-side question. Do **not** add Prism clipboard/textarea provenance instrumentation solely to diagnose this occurrence. T-026 byte-compare is **not required** to prove Prism capture caused C6.

**Next unresolved engineering question:**

> Why does the GAM response become corrupted **upstream of Prism capture**?

Future **diagnosis-only** hypotheses (none concluded here): total GAM prompt/output size; single-response JSON size; long escaped Markdown strings; TeX/backslash density; nested `guided_criteria`; material transitions; repeated JSON structural patterns; whether checklist bodies increase response complexity; whether output could be partitioned without damaging the GAM one-step product experience; whether prompt structure can reduce malformed-output probability.

---

## 11. Candidate 6 disposition

```text
EP PASS (operator; EP JSON not attached in pack)
→ DLA PASS (preserved)
→ GAM MALFORMED / E2 (Copilot-visible; Prism capture correctly rejected)
→ verifier NOT reached
→ assembly NOT reached
→ QA NOT run
```

Preserve the malformed GAM as evidence. The valid Candidate 6 DLA remains reusable.

Do **not** regenerate during this documentation update. Do not repair GAM manually. Do not start T-019.

**Recommended next (after this update):** (1) bounded E2 upstream-response architecture diagnostic; (2) then regenerate GAM only from the preserved Candidate 6 DLA and continue the clean benchmark.

---

## 12. Files

**Inspected:** this paste; T-026 + post-T-027 E2 records; Candidate 2 malformed-GAM diagnostic; `app.js` `tryParseWorkflowArtefactJson` / `validateStrictJsonWorkflowRunStepCapture` / `utilityNormalizeUtilitiesJsonInput`.

**Changed:** this record (forensic findings preserved; provenance addendum 2026-08-17); STATUS / PLAN / START-HERE / T-013 pointers; T-026 recurrence log cross-reference only.

**Production / prompt / schema / validator / assembly / renderer:** **ALL NO**.
