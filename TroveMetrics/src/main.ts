import { app, BrowserWindow, ipcMain } from 'electron';
import { createServer } from './server/server'
import fs from 'fs/promises';
import path from 'path';
import { TroveQLPath, defaultData } from './variables';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Security
app.enableSandbox(); // Limits renderer access; this is also the default setting


const createWindow = (): void => {
  // Create the browser window.
  let renderer = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  renderer.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  renderer.webContents.openDevTools();

  //create the server
  createServer(renderer);
  
  // Send initial message when window is ready
  renderer.once('ready-to-show', () => {
    fs.access(path.join(TroveQLPath, 'metrics.json'))
      // read metrics file and send to the renderer
      .then(() => {
        fs.readFile(path.join(TroveQLPath, 'metrics.json'), "utf-8")
          .then(data => JSON.parse(data))
          .then(parsedData => renderer.webContents.send('data:update', parsedData))
          .catch (error => {
            console.log(error)
          })
      })
      // if file doesn't exist yet, make it
      .catch(() => {
        fs.mkdir(TroveQLPath, { recursive: true })
        .then(()=> fs.writeFile(path.join(TroveQLPath, 'metrics.json'), JSON.stringify(defaultData)))
        .then(()=> renderer.webContents.send('data:update', defaultData))
      }).catch(error => console.log(error))
  
  })
}



// IPC Handlers
ipcMain.handle('ping', () => 'pong');

// When electron is ready to do stuff; Some APIs can only be used after this event occurs.
app.on('ready', () => {
  //server;
  createWindow();

});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

// HOWEVER, In our case, closing window wouldn't close server, which is BAD, so close everything
app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
    app.quit();
  // }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

