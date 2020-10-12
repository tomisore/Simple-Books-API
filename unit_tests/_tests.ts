var assert = require('assert');
const authorRoute = require('../routes/author');
const postsRoute = require('../routes/posts');

describe('Author Tests', function () {
  // getOneAuthorbyId ()
  describe('getOneAuthorbyId()', function () {
    it('should return one author', function () {
      assert.equal(authorRoute.getOneAuthorbyId(5).authorId, 5);
    });

    it('should return no author', function () {
      assert.equal(authorRoute.getOneAuthorbyId(24000), undefined);
    });

    it('Wrong Input: should return no author', function () {
      assert.equal(authorRoute.getOneAuthorbyId("String"), undefined);
    });
  });

  //getAllAuthors()
  describe('getAllAuthors()', function () {
    it('should get all authors without error', function () {
      assert(authorRoute.getAllAuthors() instanceof Array) ;
    });
  });

  //saveAuthorsToJSONFile()
  describe('saveAuthorsToJSONFile()', function () {
    it('should save all authors without error', function (done) {
      var authors = authorRoute.getAllAuthors();
      authorRoute.saveAuthorsToJSONFile(authors);
      done();
    });
  });

});


describe('Posts Tests', function () {
  // getOnePostsbyId()
  describe('getOneAuthorbyId()', function () {
    it('should return one post', function () {
      assert.equal(postsRoute.getOnePostsbyId(5).id, 5);
    });

    it('should return no post', function () {
      assert.equal(postsRoute.getOnePostsbyId(24000), undefined);
    });

    it('Wrong Input: should return no post', function () {
      assert.equal(postsRoute.getOnePostsbyId("String"), undefined);
    });
  });

  //getAllAuthors()
  describe('getAllPosts()', function () {
    it('should get all posts without error', function () {
      assert(postsRoute.getAllPosts() instanceof Array) ;
    });
  });

  //saveAuthorsToJSONFile()
  describe('savePostsToJSONFile()', function () {
    it('should save all authors without error', function (done) {
      var posts = postsRoute.getAllPosts();
      postsRoute.savePostsToJSONFile(posts);
      done();
    });
  });


  //getPostbyTags
  describe('getPostbyTags()', function () {
    it('should get posts containting tags', function () {
      var tags = ['drama']
      assert.equal(postsRoute.getPostbyTags(tags).length , 2);
    });

    it('should get get no posts since tags dont exist', function () {
      var tags = ['rumble']
      assert.equal(postsRoute.getPostbyTags(tags).length , 0);
    });

    it('should get get no posts, with empty tags', function () {
      var tags = []
      assert.equal(postsRoute.getPostbyTags(tags).length , 0);
    });
  });

  // Intersection 
  describe('Intersection()', function () {
    it('should get intersection', function () {
      var a = [1,2,3]
      var b = [2]
      assert.equal(postsRoute.intersection(new Set(a),new Set(b)).size , 1);
    });

    it('should get no intersection', function () {
      var a = [1,2,3]
      var b = [5,7]
      assert.equal(postsRoute.intersection(new Set(a),new Set(b)).size , 0);
    });

    it('Empty set intersection', function () {
      var a = [1,2,3]
      var b = []
      assert.equal(postsRoute.intersection(new Set(a),new Set(b)).size , 0);
    });

  });

});