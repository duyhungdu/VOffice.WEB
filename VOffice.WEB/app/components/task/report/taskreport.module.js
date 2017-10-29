/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.taskreport', ['VOfficeApp.common'])
            .config(config);
    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('taskreport', {
                url: "/thong-ke-cong-viec/:statusId/:fromDate/:toDate/:keyword/:currentPage/:assignToMe/:relativeToMe",
                parent: 'base',
                templateUrl: "app/components/task/report/taskreportListView.html"
                , controller: "taskreportListController",
                params: {
                    statusId: null,
                    fromDate: null,
                    toDate: null,
                    keyword: '',
                    currentPage: null,
                    documentId: null,
                    documentReceived: null,
                    assignToMe: null,
                    relativeToMe: null
                }
            })
    }
})();
