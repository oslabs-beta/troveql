const { ipcRenderer } = require('electron');
const troveController = {};

troveController.post = (req, res, next) => {
  const { cacheData } = req.body;
  console.log('cacheData in troveController.post()', cacheData);
  // Send data to the main process
  window.ipcRenderer.send('data:update', { text: 'hello' });
  // ipcRenderer.sendTo('cache-data', cacheData);
  return next();
};

module.exports = troveController;
