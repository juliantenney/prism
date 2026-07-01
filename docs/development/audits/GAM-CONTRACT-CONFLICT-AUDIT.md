# GAM Contract Conflict Audit (Sprint 57 Discovery)

**Status:** Evidence record  
**Date:** 2026-07-01  
**Method:** Cross-authority text comparison on augmented GAM prompt (46,349 chars, full lib bootstrap)

---

## 1. Summary

| Conflict class | Instances found | Severity |
|----------------|----------------:|----------|
| Length guidance (words vs chars) | 3 | Medium |
| Depth vs brevity / anti-redundancy | 2 | Medium |
| Progressive independence vs depth floors | 1 | Low–medium |
| Scaffold-only vs substantive body minima | 2 | Low (resolved by carve-outs) |
| Competing rubric / assessment models | **0** on GAM path | N/A |

GAM does **not** exhibit DLA-style **numeric word-range grid conflicts** (e.g. 25–80 vs 35–80 on the same field). Conflicts are **semantic tensions** between governance layers, not contradictory hard numbers on identical fields.

---

## 2. Conflicting length guidance

### C-01 — Words vs characters for “depth”

| Authority | Unit | Threshold | Material types |
|-----------|------|-----------|----------------|
| GAM-PRES-08 (pack) | **Words** | transfer ≥80w; walkthrough ≥120w | transfer_prompt, worked_thinking |
| GAM-FMT-04 (capture) | **Characters** | checklist ≥80ch; default teaching ≥120ch | checklist, general bodies |
| GAM-FMT-06/07 (compose) | **Characters** | A4 bodies ≥400ch | scenario, worked_judgement |

```12:14:lib/gam-output-format.js
  var MIN_CHECKLIST_BODY = 80;
  var MIN_TEACHING_BODY = 120;
  var MIN_A4_COMPOSE_BODY = 400;
```

**Conflict:** Prompt teaches **80 words** for transfer; capture thin-warning uses **80 characters** for checklist-type bodies. A model can satisfy capture char floors while violating word floors (and vice versa).

**Probe evidence:** `80 words` appears **7×** in prompt; `at least 80` (capture normalise phrase) **0×** on emit path.

### C-02 — SP word bands vs GAM-PRES numeric floors

SP-03/04 GOOD shape examples use placeholder `Write [word band]` without binding numbers. GAM-PRES-08 specifies **≥80 words** for transfer/closure.

**Conflict type:** Soft (template band) vs hard (pack floor). Not contradictory unless model follows SP example literally without pack floor.

### C-03 — EQF “lightweight” metacognition vs checklist depth

EQF (GAM manifestation):

```57:62:lib/educational-quality-framework-prompt.js
    step_generate_activity_materials: [
      "- Materials: realise the cognitive purpose already specified by DLA — do not redesign pedagogy.",
      // ...
      "- Where appropriate, include lightweight prompts that help learners notice uncertainty, confidence, progress or next steps.",
```

SP-05 + GAM-PRES-08 (V1) require **≥4 criteria-linked checklist items** + `## Common mistakes` + revision block.

**Tension:** “Lightweight” metacognition vs mandatory multi-section checklist depth — not a numeric clash; both can apply to different material types on the same page.

---

## 3. Competing assessment / material instructions

### C-04 — Anti-redundancy vs instructional completeness

**Authority A** (self-study voice, `app.js` ~10248):

> Do not duplicate content unnecessarily.

**Authority B** (same block, immediate next lines):

> anti-redundancy must never reduce a material below the minimum instructional richness required by GAM-PRES-08  
> Prefer instructional completeness over brevity.

**Authority C** (EQF):

> Cognitive over interface activity: depth of thinking beats visible interactivity.

**Authority D** (GAM-PRES-09 DEPTH-COLLAPSE):

Fails thin/collapsed materials.

**Assessment:** Explicitly negotiated in prompt (B overrides A). **Not an accidental conflict** — but models may overweight brevity from A before reading B.

### C-05 — Progressive independence vs sustained depth

**EQF:**

> Progressive independence: … reduce scaffolding across the journey.

**GAM-PRES-08 / SP blocks:**

Maintain L3 depth floors on every material type regardless of activity position.

**Tension:** Later activities should have *less scaffolding text* but still meet *same minimum depth* — ambiguous for consolidation/transfer materials.

### C-06 — Do not pre-answer vs weak/strong contrast depth

**SP-04 / GAM-WB-06:**

Consolidation must be scaffold-only — no completed essay.

**PEL reasoning:**

Requires `## A weaker response would` / `## A stronger response would` with comparative judgement.

**Resolution:** Pack distinguishes material **types**; contrast sections are allowed in worked_judgement/modelling_note, not consolidation_summary. Low conflict if types respected; high risk if model conflates closure and consolidation types.

---

## 4. Competing rubric instructions

GAM path does **not** invoke `step_design_assessment` or `step_generate_assessment_items`. Rubric appears only as **material type** exposition (GAM-PRES-03/06 criteria materials).

**Finding:** No competing rubric scoring models on the GAM generation path. Assessment-item contracts are out of scope.

---

## 5. DLA vs GAM conflict profile

| Conflict type | DLA pre-S56 | GAM |
|---------------|-------------|-----|
| Same field, different word ranges | **Yes** (reasoning 25–80 vs 35–80) | **No** |
| OUTPUT CONTRACT vs PRE-EMIT | **Yes** | N/A (no PRE-EMIT) |
| EQF reduce scaffolding vs minima | Yes | Yes (C-05) |
| Char vs word validation | Partial | **Yes** (C-01) |

---

## 6. Documented conflicts register

| ID | Authorities | Description | Severity |
|----|-------------|-------------|----------|
| C-01 | GAM-PRES-08, GAM-FMT-04/06/07 | Words vs characters for depth | Medium |
| C-02 | SP-03/04 examples, GAM-PRES-08 | Placeholder word band vs ≥80w floor | Low |
| C-03 | EQF, SP-05, GAM-PRES-08 | Lightweight metacognition vs checklist depth | Low |
| C-04 | Self-study voice, GAM-PRES-08/09, EQF | Brevity vs completeness (explicit carve-out) | Medium |
| C-05 | EQF progressive independence, GAM-PRES-08 | Fade scaffolding vs fixed depth floors | Medium |
| C-06 | SP-04 scaffold-only, PEL weak/strong | Type confusion risk on closure materials | Low |

---

## 7. Traceability

| File | Role |
|------|------|
| `app.js` ~10240–10251 | Anti-redundancy vs completeness |
| `lib/educational-quality-framework-prompt.js` | EQF independence + lightweight metacognition |
| `lib/gam-output-format.js` | Char-based capture/compose floors |
| `domains/learning-design/domain-learning-design-step-patterns.md` §6 | GAM-PRES-08 word floors (embedded) |
| `lib/instructional-pattern-prompt.js` | SP scaffold-only rules |
