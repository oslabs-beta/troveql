// NEED TO IMPLEMENT A BUNDLER TO ALLOW MODULES
import func from './test.js'
import styles from './index.css'

func();
const pingTest = async () => {

  const response = await window.ipcRenderer.ping();
  console.log(response); // should print out 'pong'
};
pingTest();

window.ipcRenderer.receive('data:update', (data) => console.log(data));
