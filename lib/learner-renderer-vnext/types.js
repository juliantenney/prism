/**
 * Canonical type contract for the learner renderer vNext model boundary.
 *
 * This module intentionally contains no rendering logic.
 */
"use strict";

/**
 * @typedef {"reflect"|"explain"|"model"|"practise"|"check"|"transfer"} LearnerRole
 */

/**
 * @typedef {Object} LearnerInstruction
 * @property {number} sourceStepNumber
 * @property {string} text
 */

/**
 * @typedef {Object} LearnerPrompt
 * @property {string} sourceField
 * @property {string} text
 */

/**
 * @typedef {Object} ChecklistModel
 * @property {string[]} criteria
 * @property {string|null} revisionInstruction
 */

/**
 * @typedef {Object} LearnerMaterial
 * @property {string} id
 * @property {string} type
 * @property {string} title
 * @property {string} bodyFormat
 * @property {string} body
 * @property {number} sourceOrder
 * @property {ChecklistModel|null} checklist
 */

/**
 * @typedef {Object} ExpectedOutputModel
 * @property {string} text
 */

/**
 * @typedef {Object} LearnerBeat
 * @property {string} sourceFunction
 * @property {LearnerRole} learnerRole
 * @property {string} learnerLabel
 * @property {LearnerInstruction[]} instructions
 * @property {LearnerPrompt[]} prompts
 * @property {LearnerMaterial[]} materials
 * @property {ExpectedOutputModel|null} expectedOutput
 */

/**
 * @typedef {Object} OmittedBeatDiagnostic
 * @property {string} activityId
 * @property {string} sourceFunction
 * @property {"empty_learner_facing_content"} reason
 */

/**
 * @typedef {Object} LearnerActivity
 * @property {string} id
 * @property {string} title
 * @property {number|null} durationMinutes
 * @property {string} grouping
 * @property {string} preamble
 * @property {string} reasoningOrientation
 * @property {LearnerBeat[]} beats
 */

/**
 * @typedef {Object} OrientationSection
 * @property {string} type
 * @property {string} title
 * @property {string} content
 */

/**
 * @typedef {Object} PageHeader
 * @property {string} description
 * @property {number|null} durationMinutes
 */

/**
 * @typedef {Object} AssessmentModel
 * @property {Object[]} items
 */

/**
 * @typedef {Object} LearnerPageModel
 * @property {string} title
 * @property {PageHeader} header
 * @property {OrientationSection[]} orientationSections
 * @property {LearnerActivity[]} activities
 * @property {AssessmentModel} assessment
 * @property {string} studyTips
 */

/**
 * @typedef {"error"|"warning"} DiagnosticSeverity
 */

/**
 * @typedef {Object} LearnerRendererDiagnostic
 * @property {DiagnosticSeverity} severity
 * @property {string} code
 * @property {string} message
 * @property {string=} activityId
 * @property {string=} materialId
 * @property {string=} materialType
 * @property {string[]=} candidateBeats
 * @property {number=} sourceStepNumber
 * @property {string=} sourceFunction
 * @property {string=} sourceField
 */

/**
 * @typedef {Object} LearnerPageModelResult
 * @property {boolean} ok
 * @property {LearnerPageModel|null} model
 * @property {LearnerRendererDiagnostic[]} errors
 * @property {LearnerRendererDiagnostic[]} warnings
 * @property {{omittedBeats: OmittedBeatDiagnostic[]}} diagnostics
 */

/**
 * @typedef {Object} TaskAllocationRule
 * @property {number|"rest"} take
 */

/**
 * @typedef {Object} BeatAssignmentRule
 * @property {string} sourceFunction
 * @property {LearnerRole} learnerRole
 * @property {string[]} materialTypes
 * @property {string[]} materialOrder
 * @property {string[]} promptFields
 * @property {TaskAllocationRule} taskSteps
 * @property {boolean} includeExpectedOutput
 */

/**
 * @typedef {Object} ArchetypeVariantRule
 * @property {string} id
 * @property {string[]} beatSequence
 * @property {BeatAssignmentRule[]} beats
 */

/**
 * @typedef {Object.<string, {variants: ArchetypeVariantRule[]}>} ArchetypeRules
 */

module.exports = {};
