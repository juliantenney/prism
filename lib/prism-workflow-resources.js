/**
 * Sprint 73 — workflow-scoped Workflow Resources (minimal generated-image slice).
 * Canonical owner boundary: neutral resource records + binary payload storage.
 * Browser: IndexedDB. Node/tests: injectable in-memory backend via setStorageBackend.
 */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.PRISM_WORKFLOW_RESOURCES = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  var DB_NAME = "prismWorkflowResourcesDB";
  var DB_VERSION = 1;
  var META_STORE = "resource_meta";
  var PAYLOAD_STORE = "resource_payload";
  var LIFECYCLE_ACTIVE = "active";
  var LIFECYCLE_SUPERSEDED = "superseded";
  var RESOURCE_TYPE_BINARY = "binary";
  var RESOURCE_TYPE_TEXT = "text";

  var _storageBackend = null;

  function asTrimmedString(value) {
    return String(value == null ? "" : value).trim();
  }

  function generateResourceId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return "wr-" + crypto.randomUUID();
    }
    return "wr-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function createMemoryStorageBackend() {
    var meta = Object.create(null);
    var payloads = Object.create(null);
    return {
      kind: "memory",
      putMeta: function (record) {
        meta[record.resource_id] = JSON.parse(JSON.stringify(record));
        return Promise.resolve({ ok: true });
      },
      getMeta: function (resourceId) {
        var id = asTrimmedString(resourceId);
        return Promise.resolve(meta[id] ? JSON.parse(JSON.stringify(meta[id])) : null);
      },
      putPayload: function (resourceId, blob) {
        payloads[asTrimmedString(resourceId)] = blob;
        return Promise.resolve({ ok: true });
      },
      getPayload: function (resourceId) {
        var id = asTrimmedString(resourceId);
        return Promise.resolve(payloads[id] || null);
      },
      deletePayload: function (resourceId) {
        delete payloads[asTrimmedString(resourceId)];
        return Promise.resolve({ ok: true });
      },
      deleteMeta: function (resourceId) {
        delete meta[asTrimmedString(resourceId)];
        return Promise.resolve({ ok: true });
      },
      listMetaByWorkflow: function (workflowId) {
        var wid = asTrimmedString(workflowId);
        return Promise.resolve(
          Object.keys(meta)
            .map(function (k) {
              return meta[k];
            })
            .filter(function (row) {
              return row && row.workflow_id === wid;
            })
            .map(function (row) {
              return JSON.parse(JSON.stringify(row));
            })
        );
      },
      clear: function () {
        meta = Object.create(null);
        payloads = Object.create(null);
        return Promise.resolve({ ok: true });
      }
    };
  }

  function openIndexedDbBackend() {
    if (typeof indexedDB === "undefined") {
      return Promise.reject(new Error("indexeddb_unavailable"));
    }
    return new Promise(function (resolve, reject) {
      var request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = function (event) {
        var db = event.target.result;
        if (!db.objectStoreNames.contains(META_STORE)) {
          var metaStore = db.createObjectStore(META_STORE, { keyPath: "resource_id" });
          metaStore.createIndex("workflow_id", "workflow_id", { unique: false });
        }
        if (!db.objectStoreNames.contains(PAYLOAD_STORE)) {
          db.createObjectStore(PAYLOAD_STORE, { keyPath: "resource_id" });
        }
      };
      request.onsuccess = function () {
        resolve(request.result);
      };
      request.onerror = function () {
        reject(request.error || new Error("indexeddb_open_failed"));
      };
    }).then(function (db) {
      function putMeta(record) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction([META_STORE], "readwrite");
          tx.objectStore(META_STORE).put(record);
          tx.oncomplete = function () {
            resolve({ ok: true });
          };
          tx.onerror = function () {
            reject(tx.error || new Error("meta_write_failed"));
          };
        });
      }
      function getMeta(resourceId) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction([META_STORE], "readonly");
          var req = tx.objectStore(META_STORE).get(asTrimmedString(resourceId));
          req.onsuccess = function () {
            resolve(req.result || null);
          };
          req.onerror = function () {
            reject(req.error || new Error("meta_read_failed"));
          };
        });
      }
      function putPayload(resourceId, blob) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction([PAYLOAD_STORE], "readwrite");
          tx.objectStore(PAYLOAD_STORE).put({ resource_id: asTrimmedString(resourceId), blob: blob });
          tx.oncomplete = function () {
            resolve({ ok: true });
          };
          tx.onerror = function () {
            reject(tx.error || new Error("payload_write_failed"));
          };
        });
      }
      function getPayload(resourceId) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction([PAYLOAD_STORE], "readonly");
          var req = tx.objectStore(PAYLOAD_STORE).get(asTrimmedString(resourceId));
          req.onsuccess = function () {
            var row = req.result;
            resolve(row && row.blob ? row.blob : null);
          };
          req.onerror = function () {
            reject(req.error || new Error("payload_read_failed"));
          };
        });
      }
      function deletePayload(resourceId) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction([PAYLOAD_STORE], "readwrite");
          tx.objectStore(PAYLOAD_STORE).delete(asTrimmedString(resourceId));
          tx.oncomplete = function () {
            resolve({ ok: true });
          };
          tx.onerror = function () {
            reject(tx.error || new Error("payload_delete_failed"));
          };
        });
      }
      function deleteMeta(resourceId) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction([META_STORE], "readwrite");
          tx.objectStore(META_STORE).delete(asTrimmedString(resourceId));
          tx.oncomplete = function () {
            resolve({ ok: true });
          };
          tx.onerror = function () {
            reject(tx.error || new Error("meta_delete_failed"));
          };
        });
      }
      function listMetaByWorkflow(workflowId) {
        return new Promise(function (resolve, reject) {
          var wid = asTrimmedString(workflowId);
          var tx = db.transaction([META_STORE], "readonly");
          var index = tx.objectStore(META_STORE).index("workflow_id");
          var req = index.getAll(wid);
          req.onsuccess = function () {
            resolve(Array.isArray(req.result) ? req.result : []);
          };
          req.onerror = function () {
            reject(req.error || new Error("meta_list_failed"));
          };
        });
      }
      return {
        kind: "indexeddb",
        putMeta: putMeta,
        getMeta: getMeta,
        putPayload: putPayload,
        getPayload: getPayload,
        deletePayload: deletePayload,
        deleteMeta: deleteMeta,
        listMetaByWorkflow: listMetaByWorkflow,
        clear: function () {
          return Promise.reject(new Error("indexeddb_clear_not_supported"));
        }
      };
    });
  }

  var _backendPromise = null;

  function setStorageBackend(backend) {
    _storageBackend = backend || null;
    _backendPromise = backend ? Promise.resolve(backend) : null;
  }

  function getStorageBackend() {
    if (_storageBackend) {
      return Promise.resolve(_storageBackend);
    }
    if (_backendPromise) {
      return _backendPromise;
    }
    if (typeof indexedDB !== "undefined") {
      _backendPromise = openIndexedDbBackend();
      return _backendPromise;
    }
    _storageBackend = createMemoryStorageBackend();
    return Promise.resolve(_storageBackend);
  }

  function resetStorageBackendForTests() {
    _storageBackend = createMemoryStorageBackend();
    _backendPromise = Promise.resolve(_storageBackend);
    return _storageBackend;
  }

  function findBriefByAffordanceId(compilerResult, affordanceId) {
    var target = asTrimmedString(affordanceId);
    var briefs =
      compilerResult && Array.isArray(compilerResult.briefs) ? compilerResult.briefs : [];
    for (var i = 0; i < briefs.length; i++) {
      if (asTrimmedString(briefs[i].affordance_id) === target) {
        return briefs[i];
      }
    }
    return null;
  }

  function buildWorkflowResourceRefs(records) {
    return (records || [])
      .filter(function (row) {
        return row && row.lifecycle_state === LIFECYCLE_ACTIVE;
      })
      .map(function (row) {
        return {
          resource_id: row.resource_id,
          affordance_id: row.affordance_id,
          lifecycle_state: row.lifecycle_state
        };
      });
  }

  function blobToDataUrl(blob, mimeType) {
    if (!blob) return Promise.reject(new Error("missing_blob"));
    if (typeof FileReader !== "undefined") {
      return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function () {
          resolve(String(reader.result || ""));
        };
        reader.onerror = function () {
          reject(reader.error || new Error("blob_read_failed"));
        };
        reader.readAsDataURL(blob);
      });
    }
    var mime = asTrimmedString(mimeType || "application/octet-stream");
    return Promise.resolve().then(function () {
      if (typeof Buffer !== "undefined" && blob instanceof Buffer) {
        return "data:" + mime + ";base64," + blob.toString("base64");
      }
      if (typeof blob.arrayBuffer === "function") {
        return blob.arrayBuffer().then(function (ab) {
          return "data:" + mime + ";base64," + Buffer.from(ab).toString("base64");
        });
      }
      return Promise.reject(new Error("filereader_unavailable"));
    });
  }

  function putBinaryResource(input) {
    var opts = input && typeof input === "object" ? input : {};
    var workflowId = asTrimmedString(opts.workflow_id || opts.workflowId);
    var affordanceId = asTrimmedString(opts.affordance_id || opts.affordanceId);
    var briefId = asTrimmedString(opts.brief_id || opts.briefId);
    var mimeType = asTrimmedString(opts.mime_type || opts.mimeType).toLowerCase();
    var payloadBlob = opts.payload_blob || opts.payloadBlob || opts.blob || null;
    var byteSize = Number(opts.byte_size != null ? opts.byte_size : opts.byteSize);

    if (!workflowId || !affordanceId || !mimeType || !payloadBlob) {
      return Promise.resolve({
        ok: false,
        code: "invalid_put_input",
        message: "Missing workflow, affordance, mime type, or payload."
      });
    }

    return getStorageBackend()
      .then(function (backend) {
        return backend.listMetaByWorkflow(workflowId).then(function (rows) {
          var existing = null;
          for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (
              row &&
              row.lifecycle_state === LIFECYCLE_ACTIVE &&
              asTrimmedString(row.affordance_id) === affordanceId
            ) {
              existing = row;
              break;
            }
          }
          var resourceId = existing ? existing.resource_id : generateResourceId();
          var timestamp = nowIso();
          return backend
            .putPayload(resourceId, payloadBlob)
            .then(function () {
              var record = {
                resource_id: resourceId,
                resource_type: RESOURCE_TYPE_BINARY,
                mime_type: mimeType,
                workflow_id: workflowId,
                affordance_id: affordanceId,
                brief_id: briefId || (existing && existing.brief_id) || "",
                lifecycle_state: LIFECYCLE_ACTIVE,
                byte_size: Number.isFinite(byteSize) && byteSize > 0 ? Math.floor(byteSize) : 0,
                created_at: existing && existing.created_at ? existing.created_at : timestamp,
                updated_at: timestamp
              };
              return backend.putMeta(record).then(function () {
                return {
                  ok: true,
                  resource_id: resourceId,
                  record: record,
                  refs: buildWorkflowResourceRefs(
                    rows
                      .filter(function (r) {
                        return r.resource_id !== resourceId;
                      })
                      .concat([record])
                  )
                };
              });
            })
            .catch(function (err) {
              return backend.deletePayload(resourceId).then(function () {
                return {
                  ok: false,
                  code: "payload_persist_failed",
                  message: (err && err.message) || "Payload persistence failed."
                };
              });
            });
        });
      })
      .catch(function (err) {
        return {
          ok: false,
          code: "storage_unavailable",
          message: (err && err.message) || "Workflow resource storage unavailable."
        };
      });
  }

  function putBinaryFileResource(input) {
    var opts = input && typeof input === "object" ? input : {};
    var workflowId = asTrimmedString(opts.workflow_id || opts.workflowId);
    var mimeType = asTrimmedString(opts.mime_type || opts.mimeType).toLowerCase();
    var payloadBlob = opts.payload_blob || opts.payloadBlob || opts.blob || null;
    var filename = asTrimmedString(opts.filename || opts.original_filename || opts.originalFilename);
    var byteSize = Number(opts.byte_size != null ? opts.byte_size : opts.byteSize);

    if (!workflowId || !mimeType || !payloadBlob) {
      return Promise.resolve({
        ok: false,
        code: "invalid_put_input",
        message: "Missing workflow, mime type, or payload."
      });
    }

    return getStorageBackend()
      .then(function (backend) {
        var resourceId = generateResourceId();
        var timestamp = nowIso();
        return backend
          .putPayload(resourceId, payloadBlob)
          .then(function () {
            var record = {
              resource_id: resourceId,
              resource_type: RESOURCE_TYPE_BINARY,
              mime_type: mimeType,
              workflow_id: workflowId,
              affordance_id: "",
              brief_id: "",
              lifecycle_state: LIFECYCLE_ACTIVE,
              byte_size: Number.isFinite(byteSize) && byteSize > 0 ? Math.floor(byteSize) : 0,
              original_filename: filename,
              created_at: timestamp,
              updated_at: timestamp
            };
            return backend.putMeta(record).then(function () {
              return { ok: true, resource_id: resourceId, record: record };
            });
          })
          .catch(function (err) {
            return backend.deletePayload(resourceId).then(function () {
              return {
                ok: false,
                code: "payload_persist_failed",
                message: (err && err.message) || "Payload persistence failed."
              };
            });
          });
      })
      .catch(function (err) {
        return {
          ok: false,
          code: "storage_unavailable",
          message: (err && err.message) || "Workflow resource storage unavailable."
        };
      });
  }

  function putTextResource(input) {
    var opts = input && typeof input === "object" ? input : {};
    var workflowId = asTrimmedString(opts.workflow_id || opts.workflowId);
    var slotKey = asTrimmedString(opts.slot_key || opts.slotKey);
    var textPayload = String(opts.text_payload != null ? opts.text_payload : opts.textPayload || "");
    var mimeType = asTrimmedString(opts.mime_type || opts.mimeType || "text/plain").toLowerCase();

    if (!workflowId || !slotKey || !textPayload.trim()) {
      return Promise.resolve({
        ok: false,
        code: "invalid_put_input",
        message: "Missing workflow, slot key, or text payload."
      });
    }

    return getStorageBackend()
      .then(function (backend) {
        return backend.listMetaByWorkflow(workflowId).then(function (rows) {
          var existing = null;
          for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (
              row &&
              row.lifecycle_state === LIFECYCLE_ACTIVE &&
              row.resource_type === RESOURCE_TYPE_TEXT &&
              asTrimmedString(row.slot_key) === slotKey
            ) {
              existing = row;
              break;
            }
          }
          var resourceId = existing ? existing.resource_id : generateResourceId();
          var timestamp = nowIso();
          var record = {
            resource_id: resourceId,
            resource_type: RESOURCE_TYPE_TEXT,
            mime_type: mimeType,
            workflow_id: workflowId,
            affordance_id: "",
            brief_id: "",
            slot_key: slotKey,
            lifecycle_state: LIFECYCLE_ACTIVE,
            byte_size: textPayload.length,
            text_payload: textPayload,
            created_at: existing && existing.created_at ? existing.created_at : timestamp,
            updated_at: timestamp
          };
          return backend.putMeta(record).then(function () {
            return {
              ok: true,
              resource_id: resourceId,
              record: record,
              refs: buildWorkflowResourceRefs(
                rows
                  .filter(function (r) {
                    return r.resource_id !== resourceId;
                  })
                  .concat([record])
              )
            };
          });
        });
      })
      .catch(function (err) {
        return {
          ok: false,
          code: "storage_unavailable",
          message: (err && err.message) || "Workflow resource storage unavailable."
        };
      });
  }

  function isRunGeneratedVisualJobImageRecord(row, workflowId) {
    var wid = asTrimmedString(workflowId);
    return !!(
      row &&
      wid &&
      asTrimmedString(row.workflow_id) === wid &&
      row.resource_type === RESOURCE_TYPE_BINARY &&
      /^image\//i.test(String(row.mime_type || "")) &&
      asTrimmedString(row.affordance_id)
    );
  }

  function deleteResourceRecordsWithBackend(backend, records) {
    var deleted = 0;
    var chain = Promise.resolve();
    (Array.isArray(records) ? records : []).forEach(function (row) {
      var resourceId = asTrimmedString(row && row.resource_id);
      if (!resourceId) return;
      chain = chain.then(function () {
        return backend
          .deletePayload(resourceId)
          .catch(function () {
            return { ok: false };
          })
          .then(function () {
            return backend.deleteMeta(resourceId).then(function () {
              deleted += 1;
            });
          });
      });
    });
    return chain.then(function () {
      return deleted;
    });
  }

  function listActiveResources(workflowId) {
    var wid = asTrimmedString(workflowId);
    if (!wid) return Promise.resolve([]);
    return getStorageBackend().then(function (backend) {
      return backend.listMetaByWorkflow(wid).then(function (rows) {
        return (rows || []).filter(function (row) {
          return row && row.lifecycle_state === LIFECYCLE_ACTIVE;
        });
      });
    });
  }

  function deleteResourcesForWorkflow(workflowId) {
    var wid = asTrimmedString(workflowId);
    if (!wid) {
      return Promise.resolve({
        ok: false,
        code: "missing_workflow_id",
        message: "Workflow id is required.",
        deleted_count: 0
      });
    }
    return getStorageBackend()
      .then(function (backend) {
        if (
          !backend ||
          typeof backend.listMetaByWorkflow !== "function" ||
          typeof backend.deletePayload !== "function" ||
          typeof backend.deleteMeta !== "function"
        ) {
          return {
            ok: false,
            code: "storage_backend_unsupported",
            message: "Resource backend does not support workflow deletion.",
            deleted_count: 0
          };
        }
        return backend.listMetaByWorkflow(wid).then(function (rows) {
          var records = Array.isArray(rows) ? rows.slice() : [];
          if (!records.length) {
            return {
              ok: true,
              workflow_id: wid,
              deleted_count: 0
            };
          }
          return deleteResourceRecordsWithBackend(backend, records).then(function (deleted) {
            return {
              ok: true,
              workflow_id: wid,
              deleted_count: deleted
            };
          });
        });
      })
      .catch(function (err) {
        return {
          ok: false,
          code: "resource_delete_failed",
          message: (err && err.message) || "Workflow resource cleanup failed.",
          deleted_count: 0
        };
      });
  }

  function deleteGeneratedVisualJobImagesForWorkflow(workflowId) {
    var wid = asTrimmedString(workflowId);
    if (!wid) {
      return Promise.resolve({
        ok: false,
        code: "missing_workflow_id",
        message: "Workflow id is required.",
        deleted_count: 0
      });
    }
    return getStorageBackend()
      .then(function (backend) {
        if (
          !backend ||
          typeof backend.listMetaByWorkflow !== "function" ||
          typeof backend.deletePayload !== "function" ||
          typeof backend.deleteMeta !== "function"
        ) {
          return {
            ok: false,
            code: "storage_backend_unsupported",
            message: "Resource backend does not support generated-image cleanup.",
            deleted_count: 0
          };
        }
        return backend.listMetaByWorkflow(wid).then(function (rows) {
          var targets = (Array.isArray(rows) ? rows : []).filter(function (row) {
            return isRunGeneratedVisualJobImageRecord(row, wid);
          });
          if (!targets.length) {
            return {
              ok: true,
              workflow_id: wid,
              deleted_count: 0
            };
          }
          return deleteResourceRecordsWithBackend(backend, targets).then(function (deleted) {
            return {
              ok: true,
              workflow_id: wid,
              deleted_count: deleted
            };
          });
        });
      })
      .catch(function (err) {
        return {
          ok: false,
          code: "generated_image_delete_failed",
          message: (err && err.message) || "Generated visual-job image cleanup failed.",
          deleted_count: 0
        };
      });
  }

  function getResourceMetadata(resourceId) {
    return getStorageBackend().then(function (backend) {
      return backend.getMeta(asTrimmedString(resourceId));
    });
  }

  function getResourcePayload(resourceId) {
    return getStorageBackend().then(function (backend) {
      return backend.getPayload(asTrimmedString(resourceId));
    });
  }

  function getTextResourcePayload(resourceId) {
    return getResourceMetadata(resourceId).then(function (record) {
      if (!record || record.resource_type !== RESOURCE_TYPE_TEXT) return "";
      return String(record.text_payload || "");
    });
  }

  function buildImageInputFromResource(record, blob, brief, assetsMod) {
    return blobToDataUrl(blob, record.mime_type).then(function (dataUrl) {
      if (!/^data:image\/(?:png|jpeg|webp);base64,/i.test(dataUrl)) {
        return {
          ok: false,
          code: "invalid_payload_mime",
          message: "Stored payload is not a supported image data URL."
        };
      }
      var objectUrl = null;
      if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
        objectUrl = URL.createObjectURL(blob);
      }
      var imageInput = {
        filename: "visual." + (record.mime_type === "image/jpeg" ? "jpg" : record.mime_type === "image/webp" ? "webp" : "png"),
        mime_type: record.mime_type,
        byte_size: record.byte_size || blob.size || 0,
        width: 1,
        height: 1,
        render_source: { kind: "data_url", value: dataUrl },
        preview_source: objectUrl ? { kind: "object_url", value: objectUrl } : null
      };
      if (!brief || !assetsMod || typeof assetsMod.createVisualAssetAssociation !== "function") {
        return { ok: false, code: "missing_brief", message: "Brief not found for resource projection." };
      }
      var created = assetsMod.createVisualAssetAssociation(brief, imageInput, {
        intakeMethod: "file_picker"
      });
      if (!created.ok) return created;
      created.asset.resource_id = record.resource_id;
      return created;
    });
  }

  function hydrateVisualAssetsIntoWorkspace(input) {
    var opts = input && typeof input === "object" ? input : {};
    var workflowId = asTrimmedString(opts.workflow_id || opts.workflowId);
    var workspace = opts.workspace;
    var assetsMod = opts.assetsMod;
    var workspaceMod = opts.workspaceMod;

    if (!workflowId || !workspace || !assetsMod) {
      return Promise.resolve({ ok: false, code: "invalid_hydrate_input", hydrated: 0 });
    }

    var compilerResult = workspace.compilerResult || { briefs: [] };
    var diagnostics = [];

    return listActiveResources(workflowId).then(function (records) {
      if (!records.length) {
        return { ok: true, hydrated: 0, refs: [], diagnostics: diagnostics };
      }

      var chain = Promise.resolve();
      var hydrated = 0;

      records.forEach(function (record) {
        if (record.resource_type !== RESOURCE_TYPE_BINARY) {
          return;
        }
        if (!/^image\//i.test(String(record.mime_type || ""))) {
          return;
        }
        chain = chain.then(function () {
          var brief = findBriefByAffordanceId(compilerResult, record.affordance_id);
          if (!brief && record.brief_id) {
            var briefs =
              compilerResult && Array.isArray(compilerResult.briefs) ? compilerResult.briefs : [];
            for (var bi = 0; bi < briefs.length; bi++) {
              if (asTrimmedString(briefs[bi].brief_id) === asTrimmedString(record.brief_id)) {
                brief = briefs[bi];
                break;
              }
            }
          }
          if (!brief) {
            diagnostics.push({
              code: "missing_brief_for_resource",
              resource_id: record.resource_id,
              affordance_id: record.affordance_id
            });
            return null;
          }
          return getResourcePayload(record.resource_id).then(function (blob) {
            if (!blob) {
              diagnostics.push({
                code: "missing_payload",
                resource_id: record.resource_id,
                affordance_id: record.affordance_id
              });
              if (!workspace.assetErrorsByBriefId) workspace.assetErrorsByBriefId = {};
              workspace.assetErrorsByBriefId[brief.brief_id] = "Stored image payload is missing.";
              return null;
            }
            return buildImageInputFromResource(record, blob, brief, assetsMod).then(function (built) {
              if (!built.ok) {
                diagnostics.push({
                  code: built.code || "projection_failed",
                  resource_id: record.resource_id,
                  affordance_id: record.affordance_id
                });
                if (!workspace.assetErrorsByBriefId) workspace.assetErrorsByBriefId = {};
                workspace.assetErrorsByBriefId[brief.brief_id] =
                  built.message || "Could not project stored resource.";
                return null;
              }
              if (!workspace.assetsByBriefId) workspace.assetsByBriefId = {};
              workspace.assetsByBriefId[brief.brief_id] = built.asset;
              if (!workspace.assetErrorsByBriefId) workspace.assetErrorsByBriefId = {};
              workspace.assetErrorsByBriefId[brief.brief_id] = "";
              hydrated += 1;
              return built.asset;
            });
          });
        });
      });

      return chain.then(function () {
        if (workspaceMod && typeof workspaceMod.refreshVisualAssetManifest === "function") {
          workspaceMod.refreshVisualAssetManifest(workspace);
        } else if (typeof assetsMod.buildVisualAssetManifest === "function") {
          workspace.visualAssetManifest = assetsMod.buildVisualAssetManifest(
            compilerResult,
            workspace.assetsByBriefId || {}
          );
        }
        return {
          ok: true,
          hydrated: hydrated,
          refs: buildWorkflowResourceRefs(records),
          diagnostics: diagnostics
        };
      });
    });
  }

  function regenerateFreshExportHtml(page, manifest, pipelineFn) {
    if (typeof pipelineFn !== "function") {
      return Promise.resolve({ ok: false, code: "pipeline_unavailable" });
    }
    var rendered = pipelineFn(page, {
      visualAssets: manifest || null,
      skipWorkflowAssembly: true,
      applyCompositionValidation: false
    });
    if (!rendered || rendered.error || !rendered.html) {
      return Promise.resolve({
        ok: false,
        code: "render_failed",
        message: (rendered && rendered.error) || "Export render failed."
      });
    }
    return Promise.resolve({ ok: true, html: String(rendered.html || ""), rendered: rendered });
  }

  return {
    DB_NAME: DB_NAME,
    LIFECYCLE_ACTIVE: LIFECYCLE_ACTIVE,
    LIFECYCLE_SUPERSEDED: LIFECYCLE_SUPERSEDED,
    RESOURCE_TYPE_BINARY: RESOURCE_TYPE_BINARY,
    RESOURCE_TYPE_TEXT: RESOURCE_TYPE_TEXT,
    setStorageBackend: setStorageBackend,
    getStorageBackend: getStorageBackend,
    resetStorageBackendForTests: resetStorageBackendForTests,
    createMemoryStorageBackend: createMemoryStorageBackend,
    generateResourceId: generateResourceId,
    buildWorkflowResourceRefs: buildWorkflowResourceRefs,
    putBinaryResource: putBinaryResource,
    putBinaryFileResource: putBinaryFileResource,
    putTextResource: putTextResource,
    deleteResourcesForWorkflow: deleteResourcesForWorkflow,
    deleteGeneratedVisualJobImagesForWorkflow: deleteGeneratedVisualJobImagesForWorkflow,
    isRunGeneratedVisualJobImageRecord: isRunGeneratedVisualJobImageRecord,
    listActiveResources: listActiveResources,
    getResourceMetadata: getResourceMetadata,
    getResourcePayload: getResourcePayload,
    getTextResourcePayload: getTextResourcePayload,
    hydrateVisualAssetsIntoWorkspace: hydrateVisualAssetsIntoWorkspace,
    blobToDataUrl: blobToDataUrl,
    regenerateFreshExportHtml: regenerateFreshExportHtml
  };
});
