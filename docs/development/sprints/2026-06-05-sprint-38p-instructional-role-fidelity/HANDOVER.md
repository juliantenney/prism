# Handover — Sprint 38-P

**Pack:** [README.md](README.md) · **Status:** **CHARTERED** (2026-06-05)

---

## Start here — 38P-1

### Role authority architecture

1. Read [38O-4 preservation recommendation](../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-4-preservation-options-recommendation.md) — F1 strategy and RF-1..RF-8.  
2. Read [38O-2 taxonomy](../2026-06-05-sprint-38o-instructional-material-role-preservation/observations/38O-2-role-taxonomy-page-mapping-analysis.md) — role families and mapping.  
3. Review existing merge/render surfaces: `lib/page-gam-materials-preserve.js`, `lib/page-a3-materials-sequencing.js`, `app.js`.  
4. Deliverable: `observations/38P-1-role-authority-architecture.md`.

**Rule:** Design doc only in 38P-1 — no production code until 38P-2.

---

## Programme lineage

| Sprint | Layer | Outcome |
|--------|-------|---------|
| **38M** | Body fidelity | GAM→Page body preservation; anti-synopsis; merge contract; `proofOk` |
| **38N** | Body-fidelity hardening | Semantic markers; render alias suppression; validator/schema alignment |
| **38O** | Role-fidelity discovery | Taxonomy; failure modes; F1 recommendation; `roleOk` concept |
| **38P** | Role-fidelity implementation | Registry; supersession; render precedence; `roleOk` gates |

---

## 38O handoff summary

- **Verdict:** Role fidelity is distinct from body fidelity — **supported** on A4.  
- **Baseline:** `EV-38M-AFTER` — `proofOk: true`, `roleOk: false`.  
- **Strategy:** F1 registry-led hybrid (registry + metadata + supersession + render precedence).  
- **Proof target:** `EV-38P-AFTER` — `proofOk: true`, `roleOk: true`.

---

## Phase index

| Phase | Status |
|-------|--------|
| **38P-1** | Role authority architecture — **NEXT** |
| **38P-2** through **38P-7** | Not started |
