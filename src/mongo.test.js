require('dotenv').config()
const {MongoClient} = require('mongodb');

console.log('davinnnn',process.env.MONGO_URI);

let connection;
let db;

beforeAll(async () => {
  connection = await MongoClient.connect(process.env.MONGO_URI);
  db = await connection.db(process.env.MONGO_DB_NAME);
});

afterAll(async () => {
  await connection.close();
  await db.close();
});

it('should aggregate docs from collection', async () => {
  const files = db.collection('burger-data');

  await files.insertMany(burgers =	[{
		name:'clasica',
		status:true
	},{
		name:'cheese burger',
		status:true
	},{
		name:'cheese & bacon',
		status:true
	},{
		name:'avocado',
		status:false
	}]);

  const topFiles = await files
    .aggregate([
      {$group: {_id: '$name', count: {$sum: 1}}},
      {$sort: {count: -1}},
    ])
    .toArray();

  expect(topFiles).toEqual([
    {_id: 'clasica', count: 1},
    {_id: 'avocado', count: 1}
  ]);
});