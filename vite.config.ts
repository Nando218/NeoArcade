
// This is a dummy TypeScript file to satisfy the tsconfig.node.json configuration
// The actual configuration is in vite.config.js

import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  // This file is not used - see vite.config.js for actual configuration
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
