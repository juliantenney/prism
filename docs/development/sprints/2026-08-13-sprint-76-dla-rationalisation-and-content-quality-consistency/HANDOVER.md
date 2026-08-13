# Sprint 76 — Handover

**Kind:** Continuation context for Sprint 76 (coding or product).  
**Sprint status:** **OPEN** (opened 2026-08-13)  
**Dashboard:** [STATUS.md](STATUS.md)  
**Plan:** [PLAN.md](PLAN.md) · **Context:** [CONTEXT.md](CONTEXT.md)  
**Pasteable brief:** [next-chat-briefing.md](next-chat-briefing.md)  
**Predecessor:** Sprint 75 — [HANDOVER.md](../2026-08-10-sprint-75-prism-user-experience-and-interface/HANDOVER.md) (**CLOSED**)

---

## Start here

> **Sprint 76 is OPEN. Begin with S76-T-010 — DLA audit (diagnostic only) when authorised. Do not rationalise prompts or change generation behaviour until the audit completes.**

Do **not** reconstruct investigation findings from chat alone — use [CONTEXT.md](CONTEXT.md).

---

## Current priority

| Priority | Work |
| -------- | ---- |
| **1** | **S76-T-010 — DLA audit** — responsibilities; reconstruct known-good / rationalised DLA → additions → current ~72k; EP→DLA / DLA→GAM; evidence machinery; task–material sufficiency |
| **2** | Phase 2 — rationalise / fix DLA from audit evidence |
| **3** | Phase 3 — repeated **Roman Roads** control benchmarks |
| **4** | Phase 4 — repeated **Lagrangian** challenge benchmarks |
| **5** | Phase 5 — decision gate (mechanisms only after evidence) |
| **Before close** | Durable prompt-engineering discipline — prevent **APPEND NOW → RATIONALISE LATER** ([S76-D03](decisions.md#s76-d03--durable-prompt-engineering-discipline-as-sprint-76-exit-condition); exact form informed by T-010 — no arbitrary limit / guardrail mandated at open) |
| **Later** | Settings — [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency) |

---

## What we already know (do not re-discover blindly)

1. Architecture / scaffolding / feedback often score strongly — problem is relatively **bounded**.  
2. Sprint 71 known-good historical quality baseline (cluster ~**85.3–91**; Roman Roads **90**; constructed/generated-content STEM **87–90** as comparison evidence) is stronger than current Lagrangian release ~**79**. Whether DLA has **regressed** is the **RECOVER** hypothesis — not established until T-010 / re-benchmarks show it. Then **ADVANCE** remaining task–material / richness work.  
3. Task–material **closure** failures (esp. A4 lambda exercises) are traceable from intermediate artefacts to benchmark Major defects.  
4. GAM can generate maths content when commissioned — primary suspect is **incomplete commissioning**, not subject ignorance.  
5. DLA ~**72k** character assembled prompt is a **first-class anomaly** — do not assume legitimacy; T-010 must account for growth as a **historical delta**.  
6. Evidence machinery **may conflate or insufficiently distinguish** material requirement, provenance/authenticity, and epistemic function; observed semantic friction (validator false positive; procedural mathematical task material treated as evidence-dependent) makes this a first-class **audit question**. Rollback is an **option**, not an opening action.  
7. Consistency matters: multiple Lagrangian runs clustered ~79 release territory with one substantially better run.

Detail: [CONTEXT.md](CONTEXT.md).

---

## Strategic quality direction

Move toward mid-90s **consistently** by improving underlying educational quality. Track **QUALITY**, **RELIABILITY**, and **CONTRACT QUALITY**. Sequence: **RECOVER** (hypothesis) then **ADVANCE**. Do not game the benchmark. Do not declare failure solely because every run is not yet 95.

---

## Do not

- Execute T-010 without authorisation  
- Rewrite DLA / GAM / EP during pack review  
- Add a new workflow step by default  
- Start Settings before this DLA / quality lane finishes its decision gate (unless operator re-prioritises)  
- Reopen Run persistence architecture (`S75-D21`) casually  
- Commit the Sprint 76 pack without operator review (opening task was documentation-only, no commit)

---

## Transition defects / fixes

See [CONTEXT.md §12](CONTEXT.md) and [STATUS.md](STATUS.md). Empty-capture and DLA evidence validator fixes exist in the **working tree** and are **uncommitted**. Continue-to-Authoring async refresh remains an **open** separate defect.
