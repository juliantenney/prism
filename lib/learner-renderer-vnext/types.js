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
 * @typedef {Object} LearningOutcome
 * @property {string} id
 * @property {string} statement
 */

/**
 * @typedef {Object} VisualAffordanceHook
 * @property {string} slot
 * @property {string} activityId
 * @property {string=} affordanceId
 * @property {string=} subject
 */

/**
 * @typedef {Object} VisualAffordanceRenderPlan
 * @property {boolean} legacy
 * @property {Object.<string, Object>} slotGenerate
 * @property {number=} affordanceCount
 */

/**
 * @typedef {Object} BeatContentItem
 * @property {"instruction"|"prompt"|"material"|"expectedOutput"} kind
 * @property {LearnerInstruction=} instruction
 * @property {LearnerPrompt=} prompt
 * @property {LearnerMaterial=} material
 * @property {ExpectedOutputModel=} expectedOutput
 * @property {VisualAffordanceHook|null=} visualAffordanceBefore
 * @property {VisualAffordanceHook|null=} visualAffordanceAfter
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
 * @property {BeatContentItem[]} contentSequence
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
 * @property {string[]} mappedOutcomeIds
 * @property {LearnerBeat[]} beats
 * @property {VisualAffordanceHook|null=} visualAffordanceAfterHeader
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
 * @property {LearningOutcome[]} learningOutcomes
 * @property {string} progressionGuidance
 * @property {LearnerActivity[]} activities
 * @property {AssessmentModel} assessment
 * @property {string} studyTips
 * @property {VisualAffordanceRenderPlan=} visualAffordancePlan
 * @property {VisualAffordanceHook|null=} visualAffordanceBeforeAssessment
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

/**
 * @typedef {Object} ComposedLearnerPageModel
 * @property {"moments"} mode
 * @property {LearnerPageModel} sourceModel
 * @property {{ progressionLogic: string, sequenceContext: Object }} pageContext
 * @property {ComposedActivityModel[]} activities
 */

/**
 * @typedef {Object} ComposedActivityModel
 * @property {string} id
 * @property {{ studyPhase: string, activityPurpose: string }} context
 * @property {CompositionMoment[]} moments
 * @property {{ suppressFraming: boolean, omitBeatFunctions: string[], suppressBeatContent: Object.<string, { omitInstructionSteps: number[], omitMaterialIds: string[], omitExpectedOutput: boolean }> }} renderHints
 */

/**
 * @typedef {"orient"|"learn"|"do"|"check"|"reflect"|"transition"} CompositionMomentKind
 */

/**
 * @typedef {Object} WorkspaceRequirement
 * @property {"inline"|"external"} mode
 * @property {"text_entry"|"external_notes"|"table_entry"} capability
 * @property {number} sourceStepNumber
 * @property {string} instruction
 * @property {string=} responseLabel
 * @property {boolean} persistenceAvailable
 * @property {string} guidance
 */

/**
 * @typedef {Object} CompositionReveal
 * @property {"details"} mode
 * @property {boolean} defaultOpen
 * @property {string} summary
 */

/**
 * @typedef {Object} CompositionMoment
 * @property {CompositionMomentKind} kind
 * @property {CompositionItem[]} items
 * @property {LearnerInstruction[]=} explanatorySteps
 * @property {LearnerInstruction[]=} taskSteps
 * @property {LearnerInstruction[]=} checkingSteps
 * @property {LearnerMaterial[]=} materials
 * @property {ExpectedOutputModel|null=} expectedOutput
 * @property {WorkspaceRequirement|null=} workspace
 * @property {WorkspaceRequirement[]=} workspaces
 * @property {string=} learnerGuidance
 */

/**
 * @typedef {Object} CompositionItem
 * @property {"compositionText"|"prompt"|"instruction"|"material"|"expectedOutput"} kind
 * @property {string=} role
 * @property {string=} text
 * @property {LearnerPrompt=} prompt
 * @property {LearnerInstruction=} instruction
 * @property {LearnerMaterial=} material
 * @property {ExpectedOutputModel=} expectedOutput
 * @property {CompositionReveal|null=} reveal
 * @property {boolean=} tableWorkspace
 * @property {Object} sourceRef
 */

/**
 * @typedef {Object} ComposedActivityRenderHints
 * @property {boolean} suppressFraming
 * @property {string[]} omitBeatFunctions
 * @property {Object.<string, { omitInstructionSteps: number[], omitMaterialIds: string[], omitExpectedOutput: boolean }>} suppressBeatContent
 * @property {string=} learnMomentBeat
 * @property {string=} doMomentBeat
 * @property {string=} checkMomentBeat
 */

/**
 * @typedef {Object} ActivityCompositionRenderHints
 * @property {CompositionMoment|null} orientMoment
 * @property {CompositionMoment|null} learnMoment
 * @property {CompositionMoment|null} doMoment
 * @property {CompositionMoment|null} checkMoment
 * @property {boolean} suppressFraming
 * @property {string[]} omitBeatFunctions
 * @property {Object.<string, { omitInstructionSteps: number[], omitMaterialIds: string[], omitExpectedOutput: boolean }>} suppressBeatContent
 * @property {string=} learnMomentBeat
 * @property {string=} doMomentBeat
 * @property {string=} checkMomentBeat
 */

/**
 * @typedef {Object} LearnerPageRenderOptions
 * @property {Object.<string, ActivityCompositionRenderHints>=} activityComposition
 * @property {ComposedLearnerPageModel=} composed
 * @property {"beats"|"moments"=} compositionMode
 */

module.exports = {};
