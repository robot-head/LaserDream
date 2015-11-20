'use strict';

angular
  .module('app')
  .controller('MainController', MainController);

MainController.$inject = ['$rootScope', 'etherdream'];

function MainController($scope, etherdream) {
  $scope.lasers = etherdream.lasers;

  $scope.setLaser = function (laser) {
    $scope.selectedLaser = laser;
  };

  $scope.startLaserDemo = function () {
    $scope.stopDemo = false;
    etherdream.etherdream.connect($scope.selectedLaser.ip, $scope.selectedLaser.port, testPattern);

  };

  $scope.stopLaserDemo = function () {
    $scope.stopDemo = true;
  };

  var testPattern = function (conn) {
    var CIRCLE_POINTS = 100;

    console.log('Connected.');
    if (!conn) {
      return;
    }

    function colorsin(pos) {
      var res = (Math.sin(pos) + 1) * 32768;
      if (res < 0) return 0;
      if (res > 65535) return 65535;
      return res;
    }

    var i = 0;
    var phase = 0;

    function pointStreamer(numpoints, callback) {
      // console.log('Generate ' + numpoints + ' points..');
      var framedata = [];
      for (var k = 0; k < numpoints; k++) {
        var pt = {};
        var ip = i * 2.0 * Math.PI / CIRCLE_POINTS;
        pt.x = Math.sin(phase * 0.15 + ip * 4.0) * 10000;
        pt.y = Math.cos(phase * 0.21 + ip * 3.01) * 10000;
        pt.x += Math.sin(phase * 0.025 + ip * 3.0) * 20000;
        pt.y += Math.cos(phase * 0.012 + ip * 2.01) * 20000;
        pt.r = colorsin(ip + phase);
        pt.g = colorsin(ip + phase * 3);
        pt.b = colorsin(ip + phase * 2);
        framedata.push(pt);
        i += 0.1;
        phase += 0.1 / 3250.0;
      }
      if ($scope.stopDemo == true) {
        return;
      }
      callback(framedata);
    }

    conn.streamPoints(35000, pointStreamer.bind(this));
  };

  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'laserDemo', {preload: preload, create: create, update: update});

  function preload() {

  }

  function create() {
    var calibrationGroup = game.add.group();
    $scope.calibrationGroup = calibrationGroup;
    var graphics = game.add.graphics(0, 0, calibrationGroup);
    var bottomRightX = game.width - 10;
    var bottomRightY = game.height - 10;
    graphics.lineStyle(3, 0xFFFFFF, 1);
    graphics.drawRect(10, 10, bottomRightX - 10, bottomRightY - 10);
    graphics.moveTo(10, 10);
    graphics.lineTo(bottomRightX, bottomRightY);
    graphics.moveTo(game.width - 10, 10);
    graphics.lineTo(10, game.height - 10);
    console.log(calibrationGroup);
    //var boundingRect = new Phaser.Rectangle(10, 10, game.width - 10, game.height - 10);

  }

  function update() {

  }

  $scope.startCalibration = function () {
    $scope.calibrating = true;
    etherdream.etherdream.connect($scope.selectedLaser.ip, $scope.selectedLaser.port, calibrationPattern);

  };

  $scope.stopLaserDemo = function () {
    $scope.calibrating = false;
  };

  var ui16 = function(min, max, val) {
    return 65535 * (val / (max - min));
  };

  var calibrationPattern = function (conn) {

    console.log('Connected.');
    if (!conn) {
      return;
    }


    function pointStreamer(numpoints, callback) {
      // console.log('Generate ' + numpoints + ' points..');
      var framedata = [];
      var gfx = $scope.calibrationGroup.getChildAt(0);

      var xScaled = function(xval) {
        return ui16(0, 800, xval);
      };

      var yScaled = function(yval) {
        return ui16(0, 600, yval);
      };

      var cScaled = function(cval) {
        return ui16(0, 255, cval);
      };

      gfx.graphicsData.forEach(function (element, index) {
        //console.log(element);
        var color = Phaser.Color.getRGB(element.lineColor);
        var shape = element.shape;
        if (shape instanceof Phaser.Rectangle) {
          framedata.push({
            x: xScaled(shape.topLeft.x),
            y: yScaled(shape.topLeft.y),
            r: cScaled(color.r),
            g: cScaled(color.g),
            b: cScaled(color.b)
          });
          framedata.push({
            x: xScaled(shape.topRight.x),
            y: yScaled(shape.topRight.y),
            r: cScaled(color.r),
            g: cScaled(color.g),
            b: cScaled(color.b)
          });
          framedata.push({
            x: xScaled(shape.bottomRight.x),
            y: yScaled(shape.bottomRight.y),
            r: cScaled(color.r),
            g: cScaled(color.g),
            b: cScaled(color.b)
          });
          framedata.push({
            x: xScaled(shape.bottomLeft.x),
            y: yScaled(shape.bottomLeft.y),
            r: cScaled(color.r),
            g: cScaled(color.g),
            b: cScaled(color.b)
          });
          framedata.push({
            x: xScaled(shape.topLeft.x),
            y: yScaled(shape.topLeft.y),
            r: cScaled(color.r),
            g: cScaled(color.g),
            b: cScaled(color.b)
          });
          // draw rect
        }
      });

      if ($scope.calibrating != true) {
        return;
      }
      callback(framedata);
    }

    conn.streamPoints(35000, pointStreamer.bind(this));
  };

}



