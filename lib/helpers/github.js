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

  S.instance.express.all('/github/webhook.json', function(req, res){
    var repo = Belt.get(req, 'body.repository.name');

    if (S.settings.github[repo]){
      CP.exec(_.compact([
        S.settings.github[repo].git_pull ? 'git pull origin master' : null
      , S.settings.github[repo].npm_install ? 'npm install' : null
      , S.settings.github[repo].npm_update ? 'npm update' : null
      , S.settings.github[repo].bower_install ? 'bower install' : null
      , S.settings.github[repo].bower_update ? 'bower update' : null
      ]).join('; '), {
        'cwd': S.settings.github[repo].path
      });
    }

    return res.status(200).json({
      'status': 'OK'
    });
  });

  setTimeout(function(){
    return S.emit('ready');
  }, 0);

};
