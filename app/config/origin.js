module.exports = {
  biququ: {
    status: true,
    key: 'biququ',
    name: '笔趣趣',
    href: 'http://www.biququ.info',
    code: 'utf-8',
    type: 'GET',

    search: 'http://www.biququ.info/search.php?keyword={search}',
    searchPageCode: 'utf-8',
    searchList: '#search-main ul>li',
    searchIndex: 1,
    searchTitle: '.s2>a|text',
    searchHref: '.s2>a|attr-href',
    searchAuthor: '.s4|text',
    searchNewChapter: '.s3|text',
    searchUpdated: '.s6|text',

    infoTitle: '#info h1|text',
    infoAuthor: '#info p|eq-0|text|allSpace|not-作者：',
    infoNewChapter: '#info p|eq-3|text|not-最新更新：',
    infoUpdated: '#info|eq-1|text|not-最后更新：',
    infoImage: '#fmimg img|attr-src|addHref',
    infoDescription: '#intro|text',
    infoChapterList: '#list dd',
    infoChapterIndex: 0,
    infoChapterTitle: 'a|text',
    infoChapterHref: 'a|attr-href|rootHref',

    chapterTitle: '.bookname h1|text',
    chapterContent: '#content|remove-div|remove-script|html|not-请记住本书首发域名：booktxt.net。顶点小说手机版阅读网址：m.booktxt.net',
    chapterPrevHref: '.bottem2 a|eq-0|attr-href|addHref',
    chapterNextHref: '.bottem2 a|eq-2|attr-href|addHref',
  }
};
