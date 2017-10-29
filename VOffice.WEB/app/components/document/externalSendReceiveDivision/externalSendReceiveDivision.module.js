/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.externalSendReceiveDivision', ['VOfficeApp.common'])
            .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('externalSendReceiveDivision', {
                url: "/noi-gui-nhan-vb/:currentPage/:keyword",
                parent: 'base',
                templateUrl: "app/components/document/externalSendReceiveDivision/externalSendReceiveDivisionListView.html",
                controller: "externalSendReceiveDivisionListController",
                params: {
                    currentPage: null,
                    keyword: null
                }
            }).state('add_edit_externalSendReceiveDivision', {
                url: "/cap-nhat-noi-gui-nhan-vb/:id/:currentPage/:keyword",
                parent: 'base',
                templateUrl: "app/components/document/externalSendReceiveDivision/externalSendReceiveDivisionAddOrEditView.html",
                controller: "externalSendReceiveDivisionAddOrEditController",
                params: {
                    id: null,
                    currentPage: null,
                    keyword: null
                }
            });
    }
})();
