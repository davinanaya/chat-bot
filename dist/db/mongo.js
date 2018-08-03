'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.removeBurgers = exports.findAddictions = exports.findBurgers = undefined;

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//fake data
var burgers = [{
	name: 'clasica',
	status: true
}, {
	name: 'cheese burger',
	status: true
}, {
	name: 'cheese & bacon',
	status: true
}, {
	name: 'avocado',
	status: false
}];

//fake data
var addictions = [{
	name: 'tocineta',
	status: true
}, {
	name: 'cebolla',
	status: true
}, {
	name: 'Huevo',
	status: true
}, {
	name: 'Queso Amarillo',
	status: true
}];

// Use connect method to connect to the server
_mongodb2.default.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function (err, client) {
	_assert2.default.equal(null, err);
	console.log("Connected successfully to mongo");

	var db = client.db('test');

	//removeBurgers(db, function() {})

	findBurgers(db, function (docs) {
		if (docs.length) {
			console.log('there are data');
		} else {
			insertBurgers(db);
			insertAddictions(db);
		}
		client.close();
	});
});

var insertBurgers = function insertBurgers(db) {
	return db.collection('burger-data').insert(burgers);
};

var insertAddictions = function insertAddictions(db) {
	return db.collection('addictions-data').insert(addictions);
};

var findBurgers = exports.findBurgers = function findBurgers(db, callback) {
	var collection = db.collection('burger-data').find({
		status: true
	}).toArray(function (err, doc) {
		_assert2.default.equal(null, err);
		callback(doc);
	});
};

var findAddictions = exports.findAddictions = function findAddictions(db, callback) {
	var collection = db.collection('addictions-data').find({
		status: true
	}).toArray(function (err, doc) {
		_assert2.default.equal(null, err);
		callback(doc);
	});
};

var removeBurgers = exports.removeBurgers = function removeBurgers(db, callback) {
	var collection = db.collection('burger-data');
	collection.remove({}, function (err, docs) {
		_assert2.default.equal(err, null);
		console.log("Removed tbl");
	});
};