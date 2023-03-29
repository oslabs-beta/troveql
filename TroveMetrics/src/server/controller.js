const { ipcRenderer } = require('electron');
const troveController = {};

troveController.post = (req, res, next) => {
  const { cacheData } = req.body;
  console.log('cacheData in troveController.post()', cacheData);
  res.locals.data = cacheData;
  return next();
};

module.exports = troveController;
