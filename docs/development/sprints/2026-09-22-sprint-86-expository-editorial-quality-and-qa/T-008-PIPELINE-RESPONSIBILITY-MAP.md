# Sprint 86 — T-008 Expository pipeline responsibility map

**Task:** S86-T-008 / WP4  
**Status:** **COMPLETE**  
**Quality model:** EQ1–EQ8 ([DRAFT-EDITORIAL-PRINCIPLES.md](DRAFT-EDITORIAL-PRINCIPLES.md))  
**Evidence:** Frozen C01–C05 · T-007 synthesis  
**Date:** 2026-09-22  
**Discipline:** Architecture diagnosis only — no implementation, no prompt edits, no new stages.

---

## 1. Question answered

> Where in the current Expository pipeline is each EQ1–EQ8 quality requirement actually owned, enabled, preserved, or at risk?

Topology under investigation:

```text
GLC → MK → LO → EJP → XD → XM → Design Page → assemble → learner-renderer-vnext
```

Hypothesis under test (Sprint 84/85):

> EJP shapes the reading journey. XD composes the explanation. XM realises supporting intellectual artefacts. Design Page shapes learner-facing editorial form. Renderer gives typographic expression.

**Verdict:** Directionally correct for EQ3/EQ5/EQ6 body work, but **incomplete** for EQ1 (no explicit purpose/epistemic-form ownership), **structurally conflicted** for EQ2/EQ4/EQ7/EQ8 (DP furniture + renderer auto-regions + optional Closing), and **split** for EQ5 (commission ≠ visual affordance ≠ supported structured body).

---

## 2. EQ1–EQ8 responsibility matrix

| EQ | Origin | Primary owner | Contributors | Preservation path | Learner realisation | Current risks |
| -- | ------ | ------------- | ------------ | ----------------- | ------------------- | ------------- |
| **EQ1** Purpose & epistemic form | User commission → **GLC** richness framing → **EJP** `journey_intent` / section moves | **EJP** (must establish journey form) | GLC (spine); LO (targets); XD (enact); MK (structure only) | XD must not replan; XM/DP must not rewrite meaning; assemble deterministic | XD `exposition` + title/journey | **MISSING field:** no `epistemic_form` / purpose-fit contract. Neighbouring spine can become authoritative at EJP (C04). Downstream cannot detect drift. LO may encourage competence simplification. XD cannot fully recover if EJP chose wrong spine. |
| **EQ2** Intellectual entry | EJP first-section `purpose` / `conceptual_move`; XD S1 `exposition` | **XD** (writes opening) | EJP (plans entry move); GLC (examples/tensions) | DP must not replace body entry with prospectus | XD S1 (+ H1 title from DP) | **DP orientation** (Overview / Learning purpose / Knowledge summary) systematically precedes body (**all five**). C04: strong entry into wrong problem = EQ1 failure at origin. |
| **EQ3** Progression & attention | **EJP** order, dependencies, extent, moves | **EJP** | XD (realises depth); GLC (richness); LO (refs) | XD must inherit extent/emphasis; DP/XM must not replan | Ordered exposition sections | Ownership largely **CORRECT**. Risk is EQ1 wrong object of attention (C04), not topology. Extent-as-staging evidenced by Bayes 10→20 min EJP behaviour. |
| **EQ4** Development & recurrence | EJP `connections` / `synthesis` / recurrence judgements; XD continuity | **EJP** (plan) + **XD** (enact) | DP (must not duplicate completed work) | Assemble preserves section order | Body recurrence + orientation/Closing | Orientation/Closing **independently regenerate** completed-work repetition (EQ4 type 3). Not forced solely by EJP. C05 productive anchor recurrence is XD success. |
| **EQ5** Representation warrant & participation | EJP `representation_needs` (selective); XD `materials_commission` | **XD** (warrant/commission) | EJP (needs labels); **XM** (body); **DP** (visual affordances); renderer (realise) | Commission lock XM↔XD; DP must not invent pedagogy | XM body and/or DP VA figure + XD prose | **AMBIGUOUS seam:** warrant (XD) ≠ body (XM) ≠ figure (DP VA) ≠ supported structured render. Integration: XD writes prose **before** XM/VA exist. C02 over-gen; C03 warrant; C05 5 materials / 2 figures; C04 figures faithful to wrong journey. |
| **EQ6** Emphasis & trust | EJP rhetorical judgements (soft); **XD** prose | **XD** | EJP (major progression cues) | DP must not re-author cadence | XD exposition | Ownership **CORRECT**. Residual teacherly cadence = prompt/realisation (C01/C02). Not a Design Page job. |
| **EQ7** Learner value & visible structure | DP `page_synthesis` + renderer region labels; hierarchy deferred | **Design Page** (fields) + **renderer** (always-on labels / H2) | EJP/XD (substance); WP5 typography later | Assemble patches DP fields | Orientation region + H1/H2 | **MISPLACED / STRUCTURAL:** renderer always maps overview/learning_purpose/knowledge_summary to labelled regions when present; DP prompt asks for them as thin transport; Interactive DP partial still pressures mandatory knowledge_summary. Flat hierarchy = renderer/typography (WP5) + XD not emitting H3 structure. |
| **EQ8** Form-appropriate single close | EJP final section; XD final `exposition`; DP `closing_paragraph` | **Split / AMBIGUOUS** | EJP plans end; XD consolidates; DP optional Closing | Epistemic form not available as typed input to DP Closing | Last section + `page-closing` | Dual close **systematic** (all five). DP Closing optional in Expository sibling prompt but routinely emitted; no contract forbids co-presence with final-section synthesis. C04 false resolution primarily EJP/XD EQ1; C05 redundant Closing is DP+assembly order. |

---

## 3. Stage responsibility / must-not-own matrix

| Stage | Legitimate responsibilities (vs EQ) | Must NOT own |
| ----- | ----------------------------------- | ------------ |
| **GLC** | Explanatory richness spine; examples/tensions that later entry can use (EQ1 feed, EQ2 material) | Final journey order/extent; epistemic-form lock; commissions; orientation furniture |
| **MK** | Conceptual graph / relationships / misconceptions | Textbook prose; journey; learner furniture |
| **LO** | Intended understanding / competence targets (EQ1 feed) | Section design; commissions; simplifying epistemic form into a single “correct answer” list |
| **EJP** | Whole-resource journey, extent allocation, dependencies, planned recurrence/qualification/synthesis, selective `representation_needs` (EQ1–EQ4, feeds EQ5/EQ8) | Full chapter prose; material bodies; inventing Interactive activities; silent repair via DP |
| **XD** | Section `explanation_intent` + learner `exposition`; continuity; warrant-based `materials_commission`; rhetorical emphasis/trust (EQ2–EQ6, EQ8 body close) | Replanning EJP order/extent; commissioning ordinary prose into XM to thin exposition; inventing evidence/tasks |
| **XM** | Realise commissioned artefact **bodies** 1:1 with commission lock (EQ5 realisation) | Deciding whether a representation was warranted; rewriting exposition; uncommissioned materials |
| **Design Page** | Title; thin `page_synthesis` transport; optional Closing; section/page visual affordance planning (EQ2 furniture risk, EQ5 figures, EQ7/EQ8) | Repairing EJP/XD/XM intellectual coherence; inventing pedagogy or activities; deciding warrant after the fact; becoming second exposition |
| **Assembly** | Deterministic EJP→XD→XM→DP merge; empty `activities[]` | Content invention; fixing EQ1 drift |
| **Renderer** | Orientation/exposition/closing regions; supported structured XM; VA placement; typography (EQ7/EQ5/AD-010) | Inferring epistemic structure; inventing exposition from `explanation_intent`; inventing figures |

---

## 4. EQ1 — purpose & epistemic form (deep findings)

### Path

```text
user commission → GLC → MK → LO → EJP → XD → (XM/DP)
```

### Where purpose is represented today

| Location | Form |
| -------- | ---- |
| User brief / workflow topic | Upstream of GLC (not an Expository contract field) |
| GLC `title` / sections / examples | Free-text richness |
| LO statements | Competence targets — **not** epistemic form |
| EJP `journey_intent`, section `purpose`, `conceptual_move`, `synthesis` | Free-text journey — **primary practical authority** |
| XD `explanation_intent` / `exposition` | Enacts EJP |

### Epistemic form

**Not explicitly represented** in contracts (`lib/expository-contracts.js`). No `epistemic_form`, `competing_interpretations`, `purpose_fit`, or plurality structure. Prompt language in EJP mentions contrast / qualification / recurrence as judgements inside free-text fields only (`lib/expository-sibling-prompts.js` `TEMPLATES.expository_journey_plan`).

### Where neighbouring spine can become authoritative

**EJP** is the first stage that locks an ordered intellectual journey. If EJP selects a coherent multi-level causal spine instead of historiographical disagreement (**C04**), that spine becomes binding for XD (`Authority / governance`: do not independently replan).

### Can downstream detect drift?

**No.** XD/XM/DP receive the EJP artefact, not a typed commission–purpose check against the original user brief. DP “Narrative continuity” requires fidelity to upstream arc — which **reinforces** a drifted EJP rather than correcting it.

### Can XD recover?

**Not reliably.** XD is forbidden to replan the journey. Recovery would require violating EJP authority.

### LO contribution

LO can help preserve intended understanding when outcomes name the right epistemic object; can also encourage simplification into assessable statements that omit interpretive plurality. Not primary C04 cause, but not a safeguard.

### Evidence

- **C04:** Title/Learning purpose/journey answer outbreak causation, not historians’ disagreement.  
- **C05:** Distinct appraisal forms preserved when EJP/XD stay on validity/truth/non-deductive boundary.

### Classification

**C. RESPONSIBILITY MISSING** (typed purpose/epistemic-form ownership) + **E. TRANSPORT LOSS** (user commission → EJP not typed) + partial **A** (EJP *should* be primary owner once purpose is correctly established).

---

## 5. EQ5 — representation seam (deep findings)

### Channel map (not 1:1)

```text
EJP representation_needs[]     (selective planning labels)
        ↓
XD materials_commission[]      (warrant + kind + intent + constraints)
        ↓
XM materials[].body            (string prose OR structured object)
        ↓
assemble → sections[].materials[]
        ↓
renderer:
  string body → ordinary material path
  stages[] worked example → supported HTML
  elements[]+relationships[] diagram → caption companion ONLY
       + DP visual_affordances (section-after-content) → actual figure
  other object bodies → AD-010 unsupported
```

### A–F answers

| Question | Answer |
| -------- | ------ |
| **A. Warrant** | **XD** decides commissions; EJP may hint via `representation_needs`. Prompt: commission only when form adds value beyond prose. |
| **B. Explanatory purpose** | Free-text commission `intent` / `constraints` (+ EJP needs). **No** dedicated “make perceptible” field. |
| **C. Realisation** | **XM** bodies under `validateCommissionLock`. |
| **D. Visual affordance** | **Design Page** optional `visual_affordances[]` (schema 38.4). Separate from XM. |
| **E. Integration** | XD writes self-complete `exposition` **before** XM/VA exist. No post-XM prose rewrite stage (by design). Soft integration across C01–C05 is structural, not only prompt failure. |
| **F. Accessibility** | VA rows carry `alt_text` / `detailed_description`; XD prose carries essential meaning (correct for EQ5 a11y). Diagram XM intentionally defers graphic to VA. |

### Evidence

- **C02:** over-generation / weak warrant at XD commission (+ DP VA).  
- **C03:** high-warrant mechanism figures when topology is the target.  
- **C04:** figures encode wrong journey (EQ1→EQ5).  
- **C05:** 5 structured commissions vs 2 figures — channels diverge.

### Classification

**B. AMBIGUOUS** (three realisation channels) + **E. TRANSPORT** (perceptibility purpose soft; no XD←XM integration loop) + warrant ownership largely **A** at XD (prompt-quality / discipline).

### T-009 handoff (sharpened)

T-009 should investigate the **smallest coherent option** for:

1. Encoding what a commission must make perceptible (beyond free-text `intent`).  
2. Whether/how XD prose should participate with artefacts realised only after XM/DP.  
3. Aligning XM structured bodies with DP VA decisions without adding a default new stage.  
4. Keeping accessibility equivalence (prose carries essentials) while improving participation.

Leave solution design to T-009. **Do not** assume post-XM rewriting is required yet.

---

## 6. EQ7 — furniture & hierarchy (deep findings)

### Field creation → render

| Learner label | Created by | Assembled | Rendered |
| ------------- | ---------- | --------- | -------- |
| Overview | DP `page_synthesis.overview` | DP patch | `ORIENTATION_SECTION_DEFINITIONS` → orientation region |
| Learning purpose | DP `page_synthesis.learning_purpose` | DP patch | same |
| Knowledge summary | DP `page_synthesis.knowledge_summary` | DP patch | same |
| Closing | DP `page_synthesis.closing_paragraph` | DP patch | `renderClosingParagraph` after exposition |
| Title | DP `title` (may replace EJP title) | DP patch | `<h1>` |
| Section headings | EJP/XD titles | EJP/XD merge | `<h2>` |

**Renderer source:** `lib/learner-renderer-vnext/build-page-model.js` `ORIENTATION_SECTION_DEFINITIONS` — labels are renderer-owned; presence of fields is DP-owned.

**Assembly:** `lib/page-vnext-assemble.js` `DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS` includes `title`, `page_synthesis`, **`sections`**, visual planning — DP can patch `sections` if emitted (fragility / must-not risk).

**Prompt posture:** Expository DP sibling says orientation is “thin transport” and Closing is optional (`expository-sibling-prompts.js` `TEMPLATES.design_page`). Interactive DP partial contract still treats `knowledge_summary` as mandatory in shared language — sibling override is the intended Expository path.

### Hierarchy below H2

- Intellectual hierarchy: EJP/XD content structure (currently flat section titles).  
- Editorial composition: DP does not emit intra-section hierarchy.  
- Rendered typography: learner-renderer H2 for sections; **0×H3** in all five cases → WP5 + XD structural signalling.

### Classification

**D. MISPLACED / STRUCTURAL** for stacked prospectus as default learner experience (DP + renderer auto-regions + prompt habit) despite DP “thin transport” intent. Hierarchy gap shared with WP5.

---

## 7. EQ8 — dual close (deep findings)

| Close | Owner | Mechanism |
| ----- | ----- | --------- |
| Final substantive section | EJP last section + XD `exposition` | Rendered in exposition region |
| Page Closing | DP `closing_paragraph` | Rendered **after** all exposition |

Both may state “what to carry forward.” DP rules forbid new claims and allow omit — but do not treat final-section synthesis as making Closing unnecessary. Assembly always places Closing after body when field present.

- **C04:** false resolution is primarily EQ1 at EJP/XD; Closing reinforces integrated model.  
- **C05:** S5 consolidates well; Closing duplicates (EQ4 type 3).

### Classification

**B. AMBIGUOUS** ownership of “the” close + **A** for body consolidation at XD when EQ1 holds. Not solely an assembly bug — contract/prompt allows dual presence.

---

## 8. AD-010 — bounded root-cause diagnosis (functional)

| Item | Value |
| ---- | ----- |
| String | `Structured material body is not supported for learner rendering.` |
| Emit site | `lib/learner-renderer-vnext/expository-structured-materials.js` → `renderUnsupportedStructured` |
| Type assignment | `buildExpositionStructuredMaterial`: non-string body that is **not** compact worked-example (`stages[]`) and **not** diagram (`elements[]`+`relationships[]`) → `expository_structured_unsupported` |
| Mirror | `lib/learner-renderer-vnext-browser.js` |
| Evidence | C01×7 + C02×4 + C03×4 + C04×3 + C05×5 = **23** |

**Cause class:** Renderer supports only two structured XM shapes; XM commonly emits other structured objects (and/or diagram-like objects that fail the exact schema). Unsupported bodies always surface the fallback note.

**Separate channel fact:** Supported diagram bodies intentionally do **not** dump structure; graphics are owned by DP section visual affordances. So:

- materials ≠ figures by design (C05);  
- AD-010 can appear **beside** realised figures when an unsupported structured companion (or extra material) is also present.

**Not:** assembly dropping a mapping of a supported type; not Interactive `renderUnsupportedMaterial` (“Unsupported material kind…”).

**Classification:** **F. FUNCTIONAL DEFECT** (S86-AD-010). Outside EQ model. Fix later — not in T-008.

---

## 9. Responsibility classifications (A–F summary)

| Class | Findings |
| ----- | -------- |
| **A. Already correct** | EQ3 progression/extent (EJP→XD); EQ6 prose emphasis (XD); EQ5 warrant *decision* at XD (discipline); XM commission lock; renderer must not invent exposition |
| **B. Ambiguous** | EQ5 realisation channels (XM body vs DP VA vs supported structured); EQ8 dual close; EQ4 completed-work repetition split across EJP plan vs DP regeneration |
| **C. Missing** | EQ1 typed purpose / epistemic-form ownership & transport from user commission |
| **D. Misplaced** | Learner-facing stacked orientation as default “chapter start” despite thin-transport intent; DP `sections` in owned patch list (risk of exposition overwrite) |
| **E. Transport / contract loss** | User brief → EJP; perceptibility purpose soft in commissions; no XD←XM participation loop; Closing lacks epistemic-form input |
| **F. Functional defect** | AD-010 unsupported structured XM bodies |

**No new stage proposed.** Default remains: improve responsibility and information flow inside the sibling pipeline.

---

## 10. Production files / symbols inspected (read-only)

| File | Symbols / focus |
| ---- | --------------- |
| `lib/expository-sibling-prompts.js` | `TEMPLATES` GLC, LO, EJP, XD, XM, DP |
| `lib/expository-contracts.js` | `normalizeExpositoryJourneyPlan`, `normalizeExpositoryDevelopment`, `normalizeExpositoryMaterials`, `validateCommissionLock` |
| `lib/page-vnext-assemble.js` | `DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS`, `assembleExpositoryPageFromPartials`, merge helpers |
| `lib/learner-renderer-vnext/build-page-model.js` | `ORIENTATION_SECTION_DEFINITIONS`, `buildExpositionSections`, `synthesisBody` |
| `lib/learner-renderer-vnext/expository-structured-materials.js` | `buildExpositionStructuredMaterial`, `isDiagramSpecBody`, `isCompactWorkedExampleBody`, `renderUnsupportedStructured` |
| `lib/learner-renderer-vnext/render-page.js` | orientation / exposition / closing order (via model) |
| `lib/visual-planning-contract.js` | VA anchors incl. `closing_paragraph` |
| `lib/ld-design-page-partial-contract.js` | Interactive DP partial (contrast with Expository sibling) |
| `domains/learning-design/domain-learning-design-step-patterns.md` | Expository topology stubs |

No production files modified.

---

## 11. Implications for established stage slogan

| Claim | After T-008 |
| ----- | ----------- |
| EJP shapes the reading journey | **Hold** — and must also own EQ1 purpose/epistemic form (currently underspecified) |
| XD composes the explanation | **Hold** — primary EQ2/EQ6 realisation; cannot fix wrong EJP |
| XM realises supporting artefacts | **Hold** — bodies only; not warrant; not always the learner figure |
| Design Page shapes learner-facing editorial form | **Qualify** — currently also sources systematic prospectus/Closing furniture (EQ7/EQ8 risks) and owns VA figures (EQ5 split) |
| Renderer gives typographic expression | **Hold** — also realises orientation labels and AD-010; hierarchy/WP5 remains open |

---

## 12. T-009 status note

**T-009 remains PENDING.** Scope sharpened (see §5): perceptibility encoding, XD↔XM/VA participation without default new stage, materials≠figures alignment, a11y preserved.

**Next after T-008:** S86-T-009 (still WP4).
