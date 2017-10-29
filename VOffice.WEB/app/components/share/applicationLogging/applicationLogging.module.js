/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.applicationLogging', ['VOfficeApp.common']).config(config);
    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('applicationLogging', {
                url: "/nhat-ky-he-thong",
                parent: 'base',
                templateUrl: "app/components/share/applicationLogging/applicationLoggingListView.html",
                controller: "applicationLoggingListController",
            })
    }
})();
