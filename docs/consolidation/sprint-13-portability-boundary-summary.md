# Sprint 13 — portability boundary summary

**Date:** 2026-05-13  
**Path:** `docs/consolidation/sprint-13-portability-boundary-summary.md`

**Purpose:** Summarise **known** portability **boundaries** and **coupling categories** surfaced during Sprint 13 consolidation (first pass, audits, and decision notes). This note is **descriptive** only.

**Documentation only:** **No** production code, domain-pack, prompt, persistence, import/export, or orchestration changes were made to author this file.

**Non-goals for this document:** **No** implementation recommendations, **no** architecture redesign proposals, **no** scope expansion beyond what Sprint 13 artefacts already record.

---

## 1. What “domain-pack portability” currently means in PRISM

In Sprint 13 consolidation terms, **domain-pack portability** is treated as **incremental clarity** for **v1**: understanding how **manifest-listed** markdown under `domains/` (plus platform docs referenced from the manifest) interacts with **selection**, **normalisation**, **Factory UI**, **workflow brief configuration**, **prompt assembly**, and **saved workflow** shapes.

It **does not** mean that a third party can drop in an arbitrary pack with **no** coordination on manifest shape, markdown conventions, `app.js` copy, system prompts, or persisted workflow compatibility. That stronger reading is explicitly **not** claimed (§10).

---

## 2. Achieved first-pass portability improvements

Per **`sprint-13-first-pass-closure.md`**:

- **S13-07 (documentation):** v1 reference for General, `alwaysOnDomains`, `normalizeSelectedDomains`, first structured domain behaviour for `getWorkflowBriefConfig`, Factory domain selector context, and manifest vs embedded fallback — **`sprint-13-general-alwayson-first-structured-domain-behaviour.md`** (**updated 2026-05-14** for **General baseline-only** Factory: runnable **Learning Design** / **Research**; general-only brief path).
- **S13-01 (narrow code):** Parity-preserving centralisation for Workflow Factory **`#wfDesignDomainSelect`** only (`app.js` — fallback domain rows + Factory `<select>` wiring). **Historical:** first-pass parity notes assumed an explicit **General** `<option>` (**superseded** for ordered options — see S13-07 **Historical note**).

**Read-only** audits and decision framing for other topics were added **without** counting them as delivered portability **implementation**.

---

## 3. Separation of portability categories

These categories **overlap** in places; Sprint 13 treats them as **distinct lenses** for reasoning, not as mutually exclusive layers.

| Category | Meaning in Sprint 13 material |
|----------|-------------------------------|
| **UI parity** | Observable Factory / control behaviour matches documented matrices and baselines after a bounded change (e.g. S13-01 evidence notes). Distinct from “portable pack semantics.” |
| **Display-only hints** | Narrow sense: parsed **`uiHints`** driving DOM helper copy. **S13-03** documents that this is **not** sufficient to claim hints never appear in model channels when the same markdown is also loaded into `promptContext` — see **`sprint-13-prompt-config-portability-tracing-audit.md`**. |
| **Selection / default semantics** | Which domain ids are selected, always-on injection, first structured domain for brief config — **S13-02** is **decision-gated**; first pass did **not** change default policy. |
| **Starting artefacts** | Coupling between starting artefact choice, domain packs, and Factory behaviour — **read-only** audit + decision framing only; **not** first-pass delivery — **`sprint-13-starting-artefact-ld-starting-point-portability-audit.md`**, **`sprint-13-starting-artefact-portability-decision-framing.md`**. |
| **Workflow semantics** | `workflowBriefConfig` factors, mappings, elicitation, resolved objects (`workflowBriefResolution`, etc.): drives **authoring** and **saved** workflow shape; distinct from raw markdown text. |
| **Prompt / config / model-facing content** | Concatenated **`promptContext`**, system prompt constants, `briefLines` assembly, refinement context — traced in **`sprint-13-prompt-config-portability-tracing-audit.md`**. |
| **Persistence / export** | Saved workflows and bundles carry **ids and resolution payloads**, not full pack text; compatibility with live packs is a **separate** boundary from “files load correctly.” |

---

## 4. Which areas are currently parity-safe, decision-gated, or architecture-coupled

| Posture | Areas (as represented in Sprint 13 docs) |
|---------|------------------------------------------|
| **Parity-safe (when strictly bounded)** | Single-control, semantics-preserving tidies with evidence matrices and runtime baselines (the **S13-01** pattern: `#wfDesignDomainSelect` only, `app.js` only, explicit exclusions). |
| **Decision-gated** | **S13-02** (default domain semantics / policy), **S13-03** (hint neutralisation scope and proof obligations), starting-artefact / LD starting-point **policy** choices — framing and gate notes exist; **no** closure as delivered implementation. |
| **Architecture-coupled** | Splitting “UI-only” vs “model-only” markdown, changing how manifests and loaders partition files, multi-domain brief merge, broad `app.js` surface refactors, persistence/import/export shape changes, cache/manifest lifecycle — these touch **many** contracts at once; Sprint 13 artefacts label such moves **unsafe** or **non-first-pass** without a separate charter. |

---

## 5. Relationship between manifest, markdown, WGC, and `app.js`

| Layer | Role (summary) |
|-------|----------------|
| **Manifest** (`domains/domain-manifest.json`) | Declares `platformFiles`, `alwaysOnDomains`, per-domain `label` and `files[]`. Entry point for which markdown paths exist for a domain. |
| **Markdown** | Authoritative **content** for prose and embedded JSON blocks (`workflowBriefConfig`, patterns, policies, catalogues). |
| **WGC** (`workflowGenerationContext.js`) | Loads and normalises manifest (including embedded fallback merge), resolves selected domains, reads files, builds **`promptContext`** and parsers (`extractWorkflowBriefConfigFromText`, policy/pattern helpers). |
| **`app.js`** | Factory UI, `briefLines` prefixes, workflow design and refinement orchestration, system prompt constant, persistence/export glue — **not** replaced by the manifest for those concerns. |

Sprint 13 stresses that **ownership is split**: no single layer is “the pack” in isolation.

---

## 6. Why “drop-in portability” is not yet achieved

Consolidation records **multiple** blockers **in the aggregate**, including but not limited to:

- **Full markdown permeability** into `promptContext` when domains are selected — display hints and model-visible text are not cleanly partitioned by file slice alone.
- **`briefLines` prefixes** fixed in `app.js` vs pack **`uiHints`** keying — documented split-brain risk (see Sprint 10 contract audit references in related notes; Sprint 13 prompt tracing audit restates the channel issue).
- **First structured domain** rule for `getWorkflowBriefConfig` — no multi-domain merge of brief config in current WGC behaviour.
- **`normalizeManifest` fallback merge** — shipped manifest and embedded fallback can diverge if not maintained together.
- **Persisted workflows** reference semantic ids and resolutions — **replay** after pack edits depends on compatibility/versioning posture not asserted as solved.
- **Refinement vs design** loaders use **different** path filters — parity of “what the model saw” across modes is not automatic.

Together, these mean **drop-in** replacement of packs without coordinated changes elsewhere is **not** established.

---

## 7. Which future work would likely require: schema / orchestration / prompt-contract / migration handling

This section names **classes of change** that Sprint 13 artefacts associate with **deep** coupling — **not** as a roadmap. Any such work would need its **own** charter and evidence plan.

| Class of change | Typical trigger domains (from deferred lists and audits) |
|-----------------|------------------------------------------------------------|
| **Schema changes** | Domain-pack or manifest JSON shape, `workflowBriefConfig` structure, export bundle fields, explicit manifest fields for templates or channels. |
| **Orchestration changes** | Loader ordering, multi-domain merge rules, refinement vs design file-set alignment, session/step flows that change **when** context is built. |
| **Prompt-contract changes** | System prompts, `briefLines` assembly, compact directives, or any **guaranteed** model input shape tied to authoring UX. |
| **Migration handling** | Persisted `workflowBriefResolution`, `workflowOutputSpec`, step ids / `domain_version`, import/export paths when on-disk or API contracts move. |

---

## 8. Sprint 12 relationship and non-reopen status

**Sprint 12** first-pass structural observability (**A–E**) remains **closed** per **`sprint-13-first-pass-closure.md`** and **`sprint-13-index.md`**. Sprint 13 consolidation **references** that boundary; it **does not** reopen Sprint 12 obligations or modify Sprint 12 closure artefacts.

---

## 9. Explicit non-goals and deferred areas

**Non-goals for Sprint 13 first pass (already recorded):** Full drop-in portability; semantic prompt migration; broad `app.js` refactor; persistence/import/export migration; domain-pack schema redesign; cache / `manifestPromise` / `textCache` work — unless **separately** chartered.

**Deferred (headline list aligned with closure):** **S13-02**, **S13-03** (implementation); `briefLines` / extraction; multi-domain brief merge; `getGeneralFallbackBriefConfig` relocation; starting-artefact / title-injection refactors; parity matrices for channels beyond S13-01’s control.

---

## 10. No portability completion claim

**Full drop-in domain-pack portability** is **not** claimed as complete, in progress, or scheduled by this summary. Sprint 13 posture remains **partial** documentation plus one **narrow** `app.js` tidy, plus **read-only** audits and **decision** notes for gated topics.

---

## Related artefacts

| Topic | File |
|-------|------|
| First-pass closure | `sprint-13-first-pass-closure.md` |
| Index | `sprint-13-index.md` |
| Prompt/config tracing | `sprint-13-prompt-config-portability-tracing-audit.md` |
| General / always-on / first structured | `sprint-13-general-alwayson-first-structured-domain-behaviour.md` |
| S13-02 / S13-03 / starting artefact rows | `sprint-13-index.md` §3 |

---

## Review log

- **2026-05-13** — Portability boundary summary added (`sprint-13-portability-boundary-summary.md`).
