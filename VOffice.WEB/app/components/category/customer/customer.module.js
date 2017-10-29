/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.customer', ['VOfficeApp.common'])
            .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('customer', {
                url: "/khach-hang/:currentPage/:keyword",
                parent: 'base',
                templateUrl: "app/components/category/customer/customerListView.html",
                controller: "customerListController",
                params: {
                    currentPage: null,
                    keyword: null
                }
            }).state('add_edit_customer', {
                url: "/cap-nhat-khach-hang/:id/:currentPage/:keyword",
                parent: 'base',
                templateUrl: "app/components/category/customer/customerAddOrEditView.html",
                controller: "customerAddOrEditController",
                params: {
                    id: null,
                    currentPage: null,
                    keyword: null
                }
            });
    }
})();
