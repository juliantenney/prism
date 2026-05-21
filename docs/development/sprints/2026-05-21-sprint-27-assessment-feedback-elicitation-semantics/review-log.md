# Sprint 27 review log



**Pack:** `docs/development/sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/`  

**Decisions:** R27-001+



---



## 2026-05-21 — Sprint 27 open (investigation pack)



### Programme decisions



| ID | Decision | Rationale |

|----|----------|-----------|

| R27-001 | Sprint 27 is **assessment/feedback elicitation semantics** — not renderer cleanup | Sprint 26 closed presentation blockers; key question is intent preservation |

| R27-002 | **No implementation** in 27-1 — evidence matrix and traces first | Avoid prompt tweaks before ontology |

| R27-003 | Three Sprint 26 cases are **primary evidence** (RNA, inflation, climate) | Already investigated; comparable matrix |

| R27-004 | Renderer layer **closed** for 27 unless export contradicts valid JSON | R26-PI-007–010, R26-007–010, climate materials hotfix |

| R27-005 | Hypothesis verdicts are **working** until 27-1 trace complete | See elicitation-evidence-matrix.md |



---



## 2026-05-21 — Slice 27-1 complete (evidence consolidation)



**Test floor:** `node --test tests/*.test.js` → **259 passed**, 0 failed.



### R27-006 — Slice 27-1 deliverables signed off



| Deliverable | Status |

|-------------|--------|

| `elicitation-evidence-matrix.md` — three cases filled | **Done** |

| E/O/G/C/R traces with file citations | **Done** |

| Prompt contract compare (DLA / GAI / Design Feedback / Design Page) | **Done** |

| H1–H6 adjudication | **Done** (see below) |

| Read-only probe | `context-files/27-1-extraction-probe.js` |



**Method:** Fixtures + unit tests + `app.js` / LD pack grep; no live OpenAI runs.



### R27-007 — Extract regex false positive on negated “correct answers”



**Evidence:** Climate paraphrase brief *“Do not reveal correct answers on the student handout”* → probe reports `include_answers: true` because `explicitIncludeAnswersCueRe` matches substring `correct answers` without negation handling (`app.js` ~7316–7328). Hide-answers pattern `reveal answers` does not match `reveal correct answers` (~7320–7321).



**Implication:** Brief-time elicitation can **invert** visibility intent; fixtures may rely on composer/runtime `feedback_display: none` instead (`ld-climate-misconception-discussion-page.json` L6).



**Layer:** **E** (primary), **C/R** (downstream mitigation).



### R27-008 — Design Feedback pruned for all three primary cases



**Evidence:** `explicitFeedbackRequested` requires `feedback pack|design feedback|…` (~10169–10171); pruning at ~11174. None of RNA / inflation / climate briefs include those terms → step omitted from probe topologies.



**Implication:** `feedback_pack` pedagogy is not in default chains for workshop + formative check briefs (H5/H6).



### R27-009 — Answer visibility is presentation/composition policy, not generation pedagogy



**Evidence:**



- GAI prompt requires `correct_answer` / `true_false_answer` in generated JSON (pack §9 ~2954).

- Page fixtures omit MCQ `correct_answer` (RNA, inflation) or keep T/F answers with `feedback_display: none` (climate).

- Render tests assert no “Correct answer” in HTML (`utility-ld-rna-assessment-page-render.test.js` L143–144; `utility-ld-climate-misconception-page-render.test.js` L149).



**Layer:** **C/R** for learner export; **G** may still generate answers upstream.



### R27-010 — `activities_required` extract gap for “task cards” / discussion workshop



**Evidence:** Climate probe extract lacks `activities_required`; `task cards` not in `activityCueRe` (~7296). Topology still includes DLA via `workshop` in `explicitSessionOrActivityRequested` (~10190–10191).



**Implication:** Activity intent can enter via **O heuristics** without **E** factor — harder to audit in Factory panel (H3/H6).



### R27-011 — Inflation extract side effects on `page_profile` and `assessment_type`



**Evidence:** Probe: `page_profile: facilitator` from “facilitator pacing notes” (~7305); `assessment_type: case_study` from inputs (~7313) while `desiredOutputs` requests learner-facing page.



**Layer:** **E** — collateral cues outweigh desiredOutputs for some factors.



---



## Hypothesis verdict log (27-1 final)



| ID | Verdict | Date | Evidence |

|----|---------|------|----------|

| H1 | **Supported** (partial mechanism) | 2026-05-21 | Rich activity JSON in inflation/climate fixtures; page JSON drops MCQ answer fields; renderer does not recover (`elicitation-evidence-matrix.md` Cases B–C; render tests) |

| H2 | **Supported** (partial) | 2026-05-21 | Lean assessment pack exclude rule (pack ~301–322); workshop rich path for inflation (`app.js` ~10263–10267); RNA avoids lean path when `activities_required` |

| H3 | **Supported** | 2026-05-21 | Optional factors favour type/count (`workflowBriefConfig` ~520–593); no discussion-mode / feedback-timing; climate `activities_required` gap (R27-010) |

| H4 | **Supported** | 2026-05-21 | `feedback_display` + omitted answer fields + render assertions; `include_answers` false positive (R27-007); Design Page patch ~7986–8012 |

| H5 | **Supported** | 2026-05-21 | Prompt contract table in matrix; Design Feedback pruned (R27-008) |

| H6 | **Supported** | 2026-05-21 | Per-case matrix: RNA O/E pre-fix; inflation C; climate E vs fixture; Feedback step absent |



---



## Sprint 26 carry-forward (reference only)



| Sprint 26 | Outcome | R27 use |

|-----------|---------|---------|

| Track A | `activities_required`, topology fix | Control for assessment-only bias |

| Track B | Assessment section render fix | Mark **R** closed |

| Renderer hotfix | Typed materials + T/F + task cards | Mark **R** closed |



---



## 2026-05-21 — Slice 27-2 complete (elicitation audit)

**Method:** Read-only inventory of `workflowBriefConfig`, `extractWorkflowBriefExplicitFactors`, post-gen queue, Design Feedback prune rules, `feedback_display` pack vs renderer; validated against 27-1 matrix (R27-006–011). No code changes.

### R27-012 — Answer visibility is dual-channel (pedagogy vs learner export)

**Decision:** Distinguish (a) whether assessment items **include** answer-bearing fields for tutors/markers (`G` default: yes per GAI prompt) from (b) whether **learner export** shows them (`C`/`R` via `include_answers`, omitted fields, `feedback_display`).

**Evidence:** R27-009; matrix Cases B–C; `assessment-semantics-notes.md` § Answer visibility.

**Layers:** Primary **C, R**; secondary **E** (extract bugs), **G** (always generates keys).

### R27-013 — `feedback_required` is not `feedback_timing`

**Decision:** Existing `feedback_required` optional factor (pack ~542–558) models **commentary mode** (none / item / aggregate), not **when** answers are revealed.

**Evidence:** No `feedback_timing` in config or extract; climate Case C needs delayed reveal without a factor; `feedback_display: reflection_then_answers` exists only on Design Assessment step (~2763), not brief extract.

**Layers:** **E** gap; **O/C/R** cannot infer timing from current factors alone.

### R27-014 — Post-generation assessment queue does not close semantics gaps

**Decision:** `getAssessmentPostGenerationElicitationQueue` (~8957) and `intentClasses.assessment_pack` (~1737–1759) reinforce type, count, difficulty, `feedback_required` — **not** interaction mode, timing, or peer-instruction.

**Evidence:** `resolveAssessmentIntentClassMetadata` detection requires `assessment_required` + goal terms like “quiz” (~1724–1735); ordered factors list excludes proposed `feedback_timing` / `assessment_interaction_mode`.

**Layers:** **E** (late elicitation scope).

### R27-015 — Design Feedback inclusion rules are narrow (validated R27-008 extension)

**Decision:** Topology includes **Design Feedback** only when brief matches `feedback pack|design feedback|learner feedback|feedback guidance|formative feedback` (pack triggerRules ~298–299; `app.js` ~10169–10171). **Excluded** for: “formative assessment”, “formative check”, misconception discussion, hide-answers phrases.

**Implication:** `feedback_required` factor and Design Feedback step are **decoupled**.

**Layers:** **O** (prune ~11174), **E** (missing broader cues).

### R27-016 — `feedback_display: reflection_then_answers` is pack-only for learner render

**Decision:** Design Assessment defines `reflection_then_answers` (~2763–2765) but renderer mode switch recognizes only `none`, `answer_grid_end`, `answers_explanations` (`app.js` ~23965–23978). Unrecognized values do not implement reflection-first flow at **R**.

**Evidence:** Pack vs renderer grep; not exercised in 27-1 fixtures (climate uses `none` at page root).

**Layers:** **R** (contract gap), **E/C** (no brief→page propagation of this value in primary cases).

**Note:** Logged as **P7** for 27-4; renderer layer otherwise closed per R27-004 unless JSON contract changes.

### R27-017 — Candidate factor set approved for documentation (27-4 charter input)

**Decision:** Document eight candidate IDs in `assessment-semantics-notes.md` § Candidate factor catalogue — **no schema implementation** in Sprint 27 investigation.

**Priority factors for 27-3 probes:** `feedback_timing`, `assessment_interaction_mode`, `learner_answer_visibility`, `design_feedback_required`.

### R27-018 — Validated gap list P1–P14 accepted for 27-3 / 27-4

**Decision:** Replace draft P1–P7 with validated **P1–P14** in `assessment-semantics-notes.md`, each with E/O/G/C/R ownership and 27-1 evidence pointers.

---

## 2026-05-21 — Slice 27-3 complete (workflow probes)

**Method:** Read-only probe runner on three catalogue briefs; P27-04 G/C/R from existing climate page fixture + `buildUtilityStructuredHtmlForTest` only. **No live LLM generation.**

### R27-019 — Slice 27-3 deliverables signed off

| Deliverable | Status |
|-------------|--------|
| `probe-p27-02-resolved-factors.md` | **Done** (E/O) |
| `probe-p27-03-peer-instruction.md` | **Done** (E/O) |
| `probe-p27-04-assessment-items-excerpt.md` | **Done** (E/O + fixture proxy) |
| `27-3-probe-capture.json` | **Done** |
| Matrix + catalogue updated | **Done** |

### R27-020 — Candidate factors explain pedagogy loss across E/O/G/C/R

**Decision:** The R27-017 vocabulary **maps cleanly** to observed loss points:

| Factor | Where loss shows in 27-3 |
|--------|---------------------------|
| `feedback_timing` | **E** — null all probes |
| `assessment_interaction_mode` | **E** — null all probes |
| `learner_answer_visibility` | **E** false positive (`include_answers: true` on hide-answers briefs P27-02/04); **C/R** proxy fixes via `feedback_display: none` (P27-04 only) |
| `peer_instruction_phase` | **E/O** — CLS weak proxy only (P27-02/03) |
| `misconception_assessment_link` | **E** — null (P27-04) |
| `design_feedback_required` | **O** — step absent all probes (R27-008 confirmed) |
| `tutor_answer_artefact` | **E** — collateral `page_profile: facilitator` (P27-02) |
| `confidence_rating_required` | N/A in priority probes |

**Answer to programme question:** **Yes** — factors explain **where** intent is lost; they do **not** yet **preserve** intent (implementation is 27-4).

### R27-021 — P27-02: hide-answers and facilitator intent inverted at E

**Evidence:** `include_answers: true`, `page_profile: facilitator`, no `assessment_required` in extract despite “5-item formative check”. Design Feedback absent.

**Layers:** **E** primary; **O** partial chain; G/C/R **PENDING**.

### R27-022 — P27-03: retrieval signals dominate peer-instruction brief

**Evidence:** `assessment_total_items: 6`, `assessment_type: mcq`, `page_profile: assessment`; no `feedback_timing` or `peer_instruction_phase`. Design Feedback absent.

**Layers:** **E** partial; G/C/R **PENDING** (expect activity-rich / MCQ-retrieval assessment per H5).

### R27-023 — P27-04: fixture proxy confirms C/R mitigation without E fidelity

**Evidence:** E/O capture shows `include_answers: true`; fixture has `feedback_display: none`, T/F answers in JSON, HTML hides answers (`exportHtmlAnswersVisible: false`). `feedback_pack` absent.

**Layers:** **E** drop; **G/C** partial (proxy); **R** preserve visibility policy. **Not** a live probe run.

### R27-024 — Live G/C/R capture remains backlog

**Decision:** Do not infer `assessment_items` or composed page behaviour for P27-02/03 without Factory runs. Optional 27-4 fixtures or manual Factory per catalogue checklist.

### R27-025 — Slice 27-4 charter drafted (implementation gated)

**Decision:** Adopt [`slice-27-4-charter.md`](slice-27-4-charter.md) as the bounded implementation programme.

**Smallest E2E set (charter):** Additive factors at **E**; topology triggers at **O**; prompt hints at **G**; `learner_answer_visibility` → page metadata at **C**; renderer mode map at **R**. **Split:** generation-time answer keys vs render-time visibility.

**Tracks:** 27-4a (E) → 27-4b (O) → 27-4d/4e (C/R) → 27-4c (G prompts) → 27-4f (tests). Optional 27-4g (Design Assessment for diagnostic).

**Status:** Charter only in this slice — **no code** until explicit approval.

---

## 2026-05-21 — Slice 27-4 implementation complete (tracks 27-4a–4f)

**Test floor:** `node --test tests/*.test.js` → **284 passed**, 0 failed.

### R27-035 — Track 27-4a (elicitation & extract) signed off

**Decision:** Ship additive semantic factors (`feedback_timing`, `assessment_interaction_mode`, `learner_answer_visibility`, `peer_instruction_phase`, `misconception_assessment_link`, `design_feedback_required`) with negation-safe hide-answer extract and `deriveAssessmentSemanticFactors` post-resolve.

**Verification:** `tests/workflow-ld-assessment-semantics-extract.test.js` (P27-02/03/04 probes, negation strings, assessment_pack queue).

### R27-036 — Track 27-4b (topology) signed off

**Decision:** Inject/protect **Design Feedback** when delayed/hidden semantics request it; reorder **DLA → GAM → GAI** for discussion-oriented workflows; prune **Design Assessment** except blueprint/diagnostic paths.

**Verification:** `tests/workflow-ld-assessment-semantics-topology.test.js` (+ RNA sparse / lean regressions).

### R27-037 — Track 27-4c (generation contracts) signed off

**Decision:** Prompt-only updates in `domain-learning-design-step-patterns.md` §8 Design Feedback and §9 Generate Assessment Items — preserve answer keys in JSON; mode-specific semantics block for tutor-led, peer, diagnostic, hidden visibility.

**Verification:** Pack prompt assertions in `tests/workflow-ld-assessment-semantics-e2e.test.js` (G contract tests); no live LLM runs.

### R27-038 — Tracks 27-4d & 27-4e (composition + renderer) signed off

**Decision:** `resolveAssessmentPresentationFromBriefFactors` maps visibility/timing → `include_answers` / `feedback_display`; `applyAssessmentSemanticsToComposedPage` stamps page metadata; renderer supports `reflection_then_answers` (prompts first, **Self-check answers** grid at end; no inline **Correct answer**).

**Verification:** `tests/utility-ld-assessment-visibility-render.test.js`.

### R27-039 — Track 27-4f (regression consolidation) signed off

**Decision:** Consolidated end-to-end semantic regressions prove **E → O → G(contract) → C → R** for P27-02 (tutor-led delayed), P27-03 (peer / `after_peer_discussion` → `reflection_then_answers`), P27-04 (diagnostic misconception, answers in JSON, hidden render). No scope into confidence/CARS or dual artefact generation.

**Verification:** `tests/workflow-ld-assessment-semantics-e2e.test.js`.

### R27-040 — Deferred (unchanged)

**Decision:** Confidence-based assessment (CARS) and optional **27-4g** Design Assessment for diagnostic remain **out of scope** for Sprint 27 MVP.

---

## Status

**Slice 27-1:** **Complete** (read-only).  
**Slice 27-2:** **Complete** (read-only).  
**Slice 27-3:** **Complete** (read-only; live G/C/R optional backlog).  
**Slice 27-4:** **Complete** — tracks **27-4a–4f** implemented.  
**Next:** Sprint closeout / handover refresh; optional live Factory captures for G layer smoke.

**Test floor:** **284 passed**, 0 failed.

