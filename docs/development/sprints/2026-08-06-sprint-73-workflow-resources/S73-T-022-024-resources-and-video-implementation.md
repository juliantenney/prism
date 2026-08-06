# S73-T-022 / S73-T-024 — Resources and Video implementation

## 1) Implemented scope

- Added one optional page-level video reference backed by Workflow Resources text payload persistence.
- Added zero-or-more additional downloadable page resources backed by Workflow Resources binary payload persistence.
- Added minimal page-level authoring controls in the Visual Jobs workspace (`Video` and `Resources`).
- Extended learner export rendering with injected `Video` and `Additional Resources` sections between Orient and Activities.
- Extended learner package build to include additional uploaded resources and rewrite links to packaged relative paths.

## 2) Files changed

- `app.js`
- `lib/prism-workflow-resources.js`
- `lib/utilities-visual-jobs-workspace.js`
- `lib/learner-package.js`
- `tests/s73-t-011-workflow-resources.test.js`
- `tests/s73-t-022-024-learner-package-resources.test.js`
- `tests/sprint-70-slice-8-two-pane-manual-assets.test.js`

## 3) Owner extensions

- Added `putTextResource` for durable text payload storage (used for provider embed markup).
- Added `putBinaryFileResource` for generic downloadable file payload storage.
- Added `getTextResourcePayload` for video embed rehydration.
- Kept canonical ownership in the existing Workflow Resources module; no second persistence system.

## 4) Persisted fields and consumers

- Runstate now persists lightweight page-level refs in `workflowPageResourceRefs`:
  - `videoResourceId`
  - `additionalResourcesIntro`
  - `additionalResources[]` with `resource_id`, `link_text`, `order`
- Canonical payloads remain in Workflow Resources stores:
  - video embed markup in text resource metadata payload
  - downloadable file blobs in payload store
- Learner preview/export/package consume transient workspace projections regenerated from refs + canonical resources.

## 5) Page-reference model

- `app.js` projects refs into assembled page as `workflow_page_resources` with:
  - `video_resource_id`
  - `additional_resources_intro`
  - `additional_resources[]` (`resource_id`, `link_text`, `order`)
- References stay lightweight; no binary payload duplication in page/runstate JSON.

## 6) Authoring interaction

- `Video` area:
  - textarea for provider embed code
  - save/replace action
  - remove action
  - one-video constraint messaging
- `Resources` area:
  - intro paragraph textarea and save action
  - file picker + learner-facing link text input + add action
  - ordered resource list with move up/down and remove actions

## 7) Learner rendering order

- Injected order in vNext export path:
  1. Orient
  2. Video (if present)
  3. Additional Resources (if at least one valid item)
  4. Activities
- Empty video/resources sections are omitted.

## 8) Export/package behaviour

- Standalone HTML regenerates from durable refs + canonical resources.
- Video embed markup is rendered verbatim from persisted text payload.
- Additional resource links are rendered with `target="_blank"` and `rel="noopener noreferrer"` plus SR-only new-tab cue.
- Learner package now accepts `additionalResourceAssets`:
  - decodes resource data URLs
  - writes resource files to deterministic `assets/additional-resource-*.ext` paths
  - rewrites learner link URLs to packaged relative paths

## 9) Rehydration evidence

- Added rehydration path for page-level video/resources projections:
  - reads lightweight refs from runstate
  - resolves canonical text/blob payloads
  - rebuilds learner-facing projections for preview/export/package

## 10) Failure behaviour

- Video save rejects empty/whitespace input.
- Additional resource add requires both file and non-empty learner-facing link text.
- Persistence failures return explicit UI toasts and avoid committing broken refs.
- Missing payloads are recorded in resource projection diagnostics and omitted from rendered links.

## 11) Mixed-data limitation

- Preserved current behaviour:
  - stale/unreferenced resources can remain persisted
  - only referenced video/resources render
  - no automatic orphan cleanup or destructive prompts

## 12) Tests and browser verification

- Automated tests added/updated:
  - `tests/s73-t-011-workflow-resources.test.js`
  - `tests/s73-t-022-024-learner-package-resources.test.js`
  - `tests/sprint-70-slice-8-two-pane-manual-assets.test.js`
- Command run:
  - `node --test tests/s73-t-011-workflow-resources.test.js tests/sprint-70-slice-8-two-pane-manual-assets.test.js tests/s73-t-022-024-learner-package-resources.test.js`
- Result: **25 passed, 0 failed**.
- Browser-path manual verification sequence is still required to fully close T-023/T-025 checklist.

## 13) Deviations from S73-T-020

- Implemented verbatim embed storage/render contract for MVP as requested.
- Section insertion is implemented in the vNext export integration path (HTML injection seam) to keep changes small and reversible.

## 14) Remaining constraints

- Manual browser-path verification still pending for full closure evidence.
- No sanitisation is performed on embed markup in this MVP (intentional, per contract).
- Orphan cleanup remains out of scope.

## 15) Phase 3 UI refinement addendum (small, reversible)

- Utilities authoring tabs are now split into:
  - `Learner Page`
  - `Graphics (n)`
  - `Video`
  - `Resources (n)`
- User-facing `Visual Jobs` labels were renamed to `Graphics` only; internal module/API names are unchanged.
- Authoring panels are now isolated by tab:
  - `Graphics` tab shows only graphics jobs workspace.
  - `Video` tab shows only video controls.
  - `Resources` tab shows only additional-resources controls.

### Video presentation fields (page-owned)

- Added page-level video presentation fields to runstate/page refs:
  - `videoSectionTitle` → projected as `workflow_page_resources.video_section_title`
  - `videoIntroText` → projected as `workflow_page_resources.video_intro_text`
- Canonical Workflow Resource ownership remains unchanged:
  - video embed markup is still owned by text Workflow Resource payload (`embed_code` only).
- Validation now requires:
  - non-empty `Section title`
  - non-empty video embed code
  - optional intro paragraph remains optional.

## 16) Phase 3 presentation refinement addendum

Presentational-only follow-up (no persistence/owner changes):

### Learner Orient subsections

- Video and Additional Resources are injected into `#journey-orient` as Orient supporting subsections (`util-orientation-section`), not as top-level sibling sections after Orient.
- Shared Orient visual language:
  - `util-section-heading util-icon-heading`
  - `util-orientation-content util-prose-measure`
  - existing Orient spacing via `#journey-orient>section` rules
- Icons reuse existing pedagogical keys:
  - Video → `WATCH` (`play-circle`)
  - Additional Resources → `RESOURCE` (`library`)
- Decorative icons are `aria-hidden="true"`.
- Author video title remains the only video heading (no duplicate generic `Video` heading).
- Document order remains: Orient content → Video → Additional Resources → Activities.
- Journey nav still treats Orient as one phase (no new top-level phase).

### Video authoring form layout

- Vertical stacked form with labels above controls.
- Full-width title / intro / monospace embed textarea (taller embed field).
- Actions beneath fields.
- Duplicate raw embed `<pre>` preview removed; editable textarea is sufficient.
- Resources panel received only narrow label/field consistency tweaks.

### Final UI polish — always-visible tab counts

- Authoring tabs always display counts, including zero:
  - `Graphics (n)`
  - `Video (n)` where `n` is `0` or `1`
  - `Resources (n)`
- No persistence or architecture changes; labels reuse existing count sources.

## 15) Definition-of-done assessment

- Implemented core MVP behaviour for video/resources persistence, rendering order, packaging, and focused automated tests.
- Full DoD closure requires completion and recording of browser-path manual verification for add/refresh/reopen/preview/HTML/ZIP end-to-end.
