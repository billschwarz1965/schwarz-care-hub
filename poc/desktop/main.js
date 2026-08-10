const { app, BrowserWindow, protocol, net, Menu, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const url = require("url");

const WWW = path.join(__dirname, "www");

let mainWindow;

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

protocol.registerSchemesAsPrivileged([
  {
    scheme: "medverse",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

function navigateTo(page) {
  mainWindow.loadURL(`medverse://app/${page}`);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: "MedVerse",
    icon: path.join(__dirname, "icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
    backgroundColor: "#0a0a14",
  });

  navigateTo("demo.html");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const template = [
    {
      label: "MedVerse",
      submenu: [
        { label: "Master Demo", click: () => navigateTo("demo.html") },
        { type: "separator" },
        { label: "MSL Copilot", click: () => navigateTo("msl-copilot.html") },
        {
          label: "Medical Concierge",
          click: () => navigateTo("medical.html"),
        },
        { label: "HCP Concierge", click: () => navigateTo("concierge.html") },
        {
          label: "Patient Concierge",
          click: () => navigateTo("patient.html"),
        },
        { type: "separator" },
        {
          label: "Orion Intelligence",
          click: () => navigateTo("orion.html"),
        },
        {
          label: "Disease Navigator",
          click: () => navigateTo("disease.html"),
        },
        {
          label: "Literature Intelligence",
          click: () => navigateTo("literature.html"),
        },
        {
          label: "Congress Intelligence",
          click: () => navigateTo("congress.html"),
        },
        {
          label: "Agent Ecosystem",
          click: () => navigateTo("agents.html"),
        },
        { type: "separator" },
        {
          label: "Power Agents",
          click: () => navigateTo("system-tools.html"),
        },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
        { type: "separator" },
        { role: "toggleDevTools" },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About MedVerse",
          click: () => {
            const { dialog } = require("electron");
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "About MedVerse",
              message: "MedVerse v0.4",
              detail:
                "Scientific Intelligence Ecosystem — connecting MSLs, HCPs, patients, and medical affairs through intelligent agents, real-time data, and automated governance.\n\nPresented by Bill Schwarz\nDigital Product Line & Program Owner\n\n© 2025 Sanofi",
            });
          },
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  mainWindow.webContents.setWindowOpenHandler(({ url: targetUrl }) => {
    if (targetUrl.startsWith("http")) {
      shell.openExternal(targetUrl);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  mainWindow.webContents.on("will-navigate", (event, navUrl) => {
    if (navUrl.startsWith("medverse://")) return;
    const parsed = new URL(navUrl);
    if (parsed.protocol === "file:") {
      event.preventDefault();
      const relative = parsed.pathname.replace(/^\//, "");
      navigateTo(relative + (parsed.hash || ""));
    }
  });
}

app.on("ready", () => {
  protocol.handle("medverse", (request) => {
    const parsed = new URL(request.url);
    let filePath = decodeURIComponent(parsed.pathname);
    if (filePath === "/" || filePath === "") filePath = "/demo.html";
    filePath = filePath.replace(/^\/+/, "");

    const fullPath = path.join(WWW, filePath);
    const ext = path.extname(fullPath).toLowerCase();
    const mimeType = MIME[ext] || "application/octet-stream";

    try {
      const data = fs.readFileSync(fullPath);
      return new Response(data, {
        headers: { "Content-Type": mimeType },
      });
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  });

  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (!mainWindow) createWindow();
});
