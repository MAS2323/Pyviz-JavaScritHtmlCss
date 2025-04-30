import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    CESIUM_BASE_URL: JSON.stringify("node_modules/cesium/Build/Cesium"),
  },
  server: {
    host: "0.0.0.0",
  },
});
