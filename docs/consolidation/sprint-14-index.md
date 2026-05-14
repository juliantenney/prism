# Sprint 14 — consolidation index

**Date:** 2026-05-14  
**Path:** `docs/consolidation/sprint-14-index.md`

**Sprint title:** Sprint 14 — Research Domain Runnable Maturity

**Purpose:** Navigable map of **Sprint 14** documentation and (when chartered) implementation tracking. This index **does not** approve work beyond what the **charter** states, **does not** reopen Sprint 12 or Sprint 13, and **does not** subsume the architecture portability backlog.

**Documentation posture (2026-05-14 consolidation):** The **first Research implementation / verification slice** is **documented** in **`sprint-14-current-known-issues.md`** (§§**10–11**), **`sprint-14-charter.md`** (§§**7**, **10**), and this index review log. **No** Sprint **12**/**13** reopeners; **no** renderer redesign charter—residual renderer polish stays in **known issues §11** only.

---

## 1. Sprint 14 scope summary

Sprint 14 is **practical and product-focused**: make the **Research** domain a **genuinely usable, trustworthy runnable workflow domain** in Workflow Factory and downstream execution—not a portability architecture programme.

**Runnable-domain framing (v1):** **General** is **baseline-only** (always merged; not user-selectable as runnable). **Learning Design** and **Research** are the **runnable** Factory domains. Sprint 14 **narrows** on **Research** maturity; **Learning Design** elicitation / parity review is explicitly **out of scope** for Sprint 14 (may be scheduled later).

**Relationship to Sprint 12–13:** Sprint **12** first-pass observability (A–E) remains **closed**. Sprint **13** portability / UX clarification first-pass remains **closed**; Sprint 14 is **not** “Sprint 13 continued” as an architecture portability sprint.

---

## 2. Core artefacts

| Artefact | Role |
|----------|------|
| [`sprint-14-charter.md`](sprint-14-charter.md) | Goals, non-goals, constraints, deliverables, verification expectations, explicit exclusions. |
| [`sprint-14-research-pack-baseline-audit.md`](sprint-14-research-pack-baseline-audit.md) | Read-only snapshot of Research pack structure vs Learning Design; risks, gaps, assumptions. |
| [`sprint-14-current-known-issues.md`](sprint-14-current-known-issues.md) | Known / mitigated register (**E4.x**, **I9.x**, **G2.x**, …), **§10 completed work**, **§11 remaining work** (not a renderer programme). |

---

## 3. Pointers

| Topic | Where |
|-------|--------|
| **Current product state** | [`docs/development/current-state.md`](../development/current-state.md) |
| **General baseline-only (v1)** | [`sprint-13-general-alwayson-first-structured-domain-behaviour.md`](sprint-13-general-alwayson-first-structured-domain-behaviour.md) §**Current v1 — General baseline-only** |
| **Architecture / portability backlog (descriptive)** | [`prism-architecture-portability-backlog.md`](prism-architecture-portability-backlog.md) — Sprint 14 called out as **practical runnable-pack work**, not portability redesign |

---

## 4. Consolidation file list (`docs/consolidation/sprint-14-*.md`)

| File |
|------|
| `sprint-14-index.md` (this index) |
| `sprint-14-charter.md` |
| `sprint-14-research-pack-baseline-audit.md` |
| `sprint-14-current-known-issues.md` |

---

## 5. Follow-on sprint (active product focus)

- **Sprint 15 — Research Renderer and Page Delivery Maturity** — **`docs/consolidation/sprint-15-index.md`** — Utilities / **`page`** delivery for Research (**Design Page → JSON → HTML**). Sprint **14** artefacts here remain **historical baseline** for runnable Research; **do not** duplicate Sprint **15** scope into Sprint **14** closure text.

---

## Review log

- **2026-05-14** — Sprint 14 scaffolding: index, charter, baseline audit, known-issues register; `current-state.md` and portability backlog pointers updated.
- **2026-05-14** — **Consolidation pass:** known-issues register expanded (**E4.3**/**E4.4** ids, **mitigated** statuses for **E4.1**, **E4.5**, **I9.1**; **I9.2** **partially mitigated**); charter §§**7**/**10** aligned; baseline audit post-baseline notes for **K8.2**/**E4.4**; **`development/current-state.md`** Sprint **14** bullets refreshed.
- **2026-05-14** — **Sprint 15 opened:** active focus moves to **`sprint-15-index.md`**; Sprint **14** treated as **closed baseline** in **`current-state.md`**; §**5** follow-on pointer added to this index.
