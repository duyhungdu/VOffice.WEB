/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.systemConfig', ['VOfficeApp.common'])
            .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('systemConfig', {
                url: "/tham-so-he-thong/:keyword/:currentPage",
                parent: 'base',
                templateUrl: "app/components/share/systemConfig/systemConfigListView.html",
                controller: "systemConfigListController",
                params: {
                    currentPage: null,
                    keyword: null
                }
            }).state('add_edit_systemConfig', {
                url: "/cap-nhat-tham-so-he-thong/:id/:keyword/:currentPage",
                parent: 'base',
                templateUrl: "app/components/share/systemConfig/systemConfigAddOrEditView.html",
                controller: "systemConfigAddOrEditController",
                params: {
                    id: null,
                    currentPage: null,
                    keyword: null
                }
            })
        ;
    }
})();
