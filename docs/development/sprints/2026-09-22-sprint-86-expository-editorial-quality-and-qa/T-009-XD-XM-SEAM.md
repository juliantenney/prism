# Sprint 86 — T-009 XD → XM → Design Page representation seam

**Task:** S86-T-009 / WP4  
**Status:** **COMPLETE**  
**Quality focus:** EQ5 (warrant → explanatory value of form → integration)  
**Predecessor:** [T-008-PIPELINE-RESPONSIBILITY-MAP.md](T-008-PIPELINE-RESPONSIBILITY-MAP.md)  
**Date:** 2026-09-22  
**Discipline:** Bounded successor **design** only — no implementation, no prompt edits, no new AI stage, no AD-010 fix.

---

## 1. Question answered

> How can XD compose learner-facing prose that genuinely participates with supporting intellectual artefacts and visual representations realised later by XM and Design Page, while preserving accessibility, commission authority, and the existing Expository topology?

**Recommended answer (summary):** Prefer **Option B** — enrich the existing commission with stable representational intent (perceptibility + prose-participation semantics) **and** deterministically bind XM bodies / optional DP visual affordances to that commission identity — without adding a generative rewrite loop or a new AI stage.

---

## 2. Current seam diagnosis (from T-008; not re-proved)

```text
EJP representation_needs[]          (selective planning labels)
        ↓
XD exposition + materials_commission[]
        ↓
XM materials[].body                 (string | structured object)
        ↓
Design Page visual_affordances[]    (optional; independent channel)
        ↓
assemble → renderer
```

| Fact | Implication for EQ5 |
| ---- | ------------------- |
| XD owns warrant; XM realises 1:1 under commission lock | Authority model is sound for existence |
| DP VA is a separate optional channel | materials ≠ figures (C05) can be correct |
| XD writes exposition before XM/VA exist | Cannot depend on realised labels/layout |
| No XD ← XM rewrite loop | Integration must be designed around **stable intent**, not realised pixels |
| Commission `intent`/`constraints` are free text | Perceptibility purpose is soft / lossy |
| Soft post-hoc adjacency | Prose often self-complete; artefacts accompany (C01–C05) |
| AD-010 | Separate functional defect — unsupported structured bodies |

**Core temporal tension:** XD needs enough stable intent to *compose around* a supporting artefact, without knowing XM/DP realisation details, while keeping essential meaning in prose (accessibility).

---

## 3. Distinctions (normative for the design)

| Concept | Owner | Meaning |
| ------- | ----- | ------- |
| **A. Representation need** | EJP (selective) | Judgement that some relationship/pattern/sequence/contrast/structure may benefit from representational treatment |
| **B. Material commission** | **XD** | Authoritative request that a supporting intellectual artefact exist |
| **C. Material body** | **XM** | Realised intellectual content of that commission |
| **D. Visual affordance** | **Design Page** | Decision to give some learner-facing content graphical treatment |
| **E. Prose participation** | **XD** | How exposition anticipates / introduces / interprets / returns to / continues past the artefact |

Do **not** collapse A–E into “figure.”

**Cardinality:** Do **not** require 1:1 commission ↔ figure. Allowed outcomes:

- commission + XM body, no VA (prose/table/worked-example sufficient);
- commission + XM body + VA (graphic realises or amplifies the body);
- VA without new commission only when reinforcing already-authorised section substance (rare; must not invent new explanatory purpose);
- commission with no learner figure (valid).

---

## 4. Semantic information that must cross the seam

XD must know at prose time (stable):

| Semantic | Required? | Role |
| -------- | --------- | ---- |
| Stable `commission_id` | **Must** | Identity across XM/DP/assembly |
| `section_id` | **Must** | Placement scope |
| Warrant / kind (artefact type class) | **Must** | What form of intellectual support |
| **Perceptibility intent** — what relationship/pattern/sequence/contrast/structure must become easier to inspect | **Must** | Composition target for prose + preservation target for XM/DP |
| **Prose participation intent** — how exposition will use the artefact (anticipate / introduce / interpret / return / continue) | **Must** | Lets XD write participation without realised details |
| Constraints (extent, must-not-invent, claim bounds) | **Must** | Commission lock substance |
| Preferred learner channel hint (`structured_body` / `visual` / `either` / `prose_companion`) | Should | Guides XM vs DP without forcing 1:1 |
| Exact labels, layout, colours, graphic composition | **Must not** require at XD | XM/DP decide later within bounds |

**What XM must preserve exactly:** commission identity; perceptibility intent; claim bounds / must-show intellectual content named by the commission.  
**What XM may elaborate:** concrete examples, internal staging, diagram element inventories **within** those bounds.  
**What DP must preserve:** same perceptibility intent when choosing/generating a VA; evidence anchors back to commission/section substance.  
**What DP may decide later:** whether visual treatment adds value; representation vocabulary; alt/detailed description; slot.  
**What DP must never invent:** a new explanatory purpose not present in XD commission / section exposition.

Current free-text `intent`/`constraints` partially cover this; they do not distinguish perceptibility vs warrant vs participation, and do not bind VA to commission identity.

---

## 5. Safe prose-participation patterns (XD-time)

Safe when XD knows only the commission’s stable intent:

1. **Anticipation** — Establish why inspecting a relationship/pattern will help (no visual deixis).  
2. **Introduction** — Direct attention to the *relationship to notice* (“compare where adaptive change enters”), not to a figure number/colour.  
3. **Interpretation** — State the significance of that relationship in prose (essential meaning stays here).  
4. **Return** — Later sections refer to the *same conceptual relationship* as an anchor (“the same causal-entry contrast”).  
5. **Continuation** — After the artefact’s intended role, advance the argument with a new cognitive move (not a restatement dump).

These compose around **representational intent**, not realised images.

---

## 6. Unsafe participation patterns

Avoid in XD exposition (and treat as commission drift if XM/DP force them):

- References to exact visual position, colour, iconography, or unguaranteed labels.  
- “As shown in Figure N / the blue arrow / the left panel” when N/layout are DP-owned.  
- Essential claims that appear **only** in the artefact / alt text.  
- Assuming a VA will exist for every commission.  
- Assuming every VA has a matching XM body.  
- Exhaustive narration of every visual feature (alt-text dump as exposition).  
- Using a reconsolidating figure as a second close (EQ8 constraint).

---

## 7. Accessibility responsibility map

| Layer | Owner | Role |
| ----- | ----- | ---- |
| **Semantic instructional equivalence** | **XD exposition** | Essential meaning available without seeing any representation |
| **Visual perceptibility benefit** | XM body and/or DP VA | Makes structure/sequence/contrast easier to inspect |
| **Alt text** | DP VA (when figure exists) | Short non-visual identification of the graphic |
| **Detailed description** | DP VA | Longer accessible account of the graphic’s structure |
| **Prose participation** | XD | Intellectual use of the artefact’s *role*, not a second alt text |

Alt text is **not** a substitute for exposition. Exposition is **not** an exhaustive alt-text dump. Accessible semantic equivalence ≠ editorial redundancy (T-007).

---

## 8. XM authority / commission lock

**Preserve:** XD decides warrant; XM realises; XM does not decide existence.

**Lock today:** 1:1 `commission_id` cardinality (`validateCommissionLock`).

**Successor need:** Extend the *semantic* lock, not only identity:

| May elaborate | Must preserve | Drift |
| ------------- | ------------- | ----- |
| Concrete staging, examples, element lists within bounds | `commission_id`, perceptibility intent, claim bounds, kind family | New pedagogical purpose; contradicting must-not-show; inventing uncommissioned materials; changing the relationship to be made perceptible |

Future validation (NOT NOW to implement): soft checks that XM body / DP VA still serve the stated perceptibility intent — beyond cardinality.

---

## 9. Design Page responsibility

| May decide | Must not decide |
| ---------- | --------------- |
| Whether visual treatment adds value for a section/commission | Whether an artefact should have been commissioned (warrant) |
| Shared VA vocabulary (purpose, preferred_representation, slot) | New explanatory purpose after XD |
| Alt / detailed description for the graphic | Repair weak XD/XM by rewriting exposition |
| Page/section scope placement among allowed slots | Activity-scoped inventiveness |

**Current practice:** Mixture — DP can plan VAs from upstream substance (`evidence_anchors`) without a hard link to `commission_id`. That is **partly desirable** (materials ≠ figures) but **risky** when VA invents pedagogical purpose or when XM and VA diverge unnoticed.

**Desirable posture:** DP visual planning is primarily **downstream realisation / amplification** of upstream representational intent, with freedom to **omit** visuals. Independent VA without commission remains exceptional and must cite section exposition substance only — never a new lesson.

---

## 10. Deterministic binding findings

| Mechanism | Needed for EQ5? | Notes |
| --------- | --------------- | ----- |
| Shared stable `commission_id` across XD → XM → (optional) VA | **Must** | Already on XM; missing on VA |
| Semantic reference in prose to relationship/role (not figure number) | **Must** | Prompt/discipline; no new stage |
| Assembly preserving section materials + VA hooks | **Must** (already largely true) | Keep |
| Explicit VA → `commission_id` (or `none` + section substance anchors) | **Should** | Resolves orphan/over-gen diagnostics |
| Mid-section inline anchors vs section-after-content only | **Should / polish** | Improves participation; not required for first EQ5 win |
| Every artefact gets an inline prose token | **Not now** | Over-coupling; many artefacts are fine as end-of-section |

Stronger EQ5 can be achieved primarily by **intent enrichment + deterministic identity binding**, not by another generative stage.

---

## 11. Option A — Prompt / contract enrichment only

**Idea:** Keep stage order and channels. Enrich XD commissions with explicit perceptibility intent + prose-participation intent; strengthen XD/XM/DP prompts to preserve them; keep free VA channel.

| Criterion | Assessment |
| --------- | ---------- |
| EQ5 potential | Improves warrant clarity and safer participation language; placement still soft/post-hoc |
| Accessibility | Good if prose rules enforced |
| Authority | Clearer; still no VA↔commission link |
| Determinism | Unchanged |
| Complexity | Low |
| Regression / Interactive | Mostly Expository sibling prompts + `expository-contracts` normalisers |
| Temporal problem | **Partially** solved (compose around intent) but not binding |
| New ambiguity | Field sprawl if over-specified |

---

## 12. Option B — Enrichment + deterministic binding *(recommended)*

**Idea:** Option A **plus**:

1. Stable commission identity required end-to-end.  
2. Optional DP VA field linking to `commission_id` when the figure realises/amplifies that commission; `commission_id: null` only with section substance anchors.  
3. Assembly/renderer continue section-scoped placement; prefer binding diagnostics over new AI.  
4. No XD ← XM generative rewrite.

| Criterion | Assessment |
| --------- | ---------- |
| EQ5 potential | **Highest among small options** — intent + identity + optional visual link |
| Accessibility | Preserved (prose owns essentials; VA owns alt/detail) |
| Authority | XD warrant; XM body; DP visual decision under linked intent |
| Determinism | Binding is deterministic; generation remains staged |
| Complexity | Moderate — Expository contracts + DP VA schema additive fields |
| Shared infrastructure | VA schema 38.4 is shared — **additive optional fields** preferred; avoid breaking Interactive |
| Temporal problem | Addressed via stable intent + identity; still no realised-detail dependence |
| New ambiguity | Must document materials ≠ figures still allowed |

---

## 13. Option C — Deterministic participation cues (no new AI stage)

**Idea:** XD may emit rare, optional **non-visual** participation markers tied to `commission_id` (conceptual anchors, not figure deixis). Assembly resolves them to insert XM title/caption or a short “inspect this relationship” cue when the material/VA exists, or strips the marker when absent. **No additional LLM stage**; not an XD rewrite after XM.

| Criterion | Assessment |
| --------- | ---------- |
| EQ5 potential | Can improve mid-argument handoff |
| Accessibility | Risky if markers become essential; must degrade to prose-only |
| Authority | Clear if markers are XD-authored |
| Determinism | High |
| Complexity | Higher (exposition token grammar + assembly resolve + renderer) |
| Temporal problem | Partially — still based on intent |
| New ambiguity | Token abuse; Interactive collision; over-engineering |

**Not chosen as first successor:** valuable later polish; not required once B’s intent + binding exist. Including “add another AI stage” as Option C is rejected by default.

---

## 14. Recommendation

**Select Option B** as the smallest option that credibly addresses the evidenced EQ5 problem (soft integration + ambiguous XM/VA channels) without a new AI stage or post-XM rewrite.

Option A alone under-solves binding/diagnostics (C05 materials≠figures remains opaque).  
Option C adds mechanism beyond the first credible EQ5 win.

---

## 15. MUST / SHOULD / NOT NOW

### MUST HAVE (first successor implementation — later task)

- Explicit **perceptibility intent** on XD commission (what relationship/pattern/… to make inspectable).  
- Explicit **prose participation intent** (which safe pattern(s) the exposition uses).  
- Preserve commission lock; XM/DP must not change pedagogical purpose.  
- Essential meaning remains in XD exposition.  
- Optional DP VA may link to `commission_id` when realising/amplifying that commission.  
- No requirement of 1:1 commission ↔ figure.  
- No new AI stage; no XD ← XM generative loop.

### SHOULD HAVE

- Preferred channel hint on commission (`structured_body` / `visual` / `either` / `prose_companion`).  
- Assembly/QA diagnostics: orphan VA without commission/substance; Commission without any learner realisation when channel hint required visual; mismatched perceptibility.  
- Stronger prompt examples of safe vs unsafe participation.  
- Align supported XM structured shapes with AD-010 fix later (see §17).

### NOT NOW

- Mid-section inline token grammar (Option C).  
- Post-XM / post-VA generative prose rewrite.  
- Forcing every commission to have a VA.  
- Forcing every VA to have an XM body.  
- Numerical scoring of integration.  
- Solving EQ1 / EQ7 / EQ8 furniture in this seam.  
- Fixing AD-010 in this task.

---

## 16. Conceptual successor artefact contract (illustrative)

Neutral example — mechanism contrast support (not copied from a live case):

```text
XD materials_commission:
  commission_id: "C-S4-contrast-01"
  section_id: "S4"
  kind: "side_by_side_causal_comparison"
  perceptibility_intent:
    "Make inspectable where adaptive difference enters each account’s causal chain"
  prose_participation_intent: ["introduction", "continuation"]
  constraints:
    "Do not present the accounts as equally current scientific theories;
     show structural contrast only; no new mechanisms"
  channel_hint: "either"   # structured body and/or visual OK

XM material:
  commission_id: "C-S4-contrast-01"
  kind: "side_by_side_causal_comparison"
  body: { ... structured comparison within bounds ... }
  # preserves perceptibility_intent; elaborates concrete nodes only as allowed

DP visual_affordance (optional):
  affordance_id: "va-S4-contrast-01"
  scope: "section"
  section_id: "S4"
  commission_id: "C-S4-contrast-01"   # deterministic link
  visual_decision: "generate"
  purpose / preferred_representation: comparison / causal_chain
  evidence_anchors: ["S4.exposition", "C-S4-contrast-01"]
  alt_text / detailed_description: graphic a11y only

XD exposition (same section):
  ... establishes the contrast in prose (essential meaning) ...
  ... introduces what to notice in the comparison (participation) ...
  ... continues with a new move after that relationship is available ...

Learner placement:
  section S4 prose → optional structured companion and/or figure after content
  figure may be absent; prose still teaches the contrast
```

Stable identity: `C-S4-contrast-01`.  
No assumption that a figure must exist.  
Accessibility: prose complete; alt/detail only if VA exists.

---

## 17. Relationship to AD-010

AD-010 remains a **separate** renderer defect (unsupported structured XM object shapes).

Option B does **not** fix AD-010, but helps the later fix:

- Clearer `kind` / channel hints reduce accidental exotic object shapes.  
- Preferring known supported body families (worked-example stages; diagram elements/relationships) becomes easier to prompt/validate.  
- VA-linked diagrams already intentionally avoid dumping unsupported structure into the learner — B reinforces “graphic via VA, not via dumping XM”.

Do **not** redesign the renderer in T-009.

---

## 18. Bounded future implementation surface (for T-011 later)

| Surface | Likely touch | Shared vs Expository |
| ------- | ------------ | -------------------- |
| `lib/expository-contracts.js` | Normalise/validate enriched commission fields | **Expository-specific** |
| `lib/expository-sibling-prompts.js` | XD/XM/DP prompt guidance for perceptibility + participation + VA link | **Expository-specific** |
| VA schema / `visual-planning-contract.js` / Sprint 38 affordances | Optional `commission_id` on Expository VA rows | **Shared — additive/optional only** |
| `page-vnext-assemble.js` | Pass through / preserve links; diagnostics | Shared assembler paths; Expository branch |
| Renderer | Consume links if present; **no** AD-010 fix here | Shared |

**Avoid:** Editing Interactive prompt family; mandatory VA for every commission; new workflow stage.

---

## 19. Tests / regression gates implied (design only)

| Gate | Intent |
| ---- | ------ |
| First-class Expository focused + full gates | No topology regression |
| Interactive first-class gate | Unchanged sibling protection |
| Contract unit tests | Commission enrichment normalises; lock still 1:1; unknown fields fail closed |
| VA contract tests | Optional `commission_id`; Interactive rows without it still valid |
| Fixture golden paths | Commission → XM → optional VA identity preserved on assemble |
| Negative tests | Uncommissioned XM rejected; VA inventing purpose without anchors flagged (when diagnostics exist) |

No tests implemented in T-009.

---

## 20. Constraints from EQ1 / EQ7 / EQ8 (pointers only)

- **EQ1:** Perceptibility intent must serve the commissioned journey — wrong-spine commissions (C04) are not fixed by this seam.  
- **EQ7:** Artefacts/VA must earn learner-facing presence; channel_hint `visual` is not a quota.  
- **EQ8:** Supporting artefacts must not become a second closing synthesis.

---

## 21. WP4 closure

| Task | Status |
| ---- | ------ |
| T-008 Responsibility map | COMPLETE |
| T-009 XD→XM→DP seam design | **COMPLETE** |
| **WP4** | **COMPLETE** for charter (map + seam finding/design) |

**Next from PLAN:** **S86-T-010** (WP5 typography requirements) when authorised — not started here.
