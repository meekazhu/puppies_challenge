user = require('../controllers/user')
post = require('../controllers/post')


/*
 API calls for user related resources.
 Note: 
- usage of /:user_id e.g in app.get(/user/:user_id) 
 means req.params.user_id = value is set
- req = request obj, res = response obj
 */

module.exports = function(app) {
	/*// TODO
	app.get('/user',
	 	user.authenticate)
	*/

	/*	Request  : 
			Content-Type:application/json
			req.body = {
				"username": String,
				"password": String,
				"email": String
			}	
		Response  :
			e.g req.body = {
				"username":"newuser2",
				"email":"newuser2@blah.com",
				"user_id":"5956233265de304646f39a47",
				"liked_posts":[],
				"posts":[]}
	*/
	app.post('/user',
		user.create)

	/*	Request  : 
			Content-Type:None
		Response  :
			e.g req.body = {
			 	"username":"newuser2",
				"email":"newuser2@blah.com",
				"user_id":"5956233265de304646f39a47",
				"liked_posts":[],
				"posts":[]}		
	*/
	app.get('/user/:user_id',
		user.read)

	/*	Request  : 
			Content-Type:multipart/form-data
			req.files = {
				"file": Binary,
				"title": String,
				"text": String
			}	
		Response  :
			e.g req.body = {
					"post_id":"595624c5f94c19465cc9417b"
				}
	*/
	app.post('/user/:user_id/post/',
		post.create)

	/*	Request  : 
			Content-Type:multipart/form-data
			req.files = {
				"file": Binary,
				"title": String,
				"text": String
			}	
		Response  :
			e.g req.body = {
				[<binary of img>]
			}
	*/
	app.get('/image/post/:post_id',
		post.readImage)

	/*	Request  : 
			Content-Type:None
		Response  :
			e.g req.status = 200
	*/
	app.put('/user/:user_id/post/:post_id/like/',
		user.updateLikeList,
		post.updateLikeList)

	/*	Request  : 
			Content-Type:None
		Response  :
			e.g req.body = 
				[{"text":"POST 2",
				"title":"POST 2 TITLE",
				"authorId":"595632fdffc5d147cf0b7e02",
				"date":"2017-06-30T11:16:13.712Z",
				"likes":[],
				"post_id":"595632fdffc5d147cf0b7e04"}]
	*/
	app.get('/user/:user_id/posts',
		post.readAllPostsByUser)

	/*	Request  : 
			Content-Type:None
		Response  :
			e.g req.body = 
				[{"text":"POST 2",
				"title":"POST 2 TITLE",
				"authorId":"595632fdffc5d147cf0b7e02",
				"date":"2017-06-30T11:16:13.712Z",
				"likes":[],
				"post_id":"595632fdffc5d147cf0b7e04"}]
	*/
	app.get('/user/:user_id/liked_posts',
		user.readAllLikedPost,
		post.readPostsById)


}