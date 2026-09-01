"use strict";

var sync = require("./math-entry-spike-sync");

var MATHLIVE_SPIKE_VERSION = sync.MATHLIVE_SPIKE_VERSION;
var MATHLIVE_SPIKE_SCRIPT = "lib/mathlive-spike/mathlive.min.js";
var MATHLIVE_SPIKE_CSS = "lib/mathlive-spike/mathlive-fonts.css";

function getMathEntrySpikePresentationCss() {
  return (
    ".util-learner-workspace--math-spike .util-math-entry-spike__mount{display:none;}" +
    ".util-learner-workspace--math-spike.util-learner-workspace--math-enhanced .util-math-entry-spike__mount{" +
    "display:block;min-height:3rem;margin:.5rem 0;border:1px solid var(--util-border,#ccc);border-radius:4px;padding:.25rem;}" +
    ".util-learner-workspace--math-spike.util-learner-workspace--math-enhanced .util-learner-workspace__input--canonical{" +
    "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}" +
    ".util-learner-workspace--math-spike.util-learner-workspace--math-fallback .util-math-entry-spike__mount{display:none;}" +
    ".util-math-entry-spike__hint{font-size:.875rem;color:var(--util-muted,#555);margin:.25rem 0 .5rem;}" +
    ".util-learner-workspace--math-enhanced .util-math-entry-spike__hint--fallback-only{display:none;}" +
    "math-field.util-math-entry-spike__field{display:block;min-height:2.5rem;width:100%;font-size:1.05rem;}"
  );
}

function getMathEntrySpikeHeadMarkup() {
  return (
    '<link rel="stylesheet" href="' +
    MATHLIVE_SPIKE_CSS +
    '">' +
    '<script src="' +
    MATHLIVE_SPIKE_SCRIPT +
    '"></script>'
  );
}

function getMathEntrySpikeRuntimeScript() {
  return (
    "(function(){" +
    "var SPIKE_VERSION=" +
    JSON.stringify(MATHLIVE_SPIKE_VERSION) +
    ";" +
    "function q(root,sel){return (root||document).querySelector(sel);}" +
    "function qa(root,sel){return Array.prototype.slice.call((root||document).querySelectorAll(sel));}" +
    "function readLatex(mf){try{return mf&&typeof mf.getValue==='function'?String(mf.getValue('latex')||''):'';}catch(e){return '';}}" +
    "function writeLatex(mf,v){try{if(mf&&typeof mf.setValue==='function'){mf.setValue(String(v==null?'':v),{silenceNotifications:true});return true;}}catch(e){}return false;}" +
    "function dispatchInput(textarea){try{textarea.dispatchEvent(new Event('input',{bubbles:true}));}catch(e){}}" +
    "function enableTextareaFallback(workspace){if(!workspace)return;" +
    "workspace.classList.remove('util-learner-workspace--math-enhanced');" +
    "workspace.classList.add('util-learner-workspace--math-fallback');" +
    "var textarea=q(workspace,'textarea.util-learner-workspace__input');" +
    "if(textarea){textarea.removeAttribute('aria-hidden');textarea.removeAttribute('tabindex');}" +
    "var mount=q(workspace,'[data-math-entry-mount]');" +
    "if(mount){mount.innerHTML='';mount.setAttribute('hidden','hidden');}" +
    "}" +
    "function enhanceWorkspace(workspace,MathfieldElement){var textarea=q(workspace,'textarea.util-learner-workspace__input');" +
    "var mount=q(workspace,'[data-math-entry-mount]');" +
    "var labelId=workspace.getAttribute('data-math-label-id')||'';" +
    "if(!textarea||!mount||!MathfieldElement){enableTextareaFallback(workspace);return null;}" +
    "try{" +
    "var mf=new MathfieldElement();" +
    "mf.className='util-math-entry-spike__field';" +
    "mf.setAttribute('data-math-entry-field','true');" +
    "if(labelId)mf.setAttribute('aria-labelledby',labelId);" +
    "mf.setAttribute('virtual-keyboard-mode','onfocus');" +
    "writeLatex(mf,textarea.value);" +
    "mf.addEventListener('input',function(){textarea.value=readLatex(mf);dispatchInput(textarea);});" +
    "mount.innerHTML='';" +
    "mount.removeAttribute('hidden');" +
    "mount.appendChild(mf);" +
    "textarea.setAttribute('aria-hidden','true');" +
    "textarea.setAttribute('tabindex','-1');" +
    "workspace.classList.add('util-learner-workspace--math-enhanced');" +
    "workspace.classList.remove('util-learner-workspace--math-fallback');" +
    "workspace.__prismMathfield=mf;" +
    "return mf;" +
    "}catch(e){enableTextareaFallback(workspace);return null;}" +
    "}" +
    "function resyncAll(){qa(document,'[data-input-modality=\"math\"]').forEach(function(ws){" +
    "var mf=ws.__prismMathfield;var textarea=q(ws,'textarea.util-learner-workspace__input');" +
    "if(mf&&textarea)writeLatex(mf,textarea.value);" +
    "});}" +
    "function init(root){var scope=root||document;" +
    "if(window.__PRISM_MATH_ENTRY_SPIKE_DISABLE__===true){" +
    "qa(scope,'[data-input-modality=\"math\"]').forEach(enableTextareaFallback);return;}" +
    "var MathfieldElement=window.MathLive&&window.MathLive.MathfieldElement;" +
    "if(!MathfieldElement){qa(scope,'[data-input-modality=\"math\"]').forEach(enableTextareaFallback);return;}" +
    "qa(scope,'[data-input-modality=\"math\"]').forEach(function(ws){enhanceWorkspace(ws,MathfieldElement);});" +
    "}" +
    "function boot(){init(document);setTimeout(resyncAll,0);setTimeout(resyncAll,250);}" +
    "window.PRISM_MATH_ENTRY_SPIKE={version:SPIKE_VERSION,init:init,boot:boot,resyncAll:resyncAll,enableTextareaFallback:enableTextareaFallback,enhanceWorkspace:enhanceWorkspace};" +
    "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();" +
    "document.addEventListener('prism:learner-draft-restored',function(){resyncAll();});" +
    "})();"
  );
}

module.exports = {
  MATHLIVE_SPIKE_VERSION: MATHLIVE_SPIKE_VERSION,
  MATHLIVE_SPIKE_SCRIPT: MATHLIVE_SPIKE_SCRIPT,
  MATHLIVE_SPIKE_CSS: MATHLIVE_SPIKE_CSS,
  getMathEntrySpikePresentationCss: getMathEntrySpikePresentationCss,
  getMathEntrySpikeHeadMarkup: getMathEntrySpikeHeadMarkup,
  getMathEntrySpikeRuntimeScript: getMathEntrySpikeRuntimeScript
};
