const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// this lets us use *should* style syntax in our tests
// so we can do things like `(1 + 1).should.equal(2);`
const should = chai.should();

//used in order to make HTTP requests in our tests
chai.use(chaiHttp);


describe('Blog Posts', function() {

  //before test runs we activate the server
  //run server function returns a promise
  before(function() {
    // im going to return promise by "return runServer"
    return runServer();
  });

  //close server at the end of the test//
  after(function() {
    return closeServer();
  })

  //Go through all endpoints for testing
  //get (Read)
  it('should lists all items on GET endpoint', function () {
    //always need to return a promise (or end the call)
    return chai.request(app)
      .get('/blog-posts') //make request to /blog-posts
      .then(function(res) {
        res.should.have.status(200); //OKAY status code - always used as success for GET
        res.should.be.json; //should be a json file here
        res.body.should.be.a('array'); //we should be getting back an array
        //it is an array because we are getting ALL blog posts

        // because we have already created some basic blog posts
        // we need to check to make sure we have at least ONE
        res.body.length.should.be.at.least(1);

        //creating a variable for all keys required
        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
        //loop through the entire body and make sure there are objects within the array
        //make sure the expected keys are within each looped item
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.key(expectedKeys);
        });
      });
  });

  //post (create)
  // this is when we create a new blog post and send to the server
  it('should add a new blog posts on POST endpoint', function() {
    //putting in an example post to use
    //this only include the 3 mandatory pieces when creating a new blog post
    const newBlogPost = {
      title: 'Blog Post',
      content: 'content of the blog post here',
      author: 'Michaela Blackham'
    };
    //always need to return a promise (or end the call)
    return chai.request(app)
      .post('/blog-posts')//positng info to /blog-posts
      .send(newBlogPost)//sending the new blog post for a test
      .then(function(res) {
        res.should.have.status(201) // 201 is "create" status code - always used as success for POST
        res.should.be.json;
        res.body.should.be.a('object'); // getting back an object because we are looking at the object we just created and posted
        res.body.should.include.keys('id', 'title', 'content', 'author', 'publishDate')
        res.should.not.be.null;
        // res.body.should.deep.equal(Object.assign(newBlogPost,{id: res.body.id}));
/////////////I couldnt get the above working so i tried making it all equal individually////////////
        res.body.title.should.equal(newBlogPost.title);
        res.body.content.should.equal(newBlogPost.content);
        res.body.author.should.equal(newBlogPost.author);
      });
  });

  //Put (update)
  //need to make a get request to the blog posts
  //then we need to get an id from one of them and update that blog post
  it('should update a blog post on PUT endpoint', function() {
    //need some fake data to udpate the blog post with
    const updateBlogPost = {
      title: 'Blog Post2',
      content: 'content of the SECOND blog post here',
      author: 'Ryan Lederman'
    };
    //always need to return a promise (or end the call)
    return chai.request(app)
      .get('/blog-posts') //make request to /blog-posts
      .then(function(res) {
        //get the id of the first item in the body and assign it to the updated blog post variable's id
        updateBlogPost.id = res.body[0].id;
        return chai.request(app)
          //inside of here we need to first get an ID and then make some changes to that post
          .put(`/blog-posts/${updateBlogPost.id}`)
          //then push that change and THEN get the changes
          .send(updateBlogPost);
      })
      .then(function(res){
        res.should.have.status(204); //OKAY status code - always used as success for GET
        //checking for get request because we have to get all blog posts to check if we updated one
        // res.should.be.json;
        // res.body.should.be.a('object');
        //should get back and object because we are lokoing at just ONE blog post
        // res.body.should.deep.equal(updateBlogPost);
        //i used one of the older examples for help

        return chai.request(app)
          .get(`/blog-posts/${updateBlogPost.id}`)
          //needed to get a new request for an indidvual post
          //
      })
      .then(res => {
        res.should.be.json
        res.body.should.be.a('object')
        // res.body.should.deep.equal(updateBlogPost)
        Object.keys(updateBlogPost).forEach(key => res.body[key].should.equal(updateBlogPost[key]))
        //This is the same as lienes 77-79 but using a loop instead
      })
  });

  //delete (delete)

  it('should delete a blog post on DELETE endpoint', function() {
    //always need to return a promise (or end the call)
    return chai.request(app)
    .get('/blog-posts')//make request to /blog-posts
    .then(function(res) {
      //always need to return a promise (or end the call)
      return chai.request(app)
      //delete the blog post found at the blog-post endpoint with the first ID found in the res.body array
      .delete(`/blog-posts/${res.body[0].id}`);
    })
    .then(function(res){
      res.should.have.status(204) // NO CONTENT status code -- always used as a success for DELET
    });
  });

});
