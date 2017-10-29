/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.status', ['VOfficeApp.common']).config(config);
    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('status', {
                url: "/danh-sach-trang-thai/:keyword/:currentPage/:type",
                parent: 'base',
                templateUrl: "app/components/category/status/statusListView.html",
                controller: "statusListController",
                params: {
                    keyword: '',
                    currentPage: null,
                    type: ''
                }
            }).state('add_edit_status', {
                url: "/cap-nhat-trang-thai/:id/:keyword/:currentPage/:type",
                parent: 'base',
                templateUrl: "app/components/category/status/statusAddOrEditView.html",
                controller: "statusAddOrEditController",
                params: {
                    id:null,
                    keyword: '',
                    currentPage: null,
                    type: ''
                }
            })
    }
})();
