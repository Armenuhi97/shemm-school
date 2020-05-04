import { app, BrowserWindow, ipcMain, remote } from "electron";
import * as path from "path";
import * as url from "url";
import * as fs from "fs";

// const { dialog } = require('electron')
let { dialog } = remote
console.log('open',dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }))

let win: BrowserWindow;

app.on("ready", createWindow);
app.allowRendererProcessReuse = true;

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});



function createWindow() {
    console.log(path.join(__dirname, '../../'))

  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true }
  });

  win.loadURL('http://localhost:4200/')

  // win.loadURL(
  //   url.format({
  //     pathname: path.join(__dirname, `/../../dist/shemm-school/index.html`),
  //     protocol: "file:",
  //     slashes: true
  //   })
  // );

  win.webContents.openDevTools();

  win.on("closed", () => {
    win = null;
  });
  // window.win = win
}


ipcMain.on("getFiles", (event, arg) => {
  const files = fs.readdirSync(__dirname);
  win.webContents.send("getFilesResponse", files);
});