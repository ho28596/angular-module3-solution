
(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.constant('ApiBasePath', "https://coursera-jhu-default-rtdb.firebaseio.com");
  
function FoundItemsDirective() {
  var ddo = {
    restrict: "E",
    templateUrl: 'foundItems.html',
    scope: {
      foundItems: '<',
      onRemove: '&'
    }
  }
  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;
  menu.searchTerm = "";
  menu.found = [];
  
  menu.filterMenu = function () {
    menu.found = [];   
    if (!menu.searchTerm) {
      return;
    }

    MenuSearchService.getMatchedMenuItems(menu.searchTerm)
      .then(function (foundItems) {
          menu.found = foundItems;
      })
      .catch(function (error) {
        console.log("Something went terribly wrong.");
      });
    } 
  };

  menu.removeItem = function (itemIndex) {
    menu.found.splice(itemIndex, 1);
  };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    
    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    })
    .then(function (result) {
      // process result and only keep items that match
        var allItems = [];
        var foundItems = [];
           
        // Iterate through all categories and collect all menu items
        for (var category in result.data) {
             if (result.data[category].menu_items) {
                allItems = allItems.concat(result.data[category].menu_items);
             }
        }
        // Filter items by search term
        for (var i = 0; i < allItems.length; i++) {
           if (allItems[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
              foundItems.push(allItems[i]);
           }
        }
        return foundItems;
  });

  service.removeItem = function (itemIndex) {

  };
};
}

})();
