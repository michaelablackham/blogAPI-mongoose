//ALWAYS REQUIRE MONGOOSE WHEN USING MONGOOSE FOR APP
const mongoose = require('mongoose');

//A:WAYS REQUIRE A SCHEMA FOR ALL MONGOOSE APPS
const postSchema = mongoose.Schema({
  // Required object
  title: {type: String, required: true},
  content: {type: String},
  // mentioned in hints that this would need to be split
  author: {
    firstName: String,
    lastName: String
  },
  // need a default date if one isn't passed
  publishDate: {type: Date, default: Date.now}
});

//CREATING A VIRTUAL FOR MORE HUMAN READABLE DATA
//THIS KEEPS US FROM DUPLICATING DATA SINCE THE ENTIRE NAME IS BASED ON THE FIRST AND LAST
postSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

//METHOD TO RETURN POST SCHEMA INFORMATION
//THIS CAN USE THE VIRTUAL SO "AUTHOR" CAN INCLUDE FIRST & LAST NAME TOGETHER
postSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    //USES VIRTUAL NAME TO PULL IN THE RIGHT INFORMATION
    author: this.authorName,
    publishDate: this.publishDate
  };
}

const Post = mongoose.model('Post', postSchema);

//ALWAYS NEED TO EXPORT EACH MODEL SO IT CAN BE USED
module.exports = {Post};
