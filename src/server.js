//Required modules and middleware etc
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose'); //NEED TO CALL MONGOOSE
const morgan = require('morgan'); //Logger middleware

// config.js hold important info for PORT and DATABASE_URL
const {PORT, DATABASE_URL} = require('./config');
const {Post} = require('./models');


//ROUTING
// const blogPostsRouter = require('./blogPosts');
//calling/activting above constants - call node/express
const app = express();

// Parse the JSON that we will get back
app.use(bodyParser.json());
// log the http layer
app.use(morgan('common'));

// make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;
// app.use('/blog-posts', blogPostsRouter);

app.get('/posts', (req, res) => {
  res.json(Post.get());
});



//used for both runServer and closeServer
//Accesses the same server object
let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

//makes file both an executable script AND a module
if (require.main === module) {
  runServer().catch(err => console.error(err));
};


// export the functions we want to use for the test or just elsewhere in general
module.exports = {app, runServer, closeServer};
