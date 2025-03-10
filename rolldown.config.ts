import { defineConfig } from "rolldown";
import { minify } from "rollup-plugin-swc3";
import * as fs from "fs";
import * as path from "path";
import type { Plugin, NormalizedOutputOptions, OutputBundle } from "rolldown";

export default defineConfig({
  input: "src/app.ts",
  platform: "node",
  treeshake: true,
  output: {
    file: "dist/app.js",
  },
  plugins: [
    minify({
      module: true,
      mangle: {},
      compress: {},
    }),
    chmodPlugin(0o755), // Add the chmod plugin to make the output file executable,
  ],
});

/**
 * Creates a plugin that changes the chmod permissions of output files
 * @param mode The file mode to set (e.g. 0o755 for executable)
 * @returns A Rolldown plugin
 */
function chmodPlugin(mode: number): Plugin {
  return {
    name: "chmod",
    writeBundle(outputOptions: NormalizedOutputOptions, bundle: OutputBundle) {
      const outputFile =
        outputOptions.file ||
        (outputOptions.dir && typeof outputOptions.entryFileNames === "string"
          ? path.join(outputOptions.dir, outputOptions.entryFileNames)
          : null);

      if (outputFile) {
        // Make sure the file exists before changing permissions
        if (fs.existsSync(outputFile)) {
          try {
            fs.chmodSync(outputFile, mode);
            console.log(
              `Changed permissions of ${outputFile} to ${mode.toString(8)}`,
            );
          } catch (error) {
            console.error(
              `Failed to change permissions of ${outputFile}:`,
              error,
            );
          }
        } else {
          console.warn(
            `Output file ${outputFile} does not exist, cannot change permissions`,
          );
        }
      } else {
        // If we don't have a direct file path, try to find files in the bundle
        const bundleFiles = Object.keys(bundle);
        if (bundleFiles.length > 0 && outputOptions.dir) {
          for (const fileName of bundleFiles) {
            const filePath = path.join(outputOptions.dir, fileName);
            if (fs.existsSync(filePath)) {
              try {
                fs.chmodSync(filePath, mode);
                console.log(
                  `Changed permissions of ${filePath} to ${mode.toString(8)}`,
                );
              } catch (error) {
                console.error(
                  `Failed to change permissions of ${filePath}:`,
                  error,
                );
              }
            }
          }
        } else {
          console.warn(
            "No output files found in the bundle, cannot change permissions",
          );
        }
      }
    },
  };
}
