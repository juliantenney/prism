# S78-T-055 — Fix transfer/closure separation and transfer Markdown rendering

**Task:** S78-T-055  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-25)  
**Mode:** Implementation (smallest ownership-correct fix)  
**Upstream:** [S78-T-054](S78-T-054-transfer-response-markdown-closure-leakage-diagnostic.md)  
**Sprint 78:** OPEN · **T-013:** remains OPEN  

**Out of scope (honoured):** transfer pedagogy redesign · new workspace types · classification interactivity · QA scoring · images · DLA/GAM reliability gates · auto-regen · editable maths · HR benchmark migration · T-013 / Sprint 78 close  

---

## 1. T-054 root-cause confirmation

| Cause | Finding | Disposition |
| ----- | ------- | ----------- |
| **PRIMARY A** | T-032 preferred `transfer_prompt` as a host vessel for `### Page learner-resource closure`, contradicting T-041 (transfer = production; Study tips = consolidation). Design Page copies closure to `study_tips` but does not strip it from the material body → consolidation leaked into Transfer response. | **Fixed** — GAM host rule superseded |
| **PRIMARY D** | `renderLearnerWorkspace` used `renderMarkdownInline` inside a single `<p>` → literal `###` / collapsed lists for block Markdown transfer prompts | **Fixed** — block Markdown for transfer (and multi-line) workspace prompts |
| **SECONDARY E** | Authored `### Transfer task` duplicated renderer “Transfer your learning” / “Transfer response” | **Fixed** — GAM forbids boilerplate; no renderer heading-strip heuristics |

---

## 2. Exact T-032 host-vessel contradiction removed/superseded

**Removed preference:** host `### Page learner-resource closure` inside `transfer_prompt` (among consolidation/transfer/closure materials).

**Superseded by:** prefer `consolidation_summary` or culminating closure/debrief Markdown; otherwise append to the last Markdown material of the final activity that is **NOT** a `transfer_prompt`. Explicit **NEVER host** inside `transfer_prompt`.

T-032 objective preserved: terminal consolidation still reaches Study tips via Design Page transport of the designated heading.

---

## 3. Exact GAM authoring change

Canonical source: `lib/ld-gam-page-enrich-contract.js` (S78-D04 packaging + T-041 fulfilment lines).

- Prefer non-`transfer_prompt` host vessels for page closure.  
- `S78-T-055: NEVER host ### Page learner-resource closure inside a transfer_prompt body.`  
- Strengthen T-041: do not embed/append closure into commissioned `transfer_prompt`.  
- Forbid authored `### Transfer task` boilerplate (renderer owns Transfer headings).

Live mirror (same rules, not independently divergent wording): `buildGamV2CopyMaterialAuthoringBrief` in `app.js`.

No new schema field.

---

## 4. Live GAM path confirmation

| Path | Evidence |
| ---- | -------- |
| Enrich contract block | `buildGamPageEnrichContractBlock` — NEVER host + prefer consolidation_summary |
| V2 Copy brief | `buildGamV2CopyMaterialAuthoringBrief` — NEVER host + no Transfer-task boilerplate |
| Workflow Copy assembly | `buildWorkflowStepInstructions` (GAM step) receives brief content |
| Studio enrich draft | `applyGamPageEnrichPromptBlockToDraft` injects the same contract block |

---

## 5. Exact vNext Markdown rendering change

`lib/learner-renderer-vnext/render-composed-moment.js` → `renderLearnerWorkspace`:

- When `sourceKind === transfer_prompt` (also reflection / multi-line / heading / list prompts): render prompt via **`renderMarkdownBlock`** in `div.util-learner-workspace__prompt--block`.  
- Short single-line prompts remain `renderMarkdownInline` in `<p>`.  
- Uses existing HTML Markdown utilities (escaping/sanitisation unchanged). No transfer-specific parser; no regex strip; no CSS hide.

Also: `compose-generic-moments.js` skips non-`transfer_prompt` materials whose body hosts `### Page learner-resource closure` from the Transfer moment (Study tips remains the learner-facing destination). Does **not** strip embedded closure from a mis-authored `transfer_prompt` (that needs GAM regen).

Browser bundle rebuilt via `scripts/build-learner-renderer-vnext-browser.js`.

---

## 6. Heading-duplication disposition

**Owner:** GAM material authoring (upstream).  
**Rule:** do not author `### Transfer task` — renderer supplies “Transfer your learning” / “Transfer response”.  
No renderer heuristics that delete guessed headings.

---

## 7. T-032 closure preservation evidence

- Contract still requires exactly one `### Page learner-resource closure` in final-activity materials.  
- Design Page transport → `study_tips` unchanged.  
- Clean fixture: Study tips contain consolidation bullets.  
- Suite `tests/s78-gam-learner-closure-packaging.test.js` — **7/7 PASS**.

---

## 8. T-041 transfer preservation evidence

- Culminating `transfer_prompt` remains commissioned/fulfilled as learner production on a changed context.  
- Distinct from Study tips consolidation.  
- Suite `tests/s78-t-041-culminating-transfer-production.test.js` — **PASS** (incl. live vNext export distinct from Study tips).

---

## 9. Live learner journey evidence

Clean fixture export order:

1. **Transfer** moment (`data-composition-moment="transfer"`) — production body + Transfer response workspace (block Markdown).  
2. Later **Study tips** — page consolidation.  

No `### Page learner-resource closure` text inside the Transfer slice when authored correctly.

---

## 10. Existing HR artefact: re-export vs regeneration

| Defect | Repair |
| ------ | ------ |
| Literal `###` / collapsed lists in Transfer response | **Re-export alone** after renderer fix |
| Closure already embedded inside `transfer_prompt` body | **Fresh GAM generation / re-authoring** — no ad-hoc migration added for the benchmark |
| Redundant authored `### Transfer task` | Regenerated content obeys new GAM rule; existing bodies still render as headings via block MD until regen |

---

## 11. Tests and results

| Suite | Result |
| ----- | ------ |
| `tests/s78-t-055-transfer-closure-markdown-fix.test.js` | **PASS** |
| `tests/s78-t-041-culminating-transfer-production.test.js` | **PASS** |
| `tests/s78-gam-learner-closure-packaging.test.js` | **PASS** |
| `tests/s78-t-042-learner-workspace-authoring-fidelity.test.js` | **PASS** |

---

## 12. Files changed

| File | Role |
| ---- | ---- |
| `lib/ld-gam-page-enrich-contract.js` | Canonical host-vessel + transfer/closure separation + no Transfer-task boilerplate |
| `app.js` | Live V2 Copy brief mirror of same rules |
| `lib/learner-renderer-vnext/render-composed-moment.js` | Block Markdown for transfer workspace prompts |
| `lib/learner-renderer-vnext/compose-generic-moments.js` | Exclude closure-host vessels from Transfer moment |
| `lib/learner-renderer-vnext-browser.js` (+ export runtime) | Rebuilt bundle |
| `tests/s78-t-055-transfer-closure-markdown-fix.test.js` | New focused regressions |
| `tests/s78-t-041-…` / `tests/s78-gam-learner-closure-packaging.test.js` | Assertion updates for new wording |
| This record + STATUS / HANDOVER / PLAN / START-HERE / next-chat-briefing | Sprint navigation |

---

## 13. Deviations / unresolved risks

- Stochastic GAM may still occasionally embed closure in `transfer_prompt` until first-pass reliability improves; validators/transport do not strip it. Re-export will still show that text (as proper headings) until regen.  
- No migration of the existing HR specimen.

---

## 14. Final blocker status

**RESOLVED**

Semantic transfer/closure separation restored for new authoring; block Markdown renders correctly; Study tips retain closure; transfer retains production; focused/live regressions pass.

---

## 15. No new Sprint 78 blocker introduced

No unrelated polish nominated. Learner-workspace/interactivity remains PARKED. Image / DLA-GAM gate / QA work not reopened.

---

## 16. Sprint 78 / T-013 state

Both remain **OPEN** pending **S78-T-056 — Sprint 78 closure administration** (or T-053 if that ID is preferred for admin close — use next free admin-close ID in pack numbering; T-055 used for this fix).

---

## Recommended next task

**S78-T-056 — Sprint 78 closure administration**

Do not open further quality-improvement work automatically.
