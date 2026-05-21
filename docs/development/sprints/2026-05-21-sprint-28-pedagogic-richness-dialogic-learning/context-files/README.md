# Sprint 28 probe captures

## 28-3 baseline (pre–28-5 implementation)

**Method:** `28-3-probe-runner.js` — pack prompts + E/O; optional OpenAI step chain.

```bash
node docs/development/sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/28-3-probe-runner.js
```

| File | Probe |
|------|-------|
| `probe-p28-01-live.md` | P28-01 climate |
| `probe-p28-02-live.md` | P28-02 peer instruction |
| `probe-p28-07-live.md` | P28-07 transcript |
| `28-3-probe-capture.json` | Full JSON |

## Post-5d stabilisation (Sprint 28 closed)

**Method:** `28-5d-stabilisation-probe-runner.js` — same briefs + **28-5a–5d** runtime (packs, contract scaffold, composition post-pass).

```bash
node docs/development/sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/28-5d-stabilisation-probe-runner.js
```

| File | Probe |
|------|-------|
| `probe-p28-01-post-5d.md` | P28-01 climate |
| `probe-p28-02-post-5d.md` | P28-02 peer |
| `probe-p28-07-post-5d.md` | P28-07 transcript |
| `28-5d-stabilisation-capture.json` | Full JSON |

Requires `.env.local` with `OPENAI_API_KEY` for live G/C layers. E/O architecture is captured without API.

**Caveat:** Validates generation under pack contracts + deterministic composition pass; not a substitute for full PRISM Run UI or renderer QA.
