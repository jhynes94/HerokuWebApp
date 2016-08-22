(function(){
    angular
        .module("WebAppMaker")
        .controller("CatalogListController", CatalogListController);

    function CatalogListController($routeParams, CatalogService, $sce) {
        var vm = this;
        vm.search = search;
        vm.deletePart = deletePart;
        vm.AddPartWithBarcode = AddPartWithBarcode;
        vm.SearchCanceled = SearchCanceled;

        function init() {
            CatalogService
                .getAllPosts()
                .then(function (response) {
                    console.log(response.data);
                    vm.posts = response.data;
                });
        }
        init();

        function SearchCanceled() {
            vm.cancelSearch = null;
            CatalogService
                .getAllPosts()
                .then(function (response) {
                    console.log(response.data);
                    vm.posts = response.data;
                });
        }

        function deletePart(id) {
            console.log("Deleteing item: " + id);
            CatalogService
                .deletePost(id)
                .then(function (response) {
                    CatalogService
                        .getAllPosts()
                        .then(function (response) {
                            console.log(response.data);
                            vm.posts = response.data;
                        });
                });
        }

        function search(query) {
            console.log("Searching for: " + query);
            CatalogService
                .search(query)
                .then(function (response) {
                    console.log(response.data);
                    vm.posts = response.data;
                });

            //Show Cancel Search Button
            vm.cancelSearch = 1;
        }

        function AddPartWithBarcode(barcode) {
            console.log("Attempting to add: " + barcode);
            CatalogService
                .addPartFromBarcode(barcode)
                .then(function (response) {
                    console.log(response.data);
                    vm.posts = response.data;
                    vm.success = "Part added from Barcode!";
                    vm.error = undefined;
                }, function (error) {
                        vm.error = "Failed to add barcode";
                        vm.success = undefined;
                });
        }
    }
})();
