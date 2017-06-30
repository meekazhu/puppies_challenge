var Post = require('../models/post');
var User = require('../models/user');

const fs = require("fs");


parse_post = function(err, res, post) {

	if (err)
		res.status(500).send(err);

	let postObj = post.toObject();

	delete postObj["password"]
	delete postObj["__v"]
	postObj["post_id"] = postObj["_id"]
	delete postObj["_id"]
	return postObj;
}

var post_cb = function(req, res) {
	return function(err, post) {
		let parseObj = parse_post(err, res, post)

		res.json(parseObj);
	}
}

module.exports.create = function(req, res, next) {
	var fstream;

	req.pipe(req.busboy);

	let finished = false;

	var newPost = new Post();
	var newPostObj = Object();

	newPostObj["authorId"] = req.params.user_id;

	req.busboy.on('file', function(fieldname, file, filename) {
		fstream = fs.createWriteStream(__dirname + '/../../images/' + newPost.id);
		file.pipe(fstream);
		fstream.on('close', function() {
			if (finished) {

				User.findByIdAndUpdate(req.params.user_id, {
						"$addToSet": {
							"posts": newPost.id
						}
					}, {
						"new": true,
						"upsert": true
					},
					function(err, user) {
						if (err)
							res.status(500).send(err);

					});

				Post.update({
					_id: newPost.id
				}, newPostObj, {
					upsert: true
				}, (err, post) => {
					if (err)
						res.status(500).send(err);

					res.json({
						'post_id': newPost.id
					});

				});
			}
		});
	});

	req.busboy.on('field', (fieldname, val, filename) => {
		newPostObj[fieldname] = val;
	});

	req.busboy.on('finish', () => {
		finished = true;

	});

}

module.exports.updateLikeList = function(req, res, next) {
	Post.findByIdAndUpdate(req.params.post_id, {
			"$addToSet": {
				"likes": req.params.user_id
			}
		}, {
			"new": true,
			"upsert": true
		},
		function(err, post) {
			if (err)
				res.status(500).send(err);

			//TODO assuming this function is called last 
			//in onion routes
			res.sendStatus(200);

		});

}


module.exports.read = function(req, res, next) {
	Post.findById(req.params.post_id, post_cb(req, res));

}

module.exports.readAll = function(req, res, next) {

	var newestFirst = true;
	if (!req.params.newest_first)
		newestFirst = false;

	Post.find({}).sort({
		date: 'desc'
	}).exec(function(err, posts) {

		var parse_posts = []

		posts.forEach((post, index) => {
			parse_posts.push(parse_post(err, res, post))
		});

		res.json(parse_posts);
	});

}

module.exports.readAllPostsByUser = function(req, res, next) {
	Post.find({
		"authorId": req.params.user_id
	}).sort({
		date: 'desc'
	}).exec(function(err, posts) {
		var parse_posts = []

		posts.forEach((post, index) => {
			parse_posts.push(parse_post(err, res, post))
		});
		res.json(parse_posts);
	})
}

module.exports.readImage = function(req, res, next) {

	fs.readFile(__dirname + '/../../images/' + req.params.post_id, function(err, image) {
		if (err)
			res.status(500).send(err);
		res.writeHead(200, {
			'Content-Type': 'image/gif'
		});
		res.end(image, 'binary');
	});
}

module.exports.readPostsById = function(req, res, next) {
	Post.find({
		'_id': {
			$in: req.body.post_id
		}
	}).sort({
		date: 'desc'
	}).exec(function(err, posts) {
		var parse_posts = []

		posts.forEach((post, index) => {
			parse_posts.push(parse_post(err, res, post))
		});
		res.json(parse_posts);
	})
}