# Sprint 100 — Initial investigation (timing realism)

**Status:** Recorded from the pre-sprint investigation (read-only).  
**Scope:** Architecture map, assumptions, exemplar evidence, QA gaps.  
**Not:** empirical learner completion-time study.

---

## Architecture (concise)

PRISM largely **fits** activities into author-supplied envelopes using model judgement plus arithmetic checks (`duration_minutes` sums, DLA-WB-03 ±10 band, Learning Sequence equality with effective workflow duration).

There was **no** independent demand-based feasibility check prior to Sprint 100A.

Key surfaces: Learning Journey sibling TIME CHECKs; Interactive DLA / Learning Sequence; Assessment Pack `indicative_time` / `indicative_duration_minutes`; Expository 200 WPM planning extent; renderer presentation of stored minutes.

---

## Exemplar evidence (published values vs likely effort)

Distinguish **observed published timing guidance** from **hypothetical estimates** of likely learner effort. No empirical completion-time data has been collected.

### The Slippery Case of the Truth

| Observed published guidance | Demand | Investigation note |
| --- | --- | --- |
| Final assessment **15 min** total, with **10 min** composition of a **300–400-word** philosophical argument (plus prep and six-criterion self-review) | Extended argumentative writing + case revisit | Declared composition window looks optimistic |
| Reconsideration activity **9 min**, with **5 min** for **180–250-word** analytical reflection | Comparative philosophical justification | Drafting window looks optimistic |

Journey overview still presents ~**90 minutes** total while packing theory-heavy Interactives, Expository reading, Journal use and writing performances.

### The Decision That Went Wrong

| Observed | Demand | Investigation note |
| --- | --- | --- |
| Recommendation **19 min** for **350–500 words** after reviewing a full evidence dossier | Dossier review + justified institutional recommendation | Combined demand likely exceeds 19 min |

### Understanding Lagrange Multipliers

| Observed | Demand | Investigation note |
| --- | --- | --- |
| Independent solve **15 min** + feedback review **5 min** | Focused mathematical problem | More plausible comparison case |

---

## QA gap

Existing checks catch **mis-addition** of minutes. They do not challenge **implausibly short** allocations relative to reading, reasoning, writing, feedback or revision demand.

---

## Implication for Sprint 100

Introduce a small, explainable feasibility estimator (100A), then advisory integration starting with Interactive (100B-1), without auto-compression or false precision.
