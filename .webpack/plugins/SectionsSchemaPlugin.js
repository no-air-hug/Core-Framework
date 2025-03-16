const fs = require("fs");
const path = require("path");
const {
  Compilation,
  sources: { RawSource },
  WebpackError,
} = require("webpack");
const createJiti = require("jiti");
const jiti = createJiti(__filename, { moduleCache: false });

module.exports = class SectionsSchemaPlugin {
  sectionsToUpdate = [];

  constructor(options = {}) {
    this.options = options;
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
          schema: entryPath + "/schema.ts",
          template: entryPath + "/template.liquid",
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
    return list;
  }

  /** @param {import("webpack").Compiler} [compiler] */
  apply(compiler) {
    if (!compiler) return;

    const allSections = this.gatherSections();

    this.sectionsToUpdate = allSections;

    compiler.hooks.invalid.tap(SectionsSchemaPlugin.name, (filePath) => {
      if (filePath?.includes("shopify/sections")) {
        if (filePath.includes("_schema")) {
          // Update in schema
          this.sectionsToUpdate = allSections;
          return;
        }
        if (filePath.includes(this.options.schema)) {
          // Update in schema
          const schemaFile = filePath
            .split(this.options.schema)[1]
            .split("/")[1];
          const key =
            path.basename(schemaFile, path.extname(schemaFile)) + ".liquid";
          const matchingSection = allSections.find((s) => s.key === key);
          this.sectionsToUpdate =
            matchingSection ? [matchingSection] : allSections;
        } else {
          // Update in section
          const sectionName = filePath
            .split(this.options.sections)[1]
            .split("/")[1];

          if (path.extname(sectionName) === "") {
            // Folder schema
            const key = sectionName + ".liquid";
            this.sectionsToUpdate = allSections.filter((s) => {
              return s.key === key;
            });
          } else {
            // File
            this.sectionsToUpdate = allSections.filter(
              (s) => s.key === sectionName,
            );
          }
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

            for (const section of this.sectionsToUpdate) {
              const outputKey = `sections/${section.key}`;
              try {
                const source = this.getSchemaSource(section);
                if (!source) {
                  console.log(`Skipped section output: ${outputKey}`);
                  continue;
                }

                // Add to assets.
                const asset = compilation.getAsset(outputKey);
                if (asset) {
                  compilation.updateAsset(outputKey, source);
                } else {
                  compilation.emitAsset(outputKey, source);
                }
              } catch (error) {
                compilation.errors.push(
                  new WebpackError(`${outputKey}\n${error.message}`),
                );
              }
            }

            Object.keys(require.cache)
              .filter((module) => !preTransformCache.includes(module))
              .forEach((module) => {
                delete require.cache[module];
              });
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
