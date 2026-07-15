# Sprint 61 — Operator Checklist (Phase A scored run)

Use once per run. Authority: [PHASE-A-PROTOCOL.md](PHASE-A-PROTOCOL.md).

**Run:** `____________` (e.g. A-S61-B09-r1)

---

## Pre-run

- [ ] Protocol: partial-page only (`pageEnrichmentV2` + `partialPageOutputs`)
- [ ] Soft-reload; clear `window.__PRISM_S59_*_TEST`
- [ ] Goal/LO = **verbatim** sparse brief only (no archetype coaching words)
- [ ] Fresh Copilot thread (or documented isolation) for this brief
- [ ] Confirm no `S59_*_TEST` in goal/title; no pasted archetype JSON planned

## Run

- [ ] Execute ordinary DLA planning (partial-page path)
- [ ] Capture DLA output without editing archetype fields
- [ ] Save `dla-prompt-excerpt.txt` (prove no S59 markers / emission blocks)
- [ ] Save `dla-capture.json`

## Post-run

- [ ] Fill `activation.json` (`selected_dla_test`, window flags)
- [ ] Run validation → `dla-validation.json`
- [ ] Persist / reload check → `persisted-page.json`
- [ ] Compute `expected_set` / `actual_set` → `expected-set.json`
- [ ] If `actual_set` non-empty + plans valid: GAM Copy → delivery snapshots
- [ ] Classify via precedence (protocol §7) → `classification.json` + record template
- [ ] Confirm artefact pack complete (else `INVALID_TEST`)
- [ ] Update [acceptance-matrix.md](acceptance-matrix.md) row + brief outcome when r1–r3 done

**Stop:** Do not change product code, prompts, or brief wording.
