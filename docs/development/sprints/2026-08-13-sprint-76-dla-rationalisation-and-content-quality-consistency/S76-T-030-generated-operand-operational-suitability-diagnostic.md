# S76-T-030 — Generated-operand operational suitability diagnostic

**Task:** S76-T-030  
**Status:** **Diagnostic complete** (2026-08-13) — not implementation  
**Mode:** DIAGNOSTIC ONLY — no production code, prompt, schema, validator, test, fixture, EP, DLA, GAM, Design Page, Graphics, QA, or Settings changes  
**Depends on:** [T-010](S76-T-010-dla-audit-report.md) · [T-021](S76-T-021-dla-p01-solution-design.md) · [T-022](S76-T-022-dla-p03-solution-design.md) · [T-023](S76-T-023-dla-p01-p02-p03-implementation-plan.md) · [T-024](S76-T-024-dla-p01-p02-p03-gate-a-b.md) · [T-026](S76-T-026-dla-p01-residual-operand-closure-diagnostic.md) · [T-028](S76-T-028-dla-p01-residual-operand-closure-implementation.md)  
**Out of scope:** fix implementation · P01 reopening · P04 · P05 · maths validators · regex heuristics · A4/A5 full investigation

This artefact diagnoses a **post-P01-R1 Lagrangian re-benchmark residual**. It does not authorise a solution. It does not mark anything fixed. It does not claim RECOVER. It does not start P04.

---

## Limitation — runtime artefacts

Exact runtime EP / DLA / GAM JSON for the 2026-08-13 post-T-028 Lagrangian re-benchmark is **not persisted in the repository**. No IndexedDB dump, captured page JSON, or `*lagrangian*` benchmark artefact for this run was found under `docs/` or test fixtures. The Lagrangian `L = x + y + λ(20 - x - 2y)` and the FOCs `1 - λ = 0`, `1 - 2λ = 0` are **operator-reported QA evidence**, not git-captured bodies.

Reconstruction therefore uses:

1. **Operator-reported re-benchmark observations** in the diagnostic brief (primary live evidence);  
2. **T-010 / CONTEXT / T-021 / T-022 / T-026** historical Lagrangian A2/A3 exhibits (same subject, earlier runs — **not** this run’s specification text);  
3. **Current production prompt / contract / validator surfaces** in the repository.

Where live JSON is needed to quote `learner_task`, `required_materials[].specification`, or GAM Problem A vs Problem B bodies, this report states the **role pattern and contract** rather than inventing wording.

Operator-reported post-T-028 score (not an in-repo artefact): Lagrangian QA **84 / 100 — Strong**. P01 residual **worked** (A2/A3 commissioned real practice problems as task inputs; worked examples / workspaces / scaffolds were not substituted). **Do not reopen P01 structural closure.**

---

## 0. Failure in one paragraph

P01 now gets the **object** commissioned and fulfilled: A3 has explicit new optimisation / Lagrangian inputs; GAM generated them. QA then found that **Activity 3 Problem B** is not operationally usable with the method the activity teaches. Interior first-order conditions for `L = x + y + λ(20 - x - 2y)` require incompatible λ values. The activity teaches deriving and solving a simultaneous interior FOC system; it does not teach the boundary / corner reasoning this problem needs. This is **not** a missing-operand failure. The operand exists. The generated particular is **not suitable for the commissioned learner operation**.

The production pipeline currently contracts **structural** fulfilment (row exists; purpose/specification non-empty; GAM 1:1; specification treated as binding content bounds). It does **not** contract **operational suitability**: that a generated particular can actually be acted on using the method just taught. [T-022](S76-T-022-dla-p03-solution-design.md) already named “solvable by the taught method” / “method constraints” as load-bearing A3 specification content in **design**. Gate B implemented structural P03 only. GAM is not told to verify disciplinary executability of generated operands.

---

## 1. Exact A3 chain

### 1.1 EP A3 (reconstructed)

Live EP JSON is not in git. Historical Lagrangian A3 (T-026 / T-010) and the operator brief agree on the pedagogical job:

| Field | Reconstruction | Source |
| ----- | -------------- | ------ |
| Typical archetype / choreography | `apply`: orientation → worked_example → **practice** | T-026 §2, §5 |
| Beats | Model FOC procedure, then independent practice on **new** problems | T-026 A3; operator: A3 commissioned explicit new optimisation/Lagrangian inputs |
| Mapped LO | LO3 — derive / solve first-order conditions for a candidate optimum (operator: LO3 **PARTIALLY ALIGNED**) | Operator QA |
| What EP does **not** own | Material ids, specification text, generated numbers | T-021 / T-022 architecture |

EP sets the **operation** (practise interior FOC derivation and simultaneous solution). It does not author the stems.

### 1.2 DLA A3 (reconstructed)

| Field | This re-benchmark (operator) | Historical (pre-T-028) |
| ----- | ---------------------------- | ---------------------- |
| Learner production | Derive and solve a simultaneous interior FOC system on new problems | Guided FOC calculations on new Lagrangian/problem(s) (T-026) |
| `task_material_decision` | Practice problems correctly identified as **task inputs** | `true`, but ids were workspace/model (T-026) — **fixed by T-028** |
| Practice-problem row | **Present** (explicit new optimisation / Lagrangian inputs) | **Absent** (T-010 / CONTEXT A3) |
| `evidence_decision` | Not reopened; A2/A3 remain ordinary practice (`required: false` in T-027/T-028) | Same |
| `purpose` / `specification` | **Not persisted.** Operator: A3 commissioned explicit new optimisation/Lagrangian inputs. Exact method/solvability clauses unknown. | T-022 exhibit of a *sufficient* spec: count; **solvable by the taught method**; explicit objective and constraint in the material; independence from A2; solution not pre-filled |

P03 validators (`validateOrdinaryMaterialCommission` in `lib/page-dla-enrich.js`) require non-empty `purpose` and `specification`, and reject specification that is only the `material_type` token. They do **not** inspect method/solvability.

Commissioning-order step 3 (live, `lib/ld-dla-page-enrich-contract.js`):

> non-empty purpose (the job of this material) and non-empty specification (binding GAM bounds: content, load-bearing count/variation/constraints/exclusions; not body prose). specification must not be only the material_type token.

That gloss **permits** DLA to write “solvable by the taught interior FOC procedure; no corner/boundary cases.” It does **not require** that clause. “Constraints/exclusions” is unspecified as to *which* constraints are load-bearing.

### 1.3 GAM A3 (operator-reported realisation)

| Item | Evidence |
| ---- | -------- |
| Fulfilment | GAM **faithfully generated** the commissioned operands (operator). P01 substitution did not recur. |
| Problem A | Not persisted. Operator contrast implies A2 problems and (implicitly) at least one A3 problem were usable enough that QA isolated **Problem B**. |
| Problem B | `L = x + y + λ(20 - x - 2y)`. Interior FOCs: `1 - λ = 0` and `1 - 2λ = 0` (incompatible λ). |
| Checking / workspace / model | Operator: not substituted for operands. Not investigated here as the defect source. |

### 1.4 Where the requirement failed to become binding

The transition that **did** happen (T-028 / this run):

> “the learner needs new practice problems” → **commission and generate those problems as task inputs.**

The transition that **did not** become a production invariant:

> “generate suitable introductory practice problems” → **each generated problem must be solvable using the interior FOC procedure just taught.**

That second requirement exists in **T-022 design** (A3 nature: “solvable by the taught method”; practice-set spec typically includes “method constraints”). It is **not** a model-visible GAM duty, **not** a P03 validator, and **not** a named DLA commissioning invariant beyond the generic “constraints/exclusions” phrase.

**Primary question answer (ranked):** **D — shared**, with **A** (DLA commission underspecified the pedagogically load-bearing mathematical constraint) and **C** (GAM fulfilment contract does not require internal disciplinary/task validity strongly enough) as the two legs. **B** (GAM violated an adequate commission) is **unproven** without live specification text. **F** (ownership gap) is true in the weaker sense that neither layer currently *owns* operational suitability as a named duty. **E** (another existing layer) is **not** supported: QA detected it; QA is not the generation contract.

---

## 2. DLA commission analysis

### 2.1 Constraint classification (production vs design)

| Concern | Production DLA contract | T-022 design (A3 exhibit) | Live run (JSON missing) |
| ------- | ----------------------- | ------------------------- | ----------------------- |
| Introductory / simple constrained optimisation | ABSENT as invariant; may be IMPLIED if DLA wrote it | IMPLIED by “taught method” / introductory practice | Unknown |
| Objective-function form | ABSENT unless DLA specified | IMPLIED (explicit objective in the material) | Unknown |
| Constraint form / one constraint | ABSENT unless DLA specified | IMPLIED (equality-constrained / Lagrangian) | Problem B has one linear constraint — form OK |
| Derivation of FOCs | IMPLIED by typical A3 `learner_task` / purpose | IMPLIED | Operator: activity teaches this |
| Simultaneous solution | IMPLIED by typical A3 production | IMPLIED | Operator: activity teaches this |
| Existence of an interior candidate solution | **ABSENT** as production invariant | **EXPLICIT in design:** “solvable by the taught method” | **Failed in Problem B** |
| Consistency of FOCs | **ABSENT** | Covered by “solvable by the taught method” | **Failed in Problem B** |
| Suitability for the taught procedure | **ABSENT** as named duty | **EXPLICIT in design** (method constraints) | **Failed** |
| Boundary / corner cases | **ABSENT** (no default exclusion) | Would be an **exclusion** if DLA intends interior-only practice | Problem B effectively **is** a boundary case |
| Withhold solutions | Common P03 exclusion in design | EXPLICIT in T-022 A3 exhibit | Unknown; not the QA defect |
| Progression / difficulty | ABSENT unless DLA intends a spread (T-022: GAM may choose similar difficulty) | Difficulty is **elaboration**, not the defect | Problem B is not “harder interior FOCs”; it is a **different method** |

### 2.2 Could a reasonable GAM satisfy the literal commission and still produce Problem B?

**YES**, if the live specification was structural in the sense Gate B actually enforces: two (or more) new optimisation / Lagrangian problems, explicit objective and constraint, solutions withheld, distinct from the worked example.

Problem B **is** an equality-constrained optimisation statement. It **looks like** a Lagrangian practice stem. Interior FOCs can be **written**. They cannot be **solved consistently**. That distinction is exactly what structural P03 does not see.

**NO** only if the live specification already required interior solvability / “solvable by the taught method” / “do not require untaught boundary reasoning.” That clause is what T-022 said DLA should write. Live JSON is missing, so this report **cannot** prove GAM violated such a clause. Operator language (“GAM faithfully generated those operands”) is consistent with structural fulfilment of a form/count/job commission.

**Conclusion:** On the evidence that *can* be inspected (production prompt + P03 validators + T-022 design vs Gate B implementation), the commission **as contracted** is underspecified in a pedagogically load-bearing way. Whether *this run’s* DLA prose happened to be tighter is unproven and would not close the **architectural** gap: the pipeline does not require that tightness.

---

## 3. GAM fulfilment contract

### 3.1 What GAM is actually told

| Surface | Instruction (faithful paraphrase) | Structural vs semantic |
| ------- | --------------------------------- | ---------------------- |
| `app.js` `buildGamV2CopyMaterialAuthoringBrief` | Honour `required_materials[].purpose`; treat `specification` as **binding content bounds**; if `evidence_requirement` present, satisfy it and avoid pre-disclosing the conclusion | Structural + **evidence** semantic |
| `lib/ld-gam-page-enrich-contract.js` | 1:1 ids; order; non-orphan; `evidence_requirement` binding; instructional depth (subject-matter first); long **evidence-centred** fulfilment (inspectability, delayed disclosure, source-bound honesty) | Structural + **P02** semantic |
| Fulfilment validators | Non-empty body + format; guided-review JSON shape; 1:1 coverage | Structural |
| Pack GAM `promptTemplate` / GAM-PRES | **Not** the Copy path (T-010 / T-022). Copy skips pack. | Not model-visible on Copy |
| Instructional depth | Teach concepts/evidence/reasoning; exemplar quality; anti-rubric-gaming | Quality of **exposition**, not operand solvability |

T-024: “GAM brief limited to specification binding; 1:1 unchanged. GAM does not interpret `task_material_decision` or discover missing inputs.”

### 3.2 What GAM is **not** told

Do **not** infer duties that are not in the prompt:

- ensure generated material is internally mathematically valid;  
- ensure examples/problems actually support the commissioned learner **operation**;  
- check disciplinary correctness of generated stems;  
- avoid introducing **untaught** reasoning requirements;  
- verify generated operands against the requested procedure (interior FOC, statistical test assumptions, target grammar construction, etc.).

Evidence fulfilment is the one place GAM **is** given a semantic job (inspectable observations; do not pre-state the judgement). Ordinary practice operands have **no analogue**.

### 3.3 Distinction

**STRUCTURAL FULFILMENT** (currently contracted): produce the commissioned rows — two problems of the requested form, matching ids, honouring purpose/specification as content bounds.

**SEMANTIC / DISCIPLINARY FULFILMENT** (currently contracted for evidence providers, **not** for ordinary practice operands): those problems must actually work for the commissioned learning operation.

Problem B is a **semantic / disciplinary** miss under structural fulfilment.

---

## 4. Should P03 have prevented this?

Accepted P03 principle ([T-022](S76-T-022-dla-p03-solution-design.md)):

> DLA owns requirements. GAM elaborates realisation inside the brief. GAM must not invent load-bearing count, operand nature, or pedagogical job.

P03 specifications should include load-bearing content, count, variation, constraints, exclusions.

### 4.1 Is interior solvability a load-bearing authoring constraint DLA should commission?

**Yes, as a class — method constraint / exclusion — not as a Lagrange-specific FOC checklist.**

T-022 already treated A3’s sufficient spec as including **nature: solvable by the taught method**. Practice-problem-set specification “typically bounds: count, distinctness from WE, **method constraints**, no solutions.” Gate B implemented the *fields* and a compact gloss, not that A3 exhibit as a model-visible rule.

For this activity, “each practice problem must admit a solution using the interior FOC method taught” is the **method constraint**. “Do not require KKT / boundary / corner reasoning” is the **exclusion**. Those change the pedagogical job. They are not “obvious arithmetic hygiene.”

### 4.2 Is it an inherent correctness obligation GAM should satisfy without DLA spelling out every theorem?

**Also yes, at a more general level — operational suitability of realisation — without becoming invented pedagogy.**

Once DLA has commissioned “practice problems for the taught interior FOC procedure,” GAM’s elaboration job is to invent **actual functions and numbers inside those bounds** (T-022). Inventing a stem that cannot be executed with that procedure is not legitimate variation; it is leaving the brief. GAM must not invent the opposite either (e.g. turning the activity into a boundary-reasoning lesson DLA did not commission).

### 4.3 Ownership boundary (recommended)

| Owner | Owns | Does not own |
| ----- | ---- | ------------ |
| **DLA** | Learner operation; load-bearing method/form; exclusions that change the job (interior-only vs include corners; which test; which construction); count/variation **intent** | Enumerating every disciplinary correctness theorem; writing the actual numbers; a new schema field for “operational suitability” |
| **GAM** | Realising particulars that can actually be **acted on** with the commissioned operation; elaboration of wording/numbers **inside** the brief; not introducing untaught load-bearing reasoning | Inventing a harder pedagogical job; discovering missing P01 rows; subject-specific solvers |

**Do not** turn DLA specifications into enormous lists of obvious correctness requirements (“FOCs must be consistent,” “division by zero forbidden,” “chi-square cells large enough,” …).

**Do** treat **operational suitability for the commissioned operation** as:

1. something DLA should bound when the method/exclusion is load-bearing and not implied by a one-word type token;  
2. something GAM should treat as inherent to **fulfilling** purpose + specification + `learner_task`, parallel to how `evidence_requirement` is already binding for providers.

That is **shared responsibility**, not “GAM should just know Lagrange.”

---

## 5. Difficulty vs operational suitability

**DIFFICULTY / VARIATION** — legitimate GAM elaboration inside a commission: messier algebra, different economic story, two variables instead of one, numbers that are slightly less round — **provided the learner can still perform the commissioned operation**.

**OPERATIONAL SUITABILITY** — whether the generated operand can actually be acted upon using the learner operation / method the activity specifies.

Problem B is not “a harder interior FOC drill.” It requires a **different operation** (recognise inconsistency; move to boundary / KKT reasoning) that the activity does not teach.

**Operational suitability is the missing concept.** This diagnostic does **not** create a schema field. The concept is for later design: it may live as a compact DLA specification duty (method constraints / exclusions) plus a compact GAM fulfilment duty (realise operands the commissioned operation can use). It must not become a third audit stack.

---

## 6. Cross-disciplinary test

General rule: **DLA names the operation and load-bearing method/exclusions. GAM guarantees generated particulars actually support that operation.**

| Domain | What DLA must specify | What GAM should guarantee by fulfilling the commission |
| ------ | --------------------- | ------------------------------------------------------ |
| **Statistics** | Which test / procedure; what the dataset is for (practise *that* test). Load-bearing exclusions if assumptions are in-scope vs out-of-scope (e.g. “dataset should satisfy the taught test’s assumptions” **or** “include a violation if the lesson is about checking assumptions”). | Generated dataset is usable for the **commissioned** test. If DLA commissioned assumption-satisfying practice, do not emit a dataset that forces an untaught workaround. |
| **Programming** | Debugging using concepts taught so far; APIs/constructs in play; exclusion of untaught surfaces if that is the pedagogical bound. | The bug is diagnosable with those concepts. Do not require an unintroduced API as the only fix. |
| **Languages** | Specified grammar construction; count/coverage of instances if load-bearing. | The passage actually contains (and is practiseable via) that construction. |
| **History** | Comparison task; what dimension(s) must be comparable if that is the job. | Sources actually share a task-relevant comparable dimension. |
| **Chemistry** | The calculation / procedure; any bounds on measurable quantities if load-bearing. | Generated values make the requested calculation defined and executable. |

In every case, DLA should **not** list every validity theorem of the discipline. GAM should **not** invent a different lesson. The shared object is **operational suitability of the generated particular for the commissioned operation**.

---

## 7. Existing defensive / quality guidance

| Location | What exists | Effect on this defect |
| -------- | ----------- | --------------------- |
| T-022 A3 exhibit / role table | “solvable by the taught method”; practice specs include **method constraints** | **Design only.** Not copied into Gate B as a model-visible invariant. |
| DLA commissioning-order step 3 | “load-bearing count/variation/constraints/exclusions” | Generic permission. Did not make method/solvability mandatory. |
| P03 validators | Non-empty purpose/spec; type-echo fail-close | Structural. Would accept a well-written spec that still omitted interior solvability; would also accept Problem B’s commission if the spec was structural. |
| GAM Copy brief | Specification is binding content bounds | Structural honouring of whatever DLA wrote. No disciplinary check. |
| GAM evidence fulfilment | Inspectability, delayed disclosure, source-bound honesty | **P02 only.** A3 is ordinary practice. |
| Instructional depth | Subject-matter first; exemplar quality | Exposition quality, not stem solvability. |
| Pack DLA-WB / GAM-PRES | Practice tables, WE-before-practice, realise required_materials | T-026: compete on **operand presence**, not operand **validity**. Copy GAM skips pack. |
| QA | Detected Problem B; A3 Do/Overall WEAK; LO3 partial; Subject & Disciplinary Quality reduced | **Detection layer.** Not a generation contract. |

**Finding:** The desired principle **exists in design (T-022)** and **failed to influence generation** because Gate B did not make it model-visible, and GAM has no ordinary-operand analogue of evidence fulfilment. Adding another generic “be correct / be consistent / be solvable” paragraph would **duplicate the T-022 idea weakly** and is the **P04 accretion pattern** Sprint 76 is trying to stop. Later design should name **operational suitability** once, compactly, across DLA commissioning and GAM fulfilment — not append a new self-audit list.

---

## 8. Deterministic validation

**Generally NO.** Operational suitability is disciplinary / semantic. A generic pipeline must not grow subject-specific solvers (Lagrange FOC consistency, statistical-assumption engines, grammar parsers, chemistry-unit checkers).

**Narrow structural aspects** already validated (and still appropriate): row presence (P01), non-empty purpose/specification (P03), 1:1 GAM coverage, type-echo. Those would **not** have caught Problem B.

Subject-specific deterministic validation is **inappropriate** for the generic EP → DLA → GAM pipeline.

Do **not** propose regex heuristics (“must contain λ”, “must not contain corner”). They would both false-positive and false-negative.

QA remains a legitimate **detection** layer for residual generative defects. That does not make this class “QA’s job to prevent.”

---

## 9. QA ownership

QA correctly detected a real disciplinary/pedagogical defect. That is working as a last line of defence.

Intended architecture is **not**:

> generation may freely emit operationally unsuitable operands → QA always catches them → revision cycle is the design.

That would treat a load-bearing generation-contract gap as expected product behaviour.

Intended architecture **is**:

> DLA/GAM contract should **normally** prevent operationally unsuitable operands; QA catches residual generative misses and other classes (teaching errors, visual contradiction, etc.).

**Problem B represents BOTH:**

- **EXPECTED GENERATIVE VARIANCE** — LLMs can emit inconsistent FOCs; A2’s usable problems on the same run show the model can also get this right.  
- **A CONTRACT / OWNERSHIP GAP** — neither DLA nor GAM is currently required to treat operational suitability as a duty, so variance is unconstrained at the exact point the activity becomes method-practice.

“QA caught it” does **not** mean no upstream improvement. It also does **not** mean implement a Lagrange checker.

---

## 10. Compare A2

| | A2 | A3 Problem B |
| - | -- | -------------- |
| Commissioned operands (this run) | Practice optimisation problems as task inputs (operator; P01-R1 worked) | Explicit new optimisation / Lagrangian inputs (operator; P01-R1 worked) |
| Learner operation | **Construct L** for given objective + constraint | **Derive and solve** interior FOCs simultaneously |
| What makes an operand valid | Well-formed objective and constraint the learner can write L for. Inconsistent later FOCs do **not** invalidate Lagrangian *construction*. | Existence of a consistent interior candidate the taught procedure can solve. |
| Realisation | Operator: usable | Problem B: FOCs incompatible |
| Commission tightness | Unknown without JSON. T-022 A2 sufficient spec: nature, count, distinct from WE, construct L, no completed Lagrangians. Difficulty optional. | T-022 A3 sufficient spec **already included** “solvable by the taught method.” Production prompt did not force that clause. |

**Was A2 commissioned more tightly?** Unproven (no JSON). Architecturally A2’s **operation is more tolerant**.

**Was A3 inherently more mathematically constrained?** **Yes.** Solving a simultaneous interior system is a stricter operational demand than writing L.

**Did GAM simply make one bad generative choice?** **Yes, as mechanism.** That is the variance leg.

**Does the contrast reveal a missing general principle?** **Yes.** The same structural commission (“generate N optimisation problems”) is operationally sufficient for A2 and insufficient for A3. The missing principle is **operational suitability relative to the commissioned operation**, not “generate better maths.”

---

## 11. Ranked causal assessment

### 1. CROSS-LAYER OWNERSHIP GAP (shared DLA commissioning + GAM fulfilment)

**Confidence:** HIGH  

**Repository evidence:** T-022 names “solvable by the taught method” / method constraints as DLA spec content; Gate B implements structural P03 only; GAM brief binds specification as content bounds with no ordinary-operand validity duty; evidence fulfilment is the only semantic GAM job.  

**Benchmark evidence:** Operand present; Problem B unusable for taught interior FOCs; A2 usable under a more tolerant operation.  

**Counter-evidence:** Live specification might already have said “interior / solvable”; then this run would be GAM violation of an adequate commission. JSON missing.  

**Architectural implication:** Do not pick a single villain. Design a compact shared principle. Do not reopen P01. Do not treat as P02. Do not treat as empty-spec P03 (purpose/spec were non-empty enough to generate two problems).

### 2. DLA P03 UNDERSPECIFICATION (load-bearing method constraint not required)

**Confidence:** HIGH for the **contract**; MEDIUM for **this run’s** DLA prose  

**Repository evidence:** Step 3 gloss lists constraints/exclusions but does not define operational suitability; validators are non-empty/type-echo only; T-022 A3 exhibit never became model-visible.  

**Benchmark evidence:** A3 commissioned “new optimisation/Lagrangian inputs” (operator) — that description is form/job, not interior solvability.  

**Counter-evidence:** DLA might have written a tight spec this run.  

**Architectural implication:** Later DLA change, if any, is a **compact method-constraint reminder**, not a Lagrange FOC appendix, and not P04 evidence-audit deletion.

### 3. GAM CONTRACT GAP (no semantic fulfilment for ordinary operands)

**Confidence:** HIGH  

**Repository evidence:** §3 tables; T-024 “specification is binding”; `ld-gam-page-enrich-contract.js` evidence block vs silence on practice-stem validity.  

**Benchmark evidence:** Faithful generation of an unsuitable stem is exactly structural fulfilment.  

**Counter-evidence:** “Don’t generate impossible problems” might be thought obvious. The prompt does not say it; Sprint 76 should not infer prompt duties.  

**Architectural implication:** A small GAM fulfilment clarification (operands must be usable for the commissioned operation; do not introduce untaught load-bearing reasoning) is in scope for later design. It is **not** a GAM architecture redesign.

### 4. EXPECTED GENERATIVE VARIANCE

**Confidence:** HIGH as **mechanism**; LOW as **sufficient architectural diagnosis**  

**Benchmark evidence:** Same run produced usable A2 problems and a bad A3 Problem B.  

**Counter-evidence:** Variance unconstrained by contract will recur. QA-only repair is the accretion/revision loop Sprint 76 is trying to reduce.  

**Architectural implication:** Keep QA. Do not stop at QA.

### 5. GAM FULFILMENT FAILURE (violated an adequate commission)

**Confidence:** LOW without JSON; MEDIUM as a **possible** this-run fact  

If the live spec already required solvability by the taught method, GAM violated it. That would still leave the **contract gap** (nothing makes that spec likely or checks it). It would not make DLA innocent of the general problem.

### NOT SUPPORTED

- Reopening **P01** (operands were commissioned and generated).  
- **P02** (A3 is not an evidence-provider miss).  
- **Empty/vague P03** as originally defined (type-echo / missing spec) — this is a **deeper P03 content** miss: spec can be non-empty and still omit the load-bearing method constraint.  
- Generic subject-matter hallucination (the Lagrangian is well-formed as an expression; the failure is pedagogical executability).  
- Pack DLA-WB as primary cause (T-026’s competitor was operand **absence**; this run has operands).  
- Deterministic maths validation.

---

## 12. Bounded problem statement

**Generated-operand operational suitability:**

Explicit task operands are now commissioned and fulfilled, but PRISM does not reliably ensure that a **generated operand is operationally suitable** for the learner operation it was commissioned to support.

Distinguish from:

| Existing problem | Difference |
| ---------------- | ---------- |
| **P01** missing operands | The object is now present. |
| **P01-R1** operand vs workspace | Role selection succeeded on this run. |
| **P02** evidence semantics | A3 is ordinary practice; not provider/scaffold classification. |
| **P03** empty/vague commissions | Purpose/specification can be non-empty and still omit method/operational bounds; validators pass. |
| Generic subject-matter hallucination | The stem can be locally well-formed and still demand an **untaught operation**. |

Do **not** absorb this into DLA-P01..P05 as currently defined. It is a **shared DLA commissioning / GAM fulfilment** problem about operand **validity for the operation**, not about missing rows, evidence booleans, or type-echo specs.

This diagnostic does **not** assign a new register id. Later solution design may name it if authorised.

---

## 13. Relation to other QA findings (classify only)

**A4 — constraint satisfaction used as evidence of optimality**

**POSSIBLY RELATED.** If generated cases cannot support the taught optimality judgement (the particulars invite or only afford the wrong inference), that is the same **operational-suitability** class for a judgement operand. It may instead be a teaching / evidence-design miss (wrong criterion in the activity itself). Do not investigate further in this artefact.

**A5 visual — shadow-price graphic contradicting the lesson**

**SEPARATE CLASS.** This sits on the Design Page → Graphics pipeline (pedagogical consistency of a figure with the lesson), not on DLA/GAM practice-operand generation. T-029 already showed that lane has its own capture/handoff defects. Investigate later if authorised; do not fold into this problem.

---

## 14. Sequencing relative to P04

P04 is **DLA evidence-guidance rationalisation** (redundant self-audit of the P02 consistency story). This defect is **not** that story.

| Option | Assessment |
| ------ | ---------- |
| **A. Solve before P04** | Implementation of new DLA/GAM correctness prose **before** P04 would **add** unique prompt text that P04 would then have to rationalise. That fights S76-D03 (prevent APPEND NOW → RATIONALISE LATER). |
| **B. Record and defer until after P04** | **Recommended for implementation.** The problem is recorded here. Do not land new correctness guidance in live DLA/GAM prompts immediately before evidence-prose thinning. |
| **C. Part of P04** | **Rejected.** P04 must not absorb operational suitability. Different invariant; different layer (includes GAM). Casual absorption would either skip GAM or bury a generation-contract design inside evidence-audit deletion. |
| **D. Another bounded diagnostic first** | **Not required for this class.** Ownership is established despite missing JSON. A4/A5 need **separate** bounded looks later, not a continuation of this diagnostic. |

**Recommendation:** **B** for live-prompt change. Solution design may be authorised as a **separate** follow-on (not P04, not P05) but must **not implement into DLA/GAM prompts before P04** unless the operator explicitly re-sequences. Unlike P01-R1 (T-026: clarify operand language *before* P04 so evidence deletion cannot strip the only provider≠scaffold contrast), this principle is **new**; it is not protecting language P04 might delete.

Do **not** begin P04 from this artefact. Do **not** begin solution design implementation from this artefact.

---

## Verdict

**GENERATED OPERAND VALIDITY READY FOR SOLUTION DESIGN**

Ownership is established: shared DLA method-constraint commissioning and GAM operational-suitability fulfilment; P01 remains closed; deterministic maths validation is out; P04 must not absorb this. Missing live JSON limits this-run spec quotation, not the architectural diagnosis.

**HARD STOP.** Do not implement. Do not begin P04. Do not begin P05. Do not modify DLA, GAM, EP, Design Page, Graphics, or QA from this artefact.

---

*End of S76-T-030.*
