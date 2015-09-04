'use strict';

describe('Controller: BusquedaCtrl', function () {

  // load the controller's module
  beforeEach(module('pruebaAngularApp'));

  var BusquedaCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BusquedaCtrl = $controller('BusquedaCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
