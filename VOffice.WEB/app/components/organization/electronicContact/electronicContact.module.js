/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.electronicContact', ['VOfficeApp.common'])
            .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('electronicContact', {
                url: "/danh-ba-dien-tu/",
                parent: 'base',
                templateUrl: "app/components/organization/electronicContact/electronicContactListView.html",
                controller: "electronicContactListController",
                params: {
                    currentPage: null,
                    keyword: null
                }
            });
    }
})();
