import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~/component": path.resolve(__dirname, "./src/Components"),
      "~/context": path.resolve(__dirname, "./src/Context"),
      "~/store": path.resolve(__dirname, "./src/Store"),
      "~/utils": path.resolve(__dirname, "./src/Utils"),
      "~/interface": path.resolve(__dirname, "./src/Interface"),
      "~/src": path.resolve(__dirname, "./src"),
    },
  },
});
