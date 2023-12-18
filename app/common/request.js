const axios = require('axios');
const { transcoding } = require(global.prefixPath + '/common/tool');
const Logger = require(global.prefixPath + '/common/logger');

const instance = axios.create({
  timeout: 5000
});

instance.interceptors.response.use(
  null,
  function (err) {

  const { code, config, message } = err;
  if (code === 'ECONNABORTED' || message === 'Network Error') {
    // 请求超时
    config.__timeoutNum = typeof config.__timeoutNum === 'number'
      ? config.__timeoutNum + 1
      : 1;
    Logger('request').warn(`[Timeout] ${config.url}`);

    if (config.__timeoutNum > 3) {
      return Promise.reject(err);
    } else {
      return new Promise(resolve => {
        setTimeout(async () => {
          resolve(await instance.request(config))
        }, 1000);
      })
    }
  }
});

module.exports = async (config, charset='utf-8') => {
  const isUTF = charset.includes('utf');
  const conf = isUTF ? config : Object.assign({}, config, {
    responseType: 'stream'
  });
  const result = await instance(conf);
  if (isUTF) {
    return result.data;
  }

  const decodResult = await transcoding(charset, result.data).catch(() => {
    Logger('request').error(`[Transcoding] ${charset}-${config.url}`);
    return false;
  });

  return decodResult;
};
