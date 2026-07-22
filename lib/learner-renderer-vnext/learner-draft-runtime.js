"use strict";

/**
 * Bootstrap script for export pages. Prefers the bundled API when present.
 */
function getLearnerDraftRuntimeScript() {
  return (
    "(function(){" +
    "function boot(){" +
    "var roots=document.querySelectorAll('main.util-learner-renderer-vnext[data-persistence-page-key]');" +
    "if(!roots||!roots.length)return;" +
    "var api=window.PRISM_LEARNER_RENDERER_VNEXT;" +
    "if(!api||typeof api.initializeLearnerDraftPersistence!=='function')return;" +
    "Array.prototype.forEach.call(roots,function(root){" +
    "api.initializeLearnerDraftPersistence(root);" +
    "});" +
    "}" +
    "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);" +
    "else boot();" +
    "})();"
  );
}

module.exports = {
  getLearnerDraftRuntimeScript: getLearnerDraftRuntimeScript
};
