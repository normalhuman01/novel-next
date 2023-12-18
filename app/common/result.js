class Result {
  success(data = {}) {
    return {
      code: 1,
      message: 'success',
      data: data
    }
  }

  fail(message = '', data = {}) {
    return {
      code: 0,
      message,
      data
    }
  }
}

module.exports = new Result();
