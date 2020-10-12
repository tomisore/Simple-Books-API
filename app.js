var express = require('express');
var app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.json());
//Logs
const log = console.log;

const postsRoute = require('./routes/posts');
const authorRoute = require('./routes/author');
app.use('/posts', postsRoute["router"])
app.use('/author', authorRoute["router"])


const fs = require('fs');

// Local System
const startSystem = () => {
	let status = {};

	try {
		status = getSystemStatus();
	} catch(e) {
		status = {
			numPosts: 0,
			numAuthors: 0,
			systemStartTime: new Date(),
		}

		fs.writeFileSync('status.json', JSON.stringify(status))
	}

	return status;
}

// Get current system status
const getSystemStatus = () => {
	const status = fs.readFileSync('status.json')
	return JSON.parse(status)
}

/* Helper functions to save JSON */
// You can add arguments to updateSystemStatus if you want.
const updateSystemStatus = () => {
	const status = {
		numPosts: getAllPosts().length,
		numAuthors: getAllAuthors().length,
		systemStartTime: new Date(),
	};
	/* Add your code below */
	fs.writeFileSync('status.json', JSON.stringify(status))
}

// Get all Posts
const getAllPosts = () => {
	try {
		const postsFromFile = fs.readFileSync('posts.json')
		return JSON.parse(postsFromFile)
	} catch (e) { // write proper catch
		return []
	}
};
// Get all authors
const getAllAuthors = () => {
	try {
		const authorsFromFile = fs.readFileSync('authors.json')
		return JSON.parse(authorsFromFile)
	} catch (e) { // write proper catch
		return []
	}
};

// Route 01: Ping Server 
app.get("/ping", (req, res, next) => {
    res.json([{"success" : true}]);
    res.status(200)
});

// Listening on port 3000
app.listen(3000, () => {
    startSystem();
    updateSystemStatus();
    log("server running on port 3000");
});
