(function(){
    angular
        .module("WebAppMaker")
        .config(Config);

    function Config($routeProvider) {

        function checkLoggedin(UserService, $q, $location, $rootScope) {

            var deferred = $q.defer();
            console.log("Attempting to login using Client Service");

            UserService
                .checkLoggedin()
                .then(
                    function(response) {
                        var user = response.data;
                        console.log("Client Service Responce:");
                        console.log(user);
                        if(user == '0') {
                            deferred.reject();
                            $rootScope.currentUser = null;
                            $location.url("/login")
                        } else {
                            $rootScope.currentUser = user;
                            deferred.resolve();
                        }
                    },
                    function(err) {
                        console.log(err);
                        $rootScope.currentUser = null;
                        deferred.reject();
                    }
                );

            return deferred.promise;
        }

        $routeProvider
            .when("/login", {
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/", {
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/default", {
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "views/user/register.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/user", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: { "loggedin": checkLoggedin }
            })
            .when("/user/:uid", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: { "loggedin": checkLoggedin }
            })
            .when("/catalog", {
                templateUrl: "views/catalog/catalog-list.view.client.html",
                controller: "CatalogListController",
                controllerAs: "model"
            })
            .when("/catalog/addItem", {
                templateUrl: "views/catalog/catalog-new.view.client.html",
                controller: "NewCatalogController",
                controllerAs: "model"
            })
            .otherwise({
                redirectTo: "/login"
            });
    }
})();
