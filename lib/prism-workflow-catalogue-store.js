/**
 * Authoritative durable store for the My Workflows catalogue (promptr.workflows.v1).
 * IndexedDB-first. Browser: IndexedDB. Node/tests: injectable memory backend via setStorageBackend.
 *
 * Record shape: { id, json, updatedAt, revision }
 */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.PRISM_WORKFLOW_CATALOGUE_STORE = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  var DB_NAME = "prismWorkflowCatalogueDB";
  var DB_VERSION = 1;
  var STORE_NAME = "catalogue";
  var RECORD_KEY = "promptr.workflows.v1";

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
          var tx = db.transaction([STORE_NAME], "readonly");
          var store = tx.objectStore(STORE_NAME);
          var req = store.get(String(key || RECORD_KEY));
          req.onsuccess = function () {
            resolve(asRecord(req.result || null));
          };
          req.onerror = function () {
            reject(req.error || new Error("catalogue_get_failed"));
          };
        });
      }
      function get(key) {
        return getRecord(key).then(function (row) {
          return row ? row.json : null;
        });
      }
      function put(key, value, meta) {
        return new Promise(function (resolve, reject) {
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
            reject(req.error || new Error("catalogue_put_failed"));
          };
        });
      }
      function remove(key) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction([STORE_NAME], "readwrite");
          var store = tx.objectStore(STORE_NAME);
          var req = store.delete(String(key || RECORD_KEY));
          req.onsuccess = function () {
            resolve({ ok: true });
          };
          req.onerror = function () {
            reject(req.error || new Error("catalogue_delete_failed"));
          };
        });
      }
      return {
        kind: "indexeddb",
        getRecord: getRecord,
        get: get,
        put: put,
        remove: remove,
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
      _backendPromise = openIndexedDbBackend().catch(function () {
        _storageBackend = createMemoryStorageBackend();
        return _storageBackend;
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

  function readCatalogueRecord() {
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

  function readCatalogueJson() {
    return readCatalogueRecord().then(function (row) {
      return row ? row.json : null;
    });
  }

  /**
   * @param {string} json
   * @param {{ nextRevision?: number, expectedRevision?: number }} [options]
   *   expectedRevision: if set, reject when stored revision is strictly greater
   *   (prevents stale writers from clobbering newer catalogue state).
   */
  function writeCatalogueJson(json, options) {
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
              return { ok: false, reason: "write_failed" };
            }
            return {
              ok: true,
              revision: result.revision != null ? Number(result.revision) : revision
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
              expectedRevision: expected
            };
          }
          var revision = nextRevision != null ? nextRevision : current + 1;
          return doPut(revision);
        });
      })
      .catch(function (err) {
        return {
          ok: false,
          reason: "write_exception",
          message: err && err.message ? String(err.message) : String(err || "")
        };
      });
  }

  function clearCatalogue() {
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

  return {
    RECORD_KEY: RECORD_KEY,
    DB_NAME: DB_NAME,
    setStorageBackend: setStorageBackend,
    resetStorageBackendForTests: resetStorageBackendForTests,
    readCatalogueRecord: readCatalogueRecord,
    readCatalogueJson: readCatalogueJson,
    writeCatalogueJson: writeCatalogueJson,
    clearCatalogue: clearCatalogue
  };
});
