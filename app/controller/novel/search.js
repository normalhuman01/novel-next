const {
  Result,
  Redis,
  Dom,
  Request,
  WS,
  Logger
} = require(global.prefixPath + '/common');
const { origin } = require(global.prefixPath + '/config');

async function search(name, origins, socketId) {
  if (name == '' || origins.length < 1) {
    return Result.fail('参数错误');
  }

  // redis 缓存
  const redisCache = await Redis.get('data', `search-${name}`);
  if (redisCache) {
    return Result.success(JSON.parse(String(redisCache)));
  }

  const searchData = await iterationOrigins(name, origins, socketId);
  await Redis.set(
    'data',
    `search-${name}`,
    JSON.stringify(searchData),
    60 * 60 * 24
  );

  return Result.success(searchData);
}

async function iterationOrigins(name, origins, socketId) {
  function generatePromise(key) {
    const currentOrigin = origin[key];
    return currentOrigin && currentOrigin.status
      ? searchOrigin(name, currentOrigin, socketId)
      : (
        emitMsg(socketId, 0),
        Logger('error').warn(`[origin] 无来源${key}`),
        Promise.reject({key, message: '无该来源'})
      );
  }

  return Promise.allSettled(
    origins.map(generatePromise)
  ).then(sResult => sResult.reduce((p, c) => {
      c.status === 'fulfilled'
        ? p.success.push(...c.value)
        : p.fail.push(c.reason);
      return p;
    }, {
      success: [],
      fail: []
    })
  )
}

async function searchOrigin(name, origin, socketId) {
  const dom = new Dom(origin);
  const sHref = dom.getSearchUrl(name);

  const htmlResult = await Request({
    method: dom.getItem('type', 'GET'),
    url: sHref,
  }, dom.searchPageCode);

  if (htmlResult === false) {
    emitMsg(socketId, 0);
    return Promise.reject({message: '请求错误'})
  }

  const list = dom.getSearchList(htmlResult);

  emitMsg(socketId, 1);

  return list;
}

function emitMsg(id, flag) {
  if (!id) return;
  WS.emit('searchResult', flag, id);
}

module.exports = search;
