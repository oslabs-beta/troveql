const { ipcRenderer } = require('electron');
const troveController = {};

troveController.post = (req, res, next) => {
  const { cacheData } = req.body;
  // Send data to the main process
  ipcRenderer.send('cache-data', cacheData);
  return next();
};

module.exports = troveController;