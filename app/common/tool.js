const { encode: _encode, decode } = require('iconv-lite');

exports.encode = function (url) {
  return encodeURIComponent(url)
    .replace(/\%3A/g, ':')
    .replace(/\%2F/g, '/')
    .replace(/\%3F/g, '?')
    .replace(/\%3D/g, '=')
    .replace(/\%26/g, '&');
}

exports.toGBK = function (str) {
  if (str == null || typeof (str) == 'undefined' || str == '') {
    return '';
  }
  const a = str.toString().split('');
  const t = ['.', '-', '_'];

  for (let i = 0, len = a.length; i < len; i++) {
    const ai = a[i];
    if ((ai >= '0' && ai <= '9') || (ai >= 'A' && ai <= 'Z') || (ai >= 'a' && ai <= 'z') || t.includes(ai)) {
      continue;
    }
    const b = _encode(ai, 'gbk');
    const e = [''];
    for (let j = 0; j < b.length; j++) {
      e.push(b.toString('hex', j, j + 1).toUpperCase());
    }
    a[i] = e.join('%');
  }
  return a.join('');
}

exports.transcoding = (charset, stream) => {
  let _id;

  return new Promise(function (resolve, reject) {
    let buffers = [];
    stream.on('error', reject);
    stream.on('data', function (data) {
      buffers.push(data)
    });
    stream.on('end', function () {
      clearTimeout(_id);
      _id = undefined;
      const buf = Buffer.concat(buffers);
      resolve(decode(buf, charset));
    });

    _id = setTimeout(() => {
      reject(false)
    }, 3000);
  });
}
