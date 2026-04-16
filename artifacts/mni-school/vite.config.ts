import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(async ({ command }) => {
  const isServe = command === "serve";
  const isProduction = process.env.NODE_ENV === "production";

  // Safe defaults
  const port = Number(process.env.PORT) || 5173;
  const basePath = process.env.BASE_PATH || "/";

  return {
    base: basePath,

    plugins: [
      react(),
      tailwindcss(),
      runtimeErrorOverlay(),

      ...(!isProduction && process.env.REPL_ID !== undefined
        ? [
            (
              await import("@replit/vite-plugin-cartographer")
            ).cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ]
        : []),
    ],

    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
        "@assets": path.resolve(
          import.meta.dirname,
          "..",
          "..",
          "attached_assets"
        ),
      },
      dedupe: ["react", "react-dom"],
    },

    root: path.resolve(import.meta.dirname),

    build: {
      outDir: path.resolve(
        import.meta.dirname,
        "dist/public"
      ),
      emptyOutDir: true,
    },

    server: isServe
      ? {
          port,
          host: "0.0.0.0",
          allowedHosts: true,
          fs: {
            strict: true,
            deny: ["**/.*"],
          },
        }
      : undefined,

    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});
