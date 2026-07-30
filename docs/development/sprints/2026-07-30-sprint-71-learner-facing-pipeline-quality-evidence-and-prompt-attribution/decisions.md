# Sprint 71 — Decision Log

**Format:** ID · Decision · Status · Rationale · Consequences  

Inherited Sprint 70 closure decisions are restated once for convenience; **authoritative close record** remains [SPRINT-70-CLOSURE.md](../2026-07-28-sprint-70-visual-planning-and-synthesis/SPRINT-70-CLOSURE.md) (`S70-D01` … `S70-D10`).

### Decision-ID namespaces (read before citing)

| ID family | Role |
| --------- | ---- |
| `S70-D01` … `S70-D10` | **Authoritative** Sprint 70 closure decisions |
| `S71-D01` … `S71-D10` | **Sprint 71 aliases** for those ten decisions (same content) |
| `D70-01` … `D70-12` | Authoritative **visual-planning** decisions in [SPRINT-70-DECISIONS.md](../2026-07-28-sprint-70-visual-planning-and-synthesis/SPRINT-70-DECISIONS.md) — **not** the closure set |
| `D70-10` … `D70-15` (closure block in DECISIONS.md) | **Non-authoritative duplicate labels** that collide with visual-planning `D70-10`…; do not cite as authority — use `S70-D0x` |

---

## Inherited (binding)

| Sprint 71 alias | Authoritative ID | Decision | Status |
| --------------- | ---------------- | -------- | ------ |
| S71-D01 | **S70-D01** | No authoring-workflow redesign | Accepted |
| S71-D02 | **S70-D02** | No post-generation author questioning in this workstream | Accepted |
| S71-D03 | **S70-D03** | Workflow observations log-only in Sprint 71 | Accepted |
| S71-D04 | **S70-D04** | Author observations log-only in Sprint 71 | Accepted |
| S71-D05 | **S70-D05** | Retain rejected findings | Accepted |
| S71-D06 | **S70-D06** | Sprint 71 is evidence gathering and attribution | Accepted |
| S71-D07 | **S70-D07** | Do not rewrite pipeline prompts prematurely | Accepted |
| S71-D08 | **S70-D08** | Prompt changes after patterns across ~15–20 resources (later sprint) | Accepted |
| S71-D09 | **S70-D09** | Do not attribute solely by visible stage | Accepted |
| S71-D10 | **S70-D10** | Records distinguish observed location / primary owner / contributing stages / responsibility type | Accepted |

---

## Sprint 71 local decisions

## S71-D11 Sample target remains approximately 15–20

- **Decision:** Completion target remains approximately 15–20 varied resources, per Sprint 70 agreement. Variety is tracked in [sample-selection-plan.md](sample-selection-plan.md).
- **Status:** Accepted
- **Rationale:** No alternate documented target found in Sprint 70 artefacts.
- **Consequences:** STATUS counter uses ~15–20; change only via new decision row.
- **Alternatives considered:** Fixed exact N; not adopted without further agreement.

## S71-D12 Register is the SoT for findings

- **Decision:** [improvement-register.md](improvement-register.md) is the source of truth for Sprint 71 findings (one row per canonical finding / cluster, with recurrence fields). Per-resource reviews use [review-logging-template.md](review-logging-template.md) under `reviews/`.
- **Status:** Accepted
- **Rationale:** Matches Sprint 59/61 evidence-pack practice; recurrence model keeps the register scannable.
- **Consequences:** Dashboard tallies derive from the register; review files hold per-resource detail.
- **Alternatives considered:** Spreadsheet-only; not required at open.

## S71-D13 Phase 0 artefact-path gate before Review 1 counts

- **Decision:** Before Review 1 is counted, STATUS must record canonical paths and versions for Benchmark v2.1 and Validation Review v2.0. The Learning Design pipeline attribution map is a required Sprint 71 artefact ([learning-design-pipeline-attribution-map.md](learning-design-pipeline-attribution-map.md)).
- **Status:** Accepted
- **Rationale:** Prevents evidence work against unlocated QA instruments.
- **Consequences:** Phase 0 remains incomplete until paths are filled; Review 1 does not increment the reviewed counter until then.
- **Alternatives considered:** Start reviews with informal copies; rejected.

## S71-D14 Design Page prompt vs assembly / renderer attribution

- **Decision:** Design Page prompt owns title, orientation/`page_synthesis`, and visual-planning metadata. Final-page losses are classified as Design Page prompt omission, artefact-contract failure, stage-handoff failure, deterministic page-assembly failure, or renderer failure per [CONTEXT.md](CONTEXT.md).
- **Status:** Accepted
- **Rationale:** Prevents automatic blame of Design Page for assembly or render defects.
- **Consequences:** Register and review template must distinguish these failure classes.
- **Alternatives considered:** Attribute all final-page defects to Design Page; rejected.

---

## Decision template (new entries)

```markdown
## S71-DXX — Title

- **Decision:**
- **Status:** Proposed | Accepted | Superseded
- **Rationale:**
- **Consequences:**
- **Alternatives considered:**
```
