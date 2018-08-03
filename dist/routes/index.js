'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressHandlebars = require('express-handlebars');

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _recastai = require('recastai');

var _recastai2 = _interopRequireDefault(_recastai);

var _nodeDatetime = require('node-datetime');

var _nodeDatetime2 = _interopRequireDefault(_nodeDatetime);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _mongo = require('../db/mongo.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var bot = new _recastai2.default.build('d7e7ad5bec923b96abcdfa441c6d0582', 'en');
var dateTime = _nodeDatetime2.default.create().format('I:M p');
var finalOrder = {};

var listHtml = function listHtml(list) {
	var html = '<ul>';
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = list.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var _step$value = _slicedToArray(_step.value, 2),
			    i = _step$value[0],
			    val = _step$value[1];

			html += '<li>' + (i + 1) + ' ) ' + val.name + '</li>';
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	html += '</ul>';
	return html;
};

//render index
router.get('/', function (req, res) {
	return res.render('index', { title: 'Bot Xenial test' });
});

router.get('/additions', function (req, res) {
	return res.json({ title: 'Bot Xenial test' });
});

//render msg human
router.post('/user-msg', function (req, res) {
	var msg = req.body.msg;
	_expressHandlebars2.default.create().render('assets/templates/message-user.hbs', {
		msg: msg,
		date: dateTime
	}).then(function (renderedHtml) {
		return res.send({ html: renderedHtml });
	});
});

//render msg bot
router.post('/bot-msg', async function (req, res, next) {
	var msg = req.body.msg;

	bot.dialog({ type: 'text', content: msg }, { conversationId: 'CONVERSATION_ID' }).then(function (_ref) {
		var messages = _ref.messages,
		    nlp = _ref.nlp;


		var search = 'none';
		var data = messages.length ? messages[0].content : [];

		if (data.length) {
			search = nlp.intents[0].slug;
		} else {
			data = 'i don´t understand, please change the subject';
		}
		console.log('finish the request => ', search);

		if (search == 'menu') {
			//if the user wants to order something show the hamburgers available
			_mongodb2.default.connect(process.env.MONGO_URI, { useNewUrlParser: true }, function (err, client) {
				var db = client.db('test');

				(0, _mongo.findBurgers)(db, function (docs) {
					client.close();

					_expressHandlebars2.default.create().render('assets/templates/message-robot.hbs', {
						msg: data + listHtml(docs),
						date: dateTime
					}).then(function (renderedHtml) {
						return res.send({ html: renderedHtml });
					});
				});
			});
		} else if (search == 'order') {
			//if the user wants to some addictions show addictions available
			finalOrder.burger = msg;
			_mongodb2.default.connect(process.env.MONGO_URI, { useNewUrlParser: true }, function (err, client) {
				var db = client.db('test');

				(0, _mongo.findAddictions)(db, function (docs) {
					client.close();

					_expressHandlebars2.default.create().render('assets/templates/message-robot.hbs', {
						msg: data + listHtml(docs),
						date: dateTime
					}).then(function (renderedHtml) {
						return res.send({ html: renderedHtml });
					});
				});
			});
		} else if (search == 'addictions') {
			finalOrder.addictions = msg;

			_expressHandlebars2.default.create().render('assets/templates/message-robot.hbs', {
				msg: 'Your final order is ' + finalOrder.burger + ' con adicion de ' + finalOrder.addictions,
				date: dateTime
			}).then(function (renderedHtml) {
				return res.send({ html: renderedHtml, done: true });
			});
		} else {
			_expressHandlebars2.default.create().render('assets/templates/message-robot.hbs', {
				msg: data,
				date: dateTime
			}).then(function (renderedHtml) {
				return res.send({ html: renderedHtml });
			});
		}
	}).catch(function (err) {
		return console.log("Something wrong", err);
	});
});

exports.default = router;