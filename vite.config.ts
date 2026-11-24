import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "app",
  publicDir: "../public",
  plugins: [react()],
  // Relative assets work both at the Pages root and under the committed /docs folder.
  base: process.env.VITE_BASE ?? "./",
  build: {
    outDir: "../docs",
    emptyOutDir: true,
    sourcemap: false,
  },
});
