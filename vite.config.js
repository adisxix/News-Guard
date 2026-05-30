import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function apiMiddleware() {
  let analyzeModulePromise;

  const getAnalyzeHandler = async () => {
    analyzeModulePromise ||= import("./api/analyze.js");
    const module = await analyzeModulePromise;
    return module.default;
  };

  return {
    name: "dev-api-middleware",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || req.method !== "POST") return next();

        if (req.url === "/api/analyze") {
          const analyzeHandler = await getAnalyzeHandler();
          return analyzeHandler(req, res);
        }

        return next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  process.env.VITE_GEMINI_API_KEY = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

  return {
    plugins: [react(), tailwindcss(), apiMiddleware()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
