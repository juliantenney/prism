# Sprint 49 Startup Checklist

## Repository baseline

- [ ] `master` is clean and includes Sprint 48 commits `cd59779`…`4a916b6`
- [ ] Focused Sprint 48 suite passes (62 tests):
  ```bash
  node --test tests/workflow-instructional-pattern-prompt.test.js tests/gam-output-format.test.js tests/workflow-gam-capture-validation-gate.test.js
  ```

## Sprint artefacts

- [ ] Sprint 48 closure record reviewed
- [ ] Sprint 49 startup folder artefacts present
- [ ] `SPRINT-49-DECISION-LOG.md` initialised
- [ ] `SPRINT-49-OPEN-QUESTIONS.md` reviewed

## Primary thread (SP-01)

- [ ] Read SP-01 pattern entry and §5.1 `text` contract
- [ ] Trace GAM cognition contract in `app.js` (`buildPedagogicCognitionContractPromptBlock`)
- [ ] Trace pattern injection order in `applyWorkflowStepRuntimePromptAugmentations`
- [ ] **49-1:** Record cognition vs `text` reconciliation decision (D-49-01)
- [ ] **49-2:** Implement SP-01 + tests per slice philosophy
- [ ] **49-3:** Marx observation on M1/M5/M12 `text` bodies; log FM-07 presence/absence

## Secondary thread (presentation)

- [ ] **Gate:** Do not start until SP-01 stable (49-3 complete)
- [ ] **49-4:** Scoped investigation note — pipeline page vs two-column prototype gap list
- [ ] No renderer/layout implementation without new slice charter

## Validation discipline (unchanged from Sprint 48)

- One bounded slice at a time
- Tests with implementation
- Marx workflow for observation
- Keep / refine / revert per slice
