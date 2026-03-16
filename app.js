(function (){
  "use strict";

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService' , MenuSearchService)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com/")
  .directive("foundItems", function() {
    var ddo = {
      restrict:'E',
      templateUrl: 'fooditems.html',
      scope: {
        foundItems: '<',
        myTitle: '@title',
        onRemove: '&'
      },
      // controller: 'ShoppingListDirectiveController as list',
      controller: FoundItemsController,
      controllerAs: 'fic',
      bindToController: true
    };
    return ddo;
  });
  function FoundItemsController(){
    var list = this;
  }
  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService){
    var cntrl = this;
    cntrl.searchTerm;
    cntrl.found;
    cntrl.error;
    cntrl.finder = function(){
      var finder = MenuSearchService.getMatchedMenuItems(cntrl.searchTerm);
                                      finder.then(function (response) {
                                        cntrl.found = response;
                                      })
                                      .catch(function (error) {
                                        console.log("An Error Occured !");
                                      });
    }
    cntrl.remover = function(key){
      cntrl.found.splice(key, 1);
    }
  }
  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService ($http , ApiBasePath){
    var service = this;
    service.getMatchedMenuItems = function(searchTerm){
      return $http({
        method: "GET",
        url: (ApiBasePath + "menu_items.json")}
      ).then(function (result) {
          // process result and only keep items that match
          var fitems = result.data.menu_items;
          var foundItems = [];
          angular.forEach(fitems , function(value, key) {
            //console.log(value);
            if(value.description.indexOf(searchTerm) !== -1){
              foundItems.push({'short_name':value.short_name , 'name': value.name , 'description':value.description});
            }
          });
          // return processed items
          return foundItems;
      });
    }
  }
})();
