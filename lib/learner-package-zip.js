/**
 * Sprint 70 — ZIP serializer for LearnerPackage.
 * Thin fflate wrapper; package construction lives in learner-package.js.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(
      require("./learner-package.js"),
      require("fflate")
    );
  } else {
    root.PRISM_LEARNER_PACKAGE_ZIP = factory(
      root.PRISM_LEARNER_PACKAGE,
      root.fflate
    );
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (learnerPackageApi, fflateApi) {
  "use strict";

  function asTrimmedString(value) {
    return String(value == null ? "" : value).trim();
  }

  function resolveFflate(fflateOverride) {
    if (fflateOverride && typeof fflateOverride.zipSync === "function") {
      return fflateOverride;
    }
    if (fflateApi && typeof fflateApi.zipSync === "function") {
      return fflateApi;
    }
    throw new Error("fflate is required to serialize a LearnerPackage to ZIP.");
  }

  /**
   * @param {{ html: string, assets?: Array, metadata?: object }} learnerPackage
   * @param {{ fflate?: object, includeManifest?: boolean }} [options]
   * @returns {{ ok: true, bytes: Uint8Array, entryPaths: string[] } | { ok: false, error: { code: string, message: string } }}
   */
  function serializeLearnerPackageToZip(learnerPackage, options) {
    var opts = options && typeof options === "object" ? options : {};
    var pkg = learnerPackage && typeof learnerPackage === "object" ? learnerPackage : null;
    if (!pkg || typeof pkg.html !== "string") {
      return {
        ok: false,
        error: { code: "invalid_package", message: "LearnerPackage.html is required." }
      };
    }

    var fflate;
    try {
      fflate = resolveFflate(opts.fflate);
    } catch (err) {
      return {
        ok: false,
        error: {
          code: "missing_fflate",
          message: String((err && err.message) || err || "fflate unavailable")
        }
      };
    }

    var files = Object.create(null);
    var entryPaths = [];

    try {
      files["learner-page.html"] = fflate.strToU8(String(pkg.html));
      entryPaths.push("learner-page.html");

      var assets = Array.isArray(pkg.assets) ? pkg.assets : [];
      for (var i = 0; i < assets.length; i += 1) {
        var asset = assets[i];
        if (!asset || typeof asset !== "object") {
          return {
            ok: false,
            error: { code: "invalid_asset", message: "Package asset entry is invalid." }
          };
        }
        var path = asTrimmedString(asset.path);
        if (!path || path.indexOf("..") !== -1 || path.charAt(0) === "/") {
          return {
            ok: false,
            error: { code: "invalid_asset_path", message: "Invalid package asset path." }
          };
        }
        var bytes = asset.bytes;
        if (!(bytes instanceof Uint8Array) && !(typeof Buffer !== "undefined" && Buffer.isBuffer(bytes))) {
          return {
            ok: false,
            error: {
              code: "invalid_asset_bytes",
              message: "Package asset bytes must be a Uint8Array."
            }
          };
        }
        files[path] = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
        entryPaths.push(path);
      }

      if (opts.includeManifest && pkg.metadata && typeof pkg.metadata === "object") {
        var manifestPath = "assets/manifest.json";
        var manifestBody = JSON.stringify(
          {
            metadata: pkg.metadata,
            assets: assets.map(function (a) {
              return {
                path: a.path,
                mime: a.mime,
                brief_id: a.brief_id,
                asset_id: a.asset_id,
                byte_length: a.bytes && a.bytes.length != null ? a.bytes.length : 0
              };
            })
          },
          null,
          2
        );
        files[manifestPath] = fflate.strToU8(manifestBody);
        entryPaths.push(manifestPath);
      }

      var zipped = fflate.zipSync(files, { level: 6 });
      return {
        ok: true,
        bytes: zipped,
        entryPaths: entryPaths
      };
    } catch (err) {
      return {
        ok: false,
        error: {
          code: "zip_failed",
          message: String((err && err.message) || err || "ZIP serialisation failed")
        }
      };
    }
  }

  return {
    serializeLearnerPackageToZip: serializeLearnerPackageToZip,
    buildLearnerPackageZipBasename:
      learnerPackageApi && learnerPackageApi.buildLearnerPackageZipBasename
        ? learnerPackageApi.buildLearnerPackageZipBasename
        : function (pageSlug) {
            var slug = String(pageSlug == null ? "" : pageSlug)
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "");
            return (slug || "learner-page") + "-learner-package.zip";
          }
  };
});
