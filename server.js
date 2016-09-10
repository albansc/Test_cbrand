#! /usr/bin/env node
'use strict';

require('dotenv').config({silent: true});

var server = require('./app');
var port = process.env.PORT || process.env.VCAP_APP_PORT || 3009;

server.listen(port, function() {
  console.log('Servidor corriendo en: %d', port);
});

if (process.env.NODE_ENV === 'production') { // [2]
  process.on('uncaughtException', function (er) {
    console.error(er); // [3]
    //transport.sendMail({
    //  from: 'alerts@mycompany.com',
    //  to: 'alert@mycompany.com',
    //  subject: er.message,
    //  text: er.stack // [4]
    //}, function (er) {
    //   if (er) console.error(er)
    //   process.exit(1) // [5]
    //})
  });
}