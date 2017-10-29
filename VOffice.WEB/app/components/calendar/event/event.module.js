/// <reference path="eventAddOrEditView.html" />
/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.event', ['VOfficeApp.common'])
            .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('add_edit_event', {
                url: "/cap-nhat-su-kien/:id/:currentPage/:keyword/:actionOfEvent",
                parent: 'base',
                templateUrl: "app/components/calendar/event/eventAddOrEditView.html",
                controller: "eventAddOrEditController",
                params: {
                    id: null,
                    currentPage: null,
                    keyword: null,
                    actionOfEvent: null
                }
            }).state('event_list', {
                url: "/lich-cong-tac/:id/:currentPage/:keyword/:actionOfEvent",
                parent: 'base',
                templateUrl: "app/components/calendar/event/eventListDepartmentView.html",
                controller: "eventListDepartmentController",
                params: {
                    id: null,
                    currentPage: null,
                    keyword: null,
                    actionOfEvent: null
                }
            }).state('event_leader_list', {
                url: "/lich-lanh-dao/:id/:currentPage/:keyword/:actionOfEvent",
                parent: 'base',
                templateUrl: "app/components/calendar/event/eventListDepartmentLeaderView.html",
                controller: "eventListDepartmentLeaderController",
                params: {
                    id: null,
                    currentPage: null,
                    keyword: null,
                    actionOfEvent: null
                }
            }).state('eventmultidepartment', {
                url: "/lich-tong-hop/:id/:currentPage/:keyword/:actionOfEvent",
                parent: 'base',
                templateUrl: "app/components/calendar/event/eventListMultiDepartmentView.html",
                controller: "eventListMultiDepartmentController",
                params: {
                    id: null,
                    currentPage: null,
                    keyword: null,
                    actionOfEvent: null
                }
            });
    }
})();
