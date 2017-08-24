//Required modules and middleware etc
const express = require('express');
const morgan = require('morgan');
//ROUTING
const blogPostsRouter = require('./blogPosts');
//calling/activting above constants - call node/express
const app = express();

// log the http layer
app.use(morgan('common'));

app.use('/blog-posts', blogPostsRouter);

//used for both runServer and closeServer
//Accesses the same server object
let server;

// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.
function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

//Had to comment this out because this port was being used in 2 places
// app.listen(process.env.PORT || 8080, () => {
//   console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
// });

// export the functions we want to use for the test or just elsewhere in general
module.exports = {app, runServer, closeServer};
