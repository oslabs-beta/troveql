import { app, BrowserWindow, ipcMain } from 'electron';
import { createServer } from './server/server';
import fs from 'fs/promises';
import path from 'path';
import { TroveQLPath, defaultData } from './variables';

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Security
app.enableSandbox(); // Limits renderer access; this is also the default setting

const createWindow = (): void => {
  // Create the browser window
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

  // Open the DevTools
  renderer.webContents.openDevTools();

  // Create the server
  createServer(renderer);
};

// IPC Handlers
ipcMain.handle('ping', () => 'pong');

ipcMain.handle('data:get', async () => {
  const filePath = path.join(TroveQLPath, 'metrics.json');

  try {
    // Attempt to access file, and return either the file or default data
    await fs.access(filePath);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Unable to find metrics.json file: ', error);
    console.log('Creating new metrics.json file...');

    await fs.mkdir(TroveQLPath, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(defaultData));

    return defaultData;
  }
});

ipcMain.handle('data:clear', async () => {
  const filePath = path.join(TroveQLPath, 'metrics.json');
  await fs.writeFile(filePath, JSON.stringify(defaultData));
  return defaultData;
});

ipcMain.on('cache:clear', async () => {
  try {
    const response = await fetch('http://localhost:4000/trovemetrics', {
      method: 'POST',
      body: JSON.stringify({ clearCache: true }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
  } catch (error) {
    console.log('Error in ipcMain.handle for cache:clear: ', error);
  }
});

// When electron is ready to do stuff; Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

// HOWEVER, In our case, closing window wouldn't close server, which is BAD, so close everything
app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
