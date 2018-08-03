import express from 'express';
import hbs from 'express-handlebars';
import recastai from 'recastai';
import datetime from 'node-datetime';

import mongo from 'mongodb';
import { findBurgers, findAddictions } from '../db/mongo.js';

const router = express.Router();
const bot = new recastai.build('d7e7ad5bec923b96abcdfa441c6d0582','en')
const dateTime = datetime.create().format('I:M p');
let finalOrder = {};

const listHtml = list => {
	let html = '<ul>';
	for(const [i, val] of list.entries()){
		html += `<li>${(i + 1)} ) ${val.name}</li>`;
	}
	html += '</ul>';
	return html;
};

//render index
router.get('/', (req, res) => res.render('index', {title:'Bot Xenial test'}) );

router.get('/additions', (req, res) => res.json({title:'Bot Xenial test'}) );

//render msg human
router.post('/user-msg', (req, res) => {
	const msg = req.body.msg;
	hbs.create().render('assets/templates/message-user.hbs', {
    	msg: msg,
    	date: dateTime
  	}).then( renderedHtml => res.send( { html:renderedHtml } ));
});

//render msg bot
router.post('/bot-msg', async (req, res, next) => {
	const msg = req.body.msg;

	bot.dialog({ type: 'text', content: msg}, { conversationId: 'CONVERSATION_ID' })
	.then( ({ messages, nlp }) => {
		
		let search = 'none';
		let data = (messages.length) ? messages[0].content : [];

		if(data.length){
			search = nlp.intents[0].slug;
		}else{
			data = 'i don´t understand, please change the subject';
		}
		console.log('finish the request => ', search);

		if(search == 'menu'){//if the user wants to order something show the hamburgers available
			mongo.connect(process.env.MONGO_URI, {useNewUrlParser: true}, (err, client) => {
				const db = client.db('test');
				
				findBurgers(db, docs => {
					client.close();

					hbs.create().render('assets/templates/message-robot.hbs', {
				    	msg: data + listHtml(docs),
				    	date: dateTime
				  	}).then( renderedHtml => res.send( { html:renderedHtml } ));
				});
			});
		}else if(search == 'order'){//if the user wants to some addictions show addictions available
			finalOrder.burger = msg;
			mongo.connect(process.env.MONGO_URI, {useNewUrlParser: true}, (err, client) => {
				const db = client.db('test');
				
				findAddictions(db, docs => {
					client.close();

					hbs.create().render('assets/templates/message-robot.hbs', {
				    	msg: data + listHtml(docs),
				    	date: dateTime
				  	}).then( renderedHtml => res.send( { html:renderedHtml } ));
				});
			});
		}else if(search == 'addictions'){
			finalOrder.addictions = msg;

			hbs.create().render('assets/templates/message-robot.hbs', {
		    	msg: 'Your final order is ' + finalOrder.burger + ' con adicion de ' + finalOrder.addictions,
		    	date: dateTime
		  	}).then( renderedHtml => res.send( { html:renderedHtml, done: true } ));
		}else{
			hbs.create().render('assets/templates/message-robot.hbs', {
		    	msg: data,
		    	date: dateTime
		  	}).then( renderedHtml => res.send( { html:renderedHtml } ));
		}
	  	
  	}).catch( err => console.log("Something wrong", err) );
});

export default router;


