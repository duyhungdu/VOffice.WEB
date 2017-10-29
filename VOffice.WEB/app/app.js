
/// <reference path="/assets/admin/libs/angular/angular.js" />
///Cấu hình router tại đây.
(function () {
    var app = angular.module('VOfficeApp', ['VOfficeApp.common',
                               'VOfficeApp.documentReiceived',
                               'VOfficeApp.addedDocumentBook',
                               'VOfficeApp.documentType',
                               'VOfficeApp.documentField',
                               'VOfficeApp.documentFieldDepartment',
                               'VOfficeApp.documentSignedBy',
                               'VOfficeApp.externalSendReceiveDivision',
                               'VOfficeApp.customer',
                               'VOfficeApp.systemConfig',
                               'VOfficeApp.task',
                               'VOfficeApp.electronicContact',
                               'VOfficeApp.staff',
                               'VOfficeApp.event',
                               'VOfficeApp.department',
                               'VOfficeApp.user',
                               'VOfficeApp.project',
                               'VOfficeApp.tasktype',
                               'VOfficeApp.status',
                               'VOfficeApp.meetingRoom',
                               'VOfficeApp.systemConfig',
                               'VOfficeApp.taskreport',
                               'VOfficeApp.help',
                               'VOfficeApp.systemConfigDepartment',
                               'VOfficeApp.applicationLogging',
                               'VOfficeApp.notice']);
    app.config(config)
    app.config(configAuthentication);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    /// sử dụng ui-router
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('base', {
                url: '',
                templateUrl: 'app/shared/views/baseView.html',
                controller: 'baseViewController',
                abstract: true
            })
            .state('login', {
                url: "/login",
                templateUrl: "app/components/login/loginView.html",
                controller: "loginController"
            })
            .state('home', {
                url: "/home",
                parent: 'base',
                templateUrl: "app/components/home/homeView.html",
                controller: "homeController"
            });

        $urlRouterProvider.otherwise('/home')
    }

    function configAuthentication($httpProvider) {
        $httpProvider.interceptors.push(function ($q, $location) {
            return {
                request: function (config) {

                    return config;
                },
                requestError: function (rejection) {

                    return $q.reject(rejection);
                },
                response: function (response) {
                    if (response.status == "401") {
                        $location.path('/login');
                    }
                    //the same response/modified/or a new one need to be returned.
                    return response;
                },
                responseError: function (rejection) {

                    if (rejection.status == "401") {
                        $location.path('/login');
                    }
                    return $q.reject(rejection);
                }
            };
        });
    }

    app.constant("actionOfEvent", {
        REGISTER_EVENT: "register",
        ADD_NEW_EVENT: "add",
        ADD_NEW_EVENT_PERSIONAL: "add-persional"
    });

    app.run(function ($rootScope, apiService, $sce, $compile) {
        //apiService.get('http://localhost:81/api/AspNetRole/Getall', null, function (data) {
        //    permissionList = data.data.data;
        //    permissions.setPermissions(permissionList);
        //    //angular.bootstrap(document, ['VOfficeApp']);
        //});

    });
})();
