# Sprint 68 — Investigation Log

Active investigation notes. Move settled items to [findings-log.md](findings-log.md).

---

## INV-001 — Activity-to-activity bridging (S68-BL-001)

**Status:** Open — first implementation task  
**Opened:** 2026-07-21  
**Fixture:** `tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json`

### Observation

Rendered heteroscedasticity vNext export shows **only one** intellectual coherence bridge. It appears **inside Activity 5** (Comparing Detection and Remedy Approaches), within the first beat, rather than as a visible transition between consecutive activity articles.

### Known authoritative data (initial)

| Field | Fixture presence | Model path | Current render location |
| ----- | ---------------- | ---------- | ----------------------- |
| `activity_preamble` | A1–A5 each | `activity.preamble` | Activity framing (`util-activity-preamble`) at start of each activity |
| `reasoning_orientation` | Some activities | beat / activity guidance | `util-pedagogical-guidance--reasoning-orientation` |
| `intellectual_coherence_bridge` | **A5 only** (line ~598) | A5 orientation beat `prompts[]` | Inside A5 beat stream as labelled prompt (“Connect your learning”) |
| `progression_guidance` | Page orientation | page model header/orientation | Orient section |

### Questions to answer

1. Does the JSON contain bridge fields on A2–A4 that the model builder drops?
2. Is the A5 bridge authored for **within-activity** coherence (capstone recap) rather than **inter-activity** transition?
3. Should `activity_preamble` on A2–A5 partially serve as the “bridge from previous activity”?
4. Is there a render slot between `<article class="util-activity">` elements that should consume a model field?
5. Do other fixtures (RNA-HCV, inflation workshop) contain multiple bridges — indicating data vs render gap?

### Code paths to inspect (next task)

| Layer | File |
| ----- | ---- |
| Model build | `lib/learner-renderer-vnext/build-activity-model.js`, `build-beat-model.js` |
| Prompt fields | `lib/learner-renderer-vnext/archetype-rules.js`, `prompt-labels.js` |
| Beat sequence | `lib/learner-renderer-vnext/build-beat-content-sequence.js` |
| Activity render | `lib/learner-renderer-vnext/render-activity.js`, `render-beat.js` |
| Page render | `lib/learner-renderer-vnext/render-page.js` |

### Hypotheses (unverified)

- **H1:** Bridge data genuinely exists only once in heteroscedasticity JSON; “missing bridges” is a schema/pipeline gap for later sprint.
- **H2:** Bridge data exists but is stored on the **following** activity when it should render at the **end** of the preceding activity or in a between-activity slot.
- **H3:** Preambles are the intended inter-activity transitions; bridges are capstone-only; learner experience gap is presentation not missing text.
- **H4:** Bridges are suppressed by beat sequence rules or empty-beat omission.

### Exit criteria for INV-001

- [ ] JSON → model → HTML trace for all transition-like fields
- [ ] Comparison with at least one additional fixture
- [ ] Written recommendation: render-only fix vs schema gap
- [ ] Backlog update for S68-BL-003 or S68-BL-009

---

## Template for new investigations

```markdown
## INV-00N — Title (S68-BL-00N)
**Status:** Open | Closed
**Opened:** YYYY-MM-DD
### Observation
### Questions
### Exit criteria
```
