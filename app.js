(function() {
    'use strict';
    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', "https://coursera-jhu-default-rtdb.firebaseio.com")
        .directive('foundItems', FoundItemsDirective);

    function FoundItemsDirective() {
        var ddo = {
            restrict: "E",
            templateUrl: 'foundItems.html',
            scope: {
                items: '<',
                myTitle: '@title',
                onRemove: '&'
            },
        };
        return ddo;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var menu = this;
        menu.searchTerm = "";
        menu.nothingFound = "";
        menu.foundItems = [];
        menu.search = function() {
            menu.nothingFound = "";
            console.log("menu.searchTerm:" + menu.searchTerm);
            if (menu.searchTerm) { // check if empty
                var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm.toLowerCase());
                promise.then(function(foundItems) {
                    if (foundItems.length == 0) {
                        menu.nothingFound = "Nothing found";
                    }
                    menu.foundItems = foundItems;
                })
                 .catch(function (error) {
                  console.log("Something went terribly wrong.");
                });

            } else {
                menu.nothingFound = "Nothing found";
                menu.foundItems = "";
            }
        };
        menu.removeItem = function(itemIndex) {
            menu.foundItems.splice(itemIndex, 1);
        };
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath']
    function MenuSearchService($http, ApiBasePath) {
        var service = this;
        service.getMatchedMenuItems = function(searchTerm) {
            var response = $http({
              method: "GET",
              url: (ApiBasePath + "/menu_items.json")
            })
            console.log("response: " + response);
            return response;
        };
    }

})();
