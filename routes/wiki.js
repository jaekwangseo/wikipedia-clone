'use strict';

var express = require('express');
var router = express.Router();
let models = require('../models');
var Page = models.Page;
var User = models.User;


router.get('/', function ( req, res, next ) {
  // console.log('went to get');
  Page.findAll({
    limit: 100,
    order: 'date DESC'
  })
  .then( function (pages) {
    // console.log(pages);
    let newPagesList = { pages: pages };
    console.log(newPagesList);
    res.render('index.html',  newPagesList); // should be redirect('/'); but we aren't handling yet
  })
  .catch(next);
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

  // let urlTitle = title.replace(' ', '_')

  var page = Page.build({
    title: title,
    content: content,
    //urlTitle: urlTitle,
    status: status
  })
  .save()
  .then(function(savedPage) {
    res.redirect(savedPage.route);
  })
  .catch(function(err) {
    res.render('error', err);
  })

});

router.get('/add', function(req, res, next) {
  res.render('addpage', {});
});

router.get('/:title', function (req, res, next) {
  let title = req.params.title;
  Page.findOne({
    where: { urlTitle: title }
  })
  .then( function (page) {
    // console.log(page);

    res.render('wikipage', { page: page });
  })
  .catch(next);

});

module.exports = router;
