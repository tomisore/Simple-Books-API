const express = require('express');
const { Router } = require('express');

const fs = require('fs');
const router = express.Router();

router.get("/", (req,res) => {
    res.send("Authors")
});

// Get an Author by id
router.get("/:id",function(req, res, next) {
    const result = getOneAuthorbyId(req.params.id)
    console.log(result)
    res.send(result)
});   

//Create an author
router.post("/", (req, res) => {
    const authorsList = getAllAuthors();
    
    //Mabye make helper method
    const idResult = authorsList.find( element => element.authorId == req.body.authorId );
    const nameResult = authorsList.find( element => element.authorName == req.body.authorName );
	if(idResult == undefined && nameResult == undefined ){
        // if no duplicate names:
        const author =  {} 
        var newAuthor = Object.create(author); // remove null and assign it to proper value
        newAuthor.authorId = req.body.authorId;
        newAuthor.authorName = req.body.authorName;
        authorsList.push(newAuthor);
        saveAuthorsToJSONFile(authorsList);
        res.send(newAuthor)
    }else{
        res.send("Author already Exists.")
    }
});


/* Helper Methods for POST and GET method */

//HELPER METHOD: Get all authors
const getAllAuthors = () => {
	try {
		const authorsFromFile = fs.readFileSync('authors.json')
		return JSON.parse(authorsFromFile)
	} catch (e) { // write proper catch
		return []
	}
};

//HELPER METHOD: Save Authors to a JSON file
const saveAuthorsToJSONFile = (authors) => {
	/* Add your code below */
	fs.writeFileSync('authors.json', JSON.stringify(authors))
};

//HELPER METHOD: Get One author by id
const getOneAuthorbyId = (id) => { 
    if ( !isNaN(id)){
        const authorsList = getAllAuthors();
        const authorsWithId = authorsList.filter((authors) => authors.authorId == id);
        return authorsWithId[0]
    }else{
        return undefined
    }
}

module.exports = {
    "router": router,
    getOneAuthorbyId,
    saveAuthorsToJSONFile,
    getAllAuthors

}
