'use strict';

describe('Controller: InformacionCtrl', function () {

  // load the controller's module
  beforeEach(module('pruebaAngularApp'));

  var InformacionCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InformacionCtrl = $controller('InformacionCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
