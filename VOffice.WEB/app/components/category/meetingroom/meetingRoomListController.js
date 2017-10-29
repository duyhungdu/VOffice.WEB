(function (app) {
    app.controller('meetingRoomListController', meetingRoomListController);

    meetingRoomListController.$inject = ['$scope',
        'apiService',
        'notificationService',
        '$ngBootbox',
        '$stateParams',
        '$rootScope'];

    function meetingRoomListController($scope,
                                    apiService,
                                    notificationService,
                                    $ngBootbox,
                                    $stateParams,
                                    $rootScope) {
        $scope.listItem = [];
        $scope.page = 0;
        $scope.keyword = '';
        $scope.pagesCount = 0;
        $scope.getListMeetingRoom = getListMeetingRoom;
        $scope.search = search;
        $scope.deleteMeetingRoom = deleteMeetingRoom;

        function deleteMeetingRoom(id) {
            $ngBootbox.confirm('Bạn chắc chắn muốn xóa không?')
                                .then(function () {
                                    apiService.put($rootScope.baseUrl + 'api/MeetingRoom/DeleteLogical/' + id, null, function (result) {
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
            getListMeetingRoom(page);
        }
        function pageChanged() {
            getListMeetingRoom();
        }
        function getListMeetingRoom(page) {
            page = page || 0;
            console.log("page" + page);
            var config = {
                params: {
                    departmentId: $scope.authentication.departmentId,
                    keyword: $scope.keyword,
                    pageNumber: page,
                    pageSize: 10
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
            apiService.get($rootScope.baseUrl + 'api/meetingroom/Search', config, function (result) {
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
                $scope.recordsPerPage = config.params.pageSize;
            }, function () {
                console.log('Loading failure');
            });
        }
        $scope.getListMeetingRoom()
    }
})(angular.module('VOfficeApp.meetingRoom'));