# 38S Phase 2C — Design Page Responsibility & Preservation Audit (Read Only)

**Date:** 2026-06-08  
**Status:** **COMPLETE — audit only; no prompt or code changes**  
**Type:** Read-only Design Page prompt responsibility audit  
**Sprint:** [38S Episode Plan V1 implementation](../README.md)  
**Authority:** [38S-handover-pack.md](38S-handover-pack.md)  
**Predecessors:** [Phase 2B-b PEL audit](38S-prompt-sanitisation-phase-2b-b-pel-audit.md) · [Prompt responsibility audit (DLA/GAM/Page)](38S-prompt-responsibility-audit-dla-gam-page-after-episode-plan-v1.md) · [38M baseline page fidelity](../../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-1-baseline-page-fidelity-analysis.md)

---

## Executive summary

**Question:** Why does a fresh Inflation manual run compress rich GAM material bodies into revision-note summaries on Design Page — and which prompt blocks permit or cause that?

**Answer:**

1. **Design Page pack text is preserve-oriented on paper** (~10k chars) but contains an explicit **permission to shorten** material bodies (`near-verbatim` + *“shorten only clearly non-essential prose”*). That aligns with default LLM “readable page assembly” behaviour and matches observed A1–A5 collapse patterns.

2. **Runtime augmentation is also preserve-oriented** (+16.5k chars for self-directed Inflation workshop; +12.3k generic workshop) via `LD-DESIGN-PAGE-COMPOSE-CONTRACT`, embedded `LD-MATERIALS-COPY` (preserve), `LD-TABLE-FIDELITY` (preserve), and `LD-SELF-DIRECTED-RHETORIC` (design_page rider). **No runtime block instructs GAM-style material authoring on Page** — correctly.

3. **The bottleneck is signal competition + permissive shorten language + prompt mass at the wrong end.** Preserve rules appear in pack + compose block (~8k duplicated intent). **Sprint 38 visual affordance contract (~6.6k chars) sits last** in the augmented prompt and dominates attention for schema compliance. Copilot satisfies page JSON shape while **summarising `activity.materials` bodies**.

4. **Post-capture GAM overlay (`page-gam-materials-preserve.js`) can repair compression** when upstream GAM capture is synced — but **only when merge heuristics detect placeholder/synopsis/length deficit**. Short “study note” summaries that look like complete prose may **not** trigger merge for generic keys (`concept_exposition`, `worked_example`) without inflation-specific fidelity contracts. Manual workflow users see **Copilot output first** — compression is already visible before merge.

5. **Dead code:** `buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock()` exists in `app.js` but is **never injected** — field-preservation rules rely on compose contract + rhetoric only.

**Verdict:** Page is the clearest remaining bottleneck for **LLM compose behaviour**, not missing GAM realisation. Phase 2C should **tighten preserve language and anti-synopsis signals** (pack + runtime), **dedupe redundant preserve blocks**, and **optionally strengthen merge heuristics** — without touching Episode Plan, DLA, GAM packs, population contract, or workflow chaining.

---

## A. Page responsibility map

### Pack — `domain-learning-design-step-patterns.md` §13 Design Page

| Block | ~Chars | Intended role | Class | Notes |
|-------|-------:|---------------|:-----:|-------|
| `promptTemplate` | 8,460 | Read-only compose; merge `activity_materials`; section schema | **A Keep (compose)** | Strong MATERIALS FIDELITY + LD-MATERIALS-COPY inline |
| `defaultPromptNotes` | 1,600 | JSON shape; section_id order; materials merge reminder | **B Rewrite (dedupe)** | Repeats runtime contracts |
| `runnerInstructions.what_to_check` | ~2,400 (in template) | Preserve checklist for runner | **B Merge** | Duplicates pack + runtime |
| `userOptions.page_profile=learner` | ~120 | Substantive overview + **full materials** | **A Keep** | Pro-depth when selected |
| Inline LD-MATERIALS-COPY / LD-TABLE-FIDELITY refs | ~600 | Point to runtime modules | **A Keep (pointer)** | Bodies in runtime embed |

### Runtime augmentation chain — `applyWorkflowStepRuntimePromptAugmentations()` (Page only)

Order applied to Design Page:

| # | Block | ~Chars (standalone) | Role | Class |
|---|-------|--------------------:|------|:-----:|
| 1 | Pedagogic cognition packs | 0–800 | Brief-driven cognition | **D** — conditional |
| 2 | `LD-SELF-DIRECTED-RHETORIC` (role `design_page`) | 3,726 | Overview/journey rhetoric; **explicit anti-summarise materials** | **A Keep** — scope correct |
| 3 | `applyLdTableFidelityContractToDraft` | **0** (Page path no-op standalone) | — | **C Bug/ gap** — preserve only via compose embed |
| 4 | `applyLdMaterialsCopyContractToDraft` | **0** (GAM-only entry) | — | **OK** — preserve via compose embed |
| 5 | PEL orientation / reasoning | 0 (workshop brief) / ~1,500 (clean brief) | Session journey on Page | **B Remove/dedupe on Page** |
| 6 | Sprint 38 visual affordance + pedagogical added-value | **6,601** | Page-root metadata only | **A Keep intent / REWRITE size** |
| 7 | `LD-DESIGN-PAGE-COMPOSE-CONTRACT` + embedded L4 | **6,208** (full compose) | Membership, field preservation, L4 embed | **A Keep** |
| 8 | `LD-MATH-RENDER` | 1,220 | TeX delimiters | **A Keep** |

**Measured totals** (`scripts/probe-38b1-design-page-prompt-size.js`, inflation workshop brief):

| Scenario | Seeded | Augmented | Runtime Δ | Auto-applied blocks |
|----------|-------:|----------:|----------:|---------------------|
| Self-directed learner page | 8,290 | **24,740** | **+16,450** | Rhetoric, Sprint 38 VA, Compose, Math |
| Generic workshop (no rhetoric) | 8,290 | **20,576** | **+12,286** | Sprint 38 VA, Compose, Math |

Embedded L4 sub-blocks inside compose: `LD-MATERIALS-COPY` preserve ~1,981; `LD-TABLE-FIDELITY` preserve ~2,781.

### Post-capture code (not prompt — context for failure)

| Module | Role | Relevance to Inflation collapse |
|--------|------|--------------------------------|
| `applyPageCompositionValidationForCapturedPage` | Cognition merge + closure validation on paste | Calls `applyPedagogicCognitionSemanticsToComposedPage` → **GAM preserve overlay** |
| `lib/page-gam-materials-preserve.js` | Overlay GAM bodies when page thins | Repairs **if** GAM capture synced + heuristics fire |
| `normalizePageWorkflowRunCapture` | JSON fence normalisation | Does not restore bodies |

---

## B. Answers to audit questions

### 1. Which Page instructions permit or encourage summarising / shortening / simplifying?

| Source | Permissive / risky text | Risk |
|--------|-------------------------|------|
| Pack `promptTemplate` | *“copy … **verbatim or near-verbatim**”* | **High** — “near-verbatim” licenses paraphrase |
| Pack `promptTemplate` | *“**shorten only clearly non-essential prose** when genuinely too long”* | **High** — explicit shorten permission on materials path |
| Pack `promptTemplate` | *“Assemble one **readable**, self-contained page”* | **Medium** — readability framing → study notes |
| Pack `promptTemplate` | *“Do not dump raw JSON structures”* | **Medium** — discourages paste-like copy |
| Pack `promptTemplate` | *“For learner profile, include … **substantive pre-activity context**”* (overview) | **Low for materials** — steers synthesis in overview sections |
| `runnerInstructions` | Same preserve + shorten clause repeated | **Medium** — reinforces shorten |
| `LD-MATERIALS-COPY` preserve | *“**Do not summarise**, thin, or replace materials bodies”* | **Anti** — correct but competes with pack shorten line |
| `LD-SELF-DIRECTED-RHETORIC` | *“never summarise **activity.materials**”* | **Anti** — correct |
| Sprint 38 VA | *“must not replace, **summarise**, or substitute for … materials”* | **Anti** — correct but **late in prompt** |

**None** of the runtime blocks tell Page to **author** teaching bodies (correct). The problem is **residual permission to shorten** in the pack plus **default LLM page-composition habit**.

### 2. Which instructions duplicate GAM material-realisation responsibility?

| Instruction | Location | Duplicates GAM? |
|-------------|----------|-----------------|
| Realise full worked examples, scenarios, templates | GAM pack GAM-PRES | **GAM owns** |
| “Include concrete scenarios, worked examples…” | Page pack MATERIALS FIDELITY | **No** — merge/preserve, not author |
| `LD-MATERIALS-COPY` preserve “Require … worked examples with visible steps” | Runtime on Page | **Borderline** — reads like author checklist but means “if upstream exists, copy it” |
| `LD-SELF-DIRECTED-RHETORIC` worked-example / fading lines | Page runtime | **Duplicate tone** — choreography language better on DLA/GAM; scope says not materials bodies |
| Reading sufficiency 150–300+ words | GAM runtime only | **Not on Page** ✓ |

Page does **not** duplicate GAM-PRES depth floors for **authoring**. It duplicates **preservation reminders** 3× (pack, compose, materials-copy embed).

### 3. Which instructions correctly belong to Page composition/preservation?

**Correct Page-owned responsibilities (KEEP):**

- Section assembly (`overview`, `learning_purpose`, `knowledge_summary`, `learning_activities`, `assessment_check`, `support_notes`)
- Activity membership `(U \ X) ⊆ C` and `activities_omitted[]` authority
- Merge `activity_materials` → `activity.materials` **verbatim**
- Preserve activity metadata fields (preamble, cognition fields, expected_output, support_note)
- `learning_sequence` for order/timing only
- Sprint 38 `visual_affordances[]` as **additive** page-root metadata
- LD-MATH-RENDER on composed page text
- Assessment item schema preservation

### 4. Which blocks explain the Inflation Page-collapse behaviour?

Mapped to user evidence:

| Evidence | Likely mechanism | Prompt/code locus |
|----------|------------------|-------------------|
| **A1 exposition → few short lines** | LLM summarised `concept_exposition` / `text` body; merge may not cover generic exposition keys | Pack shorten clause; no `concept_exposition` in `FIDELITY_CONTRACTS` |
| **A2 worked reasoning → “Demand exceeds supply → demand-pull inflation”** | One-line **synopsis replacement** of stepped worked_example | Pack “near-verbatim”; 38M `synopsis_replacement` pattern |
| **A3 formula/process → formula + result only** | Process prose stripped as “non-essential” | Pack *“shorten only clearly non-essential prose”* |
| **A4 analytic worked example → one sentence** | Same synopsis pattern for `worked_analytic_pass` | Tier-D contract exists (0.99 ratio) — merge **should** fix **if GAM capture present** on paste |
| **A5 template → “Context → Evaluation → Decision → Justification”** | **Outline label substitution** for template body | Classic `meta_replacement` / shell collapse (38M, 38O) |

**Primary explanatory stack:**

1. **Pack-permitted shortening** overrides preserve intent under token pressure.  
2. **“Readable page assembly”** task framing without **FORBIDDEN: revision-note summaries** examples.  
3. **Sprint 38 block (~27% of augmented prompt)** consumes attention at end — model optimises VA schema over L4 copy fidelity.  
4. **Post-capture merge** is a **partial backstop**, not the manual-workflow primary fix — and depends on synced GAM capture + heuristic match.

### 5. KEEP / REWRITE / REMOVE classification

| Item | Action | Rationale |
|------|--------|-----------|
| Page pack — compose task, section schema, membership | **KEEP** | Core Page role |
| Page pack — MATERIALS FIDELITY intent, placeholder forbidden list | **KEEP** | Aligns with L4 |
| Page pack — *“near-verbatim”* + shorten-non-essential clause | **REWRITE** → **strict verbatim** for all `materials.*` string bodies; shorten **only** overview/learning_purpose if ever |
| Page pack — inline LD-* contract paragraphs | **REWRITE** → one-line pointers (runtime embeds full bodies) | Dedupe (~600 chars) |
| `defaultPromptNotes` | **REWRITE** | Trim duplication of runtime + pack |
| `runnerInstructions.what_to_check` | **REWRITE** | Shorten; point to L4 modules |
| `LD-DESIGN-PAGE-COMPOSE-CONTRACT` | **KEEP** | Canonical compose owner |
| Embedded `LD-MATERIALS-COPY` / `LD-TABLE-FIDELITY` preserve | **KEEP** | Unique L4 on Page |
| `LD-SELF-DIRECTED-RHETORIC` on Page | **KEEP** (trim) | Anti-summarise materials + design_page rider; dedupe worked-example fading lines that read like GAM |
| Sprint 38 visual affordance block | **KEEP intent / REWRITE size** | Move anti-summarise line earlier or split “schema” vs “must not replace materials”; trim JSON examples |
| PEL orientation/reasoning on Page | **REMOVE** (Page) | Duplicates pack overview + DLA contract; workshop brief already off |
| `buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock` | **REMOVE or WIRE** | Dead code — never injected |
| `applyLdTableFidelityContractToDraft` Page standalone path | **REWRITE** (optional) | Currently no-op except via compose — document or inject once |
| `page-gam-materials-preserve` generic teaching keys | **REWRITE** (code, Phase 2C.1) | Add `concept_exposition`, `worked_example`, `sample_output` fidelity tiers for merge |
| GAM author instructions on Page | **REMOVE if any** | None found ✓ |

### 6. Smallest safe Phase 2C implementation (after audit)

**Phase 2C-a — Prompt only (smallest, lowest regression risk)**

1. **Pack §13 `promptTemplate`:** Replace *“verbatim or near-verbatim”* with **“verbatim (character-faithful) copy”** for all `activity.materials` values.  
2. **Remove** pack shorten clause from materials path; add **FORBIDDEN** examples matching Inflation failures:  
   - one-line worked reasoning replacing stepped example  
   - section-heading-only templates  
   - formula+result without process prose  
3. **Add one line:** *“Do not emit revision-note, crib-sheet, or bullet-summary substitutes for upstream GAM Material Content.”*  
4. **Runtime `LD-MATERIALS-COPY` preserve:** Mirror same FORBIDDEN list (1–2 lines) — single normative source.  
5. **Dedupe:** Shorten `defaultPromptNotes` + `runnerInstructions` to pointers — no second shorten permission.

**Do not change:** Episode Plan, DLA, GAM packs, population contract, workflow chaining, renderer, Sprint 38 schema fields.

**Phase 2C-b — Prompt attention (optional, same sprint if 2C-a insufficient)**

6. **Reorder augmentation:** Inject `LD-DESIGN-PAGE-COMPOSE-CONTRACT` **before** Sprint 38 VA block (compose fidelity before schema-heavy VA).  
7. **Trim Sprint 38 VA JSON examples** (~2k chars) — keep one generate example.

**Phase 2C-c — Capture backstop (code, only if manual re-run still collapses)**

8. Extend `page-gam-materials-preserve.js` merge contracts for **`concept_exposition`**, **`worked_example`**, **`sample_output`**, **`template`** with minRatio ≥0.85 and synopsis detectors for arrow-chain one-liners.  
9. Wire or delete dead `buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock`.

**Verification:** Manual Inflation LO→EP→DLA→GAM→**Page** re-run; compare A1–A5 material body length vs GAM capture; run existing `page-gam-materials-projection` / 38M parity tests; `ev-38s-production-pipeline-chase.mjs`.

---

## C. Prompt-size summary

| Layer | Chars | Share of augmented (self-directed) |
|-------|------:|-----------------------------------:|
| Pack `promptTemplate` | 8,460 | 34% |
| Pack notes (in seeded prompt) | 1,600 | 6% |
| LD-SELF-DIRECTED-RHETORIC | 3,726 | 15% |
| LD-DESIGN-PAGE-COMPOSE + L4 embed | 6,208 | 25% |
| Sprint 38 VA + pedagogical added-value | 6,601 | 27% |
| LD-MATH-RENDER | 1,220 | 5% |
| **Augmented total** | **24,740** | 100% |

Preserve-critical text (pack fidelity paragraphs + compose + L4 embed) ≈ **~15k chars (~61%)** but **anti-preserve permission** (*near-verbatim*, *shorten*) sits in the **first 8k** the model reads; Sprint 38 schema **~6.6k at tail** competes for compliance budget.

---

## D. Inflation collapse — direct behavioural explanation

```text
GAM (rich bodies) ──► Design Page Copilot prompt
                           │
                           ├─ Task frame: "readable, self-contained page"
                           ├─ Permission: "near-verbatim" + shorten non-essential
                           ├─ Strong preserve rules (but duplicated, early)
                           └─ Heavy Sprint 38 VA schema (late)
                           │
                           ▼
                    LLM emits valid page JSON
                    with compressed materials.* (study-note shape)
                           │
                           ▼
              User pastes into capture textarea
                           │
                           ├─ applyPedagogicCognitionSemanticsToComposedPage
                           └─ applyGamMaterialsToComposedPage (if GAM synced)
                                   │
                                   └─ may NOT overlay if synopsis looks "complete"
```

This matches historical **38M-1** (`synopsis_replacement`, `severe_compression` on A4) and **38O-1** (structural roles survive, bodies compressed). Episode Plan and DLA population are **not** implicated in Page body collapse once GAM is structurally sound.

---

## E. Non-problems (explicit)

- Page is **not** re-planning beats or re-authoring obligations (DLA/GAM territory).  
- GAM preserve **structure** on Inflation run (user report: GAM preserves DLA structure).  
- LD-MATERIALS-COPY **author role on GAM** — out of 2C scope.  
- Sprint 38 VA **concept** (additive metadata) — correct; size/placement is the issue.  
- Workflow chaining EP→DLA — addressed in Phase 2 PF-11 work; unrelated to Page body collapse.

---

## F. Recommended Phase 2C execution order

| Step | Deliverable | Risk |
|------|-------------|------|
| **2C-a.1** | Pack §13 rewrite shorten/near-verbatim → strict materials verbatim | Low |
| **2C-a.2** | FORBIDDEN synopsis examples (Inflation-shaped) in pack + LD-MATERIALS-COPY preserve | Low |
| **2C-a.3** | Trim `defaultPromptNotes` / runner dedupe | Low |
| **2C-b.1** | Reorder runtime augmentation (compose before VA) | Medium — test VA still emitted |
| **2C-b.2** | Trim VA JSON examples | Low |
| **2C-c.1** | Merge heuristics for generic teaching keys | Medium — code path |
| **2C-verify** | Manual Inflation Page + harness | — |

---

## Appendix — probe commands

```bash
node scripts/probe-38b1-design-page-prompt-size.js
```

Artefact reference: [38M-1 baseline page fidelity](../../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-1-baseline-page-fidelity-analysis.md) · [38O-1 role survival trace](../../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-1-baseline-role-survival-trace.md)

---

*End of Phase 2C audit — read only; no prompt or code changes made.*
