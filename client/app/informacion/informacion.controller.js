'use strict';

angular.module('pruebaAngularApp')
  .controller('InformacionCtrl', function ($anchorScroll, $scope) {
    $scope.message = 'Hello';
    $anchorScroll('top');
  });
