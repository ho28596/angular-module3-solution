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
               
        menu.search = function() {
            var promise = MenuSearchService.getMatchedMenuItems();
                promise.then(function(foundItems) {
                menu.foundItems = foundItems;
                console.log("foundItems: ' + menu.foundItems); 
                })
                .catch(function (error) {
                  console.log("Something went terribly wrong.");
                });

            }
        };
        menu.removeItem = function(itemIndex) {
            menu.foundItems.splice(itemIndex, 1);
        };
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath']
    function MenuSearchService($http, ApiBasePath) {
        var service = this;
        service.getMatchedMenuItems = function() {
            var response = $http({
              method: "GET",
              url: (ApiBasePath + "/menu_items.json")
            })
            return response;
        };
    }

})();
