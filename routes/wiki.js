'use strict';

var express = require('express');
var router = express.Router();


router.get('/', function ( req, res ) {
  // console.log('went to get');
  res.render('index'); // should be redirect('/'); but we aren't handling yet
});

router.post('/', function(req, res, next) {
  res.send('got to POST /wiki/');
});

router.get('/add', function(req, res, next) {
  res.render('addpage', {});
});

module.exports = router;
