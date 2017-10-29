(function (app) {
    app.controller('addedDocumentBookListController', addedDocumentBookListController);

    addedDocumentBookListController.$inject = ['$scope',
        'apiService',
        'notificationService',
        '$ngBootbox',
        '$stateParams',
        '$rootScope',
        'dateformatService'];

    function addedDocumentBookListController($scope,
                                    apiService,
                                    notificationService,
                                    $ngBootbox,
                                    $stateParams,
                                    $rootScope,
                                    dateformatService) {
        //Form Search
        var departmentId = $scope.authentication.departmentId;
        $scope.listItems = [];
        $scope.page = 0;
        $scope.keyword = '';
        $scope.pagesCount = 0;
        $scope.endDate = date;
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var dayOne = new Date(y, m, 1);
        var firstDay = new Date(dayOne.getFullYear(), dayOne.getMonth(), 1);
        var lastDay = new Date(y, m + 1, 0);

        $scope.startDate = dateformatService.formatToDDMMYY(firstDay);
        $scope.endDate = dateformatService.formatToDDMMYY(lastDay);
        $scope.getListDocument = getListDocument;
        $scope.search = search;
        function search(page) {
            getListDocument(page);
        }
        function getListDocument(page) {
            page = page | 0;

            var config = {
                params: {
                    keyword: $scope.keyword,
                    departmentId: departmentId,
                    startDate: $scope.startDate.split("/").reverse().join("-"),
                    endDate: $scope.endDate.split("/").reverse().join("-"),
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
            console.log(config);
            apiService.get($rootScope.baseUrl + 'api/DocumentReceived/SearchAddedDocumentBook', config, function (result) {
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
                console.log('Load document Failed');
            });
        }
        $scope.getListDocument();
        //Form Search
    }
})(angular.module('VOfficeApp.addedDocumentBook'));