const server = require('http').createServer();
const io = require('socket.io')(server);
const { socket } = require(global.prefixPath + '/config');

class Socket {
  constructor() {
    this.io = io;
    this.users = {}
    this.idIo  = {};
    this.init();
  }

  init() {
    this.io.on('connection', client => {

      client.on('conn', (id) => {
        this.users[id] = client;
        this.idIo[client.id] = id;
        this.emit('conn', '链接成功', id);
      })

      client.on('disconnect', () => {
        delete this.users[this.idIo[client.id]];
        delete this.idIo[client.id];
      })
    });

    server.listen(socket.port, () => {
      console.log(`[WebSocket] port:${socket.port}`);
    });
  }

  emit(name, data, id) {
    if(id && !this.users[id]) return;
    const conn = id ? this.users[id] : this.io;
    conn.emit(name, data);
  }
}

const ws = new Socket();

module.exports = ws;
