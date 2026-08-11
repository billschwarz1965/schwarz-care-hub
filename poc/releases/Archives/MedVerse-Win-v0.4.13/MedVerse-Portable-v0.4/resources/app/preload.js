const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("medverse", {
  platform: process.platform,
  version: "0.4.0",
});
