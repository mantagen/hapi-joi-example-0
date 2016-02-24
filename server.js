'use strict';

const Hapi = require('hapi'),
  Joi = require('joi');



const server = new Hapi.Server();

server.connection({
  port: 3000
});

server.start((err) => {

  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});

server.register(require('inert'), (err) => {

  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/',
    config: {
      handler: function(request, reply) {
        reply.file('./public/form.html');
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/users/add',
    config: {
      handler: function(request, reply) {
        var schema = {
          username: Joi.string().regex(/[a-zA-Z]{1,15}$/).required(),
          email: Joi.string().email()
        };
        Joi.validate(request.payload, schema, function(err, value) {
          if (err === null) {
            // do what you will with value
            reply.file('./public/thank-you.html');
          } else {
            // serve up an error because payload did not pass validation
            // err specifies details of the validation failure
            reply.file('./public/error.html');
          }
        });
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/css/main.css',
    handler: function(request, reply) {
      reply.file('./public/css/main.css');
    }
  });
});
