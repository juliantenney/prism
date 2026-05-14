# Session Handover — Sprint 14 portable pack

**Role:** authoritative for **this pack only**.

**Pack path:** `docs/development/sprints/2026-05-14-sprint-14-research-domain-runnable-maturity/`

---

## What has just been prepared

- **Portable context pack** following sprint transition layout:
  - **`SPRINT-CONTEXT.md`** — focus, runnable-domain framing, closed sprint boundaries, read-first order.
  - **`GPT-BOOTSTRAP-PROMPT.md`** — copy-paste assistant bootstrap with boundaries and likely first task.
  - **`CURRENT-STATE.md`** — active sprint, prior closures, known issues pointer, optional follow-ups after first slice.
  - **`HANDOVER.md`** (this file).
  - **`context-files/`** — **physical copies** (not symlinks) of consolidation docs, protocol/vocabulary, manifest, WGC, `app.js`, Research + partial LD domain markdown for comparison.

---

## What remains to do

- **Optional follow-ups** only — see **`sprint-14-current-known-issues.md`** §**11** (renderer polish, naming crosswalk, export audit, **`runnerInstructions`** review). **Do not** treat these as Sprint **14** core without a new charter.
- **Regression guard:** **`node --test tests/*.test.js`** when touching Research generation or pack policy again.

**Completed (2026-05-14 consolidation):** first Research pack + **`app.js`** slice and runtime verification notes are in **`docs/consolidation/sprint-14-current-known-issues.md`** §**10** and repo **`docs/development/current-state.md`**.

---

## Recommended next prompt (fresh chat)

If opening a **follow-up** slice, paste the **“Copy-paste block for the assistant”** from **`GPT-BOOTSTRAP-PROMPT.md`**, then attach **this folder**. For **residual** items, point at **`context-files/sprint-14-current-known-issues.md`** §**11** (renderer polish, etc.) — **not** a full LD renderer programme.

---

## Review log

- **2026-05-14** — Handover note added for Sprint 14 portable pack.
- **2026-05-14** — **Consolidation pass:** “What remains” / **CURRENT-STATE** descriptions updated; first slice marked **documented** in consolidation **`sprint-14-current-known-issues.md`** §**10**.
