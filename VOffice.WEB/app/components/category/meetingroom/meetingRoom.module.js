/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.meetingRoom', ['VOfficeApp.common'])
            .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('meetingRoom', {
                url: "/phong-hop/:currentPage/:keyword",
                parent: 'base',
                templateUrl: "app/components/category/meetingroom/meetingRoomListView.html",
                controller: "meetingRoomListController",
                params: {
                    currentPage: null,
                    keyword: null
                }
            }).state('add_edit_meetingRoom', {
                url: "/cap-nhat-phong-hop/:id/:currentPage/:keyword",
                parent: 'base',
                templateUrl: "app/components/category/meetingroom/meetingRoomAddOrEditView.html",
                controller: "meetingRoomAddOrEditController",
                params: {
                    id: null,
                    currentPage: null,
                    keyword: null
                }
            });
    }
})();
