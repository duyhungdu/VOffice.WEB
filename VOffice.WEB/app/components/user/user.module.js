/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.user', ['VOfficeApp.common'])
            .config(config);
    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('user', {
                url: "/nguoi-dung/:currentPage/:keyword/:groupId",
                parent: 'base',
                templateUrl: "app/components/user/userListView.html",
                controller: "userListController",
                params: {
                    currentPage: null,
                    keyword: null,
                    groupId: null
                }
            }).state('add_edit_user', {
                url: "/cap-nhat-nguoi-dung/:id/:groupId/:currentPage/:keyword/:staffId",
                parent: 'base',
                templateUrl: "app/components/user/userAddOrEditView.html",
                controller: "userAddOrEditController",
                params: {
                    id: null,
                    groupId: null,
                    currentPage: null,
                    keyword: null,
                    staffId: null
                }
            }).state('role', {
                url: "/quan-ly-quyen/:id/:groupId/:currentPage/:keyword",
                parent: 'base',
                templateUrl: "app/components/user/roleListView.html",
                controller: "roleListController",
                params: {
                    id: null,
                    groupId: null,
                    currentPage: null,
                    keyword: null
                }
            }).state('add_edit_role', {
                url: "/cap-nhat-quyen/:id/:parentId/:action/:keyword",
                parent: 'base',
                templateUrl: "app/components/user/roleAddOrEditView.html",
                controller: "roleAddOrEditController",
                params: {
                    id: null,
                    parentId: null,
                    action: null,
                    keyword: null
                }
            }).state('forgotPassword', {
                url: "/khoi-phuc-mat-khau/",
                templateUrl: "app/components/user/forgotPasswordView.html",
                controller: "forgotPasswordController",
                params: {
                    id: null,
                    parentId: null,
                    action: null,
                    keyword: null
                }
            }).state('reset-mat-khau', {
                url: "/reset-mat-khau",
                templateUrl: "app/components/user/resetPasswordView.html",
                controller: "resetPasswordController",
                params: {
                    userId: null,
                    code: null,
                    action: null,
                    keyword: null
                }
            })
    }
})();
