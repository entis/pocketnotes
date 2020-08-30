const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

require("../src/db/main");

let mainWindow;

function createWindow() {
   mainWindow = new BrowserWindow({
      width: 1400,
      height: 860,
      webPreferences: {
         nodeIntegration: true
      },
   });

   mainWindow.loadURL(
      isDev
         ? "http://localhost:3000"
         : `file://${path.join(__dirname, "../build/index.html")}`
   );

   if (isDev) {
      mainWindow.webContents.on('crashed', (error) => { console.log(error); });
      mainWindow.webContents.openDevTools();
   }

   mainWindow.on("closed", () => {
      mainWindow = null;
   });
}

app.on("ready", createWindow);

if (isDev) {
   app.on("unresponsive", (error) => {
      console.log(error);
   });

   app.on("uncaughtException", (error) => {
      console.log(error);
   });
}

app.on("window-all-closed", () => {
   if (process.platform !== "darwin") {
      app.quit();
   }
});

app.on("activate", () => {
   if (mainWindow === null) {
      createWindow();
   }
});
