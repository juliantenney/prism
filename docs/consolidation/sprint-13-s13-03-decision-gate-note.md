# Sprint 13 — S13-03 decision gate note (display-only hint neutralisation)

**Date:** 2026-05-13  
**Basis:** `docs/consolidation/sprint-13-s13-03-display-only-hint-neutralisation-audit.md`  
**Role:** Governance note for **whether** S13-03 may proceed, and **under what bounds**. **No implementation** is authorised by this document.

---

## 1. Summary of audit finding

The audit concludes that **strings applied only through `app.js` to helper nodes** (hint `<p>` **`textContent`**, **`placeholder`**, **`<option>` label text** where **`value`** is separate) are **not** read back into **`buildWorkflowDesignBase`**, **`buildWorkflowDesignBrief`**, or **`briefLines`** along the traced Factory path: design runs consume **form field `.value`**, not hint DOM.

**However:** Equivalent or related prose can still be **model-visible** through a **separate channel**: **domain markdown** (including embedded **`workflowBriefConfig` / `uiHints` JSON**) is loaded for **workflow generation context** assembly. Adjusting **only** on-screen helper copy in **`app.js`** does **not** remove that content from loaded files. Any future S13-03 slice must **not** conflate “DOM neutralised” with “prompt no longer sees similar wording.”

---

## 2. Clear distinction (two channels)

### A. `app.js` DOM-only helper text / labels / placeholders

- **What:** Copy written to **`#wfDesign*Hint`**, **`#workflow*Hint`**, **`#wfDesignInputsLabel`**, **`placeholder`** on inputs, and **visible `<option>` labels** (distinct from **`value`**), via **`renderWorkflowFactoryDomainUiHints`**, **`updateWorkflowFactoryInputsCopyFromStartingPoint`**, **`renderWorkflowFactoryStartingArtefactOptions`** (including the Learning Design trio), **`renderWorkflowDetailDomainUiHints`**, and related call sites described in the audit.
- **Prompt path (audited):** These nodes are **not** the source for **`brief`** / **`briefLines`**; user **typed** content in **`textarea` / `input`** fields is.

### B. Domain markdown / `uiHints` / WGC-loaded content (may be prompt-facing)

- **What:** Pack files listed in the manifest, including JSON blocks carrying **`uiHints`** and broader narrative, loaded by **`workflowGenerationContext.js`** for **`buildWorkflowGenerationContext`** and related APIs.
- **Prompt path:** File bodies (including JSON) can appear in **assembled context** passed toward generation, as documented in prior consolidation (e.g. Sprint 10 contract audit — **markdown permeability**). **`uiHints`** keys are **not** “display-only” in the **global** sense solely because Factory also paints them on the DOM.

---

## 3. Candidate safe slice (if later explicitly approved)

**Charter-bound, minimal slice (conceptual only — no code here):**

- **`app.js`-only** adjustment of **proven display-only** strings: helper **`textContent`**, **`placeholder`**, and **`<option>` label** text **where** audit has shown **no read-back** into **`briefLines`** / **`buildWorkflowDesignBrief`** / persistence fields, **and** **`value`** / factor semantics / allowlists are **unchanged**.

This slice **does not** assert removal of duplicate phrasing from **model-visible** pack text.

---

## 4. Explicitly unsafe / out-of-scope without a separate charter

The following are **not** S13-03 “display-only” work and require **their own** scope, review, and approval if ever pursued:

- **Domain pack markdown edits** (narrative or structural).
- **`uiHints` JSON changes** inside packs (or any change that alters **pack-authored** semantics).
- **`briefLines`**, **`buildWorkflowDesignBrief`**, **`buildWorkflowDesignBase`**, extraction / elicitation regexes, or **model payload** assembly — anything that changes **what the model receives** from user briefs or **prefix strings** tied to generation.
- **Semantic prompt migration** (Prompt Studio bodies, step prompts, platform copy used as model instructions, etc.).

---

## 5. Required proof before implementation

Before any S13-03 **implementation** is approved (even for the candidate slice in §3), evidence should include:

1. **Written scope** naming **exact functions / DOM targets** in scope and **explicit exclusions** (§4).
2. **Trace confirmation** (static or scripted): for each changed string path, **no** new read from hint/label nodes into **`brief`**, **`briefLines`**, **`persistSelectedDomains`**, export bundle builders, or **`buildWorkflowGenerationContext`** arguments beyond today’s behaviour.
3. **Regression posture:** existing **`node --test`** lanes relevant to workflow design / brief construction remain **green**; any **manual** smoke checklist is recorded (no new Sprint 13 umbrella scope).
4. **Acknowledgement** of §2.B: implementers and reviewers sign off that **WGC / pack visibility** of similar prose is **unchanged** unless a **separate** charter covers packs.

---

## 6. Stop conditions

**Halt and return to decision gate** if:

- A change **touches** pack files, **`uiHints`** JSON in repo, **`briefLines`** assembly, extraction, or **prompt bodies** “to match” UI copy.
- **`<option>` `value`**, starting-artefact **allowlists**, or **factor ids** are proposed for change under the S13-03 label.
- **Orchestration**, persistence, import/export, or **Sprint 12** artefacts become **implicated** to deliver the hint story.
- Reviewers cannot reproduce **§5** trace proof for a proposed line item.

---

## 7. Recommendation

1. **Keep S13-03 decision-gated** at the Sprint 13 program level: the audit supports **narrow DOM-only** work **in principle**, but **does not** approve execution.
2. **Permit only** an **`app.js` DOM-only implementation review** (or implementation) **if explicitly approved** in writing with §3–§6 satisfied — not by default from this prep pack.

---

## 8. Sprint 12

**Sprint 12** first-pass structural observability (**A–E**) remains **closed**. This gate note **does not** reopen Sprint 12 scope, tests, or obligations.

---

## 9. No full portability claim

**Full drop-in domain-pack portability** is **not** claimed, implied, or advanced by opening or closing this gate. S13-03, if ever executed, remains a **local UI copy** concern unless a **separate** charter explicitly widens it.

---

## Review log

- **2026-05-13** — Decision gate note added from display-only hint audit; implementation explicitly not authorised here.
