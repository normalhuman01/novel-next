const novel = require(global.prefixPath + '/routes/novel');
const page = require(global.prefixPath + '/routes/page');

module.exports = (app) => {
  app.use('/novel', novel);
  app.use('/', page);
}
