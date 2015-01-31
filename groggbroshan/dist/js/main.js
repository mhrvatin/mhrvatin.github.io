angular.module('groggbroshan', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/add', {
        templateUrl: 'partials/add-drink.html',
        controller: 'AddDrinkController as add'
      })
      .otherwise({
        redirectTo: '/',
        templateUrl: 'partials/main.html',
        controller: 'MainController as main'
      })
  });
(function () {
  'use strict';

  angular
    .module('groggbroshan')
    .controller('MainController', ['$http', '$log', MainController]);

  function MainController($http, $log) {
    var vm = this;

    vm.ingredients = [];
    vm.newIngredient = '';

    vm.handleIngredients = function (ingredient) {
      vm.addIngredient(ingredient);
      vm.showRecipies(vm.ingredients);
    };

    vm.addIngredient = function (ingredient) {
      vm.ingredients.push(ingredient);
      vm.newIngredient = '';
    };

    vm.showRecipies = function (ingredient) {
      vm.returnedDrinks = '';
      vm.returnedIngredients = '';

      $http.post('php/postRecipe.php', ingredient).
        success(function (result) {
          vm.result = true;
          vm.returnedDrinks = result.drink.name;
          vm.returnedIngredients = result.ingredients;
        }).
        error(function (data, status, headers, config) {
          $log.error(data);
          $log.error(status);
          $log.error(headers);
          $log.error(config);

          vm.result = "Ett oväntat fel har påträffats. Var vänlig försök igen.";
        });
    };
  }

}());
(function () {
  'use strict';

  angular
    .module('groggbroshan')
    .controller('AddDrinkController', ['$http', '$log', AddDrinkController]);

  function AddDrinkController($http, $log) {
    var vm = this;

    vm.ingredients = [];
    vm.newIngredient = '';

    vm.getAllDrinks = function () {
      $http.get('php/getAllDrinks.php').
        success(function (result) {
          vm.allDrinks = result;
        }).
        error(function (data, status, headers, config) {
          $log.error(data);
          $log.error(status);
          $log.error(headers);
          $log.error(config);

          vm.result = "Ett oväntat fel har påträffats. Var vänlig försök igen.";
        });
    }

    vm.addIngredient = function (ingredient) {
      vm.ingredients.push(ingredient);
      vm.newIngredient = '';
    }

    vm.addNewDrink = function (name, ingredients) {
      $http.post('php/postAddNewDrink.php', {name: name, ingredients: ingredients}).
        success(function (data, status, headers, config) {
          vm.getAllDrinks();

          $log.info('Ny drink tillagd');
          $log.info(data);
        }).
        error(function (data, status, headers, config) {
          $log.error(data);
          $log.error(status);
          $log.error(headers);
          $log.error(config);
        });
    }

    vm.getAllDrinks();
  }

}());