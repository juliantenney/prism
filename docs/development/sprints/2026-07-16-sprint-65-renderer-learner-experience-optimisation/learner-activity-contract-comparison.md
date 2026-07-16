# Sprint 65 Learner Activity Contract Comparison

## Task

**S65-BL-003 — Learner Activity Contract Comparison**

Determine the smallest coherent learner-facing activity contract composable from inventory-safe signals (S1–S5), without production renderer changes.

## Scope and Constraints

**In scope:** Contract comparison; static mockups; scoring; precedence/omission rules; recommendation for BL-004 design only.

**Out of scope:** Production `app.js` / `lib` / CSS / tests; schema; GAM; Sprint 64 prototypes; S65-BL-004 manifestation rules as final implementation.

```text
Implementation status: Not started
```

Uses only S1–S3 for structure; S5 as content; never S4/S6 in learner contract.

## Evidence Base

| Evidence | Path |
| -------- | ---- |
| Baseline audit | [`baseline-learner-experience-audit.md`](baseline-learner-experience-audit.md) |
| Signal inventory | [`renderer-signal-inventory.md`](renderer-signal-inventory.md) · [`signal-inventory-table.md`](signal-inventory-table.md) |
| Evaluation framework | [`evaluation-framework.md`](evaluation-framework.md) |
| Mockups | [`experiments/learner-activity-contract-comparison/`](experiments/learner-activity-contract-comparison/) |
| Frequency set | 8 pages / 26 activities (BL-002) |

## Representative Activities

| Activity | Source | Archetype | Shape | Why selected |
| -------- | ------ | --------- | ----- | ------------ |
| RNA A1 | `rna-hcv-assembled-vnext-materials-page.json` | understand | Sparse cognition; rich materials; checklist + expected_output; beat plan | Core understand + Success/checklist overlap |
| RNA A3 | same | apply | Scenario + planning_table residual; checklist | Residual-material handling (F11) |
| RNA A4 | same | analyse | Modelling note + scenario; unmatched text orphan | Orphan material (F12) |
| RNA A6 | same | evaluate | Transfer prompt + decision workspace | Transfer placement |
| Marx A3 | `self-directed-activity-framing-page.json` | none | Rich preamble/bridge/reasoning/self-explanation; no expected_output | Rich framing / sparse logistics |
| KS-A4 | `renderer-kitchen-sink-page.json` | none | Task only | Ultra-sparse resilience |

## Current Contract

Production grammar (BL-001): title + badges → Success looks like (often first) → What to do / Your goal → optional framing/cognition stack → beat sections (Understand / See it modelled / Your turn / Check / Apply elsewhere) → type-labelled materials → residual unmatched materials after verification. Archetype not shown. Shared shell across modes.

## Design Principles

1. **Task first among action signals** — learner_task is the primary S1 action (S65-SIG-T01).
2. **Produce ≠ Check** — expected_output describes product; checklist verifies quality (S65-SIG-T02 vs V01).
3. **Omit empty slots** — no empty headings; no filler (S65-D05 / F14).
4. **Preserve source meaning** — re-place, don’t rewrite (S5).
5. **Residuals stay visible** — never drop unmatched/unknown materials.
6. **Archetype is cue-only** — S3; no invented plan depth (S65-F10 / S6 ceilings).
7. **Diagnostics stay outside** — S4 excluded from contract (S65-D16).

## Composition A — Current Fragmented Model

**Hypothesis:** Faithful control of current production composition.

**Structure:** title/logistics → Success → task → (many framing cues when rich) → beat stack with type labels → checklist (often duplicating Success) → residuals after Check.

**Benefit:** Known behaviour; maximal field visibility when present.  
**Risk:** Density, dilution of primary task, mode confusion (“Understand” on apply), residual ordering.  
**Optionality:** Already omits empty cognition (good); still shows type labels and Success↔checklist duplication.  
**Complexity:** Status quo.

Mockup: [`composition-a-current.html`](experiments/learner-activity-contract-comparison/composition-a-current.html)

## Composition B — Consolidated Activity Brief

**Hypothesis:** One brief reduces overhead and duplication without mode variation.

**Structure:**

| Slot | Content | Signals | If missing |
| ---- | ------- | ------- | ---------- |
| Header | Title + duration/grouping | A02, A04, A05 | omit badges |
| Why this activity | preamble; bridge as secondary line | C01, C03 | omit section |
| Your task | learner_task (emphasis) | T01 | required for activity |
| Produce | expected_output only (product) | T02 | omit (don’t invent from checklist) |
| How to approach it | reasoning_orientation; extra PEL cues in `<details>` | C04 + optional | omit / progressive |
| Support | materials by role / valid beats; residuals in Try it | M*, S02–S04 | show residuals |
| Check and improve | checklist criteria only | V01 | omit |
| Reflect / Extend | self-explanation / transfer | C05, C08, transfer mat | omit |

**Benefit:** Action clarity; lower duplication; sparse-safe.  
**Risk:** Same shell across archetypes — mode still weak.  
**Complexity:** Moderate (placement + dedupe rules).

Mockup: [`composition-b-consolidated.html`](experiments/learner-activity-contract-comparison/composition-b-consolidated.html)

## Composition C — Archetype-Sensitive Activity Brief

**Hypothesis:** B’s core + bounded archetype cues make mode legible without separate architectures.

**Allowed cues (S3):** mode label; brief learner verb; support-order emphasis; which support block leads; reflection/transfer placement; non-colour-only structure (label + order).

**Not allowed:** inventing stages/criteria/links; rewriting bodies; suppressing materials for fit; requiring rich cognition; separate component trees.

| Archetype | Emphasis (presentation only) |
| --------- | ---------------------------- |
| understand | Lead with model/example; Reflect after Check if present |
| apply | Task primary; Try it workspace emphasised; Transfer last |
| analyse | Scenario/evidence before workspace; Check = justification |
| evaluate | Task = decision; Check = criteria; Extend after Check |
| absent / unsupported | Identical to B |

Mockup: [`composition-c-archetype-sensitive.html`](experiments/learner-activity-contract-comparison/composition-c-archetype-sensitive.html)

## Optional Composition D

**Not included.** Task-first ultra-compact and beat-led variants are subsumed by B (task-first) and C’s support emphasis. A fourth option would not test a materially different hypothesis.

## Signal Placement Comparison

| Signal | A | B | C | Recommended |
| ------ | - | - | - | ----------- |
| Title / duration / grouping | Header | Header | Header + optional mode | **C** when archetype present else **B** |
| Archetype | unused | unused | mode label + verb | **C** bounded |
| Preamble | Framing stack | Why | Why | **B/C** Why |
| Coherence bridge | Separate cue | Why secondary | Why secondary | Merge under Why; don’t duplicate nav |
| Reasoning orientation | Mid framing | How to approach | How to approach | **B/C** |
| Extra PEL cues | All open | `<details>` | `<details>` | Progressive disclosure |
| Learner task | After Success | Primary | Primary (apply leads) | **B/C** before Produce |
| Expected output | In Success (± checklist) | Produce only | Produce only | **B/C** |
| Checklist | After beats + in Success | Check only | Check only | **B/C** |
| Self-explanation | Often adjacent to task | Reflect | Reflect (understand after Check) | **B/C** |
| Transfer | Beat / material | Extend | Extend (evaluate after Check) | **B/C** |
| Materials | Type labels + beats | Role groups + residual in Try it | Same + emphasis | **C** emphasis / **B** groups |
| Diagnostics | Meta footer | Excluded | Excluded | Excluded |

## Material Integration Comparison

| Approach | A | B | C |
| -------- | - | - | - |
| Flat / beat + residual | Current | — | — |
| Role-grouped | — | Understand / See example / Try it / Check / Extend | Same labels |
| Beat-led | When plan matches | Prefer when valid; else roles | Prefer when valid; emphasis by mode |
| Residual (`planning_table`, orphans) | After Check | Inside Try it / Also available | Same; never suppress |
| Unknown type | Fallback visible | Fallback visible | Fallback visible |

**Recommendation:** Role-grouped Support with beat order when mapping valid; **always** render residuals and unknown types in Support (Try it / Also available)—never after Check solely due to registry gaps.

## Duplication and Precedence Rules

| Overlap | Rule |
| ------- | ---- |
| Preamble vs bridge | Preamble primary in Why; bridge as one secondary sentence if distinct; omit if equivalent; never invent merge text |
| Learner task vs transformation | Task owns action; transformation only if non-redundant and placed under How/Support — rare (0/26 in inventory) |
| Expected output vs checklist | **Produce** = product description (T02); **Check** = criteria (V01); do not promote checklist into Produce; strip “verified with checklist” restatements from Produce |
| Reasoning vs self-explanation | Reasoning → How to approach (before/during); self-explanation → Reflect (after or mid); don’t stack as equal open blocks |
| Transfer vs source-to-application | Prefer material transfer_prompt / C08 when present; treat as alternatives not duplicates; omit if neither |
| Overview vs journey intro | Page-level (BL-005); activity contract must not re-print page overview |

## Optionality and Fallback Rules

| Missing signal | A | B | C | Preferred |
| -------------- | - | - | - | --------- |
| No preamble / bridge | omit | omit Why | omit Why | omit |
| No expected_output | Success may still list checklist | omit Produce | omit Produce | omit Produce |
| No reasoning | omit | omit How | omit How | omit |
| No checklist | Success may use output only | omit Check | omit Check | omit |
| No transfer / self-explanation | omit | omit Reflect/Extend | omit | omit |
| No beat plan | key order / residual | role groups | role groups | role groups |
| Unmatched / residual material | after Check | in Support | in Support | **in Support** |
| Unknown type | titled fallback | titled fallback | titled fallback | keep visible |
| No archetype | no mode | same | same as B | same as B |
| Unsupported archetype value | — | — | treat as absent | treat as absent |

No empty headings. No generic filler. No inferred content.

## Accessibility, Mobile and Print

| Concern | A | B | C |
| ------- | - | - | - |
| Heading hierarchy | Many peer h4s | Clear h3 slots | Same + mode text (not colour-only) |
| Density on mobile | High | Lower | Lower; mode label + verb add little height |
| Print | Long stacks | Shorter brief; details collapsed by default | Same |
| Progressive disclosure | Rare | Extra PEL in details | Same |

Colour is never the sole mode cue in C (label + verb + order).

## Evaluation Scores

Scale 1–5. Evidence from mockups + BL-001 baseline behaviour. Confidence: High for RNA/Marx patterns; Medium for generalisation pending BL-008.

| Dimension | A | B | C | Evidence summary |
| --------- | - | - | - | ---------------- |
| Orientation | 3 | 4 | 4 | B/C Why slot when present; A fragments Marx cues |
| Action clarity | 3 | 5 | 5 | Task primary in B/C; A Success-first |
| Output clarity | 3 | 5 | 5 | Produce vs Check split |
| Cognitive mode | 2 | 2 | 4 | C mode label/verb/emphasis; A/B shell same |
| Progression | 3 | 4 | 4 | Bridge under Why; residuals no longer “after Check” |
| Material role | 2 | 4 | 4 | Role labels vs Text/Template |
| Verification | 3 | 4 | 4 | Checklist once |
| Transfer | 2 | 3 | 4 | C places Extend for evaluate |
| Density | 2 | 4 | 4 | Marx stack compressed |
| Duplication | 2 | 5 | 5 | Success↔checklist fixed |
| Accessibility | 3 | 4 | 4 | Clearer hierarchy; mode not colour-only |
| Resilience | 3 | 5 | 5 | KS-A4 coherent; sparse RNA omits cleanly |

**Convenience averages:** A ≈ 2.6 · B ≈ 4.1 · C ≈ 4.3

### Additional criteria

| Criterion | A | B | C |
| --------- | - | - | - |
| Source fidelity | High | High | High |
| Optionality safety | Adequate | Strong | Strong |
| Renderer complexity | Known | Medium | Medium+ (cue table) |
| Content ownership | OK | OK | OK |
| Generalisability | Baseline | Better sparse | Needs archetype presence (11/26) |
| Reversibility | — | High | High |
| Diagnostic separation | Weak (meta elsewhere) | Strong | Strong |
| Print/mobile | Weak density | Stronger | Stronger |

## Trade-Off Analysis

| Composition | Core hypothesis | Main benefit | Main risk | Optionality | Complexity |
| ----------- | --------------- | ------------ | --------- | ----------- | ---------- |
| A | Status quo | Familiar | Mode weak; density; residuals | OK omit empty | Baseline |
| B | Consolidate | Clarity + dedupe | Mode still weak | Excellent | Medium |
| C | B + cues | Mode legible | Over-cue / overfitting if unbounded | Excellent if absent→B | Medium+ |

**Does archetype variation add value?** Yes, **bounded**: lifts Cognitive mode from 2→4 without separate trees. When archetype absent (15/26 inventory), C≡B — so variation is incremental, not mandatory.

## Recommended Contract

### Recommendation 3 — Adopt consolidated core plus bounded archetype variation

**Proceed to S65-BL-004 with Composition C**, where:

1. **Core slots = Composition B** (Header → Why? → Task → Produce → Approach → Support → Check → Reflect/Extend).
2. **Archetype cues** apply only when `episode_plan.archetype` is one of understand|apply|analyse|evaluate.
3. **Absent/unsupported archetype → Composition B**.
4. **Precedence / omission / residual rules** above are binding for manifestation design.
5. **Not** production authorisation — design task only.

### Recommended signal placement (summary)

- **Primary emphasis:** learner_task  
- **Produce:** expected_output alone  
- **Check:** checklist alone  
- **Why:** preamble ± bridge  
- **Approach:** reasoning (± progressive PEL)  
- **Support:** role groups; beat order when valid; residuals inside Support  
- **Mode:** optional S3 label + verb + emphasis  

## Constraints for S65-BL-004

- Implement manifestation rules for Recommendation 3 only (docs/rules first; no harden yet).
- Do not invent S6 fields.
- Do not rely on instructional_function / plan_beat_index.
- Define learner-facing role labels carefully (avoid “Text” / “Transfer Prompt” leakage — F04b).
- Registry gaps remain; residual policy mandatory.
- Cross-sample validation still required before production harden (BL-008/009).

## Rejected Alternatives

| Alternative | Why rejected |
| ----------- | ------------ |
| Retain A | Scores remain weak on mode, density, duplication |
| B only (Recommendation 2) | Leaves Cognitive mode at 2 despite cheap S3 cue |
| Separate per-archetype architectures | Violates cue constraints; high complexity; overfitting |
| Ultra-compact task-only for all | Loses Produce/Check/Support clarity on rich pages |
| Beat-only contract without residual policy | Repeats F09 orphans |

## Unknowns

```text
Unknown — requires S65-BL-008 or later validation:
```

- Live frequency of archetype on production pages beyond fixtures  
- Learner preference for mode labels (no learner research claimed)  
- Exact learner-facing wording dictionary for role labels (BL-006)  
- Whether progressive `<details>` for PEL cues is optimal vs always-visible short cues  

## Conclusion

Composition **C** (consolidated brief + bounded archetype cues) is the strongest evidence-backed contract: it preserves source meaning, stays sparse-safe, fixes Success↔checklist duplication, keeps residual materials visible, and makes cognitive mode legible without schema or hidden-plan inference. **S65-BL-004** should draft archetype-sensitive manifestation rules on this core.

**Next:** S65-BL-004 — Archetype-sensitive manifestation rules.
