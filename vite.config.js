import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: [
        "drmax-logo.svg",
        "icons/icon-192.svg",
        "icons/icon-512.svg",
      ],
      manifest: {
        name: "ShiftPay — track shifts",
        short_name: "ShiftPay",
        start_url: "/ShiftPayReact/",
        scope: "/ShiftPayReact/",
        display: "standalone",
        background_color: "#020617",
        theme_color: "#22c55e",
        icons: [
          {
            src: "icons/icon-192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "icons/icon-512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  base: "/ShiftPayReact/",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.js",
  },
});
