'use strict';

describe('Controller: CarroCtrl', function () {

  // load the controller's module
  beforeEach(module('pruebaAngularApp'));

  var CarroCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CarroCtrl = $controller('CarroCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
