//Required modules and middleware etc
const bodyParser = require('body-parser');
//required for posts
const jsonParser = bodyParser.json();
const express = require('express');
const mongoose = require('mongoose'); //NEED TO CALL MONGOOSE
const morgan = require('morgan'); //Logger middleware
const path = require('path');

// config.js hold important info for PORT and DATABASE_URL
let {PORT, DATABASE_URL} = require('./config');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log(process.env.DATABASE_URL);
DATABASE_URL = process.env.DATABASE_URL || DATABASE_URL;

const {Post} = require('./models');

//calling/activting above constants - call node/express
const app = express();

// Parse the JSON that we will get back
app.use(bodyParser.json());
// log the http layer
app.use(morgan('common'));

// make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

//Get all posts
//Make request to /posts
app.get('/posts', (req, res) => {
  Post
    .find()
    .then(posts => {
      res.json(posts);
    })
    //if there is an error catch the promise and send a 500 status
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

//get a post just by the ID
//make request to post/id number
app.get('/posts/:id', (req, res) => {
  Post
    //make sure to just find by ID of the params of the request made
    .findById(req.params.id)
    .then(posts => {
      res.json(posts);
    })
    //if there is an error catch the promise and send a 500 status
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

//post request to add new items to feed of blog posts
app.post('/posts', (req, res) => {
  //require certain fields
  const requiredFields = ['title','content','author'];
  //loop through each required field
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    //if current require field item is not within the request body
    if(!(field in req.body)) {
      // console/return an error
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Post
   .create({
     title: req.body.title,
     content: req.body.content,
     author: req.body.author
   })
   .then(posts => res.status(201).json(posts))
   .catch(err => {
     console.error(err);
     res.status(500).json({error: 'something went terribly wrong'});
   });
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
