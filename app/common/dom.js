const {
  encode
} = require(global.prefixPath + '/common/tool');
const cheerio = require('cheerio');

class Dom {

  data = {};

  constructor(reptile) {
    this.reptile = reptile;
    this.oName = reptile.name;
    this.oKey = reptile.key;
    this.rootHref = reptile.href;
    this.searchPageCode = this.getItem('searchPageCode', this.getItem('code', 'utf-8'))
  }

  setData(key ,value) {
    this.data[key] = value;
  }

  getItem(name, val = '') {
    return (this.reptile && this.reptile[name]) || val;
  }

  getSearchUrl(name) {
    return this.reptile.search.replace('{search}', encode(name));
  }

  getSearchList(html) {
    const { oName, oKey } = this;

    const $ = cheerio.load(html);
    const listDOM = $(this.getItem('searchList'));
    const index = this.getItem('searchIndex', 0);

    const list = [];
    for (let i = index, len = listDOM.length; i < len; i++) {
      const li = listDOM.eq(i);
      list.push({
        oName,
        oKey,
        title: this.getDom(li, 'searchTitle'),
        url: this.getDom(li, 'searchHref'),
        author: this.getDom(li, 'searchAuthor'),
        newChapter: this.getDom(li, 'searchNewChapter'),
        updated: this.getDom(li, 'searchUpdated')
      });
    }
    return list;
  }

  getBookInfo(html) {
    const { oName, oKey, data: { url: oHref } } = this;

    const $ = cheerio.load(html);
    const body = $('body');

    const data = {
      title: this.getDom(body, 'infoTitle'),
      author: this.getDom(body, 'infoAuthor'),
      newChapter: this.getDom(body, 'infoNewChapter'),
      updated: this.getDom(body, 'infoUpdated'),
      image: this.getDom(body, 'infoImage'),
      description: this.getDom(body, 'infoDescription'),
      oName,
      oKey,
      oHref,
      list: []
    };

    const listDOm = $(this.getItem('infoChapterList'));
    for (let i = this.getItem('infoChapterIndex', 0), len = listDOm.length; i < len; i++) {
      const item = listDOm.eq(i);
      data.list.push({
        title: this.getDom(item, 'infoChapterTitle'),
        href: this.getDom(item, 'infoChapterHref'),
      });
    }

    return data;
  }

  getChapter(html) {
    const { oName, oKey, data: { url: oHref } } = this;

    const $ = cheerio.load(html);
    const body = $('body');

    return {
      title: this.getDom(body, 'chapterTitle'),
      content: this.getDom(body, 'chapterContent'),
      prevHref: this.getDom(body, 'chapterPrevHref'),
      nextHref: this.getDom(body, 'chapterNextHref'),
      oHref,
      oName,
      oKey
    }
  }

  getDom(dom, name) {
    return this.parse(dom, this.getItem(name));
  }

  parse(dom, selector) {
    let arr2 = selector.split('|');
    let result = null;
    arr2.forEach((item) => {
      let arr = item.split('-');
      switch (arr[0]) {
        case '':
          break;
        case 'html':
          result = result.html();
          break;
        case 'text':
          result = result.text();
          break;
        case 'attr':
          result = result.attr(arr[1]);
          break;
        case 'eq':
          result = result.eq(arr[1]);
          break;
        case 'find':
          result = result.find(arr[1]);
          break;
        case 'or':
          result = result.length <= 0 ? dom.find(arr[1]) : result;
          break;
        case 'addHref':
          result = result ? this.getItem('href') + result : '';
          break;
        case 'infoHref':
          result = result ? this.data.url + result : '';
          break;
        case 'rootHref':
          result = result ? this.rootHref + result : '';
          break;
        case 'replace':
          result =
            typeof result == 'string'
              ? result.replace(new RegExp(arr[1], arr[3] || 'g'), arr[2] || '')
              : result;
          break;
        case 'not':
          result =
            typeof result == 'string' ? result.replace(arr[1], '') : result;
          break;
        case 'allSpace':
          result =
            typeof result == 'string' ? result.replace(/\s/g, '') : result;
          break;
        case 'remove':
          result.find(arr[1]).remove();
          break;
        default:
          result = dom.find(item);
          break;
      }
    });
    return result;
  }

  isOriginUrl(url){
    return url.indexOf(this.reptile.href) === 0;
  }
}

module.exports = Dom;
