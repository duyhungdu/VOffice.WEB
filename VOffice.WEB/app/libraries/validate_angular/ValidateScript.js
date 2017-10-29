// create angular app
var validationApp = angular.module('validationApp', ['$scope', 'notificationService', 'ngBootbox']);
// create angular controller
validationApp.controller('mainController', function ($scope, notificationService, ngBootbox) {
    // function to submit the form after all validation has occurred			
    $scope.submitForm = function() {
        // check to make sure the form is completely valid
        if ($scope.userForm.$valid) {
            alert('our form is amazing');
        }
        else {
            alert(123);
        }

    };
});