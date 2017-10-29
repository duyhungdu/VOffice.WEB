(function (app) {
    app.controller('meetingRoomAddOrEditController', meetingRoomAddOrEditController);
    meetingRoomAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'notificationService',
                                      'focus',
                                      '$state',
                                      '$stateParams',
                                      '$ngBootbox',
                                      '$rootScope',
                                       'dateformatService']
    function meetingRoomAddOrEditController($scope,
                                    apiService,
                                    notificationService,
                                    focus,
                                    $state,
                                    $stateParams,
                                    $ngBootbox,
                                    $rootScope,
                                    dateformatService) {
        var departmentId = $scope.authentication.departmentId;
        var userId = $scope.authentication.userId;
        if ($stateParams.id == 0) {
            $scope.titleForm = "Thêm mới phòng họp";
        }
        else {
            $scope.titleForm = "Cập nhật phòng họp";
        }
        $scope.focusCode = function () {
            focus('code');
        }
        $scope.checkAction = function () {
            if ($stateParams.id == 0)
                return false;
            else return true;
        }
        $scope.meetingRoom = {};
        $scope.save = save;
        $scope.BindList = BindList;
        function BindList(type) {
            if (type == 1) {
                $state.go('meetingRoom', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
            }
            else {
                $ngBootbox.confirm('Bạn chắc chắn muốn hủy?')
                           .then(function () {
                               $state.go('meetingRoom', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
                           });
            }
        }
        $scope.checkField = checkField;
        function checkField() {
            if ($scope.meetingRoom.code == '' || $scope.meetingRoom.code == null) {
                notificationService.displayError('Mã phòng họp không để trống');
                focus('code');
                return false;
                return;
            }
            else
                if ($scope.meetingRoom.title == '' || $scope.meetingRoom.title == null) {
                    notificationService.displayError('Tên phòng họp không để trống');
                    return false;
                    return;
                    focus('title');
                }
                else
                    return true;
        }
        function save() {
            $ngBootbox.confirm('Bạn chắc chắn muốn cập nhật phòng họp này?')
                             .then(function () {
                                 if (checkField() == true) {
                                     if ($stateParams.id == 0) {
                                         $scope.meetingRoom.departmentId = departmentId;
                                         $scope.meetingRoom.code = $scope.meetingRoom.code;
                                         $scope.meetingRoom.title = $scope.meetingRoom.title;
                                         $scope.meetingRoom.description = $scope.meetingRoom.description;
                                         $scope.meetingRoom.address = $scope.meetingRoom.address;
                                         $scope.meetingRoom.capacity = $scope.meetingRoom.capacity;
                                         $scope.meetingRoom.order = $scope.meetingRoom.order;
                                         $scope.meetingRoom.shareable = $scope.meetingRoom.shareable;
                                         $scope.meetingRoom.splittable = $scope.meetingRoom.splittable;
                                         $scope.meetingRoom.active = $scope.meetingRoom.active;
                                         $scope.meetingRoom.deleted = 0;
                                         $scope.meetingRoom.createdOn = dateformatService.addMoreHours(new Date());
                                         $scope.meetingRoom.createdBy = userId;
                                         $scope.meetingRoom.editedOn = dateformatService.addMoreHours(new Date());
                                         $scope.meetingRoom.editedBy = userId;
                                         AddMeetingRoom();
                                     }
                                     else {
                                         UpdateMeetingRoom();
                                     }
                                 }
                             });
        }
        function UpdateMeetingRoom() {
            $scope.meetingRoom.departmentId = departmentId;
            apiService.put($rootScope.baseUrl + 'api/MeetingRoom/Update', $scope.meetingRoom,
                function (result) {
                    if (!result.data.isValid) {
                        angular.forEach(result.data.brokenRules, function (value, key) {
                            notificationService.displayError(value.rule);
                        });
                        return;
                    }
                    else if (!result.data.isSuccess) {
                        notificationService.displayError(result.data.message);
                        $scope.focusCode();
                        return;
                    }
                    else {
                        notificationService.displaySuccess('Cập nhật thành công ');
                        BindList(1);
                    }
                }, function (error) {
                    notificationService.displayError('Cập nhật không thành công');
                });
        }
        function AddMeetingRoom() {
            apiService.post($rootScope.baseUrl + 'api/MeetingRoom/Add', $scope.meetingRoom,
                function (result) {
                    if (!result.data.isValid) {
                        angular.forEach(result.data.brokenRules, function (value, key) {
                            notificationService.displayError(value.rule);
                        });
                        return;
                    }
                    else if (!result.data.isSuccess) {
                        notificationService.displayError(result.data.message);
                        $scope.focusCode();
                        return;
                    }
                    else {
                        notificationService.displaySuccess('Thêm mới thành công ');
                        BindList(1);
                    }

                }, function (error) {
                    notificationService.displayError('Thêm mới không thành công');
                });
        }

        function loadMeetingRoom() {
            apiService.get($rootScope.baseUrl + 'api/MeetingRoom/get/' + $stateParams.id, null,
                function (result) {
                    $scope.meetingRoom = result.data.value;
                },
                function (error) {
                    notificationService.displayError('Không có dữ liệu')
                })
        }
        if ($stateParams.id != 0 && $stateParams.id != null) {
            loadMeetingRoom();
        }

    }
})(angular.module('VOfficeApp.meetingRoom'));