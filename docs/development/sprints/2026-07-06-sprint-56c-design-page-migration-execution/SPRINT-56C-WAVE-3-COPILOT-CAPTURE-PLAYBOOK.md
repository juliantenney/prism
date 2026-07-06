# Sprint 56C — Wave 3 Copilot Capture Playbook (Optional W3.7)

**Status:** Optional implementation aid  
**Scope:** PATH-A capture hygiene only  
**Constraint:** This playbook does not create runtime-quality claims.

---

## Purpose

Provide a consistent way to save Copilot-generated Design Page artefacts so they can be reviewed with Class B structural checks.

---

## Capture checklist

1. Record fixture identifier (`fixture_id`) targeted.
2. Save final page JSON exactly as produced (`artifact_type: page` expected).
3. Record whether upstream artefacts were present in conversation.
4. Store capture reference next to fixture registry row (`TBD-CAPTURE` → `bound` when resolved).
5. Do not annotate capture as “validated quality”; annotate only as “captured for structural audit”.

---

## Required metadata for each capture

```yaml
fixture_id: FX-KNOWLEDGE-001
path: PATH-A
capture_date: 2026-07-06
source: copilot
upstream_context: present|unknown
artefact_ref: <path or external reference>
review_status: pending-structural-audit
```

---

## Prohibited language

- “Copilot output validated by Prism”
- “Educational quality confirmed”
- “Transition quality passed”

Use:

- “Capture available for structural review”
- “Runtime generation quality not validated in Prism scope”

