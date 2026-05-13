# Sprint 13 — starting artefact / starting-point runtime parity baseline

**Date:** 2026-05-13  
**Path:** `docs/consolidation/sprint-13-starting-artefact-runtime-parity-baseline.md`

**Role:** Live-browser validation of [`sprint-13-starting-artefact-starting-point-code-derived-parity-matrix.md`](sprint-13-starting-artefact-starting-point-code-derived-parity-matrix.md) against **`http://localhost/prism/index.html`**, before any Tier **B/C** helper extraction (per [`sprint-13-starting-artefact-bounded-implementation-review.md`](sprint-13-starting-artefact-bounded-implementation-review.md)).

**Method:** Cursor **IDE browser** MCP — accessibility snapshots of **`#wfDesignStartingArtefact`**, Workflow Factory domain combobox, and related **Source material / inputs** (`#wfDesignInputs`) wiring; **`browser_console_messages`** after the session.

**Constraints honoured:** **No** production code, domain-pack, prompt, persistence, import/export, orchestration, or Sprint 12 edits. **No** portability completion claim.

---

## Capture environment

| Field | Value |
|-------|--------|
| **URL** | `http://localhost/prism/index.html` |
| **Tab** | **Create Workflow** (Workflow Factory) |
| **Browser** | Cursor MCP `cursor-ide-browser` |
| **Date** | 2026-05-13 |

---

## Captured scenarios (matrix rows 1–5)

### 1. General selected — **reproduced (final state)**

| Field | Observed |
|-------|----------|
| **Domain control** | **General** (`#wfDesignDomainSelect` / “Workflow design domain”). |
| **Starting `<select>` options (labels + values, a11y snapshot)** | **`Select starting point…`** (`value` empty), **normalized content** (`normalized_content`), **summary** (`summary`), **key points** (`key_points`), **structured data** (`structured_data`), **analysis** (`analysis`), **entities** (`entities`), **relationships** (`relationships`). |
| **Selected value after render (steady state)** | **`Select starting point…`** (empty selection) on first open; matches placeholder row. |
| **Starting-point placeholder text** | First option text **`Select starting point…`** (Unicode ellipsis **…**). |
| **`#wfDesignInputs` (inputs copy)** | Accessible name **Source material / inputs**; placeholder **e.g. PDF, notes, transcript, list of topics...** (no starting artefact chosen). |
| **Flicker / async overwrite** | **Not assessed** for General-only initial paint beyond normal async catalogue load; **not** compared frame-by-frame to **`input_strategy`** path. |
| **Differs after brief config completes** | **Not isolated in this capture.** Observed option set matches the **code-derived catalogue / allowlist-filtered** shape (matrix **row 1 (b)**). Whether **`input_strategy`** (matrix **row 1 (a)**) ever overrode this list for the same domain mix was **not** verified (would need pack/config trace or network timing). |
| **`updateWorkflowFactoryInputsCopyFromStartingPoint` visible** | **Yes** — when **`summary`** was later selected on General (see cross-row note), **`#wfDesignInputs`** accessible name became **Input details (optional)** and placeholder **e.g. paste or describe the selected starting point, or note where it comes from**. |
| **Console** | Only **`[CursorBrowser] Native dialog overrides installed`** warnings (tooling); **no** PRISM application errors observed in the returned console list. |

**Note:** Sub-path **1 (a)** vs **1 (b)** from the code-derived matrix is **not** split by evidence here.

---

### 2. Learning Design selected — **reproduced (final state)**

| Field | Observed |
|-------|----------|
| **Domain control** | **Learning Design**. |
| **Final starting `<select>` options** | **`Select starting point…`**, **Generate from topic** (`generate_from_topic`), **Use existing source content** (`provided_source_content`), **Both source content and generated content** (`mixed`). |
| **Selected value after render (final)** | **`Select starting point…`** after prior **`summary`** selection was cleared (see **row 5**). On a **fresh** LD selection from General-without-prior-invalid-value, final selected value was also the placeholder in the steady-state snapshot. |
| **Starting-point placeholder** | Same **`Select starting point…`**. |
| **`#wfDesignInputs` (final)** | **Source material / inputs** + source-material placeholder when starting selection empty (final snapshot). |
| **Flicker / async overwrite** | **Yes — observed intermediate inconsistency:** immediately after switching domain **General → Learning Design**, the starting combobox **still showed the General catalogue options** and **still showed `summary` as the selected value** in one snapshot; after **~2 s** wait, the **LD trio** appeared and the **selected value** read as the placeholder (**invalid prior `summary` cleared**). This matches the matrix’s **async supersession** expectation for LD, but the **intermediate** “wrong options + wrong selected” state should be recorded for any visual regression test. |
| **Differs after brief config completes** | **Not instrumented** (no before/after DOM diff tied to **`getWorkflowBriefConfig`** resolution); final DOM **was** the LD trio. |
| **`updateWorkflowFactoryInputsCopyFromStartingPoint` visible** | **Yes** in aggregate: transitions between **Source material / inputs** and **Input details (optional)** were observed when selection changed; final empty-selection state showed **Source material / inputs**. |
| **Console** | Same tooling warnings only. |

---

### 3. Research selected — **reproduced (final state, after wait)**

| Field | Observed |
|-------|----------|
| **Domain control** | **Research**. |
| **Final starting `<select>` options (snapshot)** | **`Select starting point…`**, **Description** (value not echoed in truncated a11y string — **not** re-read from DOM inspector; treat label as observed), **Purpose**, **argument structure** (`argument_structure`), **key findings** (`key_findings`), **evidence map** (`evidence_map`), **thematic analysis** (`thematic_analysis`), **literature matrix** (`literature_matrix`), **research summary** (`research_summary`). |
| **Selected value after render (final)** | **`Select starting point…`** (placeholder). |
| **Starting-point placeholder** | **`Select starting point…`**. |
| **`#wfDesignInputs` (final)** | **Source material / inputs** + source-material placeholder. |
| **Flicker / async overwrite** | **Yes —** immediately after **Learning Design → Research**, snapshots briefly **still showed LD trio options**; after **~2 s**, **Research** catalogue options appeared. |
| **Differs after brief config completes** | **Not instrumented** for Research-only. |
| **`updateWorkflowFactoryInputsCopyFromStartingPoint` visible** | **Inferred only from empty selection** → source-material mode in final snapshot; no separate “selected artefact” step captured for Research-only. |
| **Console** | Tooling warnings only. |

**Note:** First **Description** option’s **`value`** was **not** re-verified with **`browser_get_attribute`**; full value/label table for Research is **partially** evidenced from a11y text only.

---

### 4. Restore valid previous `startingArtefact` — **not reproduced**

| Status | **Not reproduced** (explicit). |
|--------|----------------------------------|
| **Reason** | No controlled scenario was executed where **`renderWorkflowFactoryStartingArtefactOptions`** ran **twice** with the **same** non-empty **`current`** still present in the **new** option list **without** relying on unstated assumptions. Cross-domain navigation **clears** invalid values (see row **5**), which prevents inferring “restore” from round-trips. |

---

### 5. Reset invalid previous `startingArtefact` — **reproduced**

| Field | Observed |
|-------|----------|
| **Steps** | **General** → select **`summary`** on **Starting point (optional)** → switch domain to **Learning Design** → wait **~2 s** for async settle. |
| **Prior selection** | **`summary`** (valid on General list). |
| **Final starting options** | LD trio (**`generate_from_topic`**, **`provided_source_content`**, **`mixed`**) + placeholder. |
| **Final selected value** | **`Select starting point…`** (empty / cleared) — **`summary`** **not** in LD trio → reset. |
| **`#wfDesignInputs` after final** | **Source material / inputs** (consistent with empty starting selection after reset). |
| **Flicker / async overwrite** | **Yes** — intermediate snapshot still showed **General** options and **`summary`** selected before LD trio + cleared selection. |
| **Console** | Tooling warnings only. |

---

## 1. Runtime baseline summary

- **General**, **Learning Design**, and **Research** domain selections were each exercised on **`http://localhost/prism/index.html`**, with **final** starting-point option sets recorded from accessibility snapshots after async settle (**~2 s** wait where needed).
- **Unicode placeholder** **`Select starting point…`** and **LD trio** **`value`** strings match the code-derived matrix for **final** states.
- **Invalid cross-domain retention** was **observed to reset** (`summary` on General → LD clears selection).
- **`updateWorkflowFactoryInputsCopyFromStartingPoint`** effects on **`#wfDesignInputs`** label/placeholder were **visibly confirmed** when **`summary`** was selected on General.
- **Console:** no application errors in the captured list; only Cursor browser tooling warnings.

---

## 2. Differences from code-derived matrix

| Topic | Matrix / code expectation | Runtime observation |
|-------|---------------------------|----------------------|
| **General sub-path 1 (a)** | Brief **`input_strategy`** may supply options without allowlist. | **Not confirmed** this session; observed General list matched **catalogue-shaped** allowlist filtering (**1 (b)**-like). |
| **Intermediate DOM on domain switch** | Code predicts possible brief render then LD supersession for LD. | **Also observed** “stale General DOM + stale selected value” **before** LD trio for **General → LD**; **LD → Research** showed stale **LD** options briefly. |
| **Research option list detail** | Matrix does not fix exact pack ids. | **Captured** a set consistent with research artefacts; **one** option label (**Description**) lacked **`value=`** in the a11y snapshot string — **not** fully enumerated in DevTools sense. |
| **Parent `update` race (§1.3 matrix)** | Parent may call **`update`** before async child completes. | **Not** directly proven (would need scripted read of DOM in the same tick); **intermediate** label/option mismatches **suggest** timing sensitivity. |

---

## 3. Rows not reproduced

| Item | Reason |
|------|--------|
| **Restore valid previous `startingArtefact`** | No safe, non-inferential second-pass capture (see **§ Row 4** above). |
| **General matrix row 1 (a) alone** | Not isolated from **1 (b)** without additional instrumentation. |
| **`getDomainArtefactOptions` failure / empty catalogue (matrix row 5)** | Not reproduced — would require breaking WGC or manifest load **outside** allowed edits. |
| **Frame-accurate flicker / “values differ after brief”** | Not captured with network or **`input_strategy`**-scoped before/after snapshots. |

---

## 4. Whether Tier B/C helper extraction is implementation-ready

**Verdict: not fully — improved but still gated.**

| Gate | Status after this baseline |
|------|----------------------------|
| **Final LD trio + placeholder** | **Supported** by runtime evidence. |
| **Final Research + General catalogue shapes** | **Partially** supported (General strong; Research one ambiguous **`value`** in snapshot). |
| **Invalid selection reset** | **Supported** for **General `summary` → LD** case. |
| **Valid restore** | **Not** evidenced. |
| **Brief vs catalogue split for General** | **Not** evidenced. |
| **WGC failure path** | **Not** evidenced. |

**Recommendation:** Tier **B/C** remains **documentation- and test-gated**; add automated or scripted DOM assertions for **intermediate** states only if product requires anti-flicker work — otherwise treat **final-state** parity as the contract.

---

## 5. Confirmation: no production behaviour was changed

**No** edits were made to **`app.js`**, **`workflowGenerationContext.js`**, domain packs, prompts, persistence, import/export, orchestration, tests, or Sprint 12 artefacts for this baseline. **Browser interaction** was read-only aside from **UI clicks / selects** in a dev browser session.

---

## Related artefacts

| Document | Role |
|----------|------|
| [`sprint-13-starting-artefact-starting-point-code-derived-parity-matrix.md`](sprint-13-starting-artefact-starting-point-code-derived-parity-matrix.md) | Code-derived contract |
| [`sprint-13-starting-artefact-bounded-implementation-review.md`](sprint-13-starting-artefact-bounded-implementation-review.md) | Tier A/B/C scope |

---

## Review log

- **2026-05-13** — Runtime parity baseline captured on **`localhost`** via Cursor browser MCP (`sprint-13-starting-artefact-runtime-parity-baseline.md`).
