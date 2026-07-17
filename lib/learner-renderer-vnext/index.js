/**
 * Learner renderer vNext model boundary.
 *
 * HTML rendering and legacy feature selection are intentionally absent from
 * this review milestone.
 */
"use strict";

var buildPageModel = require("./build-page-model").buildPageModel;
var validateInput = require("./validate-input").validateInput;
var validatePageModel = require("./validate-model").validatePageModel;
var hasLearnerFacingContent =
  require("./build-beat-model").hasLearnerFacingContent;
var ARCHETYPE_RULES = require("./archetype-rules").ARCHETYPE_RULES;
var LEARNER_LABELS = require("./labels").LEARNER_LABELS;

module.exports = {
  buildPageModel: buildPageModel,
  validateInput: validateInput,
  validatePageModel: validatePageModel,
  hasLearnerFacingContent: hasLearnerFacingContent,
  ARCHETYPE_RULES: ARCHETYPE_RULES,
  LEARNER_LABELS: LEARNER_LABELS
};
