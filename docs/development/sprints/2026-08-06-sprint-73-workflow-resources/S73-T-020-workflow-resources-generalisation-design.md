# S73-T-020 — Workflow Resources generalisation design

**Task:** S73-T-020  
**Sprint:** 73 — Workflow Resources  
**Mode:** Design only (no implementation)  
**Date:** 2026-08-06  
**Status:** Complete (design + bounded implementation plan)

---

## 1. Scope and product outcome

Design the smallest extension of the established Workflow Resources architecture so Prism can support:

1. multiple additional learner-facing resources (downloadable and/or external links), and
2. one optional embedded video.

Required learner-page order when present:

```text
Orient
Video
Additional resources
Activities
```

No code changes are made by this task.

---

## 2. Established image-resource baseline

The generated-image slice (S73-T-011/T-012) is the authoritative baseline:

- Canonical owner: workflow-scoped `PRISM_WORKFLOW_RESOURCES`.
- Workflow/page data stores lightweight references and intent, not payload bytes.
- Binary payload durability is owner-managed (IndexedDB in browser path for current slice).
- Projections/manifests are transient.
- Preview/standalone HTML/ZIP are regenerated outputs.
- Persistence boundary is resource-type neutral.

This generalisation extends that pattern; it does not replace it.

---

## 3. Proposed authoring-surface flow

Smallest UI extension consistent with existing patterns:

- Add two focused controls in the existing authoring surface:
  - `Resources`
  - `Video`
- Each control reveals a compact page-level editor area.
- No full resource library UI, no cross-workflow browser, no global media manager.

### Resources area (minimum actions)

- Add resource (upload file or validated external URL).
- Title (author-entered or derived fallback).
- Optional learner-facing description.
- Ordered list of references.
- Replace referenced resource.
- Remove page reference.

### Video area (minimum actions)

- Add video input.
- Validate/sanitise.
- Replace existing video (single-slot rule).
- Remove video reference.
- Optional title/description.

---

## 4. Page ownership and reference model

Page/workflow data should hold intent and ordering only:

- ordered resource references array (zero or more),
- one optional video reference.

Canonical records (mime/payload/URL/embed payload) remain in Workflow Resources owner.

Recommended ownership split:

- **Page data:** ordering + section placement + lightweight refs.
- **Resource owner:** durable resource identity, type, payload/reference, lifecycle, essential metadata.
- **Renderer projection:** resolved link/video view model for output.

This keeps page JSON small and avoids embedding binary content.

---

## 5. Additional-resource conceptual model

Minimum conceptual fields for each page-level resource reference:

- `resource_id` (consumer: owner lookup)
- display title override (consumer: learner link text)
- optional description (consumer: learner support text)
- explicit order position (consumer: renderer ordering)

Owner-side metadata (durable; not duplicated in page JSON unless override needed):

- resource type category (binary_linkable/external_link)
- mime type or external URL marker
- original filename (for package path derivation + fallback title)
- payload locator (binary) or validated URL
- byte size (optional display/diagnostics)

Avoid redundant duplication where owner is authoritative.

---

## 6. Video-resource conceptual model

Video should remain a Workflow Resource category, with a dedicated projection adapter for render/export.

Minimum durable concepts:

- stable `resource_id`
- resource type `video_embed` (or equivalent neutral typed category)
- safe embed representation (not raw unsanitised HTML)
- optional title/description
- workflow/page association (single optional page slot)

Page data stores only optional video reference + placement intent.

Single-video behavior for first slice:

- adding a new video replaces the existing page video reference (explicit predictable overwrite in slot).

---

## 7. Embed-code safety analysis

Raw embed code is an active-content boundary. Safe narrow recommendation:

### Recommendation

Do **not** persist or render arbitrary raw embed HTML as-is.

Use constrained accepted input:

- either provider URL converted to trusted iframe projection, or
- restricted iframe-only embed parsing with strict allow-list.

### Minimum safety requirements

- Reject `<script>` and inline event handlers (`on*` attributes).
- Permit only iframe-based embed elements for slice B.
- Enforce protocol allow-list (`https` only).
- Restrict host allow-list for initial slice (e.g. YouTube/Vimeo institutional providers).
- Apply explicit iframe attributes: `sandbox`, limited `allow`, `referrerpolicy`, `loading`.
- Strip style/script injection vectors.
- Constrain dimensions and apply responsive wrapper projection.

### Browser/public/export parity

- Store a canonical safe embed representation (normalised, sanitised projection source).
- Reuse same projection for browser preview and exported HTML/package HTML.
- Do not rely on runtime DOM sanitisation only at render time.

Conclusion: unrestricted raw embed code is **not acceptable** for the initial safe slice.

---

## 8. Learner-page ordering and renderer extension point

Narrow insertion point: page-model projection just before learner render composition.

Target render structure:

1. Orient block (existing)
2. Video section (if video reference resolves)
3. Additional resources section (if ordered references resolve)
4. Activities (existing sequence)

Rules:

- Omit empty video/resources sections entirely.
- Preserve semantic heading structure and keyboard navigation.
- Show accessible link text plus format label (and size where available).
- Video iframe must be responsive and non-autoplay by default.

This is a small extension to existing composition ordering, not a renderer redesign.

---

## 9. Export/package implications

### Uploaded binary resources

- Package builder includes resolved binary payloads.
- Deterministic safe asset paths under package assets directory.
- Link rewrite from page projection to packaged relative paths.
- Collision handling via deterministic suffixing.
- Missing payload is explicit warning/diagnostic; do not silently claim full success.

### External linked resources

- Preserve validated external URL in HTML/package HTML.
- No packaged payload.
- Document offline limitation in verification notes/user guidance.

### Embedded video

- Persist safe embed representation and project into output HTML.
- External provider dependency remains; offline behavior may be degraded.

No persistence of generated HTML/ZIP.

---

## 10. Mixed-data and orphan-resource consideration

Known behavior remains valid: step re-run or replacement may leave prior canonical resources.

Minimum correctness rule for first implementation:

- render only resources currently referenced by page data,
- preserve unreferenced canonical resources without displaying them,
- classify as potential orphans for future management.

No automatic deletion, no destructive prompts, no forced clearing in this phase.

---

## 11. Limits and accessibility requirements

### Limit dimensions (no final values selected)

- max individual uploaded file size
- max total workflow resource payload
- max resource count per page/workflow
- max embed input length
- allowed MIME types
- browser storage availability/quota behavior
- package memory and ZIP size behavior
- external URL length and provider restrictions

Image-heavy workloads >=20 MB are already plausible and must remain supportable in policy planning.

### Accessibility requirements (minimum)

- meaningful resource link text (not opaque ids)
- format label; optional size hint
- optional descriptions rendered where provided
- keyboard-accessible links and section navigation
- meaningful video title
- no autoplay default
- embed focus must not trap keyboard
- maintain heading hierarchy

Prism cannot guarantee accessibility of third-party hosted video/content; this must be stated.

---

## 12. Compatibility with existing image persistence

Compatibility is preserved by reusing shared owner operations:

- create/update resource record
- payload/reference lookup
- list by workflow
- page-level lightweight references

Adapter boundaries:

- image adapter/projection: existing manifest path
- file-link adapter/projection: new link projection
- video adapter/projection: new safe embed projection

No broad changes to proven image attach/rehydrate/export path are required.

---

## 13. Minimal implementation slices

### Slice A — Page-level downloadable resources (recommended first)

- Multi-resource references from page data (ordered).
- Upload + external-link support with shared owner boundary.
- Learner renderer links section beneath Orient.
- Package includes binary resources and rewrites links.
- No central library UI.

### Slice B — One embedded video (recommended second)

- Single video slot using constrained safe embed representation.
- Page holds one optional video reference.
- Learner renderer places video beneath Orient and above resources.
- Export preserves safe embed representation.

Rationale for order: Slice A reuses proven binary/link durability with lower active-content risk; Slice B adds active embed safety boundary afterward.

---

## 14. Explicit non-goals

- Programming resources
- Pipeline integrity redesign
- Evidence architecture redesign
- Learner renderer overhaul
- Cross-workflow resource sharing/library
- Server sync or cross-device guarantees
- Package re-import
- Automatic orphan cleanup UI
- Automatic destructive overwrite prompts
- Media hosting/video download/transcript/caption generation
- Arbitrary active HTML/JavaScript embeds
- PDF/Word inline content viewers

---

## 15. Risks and unresolved questions

1. **Embed safety boundary:** final accepted representation (strict iframe vs provider URL canonicalisation) needs explicit pre-implementation decision.
2. **Package warning semantics:** missing payload/invalid external references need consistent warning surface.
3. **Reference evolution:** page-reference shape should stay minimal but future-proof for ordering and optional override metadata.
4. **Quota/size policy:** thresholds still require explicit measured policy decision (warning vs hard-stop bands).
5. **Offline expectations:** clear product wording required for external links/video in exported/offline contexts.

---

## 16. Recommended next implementation tasks

S73-T-020 itself is design complete. Recommended bounded next tasks (implementation pending explicit approval):

- **S73-T-022** — Implement Slice A: ordered page-level downloadable resources via shared Workflow Resources owner.
- **S73-T-023** — Verify Slice A: refresh/new-session, export/package, limits/failure behavior.
- **S73-T-024** — Implement Slice B: single-slot embedded video with constrained safe embed representation.
- **S73-T-025** — Verify Slice B: safety constraints, renderer placement order, export parity.

Keep **S73-T-021** for shared-model alignment review with S72-D09 before broadening beyond these slices.

---

## 17. Evidence references

- [S73-T-001](S73-T-001-generated-image-lifecycle-discovery.md)
- [S73-T-002](S73-T-002-canonical-workflow-resource-ownership.md)
- [S73-T-003](S73-T-003-persistence-strategy-evaluation.md)
- [S73-T-004](S73-T-004-export-and-regeneration-path-implications.md)
- [S73-T-005](S73-T-005-feasibility-synthesis.md)
- [S73-T-010](S73-T-010-phase-2-acceptance-criteria.md)
- [S73-T-011](S73-T-011-generated-image-persistence-implementation.md)
- [S73-T-012](S73-T-012-generated-image-persistence-verification.md)
- [S73-D02](decisions.md#s73-d02-workflow-resource-persistence-is-feasible-with-explicit-conditions)

---

## Final conclusion

- Multiple linked resources fit the established owner model: **yes**.
- One embedded video fits the model safely: **yes, with constrained representation**.
- Raw unrestricted embed code acceptable as-is: **no**; must be constrained/sanitised.
- Smallest safe implementation order: **Slice A (resources) -> Slice B (video)**.
- Required pre-code decision: **embed input contract (provider URL or strict iframe allow-list) and sanitisation policy boundary**.

