const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

global.prefixPath = path.resolve(__dirname, 'app');
global.downloadPath = path.resolve(__dirname, 'download');

app.set('views', path.join(global.prefixPath, 'view'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static(path.join(global.prefixPath, 'public')))
app.use('/dbook', express.static(path.join(__dirname, 'download')))

require('./app/routes')(app);

app.listen(8080);

if (process.env.NODE_ENV === 'development') {
  console.log('http://localhost:8080');
}
