import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "app",
  publicDir: "../public",
  plugins: [react()],
  base: process.env.VITE_BASE ?? "/finalproject/",
  build: {
    outDir: "../docs",
    emptyOutDir: true,
    sourcemap: false,
  },
});
