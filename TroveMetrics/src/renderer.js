// NEED TO IMPLEMENT A BUNDLER TO ALLOW MODULES

const pingTest = async () => {
  const response = await window.ipcRenderer.ping();
  console.log(response); // should print out 'pong'
};
pingTest();

window.ipcRenderer.receive('data:update', (data) => console.log(data));
