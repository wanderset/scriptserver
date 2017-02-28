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
  , CP = require('child_process')
;

module.exports = function(S){

////////////////////////////////////////////////////////////////////////////////
//// METHODS
////////////////////////////////////////////////////////////////////////////////

  S.instance.express.all('/rpc/:key.json', function(req, res){
    var rpc = (S.settings.rpc || {})[req.params.key];

    if (!rpc || !rpc.exec) return res.status(200).json({
      'error': 'Invalid request'
    });

    CP.exec(_.template(rpc.exec)(_.extend({

    }, req.data(), {
      '_': _
    , 'Belt': Belt
    , 'Moment': Moment
    , 'Str': Str
    , 'Instance': S.instance
    }), rpc, function(err, stdout, stderr){
      return res.status(200).json(rpc.sendout ? {
        'error': Belt.get(err, 'message')
      , 'data': {
          'stdout': stdout
        , 'stderr': stderr
        }
      } : {
        'data': true
      });
    });
  });

  setTimeout(function(){
    _.each(S.settings.github, function(v, k){
      S.instance.log.info('Registered RPC webhook [' + k + ']...');
    });

    return S.emit('ready');
  }, 0);

};
