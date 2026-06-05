# Slice 38L-4 — Closure integration and Evaluate alignment

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Pack §5/§6 closure integration + proof harness alignment (R5, R7)  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38L-4  
**Predecessors:** [38L-2](38L-2-dla-depth-floor-implementation.md) · [38L-3](38L-3-gam-depth-shaped-body-implementation.md)  
**Design authority:** [38K-3](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md) · [38K-4](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-4-target-state-depth-examples.md) · [38I-4 A4 benchmark](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)

---

## §1 Executive summary

38L-4 completes the **38-L implementation sprint** before the proof run. Two obligation classes were still open after 38L-2/38L-3:

| Requirement | Outcome |
|-------------|---------|
| **R5** Evaluate completion integration | Pack now forbids Evaluate termination after guided comparison alone; independent judgement + verification + transfer are mandatory when Evaluate obligations are active |
| **R7** Evaluate LO / harness alignment | New `EV-38L-AFTER` harness injects frozen fourth LO (household strategy **Evaluate**) and revises brief/prompts so the proof run measures **38I-4 A4 depth**, not policy-communication summary quality |

**Scope respected:** pack §5/§6 + harness only — no schema, ACM, renderer, or workflow stages.

**Tests:** `tests/workbook-contract-prompt-surface.test.js` — **42/42 pass** (+6 new 38L-4 assertions; IFP-00 sequence assertion updated A–J → A–K).

**Next:** **38L-5** — run `ev-38l-inflation-pipeline-capture-once.mjs` to produce `EV-38L-AFTER-*` and compare against `EV-38G-AFTER`, `EV-38J-AFTER`, and 38I-4 benchmarks.

---

## §2 Evaluate completion review

### 38J baseline gap (G-20)

`EV-38J-AFTER` fourth LO was *Summarize policy communication* (`cognitive_level: Summarize`). DLA/GAM still produced Evaluate **form** (criteria, perspectives, guided table) but on **policy communication substance** — a weaker capstone than [38I-4 A4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md).

### What 38L-2/38L-3 already covered

| Layer | Evaluate completion elements |
|-------|------------------------------|
| **38L-2 §5** | DLA-WB-28 rows for independent judgement, verification checklist, transfer_prompt; EV-CAP-01..03; IFP-10 emission gates G2/G3 |
| **38L-3 §6** | GAM-WB-28 realises E1+E2+T1 separately; GAM-PRES-06/08 depths; DEPTH-COLLAPSE-04/05 |

### 38L-4 gap closed (R5)

Guided judgement alone could still **read** as a plausible capstone terminus in planning/realisation narrative. 38L-4 adds explicit **termination gates**:

| ID | Surface | Rule |
|----|---------|------|
| **EV-CAP-04** | §5 IFP-02, DLA-WB-28 | Guided comparison alone cannot terminate Evaluate; consolidation_summary does not substitute independent judgement, verification, or transfer |
| **AS-FAIL-06** | §5 IFP-05 | Replan when guided table present but trio incomplete |
| **DLA-WB-31** | §5 | Full completion pack when `primary_archetype=Evaluate`: perspectives → criteria → worked → guided → independent → verification → transfer |
| **GAM-PRES-10** | §6 | Realisation termination — trio must be separate full Materials |
| **EV-GAM-FAIL-07** | §6 GAM-PRES-10, GAM-WB-31 | Guided-only Evaluate = contract FAIL |
| **GAM-WB-31** | §6 | Mirror DLA-WB-31 at realisation |

### Expected A4 artefact chain (post-proof)

When obligations fire end-to-end, A4 should contain:

1. Perspectives (Maya / household scenario)  
2. Criteria (operational rubric)  
3. Worked judgement (weak vs strong)  
4. Guided judgement (partial table)  
5. Independent judgement (memo scaffold)  
6. Verification (checklist rubric)  
7. Transfer (own-context prompts)  

…surviving **DLA → GAM → Page** without collapse into consolidation_summary.

---

## §3 Closure integration review

### DLA → GAM consistency

| DLA obligation (38L-2/38L-4) | GAM realisation (38L-3/38L-4) |
|------------------------------|-------------------------------|
| IFP-10 G1 checklist every activity | GAM-WB-26 / GAM-PRES-08 V1 |
| IFP-10 G3 independent judgement | GAM-PRES-08 E1; GAM-PRES-10 |
| IFP-10 G2 transfer_prompt | GAM-PRES-08 T1; EV-GAM-FAIL-06 |
| DLA-WB-27 worked analytic pass | GAM-WB-27 / GAM-PRES-08 A1 |
| EV-CAP-04 / DLA-WB-31 trio | GAM-PRES-10 / GAM-WB-31 / EV-GAM-FAIL-07 |
| DEPTH-COLLAPSE absorption | GAM-PRES-09 F9 (unchanged) |

### IFP-00 sequence extension

Step **(J) INF-EVAL-01** added before emit; sequence now **A–K** (was A–J). IFP-08 emit gate updated accordingly.

### Substance contract (R7 in §5)

| ID | Rule |
|----|------|
| **INF-EVAL-01** | Inflation workbook + KM-T05 household anchor → fourth LO and Evaluate capstone = household strategy judgement (38I-4 A4) |
| **KM-T05** | Primary Evaluate anchor when household/budget concepts present |
| **KM-T08** | Policy communication = macro context lens only — cannot override KM-T05 Evaluate driver |

---

## §4 Harness / benchmark alignment review

### Root cause (38J harness)

| Factor | 38J behaviour | Benchmark mismatch |
|--------|---------------|-------------------|
| **LO step** | Fully generative | Produced Summarize policy LO4 |
| **Brief** | Policy communication co-equal with household themes | Steered Evaluate substance toward policy |
| **Ctx strings** | 38J IFP/GAM only | No 38L depth/emission/termination rules |
| **Comparator** | vs 38I-4 A4 household episode | Form overlap; substance diverged |

### 38L harness design

**Files:**

- `artefacts/ev-38l-inflation-pipeline-capture-once.mjs` — `RUN_PREFIX=EV-38L-AFTER`, `HARNESS_VERSION=38L-4`
- `artefacts/ev-38l-frozen-learning-outcomes.json` — fourth LO: *Evaluate strategies households can use…* (`cognitive_level: Evaluate`)

**Key harness decisions:**

| Change | Purpose |
|--------|---------|
| **Frozen LO injection** | Eliminates generative LO4 drift to Summarize/policy |
| **Revised BRIEF.goal** | Household strategy evaluation capstone; policy demoted to context |
| **ctxHeader + step prompts** | Cite IFP-09/10, INF-EVAL-01, EV-CAP-04, DLA-WB-26..31, GAM-PRES-08/09/10, GAM-WB-26..31 |
| **Skip generative LO API call** | `pipelinePath` records `frozen_learning_outcomes` |
| **Explicit A4 instructions** | Maya scenario, strategy menu A–E, NOT policy communication summary |

### Proof-run evaluation criteria (38L-5)

Compare `EV-38L-AFTER` A4 against:

| Comparator | What to assess |
|------------|----------------|
| **38I-4 A4** | Household perspectives, criteria rubric, worked/guided/independent judgement, verification, transfer |
| **EV-38G-AFTER** | Historical household Evaluate LO alignment |
| **EV-38J-AFTER** | Regression guard — should **not** replicate policy-summary capstone |

Success = Evaluate **depth** assessed against 38I-4 benchmark, not summary or policy-communication quality alone.

---

## §5 Changes made

### Pack (`domains/learning-design/domain-learning-design-step-patterns.md`)

| Section | Additions / updates |
|---------|---------------------|
| **§5 promptTemplate** | INF-EVAL-01; KM-T05/T08 strengthen; EV-CAP-04; AS-FAIL-06; IFP-00 (J)(K); DLA-WB-31; IFP-08 A–K |
| **§5 defaultPromptNotes** | 38L-4 closure + benchmark references |
| **§6 promptTemplate** | GAM-PRES-10; GAM-WB-31; EV-GAM-FAIL-07 |
| **§6 defaultPromptNotes** | GAM-PRES-10 / EV-GAM-FAIL-07 |

### Harness artefacts

| File | Action |
|------|--------|
| `artefacts/ev-38l-inflation-pipeline-capture-once.mjs` | **Created** |
| `artefacts/ev-38l-frozen-learning-outcomes.json` | **Created** |

### Sprint tracking

| File | Update |
|------|--------|
| `README.md`, `HANDOVER.md`, `CONTEXT-FOR-NEXT-CHAT.md`, `observations/README.md` | 38L-4 complete → **38L-5 NEXT** |

---

## §6 Tests added or updated

**File:** `tests/workbook-contract-prompt-surface.test.js`

| Test | Coverage |
|------|----------|
| `pack §5 38L-4: INF-EVAL-01 … EV-CAP-04` | Substance + termination |
| `pack §5 38L-4: KM-T05/T08 and DLA-WB-31` | Completion pack |
| `pack §5 38L-4: defaultPromptNotes` | DLA notes |
| `pack §6 38L-4: GAM-PRES-10 and GAM-WB-31` | Realisation termination |
| `pack §6 38L-4: defaultPromptNotes` | GAM notes |
| `38L-4 harness: frozen LO contract…` | Harness + fixture alignment |
| `pack §5 38L-2: IFP-09…` (updated) | IFP-00 A–K |

**Final pass count:** **42/42**

---

## §7 Risks and deviations

| Risk | Mitigation / note |
|------|-------------------|
| **Frozen LO bypasses LO-step generative behaviour** | Intentional for R7; isolates Evaluate substance from LO drift. Generative LO remains default in production workflow. |
| **LLM may still drift on A4 substance** | Harness prompts + pack INF-EVAL-01/KM-T05; proof run will validate. |
| **Policy communication still in KM/LC** | Allowed as perspective lens (KM-T08); must not become capstone driver. |
| **EV-GAM-FAIL-07 not runtime-enforced in app.js** | Pack-contract discipline (same pattern as F1–F9); proof run manual/artefact review. |
| **Deliverable filename** | User spec `38L-4-closure-integration-and-evaluate-alignment.md` (charter had alternate name). |

**Deviations from charter:** None on scope holds (no schema/ACM/renderer/workflow). R7 implemented via harness + §5 inference — as planned in [38L-1 §2](38L-1-implementation-planning-review.md).

---

## §8 Proof-run readiness assessment

| Criterion | Status |
|-----------|--------|
| R1–R6 implemented (38L-2/38L-3) | ✅ |
| R5 Evaluate completion termination (38L-4) | ✅ |
| R7 harness + substance contract (38L-4) | ✅ |
| Pack tests green | ✅ **42/42** |
| Harness script + frozen LO ready | ✅ |
| Comparator baselines frozen | ✅ `EV-38G-AFTER`, `EV-38J-AFTER` untouched |

**Verdict:** **38L implementation is complete.** Pipeline is ready for **`EV-38L-AFTER`** proof generation (38L-5).

**Run command:**

```bash
node docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/ev-38l-inflation-pipeline-capture-once.mjs
```

**Post-run checks:**

1. `EV-38L-AFTER-learning-objectives.json` — LO4 `cognitive_level: Evaluate`, household strategy statement  
2. A4 `required_materials` — template/checklist/transfer_prompt rows present  
3. `EV-38L-AFTER-gam.txt` A4 — perspectives, criteria, worked/guided/independent, verification, transfer Materials with bodies  
4. Compare A4 substance to [38I-4 A4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) — not to `EV-38J-AFTER` policy capstone  

---

**Parent:** [38L observations index](README.md) · **Sprint:** 38-L · **Next:** **38L-5** Inflation proof run
