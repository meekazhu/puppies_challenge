user = require('../controllers/user')
post = require('../controllers/post')

module.exports = function(app){

	app.post('/user',
		user.create)

	app.get('/user/:user_id',
		user.read)

	app.post('/user/:user_id/post/',
		post.create)

	app.put('/user/:user_id/post/:post_id/like/',
		user.updateLikeList,
		post.updateLikeList)

	app.get('/user/:user_id/posts',
		user.readAllPosts)

	app.get('/user/:user_id/liked_posts',
		user.readAllLikedPost)

}