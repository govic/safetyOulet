'use strict';

describe('Controller: DetalleCtrl', function () {

  // load the controller's module
  beforeEach(module('pruebaAngularApp'));

  var DetalleCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DetalleCtrl = $controller('DetalleCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
