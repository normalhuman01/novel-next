const { Redis, Result, Logger } = require(global.prefixPath + '/common');

module.exports = async (name) => {
  await Redis.del('data', `search-${name}`);
  Logger('request').info(`[Delete cache] ${name}`);
  return Result.success();
}
