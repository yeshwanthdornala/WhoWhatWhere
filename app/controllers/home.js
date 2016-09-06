var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');

var services = require('../services/services');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  var articles = [new Article(), new Article()];
    res.render('index', {
      title: 'Who what Where',
      articles: articles
    });
});


router.post('/getYelp', services.getYelp);

router.post('/getFoursquare', services.getFourSquare);

router.post('/getBusiness', services.getBusiness);