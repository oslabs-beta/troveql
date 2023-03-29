// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')

type channelSubList = {
  send: string[],
  receive: string[],
  sendReceive: string[]
}

type channelList = {
  frontend: channelSubList,
  server: channelSubList,
}

// Declare any new channels for IPC here
const channels: channelList = {
  frontend: { 
    send: [], // From frontend to main.
    receive: ['data:update', 'data:intialize'], // From main to frontend.
    sendReceive: [], // From frontend to main and back again.
  },
  server: { 
    send: ['data:update'], // From server to main.
    receive: [], // From main to server.
    sendReceive: [] // From server to main and back again.
  }
}

// Expose IPC communication methods to the other windows
contextBridge.exposeInMainWorld('ipcRenderer', {

  ping: () => ipcRenderer.invoke('ping'), // test ping, should ALWAYS work
  
  // From frontend/server to main.
  send: (channel: string, args: any) => {
      let validChannels = channels.frontend.send.concat(channels.server.send);
      if (validChannels.includes(channel)) {
          ipcRenderer.send(channel, args);
      }
  },
  // From main to frontend/server.
  receive: (channel: string, listener: any) => {
      let validChannels = channels.frontend.receive.concat(channels.server.receive);
      if (validChannels.includes(channel)) {
          // Deliberately strip event as it includes `sender`.
          ipcRenderer.on(channel, (event, ...args: any) => listener(...args));
      }
  },
  // From frontend/server to main and back again.
  invoke: (channel: string, args: any) => {
      let validChannels = channels.frontend.sendReceive.concat(channels.server.sendReceive);
      if (validChannels.includes(channel)) {
          return ipcRenderer.invoke(channel, args);
      }
  },

})