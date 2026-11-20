# Sprint 101E — Progressive interaction design for Practice

**Status:** Implemented (prompt-contract only) — **101E not closed**  
**Date:** 2026-11-19  
**Scope:** Practice-owned instructional prompts for interaction selection / sequencing  
**Out of scope:** Regenerating C2; new interaction widgets; Interactive contract changes; Lagrange exemplar edits; commit/push

---

## Objective

Encourage Practice activities to progress from lower-friction participation toward more independent intellectual work, using **existing** learner surfaces imaginatively, while minimising **unnecessary typing** (not thinking).

---

## Where interaction design is determined

| Stage | Role |
| ----- | ---- |
| **Episode Plan** | Coarse progression of demand across the Practice stop(s). |
| **Design Learning Activities (DLA)** | **Primary:** commissions response surfaces (`required_materials`, `response_fulfilment`, `response_fields` / `input_modality`, table family, checklist/`diagnostic_review`, ordering). |
| **Generate Activity Materials (GAM)** | Authors bodies that honour DLA surfaces (blank table cells, `**Label:**` templates, math modality, reveal-after models). |
| **Construct Learning Sequence** | Sequencing metadata; lightly prefer rising demand when multiple activities exist. |
| **Design Page** | Presentation / VA only — **does not** redesign interaction surfaces. |

Shared Interactive DLA/GAM enrichment contracts remain the schema authority. Practice adds a **Practice-route overlay** only (`promptRoute: "practice"`).

---

## Design decisions

1. **Heuristic, not template** — Illustrative recognise→apply→construct→synthesise→review progression; match controls to intellectual operations; no mandatory five-stage sequence.
2. **Grounded repertoire only** — Documented supported surfaces: `table_entry` (short textarea cells), templates with text|math fields, ordering/sequencing/ranking, `prompt_set`/`task_card`, checklist diagnostic review, ordinary text when articulation is essential, compound multi-material activities.
3. **Honest limitation** — Current completion tables render **editable textareas**, not dropdown/checkbox-in-cell widgets. Guidance explicitly forbids inventing those.
4. **Stage-scoped injection** — `buildPracticePresentationContractBlock(stage)` + `resolvePracticeContractStage` so DLA carries repertoire + progressive demand; GAM carries fidelity; DP stays presentation/VA; avoid dumping the full essay on every step.
5. **Preserve Practice strengths** — Check your work, criteria, hints, worked/model responses, feedback, revision, maths, persistence/a11y called out as retained; criterion self-evaluation kept central when diagnostic review is warranted.
6. **LJ context** — Do not re-teach foundations already established upstream when the commission says so; different commissions should yield different designs.

---

## Files changed

| File | Change |
| ---- | ------ |
| `lib/ld-practice-presentation-contracts.js` | Progressive interaction + supported repertoire; stage-scoped blocks. Contract version later advanced to `101E-PRACTICE-DISCIPLINE-FIRST-V1` (see [101E-DISCIPLINE-FIRST-INTERACTIONS.md](101E-DISCIPLINE-FIRST-INTERACTIONS.md)); progressive heuristic retained. |
| `app.js` | Stage-appropriate Practice block injected **after** DLA/GAM augmentations (DLA v2 canonical assemble replaces the draft body, so Practice guidance must follow it). |
| `tests/s101e-practice-progressive-interaction.test.js` | Stage scoping, repertoire honesty, Practice vs Interactive isolation. |
| `index.html` | Cache pins for Practice contracts + `app.js`. |

No schema, renderer, or Interactive prompt-route changes.

---

## Tests

| Suite | Result |
| ----- | ------ |
| `tests/s101e-practice-progressive-interaction.test.js` | **4/4 pass** |
| `tests/s101e-practice-dp-visual-affordances.test.js` | **9/9 pass** |
| `tests/s101-practice-product-identity-and-intake.test.js` | pass |
| `tests/s101-practice-render-and-package.test.js` | pass |

**27/27** across the combined Practice progressive + VA + identity + render run.

---

## Limitations (current control-rich table support)

- **Table cells** = short **textarea** inputs (`render-table-workspace.js`), not select/dropdown/checkbox cells.
- **Assessment Pack MCQ forms** (`single_answer_mcq`, etc.) are not part of the Practice DLA material commissioning path; do not instruct Practice DLA to emit Assessment Pack component forms as activity workspaces.
- “Control-rich” Practice composition today means **structured tables + multi-field templates + ordering + checklists + compound materials**, not arbitrary in-cell widgets.
- Prompt guidance does not rewrite the saved C2 artefact; future DLA/GAM re-runs are required to change live interaction shapes.

---

## Resume note

Do **not** mark 101E complete. Do **not** overwrite current C2 output in this task. When ready, regenerate DLA→GAM (and LS if needed) on the existing Practice workflow after a hard refresh so stage-scoped Practice contracts load.
