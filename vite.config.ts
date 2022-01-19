import { defineConfig } from "vite";
import path from "path";
import typescript from "@rollup/plugin-typescript";

const resolvePath = (str: string) => path.resolve(__dirname, str);

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: (format) => (format === "cjs" ? "index.js" : `index.${format}.js`),
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["immer", "zustand"],
    },
    minify: "esbuild",
  },
  plugins: [
    typescript({
      target: "es2020",
      rootDir: resolvePath("./src"),
      declaration: true,
      declarationDir: resolvePath("./dist"),
      exclude: resolvePath("./node_modules/**"),
      allowSyntheticDefaultImports: true,
    }),
  ],
});
