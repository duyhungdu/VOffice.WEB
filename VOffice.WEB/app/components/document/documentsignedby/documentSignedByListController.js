(function (app) {
    app.controller('documentSignedByListController', documentSignedByListController);

    documentSignedByListController.$inject = ['$scope',
        'apiService',
        'notificationService',
        '$ngBootbox',
        '$stateParams',
        '$rootScope'];

    function documentSignedByListController($scope,
                                    apiService,
                                    notificationService,
                                    $ngBootbox,
                                    $stateParams,
                                    $rootScope) {
        $scope.listItem = [];
        $scope.page = 0;
        $scope.keyword = '';
        $scope.pagesCount = 0;
        $scope.getListDocumentSignedBy = getListDocumentSignedBy;
        $scope.search = search;
        $scope.deleteDocmentSignedBy = deleteDocmentSignedBy;
        function deleteDocmentSignedBy(id) {
            $ngBootbox.confirm('Bạn chắc chắn muốn xóa không?')
                                .then(function () {
                                    apiService.put($rootScope.baseUrl + 'api/DocumentSignedBy/DeleteLogical/' + id, null, function (result) {
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
        function search() {
            getListDocumentSignedBy();
        }
        function pageChanged() {
            getListDocumentSignedBy();
        }
        function getListDocumentSignedBy(page) {
            page = page || 0;
            var departmentId = $scope.authentication.departmentId;
            var config = {
                params: {
                    keyword: $scope.keyword,
                    departmentId: departmentId,
                    PageNumber: page,
                    PageSize: 10
                }
            }
            if ($stateParams.currentPage != null) {
                config.params.PageNumber = $stateParams.currentPage;
                $stateParams.currentPage = null;
            }
            if ($stateParams.keyword != null) {
                config.params.Keyword = $stateParams.keyword;
                $stateParams.keyword = null;
                $scope.keyword = config.params.Keyword;
            }
            apiService.get($rootScope.baseUrl + 'api/DocumentSignedBy/Search', config, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0)
                    notificationService.displayError("Không tìm thấy bản ghi khả dụng");
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
        $scope.getListDocumentSignedBy()
    }
})(angular.module('VOfficeApp.documentSignedBy'));