# S78-T-019 — Activity timing / duration diagnostic

**Task:** S78-T-019  
**Status:** **Superseded** — diagnostic executed under [S78-T-036](S78-T-036-learner-timing-metadata-regression-diagnostic.md) (2026-08-25). Do **not** execute separately.  
**Mode:** **DIAGNOSTIC ONLY** when started  
**Production / tests / schema / validators / prompts / renderer:** **UNCHANGED** until a later authorised repair

Do **not** execute this task in the 2026-08-17 documentation consolidation. Do **not** assume renderer ownership.

---

## 1. Problem statement

Current fresh learner resources are **not displaying expected activity time/duration**.

This is a Sprint 78 **learner-resource-quality** issue, not only general backlog polish.

**Diagnostic question:** Where should activity timing originate, and why is it absent from the learner-facing resource?

---

## 2. Trace (must answer when executed)

1. Where should activity timing/duration originate (planning, DLA, GAM, assembly, renderer)?
2. Is timing already present upstream?
3. Is it lost during propagation?
4. Is it absent from current contracts?
5. Does the renderer support displaying it?
6. What is the earliest proven causal layer?

Trace:

```text
expected activity duration/orientation
→ upstream planning
→ DLA/GAM if relevant
→ assembly
→ renderer/learner presentation
```

---

## 3. Explicit non-assumptions

Do **not** assume:

- renderer ownership;
- a missing CSS/layout fix;
- that EP already carries authoritative duration;
- that DLA or GAM must be changed.

---

## 4. Acceptance (when executed)

| Criterion | Required |
| --------- | -------- |
| Written diagnostic answering the trace questions | Yes |
| Earliest proven causal layer | Yes |
| Recommended owner for any later repair (not implemented here) | Yes |
| No production edits in this diagnostic | Yes |

---

## 5. Related lower-priority presentation logs

Do not merge into T-019 unless diagnosis proves a shared cause:

- stray blank lines above some response fields;
- missing horizontal rule / separator between activities;
- Activity 3 mathematical-workspace presentation;
- image mismatch / persistence / operator-path issues where recorded.

---

## 6. References

- [S78-T-013-workstream-2-integration-verification.md](S78-T-013-workstream-2-integration-verification.md) §12  
- [S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)
