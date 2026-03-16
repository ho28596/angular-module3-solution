
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
  menu.categories = ["L","A","B","SP","C","F","V","DK","VG","CU","NL","NF","PF","FR","CM","FY","SO","DS","D","SR"];
  menu.searchTerm = "";
  menu.found = [];
  
  //recupero le categorie del menu
  //var promise = MenuSearchService.getCategories();
  //  promise.then(function (response) {
  //  menu.categories = response.data;
  //})
  //.catch(function (error) {
  //  console.log("Something went terribly wrong during get categories");
  //});

  menu.filterMenu = function () {
    if (!menu.searchTerm) {
      menu.found = [];
      return;
    }

    for (var category of menu.categories) {  
      var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm, category);
      promise.then(function (foundItems) {
          menu.found.push.apply(menu.found, foundItems);
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

  service.getCategories = function () {
    return $http({
      method: "GET",
      url: (ApiBasePath + "/categories.json")
    })
  };
  
  service.getMatchedMenuItems = function (searchTerm, searchCat) {
    this.searchCat = searchCat;
    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items/" + searchCat + ".json")
    })
    .then(function (result) {
      // process result and only keep items that match
    var foundItems = result.data.menu_items.filter(function (item) {
      return item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
    }, service);

    // return processed items
    return foundItems;
  });

  service.removeItem = function (itemIndex) {

  };
};
}

})();
