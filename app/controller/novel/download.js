const {
  Result,
  Redis,
  Dom,
  Request,
  WS
} = require(global.prefixPath + '/common');
const { origin } = require(global.prefixPath + '/config');
const fs = require('fs');
const groupItemTotal = 10;

function groupRequest(list) {
  const result = [];
  for (let i = 0, len = list.length;i < len; i += groupItemTotal) {
    result.push(list.slice(i, i + groupItemTotal));
  }
  return result
}

async function download(url, originKey, socketId) {
  emitMsg(socketId, '正在解析参数...');

  if(!url) {
    emitMsg(socketId, '错误的地址', 'processError');
    return Result.fail('错误的地址');
  }

  if (!origin.hasOwnProperty(originKey)) {
    emitMsg(socketId, '错误的来源', 'processError');
    return Result.fail('错误的来源');
  }

  const cacheData = await Redis.get('data', 'book-info-' + url);

  if (!cacheData) {
    emitMsg(socketId, '未发现缓存', 'processSuccess');
    return Result.fail(data);
  }

  const { title, list } = JSON.parse(String(cacheData));

  const bookPath = global.downloadPath + '/' + title;
  if (!fs.existsSync(bookPath)) {
    fs.mkdirSync(bookPath);
  }

  const req_list = groupRequest(list);

  emitMsg(socketId, '提取缓存', 'processSuccess');

  for(let i = 0, len = req_list.length; i < len; i++) {
    await requestList(req_list[i], origin[originKey], title, i, socketId);
  }

  for (let i = 0, len = list.length; i < len; i++) {
    const content = fs.readFileSync(`${bookPath}/${i}.txt`, 'utf-8');
    fs.appendFileSync(`${bookPath}.txt`, content);
  }

  return Result.success(`/dbook/${title}.txt`);
}

function emitMsg(id, msg, type = 'process') {
  if (!id) return;
  WS.emit(type, msg, id);
}

module.exports = download;

async function getBookChapter(url, currentOrigin, title, fileName, socketId) {
  const dom = new Dom(currentOrigin);
  dom.setData('url', url);

  const htmlResult = await Request({
    method: 'GET',
    url,
  }, dom.searchPageCode).catch(err => {
    console.log('Request', err.message);
    return false;
  });

  if (htmlResult === false) {
    return Result.fail('页面获取失败');
  }

  const bookInfo = dom.getChapter(htmlResult);
  await writeFile(
    `${global.downloadPath}/${title}/${fileName}.txt`,
    `
${bookInfo.title}
${bookInfo.content
      .replace(/[<p>|<\/p>]/g, '')
      .replace(/\n+/, '\n')
    }
    `
  );
  emitMsg(socketId, 1, 'downloading');
  return true;
}

function writeFile(p, d) {
  return new Promise((resolve, reject) => {
    fs.writeFile(p, d, err => {
      if(err) reject(err);
      resolve();
    });
  })
}

function requestList(list, currentOrigin, title, i, socketId) {
  return Promise.allSettled(list.map((item, index) => {
    return getBookChapter(
      item.href,
      currentOrigin,
      title,
      i * groupItemTotal + index,
      socketId
    );
  })).then(res => {
    const fail = res.filter(item => item.status === 'rejected');
    if (fail.length) {
      console.log('allSettled', index, fail);
    }
  });
}


