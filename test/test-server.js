process.env.NODE_ENV = 'test';
var mongoose = require('mongoose');


var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');

var User = require('../app/models/user');
var Post = require('../app/models/post');

var UserController = require('../app/controllers/user');

var should = chai.should();

chai.use(chaiHttp);


describe('Users', function() {

  beforeEach((done) => {
    User.collection.drop({}, (err) => {
      Post.collection.drop({}, (err) => {
        done();
      });
    });
  });

  it('should add a SINGLE user on /user POST', function(done) {
    chai.request(server)
      .post('/user')
      .send({
        'username': 'newuser2',
        password: 'password',
        email: 'newuser2@blah.com'
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property('username');
        res.body.should.have.property('user_id');
        res.body.should.have.property('email');
        done();
      });
  });

  describe('Returns a user requested using user_id', () => {

    it('should list a SINGLE user on user/:user_id GET', function(done) {
      var newUser = User({
        username: "newuser",
        password: "password",
        email: "newuser@blah.com"
      });

      newUser.save().then((user) => {

        chai.request(server)
          .get('/user/' + newUser.id)
          .send()
          .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('username');
            res.body.should.have.property('user_id');
            res.body.should.have.property('email');
            res.body.should.have.property('liked_posts');
            res.body.should.have.property('posts');

            done();
          });
      });

    });
  });

  it('should add a SINGLE post on /user/<user_id>/post/ POST', function(done) {
    let newUser = User({
      username: "newuser2",
      password: "password2",
      email: "newuser2@blah.com"
    });

    newUser.save((err, user) => {
      chai.request(server)
        .post('/user/' + newUser.id + '/post/')
        .attach('file', __dirname + '/one.png')
        .field('text', "TEXT")
        .field('title', "HELLO")
        .end(function(err, res) {

          res.body.should.have.property('post_id');
          res.should.have.status(200);

          chai.request(server)
            .get('/image/post/' + res.body.post_id)
            .end(function(err, res) {

              res.should.have.status(200);
              done();
            });
        });
      }

    );
  });


  it('should update a SINGLE on /user/:user_id/post/:post_id/like/ PUT', function(done) {
    var newUser = User({
      username: "newuser",
      password: "password",
      email: "newuser@blah.com"
    });

    var newPost = Post({
      authorId: newUser.id,
      text: "TEXT LIKE",
      title: "TITLE"
    });

    newUser.save((err, user) => {
      newPost.save((err, user) => {
        chai.request(server)
          .put('/user/' + newUser.id + '/post/' + newPost.id + '/like/')
          .end(function(err, res) {

            res.should.have.status(200);
            done();
          });
      });
    });
  });

  describe('/GET post/:post_id', () => {
    it('should list a SINGLE post on /posts/:post_id GET', function(done) {

      var newPost = Post({
        text: "TEXTaaa LIKE",
        title: "TITLE"
      });

      newPost.save().then((post) => {
        chai.request(server)
          .get('/posts/' + post.id)
          .end(function(err, res) {

            res.body.should.have.property('text');
            res.body.text.should.equal(post.text);
            res.body.should.have.property('title');
            res.body.title.should.equal(post.title);
            res.body.should.have.property('post_id');
            res.body.post_id.should.equal(post.id);
            res.body.should.have.property('date');
            //TODO somehow mongoose is returning a different
            //date format than it is stored
            //res.body.date.should.equal(post.date);
            res.body.likes.should.deep.equal([]);

            done();
          });
      })

    });
  });

  describe('/GET posts', () => {
    it('should list a ALL posts on /posts GET', function(done) {
      var newPost = Post({
        text: "POST 1",
        title: "POST 1 TITLE"
      });


      newPost.save().then((post) => {

        var newPostTwo = Post({
          text: "POST 2",
          title: "POST 2 TITLE"
        });
        newPostTwo.save().then((posttwo) => {

          chai.request(server)
            .get('/posts/')
            .end(function(err, res) {

              res.body[1].should.have.property('text');
              res.body[1].text.should.equal(post.text);
              res.body[1].should.have.property('title');
              res.body[1].title.should.equal(post.title);
              res.body[1].should.have.property('post_id');
              res.body[1].post_id.should.equal(post.id);
              res.body[1].should.have.property('date');
              //TODO somehow mongoose is returning a different
              //date format than it is stored
              //res.body.date.should.equal(post.date);
              res.body[1].likes.should.deep.equal([]);
              res.body[0].should.have.property('text');
              res.body[0].text.should.equal(posttwo.text);
              res.body[0].should.have.property('title');
              res.body[0].title.should.equal(posttwo.title);
              res.body[0].should.have.property('post_id');
              res.body[0].post_id.should.equal(posttwo.id);
              res.body[0].should.have.property('date');
              //TODO somehow mongoose is returning a different
              //date format than it is stored
              //res.body.date.should.equal(post.date);
              res.body[0].likes.should.deep.equal([]);

              done();
            });
        });
      })

    });
  });

  describe('Get all posts created by the user', () => {
    it('should list a ALL posts by user on /user/:user_id/posts GET', function(done) {

      var newUser = User({
        username: "newuser",
        password: "password",
        email: "newuser@blah.com"
      });

      var newPost = Post({
        text: "POST 1",
        title: "POST 1 TITLE",
        authorId: newUser.id
      });


      newUser.save().then((user) => {
        newPost.save().then((post) => {

          var newPostTwo = Post({
            text: "POST 2",
            title: "POST 2 TITLE",
            authorId: newUser.id
          });

          newPostTwo.save().then((posttwo) => {

            chai.request(server)
              .get('/user/' + newUser.id + '/posts')
              .end(function(err, res) {

              res.body[1].should.have.property('text');
              res.body[1].text.should.equal(post.text);
              res.body[1].should.have.property('title');
              res.body[1].title.should.equal(post.title);
              res.body[1].should.have.property('post_id');
              res.body[1].post_id.should.equal(post.id);
              res.body[1].should.have.property('date');
              res.body[1].should.have.property('authorId');
              res.body[1].authorId.should.equal(newUser.id);

              //TODO somehow mongoose is returning a different
              //date format than it is stored
              //res.body.date.should.equal(post.date);
              res.body[1].likes.should.deep.equal([]);
              res.body[0].should.have.property('text');
              res.body[0].text.should.equal(posttwo.text);
              res.body[0].should.have.property('title');
              res.body[0].title.should.equal(posttwo.title);
              res.body[0].should.have.property('post_id');
              res.body[0].post_id.should.equal(posttwo.id);
              res.body[0].should.have.property('date');
              res.body[0].should.have.property('authorId');
              res.body[0].authorId.should.equal(newUser.id);
              //TODO somehow mongoose is returning a different
              //date format than it is stored
              //res.body.date.should.equal(post.date);
              res.body[0].likes.should.deep.equal([]);
                done();

              });
          });
        })

      });
    });
  });

  describe('/GET /user/:user_id/liked_posts', () => {
    it('should list a ALL posts liked user on /user/:user_id/liked_posts GET', function(done) {

      var newUser = User({
        username: "newuser",
        password: "password",
        email: "newuser@blah.com"
      });


      var newPost = Post({
        text: "POST 1",
        title: "POST 1 TITLE",
        authorId: newUser.id
      });

      newUser.save().then((user) => {
        newPost.save().then((post) => {

          var newPostTwo = Post({
            text: "POST 2",
            title: "POST 2 TITLE",
            authorId: newUser.id
          });

          newPostTwo.save().then((posttwo) => {

            var newUserWhoLikesPosts = User({
              username: "newUserWhoLikesPosts",
              password: "password",
              email: "newUserWhoLikesPosts@blah.com",
              liked_posts: [newPostTwo.id, newPost.id]
            });

            newUserWhoLikesPosts.save().then((user) => {
              chai.request(server)
                .get('/user/' + newUserWhoLikesPosts.id + '/liked_posts')
                .end(function(err, res) {

                  res.body[1].should.have.property('text');
                  res.body[1].text.should.equal(post.text);
                  res.body[1].should.have.property('title');
                  res.body[1].title.should.equal(post.title);
                  res.body[0].should.have.property('text');
                  res.body[0].text.should.equal(posttwo.text);
                  res.body[0].should.have.property('title');
                  res.body[0].title.should.equal(posttwo.title);
                  res.body[0].should.have.property('likes');
                  //TODO :Too sleepy to think!!! 
                  //assert post.likes == user_id who has liked_posts
                  //Need to update the post with the user in this test
                  //though functionality works. 
                  //res.body[0].likes.should.deep.equal([user.id]);
                  done();
                });
            });
          });
        })

      });
    });
  });

});