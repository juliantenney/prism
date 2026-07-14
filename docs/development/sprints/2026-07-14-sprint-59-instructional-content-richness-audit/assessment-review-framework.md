# Sprint 59 — Assessment Review Framework

**Mandatory distinction:** review **assessment design** and **generated assessment items** as separate artefacts, then check alignment between them.

Do not conflate design quality and item quality into a single score or a single finding.

**Field-name note:** Item rationales often live in `explanation_or_rationale` (not `feedback` / `rationale`). First-audit “missing feedback” claims are superseded on that point — see [GENERATION-CONSTRAINT-AUDIT.md](GENERATION-CONSTRAINT-AUDIT.md).

---

## Part A — Assessment design

Review the assessment-design stage capture (strategy / evidence model), **not** item stems.

| Lens | Questions |
| ---- | --------- |
| Outcome alignment | Which LOs does the design claim to cover? Are any priority LOs omitted? |
| Evidence model | What would count as evidence of mastery? Is it explicit? |
| Formative / summative intent | Is the purpose of each check clear? |
| Cognitive level | Recall vs apply vs analyse — consistent with LOs? |
| Coverage | Breadth across LOs vs depth on key LOs |
| Sequencing | Where checks sit relative to activities (before/after practice) |

**Design adequacy (descriptive, not a score):** Adequate if intents, evidence model, and LO coverage are explicit enough that an item author could implement without inventing strategy.

**Signs of thin design:** “include a quiz”; no formative/summative split; no LO map; no evidence criteria.

**Signs of over-verbosity:** Strategy document longer than learning materials with no implementable item plan (flag `V` on relevant rubric rows if recorded).

---

## Part B — Generated assessment items

Review assessment-items / `assessment_check` (or equivalent) capture.

| Lens | Questions |
| ---- | --------- |
| Item count | Enough for claimed coverage? |
| Item diversity | Mix of types appropriate to design? |
| Clarity | Stem unambiguous? |
| Answerability | Can a careful learner answer from supplied activities/materials? |
| Distractor quality | (MCQ) Plausible misconceptions, not jokes |
| Marking guidance | Points / sample / rubrics where needed |
| Feedback / rationale | Concept-linked, not binary only |
| Difficulty calibration | Fit for level and duration |

**Items adequacy (descriptive, not a score):** Adequate if countable, diverse enough for design intent, and answerable from page content with usable feedback/marking where expected.

---

## Part C — Alignment chain

### Authoritative rule

> For each assessment-heavy lesson, trace **at least three** assessment items through the learning outcome → activity → material → assessment-item chain, **or trace all items when fewer than three exist**.

Record one row per traced item in [findings-template.md](findings-template.md).

| Field | Value |
| ----- | ----- |
| Lesson / sample id | |
| Item id / stem excerpt | |
| Linked learning outcome | |
| Supporting activity id | |
| Supporting material id(s) | Present? Sufficient? |
| Design intent satisfied? | Y / N / Partial |
| Answerable from materials? | Y / N / Partial |
| Primary class (A–F) | one only |
| Secondary tags | optional |

### Chain diagram

```
Learning outcome
    ↔ activity (practice / production)
        ↔ material (content needed for answer)
            ↔ assessment item (asks for evidence of that)
```

Breaks at any arrow → separate finding with one primary class per [issue-classification-framework.md](issue-classification-framework.md).

---

## Part D — Assessment workload realism

Record for every lesson with assessment content (design and/or items). Use a **descriptive verdict only** — no score.

| Field | Guidance |
| ----- | -------- |
| Stated lesson duration | From brief, EP shell, or page metadata where available |
| Estimated assessment completion time | Reviewer estimate with brief rationale |
| Basis for estimate | e.g. item count × expected minutes; reading load |
| Total required responses | Count of distinct learner productions |
| Expected response extent | Brief / moderate / extended per dominant item types |
| Item diversity | MCQ, short, extended, etc. |
| Assessment volume relative to lesson duration | e.g. “assessment ~40% of stated duration” |
| Proportionality of evidence requirements | Does volume match design evidence model? |

**Verdict (select one):**

| Verdict | Meaning |
| ------- | ------- |
| **realistic** | Volume and extent fit stated duration and design intent |
| **questionable** | Borderline; note specific pressure points |
| **unrealistic** | Likely exceeds reasonable completion time for stated duration |
| **insufficient evidence** | Duration or artefacts missing — do not infer workload |

Workload realism findings about **generated item volume** are usually class **A** (items) or **F** if duration metadata is wrong/missing. Renderer presentation affecting answer space is class **B** (requires Full evidence).

---

## Combined patterns (descriptive only — not primary classifications)

Use these labels to summarise; each underlying defect still gets its own primary A–F class.

| Pattern | Typical primary classes (split into separate findings) |
| ------- | -------------------------------------------------------- |
| Design strong / items thin | A on items |
| Design thin / items present | A on design |
| Both thin | Separate A findings for design and items |
| Both adequate; HTML poor | B |
| Design without items | E if ownership handoff unclear; else A on missing items |

Do **not** use compound primary labels such as `E and/or A` or `A/D`.

---

## Quick review checklist

- [ ] Design reviewed without looking at item quality first
- [ ] Items reviewed against materials, not ideal pedagogy only
- [ ] Workload realism recorded (Part D)
- [ ] At least **three** chain rows completed per assessment-heavy lesson (or all items if fewer than three)
- [ ] No single “assessment quality” score conflating design and items
