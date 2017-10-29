/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.addedDocumentBook', ['VOfficeApp.common'])
            .config(config);
    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('addedDocumentBook', {
                url: "/danh-sach-vb-chua-vs",
                parent: 'base',
                templateUrl: "app/components/document/addedDocumentBook/addedDocumentBookListView.html",
                controller: "addedDocumentBookListController",
                params: {
                    currentPage: null,
                    keyword: null
                }
            })
        .state('addedDocumentBookAdd', {
            url: "/vao-so-vb/:id/:currentPage/:keyword",
            parent: 'base',
            templateUrl: "app/components/document/addedDocumentBook/addedDocumentBookAddView.html",
            controller: "addedDocumentBookAddController",
            params: {
                id: null,
                currentPage: null,
                keyword: null
            }
        })
    }
})();
