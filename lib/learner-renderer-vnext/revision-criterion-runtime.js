"use strict";

/**
 * S81-T-008 R4 — progressive enhancement for revision-pass criterion accompaniment.
 *
 * State (per activity Task region):
 *   activeRevisionCriterionId = null | criterionId
 * Derived:
 *   - full guidance visible iff activeRevisionCriterionId is set
 *   - compact reminder visible iff active + full guidance not in view + task still in view
 *
 * Compact reminder uses position:fixed when active (not sticky-from-above-fold).
 * Sticky from a slot already scrolled off-screen does not re-enter the viewport.
 *
 * TEMP (local preview): window.__PRISM_R4_DUMP__(activityId?) and optional
 * window.__PRISM_R4_DEBUG__=true console logging of the visibility decision.
 */

function getRevisionCriterionRuntimeScript() {
  return (
    "(function(){" +
    "function qa(root,sel){return Array.prototype.slice.call((root||document).querySelectorAll(sel));}" +
    "function q(root,sel){return (root||document).querySelector(sel);}" +
    "var observers=typeof WeakMap==='function'?new WeakMap():null;" +
    "var lastDumpKey='';" +
    "function debugEnabled(){" +
    "try{" +
    "if(window.__PRISM_R4_DEBUG__===true)return true;" +
    "var s=String((location&&location.search)||'');" +
    "return s.indexOf('r4debug=1')>=0;" +
    "}catch(e){return false;}" +
    "}" +
    "function findTask(activityId){" +
    "return q(document,'[data-composition-moment=\"do\"][data-activity-id=\"'+String(activityId||'').replace(/\"/g,'')+'\"]');" +
    "}" +
    "function findGuidance(task){return task?q(task,'[data-revision-guidance=\"true\"]'):null;}" +
    "function findReminder(task){return task?q(task,'[data-revision-reminder=\"true\"]'):null;}" +
    "function findCriterionRoot(el){" +
    "if(!el||!el.closest)return null;" +
    "return el.closest('[data-revision-criterion-root]');" +
    "}" +
    "function getScrollParent(el){" +
    "var node=el&&el.parentElement;" +
    "while(node&&node!==document.body&&node!==document.documentElement){" +
    "try{" +
    "var style=window.getComputedStyle(node);" +
    "var oy=style&&style.overflowY;" +
    "if((oy==='auto'||oy==='scroll'||oy==='overlay')&&node.scrollHeight>node.clientHeight+1){return node;}" +
    "}catch(e){}" +
    "node=node.parentElement;" +
    "}" +
    "return null;" +
    "}" +
    "function isInView(el){" +
    "if(!el||!el.getBoundingClientRect)return false;" +
    "var rect=el.getBoundingClientRect();" +
    "var root=getScrollParent(el);" +
    "if(root&&root.getBoundingClientRect){" +
    "var rr=root.getBoundingClientRect();" +
    "return rect.bottom>rr.top+1&&rect.top<rr.bottom-1;" +
    "}" +
    "var vh=window.innerHeight||(document.documentElement&&document.documentElement.clientHeight)||0;" +
    "return rect.bottom>1&&rect.top<vh-1;" +
    "}" +
    "function rectOf(el){" +
    "if(!el||!el.getBoundingClientRect)return null;" +
    "var r=el.getBoundingClientRect();" +
    "return{top:r.top,right:r.right,bottom:r.bottom,left:r.left,width:r.width,height:r.height};" +
    "}" +
    "function scrollRootInfo(el){" +
    "var root=getScrollParent(el);" +
    "if(!root)return{type:'WINDOW',scrollY:window.scrollY||window.pageYOffset||0,innerHeight:window.innerHeight||0};" +
    "return{type:'ELEMENT',tag:root.tagName,className:root.className||'',scrollTop:root.scrollTop,clientHeight:root.clientHeight,scrollHeight:root.scrollHeight};" +
    "}" +
    "function extractStatementHtml(root){" +
    "if(!root)return '';" +
    "var statement=q(root,'.util-guided-review__statement');" +
    "if(statement)return statement.innerHTML;" +
    "var label=q(root,'.util-interactive-checklist__label');" +
    "return label?label.innerHTML:'';" +
    "}" +
    "function buildBodyFromRoot(root){" +
    "if(!root)return '';" +
    "var parts=[];" +
    "var statementHtml=extractStatementHtml(root);" +
    "if(statementHtml){parts.push('<div class=\"util-revision-guidance__statement\">'+statementHtml+'</div>');}" +
    "var why=q(root,'.util-guided-review__why');" +
    "if(why)parts.push(why.outerHTML);" +
    "var look=q(root,'.util-guided-review__look-for');" +
    "if(look)parts.push(look.outerHTML);" +
    "var miss=q(root,'.util-guided-review__missing');" +
    "if(miss)parts.push(miss.outerHTML);" +
    "return parts.join('');" +
    "}" +
    "function setReminderVisible(reminder,visible){" +
    "if(!reminder)return;" +
    "if(visible){" +
    "reminder.hidden=false;" +
    "reminder.setAttribute('data-revision-reminder-active','true');" +
    "}else{" +
    "reminder.hidden=true;" +
    "reminder.removeAttribute('data-revision-reminder-active');" +
    "}" +
    "}" +
    "function collectDump(task){" +
    "var guidance=findGuidance(task);" +
    "var reminder=findReminder(task);" +
    "var heading=task?q(task,'.util-composition-moment-heading'):null;" +
    "var body=task?q(task,'.util-composition-moment__body'):null;" +
    "var active=task&&task.getAttribute('data-active-revision-criterion-id');" +
    "var guidanceFound=!!guidance;" +
    "var guidanceHidden=guidance?!!guidance.hidden:null;" +
    "var guidanceInView=guidanceFound&&!guidance.hidden?isInView(guidance):false;" +
    "var taskFound=!!task;" +
    "var taskInView=taskFound?isInView(task):false;" +
    "var headingInView=heading?isInView(heading):false;" +
    "var bodyInView=body?isInView(body):false;" +
    "var shouldShow=!!(active&&guidanceFound&&!guidance.hidden&&!guidanceInView&&taskInView);" +
    "var cs=reminder?window.getComputedStyle(reminder):null;" +
    "return{" +
    "activeRevisionCriterionId:active||null," +
    "taskMeans:'section[data-composition-moment=do] (entire Do/activity Task region — NOT the heading alone)'," +
    "guidanceFound:guidanceFound," +
    "guidanceHidden:guidanceHidden," +
    "guidanceRect:rectOf(guidance)," +
    "guidanceInView:guidanceInView," +
    "taskFound:taskFound," +
    "taskRect:rectOf(task)," +
    "taskInView:taskInView," +
    "headingFound:!!heading," +
    "headingRect:rectOf(heading)," +
    "headingInView:headingInView," +
    "bodyFound:!!body," +
    "bodyRect:rectOf(body)," +
    "bodyInView:bodyInView," +
    "scrollRoot:scrollRootInfo(guidance||task)," +
    "shouldShowReminder:shouldShow," +
    "dataRevisionReminderActive:reminder?reminder.getAttribute('data-revision-reminder-active'):null," +
    "reminderHidden:reminder?!!reminder.hidden:null," +
    "computed:cs?{display:cs.display,visibility:cs.visibility,opacity:cs.opacity,position:cs.position,top:cs.top,bottom:cs.bottom,zIndex:cs.zIndex,width:cs.width}:null," +
    "reminderRect:rectOf(reminder)" +
    "};" +
    "}" +
    "function logDump(dump,reason){" +
    "if(!debugEnabled()||!dump)return;" +
    "var key=[dump.activeRevisionCriterionId,dump.guidanceInView,dump.taskInView,dump.headingInView,dump.bodyInView,dump.shouldShowReminder,dump.dataRevisionReminderActive].join('|');" +
    "if(key===lastDumpKey&&reason==='scroll')return;" +
    "lastDumpKey=key;" +
    "try{console.log('[PRISM_R4]',reason||'sync',dump);}catch(e){}" +
    "}" +
    "function syncReminderFromGuidance(task){" +
    "var guidance=findGuidance(task);" +
    "var reminder=findReminder(task);" +
    "if(!reminder)return;" +
    "var active=task&&task.getAttribute('data-active-revision-criterion-id');" +
    "if(!active||!guidance||guidance.hidden){" +
    "setReminderVisible(reminder,false);" +
    "logDump(collectDump(task),'inactive-or-hidden-guidance');" +
    "return;" +
    "}" +
    "var guidanceInView=isInView(guidance);" +
    "var taskInView=isInView(task);" +
    "var shouldShow=!guidanceInView&&taskInView;" +
    "setReminderVisible(reminder,shouldShow);" +
    "logDump(collectDump(task),'scroll');" +
    "}" +
    "function ensureObserver(task){" +
    "var guidance=findGuidance(task);" +
    "if(!guidance||typeof IntersectionObserver!=='function')return;" +
    "var existing=observers?observers.get(task):null;" +
    "if(existing){try{existing.disconnect();}catch(e){}}" +
    "var root=getScrollParent(guidance);" +
    "var io=new IntersectionObserver(function(){syncReminderFromGuidance(task);},{root:root,threshold:0,rootMargin:'0px'});" +
    "io.observe(guidance);" +
    "io.observe(task);" +
    "if(observers)observers.set(task,io);" +
    "}" +
    "function setActive(task,criterionId,bodyHtml,statementHtml){" +
    "var guidance=findGuidance(task);" +
    "var reminder=findReminder(task);" +
    "if(!guidance)return null;" +
    "var body=q(guidance,'[data-revision-guidance-body]');" +
    "if(body)body.innerHTML=bodyHtml||'';" +
    "var stmt=reminder?q(reminder,'[data-revision-reminder-statement]'):null;" +
    "if(stmt)stmt.innerHTML=statementHtml||'';" +
    "if(criterionId){" +
    "guidance.hidden=false;" +
    "guidance.setAttribute('data-active-revision-criterion-id',String(criterionId));" +
    "task.setAttribute('data-active-revision-criterion-id',String(criterionId));" +
    "if(reminder)reminder.setAttribute('data-active-revision-criterion-id',String(criterionId));" +
    "ensureObserver(task);" +
    "syncReminderFromGuidance(task);" +
    "}else{" +
    "guidance.hidden=true;" +
    "guidance.removeAttribute('data-active-revision-criterion-id');" +
    "task.removeAttribute('data-active-revision-criterion-id');" +
    "if(reminder){" +
    "reminder.removeAttribute('data-active-revision-criterion-id');" +
    "setReminderVisible(reminder,false);" +
    "if(stmt)stmt.innerHTML='';" +
    "}" +
    "if(body)body.innerHTML='';" +
    "}" +
    "return guidance;" +
    "}" +
    "function activateFromControl(control){" +
    "var activityId=control.getAttribute('data-activity-id')||'';" +
    "var criterionId=control.getAttribute('data-revision-criterion-id')||'';" +
    "var task=findTask(activityId);" +
    "if(!task||!criterionId)return;" +
    "var root=findCriterionRoot(control);" +
    "var bodyHtml=buildBodyFromRoot(root);" +
    "var statementHtml=extractStatementHtml(root);" +
    "var guidance=setActive(task,criterionId,bodyHtml,statementHtml);" +
    "var href=control.getAttribute('href');" +
    "if(href&&href.charAt(0)==='#'){" +
    "try{if(history&&history.pushState){history.pushState(null,'',href);}else{location.hash=href.slice(1);}}catch(e){try{location.hash=href.slice(1);}catch(e2){}}" +
    "}" +
    "var heading=guidance?q(guidance,'.util-revision-guidance__heading'):null;" +
    "if(heading){try{heading.focus();}catch(e3){}}" +
    "syncReminderFromGuidance(task);" +
    "logDump(collectDump(task),'activate');" +
    "}" +
    "function hideFromControl(btn){" +
    "var guidance=btn.closest?btn.closest('[data-revision-guidance=\"true\"]'):null;" +
    "if(!guidance)return;" +
    "var task=guidance.closest?guidance.closest('[data-composition-moment=\"do\"]'):null;" +
    "if(!task)return;" +
    "setActive(task,null,'','');" +
    "var taskHeading=q(task,'.util-composition-moment-heading');" +
    "if(taskHeading){try{taskHeading.focus();}catch(e){}}" +
    "}" +
    "function viewGuidanceFromControl(btn){" +
    "var reminder=btn.closest?btn.closest('[data-revision-reminder=\"true\"]'):null;" +
    "if(!reminder)return;" +
    "var task=reminder.closest?reminder.closest('[data-composition-moment=\"do\"]'):null;" +
    "if(!task)return;" +
    "var guidance=findGuidance(task);" +
    "if(!guidance||guidance.hidden)return;" +
    "try{if(guidance.scrollIntoView)guidance.scrollIntoView({block:'start',behavior:'smooth'});}catch(e){try{guidance.scrollIntoView(true);}catch(e2){}}" +
    "var heading=q(guidance,'.util-revision-guidance__heading');" +
    "if(heading){try{heading.focus();}catch(e3){}}" +
    "setReminderVisible(reminder,false);" +
    "setTimeout(function(){syncReminderFromGuidance(task);},50);" +
    "}" +
    "function onClick(event){" +
    "var t=event.target;" +
    "if(!t)return;" +
    "var revise=t.closest?t.closest('[data-revise-with-criterion]'):null;" +
    "if(revise){" +
    "event.preventDefault();" +
    "activateFromControl(revise);" +
    "return;" +
    "}" +
    "var hide=t.closest?t.closest('[data-revision-guidance-hide]'):null;" +
    "if(hide){" +
    "event.preventDefault();" +
    "hideFromControl(hide);" +
    "return;" +
    "}" +
    "var view=t.closest?t.closest('[data-revision-reminder-view]'):null;" +
    "if(view){" +
    "event.preventDefault();" +
    "viewGuidanceFromControl(view);" +
    "}" +
    "}" +
    "function onScrollOrResize(){" +
    "qa(document,'[data-composition-moment=\"do\"][data-active-revision-criterion-id]').forEach(syncReminderFromGuidance);" +
    "}" +
    "window.__PRISM_R4_DUMP__=function(activityId){" +
    "var task=activityId?findTask(activityId):q(document,'[data-composition-moment=\"do\"][data-active-revision-criterion-id]');" +
    "if(!task)task=q(document,'[data-composition-moment=\"do\"]');" +
    "var dump=collectDump(task);" +
    "try{console.log('[PRISM_R4_DUMP]',dump);}catch(e){}" +
    "return dump;" +
    "};" +
    "document.addEventListener('click',onClick);" +
    "document.addEventListener('scroll',onScrollOrResize,true);" +
    "window.addEventListener('scroll',onScrollOrResize,{passive:true});" +
    "window.addEventListener('resize',onScrollOrResize);" +
    "})();"
  );
}

module.exports = {
  getRevisionCriterionRuntimeScript: getRevisionCriterionRuntimeScript
};
