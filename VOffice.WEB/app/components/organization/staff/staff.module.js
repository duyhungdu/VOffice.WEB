/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.staff', ['VOfficeApp.common'])
            .config(config);
    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('staff', {
                url: "/danh-sach-can-bo",
                parent: 'base',
                templateUrl: "app/components/organization/staff/staffListView.html",
                //controller: "staffListController",
                params: {
                    currentPage: null,
                    keyword: null
                }
            }).state('add_edit_staff', {
                url: "/cap-nhat-thong-tin-can-bo/:id/:departmentId/:position/:shortPosition/:keyword",
                parent: 'base',
                templateUrl: "app/components/organization/staff/staffAddOrEditView.html",
                controller: "staffAddOrEditController",
                params: {
                    id: null,
                    departmentId: null,
                    position: '',
                    shortPosition: null,
                    keyword:''
                }
            }).state('login_history', {
                url: "/lich-su-truy-cap",
                parent: 'base',
                templateUrl: "app/components/organization/staff/loginHistoryListView.html",
                controller: "loginHistoryListController"
            })
            .state('staffProfile', {
                url: "/thong-tin-nguoi-dung",
                parent: 'base',
                templateUrl: "app/components/organization/staff/staffProfileView.html",
                controller: "staffProfileController"
            })
    }
})();
