# Sprint 72 — Final Report

**Sprint:** 72 — Productising the Instructional Architecture Validated in Sprint 71  
**Opened:** 2026-07-31  
**Closed:** 2026-08-05  
**Status:** **COMPLETE / CLOSED**  
**Predecessor:** Sprint 71 — Closed ([Final Report](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/SPRINT-71-FINAL-REPORT.md) — link only; evidence not rewritten)  
**Successor:** Sprint 73 not opened — [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md) · [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md)  
**Closure companion:** [SPRINT-72-CLOSURE.md](SPRINT-72-CLOSURE.md)  
**Top-level closeout:** [docs/sprints/sprint-72-closeout.md](../../../sprints/sprint-72-closeout.md)

---

## Original objective

Productise the instructional architecture validated in Sprint 71 so Prism produces evidence-centred learning activities from sparse briefs **without** a new pipeline stage, new page type, or complex evidence spine (`S72-D11`).

Governing principle: **“Make activities use evidence for reasoning.”**

---

## What Sprint 72 delivered

### Platform / generation contracts

- Activity-level `evidence_decision` and evidence requirements.
- Evidence-provider versus response-scaffold separation.
- Separate-provider and combined evidence/workspace patterns.
- Simulated evidence with honest provenance (`system_generated_simulation`).
- Source-bound evidence via Copilot `conversation_attachment`, including source inventory, attribution, and source-native diagnostics.
- Delayed-answer-disclosure protection.
- Intellectual-coherence bridges on every activity (A1 vs A2+ semantics).

### Diagnostic feedback (bounded slice)

- Diagnostic guided review (before focal sample output where applicable).

### Learner-page / product UX (bounded slice)

- Orientation-to-Activity-1 divider.
- Improved table sizing and wrapping.
- Distinct Transfer after Check.
- Normal body-text activity preambles.
- Section-specific structured-template prompts.
- Activity 1 Do/workspace composition corrections.
- Public-export-path / browser-bundle parity corrections (Node module tests ≠ public export path).

### Workflow run UX

- Copilot unnecessary follow-up suppression (pipeline bookend directives).
- User-facing DLA optional-evidence guidance (informational run-summary).

### Indicative validation evidence

| Resource path | Approx. score | Notes |
| ------------- | ------------- | ----- |
| RNA / HCV evidence-centred | ~93/100 | System-generated evidence sufficiency |
| Heteroscedasticity | ~92/100 | Separate provider + scaffold patterns |
| Owen source-bound | ~92/100 | Conversation-attachment / attributed excerpts |

Dedicated final cross-disciplinary verification sweep was **not** executed as a formal close gate. Ongoing content generation is the continuous verification strategy (`S72-D14`).

---

## Architectural and implementation outcomes

1. **Evidence-Centred Learning** operates as a first-class umbrella with activity-level selective evidence use (`S72-D04`, `S72-D12`).  
2. **`S71-F-001` dual routing** preserved (`S72-D08`): platform sufficiency first; elicitation for genuine gaps; author supply when generation is inappropriate.  
3. **Conversation-bound source use is proven** without claiming byte-level attachment storage (`S72-D10`).  
4. **No new pipeline stage / page type** required for the shipped slice (`S72-D11`).  
5. **Browser-bundle / public-export parity lesson:** lower-level Node module tests can pass while the public export path (`window.PRISM_LEARNER_RENDERER_VNEXT`) remains stale — always validate the path learners actually use.  
6. **Shared asset-persistence model** decided for future work (`S72-D09`) but **not implemented** in Sprint 72.  
7. **Maturation-phase backlog model** established: canonical [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) with Stabilisation · Future architecture · Research · Ideas (`S72-D15`).

---

## Committed vs uncommitted vs experiments

| Kind | Status at close |
| ---- | --------------- |
| Evidence-centred DLA/GAM contracts; guided-review; many learner-page composition fixes | Present in repository history (see git log for Sprint 72 feature commits) |
| Late slice: pipeline follow-up suppression (`S72-T-075`); DLA evidence guidance (`S72-T-076`); related domain-pack / `app.js` / test wiring; closure docs | May remain in **working tree** pending operator commit — operational follow-up |
| Raise-the-ceiling experiment; full elicitation UX; byte storage | **Not shipped** — product backlog / research |

---

## Test posture (accurate)

| Suite | Result |
| ----- | ------ |
| Focused bridge correction | Reported **73/73** passing |
| Focused presentation refinement | Reported **118/118** passing |
| Pipeline follow-up suppression | **4/4** focused |
| DLA evidence guidance UX | **5/5** focused |
| Broader `sprint-72-evidence-centred-activity-slice.test.js` | **Not green** — **28 known pre-existing failures** (`intellectual_coherence_bridge` fixtures) |
| Public-export-path regressions | Added/used for A1 Do parity — distinct from Node-only composer tests |

**Do not claim the complete evidence-centred suite is green.**

---

## Known boundaries (explicit)

- Attachment **byte** ingestion / persistence / fidelity → backlog **PB-FA-001**.  
- Programming / code first-class support → **PB-FA-002**.  
- Schema currency / render-closure / renderer contracts → **PB-FA-003**.  
- Case-study pages, image-style programmes, specialist renderers, richer evidence viz → **Product ideas** only.  
- Sprint 73 **not** assigned to any feature in this report.

---

## What moved out of Sprint 72

See [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) and historical cut-line [SPRINT-72-BACKLOG-RATIONALISATION.md](SPRINT-72-BACKLOG-RATIONALISATION.md). Sprint 72 is closed as **complete against its primary objective**, not as a partial delivery of the entire original roadmap.

---

## Continuous verification (`S72-D14`)

If a regression is observed during ongoing content generation: **stop**, fix the owning layer, and add focused regression coverage. Do not reopen Sprint 72.

---

## Links

- [SPRINT-72-CLOSURE.md](SPRINT-72-CLOSURE.md)  
- [decisions.md](decisions.md)  
- [findings-traceability.md](findings-traceability.md)  
- Sprint 71 Final Report (evidence authority)  
