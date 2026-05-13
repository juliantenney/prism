# Sprint 13 — pragmatic domain-pack portability target

**Date:** 2026-05-13  
**Path:** `docs/consolidation/sprint-13-pragmatic-domain-pack-portability-target.md`

**Purpose:** Reframe the **portability aim** from an implicit **“zero core changes”** bar toward **“minimal explicit registration / config plus domain-pack-owned specifics.”** This note is **normative for vocabulary and acceptance direction only** — it is **not** a charter to implement now, **not** a schema proposal, and **not** a claim that full portability exists.

**Documentation only:** No production code, domain packs, prompts, persistence, import/export, or orchestration changes accompany this file.

---

## 1. Revised portability target

| Principle | Meaning |
|-----------|---------|
| **New domain packs do not require zero core changes** | Shipping a new pack may legitimately require **small, listed** updates in the host application (for example manifest registration, fallback list alignment, or a documented registration hook) as long as those changes are **predictable** and **bounded**. |
| **Acceptable: minimal explicit registration / config in one or two known places** | Examples of *acceptable* shapes (illustrative, not prescriptive): a **manifest** entry listing domain id, labels, and file paths; a **single** optional registration table or constant block the project owns and documents; a **chartered** touchpoint file agreed in advance. The count “one or two” is intent, not a hard limit — **clarity** matters more than the number. |
| **Not acceptable: scattered domain-specific branches** | Domain logic expressed as **many** ad hoc **`if (domainId === "…")`** (or equivalent) spreads across **`app.js`**, UI, prompt strings, loaders, orchestration, **and persistence paths** (save / gather / normalise / import) **without** a single obvious registration story. That pattern fails the pragmatic target even if each branch is small. |

---

## 2. Design principle: “Registration is acceptable; archaeology is not.”

> **Registration is acceptable; archaeology is not.**

- **Registration is acceptable** — A new domain pack may require **one or two explicit, documented** registration or configuration touchpoints in core (for example manifest registration, a named fallback list, or another **listed** hook). That cost is **predictable** and **reviewable**.

- **Archaeology is not acceptable** — A maintainer must **not** have to **discover** scattered, **undocumented** required edits across unrelated **UI**, **prompt**, **persistence**, **export**, or **orchestration** code to ship or update a domain. If integration is real, it must be **surfaced** as named steps, not left for grep-driven excavation.

- **Inspectability** — Where feasible, **domain-specific behaviour** should be **readable from the domain pack** and its **manifest / config surface** (markdown + declared paths), so authors and reviewers treat the pack as the **source of truth** for domain semantics.

- **Unavoidable core touchpoints** — Any core-owned step that **cannot** be eliminated must be **named**, **documented**, and **included in the new-domain acceptance checklist** (alongside §3 lifecycle expectations when relevant).

### Lesson note (Xerte and similar authoring stacks)

Prior systems in this problem family — including **Xerte**-style lesson and template tooling — often suffered when **template or domain coupling** was **distributed** across many files and configuration paths: behaviour became hard to reason about, regressions multiplied, and onboarding required **archaeology** rather than reading a pack. PRISM should **not repeat that pattern**: keep **domain-specific content pack-owned** and keep **core integration points explicit** and few, as this note and the Sprint 13 audits describe.

---

## 3. Proposed acceptance test (conceptual)

**Hypothesis:** Add a **new** domain pack, for example **“media outputs”** (hypothetical name only — no pack is created by this note).

**Pass criteria for the pragmatic target:**

- **Domain-specific content** (patterns, brief config, hints, artefact language, step semantics, narrative guidance for authors) **lives in the pack** (markdown + manifest-declared files), not copy-pasted into unrelated core modules.
- **Core changes**, if any, are **limited**, **explicit**, and **documented** (for example: “register `media-outputs` in `domain-manifest.json`; add id to Factory fallback list if offline path requires it; no other files” — illustrative only).
- A reviewer can answer **“where do I plug in a new domain?”** from **short** documentation without spelunking the whole **`app.js`** surface.
- **Lifecycle survival (target bar for a future charter, not a claim about v1):** the candidate workflow should survive **create → save → reload → export → import → refine** without **losing domain-specific metadata** that the product intends to keep on the workflow object (for example **`selectedDomains`**, **`startingArtefact`**, **`workflowBriefResolution`**, structured step lineage fields — exact list must align with a chosen schema story). Current gaps between that bar and actual save/gather/normalise behaviour are documented in **`sprint-13-persistence-export-portability-audit.md`**.

This test is **not** run or evidenced in-repo by this note; it is a **future validation exercise** (see §8).

---

## 4. What “specifics live in the pack” means

Pack-owned **specifics** include, where the current architecture already supports or can support them without scattering logic:

| Area | Pack-owned intent |
|------|-------------------|
| **Labels** | Human-facing names for the domain, steps, artefacts — expressed via manifest **`label`** fields and markdown prose, not duplicated as one-off strings in core for that domain alone. |
| **UI hints** | Factory / detail helper copy keyed from **`workflowBriefConfig`** / **`uiHints`** (understanding today that the same file may also feed **`promptContext`** — see **`sprint-13-prompt-config-portability-tracing-audit.md`**). |
| **Starting artefacts / starting points** | Where feasible, options and semantics described in pack-backed config or markdown rather than hard-coded only in core (today’s coupling is audited elsewhere; the **target** is pack-first). |
| **Workflow brief config** | Factors, intent classes, mapping rules, elicitation — JSON blocks in domain markdown as already used for structured domains. |
| **Prompt / context guidance** | Domain **`prompt-rules`**, **`artefacts`**, **`step-patterns`**, and related markdown that WGC loads into generation / refinement context. |
| **Output expectations** | Narrative and structured expectations carried in pack docs and brief config, aligned with **`workflowOutputSpec`** semantics where applicable. |

---

## 5. What may reasonably remain core-owned

These remain **legitimate core concerns** under the pragmatic target:

| Area | Rationale |
|------|-----------|
| **Generic domain selection plumbing** | Single `<select>` / state shape / persistence of “which domains are selected” mechanics (see Sprint 13 audits for current quirks). |
| **Manifest loading** | Fetch, normalise, merge fallback, file list resolution — **`workflowGenerationContext.js`**-style ownership. |
| **Safety / fallback behaviour** | When manifest fetch fails; ensuring **`general`** always applies where product policy requires it; validation warnings. |
| **Persistence schema compatibility** | **`normalizeWorkflowForV1`**, export bundle **`version`**, import merge rules — stability contracts for saved workflows. |
| **Cross-domain orchestration rules** | Rules that apply **across** packs (for example “first structured domain wins” for brief config today, or normalising **`selectedDomains`** to a fixed shape). |
| **Import / export versioning** | Bundle shape (`version`, `workflows`, `prompts`), merge policy (“newer wins”), and warning-only validation on import — **core-owned** contracts that packs must tolerate, not redefine per domain. |

---

## 6. Red flags (violations of the pragmatic target)

| Red flag | Why it fails the target |
|----------|-------------------------|
| **New `if (domainId === "…")` branches in `app.js`** (or equivalent scattered switches) | Domain behaviour is **not** pack-owned; every new pack invites more branches. |
| **New title-based injection rules** | Fragile coupling between free text and behaviour; hard to document and test per pack. |
| **Duplicated labels outside manifest / pack** | Same string maintained in UI and pack; drift and parity bugs. |
| **Prompt-specific prose embedded in core for one domain** | Model and author experience become **forked** per domain inside **`app.js`** instead of pack markdown / library prompts. |
| **Domain-specific fields dropped by save / import / export normalisation** | Pack or workflow semantics disappear silently when a code path replaces the object, omits keys on gather, collapses **`selectedDomains`**, or normalises without merge — fails the §3 lifecycle bar; see **`sprint-13-persistence-export-portability-audit.md`**. |

---

## 7. How this reframes earlier Sprint 13 findings

| Earlier finding (from boundary / tracing / persistence audits) | Pragmatic reframe |
|----------------------------------------------------------------|-------------------|
| **“Drop-in” portability is not achieved** | Still true. The target **narrows** the claim: **some** core touchpoints are **expected**; the bar is **disciplined registration**, not **zero diff**. |
| **Markdown permeability / `uiHints` in `promptContext`** | Not magically “display-only”; the target says **pack owns the prose**, core owns **which channels exist**, with **explicit** documentation of dual use. |
| **`briefLines` prefixes in `app.js`** | Classified as **core-owned copy** today; the pragmatic target would treat **divergence** from pack hints as **technical debt** to reduce over time **only** via chartered, evidenced work — not as a blocker to admitting **small** registration edits for new packs. |
| **Persistence / gather / `selectedDomains` quirks** | Remain **architecture-coupled**; the pragmatic target does **not** hand-wave them — it states that **compatibility** stays **core-owned** while **semantic content** stays **pack-owned**. The **acceptance bar** in §3 explicitly expects **no unintended loss** of domain-related persisted fields across the full lifecycle once a charter addresses known gaps. |
| **S13-02 / S13-03 / starting-artefact gating** | Decision-gated items stay gated; this note only says **new** domains should not multiply **undocumented** special cases. |

---

## 8. Suggested future validation exercise (read-only plan)

When the project chooses to run a **dry-run** (no implementation required by this note):

1. **Design a read-only “media outputs” candidate pack plan** — id, manifest entry, which markdown files would exist, which **`workflowBriefConfig`** blocks would apply.
2. **List required touchpoints** — manifest, WGC fallback (if any), Factory fallback rows, prompts, persistence, tests, docs.
3. **Classify each touchpoint** as:
   - **Acceptable registration** (expected, documented, minimal), or  
   - **Portability gap** (would force scattered branches, duplicate labels, unclear ownership, or **lifecycle field loss**).
4. **Persistence / export round-trip expectations** — spell out, for the hypothetical workflow, which fields **must** survive **save → reload**, **export → import**, and **refinement** (Prompt Studio / WGC using **`selectedDomains`** or workflow-backed state). Map each to today’s code paths using **`sprint-13-persistence-export-portability-audit.md`** as the evidence baseline; record **mismatch** as gaps, not as fixed behaviour.

Outcome of the exercise is a **checklist** and **gap list**, not shipped code.

---

## 9. Explicit non-goals

- **No implementation now** — this document does not trigger or authorise code, pack, or prompt edits.
- **No new schema now** — no **`version`** bump, no new persisted fields, no manifest keys are proposed here.
- **No claim that full portability is achieved** — v1 remains **partial**; audits remain authoritative on current behaviour.
- **Sprint 12 remains closed** — this note does not reopen Sprint 12 structural observability or obligations.
- **No roadmap commitments** — the design principle and lesson note describe **intent and posture** only; they do not schedule delivery or approve scope.

---

## Related artefacts

| Topic | File |
|-------|------|
| Boundary summary | [`sprint-13-portability-boundary-summary.md`](sprint-13-portability-boundary-summary.md) |
| Prompt / config tracing | [`sprint-13-prompt-config-portability-tracing-audit.md`](sprint-13-prompt-config-portability-tracing-audit.md) |
| Persistence / export | [`sprint-13-persistence-export-portability-audit.md`](sprint-13-persistence-export-portability-audit.md) |
| First-pass closure | [`sprint-13-first-pass-closure.md`](sprint-13-first-pass-closure.md) |

---

## Review log

- **2026-05-13** — Pragmatic portability target note added (`sprint-13-pragmatic-domain-pack-portability-target.md`).
- **2026-05-13** — Expanded: persistence in “not acceptable” scatter; lifecycle acceptance (create → refine); core-owned import/export versioning; red flag for normalisation field loss; validation exercise includes persistence round-trip expectations; cross-links to persistence audit.
- **2026-05-13** — §2 design principle (“Registration is acceptable; archaeology is not.”), Xerte lesson note; sections renumbered §3–§9; explicit “no roadmap commitments” in non-goals.
