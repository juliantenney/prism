# Sprint 68 — Renderer Constraints

The renderer renders; the pipeline authors. Coherence work must not invent pedagogical content absent from the lesson model.

Surfaces **not** to change during Sprint 68 unless a coherence fix is blocked and a minimal exception is logged in the decision log.

---

## Frozen

| Surface | Location | Reason |
| ------- | -------- | ------ |
| Export shell CSS | `app.js` → `getUtilityVnextProseMeasureCss` | Sprint 67.10 closed |
| Header / nav structure | `utilityRenderVnextLearningStickyHeaderHtml`, journey nav | Sticky behaviour validated |
| Journey progress script | `utilityBuildLearningJourneyNavScript` | Sprint 67 validated |
| Semantic icon registry | `learner-icon-registry.js` | Sprint 67 M8 complete |
| Browser bundle registration | `index.html`, UMD build | Production path stable |
| Page width tokens | `--learner-navigation-width`, `--learner-reading-width` | Layout contract |

## Allowed (expected coherence work)

| Surface | Location |
| ------- | -------- |
| Activity framing | `render-activity.js` |
| Beat prompt placement | `render-beat.js`, `build-beat-content-sequence.js` |
| Page activity sequence wrapper | `render-page.js` |
| Model field mapping | `build-activity-model.js`, `build-beat-model.js` |
| Prompt labels | `prompt-labels.js` |
| Inter-activity markup (new slot) | Only if investigation proves need and uses existing fields |

## Requires explicit decision

- New top-level page model fields
- New JSON schema fields
- Changes to export shell or global CSS
- Legacy renderer modifications
