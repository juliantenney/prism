# Gate 9 — Assessment Pack canonical structured artefact

**Sprint:** 93 — Assessment Pack Educational Contract  
**Gate:** 9 — **COMPLETE / PASSED** (2026-10-07)  
**Depends on:** Gate 8 PASSED (pipeline) · Gate 7 PASSED (AP-I1…I6) · Gates 1–6 PASSED  
**Decision:** [S93-D10](decisions.md#s93-d10--gate-9-assessment-pack-canonical-structured-artefact-complete--passed)  
**Invariant:** NON-SUMMATIVE · production code **frozen** · client-side HTML/CSS/JS delivery only (no runtime LLM)

---

## Purpose of this gate

Define the **minimum canonical structured artefact** that carries the settled Assessment Pack educational contract across the structured artefact boundary.

```text
MODEL REASONING (continuous conversation)
Interpret Evidence Purpose → Design Evidence Elicitation → Author Formative Return → Design Page
↓
CANONICAL STRUCTURED ARTEFACT
↓
deterministic validation / assembly / rendering / persistence / packaging / publishing
```

No AI after the boundary. No reopening of roles, boundary, learner contract, AR1–AR5, invariants, or pipeline topology.

This gate designs **data semantics**, not production prompts, validators-as-code, or renderers.

---

## 1. Proposed canonical page shape

Assessment Pack remains an ordinary PRISM page:

| Field | Value / rule |
| ----- | ------------ |
| `artifact_type` | `"page"` |
| `schema_version` | `"2.0.0"` |
| `product_id` | `"assessment_pack"` |
| `page_kind` | `"assessment"` |
| `title` | Required learner-facing title |
| `sections[]` | Ordinary page sections for **framing / orientation prose** (not the elicitation engine) |
| `activities[]` | **Empty** for Assessment Pack — do not misuse Interactive activities |
| `learning_outcomes[]` | Retain shared LO list where authored |
| **`assessment_evidence`** | **Product-specific semantic object** (required) — analogous in architectural spirit to `situated_learning` |

Do **not** invent a special page `artifact_type`. Identity is `product_id` / `page_kind` + `assessment_evidence`.

---

## 2. Assessment-Pack-specific semantic object: `assessment_evidence`

```text
assessment_evidence
├── purpose                 (Stage 1 commitments)
├── learner_context         (AP-I5 bring-forward / entry assumptions)
├── elicitations[]          (Stage 2 performances + frozen epistemic class + delivery)
├── pack_forward_orientation (pack-level forward meaning; see §7)
└── delivery_preferences?   (e.g. feedback_timing — delivery param, not identity)
```

`assessment_check` is **not** the primary educational object going forward. See §16 migration.

---

## 3. Mandatory / conditional / optional fields

### Page envelope

| Field | Status |
| ----- | ------ |
| `artifact_type`, `schema_version`, `product_id`, `page_kind`, `title` | **Mandatory** |
| `assessment_evidence` | **Mandatory** |
| `sections[]` | **Optional** (often useful for orientation; may be empty if purpose/instructions live fully inside `assessment_evidence`) |
| `activities[]` | **Mandatory empty** (`[]`) |
| `learning_outcomes[]` | **Optional** (keep when LO mapping is authored) |

### `assessment_evidence.purpose` (mandatory object)

| Field | Status | Semantics |
| ----- | ------ | --------- |
| `role` | **Mandatory** | `"R1"` \| `"R2"` \| `"R1_and_R2"` (primary emphasis when combined must still be clear in `visibility_claim`) |
| `visibility_claim` | **Mandatory** | What about the learner’s state/capability this stop makes visible |
| `stop_rationale` | **Mandatory** | Why this is a formative stopping point here |
| `forward_intent` | **Mandatory** | Concise educational purpose of the forward move (not routing) |

No model-reasoning transcripts.

### `assessment_evidence.learner_context` (mandatory object; contents conditional)

| Field | Status | Semantics |
| ----- | ------ | --------- |
| `bring_forward` | **Conditional** — required when commission/design depends on prior learner work | Array of `{ what, how_used }` learner-visible declarations |
| `entry_assumptions` | **Conditional** — required for standalone when prerequisites are assumed; may also appear in commissioned packs | Array of concise assumption strings (or equivalent structured statements) |
| (empty object) | Allowed only when neither prior-work dependence nor special entry assumptions apply | Rare; still present as object for stable shape |

### `assessment_evidence.elicitations[]` (mandatory; length ≥ 1)

Each elicitation unit:

| Field | Status | Semantics |
| ----- | ------ | --------- |
| `elicitation_id` | **Mandatory** | Stable id |
| `order` | **Mandatory** | Display/attempt order |
| `evidence_ask` | **Mandatory** | Educational performance / evidence ask (not a form name) |
| `instructions` | **Optional** | Learner-facing attempt guidance for this unit |
| `stimulus` | **Optional** | Case/source/stimulus material needed for this elicitation |
| `epistemic_class` | **Mandatory** | `"determinate"` \| `"non_determinate"` — **frozen Stage 2 exit** |
| `delivery` | **Mandatory** | How the ask is realised in plain HTML (see §5–§10) |
| `formative_return` | **Mandatory** | Authored return for this unit (see §6) |
| `mapped_learning_outcome_ids` | **Optional** | LO ids only |

### Pack-level

| Field | Status |
| ----- | ------ |
| `pack_forward_orientation` | **Mandatory** — intelligible next-move meaning for the pack as a whole (may reference unit-level detail) |
| `delivery_preferences.feedback_timing` | **Optional** — retain current `per_component` / `end_of_pack` as delivery preference for determinate units |

---

## 4. Epistemic-class representation and semantics (D)

### Classification (binary — sufficient)

| Class | Meaning |
| ----- | ------- |
| `determinate` | The learner runtime may legitimately apply authored deterministic judgement to the response (or to the unit as a whole) |
| `non_determinate` | The learner runtime must **not** claim to have evaluated response quality; formative use depends on authored self-evaluation support |

**Not proxies for:** closed vs open, simple vs complex, item vs essay, short vs long.

No speculative third class. **Mixed packs** = multiple elicitation units with different classes. Do not invent `mixed` as a unit class; keep honesty separable per unit.

### Runtime obligations by class

| Class | Runtime may | Runtime must not | Formative-return obligation |
| ----- | ----------- | ---------------- | --------------------------- |
| `determinate` | Check against authored judgement; show authored explanatory feedback | Claim quality beyond the key; pathway control; grades | Authored judgement + explanatory formative material + forward meaning |
| `non_determinate` | Present workspace; present authored self-evaluation materials; optional light revision UX if authored | Imply AI/human marking; auto-score nuanced judgement; collapse plurality via fake “correct” | Sufficient self-evaluation materials + forward meaning; model response not mandatory |

Frozen class is carried on each elicitation so deterministic rendering cannot accidentally cross AP-I2.

---

## 5. Elicitation representation (C)

### Conceptual separation

1. **`evidence_ask`** — educational PERFORMANCE / EVIDENCE ASK  
2. **`delivery`** — RESPONSE MECHANISM that realises it in HTML/CSS/JS  

Assessment Pack is **not** a list of question formats. Formats live only under `delivery` when used.

### Unit model (supports both worlds)

| Shape | Use |
| ----- | --- |
| **One elicitation unit** | Natural for Gate 2 C `c9`-style integrated performance |
| **Multiple elicitation units** | Natural for five diagnostic MCQs (one unit per item, or one unit with multi-item determinate delivery — see below) |

### `delivery.kind` (closed small set — delivery only, not product identity)

| `delivery.kind` | Role |
| ---------------- | ---- |
| `auto_checkable_items` | One or more of the five existing deterministic forms |
| `constructed_performance` | Integrated/constructed learner production with workspace |

```text
delivery:
  kind: auto_checkable_items | constructed_performance
  # kind-specific payload (§9 / §10)
```

**Integrity rule (AP-I3):** A sustained integrated performance authored as one educational ask must be one `constructed_performance` elicitation (or equivalent single-unit design) — **not** forced into `items[]` atomisation that destroys the capability claim.

---

## 6. Formative-return representation (E)

Per elicitation, mandatory object `formative_return`:

```text
formative_return
├── materials[]              # authored learner-facing supports (length rules below)
├── forward_orientation      # unit-level next-move meaning (string or {text})
└── revision?                # optional { offered: boolean, prompt?: string }
```

### `materials[]` entries (flexible — **not** a treatment enum)

| Field | Status | Semantics |
| ----- | ------ | --------- |
| `material_id` | Mandatory | Stable id |
| `body` | Mandatory | Learner-facing content (text/structured prose as page conventions allow) |
| `title` | Optional | Heading |
| `attention` | Optional free string | Author hint such as “criteria”, “contrast”, “explanatory_feedback” — **not** a closed enum validators enforce as taxonomy |

Authors select the **smallest sufficient** set (Gate 6). **`model_answer` is not mandatory** and must not falsely collapse plurality (AP-I2).

### Completeness rules (structural)

| Epistemic class | Structurally required |
| --------------- | --------------------- |
| `determinate` | `delivery` includes deterministic judgement; `materials` includes at least one explanatory/feedback body **or** equivalent explanatory field retained on items; `forward_orientation` present |
| `non_determinate` | `materials.length >= 1` sufficient for self-evaluation; `forward_orientation` present; **no** runtime judgement payload that claims quality scoring |

Pack-level `pack_forward_orientation` remains mandatory so AP-I4 is inspectable even when unit forwards are terse.

---

## 7. Forward-orientation representation (F)

| Location | Role |
| -------- | ---- |
| `purpose.forward_intent` | Stage 1 commitment — why the stop is forward-looking |
| `elicitations[].formative_return.forward_orientation` | Unit-level learner-facing implication |
| `pack_forward_orientation` | Pack-level learner-facing implication (**mandatory**) |

Not adaptive routing. R1 tends toward attention/priorities; R2 toward strengths/limits/uncertainty/next development — expressed in content, not separate schema products.

---

## 8. Bring-forward / entry-assumption representation (G)

Single shared object: `assessment_evidence.learner_context`.

| Use | Representation |
| --- | -------------- |
| Commissioned handoff | `bring_forward[{ what, how_used }]` — learner-visible |
| Standalone / prerequisites | `entry_assumptions[]` |
| Workflow provenance | **Not duplicated** here — remains workflow-owned |

No hidden runtime learner-state transport fields.

---

## 9. Existing five auto-checkable forms (H)

Under `delivery.kind = "auto_checkable_items"`:

```text
delivery:
  kind: "auto_checkable_items"
  items: [
    {
      item_id, order, form,   # form ∈ five SUPPORTED_FORMS
      stem / prompt fields as today,
      judgement,              # deterministic keys/maps/orders
      auto_checkable: true,
      feedback_note?,         # may duplicate or feed formative_return.materials
      representation?,
      mapped_learning_outcome_ids?
    }
  ]
```

| Rule | Statement |
| ---- | --------- |
| Preserve | All five forms as determinate delivery capabilities |
| Do not | Let them define Assessment Pack identity |
| Do not | Force constructed work through this shape |
| Epistemic | Unit `epistemic_class` must be `determinate` when this kind is used for the unit as a whole |
| Migration | Item field shapes **KEEP** largely unchanged beneath the new umbrella |

---

## 10. Constructed-performance representation (I)

Under `delivery.kind = "constructed_performance"`:

```text
delivery:
  kind: "constructed_performance"
  prompt                 # learner-facing production ask (may amplify evidence_ask)
  response_workspace: {
    # educational requirement only — NOT persistence mechanism
    intention: string    # e.g. sustained written judgement / explanation
    guidance?: string
  }
  revision?: mirrored or solely under formative_return.revision
```

**Not** a catalogue of essay/reflection/argument subtypes. Those are uses of constructed performance, not canonical product types.

Runtime needs (educational): prompt/instructions, optional stimulus, workspace requirement, epistemic class (`non_determinate` typical), formative-return materials, optional revision offer, forward guidance.

Shared learner-workspace infrastructure may later realise `response_workspace` — **Gate 10 implementation concern**, not decided as a specific widget here.

---

## 11. Sections / activities decision (J)

| Page field | Assessment Pack use |
| ---------- | ------------------- |
| `sections[]` | Framing, orientation, non-elicitation explanation the learner should read |
| `activities[]` | **Always `[]`** — elicitation is not Interactive activity grammar |
| `assessment_evidence` | Sole home of elicitation, epistemic class, formative return, handoff semantics |

**A page is a page.** Product semantics live in `assessment_evidence`, parallel to `situated_learning` on Situated Task pages.

---

## 12. Structurally enforceable fail-closed rules (K)

Deterministic validation/assembly **MUST reject** (or refuse to publish as complete Assessment Pack) when:

1. Missing `assessment_evidence` or `purpose` mandatory fields  
2. `elicitations` missing or empty  
3. Any elicitation missing/invalid `epistemic_class`  
4. `determinate` unit without deterministic judgement information on its auto-checkable delivery  
5. `non_determinate` unit that includes payloads implying runtime quality judgement / auto-scoring of the constructed response  
6. `non_determinate` unit with empty `formative_return.materials`  
7. Missing unit or pack `forward_orientation` / `pack_forward_orientation`  
8. `learner_context.bring_forward` required by authored dependence but absent or empty  
9. `activities` non-empty (misuse)  
10. Summative semantics present (grades, pass/fail gates, certification fields if introduced)  
11. `auto_checkable_items` used to represent a unit whose `evidence_ask`/`purpose` claims integrated constructed capability **and** itemisation is structurally a multi-trivial split with no constructed delivery — *soft structural heuristic only where detectable; full integrity remains authoring responsibility*  

Exact validator implementation is Gate 10.

---

## 13. Semantic responsibilities NOT delegated to deterministic validation

Cannot honestly be proven from JSON alone:

- Whether centre of gravity is truly evidence-of-learner vs developmental absorption (AP-I1 qualitative)  
- Whether decomposition destroys capability in educational substance (AP-I3 deep fit)  
- Whether self-evaluation materials are *educationally* sufficient beyond non-empty (AP-I4 depth)  
- Whether a model/contrast falsely collapses plurality  
- Whether commission handoff is the *right* prior work educationally  

These remain **authoring/model responsibilities** protected by pipeline prompts + invariants — not fake semantic validators.

---

## 14. Design Page synthesis contract (L)

Stage 4 Design Page must:

- emit **valid canonical JSON only** (no citations/content-reference/provenance syntax inside educational JSON);  
- preserve frozen `epistemic_class`;  
- preserve `purpose`, elicitation integrity, formative return, learner_context, forward orientation;  
- contain sufficient learner-facing content for deterministic rendering;  
- **make no new educational decisions**;  
- require **no post-hoc prose→semantics repair** for core educational fields.

Downstream systems may validate, assemble/hydrate, package — **must not invent** missing Assessment educational decisions.

---

## 15. Concise canonical examples (M)

### Example 1 — R1 diagnostic MCQs (must not be heavyweight)

```text
page(product_id=assessment_pack, page_kind=assessment)
assessment_evidence.purpose = { role:R1, visibility_claim:"…prior concepts…", stop_rationale:"…orient attention…", forward_intent:"…what to concentrate on…" }
learner_context.entry_assumptions = ["…"]
elicitations[0..n] each:
  evidence_ask: short probe claim
  epistemic_class: determinate
  delivery.kind: auto_checkable_items (one item, form=single_answer_mcq, judgement+feedback)
  formative_return: materials[explanatory] + forward_orientation
pack_forward_orientation: advisory concentration summary intent
```

### Example 2 — R2 deterministic knowledge check

Same shape as Example 1 with `role:R2` and capability-visibility claim; still `determinate` + `auto_checkable_items`.

### Example 3 — Short constructed explanation + self-evaluation

```text
elicitations[0]:
  evidence_ask: "Explain …"
  epistemic_class: non_determinate
  delivery.kind: constructed_performance (prompt + response_workspace)
  formative_return.materials: [comparison reasoning, criteria attention]
  formative_return.forward_orientation: "…"
  formative_return.revision?: { offered:true, prompt:"…" }
```

### Example 4 — A `c7` causal-argument readiness checkpoint

```text
purpose.role: R2
one elicitation:
  evidence_ask: integrated causal-argument performance at checkpoint
  epistemic_class: non_determinate
  delivery.kind: constructed_performance  # NOT five MCQs
  stimulus: observational vignette/data as needed
  formative_return: reasoning-quality materials + forward to later work
learner_context.bring_forward: prior Interactive learning named
```

### Example 5 — C `c9` contested-claim investigation

```text
purpose.role: R2
one elicitation:
  evidence_ask: sustained independent integrated credibility judgement
  epistemic_class: non_determinate
  delivery.kind: constructed_performance  # single integrated performance
  formative_return.materials: criteria honouring unresolved conclusions; contrasts
  # no predetermined verdict field; no auto_checkable_items
learner_context.bring_forward: prior Interactive judgement/investigation/metacognition work
pack_forward_orientation: what this evidence means next
```

Examples 1 and 5 are the **same first-class product**; they differ in elicitation units’ epistemic class and delivery kind — not in product identity.

---

## 16. Migration from current output (N)

| Current | Classification | Note |
| ------- | -------------- | ---- |
| Ordinary `page` / `schema_version` / `page_kind: assessment` | **KEEP** | Envelope stays |
| `product_id: assessment_pack` | **KEEP** | |
| `activities: []` | **KEEP** | |
| `sections[]` / framing usage | **KEEP / EXPAND** | Orientation prose; not elicitation engine |
| `learning_outcomes[]` | **KEEP** | |
| `attempt_instructions`, `framing`, `assessment_intent` (top-level) | **REPLACE →** `assessment_evidence.purpose` + section/instructions fields | Avoid duplicating intent in three places long-term; transitional dual-read OK in Gate 10 |
| `feedback_timing` | **KEEP** nested under `delivery_preferences` | |
| `assessment_check.items[]` | **REPLACE as primary** → `assessment_evidence.elicitations[].delivery` auto_checkable items; **DERIVE** `assessment_check` optionally for transitional renderer compatibility | Do not let compatibility re-narrow identity |
| Five forms + judgement + `feedback_note` | **KEEP nested/embedded** | Under determinate delivery |
| Constructed forbidden | **RETIRE** | |
| Design Page without components | **EXPAND** | Design Page synthesises full `assessment_evidence` |
| Intermediate `evidence_plan` / author `assessment_pack` artefacts | **EXPAND/REPLACE** in Gate 10 pipeline wiring | Align to Stages 1–3; exact intermediate shapes implementation-owned if needed |

**Compatibility rule:** Backward-compatible derivation must not permanently redefine Assessment Pack as `assessment_check`-only.

---

## 17. Implementation implications for Gate 10 (bounded plan)

Gate 10 should implement **only** what Gates 1–9 have justified:

1. **Family pipeline registration** — replace Plan/Author/Design Page Assessment stages with Interpret Evidence Purpose → Design Evidence Elicitation → Author Formative Return → Design Page; one continuous conversation.  
2. **Prompts** — encode AR1–AR5 / AP-I1…I6 / epistemic freeze at Stage 2 exit / Design Page synthesis-only.  
3. **Canonical page contract** — emit/validate `assessment_evidence` per this gate; fail-closed structural rules §12.  
4. **Renderer** — determinate path continues from auto_checkable delivery; add constructed_performance + self-evaluation presentation (plain HTML/CSS/JS; reuse shared workspace patterns where fit).  
5. **Transitional bridge** — optional derive `assessment_check` from determinate elicitations; do not block non_determinate packs.  
6. **Preserve** five auto-checkable forms and deterministic checking.  
7. **Publish/assemble** — hydrate from `assessment_evidence`; invent nothing missing.  
8. **LJ commissioning** — honour bring-forward in artefact; still no runtime state transport; journey ZIP support only if separately justified.  
9. **Live acceptance** — pressure cases: R1 MCQs; constructed+self-eval; at least one Gate 2-style integrated non_determinate stop.  
10. **Non-goals for first implementation slice** unless earned mid-gate: treatment enums, adaptive routing, AI runtime, summative fields, new page artifact_type.

---

## 18. Gate 9 decision checklist

| Criterion | Assessment |
| --------- | ---------- |
| Ordinary page preserved | **Met** |
| Product semantic object carries contract | **Met** (`assessment_evidence`) |
| Elicitation ≠ format catalogue | **Met** (`evidence_ask` + `delivery`) |
| Binary epistemic class sufficient | **Met** |
| Formative return without treatment enum | **Met** |
| Five forms preserved under determinate delivery | **Met** |
| Constructed integrated performance representable | **Met** |
| Fail-closed structural vs non-delegable semantics separated | **Met** |
| Migration without re-narrowing | **Met** |
| No code / prompts / renderer changes | **Met** |

**Recommendation: PASS.**

Stable enough to proceed to Gate 10 (implementation and live acceptance) under the bounded plan in §17.
