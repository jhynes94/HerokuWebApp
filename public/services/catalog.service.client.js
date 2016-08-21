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
            addPartFromBarcode: addPartFromBarcode,
            deletePost: deletePost  };
        return api;

        function addPartFromBarcode(barcode) {
            var url = "/catalog/barcode/" + barcode;
            return $http.get(url);
        }
        function search(query) {
            var url = "/api/part?search=" + query;
            return $http.get(url);
        }
        function createPost(post) {
            var url = "/catalog";
            return $http.post(url, post);
        }
        function getAllPosts() {
            var url = "/catalog";
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
            var url = "/catalog/" + postId;
            return $http.delete(url);
        }
    }
})();
