# Slice 38J-3 — DLA implementation

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Pack §5 implementation — controlled, design-faithful  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38J-3  
**Design authority:** [38J-2 function-plan prompt design](38J-2-function-plan-prompt-design.md)  
**Inputs:** [38J-1 baseline](38J-1-baseline-inspection.md) · [38I-2 archetypes](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) · [38I-3 KM/LO mapping](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md) · [38H-2 anti-spoiler](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-2-gam-consolidation-discipline.md)

---

## Section 1 — Implementation summary

Pack §5 **Design Learning Activities** now executes **mandatory internal instructional function planning (IFP)** per activity before JSON emission. The implementation follows [38J-2 §11](38J-2-function-plan-prompt-design.md) without redesigning the pedagogical model.

**What changed**

| Area | Implementation |
|------|----------------|
| **Planning sequence** | IFP-00 Steps A–I inserted — LO + KM → archetype → function sequence → KM triggers → inference → population → anti-shell/anti-spoiler gates → session arc → DLA emission |
| **Archetype selection** | IFP-01 — LO-ARC-03, AP-OVERRIDE-01, AN-ASSESS-01/02; 38I-3 authority; no new schema fields |
| **Archetype templates** | IFP-02 — full Understand / Apply / Analyse / Evaluate function orders with R/C/O tags |
| **KM triggers** | IFP-03 — KM-T01..T08 hard upgrades |
| **Inference contracts** | IFP-04 — INF-01..06 + Evaluate criteria/perspectives/trade-offs/judgement constraints |
| **Anti-shell gate** | IFP-05 — AS-01..06 + AS-FAIL-01..05 |
| **Anti-spoiler planning** | IFP-06 — SP-01..04; extends 38H-2 to DLA material specifications |
| **Session arc** | IFP-07 — ARC-01..06 + ARC-LO-01..03 |
| **Population discipline** | IFP-08 — required_materials and learner_task derived from function plan only |
| **Workbook rows** | DLA-WB-22..25 added for Evaluate bar, Apply worked_example, AS-FAIL replan, session fade |
| **Removed** | Compressed one-line LO bundle (`Understand => orientation + …`) — superseded by IFP-02/08 |
| **Tests** | Five new assertions in `tests/workbook-contract-prompt-surface.test.js` (38J-3 block) |

**What did not change**

- JSON output schema (no new DLA fields, no persistent IFP artefact)
- §6 GAM (`promptTemplate`, `defaultPromptNotes`)
- Renderer, ACM, `app.js`
- DLA-WB-01..21 regression guards (38E/38F/38G preserved)

**Implementation decision (one deviation)**

| 38J-2 reference | 38J-3 implementation | Rationale |
|-----------------|----------------------|-----------|
| IFP-06 cites `GAM-WB-06b` by name | IFP-06 cites **38H-2 scaffold-not-answer discipline** with “GAM realises in §6” | §5 prompt-surface tests require DLA template to contain no `GAM-WB` tokens (38E isolation). Semantic obligation unchanged; cross-pack ID deferred to 38J-4 per 38J-2 §11.4 |

---

## Section 2 — Pack locations modified

**File:** `domains/learning-design/domain-learning-design-step-patterns.md`

| Location | Field | Change |
|----------|-------|--------|
| §5 · `### Prompt Factory` · line ~2609 | `promptTemplate` | IFP-00..08 block inserted; DLA-WB-22..25 appended; old bundle line removed |
| §5 · line ~2612 | `defaultPromptNotes` | 38J-3 IFP reinforcement appended; bundle reference replaced with IFP archetype templates |

**Insertion map (IFP-00..08)**

| Block | Before | After | Rationale |
|-------|--------|-------|-----------|
| **IFP-00..08** | `- Apply step notes when provided: {{stepNotes}}` | `Self-study workbook contract (DLA-WB` | Planning is instruction before workbook rows and JSON output — per 38J-2 §11.1 |
| **DLA-WB-22..25** | `DLA-WB-21` row | `Constraints:` section | Archetype-specific workbook obligations after existing ACM trace rows |
| **Removed bundle** | KM affordance bullets | `- Do not force literal headings` | IFP-02 templates supersede compressed one-liner — per IFP-08 |

**Supporting artefacts (not production surface)**

| File | Role |
|------|------|
| `artefacts/ifp-dla-pack-block.txt` | Canonical IFP prompt text source |
| `artefacts/patch-dla-ifp.js` | Initial pack patch script |
| `artefacts/fix-dla-ifp.js` | Bundle removal + GAM-WB isolation fix |

---

## Section 3 — IFP block implementation

### IFP-00 — Mandatory planning sequence

Internal Steps A–I: collect inputs → archetype → template → KM triggers → inference → population plan → anti-shell + anti-spoiler gates (replan on AS-FAIL) → session arc → JSON emission only after gates pass.

### IFP-01 — Archetype selection

- `primary_archetype` = max cognitive demand: Evaluate > Analyse > Apply > Understand  
- LO-ARC-03 for multi-LO activities  
- AP-OVERRIDE-01 (Analyse verb + procedure execution + process ≥3 → Apply)  
- AN-ASSESS-01/02 (Assess → Analyse vs Evaluate disambiguation)

### IFP-02 — Archetype templates

Four ordered function sequences with R/C/O tags:

- **Understand** — Orientation through Transition (13 functions)  
- **Apply** — fade criteria+model → guided → independent; `scaffold_hint_sequence` mirrors fade  
- **Analyse** — analytical framing through partial matrix practice  
- **Evaluate** — 38I-4 A4 bar: perspectives, ≥3 criteria dimensions, worked judgement weak/strong, independent memo; EV-CAP-01/02

### IFP-03 — KM triggers KM-T01..T08

Hard upgrades after template load — e.g. misconception → Misconception challenge R; process ≥3 → Worked thinking R; affects/household → Transfer R + Perspective content.

### IFP-04 — Inference contracts INF-01..06

Controlled inference from LO + brief + KM only. Evaluate-specific: 3–5 criteria, ≥2 perspectives, ≥2 trade-off prompts, weak vs strong exemplar (strong must not match `expected_output`).

### IFP-05 — Anti-shell AS-01..06 + AS-FAIL

Shell = preamble + single imperative task + thin materials without R-function sequence. Explicit fail conditions AS-FAIL-01..05; replan before JSON (DLA-WB-24).

### IFP-06 — Anti-spoiler SP-01..04

Extends 38H-2 to DLA specs: allow worked reasoning and modelling; forbid consolidation/sample_output fulfilling learner deliverables; scaffold-only specifications when learner-production required.

### IFP-07 — Session arc ARC-01..06

Prompt-only fade guidance by `activity_index`: heavier teaching early, integration late, Evaluate criteria visible in finale; ARC-LO-01..03 for LO distribution.

### IFP-08 — Population discipline

`required_materials` and segmented `learner_task` derived from function plan — DLA-WB rows necessary but insufficient without function mapping.

### DLA-WB-22..25

| Row | Behaviour |
|-----|-----------|
| **DLA-WB-22** | Evaluate archetype material requirements (criteria, scenario, modelling/exemplar contrast, guided judgement table, transfer) |
| **DLA-WB-23** | Apply + KM-T03 → `worked_example` mandatory |
| **DLA-WB-24** | AS-FAIL → replan before emit |
| **DLA-WB-25** | Session fade documented in `delivery_notes` |

---

## Section 4 — Verification checklist

| Requirement | Present in §5 | Test |
|-------------|---------------|------|
| Archetype selection (Understand / Apply / Analyse / Evaluate) | IFP-01 + IFP-02 | `38J-3: archetype selection` |
| Function planning sequence | IFP-00 | `38J-3: IFP mandatory block` |
| KM triggers KM-T01..T08 | IFP-03 | `38J-3: KM triggers` |
| Inference contracts INF-01..06 | IFP-04 | `38J-3: KM triggers` (Evaluate inference) |
| Anti-shell AS-01..06 + AS-FAIL | IFP-05 + DLA-WB-24 | `38J-3: KM triggers` + `DLA-WB-22..25` |
| Anti-spoiler SP-01..04 | IFP-06 | `38J-3: KM triggers` |
| Session arc ARC-01..06 | IFP-07 + DLA-WB-25 | `38J-3: KM triggers` + `DLA-WB-22..25` |
| Old bundle line removed | — | `doesNotMatch Apply LO cognitive-demand` |
| §5 no GAM-WB tokens | IFP-06 rephrased | `pack §5: DLA-WB block` (38E isolation) |
| DLA-WB-01..21 preserved | Unchanged | All prior 38E/38F/38G tests pass |
| defaultPromptNotes reinforcement | 38J-3 suffix | `38J-3: defaultPromptNotes` |

**Test run:** `node --test tests/workbook-contract-prompt-surface.test.js` — **18/18 pass**

---

## Section 5 — Readiness for 38J-4

§5 DLA now contains operational instructional-function planning behaviour capable of episode-aware specification. **38J-4** can proceed on pack §6 GAM with these prerequisites met:

| Ready | Item |
|-------|------|
| ✅ | DLA specs function-ordered population intent (IFP-08) |
| ✅ | Anti-spoiler obligations stated at DLA spec level (IFP-06) — GAM can cross-reference 38H-2 / GAM-WB-06b |
| ✅ | Evaluate A4 bar encoded in DLA-WB-22 + IFP-02/04 |
| ✅ | KM trigger obligations flow to `required_materials` purpose/specification language |
| ⏳ | GAM function-ordered material emission — **38J-4** |
| ⏳ | Evaluate body depth targets vs A4 section lengths — **38J-4** |
| ⏳ | `EV-38J-AFTER` inflation proof — **38J-5** |

**Recommended 38J-4 entry:** Read IFP-06 final clause (“GAM realises in §6”) and 38J-2 §11.4 deferred items; align GAM-WB emission order with DLA function population without redesigning activities.

---

## References

- [38J-2 function-plan prompt design](38J-2-function-plan-prompt-design.md)
- [38J-1 baseline inspection](38J-1-baseline-inspection.md)
- Pack §5: `domains/learning-design/domain-learning-design-step-patterns.md`
- Tests: `tests/workbook-contract-prompt-surface.test.js`
