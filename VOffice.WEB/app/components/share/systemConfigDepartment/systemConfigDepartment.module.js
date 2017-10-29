/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.systemConfigDepartment', ['VOfficeApp.common']).config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('systemConfigDepartment', {
                url: "/tham-so-he-thong-don-vi/:keyword/:currentPage",
                parent: 'base',
                templateUrl: "app/components/share/systemConfigDepartment/systemConfigDepartmentListView.html",
                controller: "systemConfigDepartmentListController",
                params: {
                    currentPage: null,
                    keyword: null
                }
            }).state('add_edit_systemConfigDepartment', {
                url: "/cap-nhat-tham-so-he-thong/:id/:code/:keyword/:currentPage/:action",
                parent: 'base',
                templateUrl: "app/components/share/systemConfigDepartment/systemConfigDepartmentAddOrEditView.html",
                controller: "systemConfigDepartmentAddOrEditController",
                params: {
                    id: null,
                    code: null,
                    currentPage: null,
                    keyword: null,
                    action: null
                }
            })
        ;
    }
})();
