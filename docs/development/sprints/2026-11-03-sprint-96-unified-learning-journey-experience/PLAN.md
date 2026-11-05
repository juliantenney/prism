# Sprint 96 — Plan / work log

**Sprint:** 96 — Unified Learning Journey Experience & Compatibility  
**Status:** **OPEN** — M1–M4 accepted (M3/M4/D15 qualified); M5 verification prepared — not accepted  
**Baseline:** `c5d93e85cb4bf1457f499ccac76763d75d272dad`

## Ordered work

1. Open sprint + documentation pack + read-only investigation. **COMPLETE** (S96-D01).  
2. M1 — Navigation and layout. **ACCEPTED** (S96-D08).  
3. M2 — Visual coherence. **ACCEPTED** (S96-D09).  
4. Resource-fidelity repair gate. **ACCEPTED** (S96-D10/D11).  
5. M3 — Contextual guidance. **ACCEPTED** (qualified, S96-D13) — no C5/C6 regen in S96.  
6. Publishing UI simplification. **COMPLETE** (S96-D14) — unified is the sole normal LJ download.  
7. M4 — Mathematics compatibility gate. **ACCEPTED** (qualified, S96-D16).  
8. Viewport-centred reading. **ACCEPTED** (qualified, S96-D15).  
9. M5 — Final acceptance. **OPEN** — M5.3 **ACCEPTED** (qualified, S96-D17); M5.1 / M5.2 disposition remain — [M5-VERIFICATION.md](M5-VERIFICATION.md); product default already unified per S96-D14.

## Log

| Date | Entry |
| ---- | ----- |
| 2026-11-03 | S96-D01 opened. INITIAL-INVESTIGATION recorded for layout/nav and MathLive/MathJax. |
| 2026-11-03 | M1 authorised. S96-D02…D07 recorded. Sticky contract + collapsible sidebar + tests shipped. S96-D08 proposed. |
| 2026-11-03 | M1 accepted (S96-D08) with visual-not-final caveat. M2 authorised and implemented: compact icon toggle, full-height sidebar, shell prev/next + title bar removed, reading width preserved, content-viewer CSS in shell resolve. S96-D09 proposed. |
| 2026-11-03 | M2 refinements authorised: initial-load focus outline fix; collapsed sidebar rail; shared `--learner-nav-*` tokens for journey/resource nav. Still at M2 acceptance gate. |
| 2026-11-03 | M2 overflow: real DUU C2/C3 showed +124px workspace scroll from `100vw` table breakouts beside sidebar; rebased to `100cqw` on `#lj-shell-main`. Sidebar not redesigned. |
| 2026-11-03 | **S96-D09 ACCEPTED** — author accepted M2 presentation and overflow fixes. |
| 2026-11-03 | **S96-D10** resource-fidelity gate: prefer `learnerPackage` HTML; rewrite `media/` paths; restore C2/C4 table workspaces + graphics. Stop before M3/M4. |
| 2026-11-03 | **S96-D11** fidelity accepted. **S96-D12** M3 authorised (narrow regen allowed). Delivery-neutral prompts + unified runtime handoff guidance. Stored journey not overwritten; candidate C5/C6 wording documented. S96-D13 proposed. |
| 2026-11-03 | **S96-D14** All Learning Journeys publish as unified experiences. Removed separate Unified download; normal Journey download → unified package. Legacy multi-doc retained internally. M4 still blocking. |
| 2026-11-03 | **S96-D15** Viewport-centred 70ch reading column (measured sidebar inset); wide tables use 100cqw available space. Awaiting author review. |
| 2026-11-04 | M4 implemented and committed (`19300d4`). S96-D16 proposed. |
| 2026-11-04 | **S96-D13 / D15 / D16 ACCEPTED (qualified).** M5 verification plan prepared. Sprint remains OPEN. No closure. |
| 2026-11-05 | M5.3: skip-to-main link + `aria-label="Learning content"` on `<main>`; tests green; NVDA observations recorded. M5/S96 remain OPEN. |
| 2026-11-05 | **S96-D17 ACCEPTED (qualified)** — M5.3 accessibility smoke. M5 final / S96 remain OPEN. No closure. |
