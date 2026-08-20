# Sprint 56 — DLA Field Semantics Forensic Audit

**Status:** Investigation complete (no fixes implemented)  
**Date:** 2026-07-01  
**Scope:** Why Copy-path DLA generation still emits short label-like scaffold fields after DLA-05 (SSOT rationalisation) and DLA-07 (instruction competition trim)  
**Evidence inputs:** [SPRINT-56-DLA-08-COPY-PATH-VALIDATION.md](SPRINT-56-DLA-08-COPY-PATH-VALIDATION.md) · `tests/fixtures/dla/rna-hcv-dla-08-run.json` · `artefacts/dla-08-rna-hcv-emitted-copy-prompt.txt` · Sprint 55 rationalisation audit · current `app.js` / `lib/ld-guided-learning-scaffold.js` implementation

---

## 1. Executive summary

| Finding | Detail |
|---------|--------|
| **Primary hypothesis** | **Confirmed** — the model treats scaffold fields as **activity metadata / obligation-coverage labels**, not learner-facing page copy. |
| **Secondary hypothesis** | Prompt accretion / conflicting word ranges — **ruled out** as root cause (DLA-05/07 resolved architecture; 0% mandatory pass persists). |
| **Dominant failure mode** | **Dual-channel compliance:** Channel A (obligation population) receives high effort — long numbered `learner_task`, depth_floor L3 `required_materials`, beat-mirrored preambles. Channel B (scaffold strings) receives minimal presence tokens satisfying REQUIRED flags and IFP/WB gates. |
| **Mandatory pass rate** | **0 / 5 activities (0%)** on post-DLA-07 fixture (`rna-hcv-dla-08-run.json`) |
| **Marginal improvement vs Sprint 55** | Mean preamble ~19 → ~52 words; cognition and `expected_output` remain systematically below floors |

The model is **not ignoring** word floors — it is **misinterpreting what the fields are for**. Instructions that teach “populate obligations,” “observable completion evidence,” and “one sentence” cues outweigh the compact SSOT block because they align with the opening task frame and dominate token budget on the fields the model believes are “metadata slots.”

---

## 2. Evidence summary

### 2.1 Prompt architecture (post-DLA-07)

| Metric | Value |
|--------|------:|
| Core emitted prompt (no upstream embed) | ~31,769 chars |
| Copy wrapper (with episode_plans JSON) | ~44,419 chars |
| SSOT block position | ~line 325 (after ~25k chars of obligation-population gates) |
| Opening task frame | “obligation population step — translate each episode_plan beat…” |
| Closing re-anchor | Episode Plan population contract (~line 468) repeats population-only frame **after** JSON example and PEL |

### 2.2 Generated output quality (DLA-08 fixture)

| Metric | Result |
|--------|--------|
| Activities | 5 (A1–A5) |
| Mandatory SSOT pass (all floors per activity) | **0%** |
| `evaluateGuidedLearningScaffoldEvidence()` | **FAIL** (5/5 flagged) |
| Topic-specific RNA/HCV prose | **Absent** — LO1–LO5 placeholders, beat vocabulary |
| `required_materials` / obligation rows | **Compliant** — depth_floor L3, DLA-WB row types present |
| `learner_task` style | Long numbered beat checklists (56–77 words) |

### 2.3 Word-count snapshot (mandatory fields)

| Activity | Preamble (≥50) | Best cognition (≥35) | Expected output (≥30) | Bridge (≥30, A2+) |
|----------|---------------:|---------------------:|----------------------:|------------------:|
| A1 | 48 ❌ | `self_explanation_prompt` 36 ✓ | 24 ❌ | — |
| A2 | 47 ❌ | `self_explanation_prompt` 23 ❌ | 19 ❌ | 26 ❌ |
| A3 | 57 ✓ | `reasoning_orientation` 37 ✓ | 23 ❌ | 23 ❌ |
| A4 | 53 ✓ | `reasoning_orientation` 25 ❌ | 18 ❌ | 22 ❌ |
| A5 | 56 ✓ | `argument_structure_hint` 31 ❌ | 26 ❌ | 23 ❌ |

**Pattern:** Preambles improved toward floor but remain **beat-metadata summaries** (orientation → framing → activation → practice). Cognition fields cluster at **18–37 words** — often one imperative sentence plus a fragment. `expected_output` universally reads as **deliverable manifest** (“Completed X demonstrating Y…”) at **18–26 words**.

---

## 3. Per-activity field analysis

Classification key: **prose** = multi-sentence learner-facing copy; **instruction** = direct imperative to learner; **label** = noun-phrase / deliverable tag; **metadata** = designer/plan summary; **placeholder** = LO/topic-generic shell.

### 3.1 Activity A1 — Understanding Core Concepts for LO1

| Field | Words | Style | Notes |
|-------|------:|-------|-------|
| `activity_preamble` | 48 | metadata | Enumerates beat functions (context, framing, activation, explanations, non-examples, misconceptions, guided/independent practice). No RNA/HCV substance. |
| `self_explanation_prompt` | 36 | instruction | Two imperative sentences; generic “articulate… reflect on misconceptions.” Borderline floor; not topic-specific. |
| `expected_output` | 24 | label | “Completed practice exercises… reflection… verification checklist results…” — deliverable list, no quality threshold. |
| `learner_task` | 77 | metadata | Numbered beat mirror (8 steps). |
| `support_note` | — | absent | — |
| `intellectual_coherence_bridge` | — | absent | Correct for A1; not scored. |

### 3.2 Activity A2 — Exploring and Applying LO2 Concepts

| Field | Words | Style | Notes |
|-------|------:|-------|-------|
| `activity_preamble` | 47 | metadata | Near-duplicate of A1 structure with LO2 substituted. |
| `self_explanation_prompt` | 23 | instruction | “Explain how each example… Reflect on how confronting misconceptions…” — checklist fragment. |
| `expected_output` | 19 | label | “Completed exercises showing correct application…” |
| `intellectual_coherence_bridge` | 26 | metadata | “extends your knowledge to related concepts in LO2” — session summary, not reasoning carry-forward. |
| `learner_task` | 61 | metadata | Beat checklist. |

### 3.3 Activity A3 — Analysing LO3 with Criteria and Inquiry

| Field | Words | Style | Notes |
|-------|------:|-------|-------|
| `activity_preamble` | 57 | metadata | Beat enumeration including “worked thinking example,” “guided inquiry,” “transfer tasks.” |
| `reasoning_orientation` | 37 | instruction | **Only cognition field at floor.** Imperative stems (“consider… focus on linking…”). Generic analytical advice. |
| `conceptual_contrast_prompt` | 22 | instruction | “Contrast different analytical criteria…” — one-line stem without criteria or novice confusion. |
| `expected_output` | 23 | label | “completed analysis table linking criteria to observations…” |
| `intellectual_coherence_bridge` | 23 | metadata | “introducing analytical frameworks and criteria” — designer transition note. |
| `learner_task` | 67 | metadata | 9-step beat list including transfer. |

### 3.4 Activity A4 — Advanced Analysis for LO4

| Field | Words | Style | Notes |
|-------|------:|-------|-------|
| `activity_preamble` | 53 | metadata | Same beat-template as A3 with “advanced” qualifier. |
| `reasoning_orientation` | 25 | instruction | “Focus on how each analytical criterion reveals…” — thin imperative. |
| `conceptual_contrast_prompt` | 20 | instruction | Single-sentence contrast cue. |
| `expected_output` | 18 | label | Shortest expected_output in set. |
| `intellectual_coherence_bridge` | 22 | metadata | “extends your analytical skills by deepening…” |
| `learner_task` | 56 | metadata | Beat checklist. |

### 3.5 Activity A5 — Evaluating LO5 with Judgement and Transfer

| Field | Words | Style | Notes |
|-------|------:|-------|-------|
| `activity_preamble` | 56 | metadata | Evaluate beat chain: perspectives, criteria construction, worked judgement, transfer. |
| `argument_structure_hint` | 31 | prose-attempt | Best cognition prose in run; still below 35w floor. Three-move structure named but compressed. |
| `uncertainty_tension_prompt` | 24 | instruction | Metacognition stem; **not counted** in mandatory cognition floor set. |
| `transfer_or_application_task` | 18 | label | One-line transfer instruction — duplicates obligation already in `learner_task` step 9. |
| `expected_output` | 26 | label | “detailed evaluative judgement memo… checklist… transfer task response” — artefact manifest. |
| `intellectual_coherence_bridge` | 23 | metadata | Generic evaluative-skills summary. |
| `learner_task` | 68 | metadata | 9-step Evaluate pack mirror. |

---

## 4. Persistent failure patterns

| Pattern | Prevalence | Example |
|---------|------------|---------|
| **Beat-function enumeration in preambles** | 5/5 | “orientation, framing, activation… guided and independent practice” |
| **LO placeholder substitution** | 5/5 titles + preambles | “Understanding Core Concepts for LO1” |
| **Deliverable-label `expected_output`** | 5/5 | “Completed… demonstrating… verification checklist results…” |
| **Imperative-stem cognition fields** | 4/5 below floor | “Contrast different analytical criteria and consider how…” |
| **Topic-generic analytical vocabulary** | 5/5 | “analytical criteria,” “mechanisms,” “perspectives” without RNA/HCV |
| **Checklist-style `learner_task`** | 5/5 | Numbered steps mirroring `instructional_function` beats |
| **Bridge as session summary** | 4/4 | “extends your knowledge / analytical skills” — not prior-reasoning carry-forward |
| **Schema-minimised cognition selection** | — | Model picks **one** cognition field per activity for presence; avoids populating multiple rich fields |
| **Token budget asymmetry** | 5/5 | `learner_task` + `required_materials` deep; scaffold strings shallow |
| **Anti-terse pattern match** | 5/5 would fail evaluator | `scaffoldLooksLikeTerseLabel` heuristics would flag deliverable-label `expected_output` |

---

## 5. Field semantics trace

For each scaffold field: where the model learns its meaning, and whether any source **implicitly teaches brevity or metadata usage**.

### 5.1 Domain-pack opening (`domain-learning-design-step-patterns.md` §5)

| Source | Teaches | Brevity / metadata bias? |
|--------|---------|--------------------------|
| **Task line** | “obligation population step — translate each episode_plan beat into activity fields and required_materials obligations” | **Yes — primary frame.** Scaffold fields classified as “activity fields” alongside obligations, not “page copy.” |
| **Instructions** | “observable expected_output” | **Yes** — completion evidence, not quality prose. |
| **IFP-05 AS-05** | `expected_output = observable evidence not topic coverage` | **Yes** — checklist noun phrases. |
| **IFP-05 AS-02** | `learner_task ≥2 teach/model segments` | Indirect — encourages long `learner_task`, short everything else. |
| **OBLIGATION POPULATION G1–G5** | “cognition fields alone FAIL” | **Yes** — cognition is **insufficient** without materials; model deprioritises cognition depth. |
| **DLA-WB-19** | “non-empty expected_output with observable completion evidence” | **Yes** |
| **Output schema one-liner** | Lists field names with REQUIRED flags only | **Yes** — no per-field learner-facing semantics. |
| **“Return only the JSON.”** | Compression | **Yes** — global brevity pressure. |

### 5.2 OUTPUT CONTRACT (`buildLearnerPageDlaOutputContractOverrideBlock`)

| Line | Teaches | Brevity bias? |
|------|---------|---------------|
| Title | “field index; scaffold: LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT” | Defers semantics to SSOT — index only. |
| `uncertainty_tension_prompt (one sentence)` | Optional field = one sentence | **Yes — direct brevity cue** adjacent to mandatory cognition fields. |
| `intellectual_frame (1–2 sentences)` | Short optional field | Mild adjacency bias. |
| `learner_task may stay concise` | Explicit carve-out | **Yes** — model generalises brevity to sibling fields despite SSOT negation. |
| Archetype framing | “match episode_plan beat / primary_archetype” | **Yes** — reinforces beat-metadata preambles. |

### 5.3 SSOT (`LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT` compact block)

| Element | Teaches | Brevity bias? |
|---------|---------|---------------|
| `CORE_LINES[2]` | “Author scaffold fields as educational prose to the learner — not metadata labels” | **Correct semantics** |
| `COMPACT_DLA_FIELD_LINES` | Word ranges + one-line FIELD SEMANTICS | Correct but **compressed** vs ~25k obligation text before it. |
| `FIELD_LINES` (full, Design Page only) | Per-field bullets with FORBIDDEN patterns | **Not emitted on DLA Copy path** |
| PRE-EMIT gate | Word count self-check | Correct — but model treats as post-hoc lint, not generative goal |
| RNA exemplars in SSOT | Weak/Strong contrasts | Helpful but **generic virology examples** don’t override obligation frame |

### 5.4 JSON example (`buildSelfDirectedLearnerPageDlaOutputContractExampleBlock`)

| Element | Teaches | Brevity bias? |
|---------|---------|---------------|
| Marx comparison example | Rich 35–80w scaffold strings | **Positive exemplar** |
| `learner_task` in example | Short (“Complete the comparison table…”) | Reinforces concise sibling field |
| Footnote | “38L mandatory rows not shown” | **Yes** — model infers rich scaffold is **demo tier**; real work is `required_materials` rows |

### 5.5 PEL / EQF (post-DLA-07 qualified)

| Element | Teaches | Brevity bias? |
|---------|---------|---------------|
| PEL orientation | “Activity-level orientation fields… follow OUTPUT CONTRACT” | Points to thin index |
| PEL reasoning | “SSOT word floors (35–80) — not one-line hints” | **Correct** — but late in prompt |
| EQF metacognition | “short confidence, uncertainty… in optional fields” | Mild — reinforces short optional-field pattern |

### 5.6 Late Episode Plan population block

| Element | Teaches | Brevity bias? |
|---------|---------|---------------|
| “DLA is population-only” | Metadata population | **Yes — re-anchors after SSOT** |
| “assemble learner_task from beat obligations” | Beat → task mapping | **Yes** — no equivalent for scaffold prose depth |
| Upstream `episode_plans` JSON (start + end) | Beat vocabulary | **Yes** — preambles echo `instructional_function` tokens |

### 5.7 Field names themselves

| Field | Name semantics model likely infers | Learner-facing? |
|-------|--------------------------------------|-----------------|
| `activity_preamble` | Document front-matter / plan summary | Ambiguous |
| `reasoning_orientation` | Designer note on reasoning mode | **Metadata** |
| `self_explanation_prompt` | Prompt stub | **Label** |
| `conceptual_contrast_prompt` | Prompt stub | **Label** |
| `argument_structure_hint` | Structural hint | **Label** |
| `transfer_or_application_task` | Task descriptor | **Label** (conflicts with `learner_task`) |
| `expected_output` | Deliverable specification | **Metadata** |
| `intellectual_coherence_bridge` | Internal LD cohesion token | **Metadata** |
| `support_note` | Facilitator/support metadata | **Metadata** |

### 5.8 Evaluator (`evaluateGuidedLearningScaffoldEvidence`)

| Element | Effect on generation |
|---------|---------------------|
| `TERSE_LABEL_PATTERNS` | `/^completed\s+\w+/i` matches all 5 `expected_output` values |
| `scaffoldLooksLikeTerseLabel` | Would flag outputs — but runs **post-capture**, not in Copy prompt |
| Repair path | Not available on external Copy generation |

---

## 6. Field-semantics audit table

| Field | Intended meaning (SSOT) | Model behaviour (DLA-08) | Suspected cause |
|-------|-------------------------|--------------------------|-----------------|
| `activity_preamble` | 50–120w workbook introduction: why activity matters, conceptual problem, thinking to practise | 47–57w beat-function summaries referencing LO placeholders | Opening task = obligation population; archetype framing “match episode_plan beat”; beat JSON at prompt start/end; no topic in upstream LO brief |
| `reasoning_orientation` | 35–80w: what to look for, step-by-step reasoning, mistake to avoid | 0–1 per activity; 25–37w imperative stems; generic “criteria / mechanisms” | Field name = designer metadata; OUTPUT CONTRACT lists name only; population frame says cognition alone fails — materials matter more |
| `self_explanation_prompt` | 35–80w generative explanation before checking | 23–36w; generic “articulate / explain / reflect” | Name = “prompt” → one-line stem; weak exemplar in SSOT only; JSON example good but Marx-specific |
| `conceptual_contrast_prompt` | 35–80w explicit comparison criteria + novice confusion | 20–22w single-sentence contrast | Name = “prompt”; IFP teaches contrast via materials/tables not prose field |
| `argument_structure_hint` | 35–80w unpack criteria → comparison → judgement as sentences | 31w on A5 only; compressed three-move outline | Name = “hint”; arrow-chain weak exemplar may prime shorthand |
| `transfer_or_application_task` | 35–80w application with criteria carry-forward | 18w one-liner duplicating `learner_task` step | Name overlaps `learner_task` + `transfer_prompt` material row; model treats as redundant label |
| `uncertainty_tension_prompt` | (Optional) metacognitive tension | 24w on A5; not in mandatory cognition set | OUTPUT CONTRACT: **“(one sentence)”** — explicit brevity teaching |
| `expected_output` | 30–70w quality threshold: format, scope, depth, strong-response bar | 18–26w deliverable manifests | **AS-05**, **DLA-WB-19**, domain “observable expected_output”; field name; SSOT strong exemplar loses to IFP gates |
| `intellectual_coherence_bridge` | 30–60w carry forward **prior reasoning** into this activity | 22–26w generic “extends your knowledge/skills” | Name = internal bridge token; no exemplar in compact SSOT; first activity correctly omitted |
| `support_note` | 20–70w misconception guard / evidence cue | Absent all activities | Optional in schema; no gate pressure; name = facilitator metadata |

---

## 7. Metadata-vs-prose hypothesis assessment

### 7.1 Hypothesis

The model interprets scaffold fields as **JSON schema metadata** summarising plan coverage for downstream validators, while expending prose budget on **`learner_task`** and **`required_materials`** which the prompt explicitly calls “implementation-ready” and “obligation” objects.

### 7.2 Supporting evidence

1. **Opening task frame** names the step “obligation population,” not “author learner page copy.”
2. **Generated preambles** read like beat coverage reports, not workbook introductions.
3. **`expected_output`** values match IFP “observable evidence” pattern exactly — not SSOT “quality threshold” pattern.
4. **`learner_task`** receives 3–4× more words than cognition fields — consistent with AS-02 and beat-assembly instructions.
5. **Field names** (`*_hint`, `*_orientation`, `expected_output`) align with CMS/design-tool conventions, not learner UI copy.
6. **JSON example footnote** signals that shown scaffold richness is partial — mandatory rows are the real compliance target.
7. **PRE-EMIT gate** asks for word counts but appears **after** 300+ lines of materials-focused gates — model optimises for EMIT-FAIL / DLA-WB pass first.
8. **0% pass despite SSOT at correct ranges** — architecture fix worked; semantics frame did not.

### 7.3 Contradicting / mitigating evidence

1. Preambles **did** lengthen post-DLA-05 (19 → ~52w mean) — model partially accepts preamble as prose.
2. A3 `reasoning_orientation` hit 37w — shows floors are **reachable** when field is populated with imperative sentences.
3. SSOT explicitly forbids metadata labels — model complies at **presence** level, not **genre** level.
4. Marx JSON example demonstrates correct genre — but topic mismatch + “rows not shown” footnote limits transfer.

### 7.4 Verdict

**Primary hypothesis confirmed at high confidence.** The remaining failure is **semantic framing and field-level teaching**, not prompt size or range conflict.

---

## 8. Recommended corrective actions (ranked)

**Constraint:** Smallest possible changes — field-description, schema-description, exemplar, semantic clarification only. No new prompt layers, gates, or PRE-EMIT systems.

| Rank | Action | Target | Likely impact | Confidence | Est. size |
|------|--------|--------|---------------|------------|-----------|
| **1** | Reframe domain-pack **Task** opening: add one line — scaffold string fields (`activity_preamble`, cognition fields, `expected_output`, `intellectual_coherence_bridge`) are **learner-facing page copy shown on the composed page**, not beat-coverage metadata; obligation population applies primarily to `required_materials` and `learner_task` structure | `domain-learning-design-step-patterns.md` promptTemplate | **High** — resets primary cognitive frame | **High** | ~1 line |
| **2** | Qualify **IFP AS-05** and **DLA-WB-19**: `expected_output` = learner-facing **quality-threshold prose** (30–70w) stating what a strong response looks like — not a comma-separated deliverable manifest or “observable evidence” label | Domain-pack IFP + emitted DLA-WB lines | **High** — fixes universal 5/5 failure | **High** | ~2 lines replace |
| **3** | Remove **OUTPUT CONTRACT** brevity cues: delete `(one sentence)` from `uncertainty_tension_prompt`; replace `learner_task may stay concise` with “learner_task may stay concise **without shortening other scaffold fields**” (mirror SSOT, not standalone) | `buildLearnerPageDlaOutputContractOverrideBlock` | **Medium–High** — removes adjacent brevity teaching | **High** | Net neutral |
| **4** | Extend domain-pack **activities[]** schema line with per-field genre clause: “each scaffold string = complete learner-facing sentences, not designer labels” | Domain-pack Output section | **Medium** — schema-level genre | **Medium–High** | ~3 lines |
| **5** | Amend **Episode Plan population block** closing line: “populate scaffold strings as page copy; do not summarise beats in `activity_preamble`” | `lib/episode-plan-dla-integration.js` | **Medium** — counters late re-anchor | **Medium** | ~1 line |
| **6** | Replace JSON example footnote with: “Scaffold strings above are **production page copy** at SSOT word floors; materials rows omitted.” | `buildSelfDirectedLearnerPageDlaOutputContractExampleBlock` | **Medium** — fixes exemplar tier confusion | **Medium** | ~1 line |
| **7** | Add **RNA/HCV-topic** mini-exemplar pair (3–4 lines) for `expected_output` weak/strong in SSOT compact block — already has virology reasoning exemplars; add deliverable-threshold pair | `COMPACT_DLA_FIELD_LINES` or exemplar section | **Medium** — topic alignment for probe brief | **Medium** | ~4 lines |
| **8** | OUTPUT CONTRACT: rename section header from “field index” to “learner-facing copy fields (author to the learner)” | `app.js` | **Low–Medium** | **Medium** | ~1 line |
| **9** | Re-enable **per-field FIELD_LINES** bullets for DLA (not full duplicate module) — only if 1–4 insufficient | `ld-guided-learning-scaffold.js` | **Medium** | **Low** (size budget risk) | +800–1500 chars |

### Not recommended (per investigation brief)

| Action | Reason |
|--------|--------|
| New PRE-EMIT / gate layers | User explicitly deferred |
| Further prompt-size reduction | DLA-07 complete; not root cause |
| SSOT position move (again) | DLA-07 addressed; framing matters more than position |
| Capture-side repair for Copy eval | Masks generation failure |
| Field renames | Schema-breaking; out of minimal-fix scope |

---

## 9. Confidence summary

| Conclusion | Confidence |
|------------|------------|
| Root cause is metadata/obligation frame, not prompt accretion | **Very high** |
| `expected_output` IFP wording is strongest per-field brevity teacher | **High** |
| Opening Task line is strongest global frame teacher | **High** |
| OUTPUT CONTRACT `(one sentence)` harms adjacent field genre | **High** |
| Field names contribute to metadata inference | **Medium** |
| JSON example footnote undermines exemplar authority | **Medium** |
| Late episode-plan block re-anchors population frame | **Medium** |
| Model capacity (`gpt-4.1-mini`) is primary limiter | **Low** (A3 cognition at floor proves otherwise) |

---

## 10. Traceability

| Artefact | Role |
|----------|------|
| DLA-05 | SSOT rationalisation — architecture **pass**, quality **insufficient** |
| DLA-07 | Instruction competition trim — **no further size reduction**; 0% pass persists |
| DLA-08 | Validation harness — this audit explains **why** threshold not met |
| Sprint 55 rationalisation audit | Baseline duplication/conflict analysis — largely resolved |
| `rna-hcv-dla-08-run.json` | Primary generated JSON evidence |
| `dla-08-rna-hcv-emitted-copy-prompt.txt` | Emitted prompt for semantics trace |

---

## 11. Suggested validation after fixes (future sprint)

1. Apply rank 1–4 changes only (minimal semantic patch).
2. Re-run `node scripts/probe-dla-08-copy-validation.js` — no prompt-size work.
3. Success criterion unchanged: ≥80% activities pass mandatory SSOT floors.
4. Secondary qualitative check: scaffold fields cite RNA/HCV mechanisms, not LO placeholders or beat-function enumeration.

**This document does not implement fixes** — investigation and recommendations only.
