# S78-T-054 — Transfer response Markdown / closure leakage diagnostic

**Task:** S78-T-054  
**Status:** **DIAGNOSTIC COMPLETE** (2026-08-25)  
**Mode:** DIAGNOSTIC ONLY — **no production code changes**  
**Sprint 78:** OPEN · **T-013:** remains OPEN  

**Note on numbering:** Operator brief titled this “S78-T-052”. That ID is already assigned to the [closure-readiness diagnostic](S78-T-052-sprint-78-closure-readiness-diagnostic.md). This snag is recorded as **S78-T-054** and is a **pre-closure BLOCKER** that supersedes T-052’s “C READY TO CLOSE” until fixed.

**Exhibit:** HR Essentials CPD learner package (operator screenshot — Transfer response panel). Exact HR JSON **not deposited** in the sprint pack; structural condition **reproduced** from repository contracts + vNext render path (see §1).

**Related:** [S78-T-032](S78-T-032-gam-learner-closure-packaging-implementation.md) · [S78-T-041](S78-T-041-restore-culminating-learner-transfer-production.md) · [S78-D04](decisions.md#s78-d04--page-closure-ownership-gam-substance--design-page-transport)

---

## 1. Exact HR source shape (availability)

| Artefact | Status |
| -------- | ------ |
| Operator screenshot / learner UI | Available (described): panel **Transfer response** shows literal `### Transfer task`, literal `### Page learner-resource closure`, hyphen lists as inline prose |
| HR assembled page JSON | **Unavailable** in repo — mark as operator-held only |
| Structural reproduction | **Confirmed** via fixture-shaped `transfer_prompt` body containing both headings + lists |

**Reproduction result** (owen fixture + synthetic `transfer_prompt` body → `renderLearnerPageForTest` vNext):

- Transfer moment present (`Transfer response` label).
- Workspace prompt HTML contains **literal** `### Transfer task` and `### Page learner-resource closure`.
- Lists collapsed into a single `<p class="util-learner-workspace__prompt">` (browser whitespace collapse → inline prose).
- No block Markdown headings (`util-md-heading`) inside the transfer workspace prompt.

Inferred HR authored shape (highest confidence):

```text
material_type: transfer_prompt
body (markdown) contains:
  ### Transfer task
  …production prose / bullets…
  ### Page learner-resource closure
  …consolidation bullets…
```

Likely also: `page_synthesis.study_tips` populated by Design Page transport of the same closure section (copy, not strip).

---

## 2. Earliest divergence

**Earliest proven divergence for the combined defect:**

1. **GAM packaging contract allows / prefers** embedding `### Page learner-resource closure` in a `transfer_prompt` host vessel (T-032 / S78-D04 live brief + enrich contract).  
2. **Design Page transports** closure body into `study_tips` but **does not remove** the section from the material body (materials fidelity / transport-only).  
3. **vNext** maps the **entire** `transfer_prompt.body` into a text_entry workspace `prompt`, rendered with **`renderMarkdownInline`** inside one `<p>` — block Markdown (headings/lists) never applied.

Earliest **ownership** for closure-inside-transfer: **GAM authoring under ambiguous T-032 host-vessel guidance** (not Design Page inventing closure; not DLA requiring both in one field).

Earliest **ownership** for visible `###` / list collapse: **vNext transfer workspace prompt rendering** (`renderLearnerWorkspace` → `renderMarkdownInline`).

---

## 3. Closure-leakage trace

| Stage | Behaviour |
| ----- | --------- |
| DLA | Commissions `transfer_prompt` for culminating production (T-041). Does **not** require closure inside that row. |
| GAM | S78-D04: emit exactly one `### Page learner-resource closure` in final-activity materials Markdown. **Host preference explicitly includes `transfer_prompt`.** T-041 simultaneously says do not replace transfer production with closure / do not duplicate closure into transfer. |
| Design Page | Copy closure section body → `page_synthesis.study_tips` (S78-D04). **Does not strip** the section from materials. |
| Assembly / vNext model | `transfer_prompt` material retained with full body; study tips separate page section. |
| Compose | `partFromTransferText(..., material.body)` → workspace prompt = **full body**. Covered material shell drops body from article (title only). |
| Render | Workspace prompt via **inline** Markdown → learner sees closure heading + bullets inside **Transfer response**. |

**YES — closure can be (and for HR almost certainly was) authored inside the transfer material.** That is a **regression against the intended T-032/T-041 separation**, enabled by the host-vessel preference contradicting the “distinct from transfer” rule.

Classification of path: **GAM authoring leakage under contract ambiguity**, surviving transport, then **exposed** by transfer workspace rendering.

---

## 4. Markdown-leakage trace

Independent of whether closure is present:

| Mechanism | Detail |
| --------- | ------ |
| Intended MD utilities | `renderMarkdownBlock` exists and correctly turns `###` / `-` into headings/lists (verified). |
| Transfer workspace path | `renderLearnerWorkspace` wraps prompt in `<p class="util-learner-workspace__prompt">` and calls **`html.renderMarkdownInline(promptText)`** only. |
| Inline behaviour | Escapes HTML; applies bold/code/links; **does not** parse ATX headings or lists; newlines survive in HTML source but **collapse in `<p>`**. |
| Covered material | Full `renderMaterial` / block Markdown **suppressed** when workspace covers the material (`renderCoveredMaterialShell` = title only). |

So visible Markdown is **not** “escaped as plain text accidentally” in the sense of double-escaping; it is **block Markdown never applied** on the path that actually shows the transfer body to the learner.

Secondary: even if switched to block Markdown, redundant `### Transfer task` would still duplicate UI headings (**Transfer your learning** / **Transfer response**).

---

## 5. T-032 / T-041 architecture audit

| Intended | Status |
| -------- | ------ |
| `transfer_prompt` → culminating learner **production** | Contract still says this (T-041) |
| `### Page learner-resource closure` → Design Page → **Study tips** | Contract still says this (T-032 / S78-D04) |
| Distinct surfaces in learner UI | **Broken when** closure is hosted inside `transfer_prompt` body — Study tips may still appear later, but Transfer response **also** shows closure |

**Regression:** Yes — against the architecture T-041 claimed to lock (“transfer ≠ Study tips”). Existing T-041 live export test uses a clean transfer body **without** embedded closure, so it did **not** catch this host-vessel case. A T-041 capture fixture even **allows** closure text inside a `transfer_prompt` body to pass GAM capture validation.

---

## 6. Primary / secondary classification

| Class | Role |
| ----- | ---- |
| **A. GAM authoring-shape defect** | **PRIMARY (closure leakage)** — closure section placed in `transfer_prompt` body |
| **B. DLA commissioning defect** | **Not primary** — DLA does not commission closure-inside-transfer; ambiguity is GAM packaging |
| **C. Assembly/composition defect** | **SECONDARY** — Design Page copies but does not strip; materials fidelity preserves the leak |
| **D. vNext Markdown rendering defect** | **PRIMARY (Markdown leakage)** — transfer workspace prompt uses inline MD in a single `<p>` |
| **E. Renderer semantic-duplication** | **SECONDARY** — UI already supplies Transfer headings; authored `### Transfer task` is redundant |

Contract contradiction (same GAM enrich / live brief):

- Prefer `transfer_prompt` as **host vessel** for page closure.  
- When `transfer_prompt` is commissioned, body must be **distinct** production — do not put closure there.

That contradiction is the root **policy** defect enabling A.

---

## 7. Smallest ownership-correct fix (do not implement here)

**Recommended combined minimal fix (ownership-correct):**

1. **GAM / T-032 packaging (primary for closure):** When a `transfer_prompt` is commissioned on the final activity, **forbid** hosting `### Page learner-resource closure` inside that material. Prefer `consolidation_summary` or another non-production Markdown vessel; else append closure to the last **non-`transfer_prompt`** Markdown material. Align live V2 Copy brief with enrich contract (remove `transfer_prompt` from host preference). Optionally fail soft/hard if closure heading appears in `transfer_prompt` bodies.  
2. **vNext render (primary for Markdown leak):** For transfer (and likely general) text_entry workspace prompts that contain block structure, render via **`renderMarkdownBlock`** (or equivalent block region) instead of inline-in-`<p>`. Do **not** only CSS-hide `###`.  
3. **Heading hygiene (secondary):** Prefer stripping/preventing redundant `### Transfer task` upstream when UI already labels the moment/workspace; do not “pretty-render” duplicate semantics as the sole fix.  
4. **Do not** rely on a renderer-only patch that leaves closure embedded in transfer bodies while Study tips also show it — that hides semantic corruption.

**Not recommended as sole fix:** Design Page stripping without GAM rule change (still leaves wrong host preference); CSS; weakening Study tips.

---

## 8. Regen vs re-export

| Change | Requirement |
| ------ | ----------- |
| Renderer block-MD for workspace prompts | **Re-export / re-render** existing assembled page may fix Markdown visibility without GAM regen |
| Removing closure from `transfer_prompt` host | Requires **GAM regen** (or careful assembly strip) of the culminating material; Design Page study_tips path must still receive closure from a **separate** host |
| HR package | After fix: re-export at minimum; prefer GAM regen of final activity materials if closure remains inside transfer body |

---

## 9. Required regressions (for later implementation)

1. Transfer task renders **without** visible `###` / raw `-` Markdown syntax in Transfer response.  
2. Transfer production remains in the transfer activity / transfer moment.  
3. Page closure remains in terminal **Study tips**.  
4. Closure heading/body **does not** appear inside Transfer response.  
5. No duplicated “Transfer task” heading when renderer already provides Transfer your learning / Transfer response.  
6. Legitimate lists/paragraphs retain structure under block Markdown.  
7. T-032 closure packaging intact (closure → study_tips).  
8. T-041 culminating transfer production intact.  
9. Live vNext export path (`renderLearnerPageForTest` / operator export).  
10. Contract regression: `transfer_prompt` **not** listed as preferred closure host when transfer production is commissioned.

---

## 10. Files inspected

- `lib/learner-renderer-vnext/compose-response-parts.js` (`partFromTransferText`)  
- `lib/learner-renderer-vnext/render-composed-moment.js` (`renderLearnerWorkspace`, `renderTransferMoment`, `renderCoveredMaterialShell`)  
- `lib/learner-renderer-vnext/render-html-utils.js` (`renderMarkdownInline` vs `renderMarkdownBlock`)  
- `lib/learner-renderer-vnext/compose-generic-moments.js` (transfer moment association)  
- `lib/ld-gam-page-enrich-contract.js` (S78-D04 host vessel + T-041 distinctness)  
- `app.js` (`buildGamV2CopyMaterialAuthoringBrief` S78-D04 / T-041 lines)  
- `lib/ld-design-page-partial-contract.js` (study_tips transport-only)  
- `tests/s78-t-041-culminating-transfer-production.test.js`  
- T-032 / T-041 / T-052 records  

---

## 11. Files changed (docs only)

- This record: `S78-T-054-transfer-response-markdown-closure-leakage-diagnostic.md`  
- Minimal sprint navigation updates (STATUS, HANDOVER, PLAN, START-HERE, next-chat-briefing)  
- Brief note on T-052: C recommendation **held** pending this blocker  

---

## 12. Unresolved risks

- Exact HR JSON not in pack — confidence high from reproduction + contracts, but deposit would allow byte-level confirmation.  
- Whether HR also duplicated Study tips content (likely) vs only leaked into transfer.  
- Whether `consolidation_summary` was commissioned on HR culminating activity (if not, host-vessel pressure on `transfer_prompt` was especially high).  
- Switching workspace prompts to block MD may affect other text_entry prompts that intentionally used single-line inline copy — needs scoped application (transfer / multi-line bodies).

---

## 13. Sprint 78 / T-013 state

| Item | State |
| ---- | ----- |
| Sprint 78 | **OPEN** |
| T-013 | **OPEN** |
| T-052 closure readiness | Remains on file, but **C READY TO CLOSE is blocked** until T-054 fix lands |
| Next | Authorise **implementation** for T-054 (GAM host-vessel rule + vNext block-MD workspace prompt); then resume T-053 closure admin |

**Production code:** unchanged.
