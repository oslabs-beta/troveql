const { contextBridge, ipcRenderer } = require('electron');

type channelSubList = {
  send: string[];
  receive: string[];
  sendReceive: string[];
};

type channelList = {
  renderer: channelSubList;
};

// Declare any new channels for IPC here
const channels: channelList = {
  renderer: {
    send: ['cache:clear'], // From renderer to main.
    receive: ['data:update'], // From main to renderer.
    sendReceive: ['data:get', 'data:clear'], // From renderer to main and back again.
  },
};

// Expose IPC communication methods to the other windows
contextBridge.exposeInMainWorld('ipcRenderer', {
  ping: () => ipcRenderer.invoke('ping'), // test ping, should ALWAYS work

  // From renderer to main.
  send: (channel: string, args: any) => {
    let validChannels = channels.renderer.send;
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, args);
    }
  },
  // From main to renderer.
  receive: (channel: string, listener: any) => {
    let validChannels = channels.renderer.receive;
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`.
      ipcRenderer.on(channel, (event, ...args: any) => listener(...args));
    }
  },
  // From renderer to main and back again.
  invoke: (channel: string, args: any) => {
    let validChannels = channels.renderer.sendReceive;
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, args);
    }
  },
});
