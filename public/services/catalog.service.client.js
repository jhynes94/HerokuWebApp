(function() {
    angular.module("WebAppMaker")
        .factory("CatalogService", CatalogService);

    function CatalogService($http) {

        var api = {
            createPost: createPost,
            getAllPosts: getAllPosts,
            getPostById: getPostById,
            updatePost: updatePost,
            search: search,
            deletePost: deletePost  };
        return api;

        function search(query) {
            var url = "/hike/blog/search/" + query;
            return $http.get(url);
        }
        function createPost(post) {
            var url = "/hike/blog/createPost";
            return $http.post(url, post);
        }
        function getAllPosts() {
            var url = "/hike/blog/getPosts";
            return $http.get(url);
        }
        function getPostById(postId) {
            var url = "/hike/blog/" + postId;
            return $http.get(url);
        }
        function updatePost(postId, post) {
            var url = "/hike/blog/" + postId;
            return $http.put(url, post);
        }
        function deletePost(postId) {
            var url = "/hike/blog/" + postId;
            return $http.delete(url);
        }
    }
})();