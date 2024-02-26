import { createRequestHandler } from "@remix-run/express";
import { type ServerBuild, installGlobals } from "@remix-run/node";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { csrfProtection } from "./csrf-protection.js";
import { validateRequest } from "./validate-request.js";
import { getLocaleData, getLocaleFromRequest } from "~/locales/index.js";

installGlobals();

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const remixHandler = createRequestHandler({
  build: (viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
    : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore this should exist before running the server
      // but it may not exist just yet.
      // eslint-disable-next-line import/no-unresolved
      await import("../build/server/index.js")) as unknown as ServerBuild,
  getLoadContext: async (request, response) => {
    const { session, user } = await validateRequest(request, response);
    const lang = getLocaleFromRequest(request);
    const t = await getLocaleData(request);
    return { session, user, t, lang };
  },
  mode: process.env.NODE_ENV,
});

const app = express();

app.use(csrfProtection);

app.set("trust proxy", true);

app.use((req, res, next) => {
  const routes = ["/login", "/register", "/reset-password", "/welcome"];
  if (
    req.method !== "GET" &&
    req.method !== "HEAD" &&
    routes.some((route) => req.path.includes(route))
  ) {
    const limiter = rateLimit({
      windowMs: 15 * 1000,
      limit: 25,
      standardHeaders: true,
      legacyHeaders: false,
    });

    return limiter(req, res, next);
  }

  next();
});

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));

app.use(morgan("tiny"));

// handle SSR requests
app.all("*", remixHandler);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}`)
);
