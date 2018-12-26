require('isomorphic-fetch');
const express = require('express');
const jsonServer = require('json-server');
const routes = require('./routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ['secretKey'],
    maxAge: 24 * 60 * 60 * 1000,
}));



app.set('view engine', 'pug');
app.use(express.static('public'));

app.use(routes);
app.use('/api', jsonServer.router('db.json'));





const server = app.listen(3000, function () {
  console.log('Server running at http://localhost:' + server.address().port)
})

