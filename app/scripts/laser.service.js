'use strict';

angular
  .module('app')
  .factory('etherdream', ['$rootScope', '$interval', EtherDreamService]);


function EtherDreamService($scope, $interval) {
  var etherdream = require('node-etherdream');
  var service = {
    'etherdream': etherdream,
    'lasers': []
  };
  $interval(findLasers, 10000);
  var findLasers = function() {
    etherdream.find(function (lasers) {
      service.lasers = lasers;
      $scope.$apply();
    })
  };
  findLasers();
  return service;
}
