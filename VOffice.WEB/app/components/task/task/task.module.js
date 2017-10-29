/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.task', ['VOfficeApp.common'])
            .config(config);
    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('task', {
                url: "/danh-sach-cong-viec/:statusId/:fromDate/:toDate/:keyword/:currentPage/:assignToMe/:relativeToMe",
                parent: 'base',
                templateUrl: "app/components/task/task/taskListView.html"
                , controller: "taskListController",
                params: {
                    statusId: null,
                    fromDate: null,
                    toDate: null,
                    keyword: '',
                    currentPage: null,
                    documentId: null,
                    documentReceived: null,
                    assignToMe: null,
                    relativeToMe:null
                }
            })
        .state('add_edit_task', {
            url: "/cap-nhat-cong-viec/:id/:statusId/:fromDate/:toDate/:keyword/:currentPage/:assignToMe/:relativeToMe",
            parent: 'base',
            templateUrl: "app/components/task/task/taskAddOrEditView.html"
            , controller: "taskAddOrEditController",
            params: {
                id: null,
                statusId: null,
                fromDate: null,
                toDate: null,
                keyword: '',
                currentPage: null,
                assignToMe: null,
                relativeToMe: null
            }
        })
        .state('task_detail', {
            url: "/chi-tiet-cong-viec/:id/:statusId/:fromDate/:toDate/:keyword/:currentPage/:assignToMe/:relativeToMe",
            parent: 'base',
            templateUrl: "app/components/task/task/taskDetailView.html"
            , controller: "taskDetailController",
            params: {
                id: null,
                statusId: null,
                fromDate: null,
                toDate: null,
                keyword: '',
                currentPage: null,
                assignToMe: null,
                relativeToMe: null
            }
        });
    }
})();
