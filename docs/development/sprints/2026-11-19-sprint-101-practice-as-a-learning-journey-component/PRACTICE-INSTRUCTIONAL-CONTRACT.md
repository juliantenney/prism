# Sprint 101B — Practice Instructional Contract

**Status:** **ACCEPTED** (design review; refined by 101C-3 without reopening the centre of gravity)  
**Date proposed:** 2026-11-19  
**Date accepted:** 2026-11-19  
**Phase:** 101B (+ presentation refinements recorded in 101C-3)  
**Depends on:** [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md) (101A COMPLETE)  
**Opening:** [S101-D01](decisions.md#s101-d01--open-sprint-101--practice-as-a-learning-journey-component)  
**Decision:** [S101-D02](decisions.md#s101-d02--propose-practice-instructional-contract-101b) — **Accepted**  
**Wireframe:** [WIREFRAME-C2-COMPARISON.md](WIREFRAME-C2-COMPARISON.md) (101C accepted as design foundation; not a mandatory template)  
**Technical audit:** [PRACTICE-TECHNICAL-CAPABILITY-AUDIT.md](PRACTICE-TECHNICAL-CAPABILITY-AUDIT.md) (101C-3)  
**Not authorised by this document:** Implementation, product registration, prompt/schema/renderer edits, 101D.

This instructional contract is the **accepted design baseline** for Practice. It does not rewrite prompts, schemas or renderers.

**101C-3 refinement:** Practice retains Interactive’s instructional sophistication (scaffolding, feedback, revision, maths, purposeful preambles, conceptual imagery, essential working knowledge, justified tables) while using a lighter, task-led presentation. See audit §1 for required / optional / omitted / future classes.

---

## 0. Binding architectural direction (confirmed)

| Decision | Binding statement |
| -------- | ----------------- |
| Primary product | Learning Journeys are PRISM’s primary instructional design output |
| Interactive | Standalone Interactive remains available and **unchanged** |
| Practice identity | Practice has its **own product and workflow identity** |
| Availability (v1) | Practice is commissioned **within Learning Journeys only** in v1 — not a standalone Create product |
| Legacy LJ | Existing Learning Journeys containing Interactive remain supported |
| New LJ preference | New Learning Journeys should **prefer Practice** for activity-oriented components |
| Foundation stages | Preserve Generate Learning Content → Model Knowledge → Define Learning Outcomes and downstream dependencies |
| Reuse rule | Reuse stable Interactive infrastructure where practical; **do not** introduce context-sensitive behaviour into the existing Interactive workflow |
| Pipeline efficiency | Wider pipeline efficiency work is deferred |

### Clarification of the 101A Approach 2 recommendation

101A recommended a shared Interactive/Practice pipeline with gated contracts. That recommendation remains **provisional for implementation shape**, and is **not** an instruction to sprinkle product conditionals throughout Interactive prompts, validators or scaffolds.

**Preferred design stance for 101B:**

- Practice owns its instructional behaviour (leaner learner-facing contract, commissioning guidance, completeness criteria).
- Interactive retains its current self-contained teaching-resource contract.
- Shared machinery (page envelope, activity/materials/response/feedback/render composition, accessibility, math) may be reused **safely** when Practice can invoke it without thinning Interactive’s obligations globally.
- Where Interactive stage contracts currently mandate furniture Practice must omit (e.g. mandatory knowledge summary), Practice needs **Practice-owned** contracts or overlays — not Interactive behaviour that changes when “commissioned from LJ”.

---

## 1. Instructional purpose

### Centre of gravity (one sentence)

**Practice develops learner capability, understanding and judgement through meaningful action, feedback and opportunities for improvement — inside a Learning Journey that already carries framing, progression and prior explanation.**

### What Practice is

- An **activity-focused Learning Journey component**.
- A place where learners **do consequential work** with enough stimulus, instruction and return to learn from the attempt.
- A leaner adaptation of Interactive’s proven activity, feedback and rendering approach, **not** a greenfield pedagogy engine.

### What Practice is not

| Not Practice | Owner instead |
| ------------ | ------------- |
| Complete self-contained teaching resource | Standalone **Interactive** |
| Primary explanation / exposition of new knowledge | **Expository** (and LJ journey intro / section exposition) |
| Formative evidence stop about the learner’s present state | **Assessment Pack** |
| Authentically situated performance in a scenario world | **Situated Task** |
| Journey framing, progression narrative, home-page orientation | **Learning Journey** design page / sections |

Practice may introduce **minimal necessary** explanation or a worked example **at the point of need** for the activities. It must not recreate a full teaching arc that the journey has already provided, or that a neighbouring Expository component should provide.

---

## 2. Learning Journey context — commissioning inheritance

### 2.1 What Practice should receive (instructional need)

| Need | Purpose for Practice |
| ---- | -------------------- |
| Assigned learning outcomes (for this component) | Bound the capability the activities develop; constrain breadth |
| Relevant prior learning | Avoid re-teaching; set attempt difficulty and bring-forward asks |
| Knowledge, concepts and methods needed for the activities | Scope GLC/MK/DLO and activity design without journey-wide dump |
| What has already been explained elsewhere | Explicit **do-not-reteach** boundary |
| What explanation, if any, must be introduced here | Authorise point-of-need explanation / worked example only when required |
| Intended learner actions and evidence | Drive activity design, response surfaces, expected production |
| Feedback and improvement expectations | Shape check/return, revision, self-evaluation |
| Subsequent learning or assessment dependencies | Continuity for later commissions; avoid answer-key spoilers |
| Realistic learner-time envelope | Keep Practice proportional; feed advisory workload checks |

### 2.2 What the current commission schema already supplies (CONFIRM)

Sources: `lib/learning-journey-design-page.js` commission fields + Field guidance; `lib/first-class-commission-intake.js` envelope → `deliverySeed`.

| Existing field / channel | What it carries today | Adequacy for Practice |
| ------------------------ | --------------------- | --------------------- |
| `commission_id`, `section_id`, `order`, `title` | Identity, placement, published title | Sufficient |
| `product_id` | Canonical product (`interactive` \| `expository` \| `assessment_pack` \| `situated_task` today) | Needs **additive** `practice` when implementation authorised |
| `status` | `supported` / `unsupported` | Sufficient |
| `specification_text` | Component educational job and constraints; must initialise intake without parsing rendered prose | **Primary carrier** for outcomes-in-prose, intended actions, feedback expectations, local explanation licence, time envelope |
| `journey_context_text` | Scenario facts / no-recurring-scenario; preceding activities; bring-forward | **Primary carrier** for prior learning and do-not-contradict continuity |
| `dependencies` | Concise earlier `commission_id` / experience ids | Sufficient as pointers; not a substitute for `journey_context_text` |
| LJ `sections[].exposition` | Learner-facing preamble **before** the component link on the journey home | Journey-owned orientation; Practice must not repeat it wholesale |
| `shared_authoritative_material` | Shared corpus / scenario / conventions | Available to child via intake `source_context` / shared source path when established |
| Intake stamps | `commission_specification`, `journey_context`, `commission_dependencies`, optional `source_context`, identity | Confirmed handoff into child Create/family path |

**CONFIRM (101A):** Intake does **not** inject a finished Interactive knowledge model or learning-outcomes artefact into the child. The child still runs GLC → MK → DLO guided by commission text + shared source. Practice must not assume structured LO/KM injection in v1.

### 2.3 What requires stronger commissioning instructions (not necessarily new fields)

Prefer the **smallest useful extension**: strengthen Step 4/5 commissioning and Design Page field guidance so `specification_text` / `journey_context_text` routinely carry Practice-needed content.

Proposed **instructional sections inside `specification_text`** (prose structure for commissioning prompts — not a new JSON schema in v1 unless review finds prose insufficient):

1. **Learning job** — capability / judgement this Practice develops.  
2. **Outcome focus** — which journey outcomes this component serves (named in prose).  
3. **Learner actions & evidence** — what learners produce or demonstrate.  
4. **Explanation licence** — `none` | `point-of-need only` | `short worked model then attempt`, with what must / must not be taught here.  
5. **Prior explanation boundary** — what earlier components already covered (do not re-teach).  
6. **Feedback & improvement** — checkable return, authored self-evaluation, revision expectation.  
7. **Time envelope** — realistic advisory minutes / intensity for this stop.  
8. **Downstream use** — what later learning or Assessment Pack may depend on (without spoiling answers).

Proposed **strengthening inside `journey_context_text`** (already intended by Sprint 94 continuity contract):

- Explicit prior-activity descriptions (not generic continuation).  
- Bring-forward of **learner-owned** earlier work where relevant.  
- Established facts / methods the Practice may assume.

### 2.4 New structured fields — recommendation

| Option | Recommendation |
| ------ | -------------- |
| New commission JSON keys for LOs, KM fragments, minutes, explanation_licence | **Not required for v1 proposal** — prefer richer `specification_text` / `journey_context_text` guidance |
| Additive `product_id: "practice"` | **Required at implementation** (101D), not by this contract alone |
| Optional later structured fields | Revisit only if commissioning quality fails under prose-only guidance |

Rationale: current intake already treats `specification_text` as authoritative; adding fields expands LJ Design Page validation, commissioning prompts, continuity checks and packaging without proven need.

---

## 3. Learner-facing content classification

**Principle:** Learner-facing prose must perform a necessary instructional function. No arbitrary word limits. Prefer omission over ceremonial padding.

| Element | Classification | Instructional purpose | When justified |
| ------- | -------------- | --------------------- | -------------- |
| Resource title | **Required** | Names the practice stop; navigation / packaging identity | Always |
| Conceptual hook / brief orientation | **Optional** | Orient to this stop’s intellectual demand | When useful; never a full Overview / Learning purpose / KS stack |
| Essential working knowledge / apparatus | **Optional instructional (often needed)** | Formulae, representations, definitions required to attempt | At point of need; **not** a mandatory Knowledge summary section |
| Full knowledge-summary ceremony | **Omitted from Practice v1 defaults** | Self-contained advance organiser | Leave to Interactive / Expository / journey as appropriate |
| Explanatory prose | **Optional** | Point-of-need concept/method | When explanation licence says so |
| Worked examples | **Optional** | Model on a distinct operand before independent attempt | When method is non-obvious or prior Expository is insufficient |
| Purposeful activity preambles | **Optional instructional** | Task-led framing that serves the attempt | When they clarify the demand; omit ritual repeated stacks |
| Task instructions | **Required** | Unambiguous ask | Always |
| Stimulus materials | **Required when needed** | Evidence / case / figure the attempt depends on | When the task is not self-contained |
| Learner response surfaces | **Required** | Consequential production / judgement | Always — free-text, structured, selection, math input, tables as the task warrants |
| Structured tables / matrices | **Optional** | Evaluation / synthesis / comparison | When they genuinely serve the cognitive task — not as default layout |
| Cognitive scaffolding / hints | **Optional instructional** | Proportionate support | When stuck-risk or complexity warrants |
| Feedback | **Required** | Supports understanding and improvement | Always |
| Criterion-based self-review | **Optional** | Learner judges response quality | When helpful; not mandatory chrome on every field |
| Revision opportunities | **Optional instructional** | Improve after feedback | When outcomes warrant |
| Coherent sequencing / progression / transfer | **Required capability; light presentation** | Connect demands without ceremonial bridges | Real hinges only; no mandatory bridge-every-activity rule |
| Study tips / closing essays | **Omitted from Practice v1 defaults** | Meta-study / ceremonial wrap | Journey owns onward framing |
| Conceptual / editorial imagery | **Optional** | Hook or knowledge-support without spoiling answers | When useful; not mandatory Interactive-style always-generate opening |
| New interaction types | **Future** | Beyond Interactive’s existing workspace set | Out of sprint |

### Interactive contrast (why classification differs)

Standalone Interactive remains responsible for a **self-contained** teaching resource. Its Design Page orientation quartet and denser table-led furniture remain legitimate there. Practice drops **presentation ceremony**, not **instructional sophistication**: it still supports scaffolding, feedback, revision, maths, purposeful setup and justified structure because the attempt requires them — while the Learning Journey carries journey-level framing and neighbouring explanation.

### Design grammar (not a template)

`Conceptual hook → purposeful setup → meaningful learner activity → feedback and improvement → progression or transfer`

The 101C Lagrange C2 wireframe illustrates one Practice shape; it does **not** mandate four activities or the wireframe’s specific control mix.

---

## 4. Activity design

### 4.1 Shape

Practice may contain:

- **One substantial activity**, or  
- **Several connected activities** that form a coherent practice sequence (prepare → attempt → check → optionally revise / transfer).

Do **not** force every activity into an identical interaction pattern. Preserve Interactive’s useful activity types, response mechanisms, feedback patterns and accessibility capabilities wherever feasible (constructed response, structured templates, tables, MCQ/auto-check where legitimate, reveal-after materials, math notation, etc.).

### 4.2 Pedagogical moves (flexible, not a fixed UI script)

| Move | Expectation |
| ---- | ----------- |
| Preparation / necessary explanation | Only under explanation licence; may be a short note or distinct-operand worked example |
| Learner attempt | Centre of gravity — consequential production or judgement |
| Feedback / checking | Meaningful return; honest about what can and cannot be auto-evaluated |
| Reflection / revision | When educationally warranted by outcomes or commission |
| Progression between activities | Minimal; only when the next attempt depends on a new demand |

### 4.3 Anti-patterns

- Rebuilding a full Interactive “open → teach → model → practice → consolidate” episode when the journey already taught.  
- Mandatory cognition suites / word-count stacks that do not change the attempt.  
- Repeated preambles that restate the same framing before every micro-task.  
- Assessment-pack mimicry (evidence-of-learner as primary job) or Situated Task mimicry (world performance as primary job).

---

## 5. Internal generation vs learner-facing surface

### 5.1 Foundational stages (retained)

Practice retains **Generate Learning Content → Model Knowledge → Define Learning Outcomes** as internal design foundation for this sprint.

These artefacts:

- Bound scope and quality of activity design.  
- Must **not** automatically become learner-facing knowledge-summary or orientation prose.  
- Remain author/workflow artefacts unless a specific Practice-facing material deliberately surfaces a compact recall aid.

### 5.2 How EP → DLA → GAM → LS → DP should behave differently for Practice

| Stage | Interactive posture (today) | Proposed Practice posture (design intent) |
| ----- | --------------------------- | ----------------------------------------- |
| Episode Plan | Full episode/archetype/beat grammar for self-contained session | Prefer **lean practice sequence**; retain only structure needed for valid page assembly and activity ordering — avoid mandatory Orient→Teach ceremony |
| DLA | Rich preamble, bridges, cognition orientation, multi-material teaching depth | Commission **task-first** activities; thin/omit ceremonial preamble and bridges; keep production obligations, accessibility and discovery protections |
| GAM | Deep instructional materials packs | Generate **stimulus + necessary model + feedback** materials; omit filler exposition rows |
| Learning Sequence | Timeline / furniture for session flow | Minimal sequencing metadata; no decorative transitions |
| Design Page | Orientation quartet + knowledge summary + study tips often expected | **No mandatory** Overview/KS/tips ceremony; optional hook + essential apparatus; title + activities dominate; optional conceptual imagery |

**Implementation note (not authorised here):** differences belong in **Practice-owned** contracts/prompts or gated overlays invoked only for Practice workflows — never as LJ-context branches inside Interactive.

### 5.3 Completeness (design meaning)

For LJ production status in v1, a Practice commission is **design-complete** when:

1. Authoritative commission intake has produced a Practice workflow with captured foundational + activity page stages meeting Practice contracts.  
2. Learner-facing package renders with required task, stimulus (if needed), response surface and feedback.  
3. No Interactive-only furniture is required for “complete” (mandatory knowledge summary, study tips, always-generate editorial opening).

Graphics / conceptual imagery: when they serve the hook or attempt — not as Interactive-style default visual planning load.

---

## 6. Commissioning contract

### 6.1 Practical Practice commission structure (compatible with current mechanism)

Use the existing commissions[] object shape:

```text
commission_id, section_id, order, title,
product_id: "practice",          # additive at implementation
status: "supported",
specification_text: <Practice job — structured prose sections in §2.3>,
journey_context_text: <continuity / prior / bring-forward>,
dependencies: <earlier ids or "">
```

LJ `sections[].exposition` continues to introduce the experience on the journey home. Practice page content starts at the activity, not by restating that exposition.

### 6.2 Distinguishing product centres of gravity

| Product | Commission when the educational job is… |
| ------- | ---------------------------------------- |
| **Practice** | Develop capability through action, feedback and improvement inside the journey |
| **Expository** | Explain / organise knowledge for understanding |
| **Assessment Pack** | Make learner state/capability visible as formative evidence, then use that evidence formatively |
| **Situated Task** | Perform in an authentic situated context |
| **Interactive** (legacy in LJ / standalone) | Self-contained interactive teaching resource; still valid for existing commissions and standalone Create |

### 6.3 Preferring Practice in new journeys

When implementation is authorised:

- Step 4 commissioning + Step 5 Design Page guidance should treat **Practice** as the default activity-oriented product.  
- **Interactive** remains a supported `product_id` for backwards compatibility and any explicit self-contained interactive need.  
- Do **not** auto-migrate existing `interactive` commissions.

### 6.4 Avoiding duplicate explanation

| Layer | Responsibility |
| ----- | -------------- |
| LJ journey intro / section exposition | Why this stop exists in the journey |
| Prior Expository / earlier Practice | Concepts and methods already taught |
| Practice `specification_text` explanation licence | What, if anything, may still be introduced locally |
| Practice learner page | Only licensed point-of-need explanation / model |

Commissioning must state the prior-explanation boundary explicitly enough that generators do not “helpfully” re-teach.

---

## 7. Learner experience — proposed page structure (for 101C wireframe)

**Design case:** *Understanding Lagrange Multipliers* Learning Journey, reshaping an existing Interactive constituent into a Practice candidate.

### 7.1 Proposed learner-facing order

```text
1. Title
2. Optional brief orientation (≤ a few sentences; often omitted if LJ exposition suffices)
3. Optional essential explanation OR distinct-operand worked example (only if licensed)
4. Activity block(s), each typically:
      a. Thin task framing (optional)
      b. Clear task instructions
      c. Stimulus materials
      d. Learner response surface
      e. Hints (optional)
      f. Feedback / checking
      g. Revision (optional)
5. Next-activity hinge only if required (normally omit)
6. End — no mandatory study tips / closing essay / knowledge summary
```

Accessibility, mathematical notation and substantial feedback remain first-class. The wireframe must show that a lean page can still host equations, structured working and rich reveal-after returns.

### 7.2 Wireframe priorities (101C)

1. Minimal necessary orientation.  
2. Any essential explanation or worked example.  
3. Meaningful learner activity.  
4. Appropriate hints, feedback and checking.  
5. Revision or progression where useful.

Avoid mandatory knowledge-summary sections, extensive introductory framing and repeated activity preambles.

### 7.3 Review method (unchanged from 101A; still not executed)

Side-by-side: current Lagrange Interactive constituent vs Practice HTML/static candidate vs LJ commission text. Design approval before 101D.

---

## 8. Acceptance criteria

### 8.1 Design acceptance (this contract + 101C wireframe)

| ID | Criterion | How reviewed |
| -- | --------- | ------------ |
| D1 | Learners reach meaningful activity without unnecessary introductory reading | Wireframe + contract classification |
| D2 | Essential explanations remain available at the point of need | Explanation licence + wireframe placement |
| D3 | Activity instructions are unambiguous | Task instruction examples in wireframe |
| D4 | Feedback supports understanding and improvement | Feedback/check pattern in wireframe |
| D5 | Practice builds coherently on the surrounding Learning Journey | Commission inheritance + Lagrange case |
| D6 | Workload allocations are plausible; Sprint 100 advisory checks remain applicable | Design states time envelope in commission; adapter mapping deferred to implementation detail but must remain conceptually compatible |
| D7 | Existing standalone Interactive behaviour is unchanged | Explicit non-goal / regression boundary |
| D8 | Existing Learning Journeys containing Interactive remain valid | Additive `practice` only; no migration |

### 8.2 Later implementation / regression testing (101D/101E — not this gate)

- Practice product registration and commission intake path.  
- Practice-owned or gated generation contracts.  
- Renderer pageKind / validation for Practice furniture rules.  
- Automated backwards-compat suite for LJ `product_id: "interactive"`.  
- Focused unit/integration tests for Practice commission → package render.  
- Confirm Interactive promptRoute / scaffolds unchanged when Practice is present.

Design acceptance does **not** require passing implementation tests.

---

## 9. Answers to 101A contract questions

| # | Question | Proposed answer |
| - | -------- | --------------- |
| 1 | Centre of gravity | §1 — capability via action/feedback/improvement inside a journey |
| 2 | Forbidden / optional / required regions | §3 table |
| 3 | How much explanation; who decides | Commission **explanation licence** bounds generator; point-of-need only by default |
| 4 | Inherit LJ context without re-teaching | `specification_text` + `journey_context_text` + shared source; do-not-reteach boundary; LJ exposition stays on journey home |
| 5 | Activity types / surfaces in v1 | Reuse Interactive’s feasible set; no forced single pattern |
| 6 | Completeness | §5.3 — task + response + feedback sufficient; no Interactive KS/tips ceremony |
| 7 | Standalone Create in v1? | **No** — LJ-commissioned only |
| 8 | Prefer Practice in new LJ | Default activity-oriented product in commissioning guidance; Interactive remains supported |
| 9 | Out of contract | Auto-migration; Interactive thinning; AP acceptsPractice unless authorised; Create-standalone Practice; pipeline efficiency programme; workshop-facilitation Interactive variant redesign |

---

## 10. Implementation direction implications (for later approval)

| Topic | 101B stance |
| ----- | ----------- |
| Product identity | New `practice` product / workflow family when 101D authorised |
| Interactive isolation | No LJ-context behaviour inside Interactive |
| Reuse | Safe reuse of page/activity/materials/render machinery |
| Shared vs forked contracts | Prefer Practice-owned instructional contracts; share code paths without sharing Interactive’s mandatory furniture rules |
| Schema | Smallest extension: additive product id + commissioning prompt guidance; avoid new commission keys in v1 unless review demands them |
| Workload | Reuse feasibility concepts with a Practice mapping at implementation; advisory only |

---

## 11. Decisions requiring author approval

1. Accept this instructional centre of gravity and product boundary table.  
2. Accept learner-facing required / optional / normally omitted classifications.  
3. Accept LJ-commissioned-only Practice in v1 (no standalone Create).  
4. Accept prose-first commissioning enrichment (no new commission JSON fields in v1).  
5. Accept lean page structure as the 101C wireframe brief.  
6. Confirm that Approach 2 remains “safe reuse + Practice-owned behaviour”, **not** Interactive conditionals.  
7. Approve proceeding to **101C** wireframe (still a design gate before 101D).

**101B accepted in design review (2026-11-19).**  
**101C wireframe accepted as design foundation; refined by 101C-3.**  
**Remaining gate before 101D:** approval of [PRACTICE-TECHNICAL-CAPABILITY-AUDIT.md](PRACTICE-TECHNICAL-CAPABILITY-AUDIT.md).
