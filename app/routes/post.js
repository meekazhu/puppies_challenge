post = require('../controllers/post')

/*
 API calls for post related resources.
 Note: 
- usage of /:user_id e.g in app.get(/user/:user_id) 
 means req.params.user_id = value is set
- req = request obj, res = response obj
 */
module.exports = function(app) {
	
	/*	Request  : 
			Content-Type:None
		Response  :
			e.g req.body = {"text":"POST 2",
				"title":"POST 2 TITLE",
				"authorId":"595632fdffc5d147cf0b7e02",
				"date":"2017-06-30T11:16:13.712Z",
				"likes":[],
				"post_id":"595632fdffc5d147cf0b7e04"}
	*/
	app.get('/posts/:post_id', post.read)

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
	app.get('/posts', post.readAll)

}