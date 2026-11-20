/**
 * Authoritative durable store for workflow run-state (promptr.workflows.runstate.v1).
 * IndexedDB-first. Browser: IndexedDB. Node/tests: injectable memory backend via setStorageBackend.
 *
 * Record shape: { id, json, updatedAt, revision }
 *
 * Sprint 101E — completes the incomplete localStorage → IndexedDB migration for run-state.
 * localStorage must not be required for normal durable operation.
 */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.PRISM_WORKFLOW_RUNSTATE_STORE = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  var DB_NAME = "prismWorkflowRunstateDB";
  var DB_VERSION = 1;
  var STORE_NAME = "runstate";
  var RECORD_KEY = "promptr.workflows.runstate.v1";

  var _storageBackend = null;
  var _backendPromise = null;

  function asRecord(row) {
    if (!row || typeof row.json !== "string") return null;
    return {
      id: String(row.id || RECORD_KEY),
      json: row.json,
      updatedAt: Number(row.updatedAt || 0) || 0,
      revision: Number(row.revision || 0) || 0
    };
  }

  function createMemoryStorageBackend() {
    var records = Object.create(null);
    return {
      kind: "memory",
      getRecord: function (key) {
        var k = String(key || "");
        return Promise.resolve(asRecord(records[k] || null));
      },
      get: function (key) {
        var k = String(key || "");
        var row = records[k];
        return Promise.resolve(row && typeof row.json === "string" ? row.json : null);
      },
      put: function (key, value, meta) {
        var revision =
          meta && meta.revision != null && isFinite(Number(meta.revision))
            ? Number(meta.revision)
            : Date.now();
        records[String(key || "")] = {
          id: String(key || RECORD_KEY),
          json: String(value == null ? "" : value),
          updatedAt: Date.now(),
          revision: revision
        };
        return Promise.resolve({ ok: true, revision: revision });
      },
      remove: function (key) {
        delete records[String(key || "")];
        return Promise.resolve({ ok: true });
      },
      clear: function () {
        records = Object.create(null);
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
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
      request.onsuccess = function () {
        resolve(request.result);
      };
      request.onerror = function () {
        reject(request.error || new Error("indexeddb_open_failed"));
      };
    }).then(function (db) {
      function getRecord(key) {
        return new Promise(function (resolve, reject) {
          try {
            var tx = db.transaction([STORE_NAME], "readonly");
            var store = tx.objectStore(STORE_NAME);
            var req = store.get(String(key || RECORD_KEY));
            req.onsuccess = function () {
              resolve(asRecord(req.result || null));
            };
            req.onerror = function () {
              reject(req.error || new Error("runstate_get_failed"));
            };
          } catch (err) {
            reject(err);
          }
        });
      }
      function get(key) {
        return getRecord(key).then(function (row) {
          return row ? row.json : null;
        });
      }
      function put(key, value, meta) {
        return new Promise(function (resolve, reject) {
          try {
            var revision =
              meta && meta.revision != null && isFinite(Number(meta.revision))
                ? Number(meta.revision)
                : Date.now();
            var tx = db.transaction([STORE_NAME], "readwrite");
            var store = tx.objectStore(STORE_NAME);
            var req = store.put({
              id: String(key || RECORD_KEY),
              json: String(value == null ? "" : value),
              updatedAt: Date.now(),
              revision: revision
            });
            req.onsuccess = function () {
              resolve({ ok: true, revision: revision });
            };
            req.onerror = function () {
              reject(req.error || new Error("runstate_put_failed"));
            };
            tx.onabort = function () {
              reject(tx.error || new Error("runstate_put_aborted"));
            };
          } catch (err) {
            reject(err);
          }
        });
      }
      function remove(key) {
        return new Promise(function (resolve, reject) {
          try {
            var tx = db.transaction([STORE_NAME], "readwrite");
            var store = tx.objectStore(STORE_NAME);
            var req = store.delete(String(key || RECORD_KEY));
            req.onsuccess = function () {
              resolve({ ok: true });
            };
            req.onerror = function () {
              reject(req.error || new Error("runstate_delete_failed"));
            };
          } catch (err) {
            reject(err);
          }
        });
      }
      function close() {
        try {
          if (db && typeof db.close === "function") db.close();
        } catch (_e) {}
      }
      return {
        kind: "indexeddb",
        getRecord: getRecord,
        get: get,
        put: put,
        remove: remove,
        close: close,
        clear: function () {
          return remove(RECORD_KEY);
        }
      };
    });
  }

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
      _backendPromise = openIndexedDbBackend()
        .then(function (backend) {
          return backend;
        })
        .catch(function (err) {
          _backendPromise = null;
          throw err;
        });
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

  function readRunStateRecord() {
    return getStorageBackend().then(function (backend) {
      if (typeof backend.getRecord === "function") {
        return backend.getRecord(RECORD_KEY);
      }
      return backend.get(RECORD_KEY).then(function (json) {
        return json
          ? { id: RECORD_KEY, json: json, updatedAt: 0, revision: 0 }
          : null;
      });
    });
  }

  function readRunStateJson() {
    return readRunStateRecord().then(function (row) {
      return row ? row.json : null;
    });
  }

  /**
   * @param {string} json
   * @param {{ nextRevision?: number, expectedRevision?: number }} [options]
   */
  function writeRunStateJson(json, options) {
    var opts = options && typeof options === "object" ? options : {};
    var nextRevision =
      opts.nextRevision != null && isFinite(Number(opts.nextRevision))
        ? Number(opts.nextRevision)
        : null;

    return getStorageBackend()
      .then(function (backend) {
        function doPut(revision) {
          return backend.put(RECORD_KEY, json, { revision: revision }).then(function (result) {
            if (!result || !result.ok) {
              return { ok: false, reason: "write_failed", stage: "indexeddb_runstate" };
            }
            return {
              ok: true,
              revision: result.revision != null ? Number(result.revision) : revision,
              backend: backend.kind || "idb",
              stage: "indexeddb_runstate"
            };
          });
        }

        if (opts.expectedRevision == null) {
          return doPut(nextRevision != null ? nextRevision : Date.now());
        }

        var expected = Number(opts.expectedRevision);
        var readExisting =
          typeof backend.getRecord === "function"
            ? backend.getRecord(RECORD_KEY)
            : backend.get(RECORD_KEY).then(function (existingJson) {
                return existingJson
                  ? { json: existingJson, revision: 0, updatedAt: 0 }
                  : null;
              });

        return readExisting.then(function (existing) {
          var current = existing && existing.revision != null ? Number(existing.revision) : 0;
          if (current > expected) {
            return {
              ok: false,
              reason: "stale_revision",
              currentRevision: current,
              expectedRevision: expected,
              stage: "indexeddb_runstate"
            };
          }
          var revision = nextRevision != null ? nextRevision : current + 1;
          return doPut(revision);
        });
      })
      .catch(function (err) {
        var name = String((err && err.name) || "");
        var message = String((err && err.message) || err || "");
        return {
          ok: false,
          reason: "write_exception",
          message: message,
          error_name: name,
          stage: "indexeddb_runstate"
        };
      });
  }

  function clearRunState() {
    return getStorageBackend()
      .then(function (backend) {
        if (typeof backend.clear === "function") return backend.clear();
        return backend.remove(RECORD_KEY);
      })
      .then(function () {
        return { ok: true };
      })
      .catch(function () {
        return { ok: false };
      });
  }

  /**
   * Heuristic richness for non-destructive LS→IDB migration preference.
   * Counts workflow records and capture-ref / completed-step entries.
   */
  function runStateJsonRichness(raw) {
    if (!raw) return { workflows: 0, refs: 0, completed: 0, score: -1 };
    try {
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return { workflows: 0, refs: 0, completed: 0, score: -1 };
      }
      var workflows = Object.keys(parsed).length;
      var refs = 0;
      var completed = 0;
      Object.keys(parsed).forEach(function (wid) {
        var rec = parsed[wid];
        if (!rec || typeof rec !== "object") return;
        if (rec.captureRefs && typeof rec.captureRefs === "object") {
          refs += Object.keys(rec.captureRefs).length;
        }
        if (rec.stepCompleted && typeof rec.stepCompleted === "object") {
          completed += Object.keys(rec.stepCompleted).length;
        }
      });
      return {
        workflows: workflows,
        refs: refs,
        completed: completed,
        score: workflows * 1000 + refs * 10 + completed
      };
    } catch (_e) {
      return { workflows: 0, refs: 0, completed: 0, score: -1 };
    }
  }

  function preferRicherRunStateJson(lsRaw, idbRaw) {
    var ls = runStateJsonRichness(lsRaw);
    var idb = runStateJsonRichness(idbRaw);
    if (idb.score < 0 && ls.score < 0) return null;
    if (idb.score < 0) return lsRaw;
    if (ls.score < 0) return idbRaw;
    if (idb.score > ls.score) return idbRaw;
    if (ls.score > idb.score) return lsRaw;
    // Tie: keep IndexedDB as authoritative.
    return idbRaw;
  }

  return {
    RECORD_KEY: RECORD_KEY,
    DB_NAME: DB_NAME,
    STORE_NAME: STORE_NAME,
    setStorageBackend: setStorageBackend,
    resetStorageBackendForTests: resetStorageBackendForTests,
    createMemoryStorageBackend: createMemoryStorageBackend,
    readRunStateRecord: readRunStateRecord,
    readRunStateJson: readRunStateJson,
    writeRunStateJson: writeRunStateJson,
    clearRunState: clearRunState,
    runStateJsonRichness: runStateJsonRichness,
    preferRicherRunStateJson: preferRicherRunStateJson
  };
});
