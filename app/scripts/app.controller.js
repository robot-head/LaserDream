'use strict';

angular
  .module('app')
  .controller('AppController', AppController);

AppController.$inject = ['$rootScope', 'etherdream'];

function AppController ($scope, etherdream)
{
  $scope.lasers = etherdream.lasers;

  $scope.setLaser = function(laser) {
    $scope.selectedLaser = laser;
  };

  $scope.startLaserDemo = function() {

  };

  $scope.stopLaserDemo = function() {

  };



}
