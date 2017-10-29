/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.tasktype', ['VOfficeApp.common']).config(config);
    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tasktype', {
                url: "/danh-sach-mang-du-an/:keyword/:currentPage",
                parent: 'base',
                templateUrl: "app/components/task/taskType/taskTypeListView.html",
                controller: "taskTypeListController",
                params: {
                    keyword: '',
                    currentPage: null
                }
            })
        .state('add_edit_taskType', {
            url: "/cap-nhat-mang-du-an/:id/:keyword/:currentPage",
            parent: 'base',
            templateUrl: "app/components/task/taskType/taskTypeAddOrEditView.html",
            controller: "taskTypeAddOrEditController",
            params: {
                id: null,
                keyword: '',
                currentPage: null
            }
        })
    }
})();
