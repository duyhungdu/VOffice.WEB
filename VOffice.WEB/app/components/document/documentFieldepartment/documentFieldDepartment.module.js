/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.documentFieldDepartment', ['VOfficeApp.common'])
            .config(config);
    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('documentFieldDepartment', {
                url: "/linh-vuc-vb-donvi",
                parent: 'base',
                templateUrl: "app/components/document/documentFieldepartment/documentFieldDepartmentListView.html",
                controller: "documentFieldDepartmentListController",
                params: {
                    currentPage: null,
                    keyword: null
                }
            }).state('add_edit_documentFieldDepartment', {
                url: "/cap-nhat-linh-vuc-vb-donvi/:id/:idDocumentField/:type/:currentPage/:keyword",
                parent: 'base',
                templateUrl: "app/components/document/documentFieldepartment/documentFieldDepartmentAddOrEditView.html",
                controller: "documentFieldDepartmentAddOrEditController",
                params: {
                    id: null,
                    idDocumentField: null,
                    type: null,
                    currentPage: null,
                    keyword: null
                }
            });;
    }
})();
