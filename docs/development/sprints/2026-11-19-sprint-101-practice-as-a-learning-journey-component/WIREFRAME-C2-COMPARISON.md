# Sprint 101C — Interactive C2 vs Practice C2 comparison

**Status:** **ACCEPTED** as design foundation (not a mandatory template; refined by 101C-3)  
**Date:** 2026-11-19  
**Design case:** *Understanding Lagrange Multipliers* · commission **C2 — Seeing gradients and tangency**  
**Source export:** `c:\Users\cczjrt\Downloads\seeing-gradients-and-tangency.zip`  
**Local unpack:** [wireframe-source/seeing-gradients-and-tangency/](wireframe-source/seeing-gradients-and-tangency/)  
**Practice prototype:** [wireframe/practice-c2-seeing-gradients-and-tangency.html](wireframe/practice-c2-seeing-gradients-and-tangency.html)  
**Contract:** [PRACTICE-INSTRUCTIONAL-CONTRACT.md](PRACTICE-INSTRUCTIONAL-CONTRACT.md)  
**Technical audit:** [PRACTICE-TECHNICAL-CAPABILITY-AUDIT.md](PRACTICE-TECHNICAL-CAPABILITY-AUDIT.md)

Open the prototype in a browser (MathJax CDN required). This is a **design wireframe**, not the production learner renderer.

---

## 1. Inspection of existing Interactive C2

### 1.1 Mathematical learning purpose

C2 develops the geometric reading of equality-constrained optimisation on the fixed-perimeter rectangle \(A(x,y)=xy\), \(x+y=10\) (equivalently \(2x+2y=20\)):

1. Distinguish **objective increase** from **feasible movement**.  
2. Assign **gradient / tangent / normal** roles with vector evidence.  
3. Investigate **first-order feasible change** and why it vanishes at a regular constrained stationary point.  
4. Explain **\(\nabla A=\lambda\nabla g\)** from the feasible-tangent argument and transfer across equivalent constraint equations — without treating the condition as a global optimality proof.

Mapped LOs in the Interactive export (LO1–LO4) align with activities A1–A4.

### 1.2 Learner actions and response mechanisms

| Activity | Title | Actions / surfaces |
| -------- | ----- | ------------------ |
| A1 | Predict gradients and feasible movement | Predictions about points / directions; multiple constructed textareas; guidance toggle; reveal-after feedback |
| A2 | Compare gradients, tangents and normals | Comparison table for vectors \((6,4)\), \((4,-6)\), \((1,1)\), \((1,-1)\); multiple constructed responses |
| A3 | Investigate movement at tangency | Prediction + first-order calculations; math-field style inputs; geometric justification; revision-against-guidance pattern |
| A4 | Explain and test gradient alignment | Independent geometric explanation; transfer to \(2x+2y=20\); claim evaluation; extensive workspace |

Feedback is primarily **authored reveal-after** material plus learner self-criterion checkboxes (“My response now meets this criterion”). PRISM does not auto-mark constructed prose.

### 1.3 Essential mathematical explanations / representations (retain)

These are **necessary conceptual support**, not mere framing:

- Working definitions of \(A\), perimeter constraint, \(\nabla A=(y,x)\), \(\nabla g=(1,1)\), feasible tangent \(\mathbf{t}=(1,-1)\).  
- Diagrams / coordinate evidence for points \((2,8)\), \((4,6)\), \((6,6)\) and the four candidate vectors at \((4,6)\).  
- Dot-product checks establishing tangency / normality.  
- Comparison of \(\nabla A\cdot\mathbf{t}\) at \((4,6)\) vs \((5,5)\).  
- Parallel-gradient necessity and scope limits; multiplier rescaling under \(g_2=2g_1\).

### 1.4 Potentially redundant / ceremonial prose (Practice candidates to omit or thin)

Observed in Interactive `learner-page.html`:

| Region | Character | Practice stance |
| ------ | --------- | --------------- |
| Editorial opening image | Decorative atmospheric image | **Omit** on Practice page |
| Overview | Self-study resource orientation (“begin with… four connected activities…”) | **Omit / replace** with 1–2 sentence Practice lede |
| Learning purpose | Meta-arc about progressing to independence | **Omit** (journey owns progression narrative) |
| Knowledge summary | Long teaching digest (constrained optimisation, level curves, gradients, dot products, tangents…) | **Normally omit** as a section; keep only **working formulae** needed for attempts |
| Learning outcomes list | LO1–LO4 enumeration before activity | **Omit** from learner page (commission/author concern) |
| “Connect your learning” / long activity preambles | Restate prior activity + journey bridge every time | **Thin heavily**; one task sentence preferred |
| “Explore the idea” + multi-card teaching packs before each attempt | Substantial pre-task exposition (often overlaps KS) | **Condense**; prefer point-of-need stimulus + post-attempt feedback |
| Intellectual bridges / study tips / closing furniture | Session ceremony | **Omit** |
| Repeated criterion checklist chrome | Self-evaluation UI repeated per field | **Optional**; wireframe uses targeted revision cues instead |

### 1.5 Dependencies on surrounding Learning Journey

- Explicit bring-forward from prior constituent **“Why the constraint matters”** (feasible vs attractive objective values).  
- Journey home section exposition already frames why this stop exists.  
- Downstream journey work depends on geometric alignment intuition before multiplier algebra is treated as primary.

Practice must **assume** that prior stop and journey framing, not re-teach them.

---

## 2. Proposed Practice C2 structure

Prototype path: [wireframe/practice-c2-seeing-gradients-and-tangency.html](wireframe/practice-c2-seeing-gradients-and-tangency.html)

```text
Title + 2-sentence lede (journey-aware)
Compact “Problem in play” (working formulae only)
Activity 1 — Predict increase vs feasibility (classify points + gradient step + short distinction + hint/check/feedback/revision)
Activity 2 — Assign tangent/normal roles (table + meaning + hint/check/feedback)
Activity 3 — First-order change + alignment (numeric + scope + hint/check/feedback/revision)
Activity 4 — Transfer across equivalent constraints (judgements + short explanation + hint/check/feedback)
Natural end line (no study tips / closing essay)
```

Interactions are self-contained HTML/CSS/JS with checkable items where mathematics is determinate, plus constructed prompts where judgement/explanation is required.

---

## 3. Side-by-side comparison

| Dimension | Existing Interactive C2 | Proposed Practice C2 | Why the change helps |
| --------- | ----------------------- | -------------------- | -------------------- |
| Opening | Editorial image + Overview + Learning purpose + Knowledge summary + LO list | Title + short lede + compact problem apparatus | Reaches activity faster; journey already framed the stop |
| Knowledge summary | Full teaching digest before A1 | No KS section; formulae kept in “Problem in play” | Removes duplicated instruction while preserving attempt machinery |
| Pre-task teaching | “Explore the idea” materials + figures + explanatory cards per activity | SVG stimulus figures + task sentence; teaching return in feedback | Keeps representations; stops re-teaching before every attempt |
| Activity count / demand | A1–A4 full Interactive arc | Same four learning demands, leaner surfaces | Preserves mathematical demand (not dumbed down) |
| Response mechanisms | Many free-text fields + guidance + self-criteria | Mix of determinate selects/numerics + fewer constructed fields | Faster practice loop; still requires reasoning prose where needed |
| Feedback | Reveal-after authored solutions; self-criteria | Immediate check for determinate items + authored feedback panels; optional revision | Supports improvement without Interactive ceremony |
| Ending | Study tips region / page furniture | Single return-to-journey line | Avoids ceremonial close |
| Self-contained feel | Reads as a standalone self-study lesson | Reads as a journey practice stop | Matches 101B centre of gravity |

### What was removed

- Editorial opening image  
- Overview, Learning purpose, Knowledge summary, Learning outcomes, Study tips  
- Long Connect-your-learning / Explore-the-idea stacks  
- Repeated preamble bridges and dense criterion checklists  

### What was condensed

- Pre-task exposition → compact problem block + in-activity figures  
- Multiple parallel textareas per activity → fewer, higher-signal prompts  

### What was retained (on purpose)

- Rectangle constrained-optimisation mathematics and the same key points/vectors  
- Distinction between objective increase and feasibility  
- Dot-product assignment of tangent/normal roles  
- First-order analysis at \((4,6)\) vs \((5,5)\)  
- Parallel-gradient necessity, scope limits, equivalent-constraint transfer  
- Hints, feedback, optional revision  

---

## 4. Design acceptance check (against 101B D1–D8)

| ID | Criterion | Wireframe evidence |
| -- | --------- | ------------------ |
| D1 | Reach activity without unnecessary intro reading | Activity 1 begins after a short lede + compact setup |
| D2 | Essential explanation at point of need | Working formulae retained; deeper geometry in feedback/hints |
| D3 | Unambiguous task instructions | Each activity has an explicit task block |
| D4 | Feedback supports understanding/improvement | Checkable return + authored panels + revision cues on A1/A3 |
| D5 | Coherent with surrounding LJ | Lede assumes prior constraint work; end returns to journey |
| D6 | Plausible workload | Chip ~25–35 min; thinner furniture than full Interactive C2 |
| D7 | Standalone Interactive unchanged | Wireframe is a separate HTML prototype only |
| D8 | Existing Interactive LJ commissions valid | No product/schema changes in this phase |

---

## 5. Reviewer questions for 101C approval

1. Is the compact “Problem in play” block the right amount of retained apparatus, or should even that move into Activity 1 only?  
2. Are determinate checks (selects/numerics) acceptable in Practice v1 alongside constructed reasoning, or should more remain free-text like Interactive?  
3. Is four activities still right for this commission’s time envelope, or should A3+A4 merge further?  
4. Do the SVG figures adequately stand in for the exported PNG diagrams for design review?  
5. Approve 101C as the learner-experience baseline for 101D?

---

## 6. Files

| File | Role |
| ---- | ---- |
| [wireframe/practice-c2-seeing-gradients-and-tangency.html](wireframe/practice-c2-seeing-gradients-and-tangency.html) | Interactive Practice prototype |
| [wireframe-source/seeing-gradients-and-tangency/](wireframe-source/seeing-gradients-and-tangency/) | Unpacked Interactive export (reference) |
| This document | Comparison + inspection |
