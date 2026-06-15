# Sprint 44-2 — Instructional Depth Contracts

**Date:** 2026-06-15  
**Type:** Educational design specification  
**Status:** First draft  
**Predecessor:** Sprint 43 educational architecture; distributed implicit contracts in prompts, validators, role mappings, preservation rules, and tests  
**Audience:** Learning designers, educational reviewers, downstream specification authors

---

## 1. Objective

Define **instructional depth contracts** for learner-facing material types used in self-directed higher-education learning resources.

Each contract states what a material type is for, what it should do for the learner, and how to recognise minimum acceptable, strong, and failed realisations. The contracts consolidate instructional intent already present across the PRISM codebase into a single educational specification.

This document is an **educational design artefact**. It does not prescribe workflow changes, rendering, prompts, validators, or code.

---

## 2. Background

Sprint 43 established a stable educational architecture centred on investigation-primary ownership, resource-secondary ownership, activity and material support structures, and a two-column learner-facing manifestation. Cross-domain testing (Marx, Photosynthesis) suggests the architecture generalises across domains.

The principal remaining quality gap is **instructional material realisation** — whether learner-facing materials actually perform their educational function — rather than workflow architecture.

Analysis shows that implicit instructional contracts already exist across prompts, validators, role mappings, preservation rules, and tests. Those contracts are distributed and unevenly enforced. This document expresses them as a coherent educational specification.

### Current Status

The contracts in this document define educational intent and realisation standards. They are derived from instructional expectations already distributed across the system, not invented anew. They do not imply that current generators, validators, prompts, or renderers consistently satisfy these standards. This document is descriptive and normative: it states what each material type should achieve educationally, not evidence that implementation already meets that bar.

---

## Relationship to Sprint 43

Sprint 43 addressed educational architecture — how a self-directed higher-education resource should be owned, structured, and manifested for the learner.

That work stabilised an investigation-primary, resource-secondary architecture. The governing inquiry organises the resource; exposition, activities, and materials support the investigation rather than replacing it as the learner's primary experience.

Cross-domain testing using Marx and Photosynthesis suggested this architecture generalises across subject domains. The workflow could produce structurally coherent resources in both cases without domain-specific architectural redesign.

Remaining quality limitations appeared primarily in instructional material realisation — whether text, worked examples, checklists, and closure materials actually performed their educational function — rather than in ownership, sequencing, or manifestation design.

Sprint 44-2 therefore focuses on a different layer. Where Sprint 43 asked how the resource is organised, Sprint 44-2 asks what each learner-facing material type must achieve when realised.

These material contracts make implicit instructional expectations explicit, so reviewers and authors can judge educational depth directly, independent of whether the surrounding architecture is present.

---

## 3. Scope

### 3.1 In scope

- Educational purpose, learner effect, realisation standards, failure modes, and quality signals for eleven learner-facing material types
- Self-directed higher-education learning resources (solo learner, no assumed live instructor)
- Contracts that apply whether the material appears in an activity, a resource column, or a closure section

### 3.2 Out of scope

- Workflow ownership and sequencing architecture
- Page layout, renderer behaviour, and visual affordances
- Prompt wording, validator logic, and code changes
- Sprint 44-1 (GAM capture validation gate)

---

## 4. Cross-cutting principles

These principles apply across material types. They are derived from existing instructional intent in workbook, preservation, and self-directed rhetoric contracts.

| Principle | Educational meaning |
|-----------|---------------------|
| **Function before format** | A material succeeds when the learner experiences its instructional move, not when a label or container is present. |
| **One move per material** | Each material should perform one clear instructional function. Collapsing exposition, modelling, verification, and closure into a single block weakens all of them. |
| **Scaffold ≠ deliverable** | Support materials may structure thinking but must not complete the learner's assigned output when the task requires learner production. |
| **Procedure linked to meaning** | Steps, rows, and checklist items should state what each move means conceptually, not only what to do mechanically. |
| **Fading arc** | Modelled reasoning precedes partial practice, which precedes independent judgement or transfer. Materials at each stage must respect the reduced support level. |
| **Learner-check retrieval** | Verification materials require the learner to test understanding against criteria — not merely to reflect on feelings or confirm completion. |
| **Own-context transfer** | Transfer materials require application to the learner's situation, not only repetition in third-person cases. |
| **Criteria before judgement** | Compare, rank, and evaluate tasks require explicit criteria before the learner is asked to judge. Judgement cells and ratings belong to the learner. |

---

## 5. Material type contracts

Each subsection follows the same structure: educational purpose, learner effect, existing implicit contract, minimum realisation, strong realisation, failure modes, and potential validation signals.

Validation signals are **educational indicators** that a reviewer or downstream specification could use to assess quality. They are not implementation requirements.

---

### 5.1 `text`

#### Educational purpose

Provide learner-facing exposition that connects ideas in prose outside structured grids. In evaluative arcs, text may introduce operational criteria, perspectives, or conceptual framing the learner will later apply.

#### Learner effect

The learner builds conceptual linkage before practice. They can name relationships between ideas, understand why the session matters, and (where relevant) recognise the dimensions they will use to judge later tasks.

#### Existing implicit contract

Distributed contracts treat `text` as explanatory teaching prose: link at least two ideas; avoid table-cell definitions only; in evaluate-shaped sessions, carry criteria exposition with multiple operational dimensions. Text must not be absorbed into consolidation or replaced by task prompts alone.

#### Minimum realisation

- Substantive prose (not a label, synopsis, or specification restatement)
- At least two distinct ideas linked in explicit prose
- Learner-facing tone appropriate to higher education
- Distinct from the activity task instruction — teaches or frames, does not assign the task

#### Strong realisation

- Clear intellectual progression within the prose block
- Concepts linked to the activity's learner task and expected evidence
- In evaluative contexts: three or more operational criteria named with enough detail that a learner could apply them
- Perspective-building where the domain requires competing interpretations
- Optional "use this when…" cues connecting concept to procedure

#### Failure modes

- Specification synopsis ("this material explains…") with no teachable content
- Table of definitions with no connective prose
- Task instructions duplicated as exposition
- Criteria named but not operationalised (labels without usable detail)
- Exposition deferred entirely to activity preambles with no material body
- Consolidation or reflection prose standing in for missing exposition

#### Potential validation signals

- Count of distinct conceptual claims linked by explicit relational language
- Presence of criteria dimensions named with application detail (evaluate contexts)
- Absence of imperative task verbs as the dominant mode
- Prose length and density consistent with teaching intent (not title-only)
- Reviewer can answer: "What two ideas does this connect?" without inferring from elsewhere

---

### 5.2 `worked_example`

#### Educational purpose

Show an expert completing one instance step-by-step before the learner attempts a parallel task. Make reasoning visible, not only the final answer.

#### Learner effect

The learner observes a complete reasoning chain, sees why each step matters, and can reuse the method on a similar but non-identical task. They understand procedure and meaning together.

#### Existing implicit contract

Contracts require numbered expert steps, visible reasoning, and a clear model answer or completed output — not a blank worksheet. Worked examples are distinct from sample outputs when both are listed. Bodies must not match the learner's expected deliverable when independent production is required. One reasoning move per example; faded and independent stages must not repeat the modelled answer verbatim.

#### Minimum realisation

- At least three ordered steps or stages with intermediate results
- Visible reasoning between steps (not answer-only)
- A clear completed instance or model answer for the worked item
- The worked item is not identical to the learner's assigned deliverable when the task requires independent production
- Step labels or headings that a learner can follow

#### Strong realisation

- Step → meaning pairs ("Fill Purpose → states the author's aim…")
- One clear method demonstrated without overloading multiple moves
- Annotated quality features where judgement is involved
- Weak vs strong contrast when the arc trains evaluative judgement
- Explicit link to the parallel task: "use the same method on…"
- Quantitative or interpretive moves explained, not only calculated

#### Failure modes

- Blank template presented as worked example
- Answer key without reasoning chain
- Fully completed learner worksheet passed off as modelling
- Worked example that pre-writes the learner's capstone or closure output
- Mechanical steps with no conceptual interpretation
- Multiple incompatible methods in one example
- Worked example absent when DLA specifies modelled stage before practice

#### Potential validation signals

- Numbered or labelled steps present
- Presence of because/so/therefore-type reasoning between steps
- Worked item topic or data distinct from independent task item
- Absence of language matching expected_output deliverable verbatim
- Reviewer can trace one expert decision per step
- In evaluate arcs: weak and strong judgement patterns distinguishable

---

### 5.3 `modelling_note`

#### Educational purpose

Make expert decision-making visible — criteria, checks, and choices — rather than only final outcomes. Support judgement, classification, and interpretation before independent practice.

#### Learner effect

The learner internalises decision rules ("first check… because…") and criteria-led reasoning. They can articulate why an expert chose one path over another.

#### Existing implicit contract

Contracts treat modelling notes as expert think-aloud or criteria walkthroughs, not generic study advice. When judgement is the instructional move, modelling may contrast weak slogan-style reasoning with stronger criteria-led reasoning. Same depth obligations as worked examples when DLA specifies modelling without sample output.

#### Minimum realisation

- Learner-facing prose explaining expert checks, criteria, or decision order
- At least one explicit decision rule or criterion application
- Distinct from generic encouragement or study tips
- Not facilitator-only usage notes

#### Strong realisation

- Criteria listed before practice with application examples on one row or case
- Think-aloud structure: observation → check → decision → rationale
- Weak vs strong evaluation contrast in judgement arcs
- Links modelling moves to the learner's upcoming task shape
- "Use this when…" boundary conditions for applying the rule

#### Failure modes

- Generic study advice ("read carefully", "think critically")
- Facilitator `usage` or `failure_mode` JSON without learner-facing callout
- Numbers or classifications with no decision rules
- Modelling note that completes the learner's independent judgement
- Reasoning orientation field present upstream but no materialised reasoning body
- Collapsed into task_cards or checklist without modelling prose

#### Potential validation signals

- Presence of decision verbs (check, compare, weigh, reject, prefer)
- Criteria terms reused in subsequent practice materials
- Weak/strong or acceptable/unacceptable contrast markers
- Absence of facilitator-only tone
- Reviewer can extract at least one reusable decision rule

---

### 5.4 `misconception_note`

#### Educational purpose

Name a plausible learner error and supply a correction cue so the learner can self-correct during practice.

#### Learner effect

The learner recognises a tempting wrong idea, understands why it fails a stated test, and knows what to revisit. Misconception handling is reactive interruption, not a full remediation course.

#### Existing implicit contract

Contracts specify learner-facing callouts when DLA or specification requests them: "Common mistake… Instead…" format; not facilitator-only failure modes. Optional but encouraged when knowledge model or activity design surfaces likely confusion. Embedded at faded and independent stages especially.

#### Minimum realisation

- Named misconception in learner-facing language
- Brief statement of why the wrong idea is tempting or where it fails
- Correction cue or redirect to concept/procedure
- Callout tone (not a tutoring dialogue or full solution)

#### Strong realisation

- Tied to a specific task, table row, or prompt the learner just encountered
- States a test the wrong answer fails (evidence, definition, procedure boundary)
- One misconception per callout — focused interruption
- Positioned where the error is likely (after faded practice, before independent judgement)
- Aligns with support_note or checklist guard on the same activity

#### Failure modes

- Facilitator-only `failure_mode` with no learner material
- Vague "be careful" without naming the error
- Full worked solution presented as misconception handling
- Misconception list with no correction pathway
- Remediation syllabus replacing the activity arc
- Misconception note absent when specification explicitly requests it

#### Potential validation signals

- "Common mistake" / "Instead" or equivalent contrast structure
- Named false claim vs correction pair
- Link to specific concept or procedure from the activity
- Learner-facing pronoun and tone
- Reviewer can state the precise error pattern being blocked

---

### 5.5 `sample_output`

#### Educational purpose

Show a concrete exemplar of the expected learner product quality — annotated where possible — for a case that is parallel to but not identical with the learner's assigned item.

#### Learner effect

The learner calibrates what "good" looks like: structure, depth, evidence use, and quality features. They gain a reference standard without receiving a copy-paste answer for their own task.

#### Existing implicit contract

Contracts require annotated exemplars distinct from worked examples when both are listed. Sample output shows expected product quality; it must not be a copy-paste target when independent practice or judgement is planned. Treated as answer-revealing in workshop contexts — the educational contract still requires calibration without pre-answering the learner's item.

#### Minimum realisation

- Full exemplar response or product for a specified item
- Learner-facing presentation as sample, model, or exemplar
- Item context clear enough to understand what is being demonstrated
- Different item or framing from the learner's independent deliverable when spoofing would occur

#### Strong realisation

- Annotations calling out quality features ("strong because…", "evidence cited…")
- Structure mirrors expected_output requirements (length, sections, evidence type)
- Side-by-side weak vs strong feature commentary where judgement is trained
- Explicit boundary: exemplar is for calibration, not transcription
- Quantitative or disciplinary conventions modelled correctly

#### Failure modes

- Sample output identical to the learner's assigned task pre-answered
- Unannotated final answer with no quality signals
- Sample output substituting for worked reasoning when modelling is required
- Exemplar that satisfies capstone expected_output on the learner's behalf
- Thin label ("see sample answer") with no body
- Sample confused with template (all cells filled on learner worksheet)

#### Potential validation signals

- Annotation language present (because, shows, demonstrates, criterion)
- Item identifier distinct from independent task item
- Structural match to expected_output without content match to learner prompt
- Reviewer can list three quality features the exemplar demonstrates
- Heading or framing clearly marks material as exemplar not instruction

---

### 5.6 `decision_table`

#### Educational purpose

Provide a structured guided judgement surface — comparison, ranking, or decision grid — with partial expert modelling and learner-empty cells where the learner must judge, rate, or justify.

#### Learner effect

The learner practises organising evidence and judgement in tabular form. Partial rows or columns model the move; empty cells preserve learner agency for ranking, rating, or justification.

#### Existing implicit contract

Contracts require pipe-markdown tables per table-fidelity rules: enough rows for the stated task, learner practice columns empty unless reference data only, no pre-supplied judgement ratings. Decision tables support the workbook task as companion material, not as the whole resource. Guided exemplar rows or strategy-labelled partial examples required in evaluate arcs.

#### Minimum realisation

- Proper tabular structure with headers and multiple rows
- Enough rows for the learner_task (not a single blank row when many responses required)
- Learner judgement, rating, or response cells empty where the learner decides
- Table adjunct prose if needed to explain how to use the grid

#### Strong realisation

- Partial exemplar row demonstrating the judgement move without completing the grid
- Column labels that prompt reasoning (not only category names)
- Justification column or prompt paired with rating/ranking cells
- Reference rows clearly distinguished from learner-completion rows
- Linked to criteria or rubric named in adjacent materials
- Row order does not function as an answer key

#### Failure modes

- Table shell: headers and "partial example" label with no exemplar content
- Pre-filled effectiveness ratings or rank order supplied to learner
- Single blank row when task requires multiple comparisons
- Table-only session with no exposition, modelling, or verification elsewhere
- Reference dump: entire grid pre-completed
- Capstone reprint of all prior tables instead of synthesis scaffold
- Comma-separated pseudo-table without usable grid structure

#### Potential validation signals

- Count of empty learner-completion cells vs task requirement
- Presence of partial exemplar row or strategy-labelled example
- Absence of numeric ratings or rank ordinals in learner columns
- Row count adequacy against learner_task
- Reviewer can identify which cells are modelled vs learner-owned

---

### 5.7 `checklist`

#### Educational purpose

Give the learner criteria-linked verification points before continuing or submitting — a self-check gate tied to expected output quality.

#### Learner effect

The learner tests completeness and reasoning quality against explicit checkpoints. Retrieval is correctness- or criteria-oriented, not merely affective reflection.

#### Existing implicit contract

Contracts require at least four checkable items tied to criteria on every activity in workbook-shaped designs. Checklist items may include an optional misconception guard on one item. Distinct from prompt_set (open questions) and from reflection-only closure. Structured schema: sections with labelled items.

#### Minimum realisation

- At least four checkable items
- Items tied to activity criteria or expected_output (not generic completion)
- Learner-check wording (verify, confirm, check, before you continue)
- Checkable form (list items suitable for self-tick)

#### Strong realisation

- Grouped sections aligned to output structure (evidence, reasoning, judgement, presentation)
- Items expose weak reasoning patterns ("Did you cite a scenario detail, not only define terms?")
- One item optionally guards a known misconception
- Positioned after the task materials it verifies
- Items map to rubric or quality_criteria dimensions when judgement is required

#### Failure modes

- "Did you finish?" without criteria
- Generic quality platitudes unrelated to expected_output
- Long essay prompts masquerading as checklist items
- Checklist without prior task to verify
- Reflection-only bullets ("how did you feel?") substituting for retrieval
- Fewer than four items when verification function is required
- Checklist items that are section headings rendered as checkboxes

#### Potential validation signals

- Item count ≥ 4
- Each item references task evidence, criteria, or output structure
- Imperative check verbs vs open reflective questions
- Misconception guard present on at most one focused item
- Reviewer can map each item to an expected_output requirement

---

### 5.8 `transfer_prompt`

#### Educational purpose

Require the learner to apply ideas to their own context — household, role, data, setting — with explicit completion expectations.

#### Learner effect

The learner connects session ideas to durable understanding by applying them outside the provided scenarios. Transfer is production in own context, not repetition of third-person cases.

#### Existing implicit contract

Contracts require transfer prompts on evaluate capstones and when `transfer_or_application_task` is set. Bodies include explicit completion criteria (e.g. minimum word band for written transfer). Late in session arc. Distinct from consolidation scaffold though may appear adjacent to closure.

#### Minimum realisation

- Prompts referencing learner's own context (your case, your setting, your data)
- Explicit completion criterion (length, elements to include, or evidence required)
- At least one substantive transfer prompt on capstone or transfer-designated activity

#### Strong realisation

- Multiple cues: context selection, application, and limitation ("what assumption might fail elsewhere?")
- Links back to criteria or key ideas from the session
- Calibrated demand for higher education (not trivial personal anecdote only)
- Paired with consolidation scaffold that supports but does not complete the transfer writing
- Distinguishes near transfer (similar context) from far transfer (new domain or role)

#### Failure modes

- Third-person scenarios only throughout — no own-context prompt
- Vague "apply to your life" without completion criteria
- Transfer prompt absent when transfer task field is set
- Transfer body so thin it cannot guide production
- Completed transfer essay supplied in materials when learner should write
- Transfer collapsed into generic reflection prompts

#### Potential validation signals

- Second-person possessive references (your, you)
- Stated completion band (words, elements, evidence types)
- Presence on capstone or transfer-flagged activity
- Absence of pre-written learner transfer response
- Reviewer can identify what the learner must produce in own context

---

### 5.9 `consolidation_summary`

#### Educational purpose

Close the session by supporting consolidation of key ideas — what to remember, what changed, how to apply — without replacing learner-produced closure when the task requires it.

#### Learner effect

The learner synthesises session learning: recalls main ideas, notices change in understanding, and prepares to apply ideas. When learner writing is required, the material scaffolds reflection without supplying the completed answer.

#### Existing implicit contract

Contracts require distinct consolidation material when DLA lists the type or consolidation is required. Minimum body addresses three key-idea angles (remember / what changed / how to apply). When learner_task or expected_output require explanation, synthesis, comparison, reflection, or evaluation — scaffold only: self-check prompts, comparison frameworks, sentence starters, checklist review, transfer cues. Forbid model essays, past-tense "you have learned" summaries, and pre-written synthesis fulfilling expected_output.

#### Minimum realisation

- Distinct consolidation material (not prompt_set or reflection_prompt alone)
- Substantive closure prose or scaffold addressing at least three key-idea angles
- When learner production required: reflective scaffolding only — no completed learner deliverable
- When learner production not required: informational closure permitted

#### Strong realisation

- Explicit angles: recall, change in understanding, application forward
- Self-check questions tied to session criteria and activities completed
- Sentence starters or comparison frames that structure without filling
- Transfer cue linking to next context without writing the transfer for the learner
- Distinct from table reprint or outcomes list repetition
- Voice appropriate to higher-education self-study (analytic, not diary-only)

#### Failure modes

- Prompt_set or reflection_prompt only, labelled as consolidation
- Model essay or completed capstone memo when learner must write
- Past-tense session summary ("In this session you learned…") substituting for learner reflection
- Table reprint or outcomes bullet list with no consolidation move
- Consolidation absorbing exposition, rubric, or worked materials from other types
- Sole evaluate vehicle — all judgement collapsed into closure block
- Spoiler: pre-written strategy recommendation fulfilling ranking task

#### Potential validation signals

- Three or more distinct closure angles addressed
- Scaffold patterns (reflect, compare, review, complete) vs declarative past-tense summary
- Absence of full expected_output text in consolidation body when learner-write required
- Distinct material type not relabelled as prompt_set
- Reviewer can distinguish teacher synthesis from learner task prompts

---

### 5.10 `rubric`

#### Educational purpose

State how to judge the quality of comparison, ranking, planning, or written work — operational criteria the learner uses to produce and justify their own judgement.

#### Learner effect

The learner knows what counts as strong evidence, reasoning, or decision quality before ranking or comparing. Judgement remains learner-generated; the rubric teaches the lens.

#### Existing implicit contract

Contracts require at least three criteria for compare/rank tasks. Criteria may include performance levels or must/should bullets. Learner-generated judgement — do not pre-fill effectiveness or rating scores in companion tables. May appear as separate rubric material or as criteria exposition in text/modelling materials in evaluate arcs.

#### Minimum realisation

- At least three named criteria relevant to the judgement task
- Criteria stated in learner-facing language
- Enough detail to distinguish weak from strong performance on each criterion
- Adjacent to ranking, comparison, or planning task (logically, not necessarily physically)

#### Strong realisation

- Performance levels or must/should gradations per criterion
- Criteria operationalised with discipline-specific indicators
- Examples of what satisfies vs fails a criterion (without pre-scoring the learner's items)
- Alignment with expected_output justification requirements
- Criteria dimensions that match decision_table columns or template sections

#### Failure modes

- Rank task with table only — criteria absent
- Criteria labels without usable detail ("quality", "depth")
- Pre-filled scores or ratings in judgement table
- Rubric that completes the ranking for the learner
- Facilitator marking scheme tone not usable by learner
- Single criterion or generic bullet list

#### Potential validation signals

- Criteria count ≥ 3
- Each criterion has observable indicators or levels
- Companion table judgement cells empty
- Criteria terms appear in checklist or expected_output
- Reviewer can apply rubric to a hypothetical weak and strong response

---

### 5.11 `quality_criteria`

#### Educational purpose

Same educational function as `rubric` — express the standards by which comparison, ranking, or written work should be judged. The paired type name reflects authoring vocabulary; the instructional contract is shared.

#### Learner effect

Same as rubric: the learner applies explicit standards to their own judgement and justification.

#### Existing implicit contract

Treated equivalently to `rubric` in workbook contracts: at least three criteria for compare/rank tasks; learner-generated judgement; supports expected_output justification; must/should bullets or leveled criteria acceptable.

#### Minimum realisation

- At least three quality criteria named for the task
- Learner-usable wording (not assessor-only shorthand)
- Linked to a compare, rank, evaluate, or plan task

#### Strong realisation

- Must/should hierarchy or levels of quality per criterion
- Criteria tied to disciplinary epistemic norms (evidence, mechanism, scope, transferability)
- Cross-reference to modelling or worked weak/strong examples
- Distinct from checklist (criteria teach judgement; checklist verifies completion)

#### Failure modes

- Same as rubric failure modes
- Type name present with rubric-empty body
- Quality criteria duplicated as outcomes list with no judgement use
- Pre-supplied ratings in companion materials

#### Potential validation signals

- Same as rubric signals
- Must/should or level language present
- Distinguishable from learning outcomes (judgement-applicable, not topic list)

---

## 6. Material relationships

Materials interact within a session arc. These relationships are educational, not structural.

| Relationship | Contract |
|--------------|----------|
| **text → practice** | Exposition precedes practice; learner should encounter ideas before applying them. |
| **worked_example → template / table** | Modelled completion precedes partial or empty learner cells. |
| **modelling_note → decision_table** | Decision rules precede guided grid practice. |
| **rubric / quality_criteria → decision_table / template** | Criteria precede learner ranking or justification. |
| **checklist → submission** | Verification follows task attempt; items reference expected_output. |
| **misconception_note → faded / independent** | Error interruption most valuable when support is reduced. |
| **transfer_prompt → consolidation_summary** | Transfer applies ideas; consolidation scaffolds recall and change — neither completes the other. |
| **sample_output ↔ worked_example** | Sample shows product quality; worked shows process — both may be needed; neither substitutes for the other. |

### 6.1 Anti-collapse rules (educational)

| Collapse | Why it fails |
|----------|--------------|
| Consolidation absorbs exposition, rubric, or worked judgement | Closure replaces teaching and modelling |
| Prompt_set substitutes for consolidation | Reflection prompts without session synthesis scaffold |
| Table-only resource | No exposition, modelling, or verification |
| Template-only substitutes for worked_example | Empty or partial structure without expert reasoning |
| Task_cards carry scenario or criteria assigned to other types | Function present in task text but not learnable as material |

---

## 7. Realisation depth rubric

Reviewers may classify any material body using three levels. This rubric applies across types.

| Level | Definition |
|-------|------------|
| **Failed** | Material label or slot present but educational function not performed; or function actively undermined (spoiler, pre-answer, collapse). |
| **Minimum** | Function performed at threshold — learner can experience the move; thin but usable. |
| **Strong** | Function performed with disciplinary precision, fading respect, and clear learner agency. |

A resource may contain minimum realisations throughout and still be educationally coherent. Strong realisation is the target for high-stakes moves: modelling, evaluative judgement, transfer, and closure.

---

## 8. Contract coverage summary

| Material type | Primary instructional move | Strongest existing specification density |
|---------------|---------------------------|----------------------------------------|
| `text` | Exposition / criteria teaching | Workbook exposition + evaluate criteria |
| `worked_example` | Modelled procedure + reasoning | GAM-WB-02 + faded-support arc |
| `modelling_note` | Expert decision visibility | Judgement contrast + GAM-WB-03 |
| `misconception_note` | Error interruption | GAM-WB-15 (optional) |
| `sample_output` | Quality calibration | GAM-WB-12 + anti-spoiler |
| `decision_table` | Guided judgement grid | LD-TABLE-FIDELITY + AP-03 |
| `checklist` | Criteria-linked verification | DLA-WB-26 + retrieval mix rules |
| `transfer_prompt` | Own-context application | DLA-WB-28/29 + word-band |
| `consolidation_summary` | Session closure scaffold | GAM-WB-06/06b |
| `rubric` | Judgement standards | GAM-WB-09/14 |
| `quality_criteria` | Judgement standards (paired) | Same as rubric |

Specification density is uneven: checklist, transfer, consolidation, worked/modelling, and decision_table carry the most distributed contract text and runtime checks. Misconception, rubric, and quality_criteria are primarily prompt-level with weaker consolidated specification.

---

## 9. Document status and next steps

This is the **first complete draft** of Sprint 44-2. Intended uses:

- Educational review of Marx, Photosynthesis, and future cross-domain fixtures against explicit depth standards
- Reference for authors writing `required_materials` specifications
- Foundation for a future unified material-type specification (out of scope for this sprint slice)

**Not in this document:** mapping contracts to prompts, validators, or preservation tiers; enforcement design; renderer or layout changes.

---

## 10. Source trace (implicit contracts consolidated)

Educational intent in this document is derived from existing PRISM artefacts, including:

- `domains/learning-design/domain-learning-design-artefacts.md` (type schemas)
- `domains/learning-design/domain-learning-design-prompt-rules.md` (§6b–6f rhetoric and faded-support)
- `docs/development/sprints/2026-06-05-sprint-38j-instructional-function-planning/artefacts/gam-prompt-baseline.txt`
- `docs/development/sprints/2026-06-05-sprint-38j-instructional-function-planning/artefacts/gam-pres-pack-block.txt`
- `docs/development/sprints/2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md`
- `docs/development/sprints/2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md`
- Distributed runtime intent in `lib/page-role-registry.js`, `lib/page-gam-materials-preserve.js`, `lib/gam-output-format.js`, `lib/dla-38l-obligation-check.js`, `lib/ld-table-fidelity.js`, and associated tests

This trace is documentary only. It does not prescribe implementation.
