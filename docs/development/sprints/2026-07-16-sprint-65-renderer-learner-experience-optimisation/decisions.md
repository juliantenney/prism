# Sprint 65 — Decision Log

| ID | Date | Decision | Status |
| -- | ---- | -------- | ------ |
| S65-D00 | 2026-07-16 | Open Sprint 65 as an implementation-oriented **renderer** sprint; evidence-led; audit before code | Accepted |
| S65-D01 | 2026-07-16 | Sprint 65 will use only fields already available to the production renderer | Accepted |
| S65-D02 | 2026-07-16 | Sprint 65 will **not** implement Sprint 64 preservation findings or merge experimental envelopes | Accepted |
| S65-D03 | 2026-07-16 | The RNA-virus page is the **initial reference case**, not the sole acceptance case | Accepted |
| S65-D04 | 2026-07-16 | Activity differentiation must communicate instructional function, not merely visual variety | Accepted |
| S65-D05 | 2026-07-16 | Missing optional fields must produce a coherent reduced experience, not empty labelled blocks | Accepted |
| S65-D06 | 2026-07-16 | Developer diagnostics must remain observable but must not dominate the learner-facing page | Accepted |
| S65-D07 | 2026-07-16 | No production hardening occurs before a bounded prototype and cross-sample validation | Accepted |
| S65-D08 | 2026-07-16 | First task locked = S65-BL-001 baseline learner-experience audit (documentation only) | Accepted |
| S65-D09 | 2026-07-16 | Baseline HTML capture convention: production renderer via sprint `samples/capture-baseline-render.js`; store under `samples/rna-hcv-baseline-render.html` (+ assessment companion); record command/entry/git in `*.capture.json` | Accepted |
| S65-D10 | 2026-07-16 | Classification: fixture marker/Criterion ID strings are **content/fixture** (F1/C1), not renderer-invented diagnostics; `details.util-meta` / production metadata are **D1** (developer residue) | Accepted |
| S65-D11 | 2026-07-16 | Reject provisional “Body” label finding for the RNA baseline capture; track type-label / fixture-title residue as S65-F04b instead | Accepted |
| S65-D12 | 2026-07-16 | Signal model uses four layers separately: raw artifact · normalised · renderer consumption · learner manifestation | Accepted |
| S65-D13 | 2026-07-16 | Safe-use classes S1–S6 adopted for Sprint 65 signal inventory (stable / optional / context / diagnostic / content-owned / unavailable) | Accepted |
| S65-D14 | 2026-07-16 | Archetype may be used later only as a **bounded S3 presentation cue** when present — not as shell driver and not as licence to invent plan depth | Accepted |
| S65-D15 | 2026-07-16 | `plan_beat_index` / `instructional_function` require explicit validation before any Sprint 65 use; absent in inventory samples and unsafe to assume | Accepted |
| S65-D16 | 2026-07-16 | Diagnostic / metadata fields (schema_version, assembly_state, PrismRenderNormalized, generation diagnostics) are **S4** — excluded from learner activity-contract design | Accepted |
| S65-D17 | 2026-07-16 | Preferred learner activity contract = Composition C (consolidated brief + bounded archetype cues); absent archetype falls back to Composition B (Recommendation 3) | Accepted |
| S65-D18 | 2026-07-16 | Precedence: Produce uses expected_output only; Check uses checklist only; Why = preamble ± bridge; Approach = reasoning; Reflect = self-explanation; extra PEL cues progressive | Accepted |
| S65-D19 | 2026-07-16 | Residual / unmatched / unknown materials remain visible inside Support; never suppressed for archetype fit; not left after Check solely due to registry gaps | Accepted |
| S65-D20 | 2026-07-16 | Omission rule: missing optional contract slots omit the section entirely — no empty headings, no filler, no inferred content | Accepted |
| S65-D21 | 2026-07-16 | Shared core contract slots locked for manifestation: Header → Why → Task → Produce → Approach → Support → Check → Reflect/Extend (omit empty) | Accepted |
| S65-D22 | 2026-07-16 | Permitted archetype variation limited to mode label, verb, support emphasis/order, verification emphasis, reflect/extend placement, restrained icons-with-text | Accepted |
| S65-D23 | 2026-07-16 | Fallback for missing/unsupported/malformed/unknown archetype = Composition B (no mode variation); never infer archetype from task wording | Accepted |
| S65-D24 | 2026-07-16 | Material role wins over archetype for semantic placement; archetype may only change emphasis (S65-MR-015) | Accepted |
| S65-D25 | 2026-07-16 | Residual policy: classify → Try it before Check → Extend after Check → Also available; never suppress (S65-MR-021) | Accepted |
| S65-D26 | 2026-07-16 | Unknown/unregistered material types remain visible with title+body under Also available or Try it if workspace-like (S65-MR-023) | Accepted |
| S65-D27 | 2026-07-16 | Core slot headings stay generic; support sub-labels may vary by archetype; avoid raw type names and fixture-test titles as learner headings | Accepted |
| S65-D28 | 2026-07-16 | Progressive disclosure for extra PEL cues; one Task / one Produce / one Check region on rich inputs | Accepted |
| S65-D29 | 2026-07-16 | Accessibility: text mode cue; no colour-only differentiation; semantic lists/tables; focus follows reading order; print retains meaningful order | Accepted |
| S65-D30 | 2026-07-16 | Preferred page architecture = **Recommendation 4 — Adaptive hybrid** (essential orientation + journey before activities; reference/tips disclosed or deferred by field-presence proxies) | Accepted |
| S65-D31 | 2026-07-16 | First-viewport principle: identity → concise orientation → journey/start cue → path to first activity; not KS/tips/diagnostics wall | Accepted |
| S65-D32 | 2026-07-16 | Overview = coverage/organisation; purpose = why/transferable understanding; do not blind-merge; do not reprint overview as journey body | Accepted |
| S65-D33 | 2026-07-16 | Learning outcomes: do not assume primary chrome (currently meta-folded); if chrome-eligible later, Destination under orientation | Accepted |
| S65-D34 | 2026-07-16 | Knowledge summary: retain full source; default collapsible/deferred reference when other orientation exists; omit when absent | Accepted |
| S65-D35 | 2026-07-16 | Journey: titles/order/optional duration/mode; no invented progress; no beat enums; no overview reprint; assessment anchor when page-level assessment exists | Accepted |
| S65-D36 | 2026-07-16 | Page-level assessment after instructional activities; answers collapsed by default unless product intent says otherwise; no guessed activity linkage | Accepted |
| S65-D37 | 2026-07-16 | Study tips / consolidation after instructional sequence (after assessment on assessment-led pages) | Accepted |
| S65-D38 | 2026-07-16 | Metadata/diagnostics remain gated and developer-observable; excluded from primary chrome and default print | Accepted |
| S65-D39 | 2026-07-16 | Progressive disclosure for KS/outcomes/tips/answers/meta; never hide task or expected output by default; print expands learner-relevant collapsed content | Accepted |
| S65-D40 | 2026-07-16 | Mobile: prefer stacked journey; print: fixed order independent of interactive state; no colour-only page meaning | Accepted |
| S65-D41 | 2026-07-16 | Learner material-role taxonomy locked to 7 roles: Idea, Example, Evidence, Try it, Check, Extend, Also available (label variants allowed) | Accepted |
| S65-D42 | 2026-07-16 | Preferred material presentation = **Option C — Beat-and-role hybrid** | Accepted |
| S65-D43 | 2026-07-16 | Precedence: type-derived learner-use role > broad beat label for semantic identity; valid beat order preserved for assigned materials; role > archetype | Accepted |
| S65-D44 | 2026-07-16 | Title policy: meaningful source title > role label; type-equal and fixture-test titles not preferred learner headings; originals kept for diagnostics | Accepted |
| S65-D45 | 2026-07-16 | Residual / orphan / unknown always visible; learner-work residuals before Check; Extend after Check; Also available for unclear; no invented beat membership | Accepted |
| S65-D46 | 2026-07-16 | Merge consecutive same-role groups only; never merge different learner actions | Accepted |
| S65-D47 | 2026-07-16 | Tables: Try it (complete) vs Idea (reference_table inspect); overflow scroll; no column drop; planning_table = Try it even if unregistered | Accepted |
| S65-D48 | 2026-07-16 | Checklist under Check as lists; ≠ Produce; sample_output is Example/model product not auto answer key; transfer material > duplicate prompt after Check | Accepted |
| S65-D49 | 2026-07-16 | Progressive disclosure: never default-collapse required Try it; MAY collapse long Idea/Also/sample products; accessible controls; print expands | Accepted |
| S65-D50 | 2026-07-16 | Mobile single-column role stack; print preserves learner-use order independent of UI state; no colour-only role signalling | Accepted |

Schema redesign, GAM redesign, and production preservation remain **out of scope / not authorised**.  
S65-D17–D50 authorise design through **S65-BL-007 prototyping** — not production hardening (S65-D07).
