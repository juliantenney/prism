# Sprint 68 — Backlog

**Status:** Chartered — planning complete (2026-07-21)  
**Charter:** [SPRINT-68-CHARTER.md](SPRINT-68-CHARTER.md)

| ID | Milestone | Item | Status | Deliverable |
| -- | --------- | ---- | ------ | ----------- |
| S68-BL-001 | M1 | **Activity-to-activity bridging investigation** | **Next** | Investigation log entries · bridge data map · placement recommendation |
| S68-BL-002 | M1 | Audit authoritative bridge / transition fields across fixture + model | Pending | Field inventory (JSON → model → HTML) |
| S68-BL-003 | M2 | Implement inter-activity transitions using existing data (if investigation supports) | Pending | Render changes + tests |
| S68-BL-004 | M2 | Narrative continuity review (preamble, reasoning orientation, beat entry prompts) | Pending | Findings + targeted fixes |
| S68-BL-005 | M3 | Orientation effectiveness review | Pending | Findings log |
| S68-BL-006 | M3 | Progression guidance review (`progression_guidance`, section order cues) | Pending | Findings log |
| S68-BL-007 | M4 | Beat sequencing and instructional flow audit | Pending | Audit note |
| S68-BL-008 | M4 | Repetition reduction (duplicate headings, redundant cues) | Pending | Findings + fixes where authoritative |
| S68-BL-009 | M5 | Schema gap register (only if renderer-first path exhausted) | Pending | Deferred schema proposals |
| S68-BL-010 | M6 | Sprint close prep · evidence · handover to Sprint 69 if needed | Pending | Closure document |

**Gate:** Do not extend lesson schema until S68-BL-001 … S68-BL-008 show existing data is insufficient.  
**Gate:** Do not redesign navigation, export shell, or Sprint 67 CSS.  
**Gate:** Preserve vNext regression suite; no renderer behaviour change during setup task.

---

## First work item (startup)

**S68-BL-001** — Determine for the heteroscedasticity fixture:

- whether bridge content already exists in JSON / page model
- why only one `intellectual_coherence_bridge` renders
- whether the A5 bridge is misplaced (inside destination activity vs between activities)
- whether additional bridge-like content exists in `activity_preamble`, `reasoning_orientation`, beat prompts, or orientation sections
- what minimal renderer change would restore consistent inter-activity transitions

See [investigation-log.md](investigation-log.md) · [planning/activity-bridging-investigation.md](planning/activity-bridging-investigation.md).
