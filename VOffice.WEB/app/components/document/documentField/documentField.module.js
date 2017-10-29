/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.documentField', ['VOfficeApp.common'])
            .config(config);
    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('documentField', {
                url: "/linh-vuc-vb",
                parent: 'base',
                templateUrl: "app/components/document/documentField/documentFieldListView.html",
                controller: "documentFieldListController",
                params: {
                    currentPage: null,
                    keyword: null
                }
            }).state('add_edit_documentField', {
                url: "/cap-nhat-linh-vuc-vb/:id",
                parent: 'base',
                templateUrl: "app/components/document/documentField/documentFieldAddOrEditView.html",
                controller: "documentFieldAddOrEditController",
                params: {
                    id: null,
                    currentPage: null,
                    keyword: null
                }
            })
    }
})();
