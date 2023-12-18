const r = require('redis');
const { redis } = require(global.prefixPath + '/config');
const Logger = require(global.prefixPath + '/common/logger');

class Redis {
  constructor(data) {
    this.datas = { data };
    data.auth(redis.pwd, () => {
      console.log('redis 验证成功');
    });
    data.on('error', err => {
      Logger('redis').fatal(`[Connection] ${err}`);
      // console.error('redis 错误: ' + err);
    });
  }

  getData(key) {
    return this.datas[key];
  }

  get(dataKey, key) {
    return new Promise(async (resolve, reject) => {
      const client = this.getData(dataKey);
      await client.get(key, (err, res) => {
        if (err) {
          Logger('redis').error(`[Get] ${err}`);
          reject(err);
        }
        else resolve(res);
      });
    });
  }

  expire(dataKey, key, expire) {
    return new Promise(async (resolve) => {
      const client = this.getData(dataKey);
      await client.expire(key, expire);
      resolve();
    });
  }

  set(dataKey, key, val, expire) {
    return new Promise(async (resolve) => {
      const client = this.getData(dataKey);
      client.set(key, val, async () => {
        expire && (await this.expire(dataKey, key, expire));
        resolve();
      });
    });
  }

  del(dataKey, key) {
    return new Promise(async (resolve) => {
      let client = this.getData(dataKey);
      client.del(key, () => {
        resolve();
      });
    });
  }
}

const clientData = r.createClient({
  port: redis.port,
  host: redis.host,
  password: redis.pwd,
  db: 0
});
const data = new Redis (clientData);

module.exports = data;
