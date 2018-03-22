// jshint esversion: 6
'use strict';

const config = require('../config/config.json'),
  storeConfig = {
    uri: `${config.mongo.server}/${config.mongo.db}`,
    databaseName: 'websweeper',
    collection: 'websweeper_sessions'
  };

module.exports = function(session) {
  var MongoSessionStore = require('connect-mongodb-session')(session),
    store = new MongoSessionStore(storeConfig);

  return store;
};