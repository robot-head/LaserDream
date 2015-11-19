'use strict';

angular
  .module('app')
  .factory('etherdream', ['$rootScope', '$interval', EtherDreamService]);


function EtherDreamService($scope, $interval) {
  var etherdream = require('node-etherdream');
  var service = {
    'etherdream': etherdream,
    'lasers': {}
  };
  $interval(findLasers, 10000);
  var findLasers = function() {
    etherdream.find(function (lasers) {
      angular.forEach(lasers, function(value, key) {
        this[value.name] = value;
      }, service.lasers);
      $scope.$apply();
    })
  };
  findLasers();
  return service;
}
