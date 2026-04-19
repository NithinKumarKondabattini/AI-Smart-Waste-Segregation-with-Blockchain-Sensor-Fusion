import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/AI-Smart-Waste-Segregation-with-Blockchain-Sensor-Fusion/",
  plugins: [react()],
  server: {
    port: 5173,
  },
});
