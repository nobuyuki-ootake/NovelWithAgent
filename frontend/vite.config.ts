import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
  },
  server: {
    port: 5173,
    host: "localhost",
    open: true,
    historyApiFallback: true,
  },
});
