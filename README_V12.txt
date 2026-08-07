JOPAMS GO v12 — Commercial UX System Pass
Base: v11

15 expert improvements applied
1. Design system unified: card families, radii, spacing, safe-area tokens.
2. Text hierarchy simplified and small text readability raised.
3. Home information density reduced and primary AR CTA prioritized.
4. Character skills converted to real gameplay effects:
   - Hoonmin: quiz XP +20%
   - Daim: first shield failure protected
   - Sunsik: timing capture success zone +20%
5. Collection rebuilt as discovery book: LOCKED/???, DISCOVERED, discovery date, progress %.
6. 12 public-purchase items retained as consistent modern SVG line icons; common UI icons also SVG.
7. AR startup optimized: lower-latency camera constraints, permission pre-warm, parallel camera/location/orientation start.
8. AR discovery feedback strengthened: distance → direction angle → target lock → 2.2s hold guidance.
9. Ranking motivation added: overall / organization / weekly rank indicators.
10. Locked season rewards remain readable with clear lock-state hierarchy.
11. Profile split into character selection / player profile / settings cards.
12. Bottom navigation, back buttons, quick actions and key settings use a unified SVG icon system.
13. Button hierarchy standardized: primary gradient / secondary outline / tertiary quiet.
14. Minimum mobile text readability raised; Korean word-break rules added.
15. Touch targets and focus-visible accessibility improved (44px minimum target principle).

Architecture / reliability
- Added assets/state.js: unified jopams_save_v1 schema + migration from legacy localStorage keys.
- Added assets/ui.js: shared SVG icons, nav upgrades, visible numeric separator helper.
- Existing app.js functions now read/write through unified state when available.
- Service Worker cache bumped to jopams-go-v12 and includes new JS modules.
- Five-item bottom navigation verified on all non-AR screens.

Validation performed
- Node syntax check: assets/app.js, assets/state.js, assets/ui.js PASS.
- Inline JavaScript syntax check for every HTML page PASS.
- HTML local resource/link reference scan PASS (0 missing).
- CSS brace balance PASS.
- tinycss2 stylesheet parse PASS (0 parser errors).
- Bottom-nav item count check PASS (5 items on all applicable pages).
- ZIP CRC integrity check performed after packaging.
