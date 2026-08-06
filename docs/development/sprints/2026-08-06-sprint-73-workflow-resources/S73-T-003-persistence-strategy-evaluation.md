# S73-T-003 — Persistence strategy evaluation

**Task:** S73-T-003  
**Sprint:** 73 — Workflow Resources  
**Type:** Phase 1 architecture evaluation (no implementation)  
**Date:** 2026-08-06  
**Prerequisites:** [S73-T-001](S73-T-001-generated-image-lifecycle-discovery.md) · [S73-T-002](S73-T-002-canonical-workflow-resource-ownership.md) (authoritative)  
**Hypothesis for evaluation:** Canonical owner = **workflow-scoped Workflow Resources layer** (T-002 recommendation — not revisited here)  
**Status:** Complete (strategies compared; **no storage technology chosen**; **no schema**; **no implementation**)

---

## Executive summary

Nine persistence **strategies** were evaluated against owner responsibilities **R1–R13** (T-002). None is selected for implementation in this task.

| Category | Strategies |
| -------- | ---------- |
| **Clearly unsuitable** (for canonical owner duties) | **P1** Inline workflow-embedded payloads · **P8** Export/snapshot-primary · **P9** Session-only extension (status quo+) |
| **Promising** (subject to evidence in T-004 / T-005) | **P5** Metadata/payload separation · **P6** Hybrid runstate index + browser blob store · **P4** IndexedDB workflow resource store |
| **Conditionally viable** (narrow or high-risk) | **P2** Separate localStorage registry · **P3** Sidecar collection per workflow · **P7** Content-addressable blob pool |

**Evidence still required before S73-D02:** storage quota headroom, typical payload sizes, IndexedDB vs localStorage parity on Node test paths, migration from `assetsByBriefId`, and export rehydration boundaries (feeds **T-004**, **T-005**).

---

## 1. Persistence strategy catalogue

Each strategy describes **how** a Workflow Resources layer could persist records — not a final technology choice.

| ID | Strategy | Description | Relationship to T-002 owner |
| -- | -------- | ----------- | --------------------------- |
| **P1** | **Workflow-embedded resources** | Resource records and/or base64 payloads stored **inside** existing workflow artefacts — e.g. inline in assembled page JSON, step captures, or runstate blob alongside `capturedOutputs` | Owner logic colocated with workflow data; **payload not separated** |
| **P2** | **Separate workflow resource registry (localStorage JSON)** | Dedicated localStorage key (e.g. per `workflow_id`) holding a JSON registry of resource records; payloads inline as `data_url` or small blobs | Owner as **parallel store** on same persistence rail as runstate |
| **P3** | **Sidecar resource collection** | Per-workflow **companion artefact** (separate JSON file or storage partition) holding resources; workflow runstate holds pointer/version only | Owner **physically separated** but workflow-scoped |
| **P4** | **Indexed resource store (browser IndexedDB)** | Workflow-scoped object store(s) for resource metadata + binary payloads; runstate or registry holds keys only | Owner backed by **structured browser DB** |
| **P5** | **Metadata / payload separation** | **Pattern** (combinable): canonical registry record = identity + lifecycle + render metadata + **payload reference**; bytes in secondary location (inline ref, IDB, sidecar, future server) | Matches T-002 contributor map — page JSON stays intent, owner holds refs |
| **P6** | **Hybrid: runstate index + browser blob store** | Runstate (or lightweight registry JSON) stores **index** `{ resource_id, affordance_id, payload_ref, … }`; payloads in IDB or sidecar | **Promising default shape** for browser-first Prism |
| **P7** | **Content-addressable blob pool** | Payloads stored once by hash; registry entries reference `content_hash`; dedup across resources/workflows | Extension of P5/P6 for large/evidence paths |
| **P8** | **Export- / snapshot-primary persistence** | Durable state = downloaded ZIP or `utilitiesLastHtml`; workflow reload re-imports from export | Owner **defined by export consumer** — rejected in T-002 |
| **P9** | **Session-only extension (status quo+)** | Persist `assetsByBriefId` to `sessionStorage` or lengthen Utilities session only — no workflow rail | **Not behind workflow persistence boundary** |

**Note:** P5 is an **architectural pattern** often combined with P2, P4, P6, or P7 — not mutually exclusive.

---

## 2. Evaluation matrix (R1–R13)

**Legend:** ✓ = can satisfy · p = partial / conditional · ✗ = cannot · n/a

| Resp. | P1 Embed | P2 LS registry | P3 Sidecar | P4 IDB store | P5 Meta/payload | P6 Hybrid | P7 CAS pool | P8 Export | P9 Session+ |
| ----- | -------- | -------------- | ---------- | ------------ | --------------- | --------- | ----------- | --------- | ----------- |
| R1 Stable identity | p | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | p | ✗ |
| R2 Lifecycle authority | p | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | p |
| R3 Intent association | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | p |
| R4 Persistence boundary | p | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| R5 Refresh survival | p | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| R6 Export participation | p | p | p | p | ✓ | ✓ | ✓ | p | p |
| R7 Browser/public compat | p | p | p | p | ✓ | p | p | p | p |
| R8 Selective regen | p | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| R9 Prompt independence | p | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | p | p |
| R10 Type neutrality | ✗ | p | ✓ | ✓ | ✓ | ✓ | ✓ | p | ✗ |
| R11 S72-D09 shared model | ✗ | p | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ |
| R12 Render metadata | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | p | p |
| R13 Provenance metadata | p | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | p |

**Row notes (evidence-linked, not implementation):**

- **P1** fails **R10–R11** architecturally when payloads live in page/step JSON — couples instructional artefacts to binary media and duplicates evidence/image paths (T-002; T-001 page vs bytes split).
- **P8** fails **R4–R5, R2, R8, R11** — export is one-way, no rehydration (T-001 export observations).
- **P9** fails **R4–R5, R1 durable** — Utilities session explicitly outside workflow save/load (T-001 Stage 5).
- **P6 / P5** score highest on **R6, R9, R10, R11** because metadata and bytes can be modelled for multiple resource types and shared with future author-evidence associations without overloading page JSON.

---

## 3. Cross-dimension comparison

Qualitative comparison beyond R1–R13. **No recommendation.**

| Strategy | Workflow continuity | Refresh behaviour | Export compat. | Browser/bundle compat. | Prompt indep. | Type neutrality | S72-D09 fit | Impl. complexity | Migration from today |
| -------- | ------------------- | ----------------- | -------------- | ---------------------- | ------------- | --------------- | ----------- | ---------------- | -------------------- |
| **P1 Embed** | p — same runstate save | Survives if embedded in persisted JSON | p — large HTML/export | p — Node tests parse JSON | p — metadata duplicated or lost | ✗ | ✗ | Low short-term | Small code delta; **high long-term debt** |
| **P2 LS registry** | ✓ — new key alongside runstate | ✓ if registry loaded with workflow | p — must feed manifest | p — browser-only quota | ✓ if metadata in registry | p | p | Medium | New store + hydrate workspace |
| **P3 Sidecar** | ✓ — pointer in runstate | ✓ if sidecar loaded together | ✓ — natural ZIP sibling | p — browser file API limited | ✓ | ✓ | ✓ | Medium–high | Export/import story needed |
| **P4 IDB store** | ✓ | ✓ | p — export reads from IDB | p — **Node test parity** risk | ✓ | ✓ | ✓ | Medium–high | IDB adapter + manifest bridge |
| **P5 Meta/payload** | ✓ (pattern) | ✓ | ✓ when payload reachable | ✓ if refs resolve both paths | ✓ | ✓ | ✓ | Depends on payload tier | Refactor asset record shape |
| **P6 Hybrid** | ✓ | ✓ | ✓ | p — needs shared API | ✓ | ✓ | ✓ | Medium–high | Align runstate + replace session cache |
| **P7 CAS pool** | ✓ | ✓ | p — indirection in export | p | ✓ | ✓ | ✓ — evidence dedup | High | GC/orphan rules |
| **P8 Export-primary** | ✗ | ✗ | n/a | p | p | p | ✗ | Low | **Anti-pattern** |
| **P9 Session+** | ✗ | ✗ | p | p | p | ✗ | ✗ | Low | Trivial; **does not meet owner duties** |

---

## 4. Comparative strengths and weaknesses

### P1 — Workflow-embedded resources

| Strengths | Weaknesses |
| --------- | ---------- |
| Reuses existing runstate save/load | Inflates `capturedOutputs` / page JSON (T-001 localStorage concern) |
| No new storage API initially | Violates separation of instructional content vs media (T-002) |
| Simple mental model for small demos | Poor **R10–R11** — image-specific coupling, blocks shared evidence model |

**Verdict:** **Clearly unsuitable** as the canonical persistence strategy for Workflow Resources (may remain for tiny inline edge cases only — not evaluated further here).

---

### P2 — Separate localStorage registry

| Strengths | Weaknesses |
| --------- | ---------- |
| Aligns with `promptr.workflows.runstate.v1` browser-first posture | **~5MB** localStorage quota risk with multiple PNGs |
| JSON inspectable; testable via existing patterns | Inline `data_url` duplicates payload in registry + HTML |
| Clear workflow scoping by key | Weak **R7** for Node-only tests unless mock store |

**Verdict:** **Conditionally viable** for a **thin slice** (few small images); **not proven** for v1.0 scale without quota evidence.

---

### P3 — Sidecar resource collection

| Strengths | Weaknesses |
| --------- | ---------- |
| Clean separation from step captures | Browser Prism has **no first-class filesystem** per workflow today |
| Natural alignment with learner package `assets/` layout | Import/export of sidecar **not implemented** |
| Good **R10–R11** if schema is neutral | Deployment model unclear (XAMPP vs pure browser) |

**Verdict:** **Conditionally viable** where export/import or host file access exists; **evidence required** for in-browser-only operation.

---

### P4 — IndexedDB workflow resource store

| Strengths | Weaknesses |
| --------- | ---------- |
| Designed for binary payloads; better quota headroom | **R7:** test harness may lack IDB parity (T-001 Node vs browser split) |
| Supports **R1–R13** if metadata store co-designed | New persistence API surface |
| Strong fit for **S72-D09** large byte paths later | Migration and orphan cleanup complexity |

**Verdict:** **Promising** for browser canonical owner; **T-004/T-005** must confirm test-path and export read paths.

---

### P5 — Metadata / payload separation (pattern)

| Strengths | Weaknesses |
| --------- | ---------- |
| Implements T-002 contributor map literally | Not a store alone — must pair with P2/P4/P6/P7 |
| **R9:** render metadata durable without `generation_instruction` | Two-phase read on every manifest build |
| **R10–R11:** neutral resource records | Ref indirection failures if payload missing |

**Verdict:** **Promising pattern** — likely **required** regardless of payload tier; not sufficient alone.

---

### P6 — Hybrid runstate index + browser blob store

| Strengths | Weaknesses |
| --------- | ---------- |
| Runstate remains **index rail** (T-002); payloads external | Two-store consistency (index vs bytes) |
| Utilities workspace becomes **cache** over owner | Transaction/repair semantics undefined |
| Export can snapshot from owner, not session | Implementation complexity medium–high |

**Verdict:** **Most promising combined strategy** for current architecture — still **unproven** until quota, IDB, and export paths validated.

---

### P7 — Content-addressable blob pool

| Strengths | Weaknesses |
| --------- | ---------- |
| Dedup for evidence + images (**R11** long-term) | Orphan GC, reference counting |
| Stable bytes even if resource metadata changes | Export must embed or resolve hashes |
| | Overkill for Phase 2 image slice unless evidence path converges |

**Verdict:** **Promising later**; **optional** for first slice — evidence required on author-evidence byte volumes (PB-R-001 / `S72-D10`).

---

### P8 — Export- / snapshot-primary

| Strengths | Weaknesses |
| --------- | ---------- |
| Already produces durable PNGs in ZIP (T-001) | **No round-trip** into workflow |
| | Fails owner responsibilities **R2, R4–R5, R8, R11** (T-002) |

**Verdict:** **Clearly unsuitable** as persistence strategy for canonical owner (remains **consumer** path only).

---

### P9 — Session-only extension

| Strengths | Weaknesses |
| --------- | ---------- |
| Minimal change to `assetsByBriefId` | Fails **R4–R5** by definition |
| | Not workflow-scoped durability |

**Verdict:** **Clearly unsuitable** — does not implement Workflow Resources product goal.

---

## 5. Risks and assumptions

### Risks

| Risk | Affected strategies | Source |
| ---- | ------------------- | ------ |
| **localStorage quota exhaustion** | P1, P2, P6 (if index+inline) | Browser limits; multi-MB PNGs per T-001 intake cap (12MB per file in `prism-visual-assets.js`) |
| **Index/payload desync** | P5, P6, P7 | Two-store writes without transactions |
| **Node test / CI parity** | P4, P6 | T-001 browser bundle vs Node module split |
| **Export without owner read path** | All except P8 | T-001 export reads session manifest snapshot today |
| **Identity drift on page regen** | All | T-002 risk — rebind policy undefined |
| **S72-D09 scope expansion** | P7, large P4 | Author-evidence bytes may force CAS sooner than image slice |
| **False feasibility from P9** | P9 | Appears easy; fails owner duties |

### Assumptions (evaluation-only)

1. Prism remains **browser-first** with `localStorage` runstate as primary workflow persistence rail (T-001 Stage 5).
2. Renderer stays **manifest-fed** — strategies must **project** to manifest, not embed in renderer (Sprint 73 boundary).
3. **`data_url`** remains the **interchange format** for export until proven otherwise (T-001 export path).
4. No server-side workflow store is introduced in Phase 2 slice unless T-005 discovers otherwise.
5. Metadata/payload separation (**P5**) is **compatible with all promising strategies** — not a competing store.

---

## 6. Open questions (evidence required before S73-D02)

| # | Question | Blocks | Likely task |
| - | -------- | ------ | ----------- |
| Q1 | Typical count and byte size of generated images per workflow run? | P2 viability | T-005 / measurement |
| Q2 | Headroom under localStorage with runstate + registry index (no payloads)? | P2, P6 index tier | T-005 |
| Q3 | Can IndexedDB be accessed consistently from Utilities path **and** Node tests? | P4, P6 | T-004 / T-005 |
| Q4 | Export pipeline: can `buildLearnerPackage` read from owner store instead of session manifest without HTML regression? | P6, P4 | **T-004** |
| Q5 | Sidecar: is there an existing export/import hook to attach a resource collection? | P3 | T-004 |
| Q6 | Minimum metadata set for **R9** when page JSON regen drops affordance row? | P5 | T-005 |
| Q7 | Orphan policy when workflow deleted but blobs remain? | P4, P7 | T-005 (policy only) |
| Q8 | Author-evidence byte path: same store or partitioned namespace under **S72-D09**? | P7 timing | T-005 |
| Q9 | Migration: hydrate Utilities workspace from owner on load — UX and conflict rules? | All promising | T-005 |
| Q10 | Public/browser bundle: does owner API need to ship in separate script like visual-jobs modules? | **R7** | **T-004** |

**S73-D02 feasibility** should **not** pass until Q1–Q4 and Q10 have at least ** directional evidence**.

---

## 7. Classification summary

### Clearly unsuitable

| Strategy | Primary reason |
| -------- | -------------- |
| **P1** Workflow-embedded payloads | Fails **R10–R11**; couples media to instructional JSON (T-002) |
| **P8** Export/snapshot-primary | Fails **R4–R5, R2, R8**; one-way consumer (T-001, T-002) |
| **P9** Session-only extension | Fails **R4–R5**; not workflow persistence boundary |

### Promising (evaluation continues in T-004 / T-005)

| Strategy | Why promising |
| -------- | ------------- |
| **P5** Metadata/payload separation | Required pattern for T-002 owner; supports **R9–R11** |
| **P6** Hybrid runstate index + blob store | Matches runstate rail + separates bytes; Utilities as cache |
| **P4** IndexedDB workflow store | Strong binary persistence; good **R10–R11** potential |

### Conditionally viable (needs evidence)

| Strategy | Condition |
| -------- | --------- |
| **P2** localStorage registry | Only if payloads stay small or externalized |
| **P3** Sidecar collection | If import/export or host file story is acceptable |
| **P7** Content-addressable pool | If evidence byte path converges early (**S72-D09**) |

---

## 8. Inputs to subsequent Phase 1 tasks

### S73-T-004 (export and public-export-path implications)

- Export today is **manifest snapshot + `utilitiesLastHtml`** (T-001) — not owner-backed.
- Promising strategies **P4, P6** require export to **read canonical owner**, not rebuild from session cache.
- **Q4, Q5, Q10** are primary T-004 deliverables.
- Path rewriting (`learner-package.js` `data_url` → `assets/…`) likely **unchanged** if owner supplies same manifest shape (T-001).

### S73-T-005 (feasibility synthesis → S73-D02)

- **Unsuitable strategies** (P1, P8, P9) can be excluded from feasibility options.
- **Promising cluster:** **P5 + P6** (with P4 as payload tier) vs **P2** (limited slice).
- Feasibility ** hinges on quota + IDB parity + export read path** — not on ownership re-analysis.
- If Q1–Q4 fail, S73-D02 may conclude **partial feasibility** (e.g. small-image slice only) or **not feasible** without host/server store — **not decided here**.

---

## 9. Evidence references

| Source | Use in this evaluation |
| ------ | ------------------------ |
| [S73-T-001](S73-T-001-generated-image-lifecycle-discovery.md) | Runstate text-only; session workspace reset; export one-way; `data_url` export contract; browser bundle split |
| [S73-T-002](S73-T-002-canonical-workflow-resource-ownership.md) | R1–R13 matrix; owner hypothesis; runstate as ref rail; reject embed/session/export-as-owner |
| `S72-D09` | Strategies must support **shared** model — disqualifies embed/session/image-only |
| `S72-D10` | Attachment bytes deferred — may affect P7 timing, not image strategy choice here |
| `lib/prism-visual-assets.js` | MAX_IMAGE_BYTES 12MB — quota risk input |
| `app.js` | `promptr.workflows.runstate.v1` persistence rail |

---

## Explicit non-deliverables (honoured)

- No final storage technology selected.
- No schemas or API designs.
- No architecture or code changes.
- No implementation recommendation — only **promising vs unsuitable** classification for Phase 1 continuation.
