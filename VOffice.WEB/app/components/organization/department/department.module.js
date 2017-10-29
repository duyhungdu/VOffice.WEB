/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.department', ['VOfficeApp.common'])
            .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('department', {
                url: "/danh-sach-don-vi/:departmentSelectedId/:keyword",
                parent: 'base',
                templateUrl: "app/components/organization/department/departmentListView.html",
                controller: "departmentListController",
                params: {
                    departmentSelectedId: null,
                    keyword:null
                }
            }).state('add_edit_department', {
                url: "/cap-nhat-don-vi/:id/:action/:root/:departmentSelectedId/:keyword",
                parent: 'base',
                templateUrl: "app/components/organization/department/departmentAddOrEditView.html",
                controller: "departmentAddOrEditController",
                params: {
                    id: null,
                    action: null,
                    root: null,
                    departmentSelectedId: null,
                    keyword: null
                }
            });
    }
})();
