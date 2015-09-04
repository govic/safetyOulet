'use strict';

describe('Controller: CatalogoCtrl', function () {

  // load the controller's module
  beforeEach(module('pruebaAngularApp'));

  var CatalogoCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CatalogoCtrl = $controller('CatalogoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
