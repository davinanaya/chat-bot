'use strict';

require('dotenv').config();

var _require = require('mongodb'),
    MongoClient = _require.MongoClient;

console.log('davinnnn', process.env.MONGO_URI);

var connection = void 0;
var db = void 0;

beforeAll(async function () {
  connection = await MongoClient.connect(process.env.MONGO_URI);
  db = await connection.db(process.env.MONGO_DB_NAME);
});

afterAll(async function () {
  await connection.close();
  await db.close();
});

it('should aggregate docs from collection', async function () {
  var files = db.collection('burger-data');

  await files.insertMany(burgers = [{
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
  }]);

  var topFiles = await files.aggregate([{ $group: { _id: '$name', count: { $sum: 1 } } }, { $sort: { count: -1 } }]).toArray();

  expect(topFiles).toEqual([{ _id: 'clasica', count: 1 }, { _id: 'avocado', count: 1 }]);
});