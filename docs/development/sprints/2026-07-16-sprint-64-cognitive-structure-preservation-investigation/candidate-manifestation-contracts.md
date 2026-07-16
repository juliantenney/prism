# Candidate Manifestation Contracts

**Sprint:** 64 — Task 3 (S64-BL-003)  
**Type:** Architecture investigation (contract comparison only)  
**Date:** 2026-07-16  
**Status:** Complete  

**Authority:** Outcome B (path-gated correlation) · Sprint 63 Experiments 1–3 · mechanism/attachment maps.  
**No** production contract selected or implemented.

---

## 1. Objective

Identify the smallest safe manifestation contracts that can expose authored intermediate reasoning structure to diagnostic or learner-facing **experimental** consumers without inventing meaning or freezing a universal cognitive schema.

Core question:

> What is the smallest safe manifestation contract that can expose authored intermediate reasoning structure without inventing meaning or prematurely freezing a universal cognitive schema?

---

## 2. Preconditions and Path Gating

Tier 1 contracts exist **only** when all required preconditions pass. Otherwise Tier 1 is **absent** and Tier 2 remains available.

| Precondition | Required? | Failure Behaviour |
| ------------ | --------- | ----------------- |
| `required_materials[]` source contract present on eligible artefact / accessible upstream | **Yes** | Tier 1 absent; Tier 2 only |
| Source `material_id` present | **Yes** | Tier 1 absent; Tier 2 only |
| Realised `material_id` present | **Yes** | Tier 1 absent; Tier 2 only |
| IDs unique within activity scope | **Yes** | Tier 1 absent; diagnostic failure |
| Exact 1:1 source↔realised match | **Yes** | Tier 1 absent; diagnostic failure |
| `instructional_archetype` + `archetype_plan` present | **Yes** for Tier 1 plan exposure | Tier 1 absent; Tier 2 only |
| Plan validates (`validateMaterialArchetypePlan` / `PLAN_KEYS`) | **Yes** | Tier 1 absent; Tier 2 only |
| Path explicitly supported (not materials-only / unsupported partial without source) | **Yes** | Tier 1 absent; Tier 2 only |
| Experimental / diagnostic marker when not production | **Yes** for prototypes | Do not emit unmarked production contracts |

**Fail closed:** any failure ⇒ no Tier 1 contract object (not an empty stub that implies eligibility).

---

## 3. Consumer Needs

| Consumer | Needs Full Plan? | Needs Selected Fields? | Needs Provenance? | Needs Archetype Identity? |
| -------- | ---------------- | ---------------------- | ----------------- | ------------------------- |
| Trace / inspection tooling | Useful | Optional | **Yes** | Yes |
| Experiment builders (Exp 2/3 style) | Useful | **Yes** (high-value fields) | **Yes** | Yes (routing) |
| Validation scripts | Full for validate | — | **Yes** | Yes |
| Educational reviewers | Optional | **Yes** (verbatim structure) | Advisable | Optional (meta) |
| Preserve/normalize projection | No (bridge input) | If projecting | **Yes** | Yes |
| Experimental variant builder | No if fields supplied | **Yes** | **Yes** | Yes |
| Renderer grouping/labelling (Tier 2) | No | No | No | No |
| Renderer Tier 1 sequence/relationship exposure | No if fields projected | **Yes** verbatim | **Yes** | Logic-only |

Evidence: Exp 1 gains from grouping/labelling without plans; Exp 2/3 T1 gains from verbatim plan fields; Outcome B path gates.

Consumers are **not** uniform — diagnostics prefer full fidelity + provenance; manifestation prefers selected authored values.

---

## 4. Candidate Contract Families

### Contract A — Opaque Source Contract

Expose correlated verbatim:

```text
instructional_archetype
archetype_plan
```

Consumer interprets archetype-specific shape.

| Property | Assessment |
| -------- | ---------- |
| Fidelity | Maximum |
| Projection risk | Low |
| Consumer coupling | High (must know `PLAN_KEYS` shapes) |
| Diagnostic usefulness | **Strong** |
| Generic renderer suitability | Limited |

### Contract B — Verbatim Field Envelope

Expose archetype identity + selected authored fields under original names (illustrative only — **not** a frozen universal set):

```json
{
  "instructional_archetype": "mechanism_explanation",
  "authored_structure": { "required_links": ["…"] }
}
```

```json
{
  "instructional_archetype": "process_walkthrough",
  "authored_structure": { "stages": ["…"] }
}
```

| Property | Assessment |
| -------- | ---------- |
| Semantic fidelity | High for selected keys |
| Archetype branching | **Necessary** (different keys) |
| Coupling | Medium |
| Usefulness | Strong for bounded T1 manifestation |

### Contract C — Generic Cognitive Projection

Map fields into generic concepts (`sequence`, `relationships`, `constraint`, …).

| Property | Assessment |
| -------- | ---------- |
| Evidence sufficiency | **Insufficient** — Sprint 63 showed shared *class* of intermediate structure, not a safe universal mapping |
| Interpretive risk | **High** (renaming/implication) |
| Schema pressure | Premature |

### Contract D — Manifestation Instructions

Emit UI directives (`render as ordered stages`, …).

| Property | Assessment |
| -------- | ---------- |
| Convenience | High |
| Semantic transform | **High** |
| Provenance | Weak unless paired with source |
| Reversibility / UI coupling | Poor |

### Contract E — Dual-Layer Contract

1. Verbatim authored structure (A or B)  
2. Optional diagnostic manifestation hints  

Authored layer remains authoritative.

| Property | Assessment |
| -------- | ---------- |
| Avoids coupling? | Partially — hints add optional coupling; authored layer preserves safety |
| Risk | Hint layer must not override verbatim values |

### Contract F — No Persistent Contract

One-time experimental projection in a bounded pre-manifestation step (Exp 2/3 `debug_instructional_contract` / HTML variants). No durable learner-facing store.

| Property | Assessment |
| -------- | ---------- |
| Reversibility | **Highest** |
| Diagnostic value | High |
| Repeatability | Medium (must re-run projection) |
| Bounded prototype fit | **Excellent** |

---

## 5. Provenance Requirements

| Contract | Source Provenance | Field Provenance | Correlation Provenance | Loss Risk |
| -------- | ----------------- | ---------------- | ---------------------- | --------- |
| **A** | Yes (`material_id`, activity) | Full plan keys | Yes (1:1 status) | Low if verbatim |
| **B** | Yes | Selected keys only — must record which | Yes | Medium if selection omits needed field |
| **C** | Weak unless linked | Mapped away from source names | Optional | **High** |
| **D** | Weak | Instructions ≠ fields | Optional | **High** |
| **E** | Yes (authored layer) | Yes + hint provenance | Yes | Low if hints non-authoritative |
| **F** | Yes in diagnostic payload | Yes for projected fields | Yes | Low if experiment-scoped |

**Traceability rule:** every learner-facing manifestation element must cite **one exact authored field**.  
Contracts **C** and **D** alone **cannot** reliably satisfy this → high semantic risk.

---

## 6. Archetype Coverage

| Contract | Mechanism (`required_links`) | Process (`stages`) | Mental model (`key_relationships`, `governing_constraint`) | Archetype-Specific Branching |
| -------- | ---------------------------- | ------------------ | ---------------------------------------------------------- | ---------------------------- |
| **A** | Full plan includes links | Full plan includes stages | Full plan includes relationships + constraint | Consumer branches |
| **B** | Envelope `{required_links}` | Envelope `{stages}` | Envelope `{key_relationships, governing_constraint}` | **Contract branches by archetype** |
| **C** | Forced into “sequence/relationships” | Same | Same | Hidden reinterpretation |
| **D** | “surface links” instruction | “ordered stages” | “show constraint” | UI vocabulary branches |
| **E** | A/B + optional hints | Same | Same | Same as A/B |
| **F** | As Exp 2 T1 | As Exp 3 process T1 | As Exp 3 mental T1 | In projector logic |

**`evaluation_judgement`:** A/E/F remain **extensible** (opaque full plan). B remains extensible if selection is evidence-led later (`criteria`, `evidence`, `tradeoffs`, …). C/D would over-claim universality. No new educational experiment run here.

---

## 7. Manifestation Capability Matrix

Legend: **D** directly supported · **C** conditionally · **U** unsupported · **R** high-risk

| Capability | A | B | C | D | E | F | Evidence |
| ---------- | - | - | - | - | - | - | -------- |
| Cognitive orientation | C | C | R | C | C | C | Preamble/task still Tier 2; plan aids |
| Phase grouping | U* | U* | R | C | C | C | Exp 1 grouping is Tier 2 |
| Sequence visibility | D | D | R | C | D | D | Exp 2/3 stages/links lists |
| Relationship visibility | D | D | R | C | D | D | Mental-model relationships; links |
| Dependency visibility | C | C | R | R | C | C | Ordered stages / chain — structural only |
| Constraint visibility | D | D | R | C | D | D | `governing_constraint` Exp 3 |
| Information sufficiency | D | D | R | C | D | D | Exp 2/3 T1 vs T2 |
| Self-explanation support | D | D | R | R | D | D | Plan-quoted checks Exp 2/3 |
| Output framing | C | C | U | C | C | C | Mostly `expected_output` Tier 2 |
| Transfer prompts | U | U | U | U | U | U | Not in these plan keys |

\*A/B supply data; grouping remains consumer/Tier 2 logic unless hints (E) added.

---

## 8. Transformation Analysis

```text
source plan → correlation → contract construction → manifestation logic → rendered output
```

| Contract | Transformation Stage | Verbatim? | Interpretation Required? | Risk |
| -------- | -------------------- | --------- | ------------------------ | ---- |
| **A** | Construction = wrap + provenance | Yes | At consumer | Low at store |
| **B** | Construction = select + wrap | Yes values | Selection policy | Low–medium |
| **C** | Construction = rename/map | No | **Yes** | **High** (semantic) |
| **D** | Construction = invent directives | No | **Yes** | **High** (semantic) |
| **E** | Authored wrap + optional hints | Authored yes | Hints only | Medium if hints overclaim |
| **F** | Ephemeral copy into experiment | Yes if Exp 2/3 style | Labels as structural chrome | Low if values verbatim |

**Structural OK:** wrapping, provenance, copying arrays, preserving order.  
**Semantic not OK without review:** renaming `required_links` → “causal chain” as scientific claim; inventing “dependency”; synthesising principles.

---

## 9. Learner Exposure Analysis

Using Sprint 63 authored examples:

| Field or Metadata | Learner-Facing | Logic-Only | Diagnostic-Only | Unsafe |
| ----------------- | -------------- | ---------- | --------------- | ------ |
| `required_links[]` values | **Yes** (verbatim list) | — | — | If paraphrased |
| `stages[]` values | **Yes** | — | — | If paraphrased |
| `key_relationships[]` values | **Yes** | — | — | If paraphrased |
| `governing_constraint` value | **Yes** | — | — | If strengthened |
| `start` / `outcome` / `process_goal` | Conditionally (often overlap task) | — | — | Overclaim as sole science |
| `instructional_archetype` id | — | **Yes** | Yes | As learner jargon |
| Source field names (`required_links`) | — | **Yes** | Yes | As pedagogue chrome |
| `material_id` / correlation status | — | — | **Yes** | Learner-facing |
| Path eligibility / validation flags | — | — | **Yes** | Learner-facing |
| Purpose / specification prose | Often authoring | — | — | Direct learner dump |
| Generic projected labels (“intermediate_structure”) | — | — | — | **Unsafe** without review |
| Manifestation instructions (“render as…”) | — | Maybe | — | **Unsafe** as content |

---

## 10. Path-Gating Model

| State | Tier 1 Contract | Tier 2 | Diagnostic Record |
| ----- | --------------- | ------ | ----------------- |
| **Eligible** | May emit A/B/E/F | Available | correlation=1:1; plan valid; path=supported |
| **Ineligible — No Source Contract** | Absent | Only | reason=`no_source` |
| **Ineligible — Missing ID** | Absent | Only | reason=`missing_id` |
| **Ineligible — Ambiguous Match** | Absent | Only | reason=`ambiguous_match` |
| **Ineligible — Invalid Plan** | Absent | Only | reason=`invalid_plan` |
| **Unsupported Path** (materials-only / ungated partial) | Absent | Only | reason=`unsupported_path` |

No implementation in this task.

---

## 11. Trade-Off Matrix

Scale: **1** favourable → **5** unfavourable.

| Dimension | A | B | C | D | E | F |
| --------- | - | - | - | - | - | - |
| Semantic fidelity | 1 | 2 | 5 | 5 | 1 | 1 |
| Semantic transformation risk | 1 | 2 | 5 | 5 | 2 | 2 |
| Archetype coupling | 3 | 3 | 4 | 4 | 3 | 3 |
| Renderer coupling | 4 | 3 | 4 | 5 | 3 | 1 |
| Preservation coupling | 2 | 2 | 3 | 3 | 2 | 1 |
| Consumer complexity | 3 | 2 | 4 | 3 | 3 | 2 |
| Provenance quality | 1 | 2 | 5 | 5 | 1 | 1 |
| Diagnostic usefulness | 1 | 2 | 4 | 4 | 1 | 1 |
| Learner manifestation usefulness | 3 | 2 | 4 | 3 | 2 | 2 |
| Partial-path safety | 1* | 1* | 1* | 1* | 1* | 1* |
| Reversibility | 2 | 2 | 4 | 4 | 2 | 1 |
| Extensibility | 1 | 2 | 5 | 4 | 1 | 2 |
| Maintenance burden | 2 | 3 | 5 | 4 | 3 | 2 |

\*All score well **only if** path gate is enforced; without gating → 5.

### Score notes (selected)

* **A fidelity=1:** full authored plan.  
* **C/D fidelity/risk=5:** interpretive projection / directives.  
* **F renderer coupling=1:** no production renderer.  
* **B selection=2–3:** policy must stay evidence-led per archetype.

---

## 12. Failure Modes

| Contract | Failure Mode | Severity | Detectability | Guardrail |
| -------- | ------------ | -------- | ------------- | --------- |
| All | Tier 1 on unsupported path | High | High if gated | Path gate required |
| All | Tier 1 after failed correlation | High | High | Fail closed |
| A/B/E | Authoring-only fields leaked (purpose/spec) | Medium | Medium | Learner allowlist |
| B | Premature universal field set | Medium | Low until review | Per-archetype evidence only |
| C | Generic labels stronger than source | High | Medium | Reject C for prototypes |
| D | UI instructions as content | High | Medium | Reject D alone |
| E | Hints override authored values | High | Medium | Hints non-authoritative |
| F | Ad-hoc drift across experiments | Medium | Medium | Shared projector checklist |
| A | Renderer hard-depends on all plan shapes | High | Medium | Keep A diagnostic-first |
| All | Invalid plan passed through | High | High if validate | Re-validate |
| All | Stale plan after body rewrite | Medium | Low | Optional freshness stamp |
| All | Duplicate manifestation of same structure | Low–Medium | Medium | Single Tier 1 surface |

---

## 13. Smallest Reversible Prototypes

| ID | Prototype | Tests | Production commit? |
| -- | --------- | ----- | ------------------ |
| **P1** | Diagnostic opaque envelope (A) on correlated diagnostic page | Provenance + gate | No |
| **P2** | Verbatim field envelope (B) for three archetypes in experiment JSON | High-value T1 data | No |
| **P3** | Pre-manifestation adapter: correlated plan → Exp 2/3 T1 HTML | End-to-end visibility | No renderer change |
| **P4** | Dual output: Tier 2 + path-gated Tier 1 + provenance trace | Gate + comparison | No |

**Most reversible:** **F via P1/P4** (experiment folder only).  
**Best manifestation expressibility test:** **P3** consuming **B** or **A** under Outcome B gates.

---

## 14. Contract Classification

### Strong Candidate for Bounded Prototype

* **F — No persistent contract** (experimental projection; proven in Exp 2/3)  
* **A — Opaque source contract** (diagnostic envelope)  
* **B — Verbatim field envelope** (bounded T1 manifestation data for three archetypes)

### Conditional Candidate

* **E — Dual-layer** (strong if hint layer stays optional and non-authoritative)

### Diagnostic Only

* **A** may remain diagnostic-only if learner exposure uses B/F projectors

### Reject (for manifestation contracts)

* **C — Generic cognitive projection** (insufficient evidence; high interpretive risk)  
* **D — Manifestation instructions alone** (semantic transform; weak provenance)

**No production architecture selected.** Multiple contracts may feed a bounded prototype.

---

## 15. Findings

1. Tier 1 requires hard preconditions and fail-closed path gating (Outcome B).  
2. Diagnostics and manifestation need different shapes: **A** vs **B/F**.  
3. Generic projection (**C**) is **not** justified by Sprint 63/64 evidence.  
4. Archetype-specific field envelopes (**B**) remain necessary for smallest useful T1 data — not a universal schema.  
5. Provenance (`material_id`s, field names, correlation status, path eligibility) is mandatory.  
6. Learner-facing content = authored values only; IDs/status/archetype id = logic/diagnostic.  
7. Main semantic risk = over-strong labels / generic projection / ungated emission.  
8. Renderer awareness **not** required for bounded prototypes (F/P3).  
9. Bounded prototype **is** justified (path-gated, reversible).  
10. Construction/consumption **location** (retain A vs opaque D vs bridge E vs ephemeral F) remains the main open architecture question.

---

## 16. Recommended Next Task

### Option B — Preservation + Manifestation Location Comparison

Proceed to **S64-BL-004**: compare where eligible contracts should be **constructed** and **consumed** (retain `required_materials` vs opaque material reference vs preserve bridge vs ephemeral pre-manifestation), under Outcome B gates.

Then a bounded prototype (Option A / P1–P4) can target the chosen location without freezing production schema.

---

## Success condition met

One or more safe, path-gated, reversible manifestation contracts (**A**, **B**, **F**; conditional **E**) are identified for bounded experimentation without defining or implementing a production schema. **C** and lone **D** rejected for manifestation use.
