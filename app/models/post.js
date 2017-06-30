var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var postSchema = new Schema({
  title: String,
  authorId:{type: Schema.ObjectId, ref: 'User'},
  text: String,
  likes:[{type: Schema.ObjectId, ref: 'User'}],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);