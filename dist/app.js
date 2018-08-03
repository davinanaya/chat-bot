'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressHandlebars = require('express-handlebars');

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _index = require('./routes/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();


var app = (0, _express2.default)();

app.engine('hbs', (0, _expressHandlebars2.default)({ extname: 'hbs', defaultLayout: 'index', layoutsDir: __dirname + '/views/' }));
app.set('views', _path2.default.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use('/assets', _express2.default.static('assets'));

//index
app.use('/', _index2.default);

//start the server
var port = 3000;
app.listen(port, function () {
  return console.log('listening on port:' + port);
});