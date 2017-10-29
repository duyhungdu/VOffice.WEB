(function (app) {
    app.controller('customerListController', customerListController);

    customerListController.$inject = ['$scope',
        'apiService',
        'notificationService',
        '$ngBootbox',
        '$stateParams',
        '$rootScope'];

    function customerListController($scope,
                                    apiService,
                                    notificationService,
                                    $ngBootbox,
                                    $stateParams,
                                    $rootScope) {
        $scope.listItem = [];
        $scope.page = 0;
        $scope.keyword = '';
        $scope.pagesCount = 0;
        $scope.getListCustomer = getListCustomer;
        $scope.search = search;
        $scope.deleteCustomer = deleteCustomer;

        function deleteCustomer(id) {
            $ngBootbox.confirm('Bạn chắc chắn muốn xóa không?')
                                .then(function () {
                                    apiService.put($rootScope.baseUrl + 'api/customer/DeleteLogical/' + id, null, function (result) {
                                        if (result.data.isSuccess) {
                                            notificationService.displaySuccess('Xóa thành công');
                                            search();
                                        }
                                        else {
                                            notificationService.displayError(result.data.message);
                                        }
                                    },
                                     function () {
                                         notificationService.displayError('Xóa không thành công');
                                     })
                                });
        }
        function search(page) {
            getListCustomer(page);
        }
        function pageChanged() {
            getListCustomer();
        }
        function getListCustomer(page) {
            console.log("page" + page);
            page = page || 0;
            var config = {
                params: {
                    departmentId:$scope.authentication.departmentId,
                    keyword: $scope.keyword,
                    PageNumber: page,
                    PageSize: 10
                }
            }
            console.log("currentPage: " + $stateParams.currentPage);
            console.log("keyword: " + $stateParams.keyword);
            if ($stateParams.currentPage != null) {
                config.params.PageNumber = $stateParams.currentPage;
                $stateParams.currentPage = null;
            }
            if ($stateParams.keyword != null) {
                config.params.keyword = $stateParams.keyword;
                $stateParams.keyword = null;
                $scope.keyword = config.params.keyword;
            }
            apiService.get($rootScope.baseUrl + 'api/customer/Search', config, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0)
                    notificationService.displayError("Không tìm thấy bản ghi khả dụng");
                console.log(result.data.data);
                $scope.listItem = result.data.data;
                $scope.page = result.data.pageNumber;
                $scope.pagesCount = result.data.pagesCount;
                $scope.totalCount = result.data.totalItems;
                $scope.totalItems = result.data.totalItems;
                $scope.currentPage = result.data.pageNumber;
                $scope.recordsPerPage = config.params.PageSize;
            }, function () {
                console.log('Loading failure');
            });
        }
        $scope.getListCustomer()
    }
})(angular.module('VOfficeApp.customer'));