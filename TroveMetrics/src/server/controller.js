const { renderer, ipcMain } = require('../main.js');
const troveController = {};

troveController.post = function(req, res, next) {
  const { cacheData } = req.body;
  //console.log('cacheData in troveController.post()', cacheData);
  // Send data to the main process
  console.log('RENDERER IN CONTROLLER', renderer)
  //renderer.webContents.send('data:update', { text: 'hello' });
  return next();
};

module.exports = troveController;
