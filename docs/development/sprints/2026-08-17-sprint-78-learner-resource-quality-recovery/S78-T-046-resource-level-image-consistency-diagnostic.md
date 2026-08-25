# S78-T-046 — Resource-level image consistency diagnostic

**Task:** S78-T-046  
**Status:** **DIAGNOSTIC COMPLETE** (2026-08-25)  
**Mode:** DIAGNOSTIC ONLY — **no production code changes**  
**Sprint 78:** OPEN · **T-013:** remains OPEN  

**Related:** [S78-T-045](S78-T-045-image-instructional-fidelity-diagnostic.md) — instructional **claim** fidelity (separate concern).  
**Parked:** learner-workspace / interactivity redesign.

---

## Distinction (keep separate)

| Concern | Question | Owner of substance |
| ------- | -------- | ------------------ |
| **Instructional fidelity** (T-045) | What concepts, claims, relationships may appear? | Design Page affordance fields (`must_show`, claims, evidence) |
| **Visual consistency** (this task) | What visual language realises those authorised claims? | Presentation / prompt assembly (today: largely **absent** → image-model discretion) |

Do **not** weaken claim boundaries to chase visual family resemblance.

---

## 1. Current style-information path

```text
Design Page
  → visual_affordance_schema_version
  → activities_visual_review[]
  → visual_affordances[]          ← per-affordance instructional commission ONLY
Assemble
  → copies DP visual fields onto page
Utilities / Graphics
  → planPrismVisualJobs(page)     ← one independent job per generate affordance
  → compilePrismImageBriefs(...)  ← structural representation templates (not art style)
  → buildVisualJobHumanPrompt(brief)  ← LIVE operator copy path
Image model (external)
  → bytes (no reference to sibling jobs / prior images)
```

**No page-level or resource-level visual-style object is read or injected today.**

---

## 2. Existing style fields / contracts

### Per-affordance (instructional + structural — not artistic)

Generate rows require (among others): `purpose`, `preferred_representation`, `subject`, `context`, `must_show` / `must_not_show`, `allowed_claims` / `disallowed_claims`, `representation_avoid`, spoiler fields, `caption_intent`, alt/`detailed_description`, discipline notes.

`detailed_description` guidance explicitly: **do not invent style/camera language**.

### Assembler constants (shared, deterministic, **pedagogical** — not house art style)

| Constant / block | Role |
| ---------------- | ---- |
| `MODALITY_OPENING` / `MODALITY_CLOSING` | Force rendered image, forbid text scaffolds |
| `EXPLANATORY_VISUAL_PREFERENCES` | Soft menu of diagram kinds |
| `WORKSHEET_STYLE_DISALLOWED` | Forbid worksheets / fill-ins / quizzes on image |
| `HUMAN_REPRESENTATION_GUIDANCE` | **Structural** prefer/avoid per representation token |
| `REPRESENTATION_TEMPLATES` (canonical brief) | Same: layout/information structure only |
| `buildTextDensityLines` | Noun-phrase labels; denser for a few reps |
| Educational mode lines | Activity scaffold vs knowledge synthesis |
| Concept boundary | **Activity only** (T-045 fidelity issue) |

Code comments are explicit:

- Human guidance: *“Pedagogical/structural only — no artistic style presets.”*
- Canonical templates: *“Provider-neutral structural guidance only (information layout, not artistic style).”*

### Page-level visual planning SSOT candidates

| Object | Style SSOT? |
| ------ | ----------- |
| `visual_affordance_schema_version` | Version string only |
| `activities_visual_review[]` | Per-activity generate/defer/skip + rationale |
| `visual_affordances[]` | Per-image instructional commission |
| `page_synthesis.*` | Learner prose / closure — **not** visual style |

**Verdict:** No existing page-level object can serve as a shared **visual style** contract without either (a) injecting a **deterministic PRISM presentation constant** at prompt assembly, or (b) adding a new field. Prefer (a) for v1.

---

## 3. Hydrology cross-image prompt comparison

Specimen: T-045 artefacts (`artefacts/hydrology-va-*-operator-human-prompt.txt`, `hydrology-compiled-prompts-preview.json`).

| Affordance | Representation | Mode |
| ---------- | -------------- | ---- |
| `va-A1-system-01` | Annotated System | activity + Concept boundary + pre_classification |
| `va-A3-basin-system-01` | Annotated System | activity + Concept boundary + pre_classification |
| `va-A4-balance-01` | Causal Model | activity + Concept boundary |
| `va-A5-causal-chain-01` | Causal Chain | activity + Concept boundary + pre_classification |
| `va-page-knowledge-summary-01` | Concept Map | **knowledge_synthesis** · **no** Concept boundary |

### Classification of prompt properties

| Dimension | Class | Notes |
| --------- | ----- | ----- |
| Opening / closing modality | **A** common | Identical across all jobs |
| Preferred visual output list | **A** common | Same eight bullet types every time |
| Worksheet / prose / ASCII avoids | **A** common | Shared disallow lists |
| Text & labels (2–6 word noun phrases) | **A** common | Same density rules (none of Hydrology reps are “higher density”) |
| Visual structure Prefer/Avoid | **B** representation-specific | Annotated System vs Causal Model vs Causal Chain vs Concept Map — **by design** |
| Educational mode / audience | **B** mode-specific | Activity scaffold vs synthesis consolidate — **by design** |
| Concept boundary | **C** inconsistent by mode | Present on activities; absent on synthesis (fidelity concern, not style) |
| Subject / context / Show / claims | Per-job instructional | Not style |
| Realism vs schematic | **D** model-discretionary | **Never named** in prompts |
| Dimensionality / perspective | **D** | Never named |
| Palette / line treatment / typography | **D** | Never named |
| Arrow/callout art conventions | **D** (beyond “use arrows”) | Structural only |
| Background treatment | **D** | Never named |
| “Same instructional resource” family cue | **D** | **Absent** |

### Observed pixel family (operator deposit — informal)

| Figure | Realised character |
| ----- | ------------------ |
| A1, A3 | Rich **3D isometric landscape** realism |
| A4 | Flat **2-panel schematic** diagram |
| A5 | Flat **modern scaffold** with empty dashed boxes |
| Synthesis | **Hybrid**: 3D landscape core + 2D icon panels |

Operator report: images usually “reasonably consistent” even when generated independently — matches soft educational-illustration priors in the model, **not** an authored PRISM style contract. Hydrology still shows **representation-driven and model-driven drift** (landscape vs flat diagram) without a family cue.

---

## 4. What is already consistent

Across independently compiled jobs for the **same** page:

1. Identical modality framing (rendered educational image).
2. Identical soft “explanatory diagram” preference list.
3. Identical worksheet / text-scaffold bans.
4. Identical short-label typography **policy** (noun phrases).
5. Deterministic representation structure text for the same `preferred_representation` token (A1 and A3 share Annotated System guidance verbatim).

Jobs do **not** currently share: palette, realism level, perspective, icon set, background, or an explicit “same resource” instruction.

---

## 5. What is currently model-discretionary

Almost all **visual-family** dimensions:

- educational vs commercial-infographic finish  
- flat/schematic vs photoreal / 3D isometric  
- palette character  
- typeface / label chip styling  
- arrow weight / callout chrome  
- background atmosphere (sky gradients, terrain texture, UI chrome)  
- iconographic vs labelled-landscape treatment  

Representation templates constrain **information layout**, not these.

---

## 6. Appropriate resource-level invariants (recommended)

Inject once per resource (identical string in every job prompt). Keep **short** and **presentation-policy**, not subject inventiveness:

- Restrained university-level **educational illustration** (not poster / marketing infographic).  
- Prefer **coherent schematic/diagrammatic treatment** over photoreal photography; landscape vignettes only when the representation truly needs spatial geography.  
- **Same visual family** across figures for this learner resource (shared annotation character, arrow/callout conventions, label treatment, restrained palette).  
- Uncluttered backgrounds; avoid decorative chrome that competes with labels.  
- Do **not** force identical compositions across representation types.

Wording should be authored as a PRISM constant (review against existing EXPLANATORY / WORKSHEET conventions) — do **not** paste the investigation’s illustrative bullet list blindly into production.

---

## 7. Representation-specific properties that must remain flexible

| Keep flexible | Why |
| ------------- | --- |
| Overall composition / layout grammar | Annotated system ≠ concept map ≠ causal chain |
| Panel count / hierarchy | Purpose-driven |
| Whether a landscape cross-section appears | Needed for some annotated systems; harmful for many causal models |
| Arrow **semantics** (transfer vs causal) | Instructional |
| Label placement density (within noun-phrase policy) | Some reps allow slightly denser labels |
| Activity vs synthesis **pedagogical** mode | Scaffold vs consolidate — not art style |

---

## 8. Recommended owner of shared visual style

| Option | Verdict |
| ------ | ------- |
| Design Page authors a full style brief per page | **No for v1** — expands DP surface; drifts from instructional ownership; GPT would invent styles per resource |
| Image model invents a unique style per resource | **Status quo** — works “reasonably”; not harden-able |
| **PRISM stable house educational visual language** (deterministic prompt assembly) | **Yes — primary** |
| Hybrid: house style + small DP adaptations | **Optional later** if a subject truly needs a documented exception; not required for Hydrology-class pages |

**Owner:** PRISM presentation / Graphics prompt assembly (`buildVisualJobHumanPrompt`, optionally mirrored lightly in canonical `generation_instruction`).  
**Not** GAM. **Not** the image model as SSOT. **Not** T-045 claim fields.

---

## 9. Schema change needed?

**No for v1.** Inject a frozen house-style block into every human prompt (and optionally canonical brief section) using information already available (page id is irrelevant; policy is global).

Schema field (`page.visual_style_contract` or similar) only if later product needs per-resource overrides — avoid until proven.

---

## 10. Parallel generation

**Confirmed possible and unchanged.**

- `planPrismVisualJobs` builds **independent** jobs from affordances.  
- No job references another job’s image bytes or prompt.  
- Parallel / out-of-order operator generation is already the architecture.  
- A shared **textual** style contract does **not** require reference images, chaining, or serialisation.

---

## 11. Proposed prompt architecture (design only)

```text
buildVisualJobHumanPrompt(brief):
  MODALITY_OPENING
  … existing instructional sections (goal, mode, representation, show, claims) …
  NEW: "Resource visual language:" + HOUSE_STYLE_LINES   ← identical for all jobs
  … caption / closing …
```

Rules:

1. Style block is **constant** across jobs on a page (and preferably product-wide).  
2. Style block must **not** restate `must_show` / claims (no fidelity leakage).  
3. Representation guidance remains the place for layout differences.  
4. Activity vs synthesis mode differences remain pedagogical, not artistic.  
5. Optional: one line “Match the visual family of other figures for this learner resource” without requiring those figures as inputs.

---

## 12. Proposed regression strategy

**Textual (automated):**

1. Compile all briefs for a multi-affordance fixture page.  
2. Assert the house-style section string is **byte-identical** across jobs.  
3. Snapshot human prompts: style block present; claim/must_show sections still differ per job.  
4. Assert style block does **not** appear inside claim discipline / must_show (ownership hygiene).

**Operator (manual, cheap):**

5. Checklist: figures read as one resource family **without** requiring identical composition.  
6. Hydrology-class smoke: annotated systems may share landscape grammar; causal model may stay flat — but label/arrow/palette character should still cohere.

**Do not** unit-test pixel art equality or SSIM across representations.

---

## 13. Recommendation vs T-045 fidelity hardening → **B**

| Option | Meaning | Decision |
| ------ | ------- | -------- |
| A | Combine with forthcoming T-045 instructional-fidelity implementation | **Reject** — same prompt file, different ownership (claims vs visual language); combined regression would blur failure modes |
| **B** | Separate small implementation task | **Prefer** |
| C | Defer beyond Sprint 78 | Acceptable if capacity is tight; **not** required to wait — cheap and independent |

**Rationale:** T-045 hardens *what may be claimed*; T-046 hardens *how authorised content is rendered*. Combining would make ownership and A–D claim reasoning less clear. Both can touch `utilities-visual-jobs-workspace.js`, but ship as **separate tasks/PRs**.

Priority relative to T-045: **T-045 fidelity first** (observed QA defect). T-046 consistency is **hardening of a soft strength**, not repair of a major defect.

---

## 14. Files inspected

- `lib/utilities-visual-jobs-workspace.js` (`HUMAN_REPRESENTATION_GUIDANCE`, `buildVisualJobHumanPrompt`, modes, worksheet bans)  
- `lib/prism-image-brief-compiler.js` (`REPRESENTATION_TEMPLATES`, “not artistic style”)  
- `lib/prism-visual-jobs-planner.js` (independent jobs)  
- `lib/visual-planning-contract.js` (page visual planning objects)  
- `lib/ld-design-page-partial-contract.js` (generate field requirements)  
- T-045 Hydrology artefacts: `artefacts/hydrology-visual-affordances.json`, `hydrology-compiled-prompts-preview.json`, operator human prompts A1–A5 + synthesis  
- [S78-T-045](S78-T-045-image-instructional-fidelity-diagnostic.md)

---

## 15. Files changed (docs only)

- This record: `S78-T-046-resource-level-image-consistency-diagnostic.md`  
- Minimal sprint navigation: STATUS, HANDOVER, PLAN (if listed), SPRINT-78-START-HERE, next-chat-briefing  

**Production code:** unchanged.

---

## 16. Risks

- Over-specifying style could flatten useful representation diversity (e.g. banning all landscape vignettes).  
- House-style wording that mentions “systems” or “basins” could accidentally become instructional content — keep style **domain-agnostic**.  
- Operators copying incomplete prompts still bypass assembler improvements.  
- Soft model priors already give partial consistency; measuring “improvement” needs operator checklist, not automated pixels.  
- Do not conflate with T-045 claim inventions (atmospheric inputs, etc.).

---

## 17. Sprint state

**Sprint 78:** OPEN  
**T-013:** OPEN  
**T-045:** diagnostic complete; fidelity hardening still **not implemented**  
**T-046:** diagnostic complete; consistency hardening **not implemented** (recommend separate follow-on, after or beside T-045 impl)  
**Learner-workspace/interactivity:** PARKED  

---

## Investigation answers (checklist)

1. **Style fields today:** structural representation guidance + pedagogical mode; **no** artistic style fields.  
2. **Page/resource-level style decision:** **None** — every affordance/job describes instructional content independently; assembler adds shared pedagogical constants only.  
3. **Repeated style-ish instructions:** modality, explanatory preferences, worksheet bans, label density.  
4. **Identical shared style language across same-page jobs:** pedagogical constants yes; artistic family **no**.  
5. **Representation templates → drift:** intentional **structural** drift; also invites different compositions that models often paint with different art styles.  
6. **Activity vs synthesis modes → drift:** pedagogical (scaffold vs consolidate); not art style — but synthesis often denser multi-panel, which models render differently.  
7. **Parallel generation:** architectural independence already; parallel changes nothing.  
8. **Existing SSOT for style without schema:** **No** page object; use **deterministic PRISM house-style injection** at prompt assembly.
