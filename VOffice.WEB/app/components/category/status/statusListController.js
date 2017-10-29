(function (app) {
    app.controller('statusListController', statusListController);
    statusListController.$inject = ['$scope',
        'apiService',
        'notificationService',
        '$ngBootbox',
        '$stateParams',
        '$rootScope',
        '$uibModal'];
    function statusListController($scope,
                                    apiService,
                                    notificationService,
                                    $ngBootbox,
                                    $stateParams,
                                    $rootScope,
                                    $uibModal) {
        //Form Search
        var departmentId = $scope.authentication.departmentId;
        $scope.listItems = [];
        $scope.listTypeOfStatus = [
        { name: 'Quản lý văn bản', type: 'DOCUMENT' },
        { name: 'Quản lý công việc', type: 'TASK' },
        { name: 'Quản lý lịch công tác', type: 'CALENDAR' }
        ];
        $scope.selectedTypeOfStatus = $scope.listTypeOfStatus[0];
        $scope.keyword = '';
        $scope.search = search;
        $scope.deleteStatus = deleteStatus;
        function deleteStatus(id) {
            $ngBootbox.confirm('Bạn chắc chắn muốn xóa không?')
                                .then(function () {
                                    apiService.put($rootScope.baseUrl + 'api/Status/DeleteLogical/' + id, null, function (result) {
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
            getListStatus(page);
        }
        $scope.getListStatus = getListStatus;
        function getListStatus(page) {
            page = page | 0;
            var config = {
                params: {
                    keyword: $scope.keyword,
                    type: $scope.selectedTypeOfStatus.type,
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
                $stateParams.keyword = null;
                $scope.keyword = config.params.keyword;
            }
            if ($stateParams.type != null) {
                config.params.type = $stateParams.type;
                if ($stateParams.type == "TASK") {
                    $scope.selectedTypeOfStatus = { name: 'Quản lý công việc', type: "TASK" }
                }
                else {
                    if ($stateParams.type == 'DOCUMENT') {
                        $scope.selectedTypeOfStatus = { name: 'Quản lý văn bản', type: "DOCUMENT" };
                    }
                    else {
                        $scope.selectedTypeOfStatus = { name: 'Quản lý lịch công tác', type: "CALENDAR" };
                    }
                }
                $stateParams.type = null;
            }
            apiService.get($rootScope.baseUrl + 'api/Status/Search?', config, function (result) {
                console.log(config);
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0)
                    notificationService.displayError("Không tìm thấy bản ghi khả dụng");
                $scope.listItems = result.data.data;
                $scope.page = result.data.pageNumber;
                $scope.pagesCount = result.data.pagesCount;
                $scope.totalCount = result.data.totalItems;
                $scope.totalItems = result.data.totalItems;
                $scope.currentPage = result.data.pageNumber;
                $scope.recordsPerPage = config.params.pageSize;
            }, function () {
                console.log('Load status failed');
            });
        }
        $scope.getListStatus();
    }
})(angular.module('VOfficeApp.status'));