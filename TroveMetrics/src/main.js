
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
// const server = require('../server/server');
// const { createServer } = require('../server/server');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let frontend;

const createWindow = () => {
  // Create the browser window.
  const frontend = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  frontend.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.

  frontend.webContents.openDevTools();

  //createServer();

  const server = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      //preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  server.loadFile(path.join(__dirname, '../server/serverIndex.html'));
  //server.loadURL(path.join(`file://${__dirname}`, '../server/serverIndex.html'))

  // Open the DevTools.
  server.webContents.openDevTools();
};

// IPC Handlers

ipcMain.handle('ping', () => 'pong');

ipcMain.on('data:update', (event, data) => {
  console.log(data);
  frontend.webContents.send('data:update', data);
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  //server;
  createWindow();
  //listen for Cache data
  ipcMain.on('server-data', (event, cacheData) => {
    console.log('CACHE DATA IN Main.js', cacheData); // Do something with the cache data received
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
