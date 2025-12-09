const fs = require("fs");
const path = require("path");
const {
  Compilation,
  sources: { RawSource },
  WebpackError,
} = require("webpack");
const createJiti = require("jiti");
const jiti = createJiti(__filename, { moduleCache: false });

const normalizePath = (filePath) =>
  filePath ? filePath.replace(/\\/g, "/") : "";

const VERBOSE = process.env.WEBPACK_VERBOSE === "1";
const log = {
  verbose: (...args) => VERBOSE && console.log("[SectionsSchema]", ...args),
  info: (...args) => console.log("[SectionsSchema]", ...args),
};

module.exports = class SectionsSchemaPlugin {
  sectionsToUpdate = [];

  constructor(options = {}) {
    this.options = options;
    this.normalizedSections = normalizePath(options.sections);
    this.normalizedSchema = normalizePath(options.schema);

    log.verbose("Initialized with paths:", {
      sections: this.normalizedSections,
      schema: this.normalizedSchema,
    });
  }

  walkDirectory(list, directoryPath) {
    const entries = fs.readdirSync(directoryPath);
    for (const entry of entries) {
      if (entry === "schema" || entry.startsWith("_")) continue;
      if (entry.startsWith("[") && entry.endsWith("]")) {
        this.walkDirectory(list, path.join(directoryPath, entry));
        continue;
      }
      const entryPath = path.join(directoryPath, entry);
      const entryStats = fs.statSync(entryPath);
      if (entryStats.isDirectory()) {
        list.push({
          key: entry + ".liquid",
          schema: path.join(entryPath, "schema.ts"),
          template: path.join(entryPath, "template.liquid"),
        });
      } else if (entryStats.isFile()) {
        if (entry.endsWith(".json")) {
          list.push({ key: entry, template: entryPath });
        } else if (entry.endsWith(".liquid")) {
          let schemaPath = path.resolve(
            this.options.schema,
            entry.replace(".liquid", ".ts"),
          );
          if (!fs.existsSync(schemaPath)) {
            schemaPath = schemaPath.replace(".ts", ".js");
          }

          list.push({
            key: entry,
            schema: schemaPath,
            template: entryPath,
          });
        }
      }
    }
  }

  gatherSections() {
    const list = [];
    this.walkDirectory(list, this.options.sections);
    log.verbose(`Found ${list.length} sections`);
    return list;
  }

  /** @param {import("webpack").Compiler} [compiler] */
  apply(compiler) {
    if (!compiler) return;

    const allSections = this.gatherSections();

    this.sectionsToUpdate = allSections;

    compiler.hooks.invalid.tap(SectionsSchemaPlugin.name, (filePath) => {
      // Normalize path separators for cross-platform compatibility
      const normalizedPath = normalizePath(filePath);

      log.verbose("File changed:", normalizedPath);

      if (normalizedPath.includes("shopify/sections")) {
        if (normalizedPath.includes("_schema")) {
          log.verbose("Schema folder changed - rebuilding all sections");
          this.sectionsToUpdate = allSections;
          return;
        }

        if (normalizedPath.includes(this.normalizedSchema)) {
          // Update in schema
          const pathParts = normalizedPath
            .split(this.normalizedSchema)[1]
            .split("/");
          const schemaFile = pathParts[1];
          const key =
            path.basename(schemaFile, path.extname(schemaFile)) + ".liquid";
          const matchingSection = allSections.find((s) => s.key === key);

          log.verbose(
            `Schema file changed: ${schemaFile} -> ${key}`,
            matchingSection ? "✓" : "✗",
          );

          this.sectionsToUpdate =
            matchingSection ? [matchingSection] : allSections;
        } else {
          // Update in section
          const pathParts = normalizedPath
            .split(this.normalizedSections)[1]
            .split("/");
          const sectionName = pathParts[1];

          if (path.extname(sectionName) === "") {
            // Folder schema
            const key = sectionName + ".liquid";
            this.sectionsToUpdate = allSections.filter((s) => s.key === key);
            log.verbose(`Folder section: ${sectionName} -> ${key}`);
          } else {
            // File
            this.sectionsToUpdate = allSections.filter(
              (s) => s.key === sectionName,
            );
            log.verbose(`File section: ${sectionName}`);
          }
        }

        if (this.sectionsToUpdate.length > 0) {
          log.verbose(
            `Will rebuild: ${this.sectionsToUpdate.map((s) => s.key).join(", ")}`,
          );
        }
        return;
      }
      this.sectionsToUpdate = [];
    });

    compiler.hooks.thisCompilation.tap(
      SectionsSchemaPlugin.name,
      (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: SectionsSchemaPlugin.name,
            stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          },
          () => {
            const preTransformCache = [...Object.keys(require.cache)];

            log.verbose(
              `Processing ${this.sectionsToUpdate.length} section(s)`,
            );

            for (const section of this.sectionsToUpdate) {
              const outputKey = `sections/${section.key}`;
              try {
                const source = this.getSchemaSource(section);
                if (!source) {
                  log.info(`Skipped section output: ${outputKey}`);
                  continue;
                }

                // Add to assets.
                const asset = compilation.getAsset(outputKey);
                if (asset) {
                  compilation.updateAsset(outputKey, source);
                  log.verbose(`Updated: ${outputKey}`);
                } else {
                  compilation.emitAsset(outputKey, source);
                  log.verbose(`Emitted: ${outputKey}`);
                }
              } catch (error) {
                log.info(`Error: ${outputKey} - ${error.message}`);
                compilation.errors.push(
                  new WebpackError(`${outputKey}\n${error.message}`),
                );
              }
            }

            // Clear require cache for newly loaded modules
            const modulesToClear = Object.keys(require.cache).filter(
              (module) => !preTransformCache.includes(module),
            );

            if (modulesToClear.length > 0) {
              log.verbose(`Cleared ${modulesToClear.length} cached module(s)`);
              modulesToClear.forEach((module) => {
                delete require.cache[module];
              });
            }
          },
        );
      },
    );
  }

  getSchemaSource(section) {
    let templateContent = "";
    if (fs.existsSync(section.template)) {
      templateContent = fs.readFileSync(section.template, "utf-8");
    }
    if (section.key.endsWith(".json")) {
      return new RawSource(templateContent);
    }

    if (!section.schema || !fs.existsSync(section.schema)) {
      return new RawSource(templateContent);
    }

    let schema = jiti(section.schema);
    if (schema.default) {
      schema = schema.default;
    }

    if (typeof schema !== "object") {
      throw new Error(`
        ${schema}
        ^
        Schema expected to be of type "object"
        in ${require.resolve(section.schema)}
      `);
    }

    return new RawSource(
      templateContent +
        `\n\n{% schema %}\n${JSON.stringify(schema, null, 2)}\n{% endschema %}`,
    );
  }
};
