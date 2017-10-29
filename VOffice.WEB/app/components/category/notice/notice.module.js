/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.notice', ['VOfficeApp.common']).config(config);
    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('notice', {
                url: "/danh-sach-thong-bao/:keyword/:currentPage",
                parent: 'base',
                templateUrl: "app/components/category/notice/noticeListView.html",
                controller: "noticeListController",
                params: {
                    keyword: '',
                    currentPage: null
                }
            }).state('add_edit_notice', {
                url: "/cap-nhat-trang-thai/:id/:keyword/:currentPage",
                parent: 'base',
                templateUrl: "app/components/category/notice/noticeAddOrEditView.html",
                controller: "noticeAddOrEditController",
                params: {
                    id: null,
                    keyword: '',
                    currentPage: null
                }
            })
    }
})();
