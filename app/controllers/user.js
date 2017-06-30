var User = require('../models/user');
var Post = require('../models/post');
// var postController = require('../controllers/post');

module.exports.authenticate = function(req, res, next) {
	user.comparePassword(req.params.username, req.params.password)
	return
}


var user_cb =
	function(req, res) {
		return function(err, user) {

			if (err)
			res.status(500).send(err);
			
			let userObj = user.toObject();

			delete userObj["password"]
			delete userObj["__v"]
			userObj["user_id"] = userObj["_id"]
			delete userObj["_id"]
			res.json(userObj);
		}
	}

module.exports.create = function(req, res, next) {

	var newUser = User({
		username: req.body.username,
		password: req.body.password,
		email: req.body.email
	});

	newUser.save(user_cb(req, res));

}

module.exports.read = function(req, res, next) {
	User.findById(req.params.user_id, user_cb(req, res));

}

module.exports.updateLikeList = function(req, res, next) {
	User.findByIdAndUpdate(req.params.user_id, {
			"$addToSet": {
				"liked_posts": req.params.post_id
			}
		}, {
			"new": true,
			"upsert": true
		},
		function(err, user) {
			if (err)
				res.status(500).send(err);
			next();
		});

}



module.exports.readAllLikedPost = function(req, res, next) {
	User.findById(req.params.user_id, function(err, user) {

		req.body.post_id = user.liked_posts
		next()

	});
}