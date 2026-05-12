(function () {
  "use strict";

  /**
   * Simple client-side prompt library using IndexedDB with localStorage fallback.
   * All functions return Promises for a consistent async API.
   *
   * Schema:
   * PromptEntry {
   *   id: string,
   *   title: string,
   *   body: string,
   *   model?: string,
   *   temperature?: number,
   *   maxTokens?: number,
   *   tags: string[],
   *   createdAt: number,
   *   updatedAt: number,
   *   usageCount: number,
   *   source: "refined" | "manual",
   *   versions: PromptVersion[]
   * }
   */

  var DB_NAME = "promptRefinerDB";
  var DB_VERSION = 1;
  var STORE_NAME = "prompts";
  var LS_KEY = "promptRefiner.prompts";

  var useLocalStorage = false;
  var dbPromise = null;

  /**
   * Open IndexedDB database, creating object store if needed.
   * If IndexedDB is unavailable or opening fails, fallback to localStorage.
   */
  function openDB() {
    if (dbPromise) return dbPromise;

    if (!window.indexedDB) {
      useLocalStorage = true;
      dbPromise = Promise.resolve(null);
      return dbPromise;
    }

    dbPromise = new Promise(function (resolve) {
      var request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = function (event) {
        var db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };

      request.onsuccess = function (event) {
        useLocalStorage = false;
        resolve(event.target.result);
      };

      request.onerror = function () {
        // Fallback to localStorage if IndexedDB fails.
        useLocalStorage = true;
        resolve(null);
      };
    });

    return dbPromise;
  }

  function readAllFromLocalStorage() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  }

  function writeAllToLocalStorage(entries) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(entries || []));
    } catch {
      // Ignore quota / access errors.
    }
  }

  function getAllPrompts() {
    if (useLocalStorage) {
      return Promise.resolve(readAllFromLocalStorage());
    }

    return openDB().then(function (db) {
      if (!db) return readAllFromLocalStorage();

      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, "readonly");
        var store = tx.objectStore(STORE_NAME);
        var request = store.getAll();

        request.onsuccess = function () {
          resolve(request.result || []);
        };
        request.onerror = function () {
          reject(request.error);
        };
      });
    });
  }

  function getPrompt(id) {
    if (!id) return Promise.resolve(null);

    if (useLocalStorage) {
      var all = readAllFromLocalStorage();
      var found = all.find(function (p) {
        return p.id === id;
      });
      return Promise.resolve(found || null);
    }

    return openDB().then(function (db) {
      if (!db) {
        var all = readAllFromLocalStorage();
        var found = all.find(function (p) {
          return p.id === id;
        });
        return found || null;
      }

      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, "readonly");
        var store = tx.objectStore(STORE_NAME);
        var request = store.get(id);

        request.onsuccess = function () {
          resolve(request.result || null);
        };
        request.onerror = function () {
          reject(request.error);
        };
      });
    });
  }

  /**
   * Internal helper to persist a single entry, handling IndexedDB vs localStorage.
   */
  function upsertEntry(entry) {
    if (useLocalStorage) {
      var all = readAllFromLocalStorage();
      var idx = all.findIndex(function (p) {
        return p.id === entry.id;
      });
      if (idx >= 0) {
        all[idx] = entry;
      } else {
        all.push(entry);
      }
      writeAllToLocalStorage(all);
      return Promise.resolve(entry);
    }

    return openDB().then(function (db) {
      if (!db) {
        // Fallback to localStorage if db failed mid-flight.
        useLocalStorage = true;
        var list = readAllFromLocalStorage();
        var index = list.findIndex(function (p) {
          return p.id === entry.id;
        });
        if (index >= 0) {
          list[index] = entry;
        } else {
          list.push(entry);
        }
        writeAllToLocalStorage(list);
        return entry;
      }

      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, "readwrite");
        var store = tx.objectStore(STORE_NAME);
        var request = store.put(entry);

        request.onsuccess = function () {
          resolve(entry);
        };
        request.onerror = function () {
          reject(request.error);
        };
      });
    });
  }

  function savePrompt(entry) {
    // Ensure required fields and reasonable defaults.
    var now = Date.now();
    var prepared = {
      id: entry.id || (window.Utils && window.Utils.uuid ? window.Utils.uuid() : String(now)),
      title: entry.title || "Untitled prompt",
      body: entry.body || "",
      model: entry.model || "",
      temperature: typeof entry.temperature === "number" ? entry.temperature : null,
      maxTokens: typeof entry.maxTokens === "number" ? entry.maxTokens : null,
      tags: Array.isArray(entry.tags) ? entry.tags : [],
      createdAt: entry.createdAt || now,
      updatedAt: now,
      usageCount: typeof entry.usageCount === "number" ? entry.usageCount : 0,
      source: entry.source === "manual" ? "manual" : "refined",
      versions: Array.isArray(entry.versions) ? entry.versions.slice() : [],
      // Optional structured brief metadata used to restore refinement parameters.
      brief: entry.brief && typeof entry.brief === "object" ? Object.assign({}, entry.brief) : null
    };

    // Add new version snapshot for current body.
    prepared.versions.push({
      id: (window.Utils && window.Utils.uuid ? window.Utils.uuid() : String(now)) + "-v",
      timestamp: now,
      body: prepared.body,
      notes: entry.notes || ""
    });

    // Persist "notes" as latest version's notes, top-level notes are optional.
    prepared.notes = entry.notes || "";

    return upsertEntry(prepared);
  }

  function updatePrompt(entry) {
    if (!entry || !entry.id) {
      return Promise.reject(new Error("updatePrompt requires an entry with id"));
    }

    var now = Date.now();
    return getPrompt(entry.id).then(function (existing) {
      if (!existing) {
        // If not found, treat as save.
        return savePrompt(entry);
      }

      var merged = {
        id: existing.id,
        title: entry.title != null ? entry.title : existing.title,
        body: entry.body != null ? entry.body : existing.body,
        model: entry.model != null ? entry.model : existing.model,
        temperature:
          typeof entry.temperature === "number"
            ? entry.temperature
            : existing.temperature,
        maxTokens:
          typeof entry.maxTokens === "number"
            ? entry.maxTokens
            : existing.maxTokens,
        tags: Array.isArray(entry.tags) ? entry.tags : existing.tags || [],
        createdAt: existing.createdAt || now,
        updatedAt: now,
        usageCount:
          typeof entry.usageCount === "number"
            ? entry.usageCount
            : existing.usageCount || 0,
        source: existing.source === "manual" || entry.source === "manual" ? "manual" : "refined",
        versions: Array.isArray(existing.versions) ? existing.versions.slice() : [],
        notes: entry.notes != null ? entry.notes : existing.notes || "",
        brief:
          entry.brief != null
            ? entry.brief
            : typeof existing.brief === "object"
            ? Object.assign({}, existing.brief)
            : null
      };

      // Record a new version snapshot for the new body if changed.
      if (entry.body != null && entry.body !== existing.body) {
        merged.versions.push({
          id: (window.Utils && window.Utils.uuid ? window.Utils.uuid() : String(now)) + "-v",
          timestamp: now,
          body: merged.body,
          notes: merged.notes || ""
        });
      }

      return upsertEntry(merged);
    });
  }

  function deletePrompt(id) {
    if (!id) return Promise.resolve();

    if (useLocalStorage) {
      var all = readAllFromLocalStorage().filter(function (p) {
        return p.id !== id;
      });
      writeAllToLocalStorage(all);
      return Promise.resolve();
    }

    return openDB().then(function (db) {
      if (!db) {
        useLocalStorage = true;
        var list = readAllFromLocalStorage().filter(function (p) {
          return p.id !== id;
        });
        writeAllToLocalStorage(list);
        return;
      }

      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, "readwrite");
        var store = tx.objectStore(STORE_NAME);
        var request = store.delete(id);

        request.onsuccess = function () {
          resolve();
        };
        request.onerror = function () {
          reject(request.error);
        };
      });
    });
  }

  function bulkUpsert(entries) {
    if (!Array.isArray(entries) || !entries.length) {
      return Promise.resolve([]);
    }
    // Apply sequential upserts to keep implementation simple.
    var chain = Promise.resolve([]);
    entries.forEach(function (entry) {
      chain = chain.then(function (acc) {
        return upsertEntry(entry).then(function (saved) {
          acc.push(saved);
          return acc;
        });
      });
    });
    return chain;
  }

  /**
   * Export prompts. If ids array provided, export only matching entries.
   * Returns an array of PromptEntry objects to be stringified by the caller.
   */
  function exportPrompts(ids) {
    var useIds = Array.isArray(ids) && ids.length > 0 ? ids : null;
    return getAllPrompts().then(function (all) {
      if (!useIds) return all;
      return all.filter(function (p) {
        return useIds.indexOf(p.id) !== -1;
      });
    });
  }

  /**
   * Import prompts from parsed entries array.
   * Options: { newerWins: boolean } - when true, skip importing if existing has newer updatedAt.
   * Returns a summary {added, updated, skipped}.
   */
  function importPromptsFromEntries(entries, options) {
    var newerWins = options && options.newerWins === true;
    if (!Array.isArray(entries) || !entries.length) {
      return Promise.resolve({ added: 0, updated: 0, skipped: 0 });
    }
    return getAllPrompts().then(function (existing) {
      var existingById = {};
      existing.forEach(function (p) {
        existingById[p.id] = p;
      });

      var added = 0;
      var updated = 0;
      var skipped = 0;
      var toUpsert = [];

      entries.forEach(function (raw) {
        if (!raw || typeof raw !== "object") {
          skipped++;
          return;
        }
        if (!raw.id || !raw.title || !raw.body) {
          skipped++;
          return;
        }
        var now = Date.now();

        if (newerWins) {
          var existingEntry = existingById[String(raw.id)];
          if (existingEntry) {
            var existingTime = typeof existingEntry.updatedAt === "number" ? existingEntry.updatedAt : 0;
            var importedTime = typeof raw.updatedAt === "number" ? raw.updatedAt : 0;
            if (importedTime <= existingTime) {
              skipped++;
              return;
            }
          }
        }

        var normalized = {
          id: String(raw.id),
          title: String(raw.title),
          body: String(raw.body),
          model: raw.model ? String(raw.model) : "",
          temperature:
            typeof raw.temperature === "number"
              ? raw.temperature
              : null,
          maxTokens:
            typeof raw.maxTokens === "number"
              ? raw.maxTokens
              : null,
          tags: Array.isArray(raw.tags)
            ? raw.tags.map(function (t) {
                return String(t);
              })
            : [],
          createdAt:
            typeof raw.createdAt === "number"
              ? raw.createdAt
              : now,
          updatedAt:
            typeof raw.updatedAt === "number"
              ? raw.updatedAt
              : now,
          usageCount:
            typeof raw.usageCount === "number"
              ? raw.usageCount
              : 0,
          source:
            raw.source === "manual" ? "manual" : "refined",
          versions: Array.isArray(raw.versions)
            ? raw.versions
            : [],
          notes: raw.notes ? String(raw.notes) : ""
        };

        if (!normalized.versions.length) {
          normalized.versions.push({
            id:
              (window.Utils && window.Utils.uuid
                ? window.Utils.uuid()
                : String(now)) + "-v",
            timestamp: now,
            body: normalized.body,
            notes: normalized.notes
          });
        }

        if (existingById[normalized.id]) {
          updated++;
        } else {
          added++;
        }
        toUpsert.push(normalized);
      });

      return bulkUpsert(toUpsert).then(function () {
        return { added: added, updated: updated, skipped: skipped };
      });
    });
  }

  /**
   * Import prompts from a .json file.
   * File is expected to contain an array of PromptEntry-like objects.
   * Returns a summary {added, updated, skipped}.
   */
  function importPrompts(file) {
    if (!file) {
      return Promise.reject(new Error("No file provided"));
    }
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = function () {
        reject(new Error("Unable to read file"));
      };
      reader.onload = function (event) {
        try {
          var text = String(event.target.result || "").trim();
          if (!text) {
            resolve({ added: 0, updated: 0, skipped: 0 });
            return;
          }
          var data = JSON.parse(text);
          if (!Array.isArray(data)) {
            reject(new Error("Import file must contain a JSON array"));
            return;
          }
          importPromptsFromEntries(data, { newerWins: false })
            .then(resolve)
            .catch(reject);
        } catch (e) {
          reject(new Error("Invalid JSON file"));
        }
      };
      reader.readAsText(file);
    });
  }

  window.Library = {
    openDB: openDB,
    getAllPrompts: getAllPrompts,
    getPrompt: getPrompt,
    savePrompt: savePrompt,
    updatePrompt: updatePrompt,
    deletePrompt: deletePrompt,
    bulkUpsert: bulkUpsert,
    exportPrompts: exportPrompts,
    importPrompts: importPrompts,
    importPromptsFromEntries: importPromptsFromEntries
  };
})();

