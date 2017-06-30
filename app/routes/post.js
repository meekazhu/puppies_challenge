post = require('../controllers/post')

module.exports = function(app) {

	app.get('/posts/:post_id', post.read)

	app.get('/posts', post.readAll)

	app.get('/image/:post_id', post.readImage);

}