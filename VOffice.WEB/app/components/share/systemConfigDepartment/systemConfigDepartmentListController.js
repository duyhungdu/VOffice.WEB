(function (app) {
    app.controller('systemConfigDepartmentListController', systemConfigDepartmentListController);
    systemConfigDepartmentListController.$inject = ['$scope',
        'apiService',
        'notificationService',
        'focus',
        '$ngBootbox',
        '$stateParams',
        '$uibModal',
        '$rootScope'];

    function systemConfigDepartmentListController($scope,
                                    apiService,
                                    notificationService,
                                    focus,
                                    $ngBootbox,
                                    $stateParams,
                                    $uibModal,
                                    $rootScope) {
                                        $(document.body).addClass('body-small');
                                        $(document.body).removeClass('mini-navbar');
        $scope.listItem = [];
        $scope.page = 0;
        $scope.keyword = '';
        $scope.pagesCount = 0;
        $scope.getListSystemConfig = getListSystemConfig;
        $scope.search = search;
        $scope.deleteSystemConfig = deleteSystemConfig;
        $scope.systemConfig = {};
        var departmentID = $scope.authentication.departmentId;
        function deleteSystemConfig(id) {
            $ngBootbox.confirm('Bạn có muốn xóa bản ghi này không')
                                .then(function () {
                                    apiService.put($rootScope.baseUrl + 'api/SystemConfig/DeleteLogical/' + id, null, function (result) {
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
            getListSystemConfig(page);
        }

        function getListSystemConfig(page) {
            var config = {
                params: {
                    departmentID:departmentID,
                    keyword: $scope.keyword,
                    pageSize: 10,
                    pageNumber: page,
                }
            }
            if ($stateParams.currentPage != null) {
                config.params.pageNumber = $stateParams.currentPage;
                $stateParams.currentPage = null;
            }
            if ($stateParams.keyword != null) {
                config.params.keyword = $stateParams.keyword;
                $stateParams.keyword = null;
                $scope.keyword = config.params.keyword;
            }
            apiService.get($rootScope.baseUrl + 'api/SystemConfigDepartment/Search?', config, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0)
                    notificationService.displayError("Không tìm thấy bản ghi nào");
                $scope.listItem = result.data.data;
                $scope.page = result.data.pageNumber;
                $scope.pagesCount = result.data.pagesCount;
                $scope.totalCount = result.data.totalItems;
                $scope.totalItems = result.data.totalItems;
                $scope.currentPage = result.data.pageNumber;
                $scope.recordsPerPage = config.params.pageSize;
            }, function () {
                console.log('Load systemconfig Failed');
            });
        }
        $scope.getListSystemConfig();
    }
})(angular.module('VOfficeApp.systemConfigDepartment'));




