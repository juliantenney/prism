"use strict";

/**
 * Progressive enhancement for guided-review checklists.
 * One criterion at a time with Previous/Next; no auto-advance.
 * Focus stays on the activated nav button; status announced politely.
 */

function getGuidedReviewRuntimeScript() {
  return (
    "(function(){" +
    "function qa(root,sel){return Array.prototype.slice.call(root.querySelectorAll(sel));}" +
    "function q(root,sel){return root.querySelector(sel);}" +
    "function setPanelState(panel,active){" +
    "if(!panel)return;" +
    "if(active){" +
    "panel.hidden=false;" +
    "panel.removeAttribute('inert');" +
    "panel.setAttribute('data-active','true');" +
    "}else{" +
    "panel.hidden=true;" +
    "panel.setAttribute('inert','');" +
    "panel.removeAttribute('data-active');" +
    "}" +
    "}" +
    "function sync(root,index,announce){" +
    "var panels=qa(root,'[data-guided-review-index]');" +
    "var total=panels.length;" +
    "if(!total)return;" +
    "var safe=Math.max(0,Math.min(index,total-1));" +
    "root.setAttribute('data-guided-review-active',String(safe));" +
    "panels.forEach(function(panel){" +
    "var i=Number(panel.getAttribute('data-guided-review-index')||0);" +
    "setPanelState(panel,i===safe);" +
    "});" +
    "var prev=q(root,'[data-guided-review-prev]');" +
    "var next=q(root,'[data-guided-review-next]');" +
    "if(prev)prev.disabled=safe===0;" +
    "if(next)next.disabled=safe>=total-1;" +
    "var panel=q(root,'[data-guided-review-index=\"'+safe+'\"]');" +
    "var progress=panel?q(panel,'[data-guided-review-progress]'):null;" +
    "var status=q(root,'[data-guided-review-status]');" +
    "if(announce&&status&&progress){status.textContent=progress.textContent||('Criterion '+(safe+1)+' of '+total);}" +
    "}" +
    "function enhance(root){" +
    "if(!root||root.getAttribute('data-guided-review-enhanced')==='true')return;" +
    "var panels=qa(root,'[data-guided-review-index]');" +
    "if(panels.length<2)return;" +
    "var nav=q(root,'[data-guided-review-nav]');" +
    "if(nav)nav.hidden=false;" +
    "root.setAttribute('data-guided-review-enhanced','true');" +
    "sync(root,0,false);" +
    "}" +
    "function onClick(event){" +
    "var btn=event.target&&event.target.closest?event.target.closest('[data-guided-review-prev],[data-guided-review-next]'):null;" +
    "if(!btn||btn.disabled)return;" +
    "var root=btn.closest('[data-guided-review=\"true\"]');" +
    "if(!root)return;" +
    "event.preventDefault();" +
    "var current=Number(root.getAttribute('data-guided-review-active')||0);" +
    "var delta=btn.hasAttribute('data-guided-review-next')?1:-1;" +
    "sync(root,current+delta,true);" +
    "try{btn.focus();}catch(e){}" +
    "}" +
    "function boot(){qa(document,'[data-guided-review=\"true\"]').forEach(enhance);}" +
    "document.addEventListener('click',onClick);" +
    "if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot);}" +
    "else{boot();}" +
    "})();"
  );
}

module.exports = {
  getGuidedReviewRuntimeScript: getGuidedReviewRuntimeScript
};
