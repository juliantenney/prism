# Sprint 70 Context (Primary onboarding document)

**Related:** [SPRINT-70-START-HERE.md](SPRINT-70-START-HERE.md) · [WHY-SPRINT-70.md](WHY-SPRINT-70.md) · [HANDOVER.md](HANDOVER.md) · [ARCHITECTURE.md](ARCHITECTURE.md)

---

## Why this sprint exists

Sprint 38 fixed **pedagogical visual authority** (what to generate, where, with what constraints). Authors still run a **manual multi-tool workflow** via the Visual Enhancement Utility (VEU) to turn affordances into shipped packages. Sprint 70 moves job creation, prompts, asset tracking, and assembly **into Prism** while keeping pixel generation external.

See [WHY-SPRINT-70.md](WHY-SPRINT-70.md).

---

## Current visual affordance architecture

```text
Design Page (LD prompt blocks)
       ↓
Compose — lib/sprint38-visual-affordances.js
       ↓ validate/normalise visual_affordances[], schema 38.4
Page JSON — activities_visual_review[], visual_affordances[]
       ↓
Renderer — sprint38-visual-affordance-plan.js + render-visual-affordance.js
       ↓ hooks for visual_decision: generate + matching visual_slot
Learner HTML — .util-visual-affordance[data-affordance-id][data-visual-slot]
       ↓
(Today) VEU v1.2.1 external workflow
       ↓
Enhanced HTML + image_queue + manual images/
```

**Authoritative Sprint 38 doc:**  
`docs/development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/ARCHITECTURE.md`

**Key runtime modules:**

| Module | Path |
| ------ | ---- |
| Affordance validation | `lib/sprint38-visual-affordances.js` |
| Browser global | `window.PRISM_SPRINT38_VISUAL_AFFORDANCES` |
| Renderer plan | `lib/learner-renderer-vnext/sprint38-visual-affordance-plan.js` |
| Hook HTML | `lib/learner-renderer-vnext/render-visual-affordance.js` |
| Placements | `lib/learner-renderer-vnext/build-visual-affordance-placements.js` |
| Warrant heuristics (legacy) | `lib/learner-renderer-vnext/visual-affordance-warrants.js` |

**Visual decisions:**

| `visual_decision` | Renderer | Sprint 70 pipeline |
| ----------------- | -------- | ------------------ |
| `generate` | Hook at matched slot | **Visual job created** |
| `defer` | No hook | Ledger only in manifest |
| `reject` | No hook | Ledger only in manifest |

---

## Current manual workflow (pain points)

1. Export HTML from Prism Utilities — hooks present but no figures.
2. Attach compose JSON separately to VEU Step 1.
3. Copilot/LLM scans HTML, decides figures, composes prompts (non-deterministic).
4. Download enhanced HTML + `image_queue` JSON.
5. Run VEU Step 2 once per queue item — one PNG per Copilot session.
6. Manually rename files to match checklist.
7. Manually verify `images/` folder beside HTML.

**VEU reference:** `utilities/visual-enhancement-utility/visual-enhancement-utility-v1.2.1.json`  
**VEU README:** `utilities/visual-enhancement-utility/README.md`

Pain points Sprint 70 addresses:

- split tooling (Prism vs Copilot vs file manager);
- non-deterministic prompt composition in Step 1;
- no in-app asset tracking;
- no single export action for complete package.

---

## Desired end-state

Prism owns the full orchestration loop:

```text
visual_affordances[] (approved generate rows)
       ↓
Visual jobs (deterministic prompts + filenames)
       ↓
Author UI (copy prompt → external generation → upload)
       ↓
Assembler (figure insert at hooks, media/ copy)
       ↓
Export (index.html + media/ + visual-manifest.json)
```

Image generation remains **external** — Copilot, designer tools, or any manual process.

---

## Rationale: keep generation manual (Sprint 70)

- Proves pipeline architecture without API cost/compliance coupling.
- Authors already have Copilot workflows; Sprint 70 improves handoff, not replacement.
- Deterministic prompt builder can be validated independently of image quality.
- API integration is a separate sprint with provider abstraction, retries, and QA.

---

## Rationale: postpone API integration

- Provider landscape changes frequently; premature abstraction adds scope without validating assembly.
- Sprint 70 deliverables do not require pixels — only job state and package integrity.
- VEU Step 2 behaviour (one image per run) maps cleanly to manual upload per job.

---

## Rationale: postpone base64 / self-contained HTML

- Learner renderer and VEU already standardise on linked `<img src="media/...">`.
- Base64 inflates size, complicates caching, and hides asset provenance.
- Folder export (`index.html` + `media/`) is the correct LMS/VLE delivery shape.
- Self-contained export can be a future opt-in if a specific deployment requires it.

---

## Predecessor state (Sprint 69)

- Learner-renderer-vNext: **CERTIFIED**
- Material canonicalisation audit: **complete**
- Unsupported material types: 3 intentional (`table`, `video`, `worksheet`)
- Closeout: [sprint-69-closeout.md](../../../sprints/sprint-69-closeout.md)

Sprint 70 must not regress certification or Sprint 38 affordance contracts.

---

## Expected implementation order

1. Visual job model + prompt builder (lib)
2. Filename convention (decision + lib)
3. Job list UI shell (app.js)
4. Upload/storage wiring
5. Package assembler
6. Export action
7. Regression tests + documentation

Details: [PLAN.md](PLAN.md) · [TASKS.md](TASKS.md)

---

## Important files to read before coding

- `lib/sprint38-visual-affordances.js` — affordance validation, handover mode detection
- `lib/learner-renderer-vnext/sprint38-visual-affordance-plan.js` — slot matching
- `scripts/build-veu-v121-json.js` — prompt composition reference (VEU patch)
- `utilities/visual-enhancement-utility/README.md` — current Step 1/2 behaviour
- Sprint 38-5 alignment: `observations/38-5-workflow-alignment.md`
- `tests/sprint-38-veu-v121.test.js` — VEU contract tests (reference, not Sprint 70 scope)

---

## Open questions (resolve in Phase 1)

1. Asset storage location — workflow runstate vs page-scoped blob store?
2. Filename convention — affordance-id-based vs sequential VO{n}?
3. Export format — folder download vs zip?
4. Block export when required job missing asset, or allow partial export with manifest flag?

Track in [DECISIONS.md](DECISIONS.md).
