// MedVerse local launcher — serves launcher.html and can start each edition's
// Vite dev server on demand. Plain HTML can't spawn processes; this is the
// small companion server that makes the "Start Server" buttons work.
//
// Run:   node launcher-server.mjs
// Open:  http://localhost:5199
//
// Opening launcher.html directly as a file:// page still works for viewing
// and linking to servers you started yourself — it just can't start them.

import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { createConnection } from "node:net";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTROL_PORT = 5199;

const EDITIONS = [
  { id: "poc", dir: "poc", port: 5180 },
  { id: "poc-external", dir: "poc-external", port: 5182 },
  { id: "poc-agents", dir: "poc-agents", port: 5183 },
  { id: "poc-internal", dir: "poc-internal", port: 5184 },
  { id: "poc-patient", dir: "poc-patient", port: 5185 },
];

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = createConnection({ port, host: "127.0.0.1" });
    const done = (result) => { socket.destroy(); resolve(result); };
    socket.setTimeout(400);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));
  });
}

async function statusSnapshot() {
  const entries = await Promise.all(
    EDITIONS.map(async (e) => [e.id, await isPortOpen(e.port)])
  );
  return Object.fromEntries(entries);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${CONTROL_PORT}`);

  if (url.pathname === "/" && req.method === "GET") {
    const htmlPath = path.join(__dirname, "launcher.html");
    if (!existsSync(htmlPath)) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("launcher.html not found next to launcher-server.mjs");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(readFileSync(htmlPath, "utf8"));
    return;
  }

  if (url.pathname === "/api/status" && req.method === "GET") {
    const status = await statusSnapshot();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(status));
    return;
  }

  if (url.pathname.startsWith("/api/start/") && req.method === "POST") {
    const id = url.pathname.slice("/api/start/".length);
    const edition = EDITIONS.find((e) => e.id === id);
    if (!edition) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "unknown edition: " + id }));
      return;
    }

    if (await isPortOpen(edition.port)) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "already-running" }));
      return;
    }

    const cwd = path.join(__dirname, edition.dir);
    if (!existsSync(cwd)) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "missing directory: " + edition.dir }));
      return;
    }

    console.log(`[launcher] starting ${edition.id} in ${cwd} ...`);
    const child = spawn("npm", ["run", "dev"], {
      cwd,
      shell: true,
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    });
    child.unref();

    res.writeHead(202, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "starting" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(CONTROL_PORT, () => {
  console.log(`MedVerse launcher — http://localhost:${CONTROL_PORT}`);
  console.log("Ctrl+C to stop the launcher (dev servers you start keep running independently).");
});
