'use strict';

var express = require('express');
var bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const volleyball = require('volleyball');
const router = require('./routes');
const path = require('path');
const models = require('./models')

var app = express();



app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', {
  autoescape: true,
  noCache: true,
  express: app
});


app.use(volleyball);
app.use(bodyParser.urlencoded({ //parses http body
  extended: true
}));
app.use(bodyParser.json());
app.use(router);

app.use(express.static(path.join(__dirname, '/public')));

//database sync
models.User.sync({})
.then( function() {
  return models.Page.sync({});
})
.then( function() {
  if (!module.parent) {
    app.listen(3000, function () {
        console.log('Server is listening on port 3001!');
    });
  }
})
.catch(console.error);

// conditional prevents a very esoteric EADDRINUSE issue with mocha watch + supertest + npm test.
