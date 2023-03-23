const { ipcRenderer } = require('electron');
const troveController = {};

troveController.post = (req, res, next) => {
  const { cacheData } = req.body;
  //send data to the main electron app
  ipcRenderer.send('server-data', cacheData);

  return next();
};
module.exports = troveController;
