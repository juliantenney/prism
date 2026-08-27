# S80-T-004 — Policy authority and stage-ownership architecture options

**Sprint:** 80 — Settings Discovery, Product Value and Policy Architecture  
**Status:** **COMPLETE — ACCEPTED** (operator-reviewed 2026-08-26)  
**Mode:** Discovery / architecture design only — **no implementation, schema, or persistence change**  
**Predecessor:** [S80-T-003](S80-T-003-settings-product-value-catalogue-philosophy-and-ux-framing.md) — COMPLETE / ACCEPTED  
**Next task:** [S80-T-005](S80-T-005-policy-persistence-lifecycle-provenance-and-compatibility-options.md) — COMPLETE (awaiting acceptance)

---

## 0. Scope and method

**Question answered:** If the author expresses a surviving T-003 constraint / preference / override, which part of PRISM correctly owns interpretation, and how should that authority reach stages that need it?

**Not answered:** Final A/B/C/D (T-006); persistence representation (T-005); implementation.

**Hypothesis under test (not prescribed):**

```text
UI / Create
  → typed author policy / context
  → stage-owned interpretation
  → canonical prompt / operation projection
  → artefact
```

**Hard rules:**

- Map **only** T-003 surviving concepts (C1–C12 set below).  
- Do **not** reintroduce the 41-control catalogue or DLA pedagogical dials.  
- A retained author policy must **not** become a second pedagogical authority.  
- Do **not** start from `[PRISM_STEP_PARAMS]` plumbing as the design centre.

**Evidence base:** T-001–T-003; Create/brief resolution in `app.js`; pack factor catalogue; canonical DLA/GAM assemblers; LS/DP contracts; PB-FA-005 problem statement. Product reasoning labelled **inference** where code cannot decide.

---

## 1. Executive architecture conclusion

Current PRISM already has a **real authority graph** that is not the Settings panel:

1. **Create / brief resolution** freezes `workflowBriefResolution.resolvedFactors` (+ mapped `workflowOutputSpec.constraints` / step patches).  
2. **Stage artefacts** (EP page shell, LOs, knowledge model, DLA-enriched page, GAM materials, learning sequence, Design Page synthesis) become runtime pedagogical truth.  
3. **Canonical DLA / GAM** consume **upstream artefacts** (and, for delivery-shaped scaffolds, **frozen factors**) — not live Settings notes. GAM’s `resolveGamPolicyIngress` is an explicit **behaviour-neutral seam** (`settingsEffective: false`).

The historical Settings / `[PRISM_STEP_PARAMS]` catalogue is a **parallel, often non-causal transport**, not the correct ownership centre.

**Architecture direction (preferred candidate, not a T-006 product decision):**

**Option 3 — HYBRID:** a **small typed author-constraint / context object** (Create-primary, optionally editable) + **stage-native interpretation and artefacts** + **narrow advanced overrides** at owning steps. Prefer **one policy → one interpreter → derived consequences**, not every stage re-reading the same dial.

This fits Auto (absent/unset ⇒ PRISM judges), protects EP/PEL/DLA/GAM/DP ownership, and avoids recreating a global Settings bag. Options 1 and 2 remain coherent alternatives; Option 1 risks bag-creep if the object grows; Option 2 risks losing editable post-create honesty for real constraints.

**A/B/C/D product choice remains open for T-006.**

---

## 2. Concepts assessed

| ID | Concept | Architecture intensity |
| -- | ------- | ---------------------- |
| **C1** | Delivery circumstances | **Full** — primary constraint/context |
| **C2** | Source stance | **Full** — primary constraint |
| **C3** | Available learning time | **Full** — single authority required |
| **C4** | Design breadth | **Full** (thin) — Create-primary preference/context |
| **C5** | Audience / level | **Full** — Create-primary context |
| **C7** | Knowledge/material facet overrides | **Full** — advanced override at MK |
| **C9** | Product surface shape | **Full** — product selection / topology |
| **C10** | Page profile | **Full** — Create-primary product intent |
| **C11** | Assessment intent | **Full** — only when assessment product in graph |
| **C6** | Outcome quantity | **Weak** — see §18 |
| **C8** | Normalize overrides | **Weak** — see §18 |
| **C12** | Sequence granularity | **Weak** — see §18 |

**Excluded:** DLA pattern / grouping / difficulty / coverage; cognitive global Settings family; redundant twins as separate policies.

---

## 3. Per-concept ownership ledger

Legend — interpretation kinds: **direct constraint** · **contextual input** · **override** · **derived consequence**.

### C1 — Delivery circumstances

| Field | Finding |
| ----- | ------- |
| **Author meaning** | How learning is delivered / progressed (e.g. self-directed vs facilitated live). |
| **Policy class** | **Constraint** / **context** |
| **Natural capture** | **Create** (seed from output type); optional persistent project policy; rare post-create adjustment |
| **Authoritative interpretation owner** | **Create/brief resolution** records the fact; **workflow/runtime scaffolds + PEL rhetoric** interpret facilitated vs self-directed voice; **DLA** may apply workbook overlay as **derived consequence** of self-directed + learner-page product — not as a global pedagogy dial |
| **Downstream consumers** | PEL orientation contracts; self-directed sanitize paths (GAM); DLA workbook overlay gates; page composition brief context |
| **MUST NOT interpret as owner** | Episode Plan beat order; canonical DLA production/commissioning core; GAM material bodies; Design Page synthesis authority |
| **Interpretation kind** | Contextual input → derived scaffold/overlay consequences |
| **Re-resolution after change** | **Yes** — frozen factors + any delivery-shaped scaffolds; artefacts baked under old delivery are **stale** until owning stages re-run |
| **Already represented elsewhere** | `resolvedFactors.delivery_context` (+ historical `delivery_mode` twin); Create output-type seeds |
| **Competing authority risks** | Settings notes vs frozen factors; resurrecting DLA `grouping_preference` as delivery proxy |
| **Confidence** | **High** |

### C2 — Source stance

| Field | Finding |
| ----- | ------- |
| **Author meaning** | Topic-only vs provided source vs mixed. |
| **Policy class** | **Constraint** |
| **Natural capture** | **Create** / upload UX; persistent if reusable workflow must remember stance |
| **Authoritative interpretation owner** | **Create/brief resolution** + topology (whether MK/Normalize appear); **source-honesty contracts** when provided_source |
| **Downstream consumers** | Graph topology; Model Knowledge / Normalize presence; DLA § Sources (attachments as evidence — artefact path) |
| **MUST NOT interpret as owner** | Canonical DLA inventing “source fidelity” from a Settings enum alone; GAM rewriting provenance outside DLA commission |
| **Interpretation kind** | Direct constraint (topology + honesty) |
| **Re-resolution after change** | **Yes** — may require graph/topology rethink + regenerate source-dependent stages |
| **Already represented elsewhere** | `startingArtefact` → `input_strategy`; `constraints.input_strategy` |
| **Competing authority risks** | Standing Settings dropdown vs Create upload truth |
| **Confidence** | **High** |

### C3 — Available learning time

| Field | Finding |
| ----- | ------- |
| **Author meaning** | Time budget for the learning resource / session. |
| **Policy class** | **Constraint** |
| **Natural capture** | Create + **single** persistent project policy (not dual workflow+LS Settings) |
| **Authoritative interpretation owner** | **Learning Sequence** owns **allocation / timing plan artefact**; Create records the author budget |
| **Downstream consumers** | LS artefact (`learning_sequence` / activity durations); renderer display/projection; DLA workbook overlay may assume ~60-min workbook **as product-shaped consequence**, not as independent re-read of Settings |
| **MUST NOT interpret as owner** | Every stage independently inventing timing from the same number; dual Settings twins |
| **Interpretation kind** | Direct constraint at policy layer → **derived consequence** via LS (and activity durations on page) |
| **Re-resolution after change** | Re-run **LS** (owner); downstream that embedded old durations are stale; DLA/GAM only if activity timing structure changes |
| **Already represented elsewhere** | Mapped to **both** `constraints.duration_minutes` and LS `stepParams.duration_minutes` today — **debt** |
| **Competing authority risks** | **High today** — workflow vs LS Settings; DLA-WB ~60 independent assumption |
| **Confidence** | **High** (duplication); **Medium** on exact DLA↔LS coupling |

### C4 — Design breadth

| Field | Finding |
| ----- | ------- |
| **Author meaning** | Single activity → session → sequence → module scale. |
| **Policy class** | **Preference** / **context** (often inferable) |
| **Natural capture** | **Create**; weak as standing post-create control |
| **Authoritative interpretation owner** | **Create/brief resolution** (required factor + reconcile with duration); prompt rules / LO framing consume |
| **Downstream consumers** | LO scope language; graph expectations; weak indirect effect on activity count via LO/EP/DLA chain |
| **MUST NOT interpret as owner** | EP archetype; DLA coverage as Settings `coverage_breadth` |
| **Interpretation kind** | Contextual input |
| **Re-resolution after change** | Outcomes / EP / DLA may need regenerate if breadth genuinely changes |
| **Already represented elsewhere** | `constraints.design_scope`; LO `scope` twin (**redundant**) |
| **Competing authority risks** | LO scope Settings vs workflow design_scope |
| **Confidence** | **High** |

### C5 — Audience / level

| Field | Finding |
| ----- | ------- |
| **Author meaning** | Who learners are / demand band. |
| **Policy class** | **Context** / **constraint** |
| **Natural capture** | **Create-primary**; rare post-create adjustment |
| **Authoritative interpretation owner** | **Learning Outcomes** for outcome wording/demand; shell may carry audience string |
| **Downstream consumers** | LO generation; EP shell audience; DP preserves shell (must not re-decide) |
| **MUST NOT interpret as owner** | Global injection into every canonical prompt as “Settings” |
| **Interpretation kind** | Contextual input → stage-specific resolution at LO (then artefact) |
| **Re-resolution after change** | Re-run LO (+ downstream dependent on LO wording) |
| **Already represented elsewhere** | Brief `learner_level` / audience; LO `learnerLevel`; DP `audience_level` mapping |
| **Competing authority risks** | Multiple mapped fields without single conceptual SoT |
| **Confidence** | **High** |

### C7 — Knowledge facet overrides

| Field | Finding |
| ----- | ------- |
| **Author meaning** | Force include/omit relationships / misconceptions / processes in KM. |
| **Policy class** | **Override** |
| **Natural capture** | **Advanced override** on Model Knowledge (progressive disclosure) |
| **Authoritative interpretation owner** | **Model Knowledge** stage only |
| **Downstream consumers** | `knowledge_model` artefact → later stages consume artefact, not override flags |
| **MUST NOT interpret as owner** | DLA/GAM/PEL re-reading include_* as global pedagogy |
| **Interpretation kind** | Override |
| **Re-resolution after change** | Re-run MK (+ stages that depended on omitted facets) |
| **Already represented elsewhere** | Pack MK `userOptions` / Studio bake path; little `lib/` interpreter |
| **Competing authority risks** | Treating overrides as standing workflow Settings badge |
| **Confidence** | **Medium** (Studio/bake dependence) |

### C9 — Product surface shape

| Field | Finding |
| ----- | ------- |
| **Author meaning** | Which primary product(s) to produce (e.g. page vs deck) — **topology**, not materials quality. |
| **Policy class** | **Product selection** |
| **Natural capture** | **Create** / product declaration (PB-FA-008 adjacency); not a GAM pedagogy Setting |
| **Authoritative interpretation owner** | **Create / product topology** (graph presence of artefacts) |
| **Downstream consumers** | Topology / WGC gates; whether a deck sibling exists; GAM realises commissions for present artefacts |
| **MUST NOT interpret as owner** | Canonical GAM materials quality / depth; DLA commissioning pedagogy |
| **Interpretation kind** | Direct product-selection constraint |
| **Re-resolution after change** | Topology / regenerate missing artefact path; do not imply silent deck quality tweak |
| **Already represented elsewhere** | Create seed `session_materials`; mapped to GAM stepParams historically |
| **Competing authority risks** | Labelling this a “GAM Setting”; one-product honesty still incomplete |
| **Confidence** | **Medium** |

### C10 — Page audience profile

| Field | Finding |
| ----- | ------- |
| **Author meaning** | Learner vs facilitator (vs assessment) page intent. |
| **Policy class** | **Product selection** / **context** |
| **Natural capture** | **Create-primary** (seeded from output type / reconcile) |
| **Authoritative interpretation owner** | **Episode Plan / page shell** materialises `{ profile_type }`; later stages **preserve** |
| **Downstream consumers** | DLA/GAM/LS/DP contracts forbid rewriting profile; renderer/manifestation reads it |
| **MUST NOT interpret as owner** | Post-hoc Design Page Settings as competing shell authority |
| **Interpretation kind** | Contextual / product intent → shell artefact |
| **Re-resolution after change** | Re-shell / regenerate EP (and preserve chain); not a render-only toggle if artefacts assume old voice |
| **Already represented elsewhere** | `resolvedFactors.page_profile`; page artefact `page_profile` |
| **Competing authority risks** | Settings on Design Page vs frozen shell |
| **Confidence** | **High** |

### C11 — Assessment intent

| Field | Finding |
| ----- | ------- |
| **Author meaning** | Assessment strategy, totals, coverage, difficulty (when assessment is the product). |
| **Policy class** | **Constraint** / **preference** cluster |
| **Natural capture** | Create when assessment-primary; **Design Assessment** owns blueprint authority; Gen Items inherits |
| **Authoritative interpretation owner** | **Design Assessment** (canonical assessment authority doctrine); GAI inherits |
| **Downstream consumers** | Assessment artefacts; page path usually **out of graph** |
| **MUST NOT interpret as owner** | Learner-page DLA/GAM pedagogy; resurrecting 17 assessment Settings as learner-page badge |
| **Interpretation kind** | Direct constraint/preference within assessment product |
| **Re-resolution after change** | Re-run DA → GAI chain |
| **Already represented elsewhere** | Brief assessment factors; DA/GAI step params (twins) |
| **Competing authority risks** | DA↔GAI duplicate knobs; cognitive globals |
| **Confidence** | **High** (when in product); **N/A** for typical learner-page |

### C6 / C8 / C12 — see §18 (weak disposition)

---

## 4. Policy vs consequence findings

| Policy (author) | Legitimate interpreter | Consequence others should consume | Anti-pattern |
| --------------- | ---------------------- | --------------------------------- | ------------ |
| Available time (C3) | LS allocates | Activity/timeline durations on artefacts | DLA and GAM each invent timing from “60” |
| Delivery (C1) | Brief + scaffolds / PEL | Self-directed voice; optional DLA workbook overlay gate | “DLA difficulty / grouping Settings” |
| Source stance (C2) | Create + topology | MK present; honesty contracts; attachment evidence | Every stage re-asks topic vs upload |
| Audience (C5) | LO resolves demand | LO artefact wording | Global prompt spam of learnerLevel |
| Page profile (C10) | EP shell | Preserved profile on page | DP Settings rewrite shell |
| Surface shape (C9) | Create topology | Which artefacts exist | GAM “session_materials” pedagogy dial |
| MK facet override (C7) | MK | KM artefact shape | Downstream re-reading include_* |
| Assessment intent (C11) | DA | Blueprint → GAI | Parallel DA and GAI enums |

**Rule:** one author policy → one owning interpreter → artefacts/consequences propagate. Downstream stages prefer **B/C ingress** (upstream consequence / artefact), not independent re-interpretation.

---

## 5. Stage authority map

| Stage | Owns | May consume author policy as | Must not become Settings-driven |
| ----- | ---- | ---------------------------- | ------------------------------- |
| **Create / factor resolution** | Capture + freeze of C1–C5, C9–C11 signals | Source of author constraint/context | Long interview of 41 controls |
| **Episode Plan** | Archetype / beats / shell (incl. C10 materialisation) | C10 (and delivery-shaped product context indirectly) | Any EP Settings catalogue |
| **PEL** | Orientation / reasoning genre floors | C1 as contextual facilitated vs self-study | Author “PEL style” Settings |
| **Learning Outcomes** | Outcome statements | C5; weak C6 if retained | Cognitive global Settings as pedagogy |
| **Canonical DLA** | Production, evidence, commissioning | C1/C3 only as **contextual/derived** (overlay / timing structure from upstream) — **not** pedagogical dials | Pattern/group/difficulty/coverage Settings |
| **Canonical GAM** | Material bodies within DLA commission | Delivery sanitize from frozen factors; commission from DLA | Materials-quality Settings; generic Settings sections in prompts |
| **Learning Sequence** | Timing/order plan artefact | **C3** as primary interpreter | Dual duration Settings; weak C12 as routine |
| **Design Page** | Wrapper synthesis / visual planning | Preserves C10; does not own delivery/time | `include_examples` as standing pedagogy Setting |
| **Design Assessment / GAI** | Assessment blueprint / items | **C11** when in graph | Learner-page badge of assessment knobs |
| **Model Knowledge** | KM artefact | **C7** overrides | Global facet Settings outside MK |
| **Normalize** | Normalized content | **C8** only if retained & step present | Workflow-global normalize Settings |
| **Visual commissioning / renderer** | Presentation / VA execution | Artefacts only | Re-planning pedagogy from Settings |
| **Workflow/runtime** | Scaffold gates reading frozen factors | C1 (and related) | Live notes as silent Run authority without re-apply |

---

## 6. Canonical DLA ingress findings

For each surviving concept that might touch DLA:

| Concept | Recommended ingress | Rationale |
| ------- | ------------------- | --------- |
| C1 Delivery | **B/C** — contextual gate from frozen factors / product shape (e.g. workbook overlay), not a Settings section | Overlay is subordinate consequence; production core stays DLA-owned |
| C2 Source | **C** — attachments / KM artefacts; honesty via upstream | Not a DLA Settings enum |
| C3 Time | **B** prefer — consume LS/activity duration structure; avoid independent “60 minutes” Settings read | Minimises dual interpretation; today’s WB ~60 text is product-shaped, not author dial |
| C4 Breadth | **C** — via LO/EP structure | No direct DLA policy field |
| C5 Audience | **C** — via LO artefact | No global learnerLevel inject into DLA constitution |
| C7 Facets | **C** — via KM artefact | No include_* in DLA |
| C9 Surface | **D** for pedagogy; topology elsewhere | Page vs deck is not DLA materials authority |
| C10 Profile | **C** — preserve shell | Contracts already forbid rewrite |
| C11 Assessment | **D** on learner-page DLA | Assessment product separate |
| DLA pedagogy dials | **D — no ingress** | T-003 / T-002 settled |

**Do not** create generic Settings sections inside canonical DLA prompts.

---

## 7. Canonical GAM ingress findings

| Concept | Recommended ingress | Rationale |
| ------- | ------------------- | --------- |
| C1 | **B/C** — sanitize/rhetoric from frozen factors; bodies from DLA | Matches current scaffolds; not Settings |
| C2–C5, C7 | **C** — upstream artefacts / commission | |
| C9 | **A only as topology** (artefact present or not) — **D for quality** | `session_materials` must not become materials pedagogy |
| C10 | **C** — preserve profile | |
| C11 | **D** on materials path | |
| Policy seam | Keep **`NEUTRAL_POLICY_INGRESS`** until a typed non-pedagogical ingress is defined post–T-006 | `settingsEffective: false` today; must not become a backdoor Settings bag |

Prefer **B/C**. Direct typed policy into GAM only if future product proves a **non-pedagogical** constraint GAM alone must enforce (none strongly evidenced for the T-003 set beyond delivery sanitize already handled via factors).

---

## 8. Auto / unset architecture findings

Architecturally, future design must preserve distinctions among:

| Notion | Meaning | Why preserve |
| ------ | ------- | ------------ |
| **Policy absent / unset** | Author did not decide | Stages use contextual judgement |
| **Explicit AUTO** (if UI needs a visible choice) | Author affirmatively defers | Distinct from a forced enum that looks chosen |
| **Explicit author value** | Constraint / preference / override | Ingress to owning interpreter |
| **Resolved / inferred consequence** | What PRISM concluded (factors, artefacts) | Must not be confused with author intent |
| **Override provenance** | Author forced exception vs Auto path | Audit / honesty |

**Do not decide persistence representation here (T-005).**

Implication: today’s forced defaults (`blended`, `balanced`, `moderate`) often **collapse** absent vs chosen — architecture should stop treating create residues as authoritative author intent without provenance.

---

## 9. Change / re-apply semantics

| Concept | If changed after creation, conceptually… |
| ------- | ---------------------------------------- |
| **C1 Delivery** | Re-resolve brief factors / scaffolds; re-run stages whose rhetoric or overlay depends on delivery; **do not** claim instant rewrite of baked page |
| **C2 Source** | Possibly retopologise; regenerate source-dependent stages; honesty contracts re-apply on next generation |
| **C3 Time** | Re-run **LS** (owner); mark activity-duration dependents stale; DLA/GAM only if structure changes |
| **C4 Breadth** | Re-run LO → EP → DLA chain if breadth truly changes |
| **C5 Level** | Re-run LO (+ dependents) |
| **C7 Facets** | Re-run MK (+ dependents on KM) |
| **C9 Surface** | Topology / generate or drop artefact path — **Apply** honesty |
| **C10 Profile** | Re-shell EP / regenerate preserve chain — not render-only if voice baked |
| **C11** | Re-run DA → GAI |
| **C6/C8/C12** | If retained: owning step re-run only |

**UI honesty rule:** changing a control must either (a) immediately affect only true render-only surfaces, or (b) mark artefacts stale and require explicit **Apply / regenerate affected stages**. Silent Settings edits that leave baked artefacts unchanged are an anti-pattern (§17).

---

## 10. Policy dependency / staleness map

```text
C1 Delivery
  → Create/factors + PEL/scaffolds
  → (optional) DLA workbook overlay gate
  → GAM sanitize / voice
  Stale if changed: baked DLA/GAM/DP rhetoric under old delivery

C2 Source stance
  → topology (MK/Normalize presence) + honesty
  → KM / Normalize artefacts → DLA sources/evidence paths
  Stale if changed: source-dependent artefacts; graph shape

C3 Available time
  → LS allocation artefact
  → page activity durations / timeline projection
  → (indirect) DLA timing structure if activities change
  Stale if changed: LS + embedded durations; dual Settings today worsen this

C4 Design breadth
  → LO framing → EP/DLA scale expectations
  Stale if changed: LO/EP/DLA chain

C5 Audience/level
  → LO artefact → EP shell audience → DP preserve
  Stale if changed: LO and dependents

C7 MK overrides
  → KM artefact → consumers of KM
  Stale if changed: KM + dependents

C9 Surface shape
  → topology (page/deck presence)
  Stale if changed: missing/extra primary products

C10 Page profile
  → EP shell → all preserve contracts → renderer
  Stale if changed: shell + voice-dependent materials

C11 Assessment intent
  → DA → GAI
  Stale if changed: assessment artefacts only
```

No generic reactive invalidation system is proposed — only the **staleness honesty** map for later planning.

---

## 11. Typed-policy distinctions needed

A future typed policy model should **conceptually** distinguish:

| Category | Examples | Architectural use |
| -------- | -------- | ----------------- |
| **Author constraints** | C1, C2, C3 | Must be respected by owning interpreters |
| **Author context** | C5, often C4/C10 | Informs stage resolution; not micromanagement |
| **Explicit overrides** | C7, maybe C8 | Narrow; provenance-marked; progressive disclosure |
| **Product selection** | C9, C10, assessment-in-graph | Topology / product declaration |
| **Automatic / inferred state** | resolvedFactors residues; artefacts | Not presented as author Settings choices |

These distinctions are **architecturally useful** even before schema design: they prevent collapsing everything into one boolean/enum bag and align UI framing (Constraints / Adjustments / Overrides) with ownership.

---

## 12. Architecture Option 1 — Central policy object + stage interpreters

**Shape:** One typed project policy object holds surviving author fields. Each stage declares which fields it may read and how it interprets them. Artefacts remain stage outputs.

| Criterion | Assessment |
| --------- | ---------- |
| Authority clarity | Good if field→owner table is strict |
| Competing ownership risk | Medium — object invites “just add one more field” |
| Canonical DLA/GAM fit | Good if stages only take allowed fields; ingress stays B/C-first |
| Change/re-apply | Clear: policy version + stale marks |
| Testability | Strong — unit-test interpreters per field |
| Extensibility | Easy to extend; **dangerous** without governance |
| Complexity | Medium–high (new object + migration later) |
| Bag-recreation risk | **High** without hard allowlist |
| Auto fit | Good (unset vs explicit) |
| UI framing fit | Works with Constraints UI if object stays tiny |

---

## 13. Architecture Option 2 — Create resolution + stage-native state

**Shape:** Author constraints captured at Create and resolved into existing stage-owned artefacts / frozen factors. Little or no persistent editable global policy after creation. Post-create change ⇒ re-Create or regenerate from brief.

| Criterion | Assessment |
| --------- | ---------- |
| Authority clarity | Excellent for stage artefacts |
| Competing ownership risk | Low globally; Create becomes bottleneck |
| Canonical DLA/GAM fit | Excellent (already artefact-first) |
| Change/re-apply | Weak for “tweak duration and re-apply” unless Create re-resolve is first-class |
| Testability | Good for stages; weaker for post-create policy edits |
| Extensibility | Prefer stage contracts |
| Complexity | Lowest new surface |
| Bag-recreation risk | Low |
| Auto fit | Natural (inference at Create) |
| UI framing fit | Favours **Delete Settings / Create-home** (product option A adjacent) |

---

## 14. Architecture Option 3 — Hybrid (preferred candidate)

**Shape:**

1. **Small persistent author-constraint/context object** for C1–C3 (and product selection C9/C10 if not solely Create-locked).  
2. **Create-primary** capture for C4/C5/C10 with optional edit that re-resolves.  
3. **Stage-native derived decisions** (LS owns time allocation; LO owns level wording; EP owns shell; DLA/GAM own pedagogy).  
4. **Narrow overrides** (C7 at MK; C11 at DA; C8 only if retained at Normalize).  
5. Downstream consumes **artefacts / consequences**, not a global Settings broadcast.

| Criterion | Assessment |
| --------- | ---------- |
| Authority clarity | **Best balance** |
| Competing ownership risk | Low if allowlist + one-interpreter rule |
| Canonical DLA/GAM fit | **Strong** — preserves artefact-first + neutral GAM seam |
| Change/re-apply | Explicit Apply on constraint object; stage overrides local |
| Testability | Strong for allowlisted fields |
| Extensibility | Controlled |
| Complexity | Medium |
| Bag-recreation risk | Medium — mitigated by T-003 allowlist + governance |
| Auto fit | **Strong** |
| UI framing fit | Matches Constraints + optional Adjustments/Overrides |

---

## 15. Comparative option assessment

| | Option 1 Central object | Option 2 Create+stage-native | Option 3 Hybrid |
| - | ----------------------- | ---------------------------- | --------------- |
| Matches current reality | Partial (factors exist but Settings diverge) | **Closest** to live Run authority | Extends reality with editable honesty |
| Fixes Settings false promise | Only if UI binds to object & re-apply | By removing post-create Settings | By shrinking + honest Apply |
| Risk | Bag creep | No post-create constraint home | Hybrid complexity |
| Fit with T-003 principles | Medium–High | High for Auto/Create thesis | **Highest** |
| Fit with reusable workflows needing retune | Strong | Weak unless Create re-entry | Strong for small set |

---

## 16. Preferred direction (evidence-supported; not T-006)

**Preferred architecture candidate: Option 3 (Hybrid).**

Evidence:

- Live Run already trusts **frozen factors + artefacts**, not Settings notes (T-001/T-002).  
- Authors still have real constraints (C1–C3) that Option 2 under-serves for reusable retune.  
- Option 1 without a hard allowlist recreates the 41-bag failure mode.  
- Canonical DLA/GAM require **B/C ingress**, which Hybrid encodes as rule.

**This is not the product A/B/C/D decision.** Product framing may still be A (delete Settings UI) while retaining Hybrid **policy architecture** under Create + small Constraints surface — naming is T-006.

---

## 17. Rejected anti-patterns

| Anti-pattern | Why reject |
| ------------ | ---------- |
| UI → arbitrary prompt strings | Bypasses stage ownership; untestable |
| Every stage reads every setting | Competing interpretation; bag semantics |
| Global boolean/enum bag | Recreates 41-control failure |
| Duplicated interpretation of one policy | Dual duration; delivery_context vs delivery_mode without SoT |
| Author setting directly overriding PEL/DLA/GAM pedagogy without ownership | Forbidden by T-003; DLA dials case study |
| Silent Settings edits leaving baked artefacts unchanged | Dishonest UX (PB-FA-005 core) |
| Keeping obsolete controls because plumbing exists | T-002/T-003 explicitly reject |
| Generic Settings sections inside canonical DLA/GAM prompts | Violates singular normative assemblers |
| Resurrecting DLA difficulty/pattern/grouping/coverage as policy | Explicitly out of scope |

---

## 18. Weak concepts disposition (C6 / C8 / C12)

| Concept | Enough product value for architecture? | Disposition |
| ------- | -------------------------------------- | ----------- |
| **C6 Outcome quantity** | **No** as first-class policy object field | Prefer **Auto** (LO chooses count in band). If operator insists, treat as **LO-local preference override** only — do not broadcast. **Do not** carry heavy T-005 design for C6. |
| **C8 Normalize overrides** | **Marginal** | Architecture only as **step-local override** when Normalize is in graph. Not project-global policy. Optional in T-005 as “step override provenance” pattern, not core constraint object. |
| **C12 Sequence granularity** | **Insufficient** | Derive from duration + breadth; LS owns presentation detail. **Drop from core architecture** unless operator later proves facilitator need. Not required for T-005 core. |

**T-005 should assume core policy concepts: C1–C5, C7, C9–C11** (with C4/C5/C10 Create-primary). C6/C8/C12 are optional footnotes, not drivers.

---

## 19. PB-FA-005 implications

PB-FA-005 today mixes: (A) Settings→Run consistency, (B) IA/product semantics, coverage gaps, dual duration, definition vs run config.

Sprint 80 options **refine** eventual PB-FA-005 definition:

| Refinement | Effect on PB-FA-005 |
| ---------- | ------------------- |
| Catalogue is not the target | Scope item “wire all pack controls” becomes invalid |
| Hybrid typed constraints + stage interpreters | Replaces “make `[PRISM_STEP_PARAMS]` authoritative for everything” |
| One-interpreter / policy vs consequence | Reframes dual `duration_minutes` as **single constraint → LS owner** |
| Auto/unset vs resolved consequence | Becomes part of authoritative model (A.2) |
| Honest Apply / staleness | Becomes acceptance criterion replacing silent save |
| DLA/GAM ingress B/C | Explicitly excludes pedagogical Settings inside assemblers |
| C9 as product selection | Coordinates with PB-FA-008 / one-product honesty |
| Assessment cluster scoped | Learner-page Settings coverage ≠ assessment pack coverage |

**Do not implement or finalise PB-FA-005 in Sprint 80.** After T-006, rewrite acceptance criteria around the chosen product+architecture option.

---

## 20. Semantic persistence requirements for T-005

T-005 must represent **semantics** (storage undecided):

| Semantic | Needed? |
| -------- | ------- |
| Explicit author constraint/context values for allowlisted concepts | Yes (if any post-create surface) |
| Auto / unset distinct from forced default enum | Yes |
| Resolved / inferred consequence (factors, artefacts) separate from author intent | Yes |
| Override provenance (who forced C7/C8/C11 minutiae) | Yes if overrides retained |
| Product selection (C9/C10) vs pedagogical policy | Yes |
| Staleness / last-applied policy generation marker (conceptual) | Useful for honesty |
| Historical `[PRISM_STEP_PARAMS]` compatibility | Yes (migration/read strategy) — **format choice in T-005** |
| Dual duration collapse | Semantic single C3 — representation in T-005 |

**Out of scope here:** notes vs JSON; schema version bytes; migration code.

---

## 21. Unresolved questions for operator

1. Accept **Hybrid (Option 3)** as architecture preference entering T-005/T-006, or keep all three equal?  
2. Post-create: editable **Constraints** for C1–C3 only, or Create-reentry only (Option 2 lean)?  
3. Confirm **drop C6/C12** from core policy architecture?  
4. Keep **C8** as Normalize step-local override pattern?  
5. Is **C9** Create/product-declaration only (PB-FA-008), with no GAM-adjacent control?  
6. Assessment: is C11 in Alpha scope for learner-page workflows (likely no)?  
7. Should Auto be a visible UI value or merely absent policy?  
8. Prototype (product D) before locking architecture preference?

---

## 22. Files / code / history inspected

- S80-T-001, S80-T-002, S80-T-003  
- `docs/architecture/workflow-settings-catalogue-effectiveness-diagnostic.md` (prior)  
- `docs/backlog/PRODUCT-BACKLOG.md` — PB-FA-005  
- `app.js` — brief resolution / `resolvedFactors` / scaffold readers  
- `lib/gam-canonical-assembler.js` — `NEUTRAL_POLICY_INGRESS` / `resolveGamPolicyIngress`  
- `lib/ld-dla-page-enrich-contract.js` — workbook overlay / delivery_context  
- Pack factor catalogue references (`domain-learning-design-step-patterns.md`) via prior audit + explore  
- Explore brief: Create→factors→artefact authority graph  

---

## 23. Files changed

- This record (new)  
- Sprint STATUS / START-HERE / PLAN / HANDOVER / briefing / README / NEXT-SPRINT  
- S80-T-003 status → **COMPLETE — ACCEPTED**  

No production code.

---

## 24. Sprint records updated

Yes — pointers set to **S80-T-004 COMPLETE** (await acceptance) → next **S80-T-005**.

---

## 25. Acceptance assessment

| Criterion | Status |
| --------- | ------ |
| Ownership ledger for surviving concepts | MET |
| Policy vs consequence distinguished | MET |
| Stage authority map with repo evidence | MET |
| DLA/GAM ingress A/B/C/D per concept | MET |
| Auto/unset architecture distinctions | MET |
| Change/re-apply + staleness map | MET |
| Typed-policy category distinctions | MET |
| ≥3 architecture options compared | MET |
| Preferred candidate identified without choosing A/B/C/D | MET |
| Anti-patterns documented | MET |
| Weak C6/C8/C12 disposition | MET |
| PB-FA-005 implications (not implementation) | MET |
| Persistence semantics for T-005 only | MET |
| No implementation / no T-005 start | MET |

---

## 26. Exact next task

Operator acceptance of S80-T-004 → **S80-T-005 delivered** (await acceptance) → then **S80-T-006** (human gate).

**STOP — A/B/C/D not decided. No Settings implementation.**
