

const {
  sources: { ConcatSource },
  Compilation,
} = require("webpack");
const { extname } = require("path");

const fileComments = {
  noticeText: `
 * ------------------------------------------------------------
 * IMPORTANT: The contents of this file are auto-updated.
 *
 * Please exercise caution as any changes made to this file
 * may be overwritten.
 *
 * Contact Miguel miguel-chitta@hotmail.com
 * if you need to modify this file.
 * ------------------------------------------------------------
`,
  ".liquid": () => `{% comment %}${fileComments.noticeText}{% endcomment %}\n`,
};

class DoNotEditNoticePlugin {
  /** @param {import("webpack").Compiler} [compiler] */
  apply(compiler) {
    if (!compiler) return;
    if (compiler.options.mode !== "production") return;

    compiler.hooks.thisCompilation.tap(
      DoNotEditNoticePlugin.name,
      (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: DoNotEditNoticePlugin.name,
            stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
          },
          (assets) => {
            for (const file of Object.keys(assets)) {
              compilation.updateAsset(file, (old) => {
                const getComment = fileComments[extname(file)];
                return typeof getComment === "function"
                  ? new ConcatSource(getComment(), "\n", old)
                  : old;
              });
            }
          },
        );
      },
    );
  }
}

module.exports = DoNotEditNoticePlugin;
