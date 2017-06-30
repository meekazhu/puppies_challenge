'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true , strict: true},
  email:{ type: String, required: true, unique: true },
  posts: [{type: Schema.ObjectId, ref: 'Post', unique:true}] ,
  liked_posts: [{type: Schema.ObjectId, ref: 'Post', unique:true}],
});


module.exports = mongoose.model('User', userSchema);