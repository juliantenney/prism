# Sprint 13 — S13-01 implementation review packet

**Role:** Bounded review artefacts for **S13-01** only, assembled **before** any implementation-approval discussion. **This packet does not approve implementation**, merge, or charter execution.

**No code changes** are part of this packet.

---

## Packet inputs (inventory)

| Input | Path |
|--------|------|
| General / always-on / first-structured domain (v1 reference) | `docs/consolidation/sprint-13-general-alwayson-first-structured-domain-behaviour.md` |
| Code-derived parity matrix (`#wfDesignDomainSelect`) | `docs/consolidation/sprint-13-s13-01-factory-domain-select-parity-evidence-matrix.md` |
| Runtime-observed baseline (Scenario A session) | `docs/consolidation/sprint-13-s13-01-runtime-parity-baseline.md` |
| Bounded first-pass charter proposal (candidate) | `docs/development/sprints/2026-05-13-sprint-13-domain-pack-portability-candidate/CHARTER-FIRST-PASS-SUMMARY.md` |
| Pre-implementation safety posture (no separate titled doc in-repo) | **`CHARTER-FIRST-PASS-SUMMARY.md`** (guardrails, risks, non-goals); **`CURRENT-STATE.md`** (implementation gate) in `docs/development/sprints/2026-05-13-sprint-13-domain-pack-portability-candidate/`; **`GPT-BOOTSTRAP-PROMPT.md`** §§1–2 and 4–5 in the same folder |

A second runtime baseline note (`docs/consolidation/sprint-13-s13-01-factory-domain-select-runtime-baseline.md`) aligns with the same Scenario A capture; where wording differs, treat the matrix plus **`sprint-13-s13-01-runtime-parity-baseline.md`** as the packet’s runtime citations below.

---

## 1. Scope summary

**S13-01** in this packet means: **Workflow Factory** domain `<select>` **`#wfDesignDomainSelect`** — **strict parity** with the **current v1** manifest-driven and fallback behaviours **as already documented** in the parity matrix and v1 reference note, for the **narrow** control surface the charter names (“manifest-driven domain UI” where parity is **provable**).

**In bounds for S13-01 discussion:** evidence-backed parity for **ordered options**, **labels**, **initial and post-change selection**, and **documented** `state.workflowSelectedDomains` semantics **as tied to that select** (per matrix rows A–D and runtime Scenario A).

**Not in bounds for this packet:** any execution of implementation work; expansion of Sprint 13 beyond what the candidate charter already lists; **S13-02**, **S13-03**, or **S13-07** work products except where the v1 reference note is needed to read **`general` / `alwaysOnDomains` / Factory collapse** context for the same control.

---

## 2. Exact in-scope functions (S13-01 — `#wfDesignDomainSelect`)

Per `sprint-13-s13-01-factory-domain-select-parity-evidence-matrix.md`:

| Symbol | Location |
|--------|-----------|
| **`initWorkflowDomainSelector`** | `app.js` |
| **`renderWorkflowDomainSelector`** | `app.js` |
| **`getSelectedWorkflowDomains`** | `app.js` |
| **`handleWorkflowDomainSelectionChange`** | `app.js` |
| **`getDomainOptions`** | `workflowGenerationContext.js` |
| **`fallbackDomains`** | Literal array **inside** `initWorkflowDomainSelector` (`app.js`) |

---

## 3. Exact out-of-scope functions / areas

**Stated exclusions in the parity matrix (not evidenced as S13-01 parity targets):**

- **`renderWorkflowFactoryDomainUiHints`** and Learning Design–specific hint branches (charter associates these with **S13-03** / separate portability work).
- **Prompts**, **`briefLines`**, model payloads.
- **Persistence / import / export** beyond acknowledging **`persistSelectedDomains`** exists on domain change (matrix).
- **`getWorkflowBriefConfig`** semantics beyond the minimum needed to state that **this packet is not** a brief-config parity sign-off.
- **Sprint 12** tests, closure edits, or structural observability obligations.

**From the v1 reference note — explicitly deferred relative to documentation-only S13-07 scope (and not S13-01 parity targets unless separately brought under charter):**

- **S13-02** default domain product rules.
- **S13-03** display-only hint neutralisation.
- Starting artefact allowlists, title-based domain injection, **`getGeneralFallbackBriefConfig`**, multi-domain brief merge, semantic prompt changes, persistence/import/export behaviour, broad **`app.js`** refactors, cache/fallback observability.

**Charter / prep gate (safety posture) — excluded from prep-only execution until superseded by written approval:**

- Production code edits, domain-pack edits, prompt rewrites, persistence changes, orchestration behaviour changes **without** explicit written Sprint 13 first-pass approval (`CURRENT-STATE.md` implementation gate; `GPT-BOOTSTRAP-PROMPT.md` §1).

---

## 4. Parity definition (S13-01 — `#wfDesignDomainSelect`)

**Ordered options:** Top-to-bottom `<option>` elements as **`(value, visible label)`**, as in the matrix legend.

**Labels:** **`domain.label || domain.id`** for non–always-on manifest rows; manual **`general`** row uses value **`general`** and label **General** (matrix + v1 reference **`renderWorkflowDomainSelector`** description).

**Selection semantics (`selectedExtra`):** As defined in the matrix §“`selectedExtra` / selection semantics”: derive **`selected`** from **`getSelectedWorkflowDomains()`**; **`selectedExtra`** = first entry in **`selected`** not equal to **`"general"`**, else **`"general"`**; if no `<option>` for **`selectedExtra`**, coerce to **`"general"`**; set **`#wfDesignDomainSelect.value`** accordingly; **`onchange`** is attached only on the **non-empty `domains`** path (not on the empty-list early return).

**State semantics (`state.workflowSelectedDomains`):** Factory-facing collapse **`["general"]`** or **`["general", exactlyOneOtherId]`**; **`handleWorkflowDomainSelectionChange`** sets **`["general"]`** or **`["general", selectedValue]`** when **`selectedValue !== "general"`** (matrix + v1 reference **`getSelectedWorkflowDomains`** / **`handleWorkflowDomainSelectionChange`**).

**Row A (WGC + fulfillment):** Ordered list **`(general, General)`**, **`(learning-design, Learning Design)`**, **`(research, Research)`**; initial selection **`general`**; post-change state as matrix rows.

**Rows B / C:** Same ordered list and selection rules via **`fallbackDomains`** (matrix).

**Row D (empty `domains`):** Single option **`(general, General)`**; **`onchange`** not set on that branch; reachability **not** observed from current call graph (matrix).

---

## 5. Runtime-confirmed baseline

**Source:** `docs/consolidation/sprint-13-s13-01-runtime-parity-baseline.md`.

**Confirmed in browser (Scenario A — normal load):** URL **`http://localhost/prism/index.html`**, **Create Workflow**; ordered options **`general` / `learning-design` / `research`** with labels **General / Learning Design / Research**; initial **General**; after user selects Learning Design then Research, combobox displays match those values.

**Not runtime-confirmed in that capture:** **`state.workflowSelectedDomains`** (not read live); **`onchange`** attachment (not DOM-verified); **Scenario B** (`getDomainOptions` rejection) and **Scenario C** (WGC absent) — **not reproduced** in-session (documented reasons: safe evidence-only lane).

**Console in that session:** Only host message **`[CursorBrowser] Native dialog overrides installed - dialogs are now non-blocking`**; no application errors attributed to domain init in that note.

---

## 6. Code-derived baseline

**Source:** `docs/consolidation/sprint-13-s13-01-factory-domain-select-parity-evidence-matrix.md`.

**Content:** Rows **A–D** with entry paths, ordered options, selected value after init, user-change behaviour, and **`selectedExtra`** / **`handleWorkflowDomainSelectionChange`** rules; assumptions on v1 **`domains/domain-manifest.json`** key order and labels; explicit **unknowns** and **risks if parity-related changes are made later** (descriptive in source doc).

**Relationship to runtime:** Matrix Row **A** matches Scenario **A** observations in `sprint-13-s13-01-runtime-parity-baseline.md`; B/C/D are **code-derived** only where not runtime-exercised.

---

## 7. Known unknowns

From the **parity matrix** and **runtime baseline** (deduplicated):

- Whether **`getDomainOptions`** can fulfill with **`[]`** after **`normalizeManifest`** behaviour (matrix).
- Behaviour if **`manifest.domains`** or labels differ from the **v1 default** file (matrix).
- Full **runtime** classification of **`getDomainOptions`** rejection reasons (matrix: code path only).
- **Live** values of **`state.workflowSelectedDomains`** during the Scenario A session (runtime: not read).
- **DOM-verified** **`onchange`** on the populated path (runtime: inferred from source only).
- **Empty `domains`** branch reachability in production (matrix: not observed from call graph).
- **Side effects** when the domain value changes (e.g. other Factory controls) are **outside** strict dropdown list parity but were **observed** adjacent to Scenario A (runtime baseline §8).

---

## 8. Stop / escalation conditions

Use **pause and escalate** (no approval implied) when:

- Parity is asserted for **controls or files outside** §§2–3 above.
- **S13-02** or **S13-03** scope is **interleaved** with S13-01 approval discussion without a **separate** recorded decision (charter: S13-02/S13-03 decision-gated).
- **Sprint 12** A–E scope, tests, or closure artefacts are **reopened** or treated as **blocking** S13-01 without explicit governance decision (charter + `CURRENT-STATE.md`).
- **Prompt**, **`briefLines`**, persistence/import/export, or **`getWorkflowBriefConfig`** product semantics are **bundled** into the same approval as **dropdown list parity** without explicit charter widening.
- **Scenario B/C** or **Row D** behaviour is **claimed as runtime-proven** when only **code-derived** evidence exists.
- **Full drop-in domain-pack portability** is **claimed** as an outcome of S13-01 (charter + v1 reference explicit non-claim).

---

## 9. Reviewer checklist

Answer **yes / no / not applicable**; **no** item assumes implementation has started.

1. Scope is limited to **`#wfDesignDomainSelect`** and the functions in §2.
2. **`sprint-13-s13-01-factory-domain-select-parity-evidence-matrix.md`** has been read for rows **A–D** and **`selectedExtra`** rules.
3. **`sprint-13-s13-01-runtime-parity-baseline.md`** has been read; reviewer understands **Scenario A** vs **B/C** coverage limits.
4. **`sprint-13-general-alwayson-first-structured-domain-behaviour.md`** has been consulted for **`general`**, **`alwaysOnDomains`**, **`getSelectedWorkflowDomains`**, and **`renderWorkflowDomainSelector`** context **only as needed** for reading the matrix.
5. **`CHARTER-FIRST-PASS-SUMMARY.md`** has been read; reviewer acknowledges **candidate** status and **S13-02/S13-03** gating.
6. **`CURRENT-STATE.md`** and **`GPT-BOOTSTRAP-PROMPT.md`** (§§1–2, 4–5) have been read for **prep-only gate** and **deferred** items.
7. Reviewer can state **which matrix rows** are **runtime-confirmed** vs **code-derived only**.
8. Reviewer can restate §4 **parity definition** without adding new controls or files.
9. Reviewer confirms **no** bundled approval is being recorded for **S13-02**, **S13-03**, or **Sprint 12** via this packet.
10. Reviewer confirms this packet is **not** a substitute for any **separate** written implementation charter sign-off the organisation requires.

---

## 10. Explicit non-goals (this packet)

- This packet is **not** an implementation guide, test plan, or edit list.
- This packet does **not** approve **semantic prompts**, **`briefLines`**, extraction, multi-domain brief merge, **`getGeneralFallbackBriefConfig`** relocation, starting-artefact relocation, LD starting-point trio relocation, title-based domain injection replacement, broad **`app.js`** refactor, persistence/import/export migration, fallback/cache/`manifestPromise`/`textCache` work, or domain-pack schema redesign (aligned with **`CHARTER-FIRST-PASS-SUMMARY.md`** non-goals and **`GPT-BOOTSTRAP-PROMPT.md`** §5).
- This packet does **not** add **new Sprint 13** scope items beyond what the listed inputs already contain.

---

## 11. S13-02 / S13-03 remain out of scope

**S13-02** (default domain rule) and **S13-03** (hint neutralisation) are **decision-gated** in the bounded first-pass charter and are **not** part of this S13-01 review packet unless a **separate** recorded decision and artefacts are introduced later.

---

## 12. Sprint 12 remains closed

**Sprint 12** first-pass structural observability (**A–E**) is **closed** per `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`. This packet **does not** reopen Sprint 12 scope, tests, or closure obligations (consistent with charter summary, v1 reference note, parity matrix exclusions, and runtime baseline confirmation).

---

## 13. Full drop-in portability is not achieved

**Statement:** **Full drop-in domain-pack portability** is **not** claimed complete for v1 and is **not** an outcome asserted by this packet or by the listed S13-01 baselines ( **`CHARTER-FIRST-PASS-SUMMARY.md`**; **`GPT-BOOTSTRAP-PROMPT.md`** §4; **`sprint-13-general-alwayson-first-structured-domain-behaviour.md`** deferred list).

---

## Review log

- **2026-05-13** — S13-01 implementation review packet added under `docs/consolidation/sprint-13-s13-01-implementation-review-packet.md` (documentation only; aggregates listed inputs and in-repo safety posture).
