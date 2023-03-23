// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('channel', {

  sendNewCacheData: (data) => ipcRenderer.send('send-new-cache-data', data),
  receiveNewCacheData: (listener) => ipcRenderer.on('receive-new-cache-data', (event, ...data) => listener(...data))
  // we can also expose variables, not just functions
})