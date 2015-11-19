'use strict';

angular
  .module('app')
  .controller('LaserController', LaserController);

LaserController.$inject = ['$scope', 'etherdream'];

function LaserController ($scope, etherdream)
{
  $scope.lasers = etherdream.lasers;
}
