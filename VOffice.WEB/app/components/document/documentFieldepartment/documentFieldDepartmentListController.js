(function (app) {
    app.controller('documentFieldDepartmentListController', documentFieldDepartmentListController);

    documentFieldDepartmentListController.$inject = ['$scope',
        'apiService',
        'notificationService',
        '$ngBootbox',
        '$stateParams',
        '$rootScope'];

    function documentFieldDepartmentListController($scope,
                                    apiService,
                                    notificationService,
                                    $ngBootbox,
                                    $stateParams,
                                    $rootScope) {
        $scope.listItems = [];
        $scope.page = 0;
        $scope.keyword = '';
        $scope.pagesCount = 0;
        $scope.getListDocumentFieldDepartment = getListDocumentFieldDepartment;
        $scope.search = search;
        $scope.deleteDocumentFieldDepartment = deleteDocumentFieldDepartment;

        function deleteDocumentFieldDepartment(id) {
            $ngBootbox.confirm('Bạn chắc chắn muốn xóa không?')
                                .then(function () {
                                    apiService.put($rootScope.baseUrl + 'api/DocumentFieldDepartment/DeleteLogical/' + id, null, function (result) {
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
            getListDocumentFieldDepartment(page);
        }
        function getListDocumentFieldDepartment(page) {
            var config = {
                params: {
                    Keyword: $scope.keyword,
                    DepartmentId: $scope.authentication.departmentId,
                    PageSize: 10,
                    PageNumber: page
                }
            }
            if ($stateParams.currentPage != null) {
                console.log($stateParams.currentPage);
                config.params.PageNumber = $stateParams.currentPage;
                $stateParams.currentPage = null;
            }
            if ($stateParams.keyword != null) {
                console.log($stateParams.keyword);
                config.params.Keyword = $stateParams.keyword;
                $stateParams.keyword = null;
                $scope.keyword = config.params.Keyword;
            }
            //if ($stateParams.departmentId != null) {
            //    console.log($stateParams.departmentId);
            //    config.params.DepartmentId = $stateParams.departmentId;
            //    $stateParams.departmentId = null;
            //    $scope.departmentId = config.params.DepartmentId;
            //}
            apiService.get($rootScope.baseUrl + 'api/DocumentFieldDepartment/Search', config, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0)
                    notificationService.displayError("không tìm thấy bản ghi nào");
                $scope.listItems = result.data.data;
                $scope.page = result.data.pageNumber;
                $scope.pagesCount = result.data.pagesCount;
                $scope.totalCount = result.data.totalItems;
                $scope.totalItems = result.data.totalItems;
                $scope.currentPage = result.data.pageNumber;
                $scope.recordsPerPage = config.params.PageSize;
            }, function () {
                console.log('Load document field department failed');
            });
        }
        $scope.getListDocumentFieldDepartment()
    }
})(angular.module('VOfficeApp.documentFieldDepartment'));