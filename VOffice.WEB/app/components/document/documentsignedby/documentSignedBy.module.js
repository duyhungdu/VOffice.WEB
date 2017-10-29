/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.documentSignedBy', ['VOfficeApp.common'])
            .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('documentSignedBy', {
                url: "/nguoi-ki/:currentPage/:keyword",
                parent: 'base',
                templateUrl: "app/components/document/documentsignedby/documentSignedByListView.html",
                controller: "documentSignedByListController",
                params: {
                    currentPage: null,
                    keyword: null
                }
            }).state('add_edit_documentSignedBy', {
                url: "/cap-nhat-nguoi-ki/:id/:currentPage/:keyword",
                parent: 'base',
                templateUrl: "app/components/document/documentsignedby/documentSignedByAddOrEditView.html",
                controller: "documentSignedByAddOrEditController",
                params: {
                    id: null,
                    currentPage: null,
                    keyword: null
                }
            });
    }
})();
