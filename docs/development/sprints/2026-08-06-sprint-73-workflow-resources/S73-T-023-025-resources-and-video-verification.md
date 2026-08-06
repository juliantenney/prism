# S73-T-023 / S73-T-025 — Resources and Video Verification

## 1) Verification scope

- Browser-path verification for additional downloadable resources and one provider embed video.
- Persistence and rehydration checks across refresh/reopen in same browser profile.
- Learner ordering checks across all required state combinations.
- Standalone/regenerated HTML and ZIP packaging checks.
- Existing generated-image compatibility checks in the same workflow path.
- Narrow defect fixes only where verification exposed correctness issues.

## 2) Browser/environment details

- Browser: Cursor embedded browser (Chrome 144.0.7559.236 / Electron 40.10.3)
- OS: Windows 11 (`win32 10.0.26100`)
- Prism repo/build: local working tree on `C:/xampp/htdocs/prism` (uncommitted verification branch state)
- Workflow used: `hetero-interactive-a1b2c3d4-e5f6-7890-abcd-ef1234567890`
- Start state: existing workflow/runstate (not clean), then controlled page fixture load in Utilities

## 3) Additional-resources verification matrix (S73-T-023)

| Check | Result | Evidence |
| --- | --- | --- |
| R1 Add multiple resources | **Pass** | Added multiple files via Resources controls with learner text distinct from filenames; canonical binary resources persisted; runstate stored only lightweight refs. |
| R2 Ordering | **Pass** | Up/down controls changed order in authoring refs and rendered order; regenerated HTML and ZIP link ordering matched refs ordering. |
| R3 Removal | **Pass** | Removed one ref; removed link no longer rendered; remaining links worked; unrelated page/runstate remained intact. |
| R4 New-session rehydration | **Pass** | After reopen/reload in same profile, intro text + refs + order restored and rendered without re-uploading. |
| R5 Learner rendering | **Pass** | `Additional Resources` heading present only when refs exist; intro shown once; author text preserved; links include `target="_blank"` + `rel="noopener noreferrer"` + SR cue `(opens in a new tab)`. |
| R6 Standalone HTML regen | **Pass** | Durable regeneration path produced resources section and valid links after reopen. |
| R7 ZIP package | **Pass** | ZIP contained resource files at deterministic `assets/additional-resource-N.ext` paths; learner HTML links rewritten to those paths; author link text preserved. |
| R8 Missing resource behavior | **Not tested** | Browser test API in this runtime does not expose payload-deletion hook; existing automated coverage still verifies explicit missing-payload diagnostics (`tests/s73-t-011-workflow-resources.test.js`). |

## 4) Video verification matrix (S73-T-025)

| Check | Result | Evidence |
| --- | --- | --- |
| V1 Add video embed | **Pass** | Non-empty wrapped embed markup accepted; persisted as Workflow Resource `text`; runstate retained only `videoResourceId` ref. |
| V2 Render position | **Pass** | Section sequence: `orientation` -> `video` -> `additional-resources` -> `activities` (plus downstream sections). |
| V3 Verbatim preservation | **Pass** | Wrapper + iframe attributes preserved semantically; no provider-model parsing, URL rewrite, sanitization, or reconstruction observed. |
| V4 Replace video | **Pass** | Saving new embed retained single active page-level video slot ref and rendered updated markup. |
| V5 Remove video | **Pass** | Removing video removed section entirely; no empty heading/gap; resources and activities retained order. |
| V6 New-session rehydration | **Pass** | Video embed reference and rendered wrapper survived reopen/reload. |
| V7 Standalone HTML + ZIP | **Pass** | Regenerated HTML and ZIP learner HTML retained embed markup; no video binary packaged. |
| V8 Empty input | **Pass** | Whitespace-only save rejected; existing video ref remained unchanged unless explicitly removed. |

## 5) Combined learner-order results

| State | Result | Observed top-level sequence |
| --- | --- | --- |
| Orient + activities only | **Pass** | `orientation`, `activities`, `assessment`, `study-tips` |
| Orient + video + activities | **Pass** | `orientation`, `video`, `activities`, `assessment`, `study-tips` |
| Orient + resources + activities | **Pass** | `orientation`, `additional-resources`, `activities`, `assessment`, `study-tips` |
| Orient + video + resources + activities | **Pass** | `orientation`, `video`, `additional-resources`, `activities`, `assessment`, `study-tips` |

No empty/duplicate `video` or `additional-resources` sections in absent states.

## 6) New-session evidence

- Reload/reopen in same browser profile retained `workflowPageResourceRefs` (video ref + ordered additional-resource refs + intro).
- Regenerated learner output after reopen preserved resources/video section ordering and content.
- Persisted generated image manifest entries also rehydrated in the same reopened session.

## 7) Standalone HTML evidence

- Durable regeneration via the same path used for export produced non-empty HTML with expected resource/video sections.
- Video section contained provider wrapper/iframe structure.
- Additional links retained author text and accessibility/new-tab attributes.

## 8) ZIP evidence

- ZIP build succeeded.
- Observed entries included `learner-page.html` and deterministic additional-resource assets.
- Learner HTML within ZIP rewrote resource links to packaged relative `assets/additional-resource-N.ext`.
- Existing image asset compatibility confirmed (`assets/knowledge-summary-after-content.png` present when image attached).

## 9) Verbatim embed comparison

- Submitted:
  - `<div class="embed-shell" data-wrap="vfinal"><iframe src="https://player.example.com/embed/vfinal" width="640" height="360" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`
- Rendered section inner HTML preserved wrapper, attributes, and iframe URL/shape (normal browser serialization only, e.g. boolean attribute formatting).

## 10) Existing image compatibility result

- **Pass**: attached persisted image rehydrated, rendered in learner output, survived regeneration, and packaged with ZIP output.

## 11) Automated test results

Executed required set:

- `tests/s73-t-011-workflow-resources.test.js` ✅
- `tests/s73-t-022-024-learner-package-resources.test.js` ✅
- `tests/sprint-70-slice-8-two-pane-manual-assets.test.js` ✅
- `tests/sprint-70-slice-e2-learner-package-rewrite.test.js` ✅
- `tests/sprint-70-slice-e3-learner-package-zip.test.js` ✅
- `tests/learner-renderer-vnext-visual-affordances.test.js` ✅

Result: **47 passed, 0 failed**.

## 12) Defects found and narrow fixes made

1. **Script-load/browser-path mismatch (owner: HTML script loading)**
   - Symptom: browser runtime served stale module versions; new Video/Resources controls unavailable despite updated source.
   - Fix: bumped script query versions in `index.html` for changed modules (`app.js`, `prism-workflow-resources.js`, `utilities-visual-jobs-workspace.js`, `learner-package.js`).

2. **Section insertion placement/order defect (owner: learner render post-processing in `app.js`)**
   - Symptom: Video/Resources insertion could land inside orientation substructure in nested-markup cases.
   - Fix: replaced brittle regex-only insertion with DOM-based insertion (with fallback) to insert as top-level siblings after orientation.

3. **Preview regeneration rehydration race (owner: Utilities generate flow in `app.js`)**
   - Symptom: after reopen, generate path could render from stale/incomplete projections before page-resource rehydration.
   - Fix: `handleUtilitiesGenerate()` now awaits workflow-resource + page-resource rehydration before async render.

## 13) Known limitations

- Unreferenced/orphan resources may remain persisted (no cleanup).
- No destructive overwrite prompts for resource replacement.
- No server/cross-device persistence.
- Embed code is preserved verbatim (no sanitization/provider validation) by design.
- Provider-hosted video remains external and may not work offline.
- No package re-import or resource-library UI.

## 14) T-023 outcome

**Pass** (with fixes above). Acceptance criteria met for multi-resource persistence/order/render/export/package behavior.

## 15) T-025 outcome

**Pass** (with fixes above). Acceptance criteria met for single-video persistence/replacement/removal/order/export behavior and empty-input rejection.

## 16) Phase 3 recommendation

- Mark `S73-T-023` and `S73-T-025` **Done**.
- Mark the implemented Phase 3 resources/video slices complete with documented constraints.
- Keep known orphan/mixed-data limitations documented; do not broaden scope to new resource types in this sprint.

## 17) UI refinement verification addendum

Small, reversible refinement pass verified against the same architecture boundary:

- `Graphics` replaces user-facing `Visual Jobs` labels in Utilities output tabs/workspace heading.
- Tab split verified:
  - `Graphics (n)` panel contains graphics controls only.
  - `Video` panel contains only `Section title`, `Introductory paragraph`, and `Embed code`.
  - `Resources (n)` panel contains resources controls only.
- Count behavior verified:
  - graphics count continues to follow compiled brief count.
  - resources count updates after add/remove.
  - video tab has no count.
- Draft-preservation behavior verified:
  - unsaved field text survives switching between Video and Resources tabs.
- Page-level video presentation persistence verified:
  - title and intro survive refresh/reopen (rehydration) and appear in learner output.
  - embed markup remains verbatim and survives refresh/reopen.
  - replacing embed preserves saved title/intro unless explicitly changed.
- Learner sequence re-verified:
  - `orientation` → `video` (title, optional intro, embed) → `additional-resources` → `activities`.
- Standalone HTML and ZIP learner HTML both preserve the same video title/intro ordering structure.

## 18) Presentation refinement verification addendum

Presentational follow-up verified:

- Video and Additional Resources render as Orient subsections inside `#journey-orient`.
- Matching Orient subsection styling/icons (`WATCH`, `RESOURCE`) confirmed.
- Top-level journey phase list remains Orient → Activities (no separate Video/Resources journey phases).
- Within Orient: Video before Resources; Activities remain after Orient.
- Empty video/resources subsections omitted.
- Video authoring form is vertically stacked; embed textarea is full-width monospace; duplicate raw embed display removed.
- Draft values survive tab switching; saved title/intro/embed survive refresh/reopen.
- Standalone HTML and ZIP learner HTML preserve nested Orient subsection order.
