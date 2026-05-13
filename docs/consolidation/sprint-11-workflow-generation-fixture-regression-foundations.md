# Sprint 11 — Workflow Generation Fixture & Regression Foundations

**Document type:** Sprint **charter** (documentation only — **this file does not start implementation**)  
**Status:** **Not started** — implementation, fixture files, and harness code **may** begin only after an explicit pass approval against this charter (or a superseding charter revision).  
**Date (charter):** 2026-05-12  
**Upstream:** Sprint 10 **canonical** contract audit `docs/consolidation/sprint-10-contract-audit.md` (committed **`3bd6d10`**); Sprint 10 bootstrap framing `docs/consolidation/sprint-10-workflow-brief-contract-rationalisation-bootstrap.md`; Sprint 09 closure `docs/consolidation/sprint-09-pass-1-closure.md`.

---

## 1. Purpose

Establish **narrow, behaviour-preserving** fixture and regression **foundations** for the **workflow-generation contract surface** (as defined in Sprint 09 governance and enumerated in the Sprint 10 audit) **before** any chartered **contract rationalisation** (prefix unification, factor-id changes, prompt rewrites, pack rewrites, or persistence migrations).

Sprint 11 exists so that **future** contract work can be **detected**, **scoped**, and **rolled back** with a **recorded baseline** of today’s outputs and I/O shapes — without yet changing those contracts.

---

## 2. Rationale from Sprint 10 audit

The Sprint 10 audit (`docs/consolidation/sprint-10-contract-audit.md`) documents, among other things:

- **Multi-channel** brief-shaped text (**BL-***, **F-INT**, **RC-***, **WS-***, **PF-***, **RM-***) — same semantics, **different** prefixes and assembly paths (§3, §5.6–5.7).
- **Split authority** between `briefLines` / `base` objects, **`extractWorkflowBriefExplicitFactors`**, **`workflowGenerationContext.js`** (file load order, first-structured-domain brief config), **`applyWorkflowDesignHeuristics`**, and persistence gather vs design-save paths (§4–§8, §6.17, §8.9).
- **High blast radius** for seemingly small string or ordering changes because of **cached pack text**, **implicit** reader behaviour (`normalizeWorkflowForV1`), and **parallel** test/assertion families (§5, §6, §9–§10).

**Interpretation for this charter:** regression protection for workflow generation is **not** adequately implied by ad hoc tests that assert **only one** channel (e.g. step titles alone). A **deliberate** fixture and regression layer — still **observing** current behaviour — reduces the risk that a **later** sprint accidentally ships **silent** drift across extraction, prompts, import/export, or reload.

This charter **does not** adopt the audit’s migration-option families (§11) or synthesis tables as a work plan; it **only** uses them as **risk context** for **what to pin** in fixtures.

---

## 3. Scope

**In scope** (when implementation is approved and executed under this charter):

- **Golden / canonical inputs** for workflow briefs: documented shapes for `briefLines` arrays (and equivalent `base` snapshots where tests inject Factory state) covering **minimal**, **full**, and **edge** cases — aligned to audit rows (e.g. ordering, conditional lines, merged constraint paths) **without** renaming prefixes or factor ids.
- **Extraction output fixtures** (or documented expected JSON shapes): stable snapshots of **`extractWorkflowBriefExplicitFactors`** (and related resolution steps) for **fixed** inputs — **observing** current behaviour.
- **Prompt-context excerpt snapshots**: bounded, **redacted** excerpts of **`buildWorkflowGenerationContext`** / design-pipeline user message material sufficient to detect **order**, **section headers**, and **file-list** changes — not full production prompts unless explicitly justified.
- **Import / export round-trip fixtures**: small, versioned **bundle** JSON (or documented canonical bundle shapes) exercising **`normalizeWorkflowForV1`**, merge behaviour, and **`newerWins`**-style paths as described in §8 — **as implemented today**.
- **Saved workflow reload fixtures**: persisted workflow objects (or slices) that round-trip **load → save** paths relevant to **`workflowBriefResolution`**, gather-save vs design-save **subset** differences (§8.9) — **documented** as separate cases where paths diverge.
- **Cross-domain fixture coverage**: at least **documented** matrix entries for **general + learning-design**, **general + research**, and **ordering** / **first structured domain** behaviour (§6–§7) — implemented as tests **or** as a **manual regression matrix** in sprint docs if automated harness is deferred.
- **Lightweight test harness** **or** **documentation-backed regression checks**: either minimal automated tests (existing stack permitting) **or** a repeatable **checklist + artefact** process recorded in sprint notes — charter allows **either** path as long as exit criteria are met.

**Out of scope for Sprint 11 execution** (see §4): anything that **changes** contract semantics, pack content, renderer, sequencing, or engine architecture.

---

## 4. Explicit non-goals

Sprint 11 **must not** (unless a **separate** sprint charter explicitly authorises it):

- **Semantic renaming** of author-facing strings where those strings are **contract-coupled** (Sprint 09 boundary: not “UI copy only”).
- **Factor id changes**, mapping rule changes, or **`workflowBriefConfig`** structural edits in domain packs.
- **Prompt contract changes**: `briefLines` prefix edits, synthetic **F-INT** line rewrites, step-context scaffolding changes, or generator template edits that alter model-visible text.
- **Domain-pack rewrite** or broad taxonomy / heading / JSON block edits.
- **Renderer redesign** or learner-surface layout overhaul.
- **Sequencing engine redesign** or run-mode state-machine changes.
- **Broad workflow-engine rewrite** (orchestration model, step graph semantics).
- **Persistence schema migration** (new top-level workflow array version, field renames, mandatory new persisted keys) **unless** separately chartered with explicit compatibility and rollback rows.

Sprint 11 **may** add **test-only** shims, helpers, or **documentation** that **reference** production paths — it **must not** use fixtures as cover to slip contract edits into the same change set without a **contract table** and charter (per Sprint 10 bootstrap **audit-before-diff** posture).

---

## 5. Candidate implementation areas

**Candidates only** — no line-level mandate; pick under pass planning:

| Area | Intent | Notes |
|------|--------|--------|
| Test module layout | Group fixtures by **channel** (briefLines vs WGC excerpt vs extraction JSON vs export bundle) per audit §5–§6 | Avoids single-surface false confidence |
| `extractWorkflowBriefExplicitFactors` | Deterministic inputs → snapshot or deep-equal on **subset** of keys material to heuristics | Redact or omit volatile timestamps |
| `workflowGenerationContext.js` | Stub **`fetch`** / inject manifest + file text per §6.17 fixture notes | Assert order: platform → domain → brief |
| Import / export | Golden **minimal** and **library-mixed** bundles | Align to §8.1–§8.3 behaviour-as-documented |
| `normalizeWorkflowForV1` | Input fixture → normalised output fixture | No new migration rules in Sprint 11 |
| Manual regression doc | Markdown table: scenario, steps, expected **observable** | Satisfies charter if automation deferred |

**This charter does not create files** in the repository for the above; it **authorises** a future pass to add them under agreed naming and location conventions recorded at **implementation kickoff**.

---

## 6. Compatibility posture

- **Baseline = current production behaviour** (post Sprint 09 **`3d88600`** / **`4b9f5ca`** governance record, post Sprint 10 audit snapshot). Fixtures **encode** that baseline; they **do not** define a **new** normative spec.
- **Sprint 09’s** UI vs **workflow-generation contract** split **remains**: Sprint 11 work **touches** contract **observability** (tests/docs) — **not** Sprint 09’s “display-only copy” lane unless tests are clearly isolated from contract assertions.
- **No silent migration:** fixture baselines **must** be **reviewed** when intentional contract work lands in a **future** sprint; Sprint 11 only **prepares** that comparison.
- **Import/export** and **`normalizeWorkflowForV1`**: assertions follow **documented** merge and soft-migration behaviour (§8); no new reader/writer version flags in Sprint 11 unless separately chartered.

---

## 7. Fixture strategy

1. **Channel tagging** — each fixture or snapshot document states which audit channel it pins (e.g. **BL-***, **PA-WGC**, **PA-EXTRACT** family from §5.1).
2. **Stability rules** — prefer **stable ordering** in inputs (domain list, manifest file order, `selectedDomains`) as audit §6–§7 notes **first-wins** and order sensitivity.
3. **Redaction** — prompt excerpts: remove or replace secrets; truncate long pack bodies with checksum or length metadata where full text is impractical.
4. **Cross-domain matrix** — minimum **documented** combinations: general-only; general + LD; general + research; order permutations **if** behaviour differs — per §7.8 / §8.4.
5. **Save-path duality** — where §8.9 documents divergent durable subsets, **separate** fixture families or checklist rows for **Factory design save** vs **Workflows gather-save** — **observe**, do not “fix” in Sprint 11.
6. **Future candidate files** — **not created by this charter**; a future implementation log **may** propose paths such as `tests/fixtures/workflow-generation/` or equivalent **after** pass approval (exact tree TBD at kickoff).

---

## 8. Regression strategy

- **Primary signal:** **deterministic** comparisons on **chosen** outputs (extraction JSON subset, normalised workflow shape, excerpt hash or normalised string).
- **Secondary signal:** extended **manual smoke** checklist derived from Sprint 09 smoke plus audit-cited paths (**design-from-brief**, **run-mode** excerpt boundaries) — **documentation-backed** if automation is thin.
- **Regression scope boundary:** failures **flag** drift; they **do not** mandate immediate product fixes — triage distinguishes **intentional** future charter work from **bugs**.
- **Cross-sprint:** when a later sprint changes a pinned surface, **update** fixtures in the **same** delivery or explicitly mark deprecated baselines in the implementation log.

---

## 9. Risks

| Risk | Mitigation |
|------|------------|
| Fixtures **flake** on timing, fetch, or non-deterministic IDs | Fix seeds, stub network, strip volatile fields from snapshots |
| Fixtures **ossify** incorrect legacy behaviour | Charter review + comment blocks referencing audit § and “known quirk” |
| **False confidence** from single-channel tests | §7 channel tagging + matrix coverage |
| **Scope creep** into contract fixes “while we’re here” | §4 non-goals + separate contract table for any semantic change |
| **Large** prompt snapshots unmaintainable | Prefer excerpts + structural checks (headers, path list) over full bodies |
| Manual-only path **not repeated** | Versioned checklist doc + dated sign-off in sprint log |

---

## 10. Verification plan

| Stage | Verification |
|-------|----------------|
| **During pass** | CI (if applicable) runs new/updated tests; **or** peer review of checklist artefacts |
| **Pre-merge** | No edits under Sprint 09 “frozen” contract **semantics** (prefixes, factor ids, pack source) without escalation |
| **Post-merge** | Sprint 09–class smoke still passes; optional extended smoke per §8 |
| **Documentation** | Short **implementation log** entry listing fixture families added and channels covered |

**This charter does not** prescribe tooling (e.g. specific test runner version); project defaults apply.

---

## 11. Entry criteria

- Sprint 10 **canonical** audit read and acknowledged by implementers (`docs/consolidation/sprint-10-contract-audit.md`).
- Sprint 09 closure and **contract surface** list understood (`docs/consolidation/sprint-09-pass-1-closure.md`).
- **Pass scope** agreed (which rows from §7 fixture matrix **first**, automation vs manual split).
- **No** parallel unchartered contract edits in flight.

---

## 12. Exit criteria

- **At least one** of: (a) meaningful automated regression tests merged, or (b) a **dated** manual regression matrix + golden input/output artefacts in **docs** approved for the pass.
- Fixture / checklist coverage explicitly spans **two or more** audit channels (e.g. briefLines-derived **and** extraction **or** import round-trip — not step titles alone).
- **Cross-domain** cases **documented** and at least one **executed** (test or signed manual run).
- **Implementation log** (consolidation or sprint pack) records what was pinned and **confirms** no §4 non-goals were violated.
- **Still true:** no implementation of contract **rationalisation** (renames, id changes, prompt rewrites) within Sprint 11.

---

## 13. Governance notes

- This document is a **charter** for a **possible** next **implementation-oriented** sprint; it **does not** supersede Sprint 09’s **contract-boundary governance** or Sprint 10’s **audit-only** posture.
- **`docs/consolidation/sprint-10-contract-audit.md`** remains the **canonical** architectural evidence; Sprint 11 **consumes** it — it does **not** extend audit scope.
- Any **future** contract semantic change remains subject to **explicit charter / pass approval** and **audit-before-diff** rows (per Sprint 10 bootstrap).
- **`docs/development/current-state.md`** **may** be updated when Sprint 11 is **opened** or **closed** — **not** implied by the existence of this charter alone.

---

## Related artefacts

- `docs/development/sprints/2026-05-13-sprint-11-workflow-generation-fixture-regression-foundations/HANDOVER.md` — pack handover snapshot (canonical kickoff below)
- `docs/development/sprints/2026-05-13-sprint-11-workflow-generation-fixture-regression-foundations/SPRINT-CONTEXT.md` — sprint status and links
- `docs/development/sprints/2026-05-13-sprint-11-workflow-generation-fixture-regression-foundations/CURRENT-STATE.md` — programme snapshot pointer
- `docs/development/sprints/2026-05-13-sprint-11-workflow-generation-fixture-regression-foundations/context-files/` — lightweight continuity mirrors (not a second audit copy)
- `docs/development/session-handovers/2026-05-13-sprint-11-kickoff.md` — implementation entry handover (**not started** gate)
- `docs/development/sprints/2026-05-13-sprint-11-workflow-generation-fixture-regression-foundations/GPT-BOOTSTRAP-PROMPT.md` — fresh-chat bootstrap
- `docs/consolidation/sprint-11-fixture-candidate-inventory.md` — candidate fixture categories (documentation only)
- `docs/consolidation/sprint-11-working-checklist.md` — **preparation** checklist (this charter → operational tasks; **no** implementation by checklist alone)
- `docs/consolidation/sprint-10-contract-audit.md` — evidence §§3–8; synthesis §§9–12  
- `docs/consolidation/sprint-10-workflow-brief-contract-rationalisation-bootstrap.md` — goals, risks, suggested fixture ideas  
- `docs/consolidation/sprint-09-pass-1-closure.md` — frozen contract surface  
- `docs/development/current-state.md` — programme continuity  

## Review log

- **2026-05-13** — **Portable sprint pack aligned** with Sprint 09 / Sprint 10 layout: `HANDOVER.md`, `SPRINT-CONTEXT.md`, `CURRENT-STATE.md`, `context-files/` under `docs/development/sprints/2026-05-13-sprint-11-workflow-generation-fixture-regression-foundations/`; implementation **not started**; **tomorrow** = pass-scope confirmation (§§11–12).
- **2026-05-13** — **Readiness review (documentation):** Related artefacts link kickoff handover + Sprint 11 `GPT-BOOTSTRAP-PROMPT.md`; alignment with working checklist / `current-state.md` **not started** gate.
- **2026-05-12** — **Fixture candidate inventory added:** `docs/consolidation/sprint-11-fixture-candidate-inventory.md` (documentation only).
- **2026-05-12** — **Working checklist added:** `docs/consolidation/sprint-11-working-checklist.md` (preparation only; links from Related artefacts).
- **2026-05-12** — **Charter created** (documentation only): Sprint 11 scope, non-goals, strategies, criteria; **no** implementation started; **no** fixture files added by this charter.
