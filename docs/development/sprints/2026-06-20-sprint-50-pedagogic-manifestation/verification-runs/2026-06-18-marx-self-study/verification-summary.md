# Sprint 50 — MarxEduQSelfStudy verification summary

**Run:** 2026-06-18T12:47:40.546Z
**Workflow:** MarxEduQSelfStudy
**Git:** 340c2f16357431d33c10eac8e610b7c2728af879 (dirty working tree)

## Verification checks

| Check | Result | Evidence |
| --- | --- | --- |
| learning_activities generated | Yes | learning_activities.json present |
| activity_materials generated | Yes | activity_materials.md present |
| page.json generated | Yes | page.json present |
| page.html generated from page.json | Yes | page.html present |
| activity_preamble present in learning_activities | No | 0/0 activities with activity_preamble |
| activity_preamble persisted into page.json | No | 0/0 page rows with activity_preamble |
| Why this activity rendered in HTML | Yes | util-instructional-heading text found |
| reasoning_orientation present in learning_activities | No | 0/0 activities with reasoning_orientation |
| reasoning_orientation persisted into page.json | No | 0/0 page rows with reasoning_orientation |
| How to approach this rendered in HTML | Yes | util-instructional-heading text found |
| Study appears before Do | Yes | study index 40071 < do index 40119 |
| Check combines checklist and expected_output | Partial | Check section present but separate util-output-block also present |
| Expected output appears inside Check | Partial | content inside Check section |
| Compass is progress-only | No | progress=true, signalLabels=1 |
