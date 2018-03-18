// jshint esversion: 6
'use strict';
const chat = require('./chat.js'),
  io = require('socket.io')({
    path: '/socket'
  });

module.exports = {
  init: function(server, session) {
    io.attach(server);
    // get session
    io.use(function(socket, next) {
      session(socket.request, socket.request.res, next);
    });

    //check if authenicated
    /*
    io.use(function(socket, next) {
      if (!socket.request.session.user_id) {
        return next(new Error('authentication error'));
      }
      return next();
    });*/

    io.on('connection', function(socket) {
      chat(io, socket);
      console.log('user connected');

      socket.on('disconnect', function(){
        console.log('user disconnected');
      });
    });
    this.io = io;
  }
}