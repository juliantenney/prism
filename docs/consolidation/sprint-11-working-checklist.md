# Sprint 11 — Working checklist (preparation)

**Purpose:** Turn the Sprint 11 **charter** into **implementation-ready preparation** tasks. **Not** implementation: no code, no tests, no fixture files are created by completing this checklist alone.

**Status:** Preparation — Sprint 11 **not started** until pass scope is agreed (`docs/consolidation/sprint-11-workflow-generation-fixture-regression-foundations.md` §§11–12).

**References:** Charter `docs/consolidation/sprint-11-workflow-generation-fixture-regression-foundations.md` · Fixture inventory `docs/consolidation/sprint-11-fixture-candidate-inventory.md` · Audit `docs/consolidation/sprint-10-contract-audit.md` · Continuity `docs/development/current-state.md` · Portable pack `docs/development/sprints/2026-05-13-sprint-11-workflow-generation-fixture-regression-foundations/` (`HANDOVER.md`, `SPRINT-CONTEXT.md`, `CURRENT-STATE.md`, `GPT-BOOTSTRAP-PROMPT.md`, `context-files/`)

---

## 1. Entry checks

- [ ] Sprint 11 **charter** read; **§4 non-goals** acknowledged by everyone who will touch the pass.
- [ ] Sprint 10 **canonical audit** skimmed for **§§3–8** (inventories) relevant to chosen pass slice; **§§9–12** understood as synthesis, not new runtime spec.
- [ ] Sprint 09 **closure** read (`docs/consolidation/sprint-09-pass-1-closure.md`) — **contract surface frozen** list understood.
- [ ] **Pass scope** written down (one page max): automation vs manual-first, **first** channel pair to pin, **out** of scope for this pass.
- [ ] **No** parallel branch doing contract renames / factor ids / pack edits without a separate charter.
- [ ] **Baseline** recorded: product commit hash (or tag) fixtures will observe — **no** moving baseline mid-pass without log entry.

---

## 2. Read-first files

**Governance / planning**

- [ ] `docs/consolidation/sprint-11-workflow-generation-fixture-regression-foundations.md` (charter — **read first**; §§11–12 entry/exit)
- [ ] `docs/consolidation/sprint-11-fixture-candidate-inventory.md` (candidate categories, costs, sensitivity)
- [ ] `docs/consolidation/sprint-10-contract-audit.md` (at minimum §§3.1, 4.1–4.3, 5.1, 5.6, 6.1–6.7, 6.17, 7.8, 8.1–8.4, 8.9, 9.2)
- [ ] `docs/consolidation/sprint-09-pass-1-closure.md`
- [ ] `docs/development/current-state.md` (**Next Active Focus**)

**Runtime references (read-only; paths typical for this repo)**

- [ ] `app.js` — call sites named in audit for `briefLines`, extraction, design generation, import/export, `normalizeWorkflowForV1` (use audit line hints + search).
- [ ] `workflowGenerationContext.js` — public API, `buildWorkflowGenerationContext`, manifest/load order.
- [ ] `library.js` — if import/export fixtures include Prompt Library payloads.
- [ ] `domains/domain-manifest.json` + selected manifest-listed pack paths used in pass scope.
- [ ] `docs/development/shared-vocabulary.md` — import/export and step identity language for **doc** artefacts (if writing matrices in `docs/`).

---

## 3. Fixture candidate inventory

*Candidates to **define** on paper / in pass notes — **do not create files** until kickoff.*

- [ ] **`briefLines` / `base` → `brief` string** — minimal row set (only required lines); full row set (all optional lines per §3.1 ordering); edge: empty optional fields; edge: `mergedConstraints` / BL-C keys feeding BL-09 (§3.1, §3.5).
- [ ] **Synthetic interpret / blob family (F-INT)** — fixed `base` payload producing known blob lines for extraction path (§3.2, §4.5) — **separate** from `briefLines` golden.
- [ ] **`extractWorkflowBriefExplicitFactors` output** — JSON shape subset: factor ids material to heuristics (strip volatile fields per charter §5 table).
- [ ] **`resolveWorkflowBriefFactors` / resolution snapshot** — if pass includes elicitation; fixed `currently_resolved_factors` slice only if stable.
- [ ] **Post-design workflow JSON slice** — fields listed §8.5 relevant to gather vs design save (pair with §8.9 checklist rows, not one blob).
- [ ] **Step-level prompt body / bindings** — only if pass explicitly includes **D**-stage; small text slice, not full pack dump (§5.2).

Each candidate row: **channel tag** (BL / F-INT / PA-WGC / PA-EXTRACT / PE-import / …), **inputs frozen**, **expected artefact type** (JSON / redacted excerpt / bundle file **later**).

---

## 4. Regression surface inventory

*Surfaces to **choose** assertions against — pick subset for pass 1.*

- [ ] **§5.1 PA-*** rows in scope: at least **PA-WGC** (context order + headers) and one of **PA-EXTRACT** / **PA-INTENT** if extraction in scope.
- [ ] **`normalizeWorkflowForV1`** — input workflow object → output shape (§8.4); no new rules in Sprint 11.
- [ ] **Import path** — `importWorkflowsAndPrompts` / merge behaviour (§8.2–8.3).
- [ ] **Export bundle shape** — `version: 1` envelope + minimal workflow array (§8.2, charter scope).
- [ ] **Reload** — `loadWorkflows` → map → UI-visible invariants (name, step count, **presence/absence** of `workflowBriefResolution` per §8.9 paths).
- [ ] **Heuristics output** — step titles / canonical ids after `applyWorkflowDesignHeuristics` **only** if paired with fixed model JSON fixture (optional; higher cost).

Mark each: **automated target** vs **manual observable** vs **deferred**.

---

## 5. Cross-domain coverage targets

- [ ] **General-only** `selectedDomains` — brief config fallback path (§7.7, §7.8).
- [ ] **General + learning-design** — first structured domain = LD for `getWorkflowBriefConfig` (§6.6, §7.8).
- [ ] **General + research** — same, research first when ordered before LD (document **order** explicitly).
- [ ] **Permutation note** — if two structured domains selected: document **which** drives elicitation vs which is markdown-only (§7.8); matrix row **expected** outcome written before any harness work.

---

## 6. Import / export coverage targets

- [ ] **Minimal export** — single workflow, no library prompts (shape only).
- [ ] **Mixed bundle** — workflow + at least one library prompt reference if product supports in export (charter §5 table “library-mixed”).
- [ ] **Round-trip** — export → import → compare **normalised** workflow fields on checklist (not necessarily full deep-equal on first pass).
- [ ] **`newerWins` / merge** — one row documenting **older vs newer** `updatedAt` expectation per §8.2–8.3 (read audit + code when implementing).
- [ ] **Malformed / edge import** — **optional** row: document “expect warning / skip” without requiring new product behaviour.

---

## 7. Prompt-context snapshot candidates

*Redacted excerpts only; structure over volume.*

- [ ] **Section headers present** — `## PLATFORM CONTEXT`, `## DOMAIN CONTEXT`, `## WORKFLOW BRIEF` (§5.1 PA-WGC, WGC module).
- [ ] **File path markers** — sample `### File:` lines count and order (not full file bodies).
- [ ] **Order assertion plan** — platform → domain → brief tail (charter fixture strategy §7).
- [ ] **Design user message tail** — `buildWorkflowCompactDirective` presence / line count boundary (§5.1 PA-DES-USER) — excerpt or hash strategy agreed.
- [ ] **Run-mode / RC family** — **optional** separate excerpt family (§3.3) so run-mode work does not pollute design fixtures.

---

## 8. Verification checklist

- [ ] **CI / test command** documented for the repo (exact command line) **or** “manual-only pass” stated explicitly.
- [ ] **Pre-merge:** diff review excludes Sprint 11 **§4** forbidden edits (prefixes, factor ids, pack sources, schema migration).
- [ ] **During:** each PR / chunk updates a short **implementation log** (fixture families + channels touched).
- [ ] **Post-merge:** Sprint 09–class smoke list executed (see §9); failures triaged (drift vs bug vs intentional follow-on).
- [ ] **Baseline bump:** if product mainline moves, either refresh fixtures **or** pin branch — decision logged.

---

## 9. Manual smoke checklist

*Extend Sprint 09 smoke; tick date + initials when run.*

- [ ] Workflow Factory load — **no** console errors.
- [ ] Existing saved workflow **load** and **save** without unintended field loss (spot-check `workflowBriefResolution` per §8.9 awareness).
- [ ] **Export → import** round-trip on **minimal** workflow (§6).
- [ ] **Design-from-brief** (optional but charter-encouraged when touching generation) — start from blank or template; complete or cancel cleanly.
- [ ] **Run-mode** (optional) — open run context, clipboard / external copy path if pass touches **PA-RT** / **PA-STEP** family.
- [ ] **Utilities** (optional) — only if pass touches artefact render catalogue (§7.5).

---

## 10. Risks to watch during implementation

- [ ] **Flake** — network, time, random ids → stub `fetch`, freeze seeds, strip volatile snapshot keys.
- [ ] **Single-channel false pass** — e.g. only step titles → add second channel before claiming pass done (charter exit §12).
- [ ] **Scope creep** — “small fix” in `briefLines` or pack while adding tests → stop; separate contract table + charter.
- [ ] **Huge prompts in repo** — keep excerpts short; checksum long bodies if needed (charter §7).
- [ ] **Ossified wrong behaviour** — document “known quirk” + audit § reference in fixture header comment **when** implementing files later.
- [ ] **Manual matrix rot** — version the markdown table date + link to commit.

---

## 11. Out-of-scope reminders

*Sprint 11 charter §4 — copy to pass kickoff notes.*

- [ ] No **semantic renaming** of contract-coupled strings.
- [ ] No **factor id** / mapping / `workflowBriefConfig` **pack** structure changes.
- [ ] No **prompt contract** edits (`briefLines` prefixes, F-INT rewrites, step-context scaffolding, generator templates).
- [ ] No **domain-pack rewrite**, **renderer** redesign, **sequencing** redesign, **workflow-engine** rewrite.
- [ ] No **persistence schema migration** or new storage version fields **unless** a **different** charter authorises it.

---

## 12. Exit checks

*Align with charter §12; tick when pass is complete.*

- [ ] **(a)** Meaningful automated regression tests **merged**, **or (b)** dated **manual** regression matrix + golden I/O artefacts **in `docs/`** approved for the pass.
- [ ] Coverage spans **≥ 2 audit channels** (e.g. BL-derived **and** extraction **or** import round-trip — **not** step titles alone).
- [ ] **Cross-domain** matrix **documented** and **at least one** row **executed** (test or signed manual run).
- [ ] **Implementation log** lists what was pinned and states **§4 non-goals** not violated.
- [ ] **No** contract **rationalisation** (renames, id changes, prompt rewrites) shipped in Sprint 11 PRs.

---

## Review log

- **2026-05-13** — **Portable sprint pack aligned** (Sprint 09 / 10 pattern): References list pack path; implementation **not started**; **tomorrow** = pass-scope confirmation (charter §§11–12).
- **2026-05-13** — **Readiness review:** charter restored as **first** read-first item in §2; `current-state.md` Tomorrow bullet links kickoff + Sprint 11 `GPT-BOOTSTRAP-PROMPT.md`; charter Related artefacts + GPT §4 clarify **not started** until pass scope written.
- **2026-05-12** — **Fixture candidate inventory linked:** `docs/consolidation/sprint-11-fixture-candidate-inventory.md` (read-first + References).
- **2026-05-12** — **Checklist created** (documentation only): preparation tasks for Sprint 11; **no** code, tests, or fixture files added by this document.
