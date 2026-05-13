# Sprint 13 — portability strategy synthesis

**Date:** 2026-05-13  
**Path:** `docs/consolidation/sprint-13-portability-strategy-synthesis.md`

**Purpose:** Synthesize Sprint 13 **documentation and first-pass work** into a **practical portability strategy posture** for PRISM. This note is **descriptive** — it does **not** recommend specific implementations, **does not** propose schema redesigns, **does not** commit roadmap items, and **does not** authorise code or pack edits.

**Documentation only.**

---

## 1. Summary of Sprint 13 discoveries

Sprint 13 surfaced a **layered** picture rather than a single “portability knob”:

- **First-pass delivery** was intentionally narrow: **S13-07** (v1 behaviour documentation) and **S13-01** (strict-parity tidy for Factory **`#wfDesignDomainSelect`** in **`app.js`** only), per **`sprint-13-first-pass-closure.md`**.
- **Read-only audits** mapped **prompt/config channels**, **persistence and export/import**, **workflow semantics and orchestration** (including **Learning Design–shaped** branches and **title** heuristics), **starting artefacts**, and **boundary categories** — see the consolidation index and linked **`sprint-13-*.md`** artefacts.
- **Coupling themes** recur: **manifest + markdown + WGC + `app.js`** split ownership; **first structured domain** rules; **markdown permeability** into **`promptContext`**; **`briefLines`** prefixes vs pack **`uiHints`**; **save/gather/normalise** paths that can drop fields; **session** domain state vs **persisted** workflow records; **LD-specific** orchestration and allowlists in core.

Together, these findings support treating “portability” as **more than one axis**, not a binary shipped/not shipped.

---

## 2. Separation: practical domain-pack portability vs deep semantic / orchestration portability

| Strand | What it concerns | How Sprint 13 framed it |
|--------|------------------|-------------------------|
| **Practical domain-pack portability** | **Adding or adjusting** a domain’s **declared** files, labels, hints, brief-config blocks, and patterns so they **load** and **surface** through existing manifest and WGC paths with **bounded, knowable** core touchpoints | Aligns with **`sprint-13-pragmatic-domain-pack-portability-target.md`** (registration vs archaeology; pack-owned specifics where feasible). |
| **Deep semantic / orchestration portability** | **Behaviour** of workflow **design**, **elicitation**, **post-generation refinement**, **model hint contracts**, **normalisation**, and **cross-domain rules** — where semantics are **implied** by **`app.js`** heuristics, **fixed factor ids**, or **orchestration state machines** | Documented in **`sprint-13-workflow-semantics-orchestration-portability-audit.md`**, **`sprint-13-prompt-config-portability-tracing-audit.md`**, and **`sprint-13-persistence-export-portability-audit.md`**. |

The two strands **intersect** (for example the same markdown file may feed both UI hints and **`promptContext`**) but **progress** on them is **not** the same kind of work.

---

## 3. What practical portability should realistically mean in PRISM

In light of Sprint 13 artefacts, **practical portability** here means:

- A **new or revised** domain pack can be reasoned about primarily through **manifest registration** and **pack markdown**, with any **core** delta **small**, **listed**, and **reviewable** — not discovered by searching unrelated subsystems.
- **Authors** can see **domain-specific** guidance and structure **from the pack** (and manifest labels), understanding that some **channels** (Factory brief lines, system prompts, normalisers) remain **core-owned contracts** today.
- **Operational clarity** improves even when **deep** portability (orchestration neutrality, full lifecycle parity) remains **explicitly out of scope** for a given pass.

This is **consistent with** but **narrower than** “drop in any pack with zero host changes,” which Sprint 13 repeatedly **rejects** as a completion claim.

---

## 4. Which areas are now reasonably tractable

“Tractable” here means **already supported by existing mechanisms** or **bounded** in the sense of **S13-01**-style parity work — **not** a promise that every change is trivial.

| Area | Rationale in Sprint 13 material |
|------|--------------------------------|
| **UI / domain selection** | Manifest-driven options plus documented **General** / **`alwaysOnDomains`** / first-structured behaviour; **S13-01** pattern for **single-control**, evidence-backed edits. |
| **Manifest registration** | **`domain-manifest.json`** is the **declared** entry point for which files belong to which domain id. |
| **Hints / copy** (where pack-sourced) | **`workflowBriefConfig`** / **`uiHints`** and related markdown blocks are the **intended** pack surface — with the caveat that **full file text** may still reach models (**prompt tracing audit**). |
| **Some artefact config** | **`getDomainArtefactOptions`** and catalogue markdown supply **structured** choices when the pipeline uses them; starting-point behaviour also intersects **starting-artefact** audits. |

---

## 5. Which areas remain architecture-coupled

These areas **span** multiple subsystems or **embed** product semantics in **`app.js`** / normalisers / contracts:

| Area | Why it stays coupled |
|------|----------------------|
| **Workflow semantics** | **`workflowBriefResolution`**, factor ids, **`intentClasses`**, mappings — behaviour ties pack config to **`app.js`** elicitation and **workflow JSON** shape. |
| **Orchestration** | **Design → generate → post-gen elicitation → refine** state uses **`state.workflowBriefElicitation`**, **LD-flavoured** branches, **profile ids**, and **regeneration** rules. |
| **Prompt-contract semantics** | **`briefLines`** assembly, **`callOpenAIForWorkflowDesign`** hint payloads, system prompts, refinement **`promptContext`** — not owned by the pack alone. |
| **Persistence / versioning semantics** | **`normalizeWorkflowForV1`**, **`selectedDomains`** coercion, export **`version`**, import merge — **compatibility** is a **host** contract. |

---

## 6. Lessons learned from Sprint 13

| Lens | Takeaway |
|------|----------|
| **Parity-safe vs semantic** | **S13-01** showed that **UI parity** work can be **strictly bounded** with matrices and tests; **semantic** moves (defaults, hints, orchestration) need **decision gates** and **evidence** — **S13-02**, **S13-03**, and orchestration audits. |
| **Display-only vs prompt-facing** | **`uiHints`** can drive **DOM-only** copy while the **same file** still enters **`promptContext`** — “display-only” is **not** a global guarantee without a **channel** story. |
| **Registration vs archaeology** | **`sprint-13-pragmatic-domain-pack-portability-target.md`**: **acceptable** explicit registration; **unacceptable** maintainer **archaeology** across UI, prompts, persistence, and orchestration. |
| **Why “zero core changes” is not the right target** | The **pragmatic target** reframes success as **disciplined, minimal registration** plus **pack-owned specifics**, because the **current** system **already** splits ownership across manifest, WGC, **`app.js`**, and persisted workflow shapes. |

---

## 7. Strategic direction vocabulary (descriptive, not roadmap)

The Sprint 13 artefact set supports a **shared vocabulary** for talking about future work — **not** a sequenced plan:

- **Scattered coupling** is the pattern Sprint 13 audits flag as high-risk; the **contrasting posture** is **fewer undocumented cross-links** between UI, loaders, prompts, persistence, and orchestration.
- **Explicit integration points** are the **contrasting posture** to **maintainer archaeology** (**`sprint-13-pragmatic-domain-pack-portability-target.md`**): anything that must live in core for a new domain should be **nameable** in advance for reviewers.
- **Pack-owned domain specifics** remain the **preferred locus** for prose, patterns, brief config, and catalogue content **where the architecture already routes those concerns through manifest-listed files**.
- **Semantic portability** (orchestration neutrality, prompt-contract stability, persistence evolution) is **treated as its own concern** in the audits — **distinct** from “add markdown to `domains/`,” so expectations stay **honest**.

This section names **contrasts** and **loci**; it does **not** schedule work or prescribe technical approaches.

---

## 8. Explicit non-goals and deferred areas

- **Non-goals for this synthesis:** Implementation specs, schema redesign proposals, roadmap dates, portability **completion** claims, domain-pack edits, prompt rewrites, persistence/import/export code changes.
- **Deferred (see closure and index):** **S13-02**, **S13-03** as **implementation**; broad **`app.js`** refactors; multi-domain brief merge; **`getGeneralFallbackBriefConfig`** relocation; cache / manifest lifecycle work; **starting-artefact** policy choices — unless **separately** chartered.

---

## 9. Sprint 12 relationship and non-reopen status

**Sprint 12** first-pass structural observability remains **closed** per **`sprint-13-index.md`** and **`sprint-13-first-pass-closure.md`**. This synthesis **does not** reopen Sprint 12 scope or obligations.

---

## 10. No portability completion claim

**Full drop-in domain-pack portability** is **not** claimed as achieved or scheduled here. Sprint 13 remains **partial** documentation plus **one** narrow **`app.js`** control tidy, augmented by **read-only** audits and **framing** notes.

---

## Source artefacts (cross-reference)

| Topic | File |
|-------|------|
| First-pass closure | [`sprint-13-first-pass-closure.md`](sprint-13-first-pass-closure.md) |
| Boundary summary | [`sprint-13-portability-boundary-summary.md`](sprint-13-portability-boundary-summary.md) |
| Pragmatic target | [`sprint-13-pragmatic-domain-pack-portability-target.md`](sprint-13-pragmatic-domain-pack-portability-target.md) |
| Prompt / config tracing | [`sprint-13-prompt-config-portability-tracing-audit.md`](sprint-13-prompt-config-portability-tracing-audit.md) |
| Persistence / export | [`sprint-13-persistence-export-portability-audit.md`](sprint-13-persistence-export-portability-audit.md) |
| Workflow semantics / orchestration | [`sprint-13-workflow-semantics-orchestration-portability-audit.md`](sprint-13-workflow-semantics-orchestration-portability-audit.md) |

---

## Review log

- **2026-05-13** — Portability strategy synthesis note added (`sprint-13-portability-strategy-synthesis.md`).
