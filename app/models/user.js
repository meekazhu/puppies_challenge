'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true , strict: true},
  email:{ type: String, required: true, unique: true },
  posts: [{type: Schema.ObjectId, ref: 'Post', unique:true}] ,
  liked_posts: [{type: Schema.ObjectId, ref: 'Post', unique:true}],
  image:{type:Buffer} 
});


module.exports = mongoose.model('User', userSchema);