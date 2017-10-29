(function (app) {
    app.controller('loginHistoryListController', loginHistoryListController);

    loginHistoryListController.$inject = ['$scope',
        'apiService',
        'notificationService',
        '$ngBootbox',
        '$stateParams',
        '$rootScope'];

    function loginHistoryListController($scope,
                                    apiService,
                                    notificationService,
                                    $ngBootbox,
                                    $stateParams,
                                    $rootScope) {
                                        $(document.body).addClass('body-small');
                                        $(document.body).removeClass('mini-navbar');
        $scope.listItem = [];
        $scope.page = 0;
        $scope.pagesCount = 0;
        $scope.getListLoginHistories = getListLoginHistories;
        function getListLoginHistories(page) {
            var config = {
                params: {
                    userId: $scope.authentication.userId,
                    pageSize: 10,
                    pageNumber: page
                }
            }
            apiService.get($rootScope.baseUrl + 'api/LoginHistory/Search', config, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0)
                    notificationService.displayError("không tìm thấy bản ghi nào");
                $scope.listItem = result.data.data;
                console.log($scope.listItem);
                $scope.page = result.data.pageNumber;
                $scope.pagesCount = result.data.pagesCount;
                $scope.totalCount = result.data.totalItems;
                $scope.totalItems = result.data.totalItems;
                $scope.currentPage = result.data.pageNumber;
                $scope.recordsPerPage = config.params.pageSize;
            }, function () {
                console.log('Load document Failed');
            });
        }
        $scope.getListLoginHistories()
    }
})(angular.module('VOfficeApp.staff'));