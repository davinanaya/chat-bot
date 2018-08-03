require('dotenv').config()
import express  from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import hbs from 'express-handlebars';
import routes from './routes/index';

let app = express();

app.engine('hbs',hbs({extname: 'hbs',defaultLayout: 'index',layoutsDir:__dirname + '/views/'}));
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/assets', express.static('assets'));

//index
app.use('/',routes);

//start the server
const port = 3000;
app.listen( port, () => console.log('listening on port:' + port));
