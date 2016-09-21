var express = require('express'),
  router = express.Router();

var services = require('../services/services');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
    res.render('index', {
      title: 'Who what Where'
    });
});


router.post('/getYelp', services.getYelp);

router.post('/getFoursquare', services.getFourSquare);

router.post('/getBusiness', services.getBusiness);