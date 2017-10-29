/// <reference path="/assets/admin/libs/angular/angular.js" />
(function () {
    angular.module('VOfficeApp.documentReiceived', ['VOfficeApp.common'])
            .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('documentReceived', {
                url: "/danh-sach-van-ban",
                parent: 'base',
                templateUrl: "app/components/document/DocumentReceived/documentReceivedListView.html",
                controller: "documentReceivedListController",
                params: {
                    receivedDocument: null,
                    typeOfDocument: null,
                    currentPage: null,
                    keyword: null,
                    startDate: null,
                    endDate: null
                }
            }).state('add_edit_documentReceived', {
                url: "/cap-nhat-vb-den/:id/:receivedDocument/:currentPage/:keyword/:startDate/:endDate",
                parent: 'base',
                templateUrl: "app/components/document/DocumentReceived/documentReceivedAddOrEditView.html"
                , controller: "documentReceivedAddOrEditController",
                params: {
                    id: null,
                    receivedDocument: null,
                    typeOfDocument: null,
                    currentPage: null,
                    keyword: null,
                    startDate: null,
                    endDate: null
                }
            }).state('assign_document', {
                url: "/giao-xu-ly-vb/:taskId/:documentId/:receivedDocument/:typeOfDocument/:currentPage/:keyword/:startDate/:endDate",
                parent: 'base',
                templateUrl: "app/components/document/DocumentReceived/documentAssignView.html",
                controller: "documentAssignController",
                params: {
                    taskId: null,
                    documentId: null,
                    receivedDocument: null,
                    typeOfDocument: null,
                    currentPage: null,
                    keyword: null,
                    startDate: null,
                    endDate: null
                }
            }).state('forward_document', {
                url: "/chuyen-tiep-vb/:documentId/:receivedDocument/:typeOfDocument/:currentPage/:keyword/:startDate/:endDate",
                parent: 'base',
                templateUrl: "app/components/document/DocumentReceived/documentForwardView.html",
                controller: "documentForwardController",
                params: {
                    documentId: null,
                    receivedDocument: null,
                    typeOfDocument: null,
                    currentPage: null,
                    keyword: null,
                    startDate: null,
                    endDate: null
                }
            }).state('add_edit_documentDelivered', {
                url: "/cap-nhat-vb-di/:id/:receivedDocument/:currentPage/:keyword/:startDate/:endDate",
                parent: 'base',
                templateUrl: "app/components/document/DocumentReceived/documentDeliveredAddOrEditView.html"
                , controller: "documentDeliveredAddOrEditController",
                params: {
                    id: null,
                    receivedDocument: null,
                    typeOfDocument: null,
                    currentPage: null,
                    keyword: null,
                    startDate: null,
                    endDate: null
                }
            }).state('viewDocument', {
                url: "/chi-tiet-vb/:id/:receivedDocument/:typeOfDocument/:currentPage/:keyword/:startDate/:endDate",
                parent: 'base',
                templateUrl: "app/components/document/DocumentReceived/documentDetailView.html",
                controller: "documentDetailController",
                params: {
                    id: null,
                    receivedDocument: null,
                    typeOfDocument: null,
                    currentPage: null,
                    keyword: null,
                    startDate: null,
                    endDate: null
                }
            }).state('documentFilter', {
                url: "/tim-kiem-van-ban/:receivedDocument/:typeOfDocument/:currentPage/:keyword/:startDate/:endDate",
                parent: 'base',
                templateUrl: "app/components/document/DocumentReceived/documentFilterListView.html",
                controller: "documentFilterListController",
                params: {
                    receivedDocument: null,
                    typeOfDocument: null,
                    currentPage: null,
                    keyword: null,
                    startDate: null,
                    endDate: null
                }
            }).state('documentStatistics', {
                url: "/tinh-hinh-gui-nhan-van-ban",
                parent: 'base',
                templateUrl: "app/components/document/DocumentReceived/documentStatisticsSendReceivedView.html",
                controller: "documentStatisticsSendReceivedController",
                params: {
                    id: null,
                    receivedDocument: null,
                    typeOfDocument: null,
                    currentPage: null,
                    keyword: null,
                    startDate: null,
                    endDate: null
                }
            }).state('documentDeliveredStatistics', {
                url: "/thong-ke-vb-di",
                parent: 'base',
                templateUrl: "app/components/document/DocumentReceived/documentDeliveredStatisticsListView.html",
                controller: "documentDeliveredStatisticsListController",
                params: {
                    id: null,
                    receivedDocument: null,
                    typeOfDocument: null,
                    currentPage: null,
                    keyword: null,
                    startDate: null,
                    endDate: null
                }
            })
    }
})();
