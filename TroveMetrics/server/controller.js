const { ipcRenderer } = require('electron');
const troveController = {};

troveController.post = (req, res) => {
  const { cacheData } = req.body;
  console.log('CacheData in inTroveController.post" ', cacheData);

  ipcRenderer.send('server-data', cacheData);

  return next();
};
module.exports = troveController;
