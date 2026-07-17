"use strict";

var LEARNER_LABELS = Object.freeze({
  reflect: "Reflect",
  explain: "Understand",
  model: "See it modelled",
  practise: "Your turn",
  check: "Check your work",
  transfer: "Apply elsewhere"
});

function labelForRole(role) {
  var label = LEARNER_LABELS[String(role || "")];
  if (!label) {
    throw new Error("Unknown learner role: " + String(role || ""));
  }
  return label;
}

module.exports = {
  LEARNER_LABELS: LEARNER_LABELS,
  labelForRole: labelForRole
};
