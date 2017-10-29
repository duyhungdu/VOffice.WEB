(function (app) {
    app.controller('documentTypeListController', documentTypeListController);

    documentTypeListController.$inject = ['$scope',
        'apiService',
        'notificationService',
        '$ngBootbox',
        '$stateParams',
        '$rootScope'];

    function documentTypeListController($scope,
                                    apiService,
                                    notificationService,
                                    $ngBootbox,
                                    $stateParams,
                                    $rootScope) {
        $scope.listItem = [];
        $scope.page = 0;
        $scope.keyword = '';
        $scope.pagesCount = 0;
        $scope.getListDocumentTypes = getListDocumentTypes;
        $scope.search = search;
        $scope.deleteDocumentType = deleteDocumentType;

        function deleteDocumentType(id) {
            $ngBootbox.confirm('Bạn chắc chắn muốn xóa không?')
                                .then(function () {
                                    apiService.put($rootScope.baseUrl + 'api/DocumentType/DeleteLogical/' + id, null, function (result) {
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
            getListDocumentTypes(page);
        }
        function getListDocumentTypes(page) {
            var config = {
                params: {
                    keyword: $scope.keyword,
                    pageSize: 10,
                    pageNumber: page
                }
            }
            if ($stateParams.currentPage != null) {
                config.params.pageNumber = $stateParams.currentPage;
                $stateParams.currentPage = null;
            }
            if ($stateParams.keyword != null) {
                config.params.keyword = $stateParams.keyword;
                $scope.keyword = config.params.keyword;
                $stateParams.keyword = null;
            }
            apiService.get($rootScope.baseUrl + 'api/DocumentType/Search', config, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0)
                    notificationService.displayError("không tìm thấy bản ghi nào");
                $scope.listItem = result.data.data;
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
        $scope.getListDocumentTypes()
    }
})(angular.module('VOfficeApp.documentType'));