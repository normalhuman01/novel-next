const {
  Result,
  Redis,
  Dom,
  Request,
  WS
} = require(global.prefixPath + '/common');
const { origin } = require(global.prefixPath + '/config');

async function chapter(url, originKey, socketId) {
  emitMsg(socketId, '正在解析参数...');

  if(!url) {
    return Result.fail('错误的地址');
  }

  if (!origin.hasOwnProperty(originKey)) {
    emitMsg(socketId, '错误的来源', 'processError');
    return Result.fail('错误的来源');
  }

  const cacheData = await Redis.get('data', 'book-chapter-' + url);
  if (cacheData) {
    emitMsg(socketId, '检测到缓存数据...');
    const data = Object.assign(
      JSON.parse(String(cacheData)),
      { cache: true }
    );
    emitMsg(socketId, '提取缓存', 'processSuccess');
    return Result.success(data);
  }

  const data = await getBookChapter(url, origin[originKey], socketId).catch(() => false);

  if (data === false) {
    return Result.fail('系统错误');
  }

  await Redis.set(
    'data',
    `book-chapter-${url}`,
    JSON.stringify(data),
    60 * 10
  );

  return Result.success(data);
}

async function getBookChapter(url, currentOrigin, socketId) {
  const dom = new Dom(currentOrigin);
  dom.setData('url', url);

  if (!dom.isOriginUrl(url)) {
    emitMsg(socketId, '无效地址', 'processError');
    return Result.fail('无效地址');
  }

  emitMsg(socketId, '正在获取页面...');

  const htmlResult = await Request({
    method: 'GET',
    url,
  }, dom.searchPageCode).catch(err => {
    emitMsg(socketId, '页面获取超时', 'process');
    return false;
  });

  if (htmlResult === false) {
    emitMsg(socketId, '页面获取失败', 'processError');
    return Result.fail('页面获取失败');
  }

  emitMsg(socketId, '正在解析页面...');
  const bookInfo = dom.getChapter(htmlResult);

  emitMsg(socketId, '解析完成', 'processSuccess');

  return bookInfo;
}

function emitMsg(id, msg, type = 'process') {
  if (!id) return;
  WS.emit(type, msg, id);
}

module.exports = chapter;
