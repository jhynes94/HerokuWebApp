(function(){
    angular
        .module("WebAppMaker")
        .controller("NewCatalogController", NewCatalogController);

    function NewCatalogController($routeParams, CatalogService, $location) {
        var vm = this;
        vm.uid = $routeParams["uid"];
        vm.type = $routeParams["type"];
        vm.createPost = createPost;

        function init() {

        }
        init();

        function createPost(){
            /*if(vm.name === undefined || vm.name === ""){
                vm.error = "Name must have a Value";
                return null;
            }*/
            var post = {};

            post.PN = vm.PN;
            console.log("Part Number: " + vm.PN);
            post.MPN = vm.MPN;
            console.log("Man Part Number: " + vm.MPN);
            post.Description = vm.Description;
            console.log("Description: " + vm.Description);

            BlogService.createPost(post)
                .then(function(response) {
                    $location.url("/catalog");
                });
        }
    }
})();
