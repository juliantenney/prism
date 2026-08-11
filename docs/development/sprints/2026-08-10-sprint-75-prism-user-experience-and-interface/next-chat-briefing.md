# Sprint 75 — Next-chat briefing

**Audience:** Fresh ChatGPT product/design conversation (not a coding-agent handover).  
**Pack status:** **OPEN** · Sprint **76 not opened**  
**Latest Create decision:** [S75-D25](decisions.md#s75-d25--create-proposed-workflow-one-graph-read-only-preview)  
**Create UX pass:** **COMPLETE** for this Sprint 75 pass  
**Persistence:** **SETTLED** (`S75-D21`) — do not reopen  
**Next review:** **My Workflows** — start with **functional / operator audit**, then UI simplification  

Paste this briefing (plus STATUS / decisions excerpts as needed). Operator will supply screenshots and walkthrough notes.

---

## What not to do in the new chat

- Do **not** restart Sprint 75 Create analysis from scratch.  
- Do **not** reopen Run-capture persistence / IndexedDB migration.  
- Do **not** reopen Duplicate “should it inherit Run state?” — **clean Run state** is decided.  
- Do **not** implement Settings redesign yet (major review **after** My Workflows → **PB-FA-005**).  
- Do **not** open Sprint 76.

---

## DONE (this pass)

### Create UX — COMPLETE

Final Create journey:

1. Describe intent (simplified LD brief)  
2. PRISM resolves what it can **internally**  
3. Assistant elicits only **genuinely required** missing information  
4. Generate **one** workflow  
5. Inspect **Proposed workflow** (read-only)  
6. **Save Workflow**

Established Create principles:

- **One workflow → one product**  
- Keep Create simple; do not front-load detailed choices users may not understand  
- Essentials → Create elicitation; deliberate detail → **Settings**  
- Factor resolution/provenance is important **internally**, not normal user-facing UI  
- Unresolved required factors → natural-language assistant questions  
- One generated graph — **not** Draft/Refined versions  
- Proposed workflow = inspection, **not** a graph editor  
- Create-time Delete / title / role editing **retired**  
- Meaningful endpoint = **Save Workflow**

Final Proposed workflow UI:

- Compact read-only table: Step (~9%) · Workflow step (~53%) · Purpose (~38%)  
- No Delete · no editable title/role · no Tunable badges · no Draft/Refined · no repeated Settings row copy  
- Button: **Save Workflow**

### Persistence — SETTLED

Authoritative model:

| Layer | Role |
| ----- | ---- |
| `PRISM_WORKFLOW_RESOURCES` / IndexedDB | Run capture **payloads** |
| `promptr.workflows.runstate.v1` (localStorage) | Lightweight **refs** + metadata |
| `promptr.runCaptureStorageVersion` ≥ **2** | Normal **ref-backed** runtime |

Also settled: operator data migrated; DLA / GAM / Authoring assembly operator-verified; temporary migration/diagnostic controls removed; **no automatic user-data deletion**; pressure/write-failure protections retained.

**Historical lesson:** Large Run captures had been stored in constrained localStorage despite an IndexedDB-backed resource store — that caused the quota failure. Fixed by moving payloads to IndexedDB. Future storage **UX** → **PB-FA-007** (not persistence redesign).

### Other Sprint 75 product work already shipped (context)

Cross-journey slices and Run/Authoring fixes through `S75-D21` (handoff, Run orientation, capture relevance, validation false positives, Authoring readiness, capture durability/migration, etc.). See [decisions.md](decisions.md) / [STATUS.md](STATUS.md). Generic Create “Review & suggest improvements” retired (`S75-D03`).

---

## ESTABLISHED PRODUCT DECISIONS (Create)

| ID | Significance |
| -- | ------------ |
| **S75-D22** | One workflow → one product; simplified LD brief; conditional Source material; ambiguous multi-product / constraint fields removed from LD Create |
| **S75-D23** | Assistant progressive disclosure; Design disabled until API key; actionable key prerequisite; no Idle/empty chrome; answer UI only when awaiting input |
| **S75-D24** | Resolved workflow brief **off** Create UI; resolution/provenance **kept** internally; assistant is the user-facing expression of unresolved factors |
| **S75-D25** | Draft/Refined Create chrome retired; one graph; compact read-only Proposed workflow; Create graph editing retired; Save always saves that proposal (+ table proportions / **Save Workflow** polish) |

### Elicitation → Settings model (preserve for later)

PRISM once explored two-stage elicitation (basics, then granular post-generation refinement). That bogged Create down, exposed too many premature choices, and duplicated what Settings should do deliberately.

**Intended model now:**

| Surface | Job |
| ------- | --- |
| **CREATE** | Intent + essentials + generation + inspect proposal + Save |
| **SETTINGS** | Detailed parameterisation after Save |
| **Saved-workflow editing** | Legitimate graph/config editing where supported |
| **RUN** | Execute |
| **AUTHORING** | Assemble / use generated output |

Create Draft/Refined were **identical twin copies**, Create-time only — My Workflows / Run / Authoring do **not** understand them. Dormant pack `post_generation_refinement` / profiles remain for later **Settings / PB-FA-005** cleanup — do not casually delete.

**ONE WORKFLOW → ONE PRODUCT** remains authoritative. Future Authoring may compose smaller products into larger ones (e.g. slideshow into a learner page) — that is **composition**, not Create multi-product selection. Slideshow extensibility test → **PB-FA-008**.

---

## KNOWN DEFECTS (My Workflows-relevant)

| Item | Status |
| ---- | ------ |
| **Rename** | **Known defect:** currently appears to create a **duplicate** instead of renaming in place. **Expected contract:** same workflow identity; retain associated state/resources appropriately; **must not** create another workflow. Fix during My Workflows work. |
| **Delete** | Needs audit: definition, runstate, IndexedDB workflow-owned resources, orphans. |
| **Import / Export** | Needs audit: contents, Settings, resources, Run state, identity, round-trip. |
| Orphaned runstate / storage pressure UX | Backlog **PB-FA-007** / research **PB-R-008** — not silent auto-delete. |

### Duplicate — contract already decided

**Duplicate creates a NEW workflow identity and starts with CLEAN Run state/captures.** Do not reopen inheritance of Run state.

### Identity warning

CRUD must respect: workflow ID, step IDs, Settings/config, Run capture refs, IndexedDB resources, runstate metadata, authoring/resource links. Rename ≠ new identity; Duplicate = new identity + clean run; Delete must not silently destroy unrelated user data; Import must avoid inappropriate identity collision / state inheritance.

---

## BACKLOG / DEFERRED (do not duplicate items)

| ID | Topic |
| -- | ----- |
| [PB-S-005](../../../backlog/PRODUCT-BACKLOG.md#pb-s-005--stable-release--development-process) | Stable release / development process (incl. cache-bust) |
| [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency) | Settings / parameterisation source-of-truth + Settings IA (+ dormant refinement cleanup) |
| [PB-FA-007](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-007--user-controlled-storage-management) | User-controlled storage management (usage/capacity bar, warnings, explicit cleanup, no silent deletion) |
| [PB-FA-008](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-008--first-class-slideshow-product--architecture-extensibility-test) | First-class Slideshow / product extensibility under one-product rule |
| [PB-FA-009](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-009--research-domain-pack-maturation) | Research domain pack maturation |
| [PB-R-008](../../../backlog/PRODUCT-BACKLOG.md#pb-r-008) | Orphan-resource cleanup research |
| [PB-FA-006](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-006--qa--workflow-and-resource-refinement-lifecycle) | Future QA / refinement lifecycle (after `S75-D03`) |

Deferred T-020 slices **C-09** (Save / update / duplicate semantics clarity) / **C-11** / **C-12** remain deferred. **C-09 is not the same issue as** the known My Workflows **Rename** defect (Rename must preserve identity); the forthcoming audit may determine whether they share a cause — that question is not decided here.

---

## NEXT REVIEW AREA — My Workflows

Unlike Create, begin with a **functional audit** (stateful lifecycle), then simplify UI.

**Walkthrough targets:** selection; Run / Edit / Settings modes; switching; refresh/reload; Rename; Duplicate; Delete; Import; Export; Save/update; identity; runstate/resource relationships; other management controls found live.

**Then (later major review): Settings** — strategically important because Create simplification moved granular tuning there (**PB-FA-005**): IA, terminology, needed controls, discoverability, source of truth, Run propagation, dormant refinement, weak constraint→Run, `session_materials` / product semantics.

---

## UI review method (keep using)

Not cosmetic-only. For each area ask:

- What is the user trying to accomplish?  
- What decisions can they meaningfully make?  
- What information do they need?  
- Is PRISM exposing internal implementation unnecessarily?  
- Is historical UI still present after its purpose disappeared?  
- Does a control do what its label implies?  
- Can complexity be hidden without removing capability?

Stop polishing when the journey is **coherent** and remaining changes are subjective taste rather than usability / product-model fixes. Positive outcome so far: PRISM is simpler to use while retaining substantial internal complexity.

---

## First move for this conversation

Acknowledge Create complete + persistence settled → start **My Workflows functional audit** with operator screenshots/observations → treat Rename defect and Duplicate-clean-state as given → park Settings for the subsequent major review.
