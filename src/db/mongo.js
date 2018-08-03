import mongo from 'mongodb';
import assert from 'assert';

//fake data
const burgers =	[{
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
	}];

//fake data
const addictions = [{
		name:'tocineta',
		status:true
	},{
		name:'cebolla',
		status:true
	},{
		name:'Huevo',
		status:true
	},{
		name:'Queso Amarillo',
		status:true
	}];


// Use connect method to connect to the server
mongo.connect('mongodb://localhost:27017', {useNewUrlParser: true}, (err, client) => {
	assert.equal(null, err);
	console.log("Connected successfully to mongo");
 
	const db = client.db('test');
	
	//removeBurgers(db, function() {})

	findBurgers(db, function(docs) {
		if(docs.length){
			console.log('there are data');
		}else{
			insertBurgers(db);
			insertAddictions(db);
		}
		client.close();
	})
});

const insertBurgers = (db) => db.collection('burger-data').insert(burgers);

const insertAddictions = (db) => db.collection('addictions-data').insert(addictions);

export const findBurgers = (db, callback) => {
	const collection = db.collection('burger-data').find({
    	status: true
   	}).toArray(function(err, doc){
   		assert.equal(null, err)
		callback(doc);
   	});
}

export const findAddictions = (db, callback) => {
	const collection = db.collection('addictions-data').find({
    	status: true
   	}).toArray(function(err, doc){
   		assert.equal(null, err)
		callback(doc);
   	});
}

export const removeBurgers = (db, callback) => {
	const collection = db.collection('burger-data');
	collection.remove({}, (err, docs) => {
		assert.equal(err, null);
	 	console.log("Removed tbl");
	});
}
