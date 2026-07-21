# Sprint 68 — Key Decisions

| ID | Date | Decision | Rationale |
| -- | ---- | -------- | --------- |
| S68-D01 | 2026-07-21 | Sprint 68 focuses on learner coherence, not renderer fidelity | Sprint 67 closed with functionally complete vNext renderer |
| S68-D02 | 2026-07-21 | Renderer-first before schema | Guiding principle: use authoritative lesson data before extending schema |
| S68-D03 | 2026-07-21 | First investigation is activity-to-activity bridging | Known observation: single bridge embedded in A5 |
| S68-D04 | 2026-07-21 | Sprint 67 surfaces frozen | Avoid reopening CSS, nav, iconography, export architecture |
| S68-D05 | 2026-07-21 | Validate pipeline/renderer boundary | Dual purpose alongside coherence improvements |
| S68-D06 | 2026-07-21 | The renderer renders; the pipeline authors | Inherited architectural principle for future sprints |
| S68-D07 | 2026-07-21 | Four-category issue classification | Renderer · render model · schema · pipeline ownership |

Decisions requiring implementation evidence will be added after S68-BL-001 completes.

## Inherited (Sprint 67 — do not reopen)

* vNext is default export renderer
* Legacy available via explicit version flag
* Deterministic model pipeline is production architecture
