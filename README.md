# Hapi Joi example

An example of a simple server, which serves an HTML form and uses [Joi (Hapi module)](https://github.com/hapijs/joi) to validate the user inputs on the backend.

## Why?

Frontend validation is great for the user, it means they can be told instantly if the data they are entering is invalid; allowing them to make adjustments. It is a very important part of UX.

The problem is that any logic on the front end can be manipulated and circumnavigated by savvy users, making it a lacklustre environment for security.

For this reason, as well as having validation on the clientside; we must apply the same (if not more) rigorous logic on the serverside.

## How?

Set up a Hapi server. In this case I've used [Inert (Hapi module)](https://github.com/hapijs/inert) to serve static files. If you want to serve more flexible content, you will need to use [Vision (Hapi module)](https://github.com/hapijs/vision) to serve up [template views](http://www.sitepoint.com/overview-javascript-templating-engines/).

Serve up an html file with a form which makes a post request to an endpoint. In this case I've made it "/users/add"

``` html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Example form with Joi (hapi) for backrend validation</title>
</head>
<body>
<form action="/users/add" method="post">
  <label for="username">Desired username</label>
  <input name="username" type="text">
  <label for="email">Email</label>
  <input name="email" type="text">
  <button type="submit">Submit</button>
</form>
</body>
</html>

```

Then add a route for that endpoint. Within the handler, we define the Joi schema. This is an object which specifies all the expected fields in request payload and which the constraints we wish to put on them.

``` javascript

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

```

## References

https://github.com/hapijs/joi
