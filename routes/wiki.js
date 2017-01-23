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
  // First check if user exsists
  //  if yes, get id of user and
  //  otherwise, create user and create page with the userid.
  User.findOne({
    where: { name: username }
  })
  .then( function (user) {
    // console.log(page);
    //create wiki with the user id;
    console.log(user);
    if(user) {
      var page = Page.build({
        title: title,
        content: content,
        //urlTitle: urlTitle,
        status: status,
        authorId: user.id
      })
      .save()
      .then(function(savedPage) {
        res.redirect(savedPage.route);
      })
      .catch(function(err) {
        res.render('error', err);
      })
    } else {
      //Create user
      var user = User.build({
        name: username,
        email: email
      })
      .save()
      .then(function(savedUser) {
        //Create Wiki
        var page = Page.build({
          title: title,
          content: content,
          status: status,
          authorId: savedUser.id
        })
        .save()
        .then(function(savedPage) {
          res.redirect(savedPage.route);
        })
        .catch(function(err) {
          res.render('error', err);
        });

      })
      .catch(function(err) {
        res.render('error', err);
      });
  }});
});

router.get('/add', function(req, res, next) {
  res.render('addpage', {});
});

router.get('/users', function(req, res, next) {

  User.findAll({
    limit: 100
  })
  .then( function (users) {

    res.render('userlist.html',  { users: users }); // should be redirect('/'); but we aren't handling yet
  })
  .catch(next);

});

router.get('/users/:id', function(req, res, next) {

  Page.findAll({
    where: { authorId: req.params.id }
  })
  .then( function (pages) {
    // console.log(page);
    res.render('index.html', { pages: pages });

  })
  .catch(next);

});


router.get('/:title', function (req, res, next) {
  //let title = req.params.title;
  Page.findOne({
    where: {
        urlTitle: req.params.title
    },
    include: [
        {model: User, as: 'author'}
    ]
  })
  .then(function (page) {
      console.log('page', page)
      //console.log('author', page.author, page.author.name);
      // page instance will have a .author property
      // as a filled in user object ({ name, email })
      if (page === null) {
          res.status(404).send();
      } else {
          res.render('wikipage', {
              page: page
          });
      }
  })
  .catch(next);


});

module.exports = router;
