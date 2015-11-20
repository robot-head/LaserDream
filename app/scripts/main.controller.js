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
    graphics.drawRect(10, 10, game.width - 20, game.height - 20);
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

  var i16 = function (min, max, val) {
    return -32767.5 + (val / (max - min)) * 65535;
  };

  var ui16 = function (min, max, val) {
    return (val / (max - min)) * 65535;
  };

  function drawline(framedata, x0, y0, x1, y1, r, g, b) {
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var d = Math.round(4 + (Math.sqrt(dx * dx + dy * dy) / 600));

    var jumpframes = 30;
    var stopframes = 20;
    var lineframes = d;

    for (var i = 0; i < jumpframes; i++) {
      var pt = {};
      pt.x = x0;
      pt.y = y0;
      pt.r = 0;
      pt.g = 0;
      pt.b = 0;
      pt.control = 0;
      pt.i = 0;
      pt.u1 = 0;
      pt.u2 = 0;
      framedata.push(pt);
    }

    for (var i = 0; i < lineframes; i++) {
      var pt = {};
      pt.x = (x0 + (x1 - x0) * (i / (lineframes - 1)));
      pt.y = (y0 + (y1 - y0) * (i / (lineframes - 1)));
      pt.r = r;
      pt.g = g;
      pt.b = b;
      pt.control = 0;
      pt.i = 0;
      pt.u1 = 0;
      pt.u2 = 0;
      framedata.push(pt);
    }

    for (var i = 0; i < stopframes; i++) {
      var pt = {};
      pt.x = x1;
      pt.y = y1;
      pt.r = 0;
      pt.g = 0;
      pt.b = 0;
      pt.control = 0;
      pt.i = 0;
      pt.u1 = 0;
      pt.u2 = 0;
      framedata.push(pt);
    }
  }

  var calibrationPattern = function (conn) {

    console.log('Connected.');
    if (!conn) {
      return;
    }


    function frameProvider(callback) {
      // console.log('Generate ' + numpoints + ' points..');
      var framedata = [];
      var gfx = $scope.calibrationGroup.getChildAt(0);

      var xScaled = function (xval) {
        return i16(0, 800, xval);
      };

      var yScaled = function (yval) {
        return i16(0, 600, yval);
      };

      var cScaled = function (cval) {
        return ui16(0, 255, cval);
      };

      gfx.graphicsData.forEach(function (element, index) {
        //console.log(element);
        var color = Phaser.Color.getRGB(element.lineColor);
        var r = cScaled(color.r);
        var g = cScaled(color.g);
        var b = cScaled(color.b);

        var shape = element.shape;
        if (shape instanceof Phaser.Rectangle) {
          drawline(
            framedata,
            xScaled(shape.topLeft.x), yScaled(shape.topLeft.y),
            xScaled(shape.topRight.x), yScaled(shape.topRight.y),
            r, g, b);
          drawline(
            framedata,
            xScaled(shape.topRight.x), yScaled(shape.topRight.y),
            xScaled(shape.bottomRight.x), yScaled(shape.bottomRight.y),
            r, g, b);
          drawline(
            framedata,
            xScaled(shape.bottomRight.x), yScaled(shape.bottomRight.y),
            xScaled(shape.bottomLeft.x), yScaled(shape.bottomLeft.y),
            r, g, b);
          drawline(
            framedata,
            xScaled(shape.bottomLeft.x), yScaled(shape.bottomLeft.y),
            xScaled(shape.topLeft.x), yScaled(shape.topLeft.y),
            r, g, b);
        }
        if (shape instanceof Phaser.Polygon) {
          var pts = shape.points;
          drawline(
            framedata,
            xScaled(pts[0]), yScaled(pts[1]),
            xScaled(pts[2]), yScaled(pts[3]),
            r, g, b);
        }
      });

      if ($scope.calibrating != true) {
        return;
      }
      callback(framedata);
    }

    conn.streamFrames(45000, frameProvider.bind(this));
  };

}



