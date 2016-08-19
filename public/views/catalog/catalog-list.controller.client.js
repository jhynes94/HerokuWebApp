(function(){
    angular
        .module("WebAppMaker")
        .controller("CatalogListController", CatalogListController);

    function CatalogListController($routeParams, CatalogService, $sce) {
        var vm = this;
        vm.search = search;
        vm.deletePart = deletePart

        function init() {
            CatalogService
                .getAllPosts()
                .then(function (response) {
                    console.log(response.data);
                    vm.posts = response.data;
                });
        }
        init();


        function deletePart(id) {
            console.log("Deleteing item: " + id);
            CatalogService
                .deletePost(id)
                .then(function (response) {
                    console.log(response.data);
                    vm.posts = response.data;
                });
        }

        function search(query) {
            console.log("Searching for: " + query);
            CatalogService
                .search(query)
                .then(function (response) {
                    console.log(response.data);
                    vm.posts = response.data;
                    if(vm.filter == "Hiker"){
                        filtersHiker();
                    }
                    if(vm.filter == "Driver"){
                        filtersDrivers();
                    }
                });
        }
    }
})();
