"use strict";

/**
 * Presentation for the desktop Check your work sidebar.
 * Visual language follows the Learning Journey sidebar: full-height column,
 * hairline border, slate background, and the same icon-button control.
 * The reading column stays on the existing 70ch measure.
 */
function getCheckSidebarPresentationCss() {
  return (
    ".util-learner-renderer-vnext{--learner-reading-width:70ch;--learner-page-gutter:1rem}" +
    ".util-learner-page.util-learner-renderer-vnext{width:min(calc(100% - 2 * var(--learner-page-gutter)),var(--learner-reading-width));margin-inline:auto;box-sizing:border-box}" +
    ".util-check-sidebar-launch{margin:var(--learner-space-3,1rem) 0 0}" +
    ".util-check-sidebar-launch__control{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:.55rem 1rem;border:1px solid #93c5fd;border-radius:8px;background:#eff6ff;color:#1d4ed8;font:inherit;font-size:var(--learner-text-sm,.875rem);font-weight:650;line-height:1.3;text-decoration:none}" +
    ".util-check-sidebar-launch__control:hover{background:#dbeafe}" +
    ".util-check-sidebar-launch__control:focus-visible{outline:2px solid #2563eb;outline-offset:2px}" +
    ".util-check-sidebar__chrome{display:none}" +
    ".util-check-sidebar__sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open']{position:fixed;z-index:60;top:0;right:0;bottom:0;width:calc((100vw - var(--learner-reading-width,70ch)) / 2 - var(--learner-page-gutter,1rem));max-width:none;margin:0;padding:0;box-sizing:border-box;display:flex;flex-direction:column;overflow:hidden;background:#f8fafc;border:0;border-left:1px solid #e5e7eb;border-radius:0;box-shadow:none}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-mode='dock'][data-check-sidebar-state='closed']{display:none}" +
    /* Wide viewports use Check your work; hide the duplicate inline review until JS confirms inline mode. */
    "@media (min-width:72rem){.util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar='available']:not([data-check-sidebar-mode='inline']):not([data-check-sidebar-state='open']){display:none}}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-check-sidebar__chrome{display:flex;align-items:flex-start;gap:.65rem;flex:0 0 auto;padding:.85rem .85rem .65rem;background:#f8fafc;border-bottom:1px solid #e5e7eb}" +
    ".util-check-sidebar__brand{flex:1 1 auto;min-width:0;padding-top:.2rem}" +
    ".util-check-sidebar__title{margin:0;font-size:1rem;line-height:1.35;font-weight:650;letter-spacing:-.01em;color:#0f172a}" +
    ".util-check-sidebar__progress{margin:.15rem 0 0;font-size:.875rem;line-height:1.35;font-weight:600;color:#64748b}" +
    ".util-check-sidebar__close{appearance:none;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:2.25rem;height:2.25rem;min-width:2.25rem;min-height:2.25rem;padding:0;border:1px solid transparent;border-radius:.55rem;background:transparent;color:#334155;cursor:pointer}" +
    ".util-check-sidebar__close:hover{background:#e2e8f0;color:#0f172a}" +
    ".util-check-sidebar__close:focus-visible{outline:2px solid #2563eb;outline-offset:2px}" +
    ".util-check-sidebar__icon{display:block}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-composition-moment__body{flex:1 1 auto;min-height:0;margin:0;overflow:auto;overscroll-behavior:contain;padding:.85rem .85rem 1.25rem}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-composition-moment-heading," +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-composition-moment-nav," +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-guided-review__title," +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-guided-review__progress{display:none}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-check-sidebar__footer{flex:0 0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:.75rem;margin:0;padding:.75rem .85rem;border-top:1px solid #e5e7eb;background:#f8fafc}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-guided-review__guidance{border:0;margin:0;background:transparent;overflow:visible}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-guided-review__guidance>summary{display:none}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-guided-review__guidance[open]>.util-composition-reveal__body{display:block;border-top:0;padding:.25rem 0 0;background:transparent}" +
    ".util-verified-review{margin-top:var(--learner-space-4,1.5rem)}" +
    ".util-verified-review__toggle{display:none}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-verified-review__toggle{display:inline-flex;align-items:center;min-height:44px;margin:0 0 .75rem;padding:.55rem .9rem;border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:#1d4ed8;font:inherit;font-size:var(--learner-text-sm,.875rem);font-weight:650;cursor:pointer}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-verified-review__toggle:focus-visible{outline:2px solid #2563eb;outline-offset:2px}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-verified-review__panel:not([data-verified-visible='true']){display:none}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'][data-check-view='verified'] .util-guided-review," +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'][data-check-view='verified'] .util-check-sidebar__footer," +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'][data-check-view='verified'] .util-check-sidebar__progress{display:none}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'][data-check-view='verified'] .util-verified-review{margin-top:0}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'][data-check-view='verified'] .util-verified-review__panel{display:block}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'][data-check-view='verified'] .util-verified-review__panel .util-composition-reveal>summary{display:none}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'][data-check-view='verified'] .util-verified-review__panel .util-composition-reveal>.util-composition-reveal__body{display:block;border-top:0;padding:0;background:transparent}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-material-table-block," +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-learner-table-breakout{width:auto;max-width:100%;margin-left:0;margin-right:0}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-table-scroll," +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-composition-reveal," +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-verified-review__panel{max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}" +
    "@media print{" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-mode='dock'][data-check-sidebar-state='closed']{display:block}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar='available']:not([data-check-sidebar-mode='inline']):not([data-check-sidebar-state='open']){display:block}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open']{position:static;top:auto;right:auto;bottom:auto;width:auto;display:block;overflow:visible;height:auto;border:0}" +
    ".util-check-sidebar__chrome,.util-check-sidebar-launch,.util-verified-review__toggle{display:none!important}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-composition-moment__body{overflow:visible}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-composition-moment-heading," +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'] .util-guided-review__progress{display:block!important}" +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'][data-check-view='verified'] .util-guided-review," +
    ".util-learner-renderer-vnext .util-composition-moment--check[data-check-sidebar-state='open'][data-check-view='verified'] .util-check-sidebar__footer{display:block!important}" +
    ".util-verified-review__panel{display:block!important}" +
    ".util-guided-review__panel[hidden]{display:block!important}" +
    "}"
  );
}

module.exports = {
  getCheckSidebarPresentationCss: getCheckSidebarPresentationCss
};
