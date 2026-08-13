# Sprint 75 — Final Report

**Sprint:** 75 — PRISM User Experience and Interface  
**Opened:** 2026-08-10  
**Closed:** 2026-08-12  
**Status:** **COMPLETE / Closed**  
**Predecessor:** Sprint 74 — Closed (architecture not reopened)  
**Successor at closeout:** Lagrangian Multipliers resource quality investigation → then Settings (**PB-FA-005**)  
**Live successor (2026-08-13):** [Sprint 76 — OPEN](../2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/SPRINT-76-START-HERE.md)  
**Closure companion:** [SPRINT-75-CLOSURE.md](SPRINT-75-CLOSURE.md)  
**Top-level closeout:** [docs/sprints/sprint-75-closeout.md](../../../sprints/sprint-75-closeout.md)  
**Decisions:** [decisions.md](decisions.md)

---

## 1. Sprint objective

Make Prism work as well as possible for eventual users by improving journeys, interactions, and presentation across Create Workflow, My Workflows, Authoring, Prompt Studio, and Prompt Library — under pre-release Compatibility posture and without casually reopening Sprint 74 architecture.

---

## 2. Programme method

Sequential domain discovery (`S75-D02`) with **experience before implementation**: operator observation and real product use as primary evidence; code and tests as supporting evidence. Cross-journey synthesis ([S75-T-020](S75-T-020-cross-journey-ux-evidence-synthesis-and-intervention-framing.md)) informed thin, bounded implementation slices (`S75-D03`–`D08`, etc.).

---

## 3. Create Workflow — delivered

| Theme | Outcome |
| ----- | ------- |
| Product model | One workflow → one product (`S75-D22`); Self-study / Workshop only on LD Create (`S75-D11`) |
| Brief simplification | Essentials-first brief; conditional source material; Supporting materials / Scope constraints removed from LD Create UI |
| Assistant UX | Progressive disclosure; Design disabled until API key with actionable loader (`S75-D23`; amends `S75-D09`) |
| Internal diagnostics | Resolved brief panel removed from Create UI; resolution engine retained (`S75-D24`) |
| Proposal UX | One read-only Proposed workflow table; Save Workflow; Create Draft/Refined retired (`S75-D25`) |
| Safety | Generic Create workflow reviewer retired (`S75-D03`) |

---

## 4. My Workflows — delivered

| Theme | Outcome |
| ----- | ------- |
| Mode defaults | Run default on fresh session; Create save handoff → Run; session mode preserved across tabs (`S75-D10`) |
| Run execution model | Persistent BYO-LLM orientation (`S75-D06`); paste/capture only for page-structure producers (`S75-D07`) |
| Run presentation | Operator-facing step copy; top Previous · Copy · Next bar; compact instructions (`S75-D08`) |
| Progress & state | Segmented step progress and persisted-output indicators — **display-only**; no new completion model (`S75-D27`) |
| Layout | Current-step grouping; Copy placement in execution bar; control groups aligned with Create |
| Validation | Edit-mode false positives reduced (`S75-D05`) |
| Lifecycle | Rename preserves identity; Duplicate = new identity + clean Run; Delete cleanup; Import collision UX; default first visible workflow selection |
| DLA Run guidance | Optional evidence/source-material guidance retained (S72 path); validator false-positive fixes (`S75-D15`, `D16`) |
| Authoring readiness | Continue to Authoring on final Run step; Design Page persisted data gates assembly path (`S75-D04`, `D13`) |

---

## 5. Run persistence — delivered (SETTLED)

Non-destructive merge (`S75-D14`); durable `step.id` across save/reload (`S75-D17`); session-scoped run position with durable captures (`S75-D18`); accepted-capture durability hardening (`S75-D19`, `D20`); **IndexedDB resource-backed payloads** with ref-only runstate (`S75-D21`).

**Do not casually reopen.** Storage management UX remains backlog **PB-FA-007**.

---

## 6. Prompt Studio — delivered

| Theme | Outcome |
| ----- | ------- |
| Output type | Field visibility regression fixed per output type |
| Generate | Progressive disclosure (Define → Refine → Final Prompt); simplified primary surface |
| Modes | **Paste a prompt** / **Generate a prompt** split; Paste default for fresh standalone sessions (`S75-D30`) |
| Paste save | Title, tags, notes, prompt body; `Library.savePrompt({ source: "manual" })`; no Generate brief metadata on paste |
| External AI | Copy brief path retained for Generate mode |
| Persistence | Standalone saves through authoritative Library / IndexedDB path with existing fallback (`S75-D31`) |
| Workflow step | Distinct workflow-step Prompt Studio behaviour preserved (step override path) |

---

## 7. Prompt Library — delivered

| Theme | Outcome |
| ----- | ------- |
| Model | Existing list, search, filters, editor fields, version history **unchanged** |
| Actions | Header grouping: creation/management · selected-prompt · transfer · persistence/destructive (`S75-D32`) |
| Naming | Copy Prompt Body → **Copy prompt**; Save changes → **Save** |
| Hierarchy | Copy prompt primary in selected-prompt group; Use as template and Save relocated from detail pane |

---

## 8. Cross-cutting UI

Compact persistent PRISM status / API disclosure in header (`S75-D26`).

---

## 9. Durable product decisions (closeout)

Recorded in [decisions.md](decisions.md) as `S75-D27`–`S75-D32`. Summary:

- **Custom workflows** — deliberately the advanced/manual authoring route; typical users are expected primarily to **generate and run** workflows; experienced users may create/export for others to import.
- **Run progress** — visual/display-only; do not introduce a separate completion model without a clear requirement.
- **Persisted captures** — distinct from merely having visited a step; indicators reflect durable runstate/resource refs.
- **Prompt Studio** — supports lightweight structured generation **and** straightforward import/paste of prompts developed elsewhere; not assumed to be the primary place for sophisticated iterative prompt development (conversational LLMs often better).
- **Prompt Library** — authoritative reusable-prompt collection; persistence through existing `Library` abstraction, not parallel stores.

---

## 10. Deferred / not in scope

| Item | Authority |
| ---- | --------- |
| Settings implementation | **PB-FA-005** — after Lagrangian investigation |
| Advanced custom-workflow Edit machinery overhaul | Future sprint **if evidence warrants** — not opened here |
| T-020 C-09 / C-11 / C-12 | Deferred |
| QA / refinement lifecycle productisation | **PB-FA-006** |
| Storage management UX | **PB-FA-007** |
| Sprint 76 (at closeout) | **Not opened** on 2026-08-12; **opened 2026-08-13** as DLA / content-quality consistency |

---

## 11. Next priorities

### Priority 1 — Lagrangian / DLA investigation → Sprint 76

At Sprint 75 closeout, the next programme was a **Lagrangian Multipliers resource quality investigation** (diagnose before changing generation). Post-closeout evidence bounded a DLA / task–material / consistency problem and formally opened **Sprint 76** (2026-08-13).

Live pack: [SPRINT-76-START-HERE.md](../2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/SPRINT-76-START-HERE.md). Historical investigation framing remains valid: distinguish source weakness · workflow/design weakness · prompt weakness · upstream artefact propagation · model variance · QA calibration · genuine pedagogical/content-quality problems — improve underlying quality, not merely raise a benchmark score.

### Priority 2 — Settings

After the Sprint 76 decision gate, move to Settings (**PB-FA-005**). Do not begin during Sprint 75 closeout.

---

## 12. Testing

### Authoritative Sprint 75 regression batch (closeout verification)

```text
tests/s75-prompt-library-action-layout.test.js
tests/s75-prompt-studio-generate-paste-modes.test.js
tests/s75-prompt-studio-generate-ux.test.js
tests/s75-prompt-studio-progressive-disclosure.test.js
tests/s75-prompt-studio-library-save-alignment.test.js
tests/s75-prompt-studio-output-type-visibility.test.js
tests/s75-workflow-import-collision-roundtrip.test.js
tests/workflow-persistence-pass2.test.js
```

**Result:** **114 / 114 pass** (2026-08-12).

### Extended Sprint 75 suite

Full `tests/s75-*.test.js` glob: **one failure** — `s75-d26-compact-prism-status-control.test.js` expects stale cache-bust `20260812-s75-ps-progressive` while `index.html` uses `20260812-s75-library-actions`. Test maintenance only; **not fixed during closeout**.

### Separate check — upstream Design Page prompt test

`tests/workflow-design-page-upstream-prompt.test.js`: **3 / 3 pass** at closeout. A prior reported failure involving `visual_need` was **not reproduced** in the current repository state.

---

## 13. Operator verification before commit

- Browser smoke: Create → Save → My Workflows Run → capture persist → Authoring assemble  
- Prompt Studio Paste and Generate modes; Library header actions  
- Confirm documentation handover reads clearly for a fresh session

---

## 14. Documentation artefacts

| Document | Role |
| -------- | ---- |
| [SPRINT-75-CLOSURE.md](SPRINT-75-CLOSURE.md) | Closure record |
| [HANDOVER.md](HANDOVER.md) | Immediate next-session instruction |
| [next-chat-briefing.md](next-chat-briefing.md) | Pasteable continuation brief |
| [STATUS.md](STATUS.md) | Dashboard — **COMPLETE** |
| [decisions.md](decisions.md) | Full decision log through `S75-D32` |
