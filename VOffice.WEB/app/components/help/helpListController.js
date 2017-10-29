(function (app) {
    app.controller('helpListController', helpListController);
    helpListController.$inject = ['$scope',
        'apiService',
        'notificationService',
        '$ngBootbox',
        '$stateParams',
        '$rootScope',
        '$uibModal'];
    function helpListController($scope,
                                    apiService,
                                    notificationService,
                                    $ngBootbox,
                                    $stateParams,
                                    $rootScope,
                                    $uibModal) {
                                        $(document.body).addClass('body-small');
                                        $(document.body).removeClass('mini-navbar');

    }
})(angular.module('VOfficeApp.help'));