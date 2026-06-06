# 38O-1 — Baseline role-survival trace

**Date:** 2026-06-05  
**Status:** **COMPLETE** (analysis only)  
**Type:** Discovery — no implementation  
**Predecessor:** [38N-5 follow-on observation](../2026-06-05-sprint-38n-page-fidelity-hardening/observations/38N-5-sprint-closure.md)  
**Authority:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)

---

## §1 Executive summary

Sprint 38-O investigates whether **instructional material roles** (worked examples, model answers, reasoning supports, etc.) survive from GAM into the composed page and render — a question **distinct from** the body-parity guarantees closed in 38-M/38-N.

Initial trace on **`EV-38M-AFTER`** (fresh inflation capture) and **`EV-38N-AFTER`** (post-38N replay render):

| Finding | Summary |
|---------|---------|
| **A1–A3** | Teaching roles largely **survive** in page JSON at ≥90% body length; keys renamed (`worked_example` ↔ `worked_analytic_pass`) |
| **A4 raw compose** | Multiple teaching roles **compressed, shell-replaced, or role-inverted** before merge |
| **A4 post-merge** | Full GAM bodies restored on canonical merged keys **alongside** weaker compose stubs |
| **Render** | Weaker compose roles render **before** full merged roles — duplicate blocks with misleading headings |
| **Body vs role** | 38M merge can achieve 100% ratio on canonical keys while **weaker role artefacts persist** and dominate learner-facing order |

**Verdict (38O-1):** Role-preservation gap **confirmed as a separate concern** warranting 38O-2 taxonomy work. Not disproven by 38N `proofOk: true`.

---

## §2 Runs selected

| Run | Role | Artefacts used |
|-----|------|----------------|
| **EV-38M-AFTER** | Primary — fresh inflation pipeline (`gpt-4.1-mini`, 2026-06-05) | `gam.json`, `design-page-raw.txt`, `design-page.json`, `run-log.json` |
| **EV-38N-AFTER** | Render replay — post-38N renderer/validators | `render.html`, `run-log.json` |

**Comparator context:** 38M post-merge achieves 100% GAM→Page aggregate ratio and 38N `proofOk: true`. This trace asks what **role signals** survive, not whether Tier-A char ratios pass.

---

## §3 Method

### 3.1 Role assignment (GAM authority)

Each GAM material mapped to an **instructional role family** from `type` + `purpose`:

| GAM type | GAM purpose (examples) | Role family |
|----------|------------------------|-------------|
| `text` | concept elucidation, criteria exposition | explanatory_guidance |
| `worked_example` | worked thinking, worked analytic pass | worked_example / worked_analytic_pass |
| `sample_output` | model answer / model calculation reference | model_answer / model_calculation |
| `modelling_note` | worked judgement | worked_judgement_support |
| `decision_table` | guided judgement | guided_judgement_table |
| `template` | independent judgement | independent_template |
| `transfer_prompt` | transfer | transfer_prompt |
| `consolidation_summary` | session closure | consolidation_summary |
| `checklist` | verification | verification_checklist |
| `classification_table` / `analysis_table` | practice | practice_table |
| `scenario` | case study / decision context | scenario |

### 3.2 Survival stages traced

```text
GAM (type/purpose + body)
  → Page RAW (LLM compose, pre-38M merge)
  → Page MERGED (post applyGamMaterialsToComposedPage)
  → Render (buildUtilityStructuredHtmlForTest, EV-38N-AFTER)
```

### 3.3 Survival codes

| Code | Meaning |
|------|---------|
| **SURVIVE** | Page body ≥90% GAM length; role recognisable |
| **DEGRADE** | Body 50–89% or role renamed with partial content |
| **COMPRESS** | Body <50% or pedagogical function collapsed |
| **ROLE_INVERT** | Key retained but function changed (e.g. teacher consolidation → learner write prompt) |
| **ABSENT** | No page key with substantive body |
| **DUPLICATE** | Full body present on ≥2 keys; weaker stub coexists |

---

## §4 Role-survival matrix

### 4.1 Activity A1 — Understand (M1–M4)

| Mat | Role | GAM len | Raw page | Merged page | Render | Survival |
|-----|------|---------|----------|-------------|--------|----------|
| M1 | explanatory_guidance | 1459 | `concept_text` 100% | 100% | Present | **SURVIVE** |
| M2 | worked_example | 1713 | `worked_example` 98% | 100% | Present | **SURVIVE** |
| M3 | model_answer | 1120 | `sample_output` 100% | 100% | Present | **SURVIVE** |
| M4 | verification_checklist | 692 | `verification_checklist` 98% | 100% | Present | **SURVIVE** |

**A1 conclusion:** All four instructional roles survive raw compose and merge. Body fidelity ≈ role fidelity.

---

### 4.2 Activity A2 — Apply CPI calculation (M5–M8)

| Mat | Role | GAM len | Raw page | Merged page | Render | Survival |
|-----|------|---------|----------|-------------|--------|----------|
| M5 | worked_example | 1310 | `worked_example` 97% | 100% | Present | **SURVIVE** |
| M6 | model_calculation | 929 | `sample_output` 98% | 100% | Present | **SURVIVE** |
| M7 | practice_table | 1184 | *(key absent in raw)* | `classification_table` 100% | Present | **SURVIVE** *(merge)* |
| M8 | verification_checklist | 640 | `verification_checklist` 98% | 100% | Present | **SURVIVE** |

**A2 conclusion:** Worked calculation + model calculation roles survive. Practice table appears only after merge (GAM preserve adds `classification_table`).

---

### 4.3 Activity A3 — Analyse households (M9–M12)

| Mat | Role | GAM len | Raw page | Merged page | Render | Survival |
|-----|------|---------|----------|-------------|--------|----------|
| M9 | worked_analytic_pass | 1313 | `worked_example` 98% | `worked_analytic_pass` 100% | First in order | **SURVIVE** *(renamed)* |
| M10 | practice_table | 1118 | `analysis_table` 99% | 100% | Ordered | **SURVIVE** |
| M11 | scenario | 670 | `scenario` 96% | `scenario_maya_households` 100% | Ordered | **SURVIVE** |
| M12 | verification_checklist | 610 | `verification_checklist` 98% | `checklist` 100% | Ordered | **SURVIVE** |

**A3 conclusion:** Roles survive with key renaming. 38N render ordering hardening surfaces worked pass before checklist. Role fidelity aligns with body fidelity on this activity.

---

### 4.4 Activity A4 — Evaluate strategies (M13–M20) — primary gap

| Mat | Role | GAM len | Raw page key / len | Merged page | Survival (merged) | Notes |
|-----|------|---------|----------------------|-------------|-------------------|-------|
| M13 | scenario | 842 | `scenario` 98% | 98% + alias keys | **SURVIVE** | |
| M14 | explanatory_guidance | 745 | `criteria_text` **71%** | 71% + `concept_exposition` 100% | **DUPLICATE** | Raw degraded; merge adds full body on alias |
| M15 | worked_judgement_support | 1082 | `modelling_note` **25%** | stub 273 + `worked_judgement_weak_strong` 100% | **DUPLICATE** | Thin stub + full merge |
| M16 | guided_judgement_table | 1542 | `decision_table` **68%** shell | shell 1047 + `guided_judgement_table` 100% | **DUPLICATE** | Shell + full merge |
| M17 | independent_template | 1352 | `independent_judgement_template` **26%** | stub 345 + `template` 100% | **DUPLICATE** | Bullet scaffold → full memo template |
| M18 | verification_checklist | 663 | `verification_checklist` 63% | `checklist` 100% | **SURVIVE** | Merge restores |
| M19 | transfer_prompt | 752 | `transfer_prompt` **31%** | stub 234 + `transfer_prompt_evaluate` 100% | **DUPLICATE** | |
| M20 | consolidation_summary | 738 | `consolidation_summary` **31%** | **ROLE_INVERT** raw → 100% merged | **SURVIVE** *(post-merge)* | Raw: learner write prompt; GAM: teacher consolidation prose |

**A4 raw compose pattern:** Page retains **structural roles** (scenario, criteria, modelling note, decision table, template, checklist, transfer, consolidation) but **compresses or inverts** teaching-heavy bodies into stubs, shells, or learner tasks.

**A4 post-merge pattern:** 38M preserve restores full bodies on canonical keys **without removing** weaker compose keys — page JSON accumulates **parallel role representations**.

---

## §5 Render trace (EV-38N-AFTER, A4 block)

Material `<h4>` heading sequence in learner render (abbreviated):

```text
Scenarios → Checklist → Template → Criteria Text → Modelling Note → Decision Table
→ Independent Judgement Template → Verification Checklist → Transfer Prompt
→ Consolidation Summary → … → Worked Judgement Weak Strong → Guided Judgement Table
→ Transfer Prompt Evaluate → Worked Example → …
```

| Observation | Implication |
|-------------|-------------|
| `Modelling Note` (273 chars) at pos ~9156 | Learner sees **thin** worked-judgement support first |
| `Worked Judgement Weak Strong` (1082 chars) at pos ~17221 | Full GAM teaching role appears **later** as duplicate |
| `Transfer Prompt` (234) before `Transfer Prompt Evaluate` (752) | Same weak-then-strong pattern |
| `Decision Table` (shell) before `Guided Judgement Table` (full) | Guided judgement role split across weak/strong blocks |

**Render conclusion:** Even when merged page JSON contains full teaching bodies, **renderer emits compose-weakened roles first** because legacy key paths precede merged canonical keys. Role fidelity fails at **learner UX** layer despite body-preservation pass on canonical fields.

---

## §6 Body fidelity vs role fidelity

| Dimension | 38M/38N guarantee | 38O-1 finding |
|-----------|-------------------|---------------|
| **Body length** | Tier-A ≥90% on canonical page keys post-merge | **Passes** on A4 capstone after merge |
| **Anti-synopsis** | No catalogue replacement on Tier-A | **Passes** post-merge |
| **Role identity** | Not explicitly guaranteed | **Fails partially** — keys renamed; stubs coexist |
| **Role prominence** | Not guaranteed | **Fails** — render surfaces weak roles first |
| **Pedagogical function** | Not guaranteed | **Fails on raw compose** — consolidation inverted to learner task |
| **Single authoritative representation** | Not guaranteed | **Fails** — duplicate keys per role on A4 merged page |

**Critical distinction:** `validate38MPageFidelity` and `pageMaterialText()` resolve **one body per canonical contract** — sufficient for body fidelity, insufficient to prove **one learner-facing role** with correct pedagogical framing.

---

## §7 Hypothesis: page layer selects weaker roles

### H1 — Compose role weakening (A4)

**Evidence:** `EV-38M-AFTER-design-page-raw.txt` A4 materials:

- `modelling_note`: 4-line definition stub vs GAM 1082-char contrasting weak/strong exemplars  
- `decision_table`: empty ranking grid vs GAM exemplar-populated table  
- `independent_judgement_template`: bullet scaffold vs GAM full memo template  
- `consolidation_summary`: “Write at least 80 words…” vs GAM teacher consolidation prose  
- `transfer_prompt`: 234 chars vs GAM 752 chars  

**Interpretation:** LLM compose **retains role slots** (keys exist) but **substitutes weaker page-native roles** (learner tasks, shells, stubs) for GAM teaching roles.

### H2 — Merge adds without superseding (A4 merged)

**Evidence:** Post-merge `EV-38M-AFTER-design-page.json` A4 carries simultaneous:

- `modelling_note` (273) **and** `worked_judgement_weak_strong` (1082)  
- `decision_table` (1047) **and** `guided_judgement_table` (1542)  
- `transfer_prompt` (234) **and** `transfer_prompt_evaluate` (752)  

**Interpretation:** GAM preserve **overlays** rich bodies without **retiring** compose-weakened role keys.

### H3 — Render prefers weaker keys first

**Evidence:** EV-38N-AFTER render heading order (§5).

**Interpretation:** Renderer iterates material keys / early paths before merged canonical fields — learner experience dominated by weaker role instances.

### H4 — Manual inflation UX (post-38N observation)

**Evidence:** 38N-5 follow-on: manual runs report page “thinner” despite KM/DLA/GAM richness.

**Interpretation:** If manual path skips merge hook or user inspects raw compose / early render, **only weaker roles visible** — consistent with H1–H3. *Requires confirmation in 38O-2 (manual artefact capture).*

---

## §8 Activity-level summary

| Activity | Body fidelity (38M post-merge) | Role fidelity (38O-1) | Primary failure mode |
|----------|-------------------------------|----------------------|----------------------|
| **A1** | 100% | **High** | Key renaming only |
| **A2** | 100% | **High** | Table key added by merge |
| **A3** | 100% | **High** | Renaming + ordering (fixed 38N) |
| **A4** | 100% (canonical) | **Low–Medium** | Compress + duplicate + render precedence |

---

## §9 Evidence-backed hypotheses for 38O-2

| ID | Hypothesis | 38O-2 action |
|----|------------|--------------|
| **O2-H1** | GAM `type`/`purpose` → page key mapping is many-to-many without role authority | Build formal taxonomy + mapping table |
| **O2-H2** | Page model lacks `material_role` or equivalent — keys are untyped strings | Assess schema gap vs IFP/GAM-PRES role vocabulary |
| **O2-H3** | Compose prompt favours worksheets/templates/checklists over teaching roles for A4 | Compare pack contracts to observed raw compose |
| **O2-H4** | Merge policy is additive (overlay) not substitutive (supersede weak) | Document merge precedence rules |
| **O2-H5** | Renderer heading derives from page keys, not GAM purpose | Map render paths to role signals |
| **O2-H6** | Scaffold hints at activity-row level mask missing material-level reasoning in UX | Trace scaffold vs material roles in render |

---

## §10 Scope and holds confirmed

| Hold | Status |
|------|--------|
| Do not reopen 38M | ✓ Analysis only |
| Do not reopen 38N | ✓ Analysis only |
| No implementation | ✓ No code/prompt/renderer/validator changes |
| Role survival focus | ✓ Not general quality review |

---

## §11 Recommended next phase

**38O-2 — Role taxonomy and page-mapping analysis**

- Formalise role ontology from GAM-PRES / IFP / 38I episode model  
- Complete GAM → page key → render heading map for all 20 materials  
- Compare against [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) expected learner-facing roles  

---

## References

| Document | Path |
|----------|------|
| 38M closure | [38M-6-sprint-closure.md](../../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-6-sprint-closure.md) |
| 38N closure + follow-on | [38N-5-sprint-closure.md](../2026-06-05-sprint-38n-page-fidelity-hardening/observations/38N-5-sprint-closure.md) |
| 38M proof run | [38M-5-inflation-proof-run.md](../../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-5-inflation-proof-run.md) |
| GAM | [EV-38M-AFTER-gam.json](../../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-gam.json) |
| Page raw | [EV-38M-AFTER-design-page-raw.txt](../../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-design-page-raw.txt) |
| Page merged | [EV-38M-AFTER-design-page.json](../../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-design-page.json) |
| Render | [EV-38N-AFTER-render.html](../2026-06-05-sprint-38n-page-fidelity-hardening/artefacts/EV-38N-AFTER-render.html) |
