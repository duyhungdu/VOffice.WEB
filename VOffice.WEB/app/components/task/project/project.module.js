/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.project', ['VOfficeApp.common'])
            .config(config);
    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('project', {
                url: "/danh-sach-du-an/:keyword/:currentPage",
                parent: 'base',
                templateUrl: "app/components/task/project/projectListView.html",
                controller: "projectListController",
                params: {
                    keyword: '',
                    currentPage: null
                }
            })
        .state('add_edit_taskproject', {
            url: "/cap-nhat-du-an/:id/:keyword/:currentPage",
            parent: 'base',
            templateUrl: "app/components/task/project/projectAddOrEditView.html",
            controller: "projectAddOrEditController",
            params: {
                id: null,
                keyword: '',
                currentPage: null
            }
        })
    }
})();
