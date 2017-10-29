/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.help', ['VOfficeApp.common']).config(config);
    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('help', {
                url: "/huong-dan-su-dung",
                parent: 'base',
                templateUrl: "app/components/help/helpListView.html",
                controller: "helpListController"
            })
    }
})();
