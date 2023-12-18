const log4js = require('log4js');

log4js.configure({
  replaceConsole: true,
  pm2: true,
  appenders: {
    request: { // 请求日志
      type: 'dateFile',
      filename: 'logs/request/req',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    error: {  //错误日志
      type: 'dateFile',
      filename: 'logs/error/err',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    redis: {  //redis日志
      type: 'dateFile',
      filename: 'logs/redis/red',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    other: {  //其他日志
      type: 'dateFile',
      filename: 'logs/other/oth',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    }
  },
  categories: {
    default: { appenders: ['request'], level: 'warn' },
    other: { appenders: ['other'], level: 'info' },
    error: { appenders: ['error'], level: 'error' },
    redis: { appenders: ['redis'], level: 'fatal' },
  }
});

//name取categories项
module.exports = function (name) {
  return log4js.getLogger(name || 'default')
};
