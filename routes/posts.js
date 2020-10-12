const express = require('express');
const { Router } = require('express');
const fs = require('fs');
const router = express.Router();

router.get("/", (req,res) => {
    res.send("Posties")
});

// Get posts with tag and specificed sorting parameters.
router.get("/:tags/:sortBy/:direction",function(req, res, next) {
    var tags = req.params.tags;
    var sortBy = req.params.sortBy;
    var direction = req.params.direction;

    if(tags.length > 0){
        tags = tags.split(",");
    }else{
        res.status(400)
        res.send("Tag parameter is required. Form is tags seperated by comma as a string")
    }

    if(!(direction == 'asc'|| direction =='desc')){
        res.send("Must use 'asc' or 'desc' for parmaeter 3 : direction" )
    };
    if(['id', 'likes', 'reads', 'popularity'].includes(sortBy)){
        var selectedPosts = getPostbyTags(tags);
        var selectedPosts = sortElementsbyValue(sortBy, direction, selectedPosts);
        res.send(selectedPosts)
    }else{
        res.status(400)
        res.send("Cannot sort by specified value. Please use ['id', 'likes', 'reads', 'popularity']")
    }



});   
// Get posts by tags, with hardcoded sort parameters.
router.get("/:tags",function(req, res, next) {
    var tags = req.params.tags;
    var sortBy = "id";
    var direction = "asc";

    if(tags.length > 0){
        tags = tags.split(",");
    }else{
        res.status(400)
        res.send("Tag parameter is required. Form is tags seperated by comma as a string")
    }

    var selectedPosts = getPostbyTags(tags);
    var selectedPosts = sortElementsbyValue(sortBy, direction, selectedPosts);
    res.send(selectedPosts)
});   

//create a post
router.post("/", (req, res) => {
    const postsList = getAllPosts();
    
    //Mabye make helper method
    const idResult = postsList.find( element => element.id == req.body.id );
	if(idResult == undefined){
        // if no duplicate id post 
        const post =  {} 
        var newPost = Object.create(post); 
        newPost.id = req.body.id;
        newPost.author = req.body.author;
        newPost.authorId = req.body.authorId;
        newPost.likes = req.body.likes;
        newPost.popularity = req.body.popularity;
        newPost.reads = req.body.reads;
        newPost.tags = req.body.tags;
        // Maybe assert ypes first
        postsList.push(newPost);
        savePostsToJSONFile(postsList);
        res.send(newPost)
    }else{
        res.send("Post with this id already exists")
    }
});


/* Helper Methods for POST and GET method */

//HELPER METHOD: Get all Posts
const getAllPosts = () => {
	try {
		const postsFromFile = fs.readFileSync('posts.json')
		return JSON.parse(postsFromFile)
	} catch (e) { // write proper catch
		return []
	}
};

//HELPER METHOD: Save Authors to a JSON file
const savePostsToJSONFile = (posts) => {
	/* Add your code below */
	fs.writeFileSync('posts.json', JSON.stringify(posts))
};

//HELPER METHOD: Get One author by id
const getOnePostsbyId = (id) => { 
    if ( !isNaN(id)){
        const postsList = getAllPosts();
        const postsWithId = postsList.filter((post) => post.id == id);
        return postsWithId[0]
    }else{
        return undefined
    }
}

//HELPER METHOD: Sort elements in list by specified value and direction 
const sortElementsbyValue = (sortBy, direction, elementList) => { 
    if (elementList.length > 0){
        // sort by value
        elementList.sort(function (a, b) {
            if(sortBy == "id"){return a.id - b.id;}
            if(sortBy == "likes"){return a.likes - b.likes;}
            if(sortBy == "read"){return a.read - b.read;}
            if(sortBy == "popularity"){return a.popularity - b.popularity;}
        });
        if(direction == 'asc'){
            return elementList
        }else{
            return elementList.reverse()
        }
    }
}

//HELPER METHOD: Get all post that have at leats on tag specified.
const getPostbyTags = (tags) =>{
    const postsList = getAllPosts();
    const selectedPosts = [];
    if(tags.length > 0){
         for (post of postsList){
             const commonElements =  intersection(new Set(tags), new Set(post.tags))
             if (commonElements.size >0 ){
                selectedPosts.push(post)
             }
         }
    }
    return selectedPosts
}

//HELPER METHOD: Get the interesection between two sets.
const intersection = (setA, setB) => {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

module.exports =  {
    "router":router,
    getAllPosts,
    savePostsToJSONFile,
    getOnePostsbyId,
    sortElementsbyValue,
    getPostbyTags,
    intersection
}