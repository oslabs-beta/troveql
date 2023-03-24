const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
//const { createServer } = require('./server/server');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let renderer;

const createWindow = () => {
  // Create the browser window.
  renderer = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      //preload: path.join(__dirname, 'preload.js'),
      //nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  //renderer.loadFile(path.join(__dirname, './renderer/index.html'));
  renderer.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  // Open the DevTools.

  renderer.webContents.openDevTools();

  //create the server
  createServer();
  
  renderer.webContents.on('did-finish-load', () => {
    module.exports = { renderer };
  })
  
};

// IPC Handlers
ipcMain.handle('ping', () => 'pong');

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

//THIS IS ALL BULLSHIT

const troveController = {};

troveController.post = function(req, res, next) {
  const { cacheData } = req.body;
  //console.log('cacheData in troveController.post()', cacheData);
  // Send data to the main process
  renderer.webContents.send('data:update', { text: 'hello' });
  return next();
};

const express = require('express');
const app2 = express();
//const troveController = require('./controller');


const createServer = function() {
  const port = 3333;
  app2.use(express.json());

  app2.post('/api', troveController.post, (req, res) => {
    res.status(200).send('worked :D');
  });

  app2.listen(port, () => {
    console.log(`listening on port: ${port}`);
  });
};

