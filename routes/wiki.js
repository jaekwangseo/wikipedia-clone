'use strict';

var express = require('express');
var router = express.Router();
let models = require('../models');
var Page = models.Page;
var User = models.User;


router.get('/', function ( req, res ) {
  // console.log('went to get');
  res.render('index'); // should be redirect('/'); but we aren't handling yet
});

router.post('/', function(req, res, next) {

  let username = req.body.username
  let email = req.body.email
  let title = req.body.title
  let content = req.body.content
  let status = req.body.status

  if (status) {
    status = 'open'
  } else {
    status = 'closed'
  }

  let urlTitle = title.replace(' ', '_')

  var page = Page.build({
    title: title,
    content: content,
    //urlTitle: urlTitle,
    status: status
  })
  .save()
  .then(function(page) {

    res.json(page)
  })
  .catch(function(err) {
    res.render('error', err);
  })

});

router.get('/add', function(req, res, next) {
  res.render('addpage', {});
});

module.exports = router;
