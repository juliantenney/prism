"use strict";

/**
 * Client runtime for interactive formative assessment checks.
 */

function getAssessmentRuntimeScript() {
  return (
    "(function(){" +
    "function q(root,sel){return root.querySelector(sel);}" +
    "function qa(root,sel){return Array.prototype.slice.call(root.querySelectorAll(sel));}" +
    "function selectedOption(item){" +
    "var checked=q(item,'input[type=radio]:checked');" +
    "return checked?String(checked.value||''):'';" +
    "}" +
    "function setResult(item,html,isError){" +
    "var region=q(item,'[data-assessment-result]');" +
    "if(!region)return;" +
    "region.hidden=false;" +
    "region.className='util-assessment-result'+(isError?' util-assessment-result--prompt':'');" +
    "region.innerHTML=html;" +
    "}" +
    "function escapeHtml(value){" +
    "return String(value||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');" +
    "}" +
    "function notify(item){" +
    "try{" +
    "var root=item.closest?item.closest('main.util-learner-renderer-vnext'):null;" +
    "var target=root||item;" +
    "var event=null;" +
    "if(typeof CustomEvent==='function'){event=new CustomEvent('prism:learner-workspace-change',{bubbles:true,detail:{kind:'assessment_selection',workspaceId:item.getAttribute('data-workspace-id')||''}});} " +
    "else if(document.createEvent){event=document.createEvent('Event');event.initEvent('prism:learner-workspace-change',true,true);} " +
    "if(event&&target&&target.dispatchEvent)target.dispatchEvent(event);" +
    "}catch(e){}" +
    "}" +
    "function checkItem(item){" +
    "var selected=selectedOption(item);" +
    "if(!selected){" +
    "setResult(item,'<p>Select an answer before checking.</p>',true);" +
    "item.setAttribute('data-assessment-checked','false');" +
    "notify(item);" +
    "return;" +
    "}" +
    "var correct=String(item.getAttribute('data-assessment-correct')||'');" +
    "var rationale=String(item.getAttribute('data-assessment-rationale')||'').trim();" +
    "var ok=selected===correct;" +
    "var html='';" +
    "if(ok){html='<p><strong>Correct.</strong></p>';}" +
    "else{html='<p><strong>Not quite.</strong> The correct answer is '+escapeHtml(correct)+'.</p>';}" +
    "if(rationale){html+='<p class=\"util-assessment-rationale\">'+escapeHtml(rationale)+'</p>';}" +
    "setResult(item,html,false);" +
    "item.setAttribute('data-assessment-checked','true');" +
    "item.setAttribute('data-assessment-last-result',ok?'correct':'incorrect');" +
    "notify(item);" +
    "}" +
    "function onClick(event){" +
    "var btn=event.target&&event.target.closest?event.target.closest('[data-assessment-check]'):null;" +
    "if(!btn)return;" +
    "var item=btn.closest('.util-assessment-item--interactive');" +
    "if(!item)return;" +
    "event.preventDefault();" +
    "checkItem(item);" +
    "}" +
    "function onChange(event){" +
    "var input=event.target;" +
    "if(!input||!input.matches||!input.matches('input[type=radio][data-assessment-option]'))return;" +
    "var item=input.closest('.util-assessment-item--interactive');" +
    "if(!item)return;" +
    "notify(item);" +
    "}" +
    "document.addEventListener('click',onClick);" +
    "document.addEventListener('change',onChange);" +
    "})();"
  );
}

module.exports = {
  getAssessmentRuntimeScript: getAssessmentRuntimeScript
};
