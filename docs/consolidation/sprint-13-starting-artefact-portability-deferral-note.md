# Sprint 13 — starting artefact / starting-point portability (closure / deferral)

**Date:** 2026-05-13  
**Path:** `docs/consolidation/sprint-13-starting-artefact-portability-deferral-note.md`

**Role:** Close the **Sprint 13 first-pass documentation arc** for Workflow Factory **starting artefact / starting-point** portability as **deferred implementation** — consolidating findings from the audit, decision framing, bounded implementation review, code-derived parity matrix, and runtime baseline. **This note does not approve future work** and **does not** change product behaviour.

**Documentation only:** **No** code, domain-pack, prompt, persistence, import/export, or orchestration edits accompany this closure note.

**Sources (read in combination):**

| Artefact | Role |
|----------|------|
| [`sprint-13-starting-artefact-ld-starting-point-portability-audit.md`](sprint-13-starting-artefact-ld-starting-point-portability-audit.md) | Inventory, risks, split ownership |
| [`sprint-13-starting-artefact-portability-decision-framing.md`](sprint-13-starting-artefact-portability-decision-framing.md) | Why this is not S13-01-class parity-safe; candidate models |
| [`sprint-13-starting-artefact-bounded-implementation-review.md`](sprint-13-starting-artefact-bounded-implementation-review.md) | Tier A/B/C surface, stop conditions, default recommendation |
| [`sprint-13-starting-artefact-starting-point-code-derived-parity-matrix.md`](sprint-13-starting-artefact-starting-point-code-derived-parity-matrix.md) | Branch order, allowlist, LD trio, async / parent-`update` risks |
| [`sprint-13-starting-artefact-runtime-parity-baseline.md`](sprint-13-starting-artefact-runtime-parity-baseline.md) | Live browser validation vs matrix (partial) |

---

## 1. Summary of what was learned

1. **Split pipelines:** **`renderWorkflowFactoryStartingArtefactOptions`** (`app.js`) combines **`STARTING_ARTEFACT_ALLOWLIST`** filtering ( **`general`** / **`learning-design`** keys only), a **Learning Design short-circuit** to a **hardcoded trio** of **`startingArtefact`** values, **`getWorkflowBriefConfig`** / **`input_strategy.choices`** (pack), and **`getDomainArtefactOptions`** (WGC + pack markdown). **Research** uses **`getAllowSetForDomain` → `null`**, so **no** id-level allowlist filter on the catalogue path — behaviour **differs** from **general** / **learning-design** catalogue filtering (audit, decision framing).

2. **Semantic weight:** Option **`value`** strings flow into **`buildWorkflowDesignBrief`**, **`applyWorkflowDesignHeuristics`**, and saved workflow surfaces — not a display-only concern (audit §3, bounded review §4).

3. **Async supersession:** LD and domain switches can show **stale** `<select>` contents and **stale** selected values **before** the final render settles; the **code-derived matrix** and **runtime baseline** both document **final-state** parity as the contract, with **intermediate** states observable in the browser (runtime baseline §2–3, code-derived matrix §1.3 / §4).

4. **Bounded strict-parity slice:** Only **Tier A** (in-function deduplication of the **`Select starting point…`** literal) approximates S13-01-style mechanical safety; **Tier B/C** require stronger evidence (bounded review §5, §9).

5. **Runtime vs code:** Final **General** catalogue-shaped options, **LD trio**, **Research** artefact list, **invalid cross-domain reset** (`summary` → LD clears selection), and **visible** **`updateWorkflowFactoryInputsCopyFromStartingPoint`** effects were **partially** validated on **`localhost`**; several matrix branches remain **unevidenced** in the browser (runtime baseline §3, §4).

---

## 2. Why Tier A is possible but too small to matter

**Tier A** — a single shared literal for **`"Select starting point…"`** inside **`renderWorkflowFactoryStartingArtefactOptions`** only — is **mechanically low risk** if the string remains **bit-identical** (bounded review §1, §5).

It is **too small to matter** for the **stated portability goal** because:

- It **does not** reduce the **architectural** split between **`app.js`**, **WGC**, and **packs**, or the **LD special-case**.
- It **does not** address **allowlist drift**, **research** gap, or **`startingArtefact`** **value** semantics.
- It **still** consumes review and regression attention for **negligible** coupling reduction — so it is **not** prioritised as Sprint 13 **delivery** work under this deferral.

---

## 3. Why Tier B/C are not implementation-ready

| Tier | Why not implementation-ready now |
|------|-----------------------------------|
| **B — Hoist allowlist / LD trio** | Requires **immutable** module-scope contract and proof that **no** mutation or import-order regressions occur; **runtime baseline** does not exhaust **per-pack** option inventories or **WGC failure** (bounded review §5–6; runtime baseline §4). |
| **C — Extract nested helpers** | **Promise orchestration**, **`getVisibleDomainId`**, **`getAllowSetForDomain`**, and **closure wiring** are easy to disturb; **S13-01-class parity** is **not** evidenced for this surface (decision framing §3; code-derived matrix §5–6). |

**Net:** Tier **B/C** remain **documentation- and evidence-gated**, not **implementation-ready**.

---

## 4. Specific evidence gaps

The following gaps block treating this surface as **closed for safe refactor** beyond Tier A, even after the **code-derived matrix** and **runtime baseline**:

| Gap | Detail |
|-----|--------|
| **Valid restore behaviour** | **No** controlled runtime reproduction where **`current`** is **non-empty** and **still** appears in the **new** option list after a **second** render pass **without** inference from cross-domain round-trips (runtime baseline §4 “Restore valid”). |
| **General 1 (a) vs 1 (b)** | **`input_strategy`**-driven **`renderInputStrategyOptions`** path (**1 (a)**) was **not** isolated from **`getDomainArtefactOptions`** + allowlist path (**1 (b)**) in the browser; observed General steady state matched **catalogue-shaped** output (runtime baseline §1; code-derived matrix row **1**). |
| **WGC failure path** | **`getDomainArtefactOptions`** missing / rejecting → **`renderOptions([])`** is **code-derived** but **not** reproduced live (would require disallowed environment sabotage or a chartered test harness) (code-derived matrix row **5**; bounded review §7 row **E**). |
| **Research attribute-level option values** | Accessibility snapshot **did not** fully echo **`value`** for every **Research** option (e.g. first **Description** row); **attribute-level** enumeration **not** completed (runtime baseline §3). |
| **Async / supersession timing** | **Intermediate** “wrong options + wrong selection” observed on domain change; **frame-accurate** alignment to **`getWorkflowBriefConfig`** microtasks vs **outer `.then`** **not** instrumented; parent **`renderWorkflowFactoryDomainUiConfig`** may call **`updateWorkflowFactoryInputsCopyFromStartingPoint`** before async child completes (code-derived matrix §1.3; runtime baseline §2). |

---

## 5. Decision

| Decision | Statement |
|----------|-----------|
| **Defer** | **Starting artefact / starting-point implementation work** (Tier **B/C**, and Tier **A** as optional micro-slice) is **deferred** until the evidence in **§7** exists and a **separate** charter is approved. |
| **Architecture / semantic portability** | The topic remains a **documented architecture and semantic portability concern**: **dual ownership** (**`app.js`** allowlist + LD trio vs **pack** brief + artefact catalogues vs **WGC**), **branch-sensitive** **`startingArtefact`** values, and **downstream** brief / heuristic coupling — per audit and decision framing. |

**This deferral is not a “won’t fix”** — it is a **gated pause** on **implementation** until evidence and charter catch up.

---

## 6. Stop conditions for any future attempt

Future work under a **new** charter must **halt** when:

- **`briefLines`**, extraction, **prompt bodies**, persistence, import/export, or **orchestration** would change **without** explicit in-scope approval (decision framing §7; bounded review §8).
- **`startingArtefact`** **values** or **normalisation** change **without** saved-workflow / export **evidence** and migration posture (decision framing §7).
- **Learning Design** trio branch is removed or merged **without** a **documented** replacement for **trio semantics** (decision framing §7; audit §6).
- **`research`** allowlist semantics are added or **branch order** is changed **without** a signed **per-domain parity matrix** (bounded review §8).
- **Sprint 12** scope would be **reopened** (see **§8** below).

---

## 7. Required evidence before reopening implementation

Minimum bar to **reopen** Tier **A** (if pursued) or **B/C** (structural) work — drawn from decision framing §6, audit §7, bounded review §7, code-derived matrix, and runtime gaps:

1. **Per-domain / per-branch matrix** with **frozen** expected **`value`** sets and order for **`["general"]`**, **`["general","learning-design"]`**, **`["general","research"]`**, **WGC missing**, **`input_strategy`** present vs absent — with **runtime** rows for any pack-dependent lists.
2. **Valid restore** scenarios evidenced (same-domain or controlled re-render) with **DOM + `value`** snapshots **after** async settle.
3. **Research** full **`value` / `label`** table from DOM or automated test (no a11y truncation).
4. **WGC failure** path covered by **chartered** test or staging procedure (not ad-hoc production breakage).
5. **Async / supersession** expectations documented if **intermediate** UI is product-relevant (tests may assert **final** state only).
6. **Inventory** of representative **saved** **`startingArtefact`** values (audit §7).
7. **Trace** each **`startingArtefact`** value through **`buildWorkflowDesignBrief`** and **`applyWorkflowDesignHeuristics`** (and other consumers named in charter prep) — decision framing §6.
8. **Written charter** with **in/out** scope, **rollback**, and **pack vs `app.js`** governance for any move of allowlists or LD trio.

---

## 8. Sprint 12 remains closed

**Sprint 12** first-pass structural observability and closure artefacts are **not** reopened, amended, or superseded by this note. Any future starting-artefact work must **respect** Sprint 12 boundaries referenced from **`sprint-13-index.md`** and **`sprint-13-first-pass-closure.md`**.

---

## 9. No portability completion claim

This closure / deferral note **does not** assert that **domain-pack portability**, **starting-point portability**, or **end-to-end** workflow portability is **achieved**, **scheduled**, or **risk-free**. It records **documentation progress** and an explicit **implementation deferral**.

---

## Related artefacts

| Document | Role |
|----------|------|
| [`sprint-13-starting-artefact-ld-starting-point-portability-audit.md`](sprint-13-starting-artefact-ld-starting-point-portability-audit.md) | Coupling inventory |
| [`sprint-13-starting-artefact-portability-decision-framing.md`](sprint-13-starting-artefact-portability-decision-framing.md) | Decision space |
| [`sprint-13-starting-artefact-bounded-implementation-review.md`](sprint-13-starting-artefact-bounded-implementation-review.md) | Tier A/B/C analysis |
| [`sprint-13-starting-artefact-starting-point-code-derived-parity-matrix.md`](sprint-13-starting-artefact-starting-point-code-derived-parity-matrix.md) | Code-derived contract |
| [`sprint-13-starting-artefact-runtime-parity-baseline.md`](sprint-13-starting-artefact-runtime-parity-baseline.md) | Partial runtime validation |
| [`sprint-13-index.md`](sprint-13-index.md) | Consolidation index |

---

## Review log

- **2026-05-13** — Starting artefact / starting-point portability deferral / closure note drafted (`sprint-13-starting-artefact-portability-deferral-note.md`).
