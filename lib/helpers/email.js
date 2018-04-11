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
  , Nodemailer = require('nodemailer')
  , Request = require('request')
  , SES = require('nodemailer-ses-transport')
;

module.exports = function(S){

  S.instance['SES'] = Nodemailer.createTransport(SES(S.settings.aws));
  S.mailer = S.instance.SES;
  S.instance['mailer'] = S.mailer;

  S.instance.express.all('/email/Rw8w2K2a7yJ9EJJHmfpy/echo.json', function(req, res){
    var data = req.data();

    S.instance.mailer.sendMail({
      'from': data.from
    , 'to': data.to
    , 'cc': data.cc
    , 'bcc': data.bcc
    , 'subject': data.subject
    , 'text': '<pre>' + Belt.stringify(data) + '</pre>'
    , 'html': '<pre>' + Belt.stringify(data) + '</pre>'
    }, function(err, msg){
      res.status(200).json({
        'error': Belt.get(err, 'message')
      , 'data': msg
      });
    });
  });

  setTimeout(function(){
    return S.emit('ready');
  }, 0);

};
