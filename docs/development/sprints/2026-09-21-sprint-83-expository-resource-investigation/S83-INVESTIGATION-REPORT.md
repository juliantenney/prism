# Sprint 83 — Expository Resource Investigation Report

**Sprint:** 83 — Expository Resource Investigation  
**Status:** **Accepted** — investigation complete ([S83-D03](decisions.md#s83-d03--accept-investigation-report-and-close-sprint-83)); Sprint 83 **CLOSED**  
**Mode:** Investigation only — **no implementation**; **no production prompt/schema/UI/renderer changes**  
**Backlog:** [PB-FA-011](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-011--expository-resource)  
**Date:** 2026-09-21  
**Closure:** [SPRINT-83-CLOSURE.md](SPRINT-83-CLOSURE.md)  
**Planning constraints (binding handoff):** [S83-D04](decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline) — sibling prompt-family · protected Interactive baseline

> This report is the authoritative substantive handoff to a subsequent Expository Resource Planning sprint. Findings below are **not** architecture decisions. Exact topology, schemas, prompt contents, naming, MK extension, continuity ownership, Interactive consumption, and Research Synthesis relationship remain for Planning.

### How to read this document

| Marker | Meaning |
| ------ | ------- |
| **Fact** | Observed in current implementation / pack contracts |
| **Inference** | Reasonable conclusion from facts |
| **Hypothesis** | Working idea under test (not decided) |
| **Recommendation (Planning)** | Candidate matter for a later Planning sprint — not designed here |

---

## Executive summary

**Fact.** First-class Learning Design Self-study / Workshop resources share one pipeline approximately:

```text
Content / Normalize → Generate Learning Content → Model Knowledge → Learning Outcomes
  → Episode Plan (deterministic) → DLA → GAM → [Learning Sequence] → Design Page
  → deterministic assembly → learner-renderer-vnext
```

**Fact.** Create products (Self-study vs Workshop) seed **delivery factors**; they do **not** select separate stage prompt catalogues. Product-ish behaviour is largely **runtime augmentation** on shared pack prompts.

**Inference.** The established **subsystem progression** is broadly reusable as an architectural spine for Expository. The **Interactive-specific commissioning semantics** of DLA/GAM (and Interactive-oriented Episode Plan templates) are **not** cleanly reusable as Expository pedagogy via prompt swap alone.

**Hypothesis (supported, not decided).** Expository Resource warrants a **purpose-built prompt family** (and likely **contract adaptations** at detailed-development / supporting-material / planning stages) over shared machinery — consistent with the Sprint 83 charter hypothesis.

**Inference.** Explanatory richness today lives primarily in **`learning_content`** (and later material bodies), not in **`knowledge_model`**. Current Model Knowledge is a **conceptual graph**, not a proto-textbook. Downstream Interactive stages cannot reliably recover examples/evidence/qualifications that MK never stored.

**Inference.** The **renderer** can already present rich reading/viewing content (prose, tables, MathJax, figures, orientation). A predominantly Expository product likely does **not** need a new renderer architecture — but does need a generation/assembly path that is not forced through Interactive activity/evidence/workspace gates.

**Open.** Research Synthesis vs Expository remains unresolved; Research domain emphasises multi-source provenance and extraction/interpretation/synthesis separation, which is related but not identical to LD Expository.

---

## 1. Observed current architecture

### 1.1 Create products and Interactive naming

**Fact.** Create UI first-class LD outputs are **Self-study resource** and **Workshop** only (`self_study_resource` | `workshop` in `app.js`). “Interactive Learning Resource” in Sprint 83 materials names this activity-centred page family, not a separate Create enum.

**Fact.** Both products seed `session_materials` including `"page"` and differ mainly by delivery factors (e.g. `self_directed`/`async` vs `live_workshop`/`in_person`).

### 1.2 Stage machinery (absolute paths)

| Stage | Primary locations |
| ----- | ----------------- |
| Step policy + pack prompts | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Artefact contracts | `domains/learning-design/domain-learning-design-artefacts.md` |
| Create / topology / prompt resolve | `app.js` (`getLdCreateOutputTypePrimaryFactorSeed`, `resolveStepPromptText`, `applyWorkflowStepRuntimePromptAugmentations`, …) |
| KM / LO capture | `lib/workflow-artefact-json-strict.js` |
| Episode Plan derive | `lib/episode-plan-v1-templates.js`, `lib/episode-plan-v1-vocabulary.js`, `lib/page-shell-create.js` |
| DLA | `lib/ld-dla-page-enrich-contract.js`, `lib/page-dla-enrich.js` |
| GAM | `lib/ld-gam-page-enrich-contract.js`, `lib/page-gam-enrich.js`, `lib/gam-canonical-assembler.js` |
| Assembly | `lib/page-vnext-assemble.js` |
| Renderer | `lib/learner-renderer-vnext/` |

### 1.3 Assembly order (**Fact**)

From `lib/page-vnext-assemble.js`:

```text
episode_plan → dla → gam → learning_sequence → assessment_* → design_page
```

---

## A. Current first-class pipeline

See Executive summary and §1. Authority flow:

| Stage | Owns | Key consumers |
| ----- | ---- | ------------- |
| Normalize / Generate Learning Content | Cleaned source / teaching-ready `learning_content` | MK (prefers LC); Design Page assimilation |
| Model Knowledge | `knowledge_model` conceptual graph | LO; DLA enrichment wording |
| Learning Outcomes | Assessable `learning_outcomes[]` | EP derive; DLA; assessment |
| Episode Plan | Frozen archetype + beats → page shell | DLA obligation population |
| DLA | Activity commissions, tasks, evidence, material rows (not bodies) | GAM |
| GAM | Material bodies from DLA commissions | Assembly / renderer |
| Learning Sequence | Timing / progression | Assembly / framing |
| Design Page | Title, `page_synthesis`, visual planning | Assembly top-level |
| Assembly | Merge partials | Renderer |
| Renderer | HTML learner experience | Learner / export |

**Confidence:** High for core page pipeline; Medium for exact default topology variants under sparse briefs.

---

## B. Prompt-family architecture

### Facts

1. Domain pack embeds **one shared `promptTemplate` per canonical step** — no Self-study vs Workshop prompt directories.
2. Create product choice → **factor seeds** → topology heuristics + **gated runtime augmentations**.
3. Live DLA/GAM often use **canonical assemblers** (`assembleDlaCanonicalContract`, GAM canonical assembler) layered on pack templates.
4. Episode Plan / some assessment steps use `v2_locked` (deterministic; empty Copilot body).

### Implications for Expository

| Finding | Kind |
| ------- | ---- |
| Mechanism already supports product-specific behaviour via factors + overlays | **Fact** |
| A first-class Expository Create product could fit the same selection pattern **if** Expository has its own pack stage templates / contracts / gates | **Inference** |
| Reusing Interactive DLA/GAM templates for Expository would encode production/evidence/workspace pedagogy into exposition | **Inference** |
| Smallest architecture: product-specific prompt family + selective contract forks — **not** a generic extensibility framework | **Recommendation (Planning)** |

**Prompt divergence likely required?** **Yes** for detailed-development and supporting-material stages (and likely episode-level planning). **Possibly no** for pure conceptual Model Knowledge if its job remains a product-independent knowledge graph. **Uncertain** for Learning Outcomes (prompt emphasis may change; contract may not).

---

## C. Model Knowledge

### Stage finding card

| # | Item | Finding |
| - | ---- | ------- |
| 1 | Current role | Structured conceptual model for planning (`concepts`, `relationships`, `groupings`, `processes`, `misconceptions`) |
| 2 | Current contract | Soft shape validation; `concepts` must be array; other keys coerced (`workflow-artefact-json-strict.js`) |
| 3 | Interactive-specific assumptions | Mild — framed for reuse in activity/assessment design; not itself Interactive |
| 4 | Product-independent capability | High — conceptual inventory/graph is reusable |
| 5 | Expository pedagogical role | Preserve **intellectual raw material** and dependencies — **not** finished exposition |
| 6 | Prompt divergence likely? | **Maybe** — only if Expository needs different extraction emphasis; do not turn MK into a textbook by prompt alone |
| 7 | Contract adaptation potentially required? | **Open** — only if Planning decides examples/evidence/qualifications/formalisms must be first-class KM fields |
| 8 | Naming/semantic-fit? | “Model Knowledge” is relatively product-neutral; low rename urgency |
| 9 | Evidence | Artefacts §2; step-patterns §3; photosynthesis KM fixture; KM contract tests |
| 10 | Confidence / open | **High** on compression vs LC; **open** whether Expository MK needs more/different structured fields |

### Critical richness finding

**Fact.** Examples, sectioned explanation, and teaching progression live in **`learning_content`** / normalize (`keep_examples`), not as KM fields.

**Fact.** KM fixtures show definitions + relationship graph + processes + misconception clarifications — not examples arrays, evidence anchors, or formal representations.

**Inference.** Current MK **compresses away** much of the raw material excellent exposition needs **unless** Expository stages also consume `learning_content` / source directly.

**Recommendation (Planning):** Decide the authority split:

- A — semantic/source knowledge in MK (possibly extended);  
- B — explanatory treatment planned downstream;  
- plus whether Expository spine is **LC → …** rather than **KM-only → …**.

Do **not** expand MK into a proto-textbook casually.

---

## D. Learning Outcomes

| # | Item | Finding |
| - | ---- | ------- |
| 1 | Current role | Measurable/assessable statements of intended learning |
| 2 | Current contract | `learning_outcomes[]` with `statement`, `related_concepts`, `cognitive_level`, … |
| 3 | Interactive assumptions | Prompt explicitly reused for **assessment and activity design**; cognitive levels feed EP archetypes |
| 4 | Product-independent capability | High at artefact level (no materials/beats/workspaces) |
| 5 | Expository role | Still define what understanding/competence the chapter aims at — may emphasise understanding over production verbs |
| 6 | Prompt divergence likely? | **Likely mild** (emphasis/voice), not a new taxonomy |
| 7 | Contract adaptation? | **Probably not** required initially |
| 8 | Naming? | “Learning Outcomes” largely product-independent |
| 9 | Evidence | Artefacts §3; step-patterns §4; EP `COGNITIVE_TO_ARCHETYPE` coupling |
| 10 | Open | Whether Expository LOs must remain “assessable/observable” in Interactive sense; Bloom vocabulary normalisation (`understanding` vs `understand`) |

---

## E. Episode-level planning

| # | Item | Finding |
| - | ---- | ------- |
| 1 | Current role | Deterministic derive of frozen Episode Plan V1 + page shell from LOs |
| 2 | Current contract | `{ archetype, beats: [{ function }] }` only — **no content payload** |
| 3 | Interactive assumptions | **High** — templates include guided_practice, independent_performance, verification, transfer; population feeds **activity** obligations |
| 4 | Product-independent capability | Ordered instructional-function **concept** is reusable; current frozen templates are Interactive choreography |
| 5 | Expository role | Represent an **intellectual journey** (introduce → unpack → distinguish → demonstrate → synthesise…) with emphasis/depth/elaboration/representation needs |
| 6 | Prompt divergence? | EP is **not LLM-prompted** today (`v2_locked`); Expository would need new **derive rules** and/or an LLM planning stage — not Interactive template reuse |
| 7 | Contract adaptation? | **Likely yes** if Planning wants concept-linked progression, elaboration intent, representation needs, or cross-episode dependencies — V1 forbids extra fields |
| 8 | Naming? | “Episode Plan” + `activity_id` strongly Interactive; candidate Planning question: keep subsystem, rename Expository role |
| 9 | Evidence | `episode-plan-v1-*.js`; artefacts §3a; FunctionEnum includes both expository-friendly (`explanation`, `example`, `non_example`) and Interactive performance beats |
| 10 | Open | Can a subset of FunctionEnum serve exposition-only journeys, or is a distinct journey artefact needed? |

**Inference.** EP can sequence **instructional moves**, but cannot currently encode an **expository content journey** through knowledge (no concept ids, no KM links, no elaboration specs).

---

## F. DLA / detailed development

| # | Item | Finding |
| - | ---- | ------- |
| 1 | Current role | Commission learner **activities** and **required materials** (not bodies) on partial page |
| 2 | Current contract | Canonical DLA sections requiring `learner_task`, `expected_output`, `evidence_decision`, load-bearing `response_fulfilment`, bridges, transfer rules, etc. (`ld-dla-page-enrich-contract.js`) |
| 3 | Interactive assumptions | **Constitutional** — production, evidence-as-grounds, workspaces, diagnostic review, Active Learning domain principle |
| 4 | Product-independent hooks | Archetypes, presentation material types, claim-warrant discipline (S78-DP), attachment honesty |
| 5 | Expository role | How this part of the knowledge should be **explained and developed** for understanding (invite thought; not require evidence capture) |
| 6 | Prompt divergence? | **Yes — mandatory** if this subsystem is reused |
| 7 | Contract adaptation? | **Yes** if reused — many required Interactive fields are incompatible with exposition-first; alternative: **bypass/replace** stage for Expository topology |
| 8 | Naming? | “Design Learning Activities” / DLA **obscures** Expository responsibility — strong semantic-fit issue |
| 9 | Evidence | DLA role text; S78-WS-1 (“Study/read… are not load-bearing production”); S78-T-041 transfer must not be mere reading |
| 10 | Confidence | **High** that prompt-only reuse is insufficient |

**Fact (quote essence):** DLA owns learner production design; study/read/verify alone are not load-bearing production.

---

## G. GAM / supporting material

| # | Item | Finding |
| - | ---- | ------- |
| 1 | Current role | Author material **bodies** strictly from DLA commissions (1:1 rows) |
| 2 | Current contract | Commission lock; Markdown/checklist bodies; instructional depth + formal consistency gates |
| 3 | Interactive assumptions | Activity-scoped materials; workspace blanks; guided review; practice independence |
| 4 | Product-independent capability | High-quality Markdown authorship, depth, delayed disclosure, formal fidelity |
| 5 | Expository role | Commission explanatory examples, cases, graphics, tables, timelines, worked demonstrations, evidence extracts as **supporting intellectual artefacts** |
| 6 | Prompt divergence? | **Yes** if reused |
| 7 | Contract adaptation? | **Likely** — need non-activity / resource-level commissions or a different envelope; graphics claim-scope today largely on **Design Page** |
| 8 | Naming? | “Generate Activity Materials” is Interactive-specific |
| 9 | Evidence | `ld-gam-page-enrich-contract.js`; Design Page visual affordances |
| 10 | Open | Is GAM the right body-author for chapter-level exposition, or a sibling stage with a different commission schema? |

---

## H. Narrative continuity

**Facts**

- Continuity mechanisms are largely **activity-chained**: `intellectual_coherence_bridge`, Learning Sequence transitions, GAM page closure → `study_tips`.
- Design Page / thin-assembly coherence **transports** overview/purpose/knowledge_summary and must not rewrite activity materials into a new synthesis.
- Context boundaries: many steps rely on chat continuity; GAM embeds DLA commission JSON deliberately.

**Inferences**

- Independently good episode/activity content will **not** automatically yield a coherent book-chapter argument.
- Expository needs an explicit **whole-resource continuity owner** (section/claim-chain/chapter) — candidate Planning decision.
- Current pipeline is structurally biased toward **good chunks** (activities/partials) with thin glue.

**Confidence:** High on activity bias; Medium on exact failure modes without a live Expository experiment.

---

## I. Learner assembly and Page

| # | Item | Finding |
| - | ---- | ------- |
| 1 | Current role | Merge partials → render activity-centred learner page |
| 2 | Current contract | Page schema 2.0.0; activities + materials + synthesis + visuals |
| 3 | Interactive assumptions | Sequence of activities; workspaces/checks often present; composition Orient/Learn/Do/Check |
| 4 | Reusable capabilities | Prose/Markdown, tables, MathJax, figures, orientation sections, a11y baseline, study moments (S81) |
| 5 | Expository role | Present a predominantly reading/viewing intellectual journey |
| 6 | Prompt divergence? | N/A for deterministic assembly; Design Page prompt may need Expository voice |
| 7 | Contract adaptation? | **Possibly** — e.g. activities optional / sections primary; confirm zero-workspace pages pass validation |
| 8 | Naming? | “Page” / “activity” vocabulary Interactive-leaning; renderer machinery reusable |
| 9 | Evidence | `learner-renderer-vnext/`; S81-T-003 study moments; thin-assembly contracts |
| 10 | Inference | **New renderer architecture not indicated**; generation path adaptation is |

---

## J. Relationship to Interactive

**Not implemented; evidence only.**

**Inference.** A realised Expository representation could plausibly become grounded intellectual input for later Interactive design (case → case-analysis; worked example → problem+compare; etc.) **if** authority boundaries prevent Interactive DLA from re-inventing or contradicting the exposition.

**Recommendation (Planning):** Treat Expository→Interactive as a **later** dependency. First establish whether Expository itself can be excellent. Do not make Interactive consumption a requirement of first Expository implementation.

---

## K. Research Synthesis relationship

**Fact.** Research domain pack emphasises source grounding, provenance, extraction vs interpretation vs synthesis distinction (`domains/research/`).

**Fact.** LD Expository (PB-FA-011) emphasises rich coherent explanation of a body of knowledge.

**Possible distinction (hypothesis, not decided):**

| | Expository | Research Synthesis |
| - | ---------- | ------------------ |
| Job | Richly explain a body of knowledge | Construct exposition via explicit multi-source synthesis |
| Stress | Narrative richness, representation, pedagogical elaboration | Provenance, citation, competing claims, source fidelity |

**Verdict:** **Keep open.** Evidence supports conceptual relatedness, not identity or forced merge. Insufficient to declare Research a specialised Expository treatment or a permanently separate product.

---

## Stage findings matrix (compact)

| Stage | Prompt family needed? | Contract change? | Rename urgency | Fit for Expository |
| ----- | --------------------- | ---------------- | -------------- | ------------------ |
| Generate Learning Content | Possibly (expository spine) | Low | Low | Strong candidate richness source |
| Model Knowledge | Maybe | Open | Low | Reusable graph; insufficient alone for richness |
| Learning Outcomes | Mild | Probably no | Low | Reusable |
| Episode Plan | New derive/plan semantics | Likely | Medium–High | Machinery reusable; V1 Interactive |
| DLA | Yes if reused | Yes or bypass | High | Poor semantic fit as-is |
| GAM | Yes if reused | Likely | High | Authorship reusable; envelope Interactive |
| Learning Sequence | Maybe | Open | Medium | Timing less central for async chapter |
| Design Page | Likely voice/role | Mild | Low–Medium | Orientation/visuals reusable |
| Assembly | No | Possibly schema | Low | Reusable merge |
| Renderer | No | Mild validation | Low | Reusable display |

---

## Cross-cutting answers

1. **Is existing subsystem architecture broadly suitable?**  
   **Yes for progression/machinery** (Fact/Inference). **No for Interactive DLA/GAM semantics as-is** (Inference, high confidence).

2. **Principally a product-specific prompt family over existing subsystems?**  
   **Partially.** Prompt family is necessary and fits existing selection mechanisms (**Fact/Inference**). **Insufficient alone** for DLA/EP V1 / activity-scoped GAM without contract or topology adaptation (**Inference**).

3. **Which stages need contract/schema adaptation?**  
   **Likely:** Episode-level planning, detailed development (DLA-equivalent), supporting materials (GAM-equivalent), possibly page schema for non-activity primary structure. **Uncertain:** MK field extensions. **Probably not initially:** LO artefact shape, renderer architecture.

4. **Where should expository richness be represented/commissioned?**  
   **Inference:** Preserve raw material upstream (`learning_content` and/or enriched MK); **plan** elaboration/representation in an Expository planning/development stage; **realise** supporting artefacts in a materials stage; **assemble** as a coherent whole — not a mechanical checklist of elaborations.

5. **Does MK preserve sufficient raw material for excellent exposition?**  
   **As sole spine: No** (**Inference**, high). It preserves concepts/relations/misconceptions; it does not preserve examples/evidence/qualifications/formalisms as first-class fields. LC/source still hold much richness.

6. **Whole-resource narrative continuity?**  
   **Weak today for chapter-like authored wholes** (**Inference**). Continuity is activity-chained with thin page glue.

7. **Assembly/Page without separate renderer?**  
   **Yes, display-capable** (**Inference**, high). Generation/validation path must not force Interactive production/workspaces.

8. **Which names are reusable vs Interactive-specific?**  
   - Relatively reusable: Model Knowledge, Learning Outcomes, Page/renderer, assembly.  
   - Interactive-specific or misleading for Expository: Design Learning Activities (DLA), Generate Activity Materials (GAM), Episode Plan/`activity_id` framing, many EP beat names in frozen templates.

9. **What must the Planning sprint decide?**  
   See § Planning handoff below.

---

## Confirmed constraints

- Do not implement Expository, author production Expository prompts, or change schemas/UI/renderer in Sprint 83.  
- Do not convert pedagogical quality lens into enums/schemas here.  
- Do not reopen settled Interactive alpha paths without evidence.  
- Accessibility: alpha baseline only; no WCAG claim.  
- QA remains an operating process, not this sprint’s theme.

---

## Things that do **not** need changing (on current evidence)

| Item | Rationale |
| ---- | --------- |
| Deterministic partial-assembly pattern | Product-independent merge of stage-owned captures |
| Learner-renderer-vnext as display engine | Already supports rich reading/viewing artefacts |
| Shared Create→factors→augmentations selection pattern | Can host an Expository product without a generic framework |
| LO artefact as assessable intents | Likely reusable with prompt emphasis only |
| MK as conceptual graph (role) | Appropriate if not forced to be the sole richness store |
| Claim-scope / formal-fidelity / graphics a11y disciplines | Reusable quality protections |

---

## Open questions (investigation)

1. Should Expository’s primary spine be `learning_content` (+ source), with KM as fidelity graph — or an extended KM?  
2. New topology stage vs forked DLA/GAM contracts vs pre-Interactive exposition artefact?  
3. Minimum page schema for Expository (activities optional?).  
4. Who owns whole-chapter continuity and final synthesis?  
5. How do visual commissions bind without activity IDs?  
6. Cognitive engagement invites (predict/reflect) without evidence/workspaces — which fields, if any?  
7. Research Synthesis: separate product vs specialised Expository treatment?  
8. Bounded later experiment: commission Expository-like output via existing machinery **without** production prompt edits (operator-authorised only).

---

## Candidate matters for the Planning sprint

1. Product definition and Create catalogue entry for Expository Resource.  
2. Topology: which stages exist; which Interactive stages are bypassed, forked, or replaced.  
3. Prompt-family design (still not authored in investigation) per stage.  
4. Contract adaptations for planning / detailed development / materials / page.  
5. Authority model: source → LC → MK → outcomes → exposition → (optional later Interactive).  
6. Continuity ownership and synthesis rules.  
7. Naming of Expository stage roles vs shared subsystem names.  
8. Relationship (non-blocking) to Interactive consumption and Research Synthesis.  
9. Acceptance criteria for “excellent exposition” using the pedagogical quality lens (judgement, not checklist).  
10. Whether a controlled experiment is authorised before implementation.

---

## Pedagogical quality lens — architectural implications (not a schema)

| Lens | Architectural implication |
| ---- | ------------------------- |
| Conceptual structure | Needs planning that can express dependencies, emphasis, cumulative development — EP V1 insufficient as content journey |
| Explanation | Needs development stage that unpacks meaning/how/why — not production commission |
| Appropriate elaboration | Commission forms of help as judgements, not mandatory ingredient lists — materials stage must accept diverse intellectual artefacts |
| Representation | Visual/formal planning must attach to exposition units; Design Page graphics pattern is a starting point |
| Evidence / provenance | Preserve claim scope and source grounding; subject-variable; do not let plausibility become asserted knowledge |
| Narrative continuity | Explicit whole-resource owner; avoid chunk-only bias |
| Cognitive engagement without evidence | Distinct from Interactive workspaces/feedback |

---

## Suggested later experiment (not authorised now)

**Idea:** Using an existing rich `learning_content` + KM + LO set, attempt an operator-led Expository-like commissioning **without** modifying production prompts — e.g. manual brief / temporary non-production notes — to probe continuity and richness loss.

**Requires separate authorisation.** Do not modify production prompts for this under Sprint 83.

---

## Primary evidence index

- `domains/learning-design/domain-learning-design-step-patterns.md`  
- `domains/learning-design/domain-learning-design-artefacts.md`  
- `domains/research/domain-research-*.md` (Research relationship only)  
- `app.js` — Create seeds, prompt resolve, augmentations  
- `lib/workflow-artefact-json-strict.js`  
- `lib/episode-plan-v1-*.js`, `lib/page-shell-create.js`  
- `lib/ld-dla-page-enrich-contract.js`, `lib/ld-gam-page-enrich-contract.js`  
- `lib/page-vnext-assemble.js`  
- `lib/learner-renderer-vnext/`  
- Fixture: `docs/development/sprints/2026-06-15-sprint-44/benchmark-corpus/photosynthesis/`  

---

## Status of investigation tasks

All bounded tasks S83-T-001…T-012 in [PLAN.md](PLAN.md) are **COMPLETE**. Operator accepted this report ([S83-D03](decisions.md#s83-d03--accept-investigation-report-and-close-sprint-83)). Sprint 83 is **CLOSED**. Planning sprint **not** opened; implementation **not** authorised. Planning must also honour [S83-D04](decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline).
