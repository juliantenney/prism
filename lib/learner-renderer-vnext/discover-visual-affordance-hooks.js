"use strict";

function readAttribute(attributes, name) {
  var pattern = new RegExp('\\s' + name + '="([^"]*)"', "i");
  var match = String(attributes || "").match(pattern);
  return match ? match[1] : "";
}

function readClassName(tag) {
  var match = String(tag || "").match(/class="([^"]*)"/i);
  return match ? match[1] : "";
}

/**
 * Parse hidden visual affordance hooks from learner HTML (VEU discovery contract).
 *
 * @param {string} html
 * @returns {Array<{slot:string, activityId:string, affordanceId:string, subject:string, className:string, raw:string}>}
 */
function discoverVisualAffordanceHooks(html) {
  var hooks = [];
  var pattern = /<div class="util-visual-affordance[^"]*"([^>]*)><\/div>/g;
  var match;

  while ((match = pattern.exec(String(html || "")))) {
    var attrs = match[1];
    hooks.push({
      slot: readAttribute(attrs, "data-visual-slot"),
      activityId: readAttribute(attrs, "data-activity-id"),
      affordanceId: readAttribute(attrs, "data-affordance-id"),
      subject: readAttribute(attrs, "data-visual-subject"),
      className: readClassName(match[0]),
      raw: match[0]
    });
  }

  return hooks;
}

function hookKey(hook) {
  return [
    hook.slot || "",
    hook.activityId || "",
    hook.affordanceId || "",
    hook.subject || ""
  ].join("|");
}

function assertUniqueHooks(hooks) {
  var seen = new Set();
  hooks.forEach(function (hook) {
    var key = hookKey(hook);
    if (seen.has(key)) {
      throw new Error("duplicate visual affordance hook: " + key);
    }
    seen.add(key);
  });
  return true;
}

module.exports = {
  discoverVisualAffordanceHooks: discoverVisualAffordanceHooks,
  hookKey: hookKey,
  assertUniqueHooks: assertUniqueHooks
};
