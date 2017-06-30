****** puppies_challenge *********


-------------- Project setup and deployment -----------------------
#Required for installation
Install nodeJS v6.11.0
https://nodejs.org/en/download/

Install Mongodb 3.4 
https://docs.mongodb.com/manual/administration/install-community/


#Steps for installing libraries in OSX Ubuntu 16.04 setup 
Install nodeJS v6.11.0
$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
$ sudo apt-get install -y nodejs build-essential

Install Mongodb 3.4 
Follow instructions in https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

*********Install dependencies and run the server **********
***********************************************************
cd puppies_challenge/
npm install
npm start

runs on localhost:3000/
a running version is set up on AWS aswel, can access it 13.59.212.68:3000/

#Run the test
npm test


-------------- Highlights  -----------------------
- 8 out of 9 API features are implemented and their respective tests are added in test/test-server.js 
-When doing a POST using
	 /user/:user_id/post
one can submit text,title and image in one POST submission. The post(s) by the user can then be fetched using either
	/user/:user_id/posts
	/posts/:post_id
 but the image needs to be retrieved separately using this 
 	 /image/post/:post_id
This can be useful for lazy loading, incase the client doesn't want to retrieve the image for that post from the server just yet. Images are stored on disk with the name post_id, since each post has at most one image, it ensures that image names will be unique. 




-------------- Caveats -----------------------
There is no API support for authentication. Hence there is no way to ensure that whoever is doing GET/POST/PUT/DELETE has access to the respective data. If basic authentication was supported, all API's will need to validate the authentication key from the headers of the client's HTTP requests. Authentication key is a key returned to the client from the server whenever it validates the credentials.

-Also TODOs are commented in the code
