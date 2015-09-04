'use strict';

describe('Controller: ContactoCtrl', function () {

  // load the controller's module
  beforeEach(module('pruebaAngularApp'));

  var ContactoCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContactoCtrl = $controller('ContactoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
