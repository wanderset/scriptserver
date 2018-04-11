#!/usr/bin/env node

var Path = require('path')
  , Optionall = require('optionall')
  , Async = require('async')
  , _ = require('underscore')
  , Belt = require('jsbelt')
  , Winston = require('winston')
  , Events = require('events')
  , Moment = require('moment')
  , Str = require('underscore.string')
;

module.exports = function(S){

////////////////////////////////////////////////////////////////////////////////
//// METHODS
////////////////////////////////////////////////////////////////////////////////

  S.instance.express.all('/twilio/sms/echo.json', function(req, res){
    var data = req.data();

    S.instance.mailer.sendMail({
      'from': data.From.replace(/^\+/, '') + '@wanderset.com'
    , 'to': data.To.replace(/^\+/, '') + '@wanderset.com'
    , 'cc': data.cc
    , 'bcc': data.bcc
    , 'subject': 'Incoming SMS from ' + data.From + ' to ' + data.To
    , 'text': data.Body
    , 'html': data.Body
    }, function(err, msg){
      res.status(200).type('text').end('OK');
    });
  });

  setTimeout(function(){
    return S.emit('ready');
  }, 0);

};
