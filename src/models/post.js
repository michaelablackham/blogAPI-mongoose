const mongoose = require('mongoose');
//**mongoose actually makes this for us (creates a unique id)

const postSchema = mongoose.Schema({
  // Required object
  title: {type: String, required: true},
  content: {type: String},
  // mentioned in hints that this would need to be split
  author: {
    firstName: String,
    LastName: String
  },
  // need a default date if one isn't passed
  publishDate: {type: Date, default: Date.now}
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
