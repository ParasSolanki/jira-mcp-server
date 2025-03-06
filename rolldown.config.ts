import { defineConfig } from "rolldown";
import { minify } from "rollup-plugin-swc3";

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
  ],
});
