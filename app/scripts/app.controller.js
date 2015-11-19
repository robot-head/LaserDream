'use strict';

angular
  .module('app')
  .controller('AppController', AppController);

AppController.$inject = ['$rootScope', 'etherdream'];

function AppController ($scope, etherdream)
{
  $scope.startLaserDemo = function() {

  };

  $scope.stopLaserDemo = function() {

  };

}
