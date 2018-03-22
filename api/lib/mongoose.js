// jshint esversion: 6
'use strict';

var mongoose = require('mongoose'),
  Promise  = require('bluebird'),
  moment   = require('moment'),
  config   = require('../config/config.json'),
  DB_NAME  = 'websweeper';

/*
 * Returns true iff the given id is valid.
 * @param id {String} The mongo id to be verified.
 */
function validID(id) {
  return id && id.match(/^[0-9a-fA-F]{24}$/);
}

module.exports = {

  /** Configures the mongoose
   * @param app {Express} the express app
   */
  configure: function (app, opt) {
    mongoose.Promise = Promise;
    mongoose.validID = validID;
    return mongoose.connect(`${config.mongo.server}/${config.mongo.db}`);
  }
};