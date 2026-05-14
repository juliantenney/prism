(function () {
  "use strict";

  var MANIFEST_PATH = "domains/domain-manifest.json";
  var DOMAIN_CACHE_KEY = "promptr.workflowFactory.domains.v1";

  var fallbackManifest = {
    platformFiles: [
      "docs/workflow/workflow-spec.md",
      "docs/workflow/workflow-authoring.md",
      "docs/workflow/workflow-generation-template.md",
      "docs/workflow/pattern-library.md"
    ],
    alwaysOnDomains: ["general"],
    domains: {
      general: {
        label: "General",
        files: [
          "domains/general/domain-general-principles.md",
          "domains/general/domain-general-artefacts.md",
          "domains/general/domain-general-step-patterns.md",
          "domains/general/domain-general-prompt-rules.md"
        ]
      },
      "learning-design": {
        label: "Learning Design",
        files: [
          "domains/learning-design/domain-learning-design-principles.md",
          "domains/learning-design/domain-learning-design-artefacts.md",
          "domains/learning-design/domain-learning-design-step-patterns.md",
          "domains/learning-design/domain-learning-design-prompt-rules.md"
        ]
      },
      research: {
        label: "Research",
        files: [
          "domains/research/domain-research-principles.md",
          "domains/research/domain-research-artefacts.md",
          "domains/research/domain-research-step-patterns.md",
          "domains/research/domain-research-prompt-rules.md"
        ]
      }
    }
  };

  var manifestPromise = null;
  var textCache = {};

  function clone(obj) {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (e) {
      return obj;
    }
  }

  function normalizeManifest(raw) {
    if (!raw || typeof raw !== "object") return clone(fallbackManifest);
    var manifest = {
      platformFiles: Array.isArray(raw.platformFiles) ? raw.platformFiles.slice() : [],
      alwaysOnDomains: Array.isArray(raw.alwaysOnDomains) ? raw.alwaysOnDomains.slice() : [],
      domains: raw.domains && typeof raw.domains === "object" ? clone(raw.domains) : {}
    };
    if (!manifest.platformFiles.length) {
      manifest.platformFiles = fallbackManifest.platformFiles.slice();
    }
    if (!manifest.alwaysOnDomains.length) {
      manifest.alwaysOnDomains = fallbackManifest.alwaysOnDomains.slice();
    }
    Object.keys(fallbackManifest.domains).forEach(function (k) {
      if (!manifest.domains[k]) {
        manifest.domains[k] = clone(fallbackManifest.domains[k]);
      }
    });
    return manifest;
  }

  function loadManifest() {
    if (manifestPromise) return manifestPromise;
    manifestPromise = fetch(MANIFEST_PATH, { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("Manifest fetch failed");
        return res.json();
      })
      .then(function (data) {
        return normalizeManifest(data);
      })
      .catch(function () {
        return clone(fallbackManifest);
      });
    return manifestPromise;
  }

  function getDomainOptions() {
    return loadManifest().then(function (manifest) {
      return Object.keys(manifest.domains).map(function (key) {
        var d = manifest.domains[key] || {};
        return {
          id: key,
          label: d.label || key,
          alwaysOn: manifest.alwaysOnDomains.indexOf(key) !== -1
        };
      });
    });
  }

  function normalizeSelectedDomains(selectedDomains, manifest) {
    var selected = {};
    (Array.isArray(selectedDomains) ? selectedDomains : []).forEach(function (id) {
      if (id && manifest.domains[id]) selected[id] = true;
    });
    (manifest.alwaysOnDomains || []).forEach(function (id) {
      if (manifest.domains[id]) selected[id] = true;
    });
    return Object.keys(selected);
  }

  function readTextFile(path) {
    if (!path) return Promise.resolve("");
    if (Object.prototype.hasOwnProperty.call(textCache, path)) {
      return Promise.resolve(textCache[path]);
    }
    return fetch(path, { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load " + path);
        return res.text();
      })
      .then(function (text) {
        textCache[path] = String(text || "");
        return textCache[path];
      });
  }

  function loadFiles(paths) {
    var arr = Array.isArray(paths) ? paths.slice() : [];
    var loaded = [];
    var missing = [];
    var chain = Promise.resolve();
    arr.forEach(function (path) {
      chain = chain.then(function () {
        return readTextFile(path)
          .then(function (text) {
            loaded.push({ path: path, text: text });
          })
          .catch(function () {
            missing.push(path);
          });
      });
    });
    return chain.then(function () {
      return { loaded: loaded, missing: missing };
    });
  }

  function section(title, body) {
    return "## " + title + "\n\n" + (body || "").trim();
  }

  function persistSelectedDomains(domains) {
    try {
      localStorage.setItem(DOMAIN_CACHE_KEY, JSON.stringify(domains || []));
    } catch (e) {}
  }

  function loadPersistedDomains() {
    try {
      var raw = localStorage.getItem(DOMAIN_CACHE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function buildWorkflowGenerationContext(options) {
    var opts = options && typeof options === "object" ? options : {};
    var brief = String(opts.brief || "").trim();
    return loadManifest().then(function (manifest) {
      var selectedDomains = normalizeSelectedDomains(opts.selectedDomains, manifest);
      var platformFiles = manifest.platformFiles || [];
      var domainFiles = [];
      selectedDomains.forEach(function (domainId) {
        var d = manifest.domains[domainId];
        if (d && Array.isArray(d.files)) {
          domainFiles = domainFiles.concat(d.files);
        }
      });
      var allFiles = platformFiles.concat(domainFiles);
      return loadFiles(allFiles).then(function (result) {
        var platformTexts = [];
        var domainTexts = [];
        result.loaded.forEach(function (f) {
          if (platformFiles.indexOf(f.path) !== -1) {
            platformTexts.push("### File: " + f.path + "\n\n" + f.text.trim());
          } else {
            domainTexts.push("### File: " + f.path + "\n\n" + f.text.trim());
          }
        });

        var parts = [];
        parts.push(
          section(
            "PLATFORM CONTEXT",
            platformTexts.join("\n\n---\n\n") ||
              "No platform docs loaded."
          )
        );
        parts.push(
          section(
            "DOMAIN CONTEXT",
            "Selected domains: " + (selectedDomains.join(", ") || "none") + "\n\n" +
              (domainTexts.join("\n\n---\n\n") || "No domain docs loaded.")
          )
        );
        parts.push(section("WORKFLOW BRIEF", brief || "No brief provided."));

        return {
          promptContext: parts.join("\n\n====================\n\n"),
          loadedFiles: result.loaded.map(function (f) { return f.path; }),
          missingFiles: result.missing.slice(),
          selectedDomains: selectedDomains.slice()
        };
      });
    });
  }

  function buildPromptRefinementContext(options) {
    var opts = options && typeof options === "object" ? options : {};
    var promptTask = String(opts.promptTask || "").trim();
    var leanMode = !!opts.leanMode;
    return loadManifest().then(function (manifest) {
      var selectedDomains = normalizeSelectedDomains(opts.selectedDomains, manifest);
      var platformPromptFiles = [];
      if (!leanMode) {
        platformPromptFiles = (manifest.platformFiles || []).filter(function (path) {
          return /workflow-authoring|workflow-spec|pattern-library/i.test(path);
        });
        if (!platformPromptFiles.length) {
          platformPromptFiles = (manifest.platformFiles || []).slice();
        }
      }
      var domainPromptFiles = [];
      selectedDomains.forEach(function (domainId) {
        var d = manifest.domains[domainId];
        if (!d || !Array.isArray(d.files)) return;
        d.files.forEach(function (path) {
          if (leanMode) {
            if (/prompt-rules|artefacts/i.test(path)) {
              domainPromptFiles.push(path);
            }
          } else if (/prompt-rules|artefacts|step-patterns/i.test(path)) {
            domainPromptFiles.push(path);
          }
        });
      });
      var allFiles = platformPromptFiles.concat(domainPromptFiles);
      return loadFiles(allFiles).then(function (result) {
        var platformTexts = [];
        var domainTexts = [];
        result.loaded.forEach(function (f) {
          if (platformPromptFiles.indexOf(f.path) !== -1) {
            platformTexts.push("### File: " + f.path + "\n\n" + f.text.trim());
          } else {
            domainTexts.push("### File: " + f.path + "\n\n" + f.text.trim());
          }
        });
        var parts = [];
        if (!leanMode) {
          parts.push(
            section(
              "PLATFORM CONTEXT FOR PROMPT REFINEMENT",
              platformTexts.join("\n\n---\n\n") || "No platform docs loaded."
            )
          );
        }
        parts.push(
          section(
            "DOMAIN CONTEXT FOR PROMPT REFINEMENT",
            "Selected domains: " + (selectedDomains.join(", ") || "none") + "\n\n" +
              (domainTexts.join("\n\n---\n\n") || "No domain docs loaded.")
          )
        );
        if (promptTask) {
          parts.push(section("PROMPT TASK CONTEXT", promptTask));
        }

        return {
          promptContext: parts.join("\n\n====================\n\n"),
          loadedFiles: result.loaded.map(function (f) { return f.path; }),
          missingFiles: result.missing.slice(),
          selectedDomains: selectedDomains.slice()
        };
      });
    });
  }

  function extractStepPatternCatalogFromText(text) {
    var lines = String(text || "").split(/\r?\n/);
    var out = [];
    var seen = {};
    var ignore = {
      purpose: true,
      type: true,
      input: true,
      output: true,
      outputs: true,
      description: true,
      requirements: true,
      usage: true,
      summary: true,
      "design principles": true,
      "core patterns": true,
      "core step patterns": true
    };

    function normalizeTitle(raw) {
      var t = String(raw || "").trim();
      return t;
    }

    function slugify(raw) {
      return String(raw || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
    }

    function pushPattern(raw, order) {
      var t = normalizeTitle(raw);
      if (!t) return;
      var lower = t.toLowerCase();
      if (ignore[lower]) return;
      if (seen[lower]) return;
      seen[lower] = true;
      out.push({
        title: t,
        aliases: [],
        order: typeof order === "number" ? order : out.length + 1,
        canonicalStepId: "",
        canonicalPromptId: "",
        canonicalPromptVersion: ""
      });
    }

    var current = null;
    var inAliases = false;
    var currentField = "";
    var inPromptFactoryJson = false;
    var promptFactoryJsonLines = [];

    function splitListLike(value) {
      return String(value || "")
        .split(/\s*(?:,|\bor\b)\s*/i)
        .map(function (s) { return s.trim(); })
        .filter(function (s) { return !!s; });
    }

    function parseAliasLine(line) {
      if (!current) return;
      var m = line.match(/^\s*-\s*(.+?)\s*$/);
      if (!m || !m[1]) return;
      var alias = String(m[1]).trim();
      if (!alias) return;
      var lower = alias.toLowerCase();
      if (lower === current.title.toLowerCase()) return;
      var already = current.aliases.some(function (a) {
        return String(a || "").toLowerCase() === lower;
      });
      if (!already) current.aliases.push(alias);
    }

    function parseSemanticLine(line) {
      if (!current || !currentField) return;
      var value = String(line || "").trim();
      if (!value) return;
      if (value === "---") return;
      if (/^#+\s+/.test(value)) return;
      if (/^\s*[-*]\s+/.test(value)) return;

      if (currentField === "type") {
        current.type = value;
      } else if (currentField === "input") {
        current.input = value;
        current.typicalInputs = splitListLike(value);
      } else if (currentField === "output") {
        current.output = value;
        current.outputs = splitListLike(value);
      }
    }

    function parsePromptFactoryJsonBlock() {
      if (!current) return;
      var raw = promptFactoryJsonLines.join("\n").trim();
      promptFactoryJsonLines = [];
      if (!raw) return;
      try {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          current.promptFactory = parsed;
          var explicitStepId = String(
            parsed.canonical_step_id || parsed.canonicalStepId || ""
          ).trim();
          if (explicitStepId) {
            current.canonicalStepId = explicitStepId;
          }
          var explicitPromptId = String(
            parsed.canonical_prompt_id || parsed.canonicalPromptId || ""
          ).trim();
          if (explicitPromptId) {
            current.canonicalPromptId = explicitPromptId;
          }
          var explicitPromptVersion = String(
            parsed.canonical_prompt_version || parsed.canonicalPromptVersion || ""
          ).trim();
          if (explicitPromptVersion) {
            current.canonicalPromptVersion = explicitPromptVersion;
          }
        }
      } catch (_e) {
        // Ignore invalid metadata blocks and keep parsing remaining content.
      }
    }

    lines.forEach(function (line) {
      if (inPromptFactoryJson) {
        if (/^\s*```/.test(line)) {
          inPromptFactoryJson = false;
          parsePromptFactoryJsonBlock();
          return;
        }
        promptFactoryJsonLines.push(line);
        return;
      }

      var mNumbered = line.match(/^##\s+\d+\.\s+(.+?)\s*$/);
      if (mNumbered && mNumbered[1]) {
        pushPattern(mNumbered[1], out.length + 1);
        current = out[out.length - 1];
        inAliases = false;
        currentField = "";
        return;
      }
      var mH3 = line.match(/^###\s+(.+?)\s*$/);
      if (mH3 && mH3[1]) {
        var heading = String(mH3[1]).trim().toLowerCase();
        inAliases = heading === "aliases";
        currentField = inAliases ? "" : heading;
        return;
      }
      if (
        current &&
        currentField === "prompt factory" &&
        /^\s*```(?:json)?\s*$/i.test(String(line || ""))
      ) {
        inPromptFactoryJson = true;
        promptFactoryJsonLines = [];
        return;
      }
      if (inAliases && /^\s*[-*]\s+/.test(line)) {
        parseAliasLine(line);
        return;
      }
      parseSemanticLine(line);
    });

    if (inPromptFactoryJson) {
      parsePromptFactoryJsonBlock();
    }

    out.forEach(function (pattern) {
      if (!pattern) return;
      if (!pattern.canonicalStepId) {
        pattern.canonicalStepId = "step_" + slugify(pattern.title || "");
      }
      if (!pattern.canonicalPromptId) {
        pattern.canonicalPromptId = "prompt_" + slugify(pattern.title || "");
      }
      if (!pattern.canonicalPromptVersion) {
        pattern.canonicalPromptVersion = "1";
      }
    });
    return out;
  }

  function extractWorkflowPolicyFromText(text) {
    var lines = String(text || "").split(/\r?\n/);
    var inPolicySection = false;
    var inJson = false;
    var jsonLines = [];
    var found = null;

    function tryParsePolicy() {
      if (found) return;
      var raw = jsonLines.join("\n").trim();
      jsonLines = [];
      if (!raw) return;
      try {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          if (parsed.workflowPolicy && typeof parsed.workflowPolicy === "object") {
            found = parsed.workflowPolicy;
          } else {
            found = parsed;
          }
        }
      } catch (_e) {}
    }

    lines.forEach(function (line) {
      var h3 = line.match(/^###\s+(.+?)\s*$/);
      if (h3 && h3[1]) {
        var heading = String(h3[1]).trim().toLowerCase();
        inPolicySection = heading === "workflow policy";
        if (!inPolicySection && inJson) {
          inJson = false;
          tryParsePolicy();
        }
        return;
      }
      if (!inPolicySection) return;
      if (!inJson && /^\s*```(?:json)?\s*$/i.test(String(line || ""))) {
        inJson = true;
        jsonLines = [];
        return;
      }
      if (inJson && /^\s*```\s*$/.test(String(line || ""))) {
        inJson = false;
        tryParsePolicy();
        return;
      }
      if (inJson) {
        jsonLines.push(line);
      }
    });
    if (inJson) {
      tryParsePolicy();
    }
    return found;
  }

  function extractWorkflowBriefConfigFromText(text) {
    var lines = String(text || "").split(/\r?\n/);
    var inSection = false;
    var inJson = false;
    var jsonLines = [];
    var found = null;

    function tryParse() {
      if (found) return;
      var raw = jsonLines.join("\n").trim();
      jsonLines = [];
      if (!raw) return;
      try {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          if (parsed.workflowBriefConfig && typeof parsed.workflowBriefConfig === "object") {
            found = parsed.workflowBriefConfig;
          } else {
            found = parsed;
          }
        }
      } catch (_e) {}
    }

    lines.forEach(function (line) {
      var h3 = line.match(/^###\s+(.+?)\s*$/);
      if (h3 && h3[1]) {
        var heading = String(h3[1]).trim().toLowerCase();
        inSection = heading === "workflow brief config";
        if (!inSection && inJson) {
          inJson = false;
          tryParse();
        }
        return;
      }
      if (!inSection) return;
      if (!inJson && /^\s*```(?:json)?\s*$/i.test(String(line || ""))) {
        inJson = true;
        jsonLines = [];
        return;
      }
      if (inJson && /^\s*```\s*$/.test(String(line || ""))) {
        inJson = false;
        tryParse();
        return;
      }
      if (inJson) jsonLines.push(line);
    });
    if (inJson) tryParse();
    return found;
  }

  function extractArtefactCatalogFromText(text) {
    var lines = String(text || "").split(/\r?\n/);
    var out = [];
    var seen = {};
    lines.forEach(function (line) {
      var id = "";
      var mNumbered = line.match(/^##\s+\d+\.\s+([a-zA-Z0-9_:-]+)\s*$/);
      if (mNumbered && mNumbered[1]) {
        id = String(mNumbered[1] || "").trim();
      } else {
        var mHeading = line.match(/^###\s+([a-zA-Z0-9_:-]+)\s*$/);
        if (!mHeading || !mHeading[1]) return;
        id = String(mHeading[1] || "").trim();
      }
      if (!id) return;
      var key = id.toLowerCase();
      if (seen[key]) return;
      seen[key] = true;
      out.push({ id: id, label: id.replace(/_/g, " ") });
    });
    return out;
  }

  function extractArtefactRenderCatalogFromText(text) {
    var lines = String(text || "").split(/\r?\n/);
    var out = [];
    var byKey = {};
    var currentArtefactId = "";
    var inRenderHintsSection = false;
    var inJson = false;
    var jsonLines = [];

    function ensureEntry(id) {
      var artefactId = String(id || "").trim();
      if (!artefactId) return null;
      var key = artefactId.toLowerCase();
      if (!byKey[key]) {
        byKey[key] = {
          id: artefactId,
          renderHints: null
        };
        out.push(byKey[key]);
      }
      return byKey[key];
    }

    function applyRenderHintsJson(raw) {
      if (!currentArtefactId) return;
      var body = String(raw || "").trim();
      if (!body) return;
      try {
        var parsed = JSON.parse(body);
        var hints =
          parsed &&
          typeof parsed === "object" &&
          parsed.renderHints &&
          typeof parsed.renderHints === "object"
            ? parsed.renderHints
            : parsed && typeof parsed === "object"
            ? parsed
            : null;
        if (!hints) return;
        var entry = ensureEntry(currentArtefactId);
        if (!entry) return;
        entry.renderHints = {
          renderable: hints.renderable === true,
          supportedFormats: Array.isArray(hints.supportedFormats)
            ? hints.supportedFormats.map(function (f) {
                return String(f || "").trim().toLowerCase();
              }).filter(function (f) { return !!f; })
            : [],
          rendererType: String(hints.rendererType || "").trim().toLowerCase(),
          rendererVariant: String(hints.rendererVariant || "").trim().toLowerCase(),
          renderConfig:
            hints.renderConfig && typeof hints.renderConfig === "object"
              ? hints.renderConfig
              : null
        };
      } catch (_e) {}
    }

    lines.forEach(function (line) {
      var mNumbered = line.match(/^##\s+\d+\.\s+([a-zA-Z0-9_:-]+)\s*$/);
      if (mNumbered && mNumbered[1]) {
        currentArtefactId = String(mNumbered[1]).trim();
        ensureEntry(currentArtefactId);
        inRenderHintsSection = false;
        inJson = false;
        jsonLines = [];
        return;
      }
      var h3 = line.match(/^###\s+(.+?)\s*$/);
      if (h3 && h3[1]) {
        var heading = String(h3[1]).trim().toLowerCase();
        inRenderHintsSection = heading === "render hints";
        inJson = false;
        jsonLines = [];
        return;
      }
      if (!inRenderHintsSection) return;
      if (!inJson && /^\s*```(?:json)?\s*$/i.test(String(line || ""))) {
        inJson = true;
        jsonLines = [];
        return;
      }
      if (inJson && /^\s*```\s*$/.test(String(line || ""))) {
        inJson = false;
        applyRenderHintsJson(jsonLines.join("\n"));
        jsonLines = [];
        return;
      }
      if (inJson) jsonLines.push(line);
    });

    if (inJson && jsonLines.length) {
      applyRenderHintsJson(jsonLines.join("\n"));
    }
    return out;
  }

  function getDomainArtefactOptions(options) {
    var opts = options && typeof options === "object" ? options : {};
    return loadManifest().then(function (manifest) {
      var selectedDomains = normalizeSelectedDomains(opts.selectedDomains, manifest);
      var files = [];
      selectedDomains.forEach(function (domainId) {
        var d = manifest.domains[domainId];
        if (!d || !Array.isArray(d.files)) return;
        d.files.forEach(function (path) {
          if (/artefacts/i.test(path)) files.push(path);
        });
      });
      return loadFiles(files).then(function (result) {
        var all = [];
        var seen = {};
        result.loaded.forEach(function (f) {
          var domainId = "";
          var path = String((f && f.path) || "");
          var domainMatch = path.match(/domains\/([^/]+)\//i);
          if (domainMatch && domainMatch[1]) {
            domainId = String(domainMatch[1]);
          }
          extractArtefactCatalogFromText(f.text).forEach(function (item) {
            var key = String((item && item.id) || "").toLowerCase();
            if (!key || seen[key]) return;
            seen[key] = true;
            all.push({
              id: item.id,
              label: item.label,
              domainId: domainId
            });
          });
        });
        return all;
      });
    });
  }

  function getArtefactRenderCatalog(options) {
    var opts = options && typeof options === "object" ? options : {};
    return loadManifest().then(function (manifest) {
      var selectedDomains = Array.isArray(opts.selectedDomains)
        ? normalizeSelectedDomains(opts.selectedDomains, manifest)
        : Object.keys(manifest.domains || {});
      var files = [];
      selectedDomains.forEach(function (domainId) {
        var d = manifest.domains[domainId];
        if (!d || !Array.isArray(d.files)) return;
        d.files.forEach(function (path) {
          if (/artefacts/i.test(path)) files.push(path);
        });
      });
      return loadFiles(files).then(function (result) {
        var byKey = {};
        result.loaded.forEach(function (f) {
          var path = String((f && f.path) || "");
          var domainMatch = path.match(/domains\/([^/]+)\//i);
          var domainId = domainMatch && domainMatch[1] ? String(domainMatch[1]) : "";
          extractArtefactRenderCatalogFromText(f.text).forEach(function (item) {
            var key = String((item && item.id) || "").toLowerCase();
            if (!key) return;
            if (!byKey[key]) {
              byKey[key] = {
                id: item.id,
                domainId: domainId,
                renderHints: item.renderHints || null
              };
              return;
            }
            if (!byKey[key].renderHints && item.renderHints) {
              byKey[key].renderHints = item.renderHints;
            }
          });
        });
        return Object.keys(byKey).map(function (k) { return byKey[k]; });
      });
    });
  }

  function getStepPatternCatalog(options) {
    var opts = options && typeof options === "object" ? options : {};
    return loadManifest().then(function (manifest) {
      var selectedDomains = normalizeSelectedDomains(opts.selectedDomains, manifest);
      var files = [];
      selectedDomains.forEach(function (domainId) {
        var d = manifest.domains[domainId];
        if (!d || !Array.isArray(d.files)) return;
        d.files.forEach(function (path) {
          if (/step-patterns/i.test(path)) files.push(path);
        });
      });
      return loadFiles(files).then(function (result) {
        var all = [];
        var seen = {};
        (result.loaded || []).forEach(function (f) {
          extractStepPatternCatalogFromText(f.text).forEach(function (pattern) {
            var k = String(
              (pattern && (pattern.canonicalStepId || pattern.title)) || ""
            ).toLowerCase();
            if (!k || seen[k]) return;
            seen[k] = true;
            if (pattern && typeof pattern === "object") {
              var p = f.path || "";
              var domainMatch = p.match(/domains\/([^/]+)\//i);
              pattern.domainId = domainMatch && domainMatch[1] ? String(domainMatch[1]) : "";
              pattern.domainVersion = "1";
            }
            all.push(pattern);
          });
        });
        return all;
      });
    });
  }

  function getWorkflowPolicy(options) {
    var opts = options && typeof options === "object" ? options : {};
    return loadManifest().then(function (manifest) {
      var selectedDomains = normalizeSelectedDomains(opts.selectedDomains, manifest);
      var files = [];
      selectedDomains.forEach(function (domainId) {
        var d = manifest.domains[domainId];
        if (!d || !Array.isArray(d.files)) return;
        d.files.forEach(function (path) {
          if (/step-patterns/i.test(path)) files.push(path);
        });
      });
      return loadFiles(files).then(function (result) {
        for (var i = 0; i < result.loaded.length; i++) {
          var policy = extractWorkflowPolicyFromText(result.loaded[i].text);
          if (policy && typeof policy === "object") return policy;
        }
        return null;
      });
    });
  }

  // Returns the domain pack's workflowBriefConfig JSON as stored (including
  // extraFields / uiHints). Downstream UI must preserve those keys when
  // normalising configs so Factory extras and constraint mapping stay aligned.
  function getWorkflowBriefConfig(options) {
    var opts = options && typeof options === "object" ? options : {};
    return loadManifest().then(function (manifest) {
      var selectedDomains = normalizeSelectedDomains(opts.selectedDomains, manifest);
      // Structured domains: first non-general only, no cross-domain merge.
      // General is baseline-only: no runnable workflow-brief pack on general-only selection.
      var structuredDomainId = selectedDomains.find(function (id) {
        return String(id || "").toLowerCase() !== "general";
      });
      if (!structuredDomainId) {
        return {
          domainId: "general",
          config: null
        };
      }
      var d = manifest.domains[structuredDomainId];
      var stepPatternsPath = "";
      if (d && Array.isArray(d.files)) {
        stepPatternsPath = d.files.find(function (path) {
          return /step-patterns/i.test(String(path || ""));
        }) || "";
      }
      if (!stepPatternsPath) {
        return {
          domainId: structuredDomainId,
          config: null
        };
      }
      return readTextFile(stepPatternsPath)
        .then(function (text) {
          return {
            domainId: structuredDomainId,
            config: extractWorkflowBriefConfigFromText(text) || null
          };
        })
        .catch(function () {
          return {
            domainId: structuredDomainId,
            config: null
          };
        });
    });
  }

  window.WorkflowGenerationContext = {
    loadManifest: loadManifest,
    getDomainOptions: getDomainOptions,
    buildWorkflowGenerationContext: buildWorkflowGenerationContext,
    buildPromptRefinementContext: buildPromptRefinementContext,
    getStepPatternCatalog: getStepPatternCatalog,
    getDomainArtefactOptions: getDomainArtefactOptions,
    getArtefactRenderCatalog: getArtefactRenderCatalog,
    getWorkflowPolicy: getWorkflowPolicy,
    getWorkflowBriefConfig: getWorkflowBriefConfig,
    persistSelectedDomains: persistSelectedDomains,
    loadPersistedDomains: loadPersistedDomains
  };
})();
