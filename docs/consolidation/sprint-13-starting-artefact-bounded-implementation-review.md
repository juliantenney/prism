# Sprint 13 — starting artefact / LD starting-point bounded implementation review

**Date:** 2026-05-13  
**Path:** `docs/consolidation/sprint-13-starting-artefact-bounded-implementation-review.md`

**Role:** Identify whether a **strict-parity** cleanup slice exists for **starting artefact / starting-point** handling that **reduces scattered coupling** **without** changing behaviour — per **`sprint-13-starting-artefact-ld-starting-point-portability-audit.md`**, **`sprint-13-starting-artefact-portability-decision-framing.md`**, and **`sprint-13-portability-strategy-synthesis.md`**.

**Documentation only:** **No** code, domain-pack, prompt, persistence, import/export, orchestration, or Sprint 12 edits accompany this review.

**No full portability claim.**

---

## 1. Candidate strict-parity implementation surface

| Tier | Surface | Rationale |
|------|---------|-----------|
| **A — In-function literal dedup (lowest risk)** | **`renderWorkflowFactoryStartingArtefactOptions`** (`app.js` ~2810–2986) only: a **single** shared **`var`** (or `const` equivalent in ES5 style) for the repeated **`"Select starting point…"`** placeholder label used in **`renderInputStrategyOptions`**, **`renderLearningDesignStartingPointOptions`**, and **`renderOptions`** (~2831, ~2893, ~2921). | **String identity** change only if the variable holds the **exact** same Unicode string; **no** branch / filter / **`value`** changes. |
| **B — Hoist read-only tables (medium governance)** | Move **`STARTING_ARTEFACT_ALLOWLIST`** (~2845–2865) and/or the **LD trio** array (~2885–2889) to **module-scope** immutable constants (or a **frozen** object pattern), still consumed by the **same** inner helpers with **identical** lookup keys and array order. | Reduces **reallocation** and centralises literals; **must not** mutate at runtime; **must** preserve key spelling (**`"learning-design"`**, **`"general"`**). |
| **C — Extract nested pure helpers (higher evidence burden)** | Lift **`getVisibleDomainId`**, **`getAllowSetForDomain`**, **`normalizeChoiceRow`** to **outer `app.js` scope** as named functions taking **`(selectedDomains, …)`** / **`(allowlist, domainId)`** parameters. | **Risk:** accidental **`this`** / closure / parameter wiring changes; framing note states **S13-01-class parity is not yet evidenced** for this surface. |
| **Out of scope for “strict parity cleanup” label** | Changing **which** branch runs when (**LD short-circuit** vs **`renderFromBriefConfig`** vs **`getDomainArtefactOptions`**), **`research`** allowlist row, **`input_strategy`** contract, or **`updateWorkflowFactoryInputsCopyFromStartingPoint`**. | These are **semantic** or **cross-surface**; not **strict-parity** tidy without a charter. |

---

## 2. Exact functions / constants eligible

| Symbol | Location (`app.js`) | Eligibility for strict-parity tidy |
|--------|---------------------|-----------------------------------|
| **`renderWorkflowFactoryStartingArtefactOptions`** | ~2810–2986 | **Primary** envelope; inner functions listed below. |
| **`normalizeChoiceRow`** | nested ~2813–2822 | Eligible for **extract** only with parity proof (same return shape for all inputs). |
| **`renderInputStrategyOptions`** | nested ~2824–2843 | Eligible for **placeholder literal dedup** only (Tier A) without touching **`choices`** handling. |
| **`STARTING_ARTEFACT_ALLOWLIST`** | nested ~2845–2865 | Eligible for **hoist** (Tier B) if immutability contract is explicit. |
| **`getVisibleDomainId`** | nested ~2867–2872 | Tier C — **needs matrix-backed proof** before extract. |
| **`getAllowSetForDomain`** | nested ~2874–2882 | Tier C — depends on allowlist identity. |
| **`renderLearningDesignStartingPointOptions`** | nested ~2884–2905 | Tier A (placeholder dedup) or Tier B (hoist trio array); **not** change ids/labels/order without charter. |
| **`renderOptions`** | nested ~2907–2934 | Tier A placeholder dedup; filter logic **frozen** unless matrix exists. |
| **`renderFromBriefConfig`** | nested ~2936–2961 | **Orchestrates** WGC calls; **not** a safe “cleanup” target without behaviour charter. |
| **`.then` orchestration** | ~2963–2985 | **Not** eligible under strict-parity cleanup without full branch matrix. |
| **`getDomainArtefactOptions`** | **`workflowGenerationContext.js`** | **Out of scope** for this bounded **`app.js`** review slice. |

---

## 3. Current behaviour that must remain unchanged

| Behaviour | Summary |
|-----------|---------|
| **LD short-circuit and final DOM** | After **`renderFromBriefConfig()`** resolves, the outer **`.then`** checks **`getVisibleDomainId()`**. If it is **`"learning-design"`**, **`renderLearningDesignStartingPointOptions()`** runs and **returns** before **`getDomainArtefactOptions`** or the **`usedBriefConfigOptions`** early return. Brief-driven **`input_strategy`** may have populated the `<select>` earlier in the promise chain; the LD branch **must** still **replace** that DOM so the **final** options are the **hardcoded trio** (plus placeholder) in the **same order** and with the **same `value` strings**. |
| **Non-LD branch order** | When visible domain is **not** LD: if **`usedBriefConfigOptions`** is truthy, **return** without **`getDomainArtefactOptions`**; otherwise load artefacts and **`renderOptions`**. |
| **General / LD-key vs research filter** | **`getAllowSetForDomain`** returns a **Set** for **`general`** / **`learning-design`** allowlist keys (membership filter in **`renderOptions`**) and **`null`** for **`research`** (filter by **`item.domainId === visibleDomainId`** only). |
| **Option `value` sets** | Exact **trio** ids; allowlist-filtered artefact **`value`** strings; **`input_strategy`** **`value`** strings from pack when that path wins — all **frozen** under strict parity. |
| **`current` selection preservation** | **`querySelector` + restore `value`** after each render path (same line ranges as audit: ~2839–2842, ~2901–2904, ~2930–2933). |
| **`updateWorkflowFactoryInputsCopyFromStartingPoint`** | Still invoked at the end of each render path from this function; this review does **not** author edits to that helper (user constraints). |

---

## 4. Behaviours that are semantic and must not change

| Semantic | Why |
|----------|-----|
| **`startingArtefact` values** (`generate_from_topic`, allowlist ids, etc.) | Flow to **`buildWorkflowDesignBrief`**, **`applyWorkflowDesignHeuristics`**, persistence — **value** semantics. |
| **Branch priority** | LD visible → **trio** wins over brief-driven **`input_strategy`** DOM that may have rendered earlier in the async chain. |
| **Allowlist null vs non-null** | **`research`** path behaviour vs **`general`** / **`learning-design`** filtered path. |
| **Filter predicate** in **`renderOptions`** | **`itemDomain`**, **`allowSet`** membership — any off-by-one changes **visible values**. |

---

## 5. Whether any helper extraction is parity-safe

| Extraction | Parity-safe? |
|------------|----------------|
| **Single shared constant for `"Select starting point…"`** inside **`renderWorkflowFactoryStartingArtefactOptions`** | **Yes**, if character-for-character identical and used in all three branches. |
| **Hoist `STARTING_ARTEFACT_ALLOWLIST` / LD trio to module scope** | **Conditionally yes** — only with **immutable** contract and **no** runtime mutation; requires **diff review** that keys and array order are unchanged. |
| **Extract `getVisibleDomainId` / `getAllowSetForDomain` to outer functions** | **Not proven parity-safe** without the **per-domain matrix** and DOM snapshots required in the audit (§7) and framing note (§6). |

---

## 6. Risks / ambiguities

| Risk | Detail |
|------|--------|
| **Async supersession** | Brief **`input_strategy`** may render options **before** LD branch **replaces** DOM — parity tests must observe **final** DOM, not intermediate microtasks, for LD. |
| **Module-scope mutation** | Hoisted allowlist object could be **accidentally mutated** elsewhere in future edits — prefer **`Object.freeze`** pattern or document **read-only**. |
| **“Cleanup” disguising semantic change** | Reordering **`learningDesignOptions`**, trimming allowlist ids, or “aligning” **`research`** to have an allowlist row **changes semantics**. |
| **Cross-surface** | **`updateWorkflowFactoryInputsCopyFromStartingPoint`** is **out of scope** for this review’s implementation slice but **coupled** to starting `<select>` — regression must be named if starting render ever changes timing. |

---

## 7. Verification matrix (required before any strict-parity code)

Code-derived parity rows (orchestration, `update` ordering, allowlist vs brief path) are expanded in [`sprint-13-starting-artefact-starting-point-code-derived-parity-matrix.md`](sprint-13-starting-artefact-starting-point-code-derived-parity-matrix.md).

| Row | Scenario | Observe |
|-----|----------|---------|
| A | **`["general"]`** only | Final `<option>` **values** (set) and order after allowlist filter; **`getDomainArtefactOptions`** or brief path per audit. |
| B | **`["general","learning-design"]`** | **Final** DOM is **LD trio**; **`value`** set exactly `{ "", generate_from_topic, provided_source_content, mixed }` in order. |
| C | **`["general","research"]`** | **`allowSet` null** path; domainId filter only; compare to baseline snapshot. |
| D | LD + pack **`input_strategy.choices` non-empty** | Confirm **final** state still **trio** (supersedes brief render). |
| E | WGC **`getDomainArtefactOptions` missing / rejects** | **`renderOptions([])`** empty path; placeholder only. |
| F | **`node --test`** + any existing starting-artefact / workflow tests | **Green** after change. |

---

## 8. Stop conditions

- Any edit that **adds** **`research`** allowlist rows, **removes** LD short-circuit, or **merges** branches **without** matrix sign-off — **stop**.
- Any edit touching **`workflowGenerationContext.js`**, domain packs, **`briefLines`**, persistence, or **`updateWorkflowFactoryInputsCopyFromStartingPoint`** under this label — **stop**.
- **Sprint 12** — **do not** reopen.

---

## 9. Recommendation: proceed, defer, or needs more evidence

| Verdict | Guidance |
|---------|----------|
| **Default: `defer`** | Decision framing §3: this surface is **not** parity-evidenced like **S13-01**; **branching semantics** and **`startingArtefact` values** dominate. |
| **`needs more evidence`** | **Before** any Tier B/C work: complete **§7 matrix** (and saved-workflow **`startingArtefact`** inventory per audit §7). |
| **`proceed` (optional micro-slice only)** | **Tier A** only: dedupe **placeholder** literal **inside** **`renderWorkflowFactoryStartingArtefactOptions`** with **zero** other edits — still requires **post-diff** matrix row spot-check for **B/D** if reviewers want zero regression culture. |

**Summary recommendation:** **Defer** structural “strict-parity” refactors; treat **Tier A** placeholder dedup as the **only** candidate that approximates S13-01-style safety **without** pre-built matrices — and even then, record **§7 row E** in a mini checklist. **No** claim that starting-point portability is improved beyond documentation.

---

## Related artefacts

| Document | Role |
|----------|------|
| [`sprint-13-starting-artefact-ld-starting-point-portability-audit.md`](sprint-13-starting-artefact-ld-starting-point-portability-audit.md) | Inventory and risks |
| [`sprint-13-starting-artefact-portability-decision-framing.md`](sprint-13-starting-artefact-portability-decision-framing.md) | Why S13-01 bar is not met |
| [`sprint-13-portability-strategy-synthesis.md`](sprint-13-portability-strategy-synthesis.md) | Parity vs semantic posture |

---

## Review log

- **2026-05-13** — Starting artefact / LD starting-point bounded implementation review drafted (`sprint-13-starting-artefact-bounded-implementation-review.md`).
