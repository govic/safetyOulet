'use strict';

describe('Controller: CompraCtrl', function () {

  // load the controller's module
  beforeEach(module('pruebaAngularApp'));

  var CompraCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompraCtrl = $controller('CompraCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
