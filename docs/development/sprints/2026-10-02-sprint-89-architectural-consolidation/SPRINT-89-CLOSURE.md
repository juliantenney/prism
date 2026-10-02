# Sprint 89 — Closure Record

**Sprint:** 89 — Architectural Consolidation  
**Opened:** 2026-10-02  
**Closed:** 2026-10-02  
**Status:** **COMPLETE / CLOSED**  
**Opening:** [S89-D01](decisions.md#s89-d01--open-sprint-89--architectural-consolidation)  
**Close:** [S89-D08](decisions.md#s89-d08--close-sprint-89--architectural-consolidation-complete)  
**Predecessor:** [Sprint 88 — COMPLETE / CLOSED](../2026-09-28-sprint-88-default-product-workflows-and-assessment-architecture/SPRINT-88-CLOSURE.md)

## Closure statement

Sprint 89 closed after bringing PRISM's implementation into alignment with its established first-class product architecture. Model-generated workflow topology and its elicitation lifecycle were removed; first-class product identity was normalised; obsolete assessment/topology policy was retired; Domain Pack responsibilities were reduced to current consumers; and Interactive, Expository and Assessment now share an explicit product-family integration boundary while retaining distinct educational reasoning and deterministic publishing responsibilities.

The broad automated suite is not green. 517 existing learner-renderer/page-render failures remain for explicit post-S89 reconciliation to determine whether they represent current defects, stale tests, superseded contracts, or harness problems.

## Architecture

Interactive, Expository, and Assessment are sibling first-class products. They are declared in `lib/first-class-workflow-family.js`. The product determines a predetermined pipeline. Workflow topology is not elicited or model-generated.

Each product keeps its own educational reasoning. Interactive keeps its prompt-factory material, runtime scaffolds, and in-experience diagnostic/formative feedback. Expository keeps its sibling prompts and filtered Learning Design guidance. Assessment keeps its stages and prompts, depth/count/intent/feedback timing, and its publisher, runtime, and evidence profile. Those differences are product reasoning, not duplication.

Shared Create, prompt routing, and publishing ask that declaration. Interactive behaviour is selected positively. Custom, Research, and unknown workflows are not first-class products. A later sibling should add a declaration, its pipeline, specialist prompts where required, a deterministic publisher where required, author controls where required, and a bounded integration branch only for genuinely new behaviour. Zero-edit extensibility was not the goal.

Custom is a workflow the author assembles from Prompt Studio prompts. It does not use model-generated topology and does not inherit a first-class contract because its prose or step names resemble one.

The Learning Design Domain Pack supplies current catalogues, brief configuration, and intellectual prompt material. It does not define first-class topology and it does not contain the removed Design Assessment authority policy.

`product` is the authoritative first-class identity. Legacy `ldCreateOutputType` is mapped for old records and then removed. Goal text, workflow names, and step ids are not product identity.

Research is not an operational current domain or product.

The supported product-output relationship is an Interactive Design Page or an Expository Design Page used as source for an Assessment Pack. That is not an all-to-all composition rule. Assessment is not a source for the others.

## Debt

| ID | Status | What changed |
| -- | ------ | ------------ |
| S88-AD-001 | **Resolved** | The broken graph heuristic and the Design Assessment authority policy are gone. Remaining step-title checks exist because Sprint 80 Adjustments still projects Quantity and Difficulty for that step. |
| S88-AD-002 | **Resolved** | There is no generated-graph Expository replacement. Expository topology comes from the family builder. |
| S88-AD-003 | **Resolved** | Saved identity is `product`. Old `ldCreateOutputType` is mapped on normalisation and dropped. |
| S88-AD-004 | **Resolved** | Create does not elicit or generate workflow topology. `workflowGenerationContext.js` remains for catalogues, brief config, prompt rules, and Prompt Studio. |
| S88-AD-005 | **Resolved** | The three products share the family declaration. Shared Create, prompt routing, and publishing ask it. A new product still adds its own implementation and, when the behaviour is new, one branch at those switches. |
| S88-AD-006 | **Resolved** | The Learning Design pack is catalogue, brief config, and prompt material for current stages. It is not a topology policy. |

The Sprint 88 ledger remains the original record. This closure is the resolution.

## Size

The historical application-JavaScript totals included three generated renderer files even though the written rule said to exclude them. Those historical figures are not rewritten. The comparable series, same 224-file scope, is:

| Point | Files | Lines |
| ----- | ----: | ----: |
| Baseline | 224 | 152139 |
| After Slice 2 | 224 | 149205 |
| After Slice 4 | 224 | 148565 |

Comparable reduction from the baseline: **3574** lines.

| Named file | Baseline | Close | Net |
| ---------- | -------: | ----: | --: |
| `app.js` | 60110 | 56647 | −3463 |
| Architectural cluster | 64154 | 60580 | −3574 |
| `workflowGenerationContext.js` | 1009 | 790 | −219 |
| Learning Design pack + manifest | 5192 | 4276 | −916 |
| Family module | 520 | 628 | +108 |

Slice 4 added a small amount of explicit product-family integration code. Line-count reduction was evidence of simplification, not the objective.

The Slice 3 application-JS recount of 127995 / 222 excluded the generated renderer files and is not part of this comparable series. Detail: [S89-IMPLEMENTATION-SLICE-4.md](S89-IMPLEMENTATION-SLICE-4.md).

## Tests

| Check | Result |
| ----- | ------ |
| Focused product-family tests | **6 passed** |
| First-class gate | **339 passed, 0 failed** |
| Broad suite after Slice 4 | **4220 tests, 3702 passed, 517 failed, 1 skipped** |
| Broad suite after Slice 3 | **4214 / 3696 / 517 / 1** |

The broad suite is not green. The 517 failures are not treated as harmless. Slice 4 added six passing tests and did not change the failure count. Those failures are [PB-S-007](../../../backlog/PRODUCT-BACKLOG.md#pb-s-007--broad-suite-rendererpage-render-failure-reconciliation). This closure did not investigate or fix them.

## Carry-forward, not this close

- [Assessment Pack real-use calibration](../../../backlog/PRODUCT-BACKLOG.md#assessment-pack-real-use-calibration-sprint-88-remainder) remains unfinished. Assessment architecture is not reopened because of it.
- [PB-S-007](../../../backlog/PRODUCT-BACKLOG.md#pb-s-007--broad-suite-rendererpage-render-failure-reconciliation) — classify the 517 failures before changing production code.
- Outcomes Map, Course Home, additional first-class products, and a Research product stay backlog directions. None was started here.

No successor sprint is opened.
