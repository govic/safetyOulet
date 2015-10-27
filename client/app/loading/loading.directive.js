'use strict';

angular.module('pruebaAngularApp')
  .directive('loading', function () {
    return {
      templateUrl: 'app/loading/loading.html',
      restrict: 'EA',
      link: function () {
      }
    };
  });