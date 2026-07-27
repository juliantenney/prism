# Sprint 70 Handover — Visual Affordance Pipeline

**Related:** [SPRINT-70-START-HERE.md](SPRINT-70-START-HERE.md) · [WHY-SPRINT-70.md](WHY-SPRINT-70.md) · [CONTEXT.md](CONTEXT.md) · [ARCHITECTURE.md](ARCHITECTURE.md)

---

## Executive summary

After Sprint 69, learner-renderer-vNext is certified and material types are canonicalised. Sprint 38 established pedagogical visual affordance semantics and renderer hook placement. The remaining gap is **workflow**: authors still rely on the external Visual Enhancement Utility (VEU) and manual file management to produce visual learner packages.

Sprint 70 brings visual job orchestration, prompt generation, asset tracking, and package assembly **into Prism** — while keeping pixel generation external.

---

## Architecture principles

1. **Pedagogical authority stays in Sprint 38 affordances.** Prism consumes `visual_affordances[]`; it does not infer visuals from topic alone.
2. **Placement authority stays in renderer hooks.** Figures insert at matched `visual_slot` + `affordance_id` locations — same contract as today.
3. **Deterministic prompts beat LLM inference for job creation.** Prompt text is composed from affordance fields, not re-derived from HTML heuristics.
4. **Linked media, not embedded bytes.** Export uses `<img src="media/...">`; base64 is deferred.
5. **Manual generation is a feature, not a gap.** External tools generate pixels; Prism tracks state and assembles output.
6. **Fail closed on affordance semantics.** Only `generate` rows become jobs; `defer` and `reject` appear in manifest ledgers only.

---

## Current state (pre-Sprint 70)

### Visual affordance architecture (Sprint 38)

| Layer | Module / doc | Role |
| ----- | ------------ | ---- |
| Compose validation | `lib/sprint38-visual-affordances.js` | Validate/normalise `visual_affordances[]`, schema `38.4` |
| Renderer plan | `lib/learner-renderer-vnext/sprint38-visual-affordance-plan.js` | Match `generate` rows to hook slots |
| Hook emission | `lib/learner-renderer-vnext/render-visual-affordance.js` | Emit `.util-visual-affordance` anchors |
| LD prompt | `app.js` Sprint 38 blocks | Author affordances at Design Page |
| Architecture doc | Sprint 38 `ARCHITECTURE.md` | End-to-end pipeline reference |

Page root keys (mandatory on compose output):

```json
{
  "visual_affordance_schema_version": "38.4",
  "activities_visual_review": [],
  "visual_affordances": []
}
```

### Current manual workflow

```text
Design Page (LD) → compose with visual_affordances[]
       ↓
Utilities → export learner HTML (hooks embedded)
       ↓
VEU Step 1 (Copilot) → scan HTML, insert <figure>, emit image_queue JSON
       ↓
VEU Step 2 (Copilot) → one PNG per queue item
       ↓
Author → rename files, place in images/ folder, verify package
```

Reference: `utilities/visual-enhancement-utility/README.md`, VEU v1.2.1 bundle.

### Desired end-state (Sprint 70)

```text
Design Page (LD) → compose with visual_affordances[]
       ↓
Prism Visual Pipeline → visual jobs + deterministic prompts
       ↓
Author → copy prompt → generate image externally (Copilot/manual)
       ↓
Prism UI → upload/replace/remove image per job
       ↓
Prism Assembler → index.html + media/ + visual manifest
       ↓
Prism Export → downloadable HTML package
```

---

## Scope

### In scope

- Visual job model and persistence (per page/workflow context)
- Deterministic prompt builder from Sprint 38 generate fields
- Filename assignment convention (stable, affordance-linked)
- Upload UI (copy prompt, upload, replace, remove)
- Figure insertion at hook locations during assembly
- Visual manifest JSON alongside export
- Package export (`index.html`, `media/`, manifest)
- Regression tests for job generation, assembly, export integrity

### Out of scope

- API image generation
- Automatic Copilot / VEU workflow integration
- Image editing, cropping, or format conversion beyond basic accept/reject
- AI image QA or pedagogical review automation
- Base64 / single-file self-contained HTML
- Provider abstraction layer
- Automatic retry / backoff for failed generations

---

## Technical approach

### Phase 1 — Job model and prompt builder

- Filter `visual_affordances[]` to `visual_decision: generate` rows passing activity gate (`activities_visual_review`).
- Emit one **visual job** per affordance with fields listed in [GOALS.md](GOALS.md).
- Build prompt text deterministically from: `purpose`, `preferred_representation`, `must_show`, `must_not_show`, `allowed_claims`, `disallowed_claims`, `representation_avoid`, `source_basis`, `caption_intent`, `anti_spoiler`, `requires_exact_data_match`, `pedagogical_added_value` (when present).
- Reuse field consumption rules from VEU v1.2.1 spec (`scripts/build-veu-v121-json.js`, Sprint 38-5 alignment doc) — extract to shared module, do not call LLM.

Suggested module: `lib/visual-affordance-pipeline/build-visual-prompt.js`

### Phase 2 — Filename convention

- Assign deterministic filenames: e.g. `{affordance_id-sanitized}.png` or `{activity_id}-{slot-token}.png` — pick one convention and document in DECISIONS.
- Store expected filename on job record; reject uploads with wrong extension only if policy requires (prefer rename-on-assign).

### Phase 3 — Asset storage and UI

- Prism UI panel (Utilities or dedicated Visual tab) listing jobs for current page.
- Actions: copy prompt, upload file, replace, remove, status indicator (`pending` | `uploaded` | `removed`).
- Store uploaded binary in workflow/page-scoped storage (local filesystem or existing PRISM asset pattern — see open questions).

### Phase 4 — Package assembly

- Start from rendered learner HTML (existing vNext export path).
- For each job with uploaded asset: replace hook with `<figure class="util-figure util-figure--pedagogic">` + `<img src="media/{filename}">` + `<figcaption>` from `caption_intent`.
- Copy uploaded files into `media/` folder in export bundle.
- Emit `visual-manifest.json`: jobs, statuses, ledgers for defer/reject.

Suggested module: `lib/visual-affordance-pipeline/assemble-visual-package.js`

### Phase 5 — Export

- Zip or folder download: `index.html`, `media/*`, `visual-manifest.json`.
- Validate all `generate` jobs either have uploaded assets or are explicitly marked skipped (policy TBD — default: block export if required job missing asset).

---

## Acceptance criteria

1. Given a page with N approved `generate` affordances, Prism creates exactly N visual jobs.
2. Each job includes all required fields (`affordance_id`, `activity_id`, `filename`, `prompt`, `caption`, `alt`, `visual_status`).
3. Prompt text is deterministic: same affordance input → same prompt (no LLM in job creation).
4. UI supports copy prompt, upload, replace, remove for each job.
5. Uploaded image is stored and associated with the correct affordance and filename.
6. Exported package contains valid `index.html` with `<img src="media/...">` references.
7. Exported package contains `media/` with all uploaded assets at expected paths.
8. Exported package contains `visual-manifest.json` documenting jobs and defer/reject ledgers.
9. `defer` and `reject` affordances do not produce jobs or figures.
10. Learner-renderer-vNext certification suite remains green (no renderer regression).
11. No base64 image embedding in export.

---

## Sprint 70 Definition of Done

- [ ] Visual job model implemented and tested.
- [ ] Deterministic prompt builder covers Sprint 38 generate field set.
- [ ] UI supports copy prompt, upload, replace, remove per job.
- [ ] Assets stored with auto-assigned filenames.
- [ ] Package assembler produces `index.html` + `media/` + visual manifest.
- [ ] Export downloads complete HTML package.
- [ ] Defer/reject affordances excluded from jobs and figures.
- [ ] Regression tests for pipeline phases pass.
- [ ] Documentation updated (ARCHITECTURE, DECISIONS, closeout-ready STATUS).
- [ ] Explicit non-goals remain unimplemented (no API gen, no base64).

---

## Risks

See [RISKS.md](RISKS.md).

---

## Open questions

See [DECISIONS.md](DECISIONS.md) — open items marked TBD.

---

## Future work (post-Sprint 70)

- API image generation with provider abstraction
- Copilot/VEU workflow deprecation or thin-wrapper mode
- AI image QA against `must_show` / `must_not_show`
- Base64 / single-file export option (if ever required)
- Batch generation and retry policies
- Image editing (crop, format normalisation)

---

## Navigation

| Document | Purpose |
| --- | --- |
| [CONTEXT.md](CONTEXT.md) | Engineering context for new sessions |
| [PLAN.md](PLAN.md) | Phased roadmap |
| [TASKS.md](TASKS.md) | Task breakdown + suggested commits |
| [TESTING.md](TESTING.md) | Test strategy |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Pipeline architecture detail |
