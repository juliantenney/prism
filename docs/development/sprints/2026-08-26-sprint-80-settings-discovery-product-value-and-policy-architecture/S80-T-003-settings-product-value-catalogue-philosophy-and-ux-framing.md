# S80-T-003 — Settings product value, catalogue philosophy and UX framing

**Sprint:** 80 — Settings Discovery, Product Value and Policy Architecture  
**Status:** **COMPLETE — ACCEPTED** (operator-reviewed 2026-08-26)  
**Mode:** Discovery / planning only — **no implementation, activation, deletion, or rewiring**  
**Predecessor:** [S80-T-002](S80-T-002-existing-settings-catalogue-provenance-supersession-audit.md) — COMPLETE / ACCEPTED  
**Next task:** [S80-T-004](S80-T-004-policy-authority-and-stage-ownership-architecture-options.md) — COMPLETE (awaiting acceptance)

---

## 0. Scope and method

**Question answered:** What decisions, if any, should PRISM deliberately expose to an author *after creation*?

**Not answered:** Final A/B/C/D (T-006); technical ownership map of all 41 (T-004 carries only surviving concepts); implementation.

**Evidence base:** T-001/T-002 ledger; Settings effectiveness diagnostic; PB-FA-005; post–canonical DLA/GAM architecture. Where evidence cannot decide, product reasoning is labelled **inference**.

**Hard rule:** “Author could choose X” ≠ “PRISM should expose X.”

---

## 1. Executive product conclusion

The historical 41-control Settings panel is **not** a coherent product surface for current PRISM.

Most controls fall into:

- **PRISM-owned pedagogical decisions** (especially DLA globals), or  
- **Studio/implementation parameters** that never became honest Run behaviour, or  
- **Redundant twins** of one underlying concept.

A small set of **author context / constraint** concepts remains plausible (delivery circumstances, input/source stance, available time, and—when assessment is in-product—assessment intent). Even these must be challenged: several belong more naturally at **Create**, need an **Auto** default, or need consolidation into one policy concept.

**Framing conclusion (analysis, not decision):** “Settings” as a dense control panel miscommunicates authority. **Constraints / requirements** plus optional **advanced overrides** (or “Adjustments”) better matches the original thesis: light elicitation, PRISM judgement by default, selective author steering.

**A–D:** None is logically impossible. Evidence currently **weakens pure A** (delete with no replacement concept) if delivery/time/source remain real author facts, and **weakens “wire all 41” versions of C**. B and a thin C (redesign around few concepts) remain the live contenders for T-006; D remains if operator wants behavioural probes before choosing.

**T-004 handoff:** architecture-map only the small concept set in §18 — not all 41 keys.

---

## 2. Product principles derived

| # | Principle |
| - | --------- |
| P1 | Expose only decisions where the author has information or preference PRISM cannot safely infer. |
| P2 | Prefer **Auto / PRISM decides** over forced stored enums that look authoritative. |
| P3 | One underlying product concept → one control (or one Create question), not N stage mirrors. |
| P4 | Stage-owned pedagogy (EP, PEL, canonical DLA, canonical GAM, Design Page) is not a Settings surface. |
| P5 | A control that cannot state an honest behavioural contract must not ship. |
| P6 | Preserve the anti-interview thesis: do not relocate the 41 catalogue into Create. |
| P7 | Post-creation UI should communicate **constraint / adjustment / override**, not “configure the pipeline.” |
| P8 | Implementation status (T-002) does not confer product legitimacy. |
| P9 | Progressive disclosure for rare overrides; routine UI stays tiny. |
| P10 | Changing a retained control must imply clear regeneration / re-apply semantics (honesty over false liveness). |

---

## 3. Conceptual product classes (A–F)

| Class | Meaning | Default disposition |
| ----- | ------- | ------------------- |
| **A Author context / constraint** | Author knows; PRISM should respect | Candidate for exposure (Create and/or persistent) |
| **B Author preference** | Multiple pedagogically valid outputs | Candidate only if intelligible + Auto default |
| **C Explicit override** | PRISM owns; rare expert override | Advanced / progressive disclosure |
| **D PRISM-owned pedagogical decision** | Contextual stage reasoning | **Not** Settings |
| **E Internal implementation parameter** | Code/pack wiring | Hide / remove from product UI |
| **F Creation / elicitation input** | Needed once at start | Create (minimal), not ongoing Settings panel |

These are **product-facing** and distinct from T-002 implementation status.

---

## 4. Settings vs Adjustments vs Overrides vs Constraints

| Framing | What it tells the user | Fit to evidence | Risk |
| ------- | ---------------------- | --------------- | ---- |
| **1. SETTINGS** | “Configure the workflow like a preferences panel” | Matches current UI copy; mismatches Run reality | False causal promise; invites micromanagement |
| **2. ADJUSTMENTS** | “PRISM is automatic; tweak a few things” | Fits thesis + Auto default | Soft language may hide hard constraints |
| **3. OVERRIDES** | “PRISM decides; experts can force exceptions” | Fits DLA/MK/LS cases | Feels advanced; may scare novices if primary |
| **4. CONSTRAINTS / REQUIREMENTS** | “Tell PRISM facts it cannot invent” | Strongest fit for delivery/time/source | Must not become a long form |
| **5. HYBRID** | Project constraints + optional advanced adjustments/overrides | Best conceptual match to T-002/T-003 | Needs careful IA so it doesn’t become Settings-by-another-name |

**Analysis (not selection):** Hybrid of **(4) + optional (2)/(3)** communicates better than (1). Pure (3) alone underplays genuine constraints. Pure (1) is the status quo failure mode.

---

## 5. Auto / default philosophy

**Proposition:** `UNSET / AUTO = use PRISM’s contextual judgement.`

| Assessment | Detail |
| ---------- | ------ |
| Why it fits | Today’s forced defaults (e.g. `blended`, `balanced`, `moderate`) look like author choices but are often create residues or inert. Auto separates “I didn’t decide” from “I decided X.” |
| Interaction with stages | Auto means stages (PEL/DLA/GAM/LS/DP) interpret context; explicit value is policy ingress. |
| Against premature schema | Do not design typed policy shapes here — only the **product** rule. |
| Implication | Surviving controls should prefer **Auto + few explicit alternatives**, not mandatory enums. |

---

## 6. Creation vs persistent vs post-create

| Placement | When appropriate | Anti-pattern |
| --------- | ---------------- | ------------ |
| **Create / elicitation** | Facts needed to shape the first graph (source vs topic; rough time; delivery) | Dumping 41 questions into Create |
| **Persistent project policy** | Constraints that should travel with the saved workflow across runs | Storing pedagogical micromanagement as durable “truth” |
| **Post-creation adjustment** | Rare change after seeing output (“actually this is self-directed”) | Expecting instant Run change without re-apply honesty |
| **Advanced override** | Facet toggles (e.g. force misconceptions off) | Routine badge of 21 “settings” |
| **Nowhere** | Stage-owned pedagogy; inert duplicates; internal pack options | — |

**Thesis preserved:** Create stays short; most pedagogy stays automatic; only a few author facts/preferences survive.

---

## 7. Complete product-value disposition of the 41 controls

Product disposition codes: `STRONG_AUTHOR_CONSTRAINT` · `PLAUSIBLE_AUTHOR_PREFERENCE` · `PLAUSIBLE_EXPLICIT_OVERRIDE` · `BETTER_AT_CREATE` · `PRISM_OWNED` · `SUPERSEDED` · `INTERNAL_PARAMETER` · `REDUNDANT` · `UNCLEAR`

### 7.1 Workflow (4)

| key | Disposition | Class A–F | Challenge / reasoning |
| --- | ----------- | --------- | --------------------- |
| `delivery_context` | `STRONG_AUTHOR_CONSTRAINT` (+ often `BETTER_AT_CREATE`) | A / F | Author knows classroom vs self-study. PRISM cannot invent delivery circumstances. **Challenge:** should it be Create-primary with Auto thereafter, not a 5-way forever-enum? Self-directed scaffolds already contextualise — explicit value still useful as constraint. |
| `design_scope` | `PLAUSIBLE_AUTHOR_PREFERENCE` / `BETTER_AT_CREATE` | B / F | Author may know “single activity vs module.” **Challenge:** often inferable from brief; may be Create-only. Persistent Settings less valuable than Create signal. |
| `input_strategy` | `STRONG_AUTHOR_CONSTRAINT` (+ `BETTER_AT_CREATE`) | A / F | Whether source material exists is authorial. **Challenge:** Create + upload UX may supersede a standing Settings dropdown. |
| `duration_minutes` | `STRONG_AUTHOR_CONSTRAINT` (consolidate) | A | Author knows available time. **Challenge:** duplicate LS twin; must be **one** “available learning time” concept. |

### 7.2 Model Knowledge (3)

| key | Disposition | Class | Reasoning |
| --- | ----------- | ----- | --------- |
| `include_relationships` | `PLAUSIBLE_EXPLICIT_OVERRIDE` | C | Default: include when source supports. Override: force omit for thin models. Not routine Settings. |
| `include_misconceptions` | `PLAUSIBLE_EXPLICIT_OVERRIDE` | C | Same; source honesty still PRISM-owned. |
| `include_processes` | `PLAUSIBLE_EXPLICIT_OVERRIDE` | C | Same; advanced. |

### 7.3 Normalize (3)

| key | Disposition | Class | Reasoning |
| --- | ----------- | ----- | --------- |
| `structure_mode` | `PLAUSIBLE_EXPLICIT_OVERRIDE` / `BETTER_AT_CREATE` | C / F | Rare; only when Normalize step present. Prefer Auto. |
| `detail_level` | `PLAUSIBLE_EXPLICIT_OVERRIDE` | C | Preference with weak intelligibility for novices. |
| `keep_examples` | `PLAUSIBLE_EXPLICIT_OVERRIDE` | C | Often PRISM should decide from source; override possible. |

### 7.4 Learning Outcomes (4)

| key | Disposition | Class | Challenge |
| --- | ----------- | ----- | --------- |
| `learnerLevel` | `BETTER_AT_CREATE` / `STRONG_AUTHOR_CONSTRAINT` | A / F | Authorial audience fact — usually Create/brief, not post-hoc Settings churn. |
| `numberOfOutcomes` | `PLAUSIBLE_AUTHOR_PREFERENCE` with skepticism | B | Controllable ≠ useful. **Challenge:** forcing N outcomes can fight quality; Auto (PRISM chooses count in band) may be better; persistent Setting often false precision. |
| `cognitiveEmphasis` | `PRISM_OWNED` / `SUPERSEDED` as Settings | D | LO cognitive mix should follow content + design intent; global enum is weak pedagogy. |
| `scope` | `REDUNDANT` | E / F | Overlaps `design_scope`. |

### 7.5 DLA (4) — case study

| key | Disposition | Class | Reasoning |
| --- | ----------- | ----- | --------- |
| `activity_pattern_mix` | `SUPERSEDED` / `PRISM_OWNED` | D | EP beats + PEL + canonical DLA own pattern. Author does not need “guided vs collaborative” global. **Do not ask how to wire into DLA.** |
| `grouping_preference` | `SUPERSEDED` / `PRISM_OWNED` | D | Delivery context + DLA-WB / self-directed rules already constrain grouping. Global override rarely legitimate. |
| `difficulty_level` | `SUPERSEDED` / `PRISM_OWNED` | D | Difficulty emerges from LO + production commissioning, not a Settings dial. |
| `coverage_breadth` | `SUPERSEDED` / `PRISM_OWNED` | D | Coverage owned by DLA LO-operation / design_scope. |

**Case-study conclusion:** On current architecture, authors **do not** need these four as post-creation Settings. Treating them as “to be wired” would recreate competing authority with canonical DLA.

### 7.6 GAM (1)

| key | Disposition | Class | Challenge |
| --- | ----------- | ----- | --------- |
| `session_materials` | `UNCLEAR` → lean `BETTER_AT_CREATE` / product topology, **not** GAM pedagogy | A/F or E | “Page vs deck” is product shape, not materials quality. May belong in Create/product declaration (PB-FA-008), not a GAM Settings knob. |

### 7.7 Learning Sequence (3)

| key | Disposition | Class | Challenge |
| --- | ----------- | ----- | --------- |
| `duration_minutes` | `REDUNDANT` (fold into one time policy) | A | Same concept as workflow duration. |
| `sequencing_granularity` | `PLAUSIBLE_EXPLICIT_OVERRIDE` | C | **Challenge:** should PRISM derive detail from duration + scope? Override possible for facilitators who want lightweight plans. |
| `sequencing_style` | `PRISM_OWNED` lean / weak `PLAUSIBLE_AUTHOR_PREFERENCE` | D / B | `progressive_scaffold` ≠ global scaffolding level. Style often derivable from PEL/outcomes; exposing invites pedagogical micromanagement. Prefer Auto. |

### 7.8 Design Page (2)

| key | Disposition | Class | Challenge |
| --- | ----------- | ----- | --------- |
| `page_profile` | `BETTER_AT_CREATE` / `STRONG_AUTHOR_CONSTRAINT` | A / F | Learner vs facilitator page is authorial product intent — usually known at Create. |
| `include_examples` | `PRISM_OWNED` / weak override | D / C | **Challenge:** whether examples are needed is pedagogical; DP/thin-assembly should decide. Prefer not a Standing Setting. |

### 7.9 Design Assessment (7)

| key | Disposition | Class | Notes |
| --- | ----------- | ----- | ----- |
| `activity_type` | `STRONG_AUTHOR_CONSTRAINT` (assessment product) | A | When assessment is in scope — author exam intent. |
| `total_items` | `PLAUSIBLE_AUTHOR_PREFERENCE` / constraint | B / A | Real for assessment workflows; consolidate with Gen Items count. |
| `coverage_scope` | `PLAUSIBLE_AUTHOR_PREFERENCE` | B | |
| `difficulty_profile` | `PLAUSIBLE_AUTHOR_PREFERENCE` | B | Twin with Gen Items — one concept. |
| `cognitive_demand` | `PRISM_OWNED` lean / weak preference | D / B | Overlaps LO/DA cognitive knobs. |
| `assessment_cadence` | `PLAUSIBLE_AUTHOR_PREFERENCE` | B | More Create/module planning than step Settings. |
| `feedback_display` | `PLAUSIBLE_EXPLICIT_OVERRIDE` | C | Prompt-shaping; advanced. |

### 7.10 Generate Assessment Items (10)

| key | Disposition | Notes |
| --- | ----------- | ----- |
| `number_of_items` | `REDUNDANT` | Twin of DA `total_items` |
| `response_formats` | `PLAUSIBLE_EXPLICIT_OVERRIDE` | Advanced assessment |
| `difficulty_profile` | `REDUNDANT` / consolidate with DA | Different enums = product debt |
| `coverage_mode` | `REDUNDANT` / consolidate with DA coverage | |
| `composition_mode` | `PLAUSIBLE_EXPLICIT_OVERRIDE` | |
| `stimulus_mode` | `PLAUSIBLE_EXPLICIT_OVERRIDE` | |
| `scenario_scope` | `PLAUSIBLE_EXPLICIT_OVERRIDE` | |
| `cognitive_emphasis` | `REDUNDANT` / `PRISM_OWNED` | Repeated cognitive family |
| `feedback_mode` | `PLAUSIBLE_EXPLICIT_OVERRIDE` | Distinct from DA feedback_display — still consolidate conceptually |
| `question_style_mix` | `PLAUSIBLE_EXPLICIT_OVERRIDE` / preference | |

**Assessment family note:** Legitimate **only** when assessment product is in the workflow. Not part of typical learner-page 21. Prefer one assessment-intent concept cluster, not 17 knobs.

---

## 8. Consolidated underlying policy concepts

| Concept ID | Underlying product idea | Historical keys collapsed | Carry to T-004? |
| ---------- | ----------------------- | ------------------------- | --------------- |
| **C1 Delivery circumstances** | How learning is delivered / progressed | `delivery_context` | **Yes** |
| **C2 Source stance** | Topic-only vs provided source vs mixed | `input_strategy` | **Yes** |
| **C3 Available learning time** | Time budget for the resource/session | workflow + LS `duration_minutes` | **Yes** (single authority) |
| **C4 Design breadth** | Single activity → module | `design_scope`, LO `scope` | **Yes** (thin; often Create) |
| **C5 Audience / level** | Who learners are | `learnerLevel` (+ brief) | **Yes** (Create-primary) |
| **C6 Outcome quantity band** | Rough number of LOs | `numberOfOutcomes` | **Maybe** (skeptical; Auto preferred) |
| **C7 Knowledge facet overrides** | Force include/omit KM facets | MK include_* | **Yes** (advanced overrides) |
| **C8 Normalize behaviour overrides** | Structure/detail/examples when normalizing | Normalize trio | **Maybe** (advanced; step-gated) |
| **C9 Product surface shape** | Page vs deck / one-product honesty | `session_materials` | **Yes** as topology — not GAM pedagogy |
| **C10 Page audience profile** | Learner vs facilitator page | `page_profile` | **Yes** (Create-primary) |
| **C11 Assessment intent** | Strategy, count, coverage, difficulty | DA + GAI clusters | **Yes** only for assessment product |
| **C12 Sequence presentation preference** | Granularity/style of plan | LS granularity/style | **Weak** — prefer Auto; optional override |
| ~~C-DLA pedagogy dials~~ | Pattern/group/difficulty/coverage | DLA four | **No** — PRISM-owned |
| ~~C-cognitive global~~ | Cognitive emphasis everywhere | LO/DA/GAI cognitive knobs | **No** as Settings family |

---

## 9. Strong author-constraint candidates

- **C1 Delivery circumstances**  
- **C2 Source stance**  
- **C3 Available learning time** (single)  
- **C5 Audience/level** (usually Create)  
- **C10 Page profile** (usually Create)  
- **C11 Assessment intent** (when assessment product)

---

## 10. Plausible preference candidates

- **C4 Design breadth** (often Create)  
- **C6 Outcome quantity** (weak; Auto better)  
- **C12 Sequence granularity** (weak)  
- Assessment coverage/difficulty (within C11)

---

## 11. Plausible explicit-override candidates

- **C7** MK facet toggles  
- **C8** Normalize toggles  
- Selected assessment format/stimulus advanced knobs (within C11)  
- Possibly LS granularity as “lightweight plan” override

---

## 12. PRISM-owned / superseded decisions

- All **four DLA** Settings  
- Global cognitive emphasis knobs  
- Whether examples are needed (`include_examples`) as standing Setting  
- Instructional scaffolding/pattern/grouping/difficulty as user dials  
- Beat/archetype/journey decisions (already no EP Settings — keep that way)

---

## 13. Better-at-Create / redundant / internal

| Bucket | Items |
| ------ | ----- |
| Better-at-Create | delivery, input_strategy, design_scope, learnerLevel, page_profile, assessment cadence/strategy seeds |
| Redundant | dual duration; LO scope; DA↔GAI twins; repeated cognitive keys |
| Internal / hide | Pack `userOptions` that only exist to inject prompt sentences; inert DLA params as UI |

---

## 14. Honest behavioural contracts (surviving concepts only)

These are **product honesty tests**, not implementations:

| Concept | Honest contract sketch |
| ------- | ---------------------- |
| C1 Delivery | “If you set delivery to self-directed, new/re-applied generation will use self-directed framing and scaffolds; already-captured artefacts are not silently rewritten.” |
| C2 Source | “If you set provided-source, the workflow expects source material and will not pretend topic-only invents your document.” |
| C3 Time | “If you set available time = N minutes, Learning Sequence (re)generation will target that budget.” |
| C5 Level | “If you set learner level, outcome wording and demand will target that level on (re)generation of outcomes.” |
| C7 MK override | “If you force misconceptions off, Model Knowledge (re)generation will omit that facet even when Auto would include it.” |
| C9 Surface shape | “If you choose page-only, PRISM will not also commission a sibling deck as a second primary product.” |
| C11 Assessment | “If you set total items = N and strategy = X, assessment blueprint/items (re)generation will honour N and X.” |

Any control that cannot support a sentence like this fails the product test.

---

## 15. Progressive-disclosure implications

| Layer | Content |
| ----- | ------- |
| Always visible (if any post-create UI survives) | Few constraints: delivery, source stance, time (and product shape if retained) |
| Create | Audience/level, breadth, assessment-in-or-out |
| Advanced / Overrides | MK facets, Normalize, assessment stimulus/format minutiae, optional LS granularity |
| Never | DLA pedagogy dials; duplicate twins; cognitive globals |

---

## 16. A / B / C / D option analysis (no winner)

### A — DELETE SETTINGS

| | |
| - | - |
| **For** | Current panel largely dishonest; most knobs superseded or inert; deletes false promise. |
| **Against** | Author still has real constraints (delivery/time/source); deleting with no Create/constraint home leaves a gap. |
| **Implications** | Must strengthen Create or accept inference-only. |
| **Open** | Can Create alone carry C1–C3 without reintroducing interview bloat? |

### B — RETAIN REDUCED / PURPOSEFUL SURFACE

| | |
| - | - |
| **For** | Matches evidence: few constraints + optional overrides; preserves thesis. |
| **Against** | Still requires authority/re-apply work (T-004/T-005); risk of “reduced Settings” becoming 41 again. |
| **Implications** | Framing likely Constraints/Adjustments/Overrides, not Settings-as-today. |
| **Open** | Exact small set; Create vs persistent split. |

### C — SUBSTANTIALLY REDESIGN SETTINGS

| | |
| - | - |
| **For** | Prior diagnostic C; typed policy architecture needed if anything persists. |
| **Against** | “Redesign Settings” can be misread as keep the catalogue and rewire it — **forbidden by T-003 principles**. |
| **Implications** | Only coherent as redesign of **product concept + tiny catalogue**, not 41. |
| **Open** | Naming (Settings vs Constraints) and policy model. |

### D — FURTHER EVIDENCE / PROTOTYPE

| | |
| - | - |
| **For** | No behavioural “change one constraint → Run” probes yet; UX framing untested with operators. |
| **Against** | Principles and reductions already strongly evidenced statically; delay may prolong dishonest UI. |
| **Implications** | Prototype Auto+3 constraints vs Create-only. |
| **Open** | What minimal prototype answers T-006? |

**None eliminated.** Live tension: **B vs thin-C vs A-with-Create-home**, with **D** as process option.

---

## 17. Questions requiring operator judgement (T-006 prep)

1. After creation, should **any** persistent UI exist, or only Create + regenerate?  
2. Is **Auto** the default for every retained control?  
3. Is “Settings” acceptable naming, or prefer Constraints/Adjustments/Overrides?  
4. Keep **outcome count** as preference, or Auto-only?  
5. Is **page vs deck** a Create product choice (PB-FA-008) rather than a GAM Setting?  
6. How much assessment configuration belongs in PRISM Alpha vs later?  
7. Accept deleting DLA pedagogical Settings without replacement?  
8. Require a behavioural prototype (D) before choosing B/C/A?

---

## 18. Concepts to carry into T-004

Architecture ownership analysis should cover **only**:

1. **C1 Delivery circumstances**  
2. **C2 Source stance**  
3. **C3 Available learning time** (single authority)  
4. **C4 Design breadth** (thin)  
5. **C5 Audience/level** (Create-primary)  
6. **C7 Knowledge facet overrides** (advanced)  
7. **C9 Product surface shape** (topology, not GAM pedagogy)  
8. **C10 Page audience profile** (Create-primary)  
9. **C11 Assessment intent cluster** (assessment product only)  
10. Optional weak: **C6 outcome quantity**, **C8 normalize overrides**, **C12 sequence granularity**

**Explicitly exclude from T-004 mapping:** DLA four pedagogical dials; redundant twins; cognitive global Settings family.

---

## 19. Files / history inspected

- S80-T-001, S80-T-002 (+ inventory JSON)  
- `docs/architecture/workflow-settings-catalogue-effectiveness-diagnostic.md`  
- PB-FA-005 notes (via T-002)  
- Canonical DLA/GAM / EP-no-Settings posture (programme context)

---

## 20. Files changed

- This record  
- Sprint STATUS / START-HERE / PLAN / HANDOVER / briefing / README / NEXT-SPRINT  
- T-002 status → COMPLETE — ACCEPTED  

No production code.

---

## 21. Acceptance assessment

| Criterion | Status |
| --------- | ------ |
| Product principles stated | MET |
| Framing analysis (Settings vs alternatives) | MET |
| Auto philosophy explored | MET |
| Create vs persistent analysis | MET |
| All 41 dispositioned conceptually | MET |
| Consolidation into concepts | MET |
| DLA case study answered as product (not wiring) | MET |
| A–D analysed without choosing | MET |
| T-004 handoff narrowed | MET |
| No implementation / no T-004 start | MET |

---

## 22. Exact next task

Operator acceptance of S80-T-003 → **S80-T-004 delivered** (await acceptance) → then **S80-T-005**.

**STOP — T-005 not started from this record. A/B/C/D not decided.**
