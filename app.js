/* jshint node: true */
'use strict';

var express = require('express');
var app = express();
var watson = require('watson-developer-cloud');
var config = require('config');
var Cloudant = require('cloudant');


// Bootstrap application settings
require('./config/express')(app);

// Create the service wrapper
var classifierId = process.env.classifierId ? process.env.classifierId : config.get('NLC.classifierId');
var natural_language_classifier = watson.natural_language_classifier({
  url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
  username: config.get('NLC.username'),
  password: config.get('NLC.password'),
  version: 'v1'
});
var cloudant = Cloudant({ account: config.get('Cloudant.username'), password: config.get('Cloudant.password') });
var db = cloudant.db.use('esencia');


app.get('/', function (req, res) {
  res.render('default');
});

app.get('/api/classify/:text', function (req, res) {
  var text = req.params.text;
  natural_language_classifier.classify({
    text: text,
    classifier_id: classifierId
  },
    function (err, response) {
      if (err) {
        console.log('error:', err);
        res.status(400).json(err);
      }
      else {
        console.log(JSON.stringify(response, null, 2));
        res.json(response);
      }
    });
});

app.delete('/api/answers/:id/:rev', function (req, res) {
  db.destroy(req.params.id, req.params.rev, cb.bind({ res: res }));
});
app.post('/api/answers', function (req, res) {
  db.insert({ _id: req.body.id, text: req.body.text }, cb.bind({ res: res }));
});
app.get('/api/answers', function (req, res) {
  db.list({}, cb.bind({ res: res }));
});
app.get('/api/answers/:id', function (req, res) {
  db.get(req.params.id, cb.bind({ res: res }));
});

function cb(err, data) {
  var that = this;
  console.log("Error:", err);
  console.log("Data:", data);
  if (!err)
    that.res.status(200).json(data);
  else
    that.res.status(500).json(err);
}

module.exports = app;
