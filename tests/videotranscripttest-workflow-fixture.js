"use strict";

/**
 * Load the authoritative VideoTranscriptTest assembled page when present.
 *
 * Resolution order:
 * 1. process.env.VIDEO_TRANSCRIPT_TEST_PAGE_JSON
 * 2. tests/fixtures/workflows/videotranscripttest-assembled-page.json
 */

const fs = require("node:fs");
const path = require("node:path");

const WORKFLOW_ID = "0d1c12c0-ad1c-449f-8ad9-8f90b8f01097";
const WORKFLOW_NAME = "VideoTranscriptTest";
const defaultFixturePath = path.join(
  __dirname,
  "fixtures",
  "workflows",
  "videotranscripttest-assembled-page.json"
);

function resolveVideoTranscriptTestPagePath() {
  var envPath = String(process.env.VIDEO_TRANSCRIPT_TEST_PAGE_JSON || "").trim();
  if (envPath && fs.existsSync(envPath)) return envPath;
  if (fs.existsSync(defaultFixturePath)) return defaultFixturePath;
  return null;
}

function readVideoTranscriptTestPage() {
  var fixturePath = resolveVideoTranscriptTestPagePath();
  if (!fixturePath) return null;
  var page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  var provenance =
    page._workflow_provenance && typeof page._workflow_provenance === "object"
      ? page._workflow_provenance
      : null;
  if (!provenance) {
    throw new Error(
      "VideoTranscriptTest page fixture must include _workflow_provenance with workflow_id"
    );
  }
  if (String(provenance.workflow_id || "") !== WORKFLOW_ID) {
    throw new Error(
      "VideoTranscriptTest page fixture workflow_id mismatch: " +
        String(provenance.workflow_id || "")
    );
  }
  return {
    page: page,
    fixturePath: fixturePath,
    provenance: provenance
  };
}

function hasVideoTranscriptTestPageFixture() {
  try {
    return !!readVideoTranscriptTestPage();
  } catch (_error) {
    return false;
  }
}

module.exports = {
  WORKFLOW_ID: WORKFLOW_ID,
  WORKFLOW_NAME: WORKFLOW_NAME,
  defaultFixturePath: defaultFixturePath,
  resolveVideoTranscriptTestPagePath: resolveVideoTranscriptTestPagePath,
  readVideoTranscriptTestPage: readVideoTranscriptTestPage,
  hasVideoTranscriptTestPageFixture: hasVideoTranscriptTestPageFixture
};
