# Sprint 73 — Final Report

**Sprint:** 73 — Workflow Resources  
**Opened:** 2026-08-06  
**Closed:** 2026-08-06  
**Status:** **COMPLETE / Closed**  
**Predecessor:** Sprint 72 — Closed ([Final Report](../2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-72-FINAL-REPORT.md) — link only; evidence not rewritten)  
**Successor:** Sprint 74 **not opened** — [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md) · [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md)  
**Closure companion:** [SPRINT-73-CLOSURE.md](SPRINT-73-CLOSURE.md)  
**Top-level closeout:** [docs/sprints/sprint-73-closeout.md](../../../sprints/sprint-73-closeout.md)  
**Backlog anchor:** [PB-FA-001 — Workflow Resources](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-001--workflow-resources)

---

## 1. Sprint objective

Provide first-class **Workflow Resources** for Prism by investigating durable persistence for learner-facing resources, beginning with generated images, and — if feasible — implementing a bounded persistence slice and a resource-type-neutral generalisation for additional downloadable resources and one provider-supplied embedded video.

---

## 2. Initial architectural question

> Can Prism introduce first-class Workflow Resources — beginning with persistent generated images — through a shared, extensible architecture that survives refresh, export, and regeneration without compromising fidelity or workflow continuity?

Posture at open: **discovery-led**; implementation was not assumed (`S73-D01`).

---

## 3. Discovery outcome

Phase 1 (`S73-T-001`…`T-005`) established:

- Generated-image lifecycle and identity anchors already exist; durable canonical ownership and payload persistence were the missing capability ([S73-T-001](S73-T-001-generated-image-lifecycle-discovery.md)).
- Canonical owner: **workflow-scoped Workflow Resources layer**; Utilities custody and `visualAssetManifest` remain transient projections ([S73-T-002](S73-T-002-canonical-workflow-resource-ownership.md)).
- Persistence options evaluated; promising shapes identified without locking technology in the gate decision ([S73-T-003](S73-T-003-persistence-strategy-evaluation.md)).
- Preview / standalone HTML / ZIP are **derived** and should be regenerated, not persisted as canonical state ([S73-T-004](S73-T-004-export-and-regeneration-path-implications.md)).
- Feasibility synthesis: **feasible with explicit conditions** ([S73-T-005](S73-T-005-feasibility-synthesis.md)).

---

## 4. Feasibility decision

**`S73-D02`:** Workflow Resource persistence is **feasible with explicit conditions**. Phase 2 proceeded only under recorded acceptance criteria ([S73-T-010](S73-T-010-phase-2-acceptance-criteria.md)). Minimal authoritative state is persisted; manifests, rendered HTML, and ZIP packages are not.

---

## 5. Implemented architecture

- Resource-type-neutral Workflow Resources owner (`lib/prism-workflow-resources.js`).
- IndexedDB-backed binary payload persistence for image resources.
- Page-owned lightweight refs for presentation/ordering; owner owns intrinsic payload/metadata.
- Generalisation design ([S73-T-020](S73-T-020-workflow-resources-generalisation-design.md)) then downloadable resources + video slices ([S73-T-022-024](S73-T-022-024-resources-and-video-implementation.md)).

Binding decisions: `S73-D01`, `S73-D02`, `S73-D03` — [decisions.md](decisions.md).

---

## 6. Generated-image persistence outcome

Same-browser/profile durability implemented and verified: attach → persist → rehydrate across refresh/new session → regenerate preview, standalone HTML, and learner-package ZIP ([S73-T-011](S73-T-011-generated-image-persistence-implementation.md), [S73-T-012](S73-T-012-generated-image-persistence-verification.md)).

---

## 7. Verification evidence (images)

See [S73-T-012](S73-T-012-generated-image-persistence-verification.md):

- Focused suites: **41 passed, 0 failed**
- Browser: Cursor embedded Chromium 144 / Electron 40.10.3 on Windows 11
- Heavy workload: **10 images**, approximately **23.7 MB** total payload — successful with documented timing constraints

---

## 8. Downloadable-resources outcome

Multiple Additional Resources: persistent refs, page-owned introduction/link text/ordering, learner ZIP inclusion with link rewriting ([S73-T-022-024](S73-T-022-024-resources-and-video-implementation.md), [S73-T-023-025](S73-T-023-025-resources-and-video-verification.md)).

---

## 9. Embedded-video outcome

One optional provider-supplied embed: verbatim storage/render (`S73-D03`); page owns title and introductory text; no custom player ([S73-T-022-024](S73-T-022-024-resources-and-video-implementation.md)).

---

## 10. Authoring-surface outcome

Utilities tabs: **Learner Page** · **Graphics (n)** · **Video (0|1)** · **Resources (n)** — always-visible counts including zero. Generated graphics remain the Sprint 73 Graphics path; manually uploaded non-job graphics are backlog ([PB-FA-004](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-004--manually-uploaded-graphics)).

---

## 11. Learner-facing ordering/presentation

Document order: Orient → optional video → optional additional resources → Activities. Video and resources are **supporting content within Orient** (nested subsections), not separate journey phases.

---

## 12. Export/package behaviour

Preview, standalone HTML, and ZIP are **regenerated** from workflow + owner + projection. Resource files included in ZIP with rewritten links; video wrapper/embed preserved verbatim. No persistence of manifests, rendered HTML, or ZIP packages as canonical state.

---

## 13. Test evidence (recorded runs — not combined)

| Run | Result | Authority |
| --- | ------ | --------- |
| Phase 2 focused persistence | **41 passed, 0 failed** | [S73-T-012](S73-T-012-generated-image-persistence-verification.md) |
| Phase 3 implementation focused | **25 passed, 0 failed** | [S73-T-022-024](S73-T-022-024-resources-and-video-implementation.md) |
| Phase 3 verification focused | **47 passed, 0 failed** | [S73-T-023-025](S73-T-023-025-resources-and-video-verification.md) |

Do **not** sum these into a fabricated grand total.

---

## 14. Browser-path evidence

Cursor browser / Chromium 144 on Windows 11 — refresh/new-session rehydration; preview/HTML/ZIP regeneration; resources/video end-to-end; Orient nesting and authoring-form presentation ([S73-T-012](S73-T-012-generated-image-persistence-verification.md), [S73-T-023-025](S73-T-023-025-resources-and-video-verification.md)).

---

## 15. Performance/capacity evidence

Heavy generated-image run: **10 images**, ~**23.7 MB** total payload — successful; attach and regeneration times increased as documented in T-012. Browser capacity remains environment-dependent (known limitation).

---

## 16. Decisions recorded

| ID | Summary |
| -- | ------- |
| `S73-D01` | Discovery-led scope on PB-FA-001 |
| `S73-D02` | Persistence feasible with explicit conditions |
| `S73-D03` | Video embed stored/rendered verbatim |

Inherited binding: `S72-D09`, `S72-D10`, `S72-D14`. Full log: [decisions.md](decisions.md).

---

## 17. Known limitations

Retained (not sprint failures against agreed acceptance):

- Same-browser/profile persistence only — not archival or cross-device
- Clearing browser/site data removes locally persisted resources
- Unreferenced/orphan resources may remain; no automatic cleanup
- No destructive prompt when workflow data is replaced
- Re-running a workflow may produce mixed old/new persisted resources; only currently referenced resources should render
- Provider video remains externally hosted; embed accepted/rendered verbatim
- Prism does not validate provider behaviour or guarantee external accessibility
- No custom video player; no package re-import; no central resource library; no server synchronisation
- Missing-resource browser simulation retains documented verification limitation (T-023 R8)
- Manually uploaded non-job graphics → [PB-FA-004](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-004--manually-uploaded-graphics), not Sprint 73

---

## 18. Backlog items created or updated

| Item | Action |
| ---- | ------ |
| [PB-FA-001](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-001--workflow-resources) | Updated — Sprint 73 COMPLETE / Closed; residual follow-ons listed |
| [PB-FA-004 — Manually uploaded graphics](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-004--manually-uploaded-graphics) | **Created** — Future architecture; not sprint-allocated |
| [PB-R-008](../../../backlog/PRODUCT-BACKLOG.md#3-research--design-questions) | **Created** — orphan/cleanup research question |

---

## 19. Explicit non-deliverables

- Sprint 74 (not opened)
- Manually uploaded graphics implementation
- Conversation-attachment byte persistence (`S72-D10` / PB-R-001)
- Central media library; cross-workflow sharing; server sync; package re-import
- Custom video player; embed sanitisation/adapters
- Orphan cleanup / destructive replace prompts
- PB-FA-002 programming resources; PB-FA-003 pipeline integrity
- Evidence-architecture changes; learner-renderer redesign

---

## 20. Final success assessment

**Sprint objective met.** Discovery answered the architectural question affirmatively under conditions; generated-image persistence, downloadable resources, embedded video, authoring-surface refinement, and Orient-supporting learner presentation shipped and verified within documented constraints. Sprint 73 is **COMPLETE / Closed**. Future work belongs in the product backlog or a future sprint — **Sprint 74 is not opened by this report**.

---

## Narrative (concise)

Sprint 73 began by investigating whether Prism could provide durable generated-image persistence through a shared Workflow Resources model. Discovery established a workflow-scoped canonical owner and a minimal-persistence architecture. Implementation proved same-browser/session durability for image resources and regenerated learner outputs. The architecture was then extended to downloadable resources and provider-supplied video embeds without separate persistence systems. The sprint closed with a clearer authoring surface and learner-facing integration within Orient.

---

## Links

- [SPRINT-73-CLOSURE.md](SPRINT-73-CLOSURE.md)  
- [decisions.md](decisions.md)  
- [STATUS.md](STATUS.md) · [PLAN.md](PLAN.md)  
- [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md)  
