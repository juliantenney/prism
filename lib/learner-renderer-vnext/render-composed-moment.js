"use strict";



var html = require("./render-html-utils");

var renderMaterial = require("./render-material").renderMaterial;
var renderTableWorkspace = require("./render-table-workspace").renderTableWorkspace;
var renderOrderingWorkspace =
  require("./render-ordering-workspace").renderOrderingWorkspace;

var learnerIcons = require("./learner-icon-renderer");



function renderMarkdownRegion(text) {

  return html.renderMarkdownBlock(text) || html.renderPlainText(text);

}



function escapeFieldAttr(value) {

  return html.escapeAttribute(String(value || ""));

}



function renderCompositionTextItem(item) {

  var text = String((item && item.text) || "").trim();

  if (!text) return "";

  var role = String((item && item.role) || "").trim();

  var sourceField =

    (item && item.sourceRef && item.sourceRef.sourceField) ||

    role ||

    "compositionText";

  var className = "util-composition-framing util-composition-framing--" + role.replace(/_/g, "-");

  var body = renderMarkdownRegion(text);



  if (role === "studyPhase") {

    return (

      '<p class="' +

      className +

      ' util-composition-study-phase" data-source-field="' +

      escapeFieldAttr(sourceField) +

      '">' +

      html.escapeHtml(text) +

      "</p>"

    );

  }



  if (role === "activityPurpose") {

    return (

      '<p class="' +

      className +

      ' util-composition-activity-purpose" data-source-field="' +

      escapeFieldAttr(sourceField) +

      '">' +

      html.renderMarkdownInline(text) +

      "</p>"

    );

  }



  if (role === "activity_preamble") {

    return (

      '<div class="' +

      className +

      ' util-composition-preamble" data-source-field="' +

      escapeFieldAttr(sourceField) +

      '">' +

      body +

      "</div>"

    );

  }



  if (role === "reasoning_orientation") {

    return (

      '<p class="' +

      className +

      ' util-composition-reasoning-orientation" data-source-field="' +

      escapeFieldAttr(sourceField) +

      '">' +

      html.renderMarkdownInline(text) +

      "</p>"

    );

  }



  return (

    '<div class="' +

    className +

    '" data-source-field="' +

    escapeFieldAttr(sourceField) +

    '">' +

    body +

    "</div>"

  );

}



function renderPromptItem(item) {

  var prompt = item && item.prompt;

  var text = String((prompt && prompt.text) || "").trim();

  if (!text) return "";

  var sourceField = String((prompt && prompt.sourceField) || "self_explanation_prompt");

  return (

    '<p class="util-composition-framing util-composition-self-explanation" data-source-field="' +

    escapeFieldAttr(sourceField) +

    '">' +

    html.renderMarkdownInline(text) +

    "</p>"

  );

}



function renderDoInstructionItem(item) {

  var instruction = item && item.instruction;

  if (!instruction) return "";

  return learnerIcons.renderInstructionBlock(instruction);

}



function renderDoExpectedOutputItem(item) {
  var expectedOutput = item && item.expectedOutput;
  if (!expectedOutput) return "";
  var body =
    html.renderMarkdownBlock(expectedOutput.text) ||
    html.renderPlainText(expectedOutput.text);
  return (
    '<div class="util-composition-expected-output util-prose-measure" data-source-field="expected_output">' +
    '<h4 class="util-composition-subheading">What to produce</h4>' +
    body +
    "</div>"
  );
}

function renderLearnInstructionItem(item) {
  var instruction = item && item.instruction;
  if (!instruction) return "";
  var role = String((item && item.role) || "explanation").trim();
  return (
    '<div class="util-composition-learn-item util-composition-learn-item--' +
    html.escapeAttribute(role.replace(/_/g, "-")) +
    '" data-composition-role="' +
    html.escapeAttribute(role) +
    '">' +
    learnerIcons.renderInstructionBlock(instruction) +
    "</div>"
  );
}

function renderLearnMaterialItem(item) {
  if (!item || !item.material) return "";
  var role = String((item && item.role) || "explanation").trim();
  return (
    '<div class="util-composition-learn-item util-composition-learn-item--' +
    html.escapeAttribute(role.replace(/_/g, "-")) +
    '" data-composition-role="' +
    html.escapeAttribute(role) +
    '">' +
    renderMaterial(item.material) +
    "</div>"
  );
}

function renderCheckInstructionItem(item) {
  var instruction = item && item.instruction;
  if (!instruction) return "";
  return learnerIcons.renderInstructionBlock(instruction);
}

function renderCheckMaterialItem(item) {
  if (!item || !item.material) return "";
  var materialHtml = renderMaterial(item.material);
  var reveal = item.reveal;
  if (!reveal || reveal.mode !== "details") return materialHtml;

  var openAttr = reveal.defaultOpen ? " open" : "";
  return (
    '<details class="util-composition-reveal util-prose-measure"' +
    openAttr +
    ' data-reveal-mode="details">' +
    "<summary>" +
    html.escapeHtml(String(reveal.summary || "Show reference material")) +
    "</summary>" +
    '<div class="util-composition-reveal__body">' +
    materialHtml +
    "</div></details>"
  );
}



function renderCoveredMaterialShell(material) {
  if (!material) return "";
  var title = String(material.title || "").trim();
  var heading = title
    ? '<h4 class="util-material-heading util-composition-subheading">' +
      html.escapeHtml(title) +
      "</h4>"
    : "";
  return (
    '<article class="util-material-block util-material-block--response-composed util-prose-measure" data-material-id="' +
    html.escapeAttribute(String(material.id || "")) +
    '" data-material-type="' +
    html.escapeAttribute(String(material.type || "")) +
    '" data-response-composed="true">' +
    heading +
    "</article>"
  );
}

function resolveWorkspaceList(moment) {
  if (!moment) return [];
  if (Array.isArray(moment.workspaces) && moment.workspaces.length) {
    return moment.workspaces;
  }
  if (moment.workspace) return [moment.workspace];
  return [];
}

function workspaceCoversPromptField(workspaceList, sourceField) {
  var field = String(sourceField || "").trim();
  if (!field) return false;
  return (Array.isArray(workspaceList) ? workspaceList : []).some(function (workspace) {
    if (!workspace) return false;
    if (field === "transfer_or_application_task") {
      return (
        workspace.sourceKind === "transfer_prompt" ||
        workspace.sourceId === "transfer_or_application_task" ||
        (workspace.sourceKind === "task_step" && /transfer/i.test(String(workspace.responseLabel || "")))
      );
    }
    if (/reflect/i.test(field)) {
      return (
        workspace.sourceKind === "reflection_prompt" ||
        (workspace.sourceKind === "task_step" && /reflect/i.test(String(workspace.responseLabel || "")))
      );
    }
    return workspace.sourceId === field;
  });
}

function workspaceCoversMaterial(workspaceList, material) {
  if (!material) return false;
  var materialId = String(material.id || "");
  var materialType = String(material.type || "");
  return (Array.isArray(workspaceList) ? workspaceList : []).some(function (workspace) {
    if (!workspace || !materialId) return false;
    var sourceId = String(workspace.sourceId || "");
    if (materialType === "transfer_prompt" && workspace.sourceKind === "transfer_prompt") {
      return sourceId === materialId || sourceId === "transfer_or_application_task";
    }
    if (materialType === "template" && workspace.sourceKind === "template_section") {
      return sourceId.indexOf(materialId) === 0;
    }
    if (materialType === "prompt_set" && workspace.sourceKind === "prompt_item") {
      return sourceId.indexOf(materialId) === 0;
    }
    return false;
  });
}

function workspaceSourceFieldAttr(workspace) {
  if (!workspace) return "";
  if (workspace.sourceKind === "transfer_prompt" || workspace.sourceId === "transfer_or_application_task") {
    return ' data-source-field="transfer_or_application_task"';
  }
  if (workspace.sourceKind === "reflection_prompt") {
    return ' data-source-field="reflection_prompt"';
  }
  return "";
}

function renderLearnerWorkspace(workspace, activityId, options) {
  if (!workspace) return "";

  var opts = options && typeof options === "object" ? options : {};
  var capability = String(workspace.capability || "text_entry");

  if (capability === "ordering") {
    return renderOrderingWorkspace(workspace);
  }

  if (capability !== "text_entry") {
    return (
      '<div class="util-learner-workspace util-learner-workspace--unsupported" data-workspace-capability="' +
      html.escapeAttribute(capability) +
      '"><p class="util-support-note">Unsupported learner workspace capability: ' +
      html.escapeHtml(capability) +
      "</p></div>"
    );
  }

  var stepNumber = Number(workspace.sourceStepNumber);
  var partSlug = String(workspace.responsePartId || "step-" + stepNumber)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  var fieldId =
    "learner-workspace-" +
    String(activityId || "activity")
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() +
    "-" +
    partSlug;

  var guidance = String(workspace.guidance || "").trim();
  var responseLabel = String(workspace.responseLabel || "Record your response").trim();
  var promptText = String(workspace.prompt || workspace.instruction || "").trim();
  var showPrompt =
    promptText &&
    promptText !== responseLabel &&
    !new RegExp("^" + responseLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i").test(promptText);

  var guidanceHtml =
    guidance && !opts.omitGuidance
      ? '<p class="util-learner-workspace__note">' + html.escapeHtml(guidance) + "</p>"
      : "";
  var promptHtml = showPrompt
    ? '<p class="util-learner-workspace__prompt" id="' +
      html.escapeAttribute(fieldId + "-desc") +
      '">' +
      html.renderMarkdownInline(promptText) +
      "</p>"
    : "";

  var rows = Number(workspace.rows) > 0 ? Number(workspace.rows) : 6;
  var describedBy = showPrompt ? fieldId + "-desc" : null;

  return (
    '<div class="util-learner-workspace util-prose-measure" data-workspace-step="' +
    html.escapeAttribute(stepNumber) +
    '" data-workspace-capability="' +
    html.escapeAttribute(capability) +
    '" data-workspace-kind="text_entry" data-workspace-id="' +
    html.escapeAttribute(fieldId) +
    '" data-response-part-id="' +
    html.escapeAttribute(String(workspace.responsePartId || "")) +
    '"' +
    workspaceSourceFieldAttr(workspace) +
    ">" +
    '<label class="util-composition-subheading util-learner-workspace__label" for="' +
    html.escapeAttribute(fieldId) +
    '">' +
    html.escapeHtml(responseLabel) +
    "</label>" +
    promptHtml +
    '<textarea class="util-learner-workspace__input" id="' +
    html.escapeAttribute(fieldId) +
    '" name="' +
    html.escapeAttribute(fieldId) +
    '" rows="' +
    html.escapeAttribute(rows) +
    '"' +
    (describedBy ? ' aria-describedby="' + html.escapeAttribute(describedBy) + '"' : "") +
    "></textarea>" +
    guidanceHtml +
    "</div>"
  );
}

function renderWorkspaceGroup(workspaces, activityId, options) {
  var list = Array.isArray(workspaces) ? workspaces : [];
  if (!list.length) return "";
  if (list.length === 1) return renderLearnerWorkspace(list[0], activityId, options);

  var inner = list
    .map(function (workspace) {
      return renderLearnerWorkspace(workspace, activityId, Object.assign({}, options || {}, { omitGuidance: true }));
    })
    .join("");

  var guidance = String((list[0] && list[0].guidance) || "").trim();
  var guidanceHtml = guidance
    ? '<p class="util-learner-response-group__note">' + html.escapeHtml(guidance) + "</p>"
    : "";

  return (
    '<div class="util-learner-response-group util-prose-measure">' +
    guidanceHtml +
    inner +
    "</div>"
  );
}



/**

 * Render one composed Orient moment as a single learner-facing section.

 *

 * @param {import("./types").CompositionMoment} moment

 * @param {string} activityId

 * @returns {string}

 */

function renderOrientMoment(moment, activityId) {

  if (!moment || moment.kind !== "orient") return "";

  var items = Array.isArray(moment.items) ? moment.items : [];

  if (!items.length) return "";



  var body = items

    .map(function (item) {

      if (!item || !item.kind) return "";

      if (item.kind === "compositionText") return renderCompositionTextItem(item);

      if (item.kind === "prompt") return renderPromptItem(item);

      if (item.kind === "instruction") return renderLearnInstructionItem(item);

      if (item.kind === "material") {
        if (item.tableWorkspace) {
          return renderTableWorkspace(item.material, activityId, { omitGuidance: true });
        }
        return renderLearnMaterialItem(item);
      }

      return "";

    })

    .filter(Boolean)

    .join("");



  if (!String(body || "").trim()) return "";



  return (

    '<section class="util-composition-moment util-composition-moment--orient util-prose-measure" data-composition-moment="orient" data-activity-id="' +

    html.escapeAttribute(activityId) +

    '">' +

    '<div class="util-composition-moment__body">' +

    body +

    "</div></section>"

  );

}



/**

 * Render one composed Do moment as a single learner-facing section.

 *

 * @param {import("./types").CompositionMoment} moment

 * @param {string} activityId

 * @returns {string}

 */

function renderDoMoment(moment, activityId) {

  if (!moment || moment.kind !== "do") return "";

  var items = Array.isArray(moment.items) ? moment.items : [];

  if (!items.length) return "";

  var workspaceList = resolveWorkspaceList(moment);
  var hasTextWorkspace = workspaceList.length > 0;

  var body = items

    .map(function (item) {

      if (!item || !item.kind) return "";

      if (item.kind === "prompt") {
        if (workspaceCoversPromptField(workspaceList, item.prompt && item.prompt.sourceField)) {
          return "";
        }
        return renderPromptItem(item);
      }

      if (item.kind === "instruction") return renderDoInstructionItem(item);

      if (item.kind === "material" && item.material) {
        if (workspaceCoversMaterial(workspaceList, item.material)) {
          if (item.tableWorkspace) {
            return renderTableWorkspace(item.material, activityId, {
              omitGuidance: hasTextWorkspace
            });
          }
          return renderCoveredMaterialShell(item.material);
        }
        if (item.tableWorkspace) {
          return renderTableWorkspace(item.material, activityId, {
            omitGuidance: hasTextWorkspace
          });
        }
        return renderMaterial(item.material);
      }

      if (item.kind === "expectedOutput") return renderDoExpectedOutputItem(item);

      return "";

    })

    .filter(Boolean)

    .join("");

  var workspacesHtml = renderWorkspaceGroup(workspaceList, activityId, { omitGuidance: false });

  var workspace = workspacesHtml;

  if (!String(body || "").trim() && !workspace) return "";



  return (

    '<section class="util-composition-moment util-composition-moment--do util-prose-measure" data-composition-moment="do" data-activity-id="' +

    html.escapeAttribute(activityId) +

    '">' +

    '<h3 class="util-composition-moment-heading">Your task</h3>' +

    '<div class="util-composition-moment__body">' +

    body +

    workspace +

    "</div></section>"
  );
}

/**
 * Render one composed Check moment as a single learner-facing section.
 *
 * @param {import("./types").CompositionMoment} moment
 * @param {string} activityId
 * @returns {string}
 */
function renderCheckMoment(moment, activityId) {
  if (!moment || moment.kind !== "check") return "";
  var items = Array.isArray(moment.items) ? moment.items : [];
  if (!items.length) return "";

  var workspaceList = resolveWorkspaceList(moment);

  var body = items
    .map(function (item) {
      if (!item || !item.kind) return "";
      if (item.kind === "instruction") return renderCheckInstructionItem(item);
      if (item.kind === "material") {
        if (workspaceCoversMaterial(workspaceList, item.material)) {
          return renderCoveredMaterialShell(item.material);
        }
        return renderCheckMaterialItem(item);
      }
      if (item.kind === "prompt") {
        if (workspaceCoversPromptField(workspaceList, item.prompt && item.prompt.sourceField)) {
          return "";
        }
        return renderPromptItem(item);
      }
      return "";
    })
    .filter(Boolean)
    .join("");

  if (!String(body || "").trim() && !workspaceList.length) return "";

  var guidance = String(moment.learnerGuidance || "").trim();
  var guidanceHtml = guidance
    ? '<p class="util-composition-check-guidance">' + html.escapeHtml(guidance) + "</p>"
    : "";

  var workspacesHtml = renderWorkspaceGroup(workspaceList, activityId, { omitGuidance: false });

  return (
    '<section class="util-composition-moment util-composition-moment--check util-prose-measure" data-composition-moment="check" data-activity-id="' +
    html.escapeAttribute(activityId) +
    '">' +
    '<h3 class="util-composition-moment-heading">Check your response</h3>' +
    '<div class="util-composition-moment__body">' +
    guidanceHtml +
    body +
    workspacesHtml +
    "</div></section>"
  );
}

/**
 * Render one composed Learn moment as a single learner-facing section.
 *
 * @param {import("./types").CompositionMoment} moment
 * @param {string} activityId
 * @returns {string}
 */
function renderLearnMoment(moment, activityId) {
  if (!moment || moment.kind !== "learn") return "";
  var items = Array.isArray(moment.items) ? moment.items : [];
  if (!items.length) return "";

  var body = items
    .map(function (item) {
      if (!item || !item.kind) return "";
      if (item.kind === "instruction") return renderLearnInstructionItem(item);
      if (item.kind === "material") return renderLearnMaterialItem(item);
      return "";
    })
    .filter(Boolean)
    .join("");

  if (!String(body || "").trim()) return "";

  return (
    '<section class="util-composition-moment util-composition-moment--learn util-prose-measure" data-composition-moment="learn" data-activity-id="' +
    html.escapeAttribute(activityId) +
    '">' +
    '<h3 class="util-composition-moment-heading">Explore the idea</h3>' +
    '<div class="util-composition-moment__body">' +
    body +
    "</div></section>"
  );
}

module.exports = {
  renderOrientMoment: renderOrientMoment,
  renderLearnMoment: renderLearnMoment,
  renderDoMoment: renderDoMoment,
  renderCheckMoment: renderCheckMoment,
  renderLearnerWorkspace: renderLearnerWorkspace,
  resolveWorkspaceList: resolveWorkspaceList
};


