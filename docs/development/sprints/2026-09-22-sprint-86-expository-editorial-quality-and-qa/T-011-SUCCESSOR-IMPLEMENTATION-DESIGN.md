# Sprint 86 — T-011 bounded successor implementation design

**Task:** S86-T-011 / WP5  
**Status:** **COMPLETE**  
**Inputs:** T-007–T-010 · EQ1–EQ8 · C01–C05 evidence  
**Date:** 2026-09-22  
**Discipline:** Convergence **design** only — no production implementation.

---

## 1. Product-level outcome (first slice)

> First-class Expository Resources preserve the **commissioned intellectual purpose**, open and close as **chapters** rather than prospectus packs, eliminate the systematic **structured-material rendering defect**, and present with **restrained non-card educational publishing chrome** — without a new generative stage and without destabilising Interactive.

This is the acceptance north star for the first successor implementation sprint — not “perfect book chapter.”

---

## 2. Candidate-change assessment

| Candidate | Evidenced? | Systematic / high-consequence? | Material learner impact? | Responsibility clear? | Interactive-safe? | Coherent with others? | First slice? |
| --------- | ---------- | ------------------------------ | ------------------------ | --------------------- | ----------------- | --------------------- | ------------ |
| **EQ1** purpose / epistemic-form preservation | Yes (C04 hard; C05 contrast) | High-consequence; not all-five | Yes when wrong spine | EJP primary (T-008) | Expository contracts/prompts | Underwrites furniture/close meaning | **YES** |
| **EQ7** front furniture reduction | Yes (all five) | Systematic | High (entry delay) | DP + renderer | Expository path / empty fields | Pairs with EQ8 | **YES** |
| **EQ8** single authoritative close | Yes (all five) | Systematic | High | Prefer XD owner | Expository Closing policy | Pairs with EQ7 | **YES** |
| **AD-010** unsupported structured fallback | Yes (23× / 5 exports) | Systematic **defect** | High (broken chrome) | Renderer (+ XM shapes) | Shared renderer — careful | Independent but must ship | **YES** |
| **Typography CSS MUST** (chrome / rhythm / caption / maths spacing / material h3) | Yes (T-010; editorial CONCERN) | Systematic presentation | Medium–high | Renderer CSS | Shared CSS — Expository-weighted | Completes “chapter feel” | **YES** (bounded) |
| **T-009 Option B** full | Designed; soft integration evidenced | Medium; figures often already useful | Medium | Clear design | Additive VA field shared-sensitive | Independent of furniture | **LATER** |
| **Semantic H3 / subsections** | 0×H3 = missing structure | Low urgency vs furniture | Variable | XD | Expository | Not required for slice coherence | **LATER** |
| **DP `sections` patch risk** | Latent (T-008) | Safety | Prevents overwrite | Assembly | Expository assemble branch | Trivial with DP touches | **YES** (safety) |
| **Font / serif programme** | Investigated; not mandated | Low | Speculative | CSS | Shared | No | **DEFERRED** |
| **Callout kits / design system** | Anti-patterned | — | — | — | — | — | **DEFERRED** |
| **New AI stage / post-XM rewrite** | Rejected T-008/T-009 | — | — | — | — | — | **DEFERRED** |

**Prioritisation rule applied:** systematic learner-facing defects and chapter-shape failures first; designed-but-optional EQ5 binding later; typography only where CSS-only and restrained.

---

## 3. Recommended FIRST implementation slice

### Included

1. **EQ1 — smallest purpose / epistemic-form contract**  
2. **EQ7 — stop default prospectus orientation as chapter lead**  
3. **EQ8 — one consolidating close (XD owns)**  
4. **AD-010 — eliminate learner-facing unsupported fallback without losing meaning**  
5. **Typography — T-010 MUST CSS/renderer presentation only**  
6. **Safety — stop Design Page from patching Expository `sections[]`**

### Explicitly excluded from first slice

- Full **T-009 Option B** (perceptibility fields + VA↔commission binding) — preserve as follow-on design  
- Upstream **H3/subsection generation**  
- Font family change / serif programme  
- Callout component kit  
- New generative stage / post-XM rewrite  
- Forced material↔figure 1:1  
- Changing `70ch` measure  
- Drafting **QA v0.2** document (timing below)  
- CAS / Interactive prompt edits  

### Why this slice is coherent

One product story: **intellectual integrity + chapter form + unbroken materials + calm presentation.**

- EQ1 prevents “beautiful wrong chapter” (C04).  
- EQ7/EQ8 convert assembled prospectus into chapter entry/exit.  
- AD-010 removes visible breakage present on every validation export.  
- CSS typography makes the chapter *look* like the chapter EQ7/EQ8 now allow.  
- DP `sections` safety protects exposition while DP policy changes.

EQ5 Option B is ready but **orthogonal**; shipping it in the same sprint would broaden contracts and dilute live acceptance. Furniture + AD-010 + EQ1 already produce conspicuous gains.

---

## 4. Included changes (design detail)

### 4.1 EQ1 — purpose / epistemic form (smallest viable)

**Avoid:** ontology programme / exhaustive epistemic-form enum.

**Prefer:** small free-text semantic contract on **EJP**, required for Expository:

| Field (conceptual) | Meaning |
| ------------------ | ------- |
| `commissioned_purpose` | One short statement of the intellectual question/task the resource must answer (from user commission / authoritative workflow topic — not a neighbouring paraphrase) |
| `epistemic_form` | Short free-text label of the *kind* of understanding (e.g. “competing interpretive weightings”; “deductive validity vs everyday appraisal”; “mechanism contrast”) — **not** a closed taxonomy |

**Origin:** EJP authors these from authoritative upstream context (user topic/brief + LO + GLC). Do **not** require GLC to invent a parallel ontology; GLC remains richness spine.

**Transport:** Present on normalised EJP; stamped onto assembled page metadata; **XD prompt must treat as binding** (do not replan into a neighbouring spine).

**Validation (bounded):**  
- Presence / non-empty checks.  
- Optional soft consistency: XD `journey`/`exposition` should not contradict (human E2E for C04-class briefs).  
- Do **not** claim automatic detection of all drift.

**Acceptance pressure:** regenerated **interpretive** brief (C04-class) must remain disagreement/weighting, not multi-level outbreak; **C05-class** must keep appraisal distinctions.

### 4.2 EQ7 — opening / front furniture

**Policy (first slice):**

- For Expository learner export, **do not render** labelled Overview / Learning purpose / Knowledge summary as the chapter lead by default.  
- **Retain** resource title (H1) and substantive S1 entry.  
- DP Expository sibling: **omit** `page_synthesis.overview` / `learning_purpose` / `knowledge_summary` unless a later policy explicitly re-enables a single earning field (default = omit).  
- Renderer: if those fields are empty/absent, emit **no** orientation section list.  
- Learning outcomes list: prefer **non-rendered metadata** or a single quiet optional treatment — **default omit from orientation stack** in first slice (avoid replacing three boxes with an LO prospectus).

**Do not** assume all orientation forever forbidden — first slice removes **systematic unearned stack**.

### 4.3 EQ8 — single close

**Rule:**

- **XD final substantive section** owns consolidation (form-appropriate; interpretive plurality allowed).  
- Expository **page-level `closing_paragraph` is omitted by default** (DP does not emit; renderer does not show empty Closing).  
- Do **not** keep “Closing” H2 furniture that restates S-final.

**Owner:** XD (primary); DP must not create a second close.

### 4.4 AD-010 — functional repair (design)

**Problem:** Non-string XM bodies outside compact worked-example / diagram-spec → learner fallback string.

**Smallest repair strategy (ordered preferences):**

1. **Inventory** common unsupported shapes from frozen C01–C05 exports (kinds/body keys).  
2. **Extend support** for 1–2 high-frequency safe shapes **or** render a **generic accessible structured fallback** (nested headings/lists from object keys — instructional content visible, not an error slogan).  
3. Where a **section VA already represents** the same diagram commission, prefer VA graphic + caption path and avoid duplicate unsupported dump **only if** content is otherwise available.  
4. **Never** drop unique instructional content solely to silence the message.

Keep accessibility: essentials still in XD prose where commissioned.

### 4.5 Typography — first-slice CSS/renderer only

From T-010 **MUST** / high-value **SHOULD** that are CSS-only:

- Soften figure/material card chrome (border/radius restraint).  
- Quiet caption treatment (already partly there — ensure consistency).  
- Vertical rhythm tweaks between heading / prose / figure / equation.  
- Display-math isolation spacing (no equation cards).  
- Style bare structured-material internal headings.  
- Restrained table/list polish if low-risk.

**Do not:** change 70ch; change font stack; invent H3 content; build callout kits.

### 4.6 DP `sections` safety

Remove `sections` from Expository-effective Design Page owned top-level patch set (or ignore `sections` on Expository DP partials during assemble). DP must not overwrite XD/XM exposition.

---

## 5. Implementation sequence (dependency order)

```text
1. Contracts / authority (EQ1 fields; DP synthesis optionality; Closing policy; sections patch safety)
        →
2. Expository sibling prompts (EJP/XD/DP behaviour)
        →
3. Assembly policy (stamp EQ1 metadata; ignore DP sections; empty synthesis OK)
        →
4. Renderer / CSS (orientation omit; Closing omit; AD-010 repair; typography MUST)
        →
5. Tests (unit/contract/assembly/renderer + Interactive baseline)
        →
6. Live Expository E2E (pressure set below)
```

| Step | Responsibility | Likely surfaces | Additive vs behaviour change | Scope | Principal risk | Acceptance |
| ---- | -------------- | --------------- | ---------------------------- | ----- | -------------- | ---------- |
| 1 | Contracts | `expository-contracts.js`; assemble owned-fields | Additive EQ1 fields; behaviour change on DP ownership | Expository | Over-validation | Normalise/validate fixtures |
| 2 | Prompts | `expository-sibling-prompts.js` EJP/XD/DP | Behaviour change Expository-only | Expository | Prompt drift / verbosity | Manual + golden JSON shapes |
| 3 | Assembly | `page-vnext-assemble.js` | Behaviour change Expository branch | Mostly Expository | Shared assemble footguns | Unit assemble tests |
| 4a | AD-010 | `expository-structured-materials.js` (+ browser mirror) | Behaviour change shared renderer path | **Shared / Interactive-sensitive** | Hiding content; breaking Interactive materials | Renderer fixtures from C0x shapes |
| 4b | Orientation/Closing | `build-page-model.js` / `render-page.js` | Behaviour change when fields absent | Shared model; Expository content | Accidental Interactive orientation loss | Gate Interactive pages still OK |
| 4c | CSS | `app.js` `getUtilityVnextProseMeasureCss` | Presentation | **Shared** | Visual regressions Interactive | Visual spot-check both products |
| 5 | Tests | `test/` Expository + Interactive gates | Additive tests | Both | Gate count changes | Existing **339/339** baseline + new tests |
| 6 | Live E2E | Workflow Expository journeys | — | Expository | Cost/time | Manual checklist §9 |

---

## 6. Production surfaces — sensitivity classification

| Surface | Class |
| ------- | ----- |
| `lib/expository-contracts.js` | **Expository-only** |
| `lib/expository-sibling-prompts.js` | **Expository-only** |
| `lib/page-vnext-assemble.js` Expository branch / owned fields | **Mostly Expository**; shared assembler — careful |
| `lib/learner-renderer-vnext/build-page-model.js` | **Shared** — change must be field-absence driven, not product-flag hacks that break Interactive |
| `lib/learner-renderer-vnext/expository-structured-materials.js` | **Expository-structured path**; verify Interactive unaffected |
| `lib/learner-renderer-vnext-browser.js` | Mirror — keep in sync |
| `app.js` `getUtilityVnextProseMeasureCss` | **Shared / Interactive-sensitive** presentation |
| Interactive prompts / DLA/GAM packs | **Do not modify** |

**Protect Interactive.** No Interactive prompt edits for Expository purposes (S83-D04).

---

## 7. Tests required (first slice)

1. **Contract/unit:** EQ1 fields normalise; empty purpose fails closed; DP Closing optional; commission lock unchanged.  
2. **Assembly:** Expository page without orientation fields; no Closing region; DP `sections` ignored; EQ1 metadata stamped.  
3. **Renderer:** No Overview/Learning purpose/Knowledge summary/Closing when absent; AD-010 string absent on fixtures rebuilt from prior unsupported bodies **with content still present**; typography smoke.  
4. **Expository regression:** focused first-class Expository suite green.  
5. **Interactive protected baseline:** existing first-class gate (**339/339** engineering baseline) remains required acceptance — new tests may increase totals; report baseline vs new separately.  
6. **Live/manual E2E:** see §8.

---

## 8. Live / manual E2E acceptance

After implementation, manually exercise Expository journeys covering:

| Pressure | Check |
| -------- | ----- |
| Quantitative / maths (Bayes-class) | Maths sound; unboxed; measure OK |
| Low-visual prose (interview-class) | Opens in substance; no prospectus stack; no fake figure pressure |
| Visual mechanism (selection-class) | Figures quiet; materials not erroring |
| Interpretive plurality (WWI-class) | **EQ1:** remains disagreement/weighting — not neighbouring multi-causal spine |
| Abstract conceptual (validity-class) | Distinctions preserved; one close |

**Qualitative pass statements:**

- Chapter enters commissioned intellectual need sooner (no three-part prospectus).  
- One consolidating close (no duplicate Closing furniture).  
- AD-010 string gone **without** lost unique material meaning.  
- Interpretive purpose remains interpretive under C04-class brief.  
- Page feels less card-like; captions quieter.  
- Narrow layout readable.  
- Interactive sample journey unchanged in behaviour/presentation intent.

**Not required for first slice:** perfect book chapter; full Option B participation; H3 density; new fonts.

---

## 9. Later justified follow-ons

1. **T-009 Option B** — perceptibility + participation intents; optional VA↔`commission_id` binding.  
2. Optional **semantic H3/subsections** when XD emits real substructure.  
3. Reading/chrome **font distinction** if maths/licensing/deploy allow.  
4. Richer worked-example / material grammar beyond AD-010 minimum.  
5. Representation mid-section placement refinements.  
6. **QA v0.2** instrument formalisation (see §11).  
7. Soft EQ1 consistency checks / authoring UX surfacing purpose fields.

---

## 10. Deferred (preserve explicitly)

- New generative stage  
- Post-XM rewrite loop  
- Mandatory material↔figure 1:1  
- Tip/info/warning callout kits  
- Deep H4+ hierarchy  
- Serif mandate / design-system programme  
- CAS / per-cell table maths  
- Broad Interactive prompt generalisation  
- Changing 70ch for its own sake  
- Formal WCAG certification programme as WP5 deliverable  

---

## 11. QA v0.2 timing

**Recommendation:** Draft **QA v0.2 at the start of the successor implementation sprint**, immediately before coding the first slice — using T-007 instrument candidates + EQ1–EQ8 — so acceptance inspection uses the updated instrument.

**Rationale:**

- v0.1 must stay frozen through Sprint 86 investigation (done).  
- First-slice changes (purpose-fit, furniture, close) are exactly what v0.2 candidates address.  
- Drafting v0.2 *inside* T-011 would expand scope; drafting *after* implementation risks measuring with a stale instrument.  
- Completing full WP2 acceptance can finish in the successor sprint; Sprint 86 **T-012** should hand off v0.2 as explicit remaining/carry work rather than blocking T-011.

**Do not draft QA v0.2 in T-011.**

---

## 12. WP5 status & remaining Sprint 86 work

| Item | Status after T-011 |
| ---- | ------------------ |
| T-010 typography requirements | COMPLETE |
| T-011 successor implementation design | **COMPLETE** |
| **WP5** | **COMPLETE** (requirements + implementation design) |
| **WP2** | **IN PROGRESS** — QA v0.2 not drafted (handoff) |
| **T-012** | **PENDING** — Sprint 86 closure record when outputs accepted |
| Production implementation of this design | **Not in Sprint 86** — successor sprint |

**T-012 should:** accept investigation/design outputs; record EQ1–EQ8 + T-008–T-011 as handed to successor implementation; note WP2 v0.2 carry; confirm no production code changed in S86; do **not** implement the slice.

**Do not begin T-012 or successor implementation until authorised.**

---

## 13. Cross-references

- Quality model: [DRAFT-EDITORIAL-PRINCIPLES.md](DRAFT-EDITORIAL-PRINCIPLES.md)  
- Synthesis: [T-007-FIVE-CASE-SYNTHESIS.md](T-007-FIVE-CASE-SYNTHESIS.md)  
- Pipeline map: [T-008-PIPELINE-RESPONSIBILITY-MAP.md](T-008-PIPELINE-RESPONSIBILITY-MAP.md)  
- EQ5 seam design (follow-on): [T-009-XD-XM-SEAM.md](T-009-XD-XM-SEAM.md)  
- Typography requirements: [T-010-TYPOGRAPHY-REQUIREMENTS.md](T-010-TYPOGRAPHY-REQUIREMENTS.md)  
