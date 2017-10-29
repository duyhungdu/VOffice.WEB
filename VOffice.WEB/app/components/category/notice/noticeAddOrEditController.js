(function (app) {
    app.controller('noticeAddOrEditController', noticeAddOrEditController);
    noticeAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'notificationService',
                                      'focus',
                                      '$state',
                                      '$stateParams',
                                      '$ngBootbox',
                                      'dateformatService',
                                      '$rootScope']

    function noticeAddOrEditController($scope,
                                    apiService,
                                    notificationService,
                                    focus,
                                    $state,
                                    $stateParams,
                                    $ngBootbox,
                                    dateformatService,
                                    $rootScope) {

        if ($stateParams.id == null)
            $stateParams.id = 0;
        if ($stateParams.id == 0) {
            $scope.startDateString =  dateformatService.formatToDDMMYY(new Date());
            $scope.titleForm = "Thêm mới thông báo";
        }
        else {
            $scope.titleForm = "Cập nhật thông báo";
        }
        $scope.focusTitle = function () {
            focus('code');
        }
        $scope.notice = {};
        $scope.save = save;
        $scope.BindList = BindList;
        var departmentId = $scope.authentication.departmentId;
        function BindList(checkType) {
            if (checkType == 1) {
                $ngBootbox.confirm('Bạn chắc chắn muốn hủy?').then(function () {
                    $state.go('notice', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
                });
            }
            else {
                $state.go('notice', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
            }
        }
        $scope.checkField = checkField;
        function checkField() {
            if ($scope.notice.title == '' || $scope.notice.title == undefined) {
                notificationService.displayError('Nội dung thông báo không để trống');
                focus('title');
                return false;
            }
            if ($scope.startDateString == '' || $scope.startDateString == undefined || $scope.startDateString == null) {
                notificationService.displayError('Thời gian bắt đầu không để trống');
                focus('startDate');
                return false;
            }
            else
                if ($scope.endDateString == '' || $scope.endDateString == undefined|| $scope.endDateString == null) {
                    notificationService.displayError('Thời gian kết thúc không để trống');
                    focus('endDate');
                    return false;
                }
                else
                    return true;
        }
        $scope.checkStartDueDate = function (type) {
            if ($scope.startDateString != null && $scope.startDateString != '' && $scope.endDateString != null && $scope.endDateString != '') {
                var result = dateformatService.compareTwoDate($scope.startDateString, $scope.endDateString);
                if (result == -1) {
                    if (type == 1) {
                        notificationService.displayError('Ngày bắt đầu phải trước ngày kết thúc');
                        if ($scope.notice.startDate != null) {
                            $scope.startDate = dateformatService.formatToDDMMYY(new Date($scope.notice.startDate));
                        }
                        else {
                            $scope.startDate = '';
                        }
                        document.getElementById("txtStartDate").focus();
                    }
                    else {
                        notificationService.displayError('Ngày kết thúc phải sau ngày bắt đầu');
                        if ($scope.notice.endDate) {
                            $scope.endDateString = dateformatService.formatToDDMMYY(new Date($scope.notice.endDate));
                        }
                        else {
                            $scope.endDateString = '';
                        }
                        document.getElementById("txtEndDate").focus();
                    }
                }
                else {
                }
            }
        }
        function save() {
            $ngBootbox.confirm('Bạn chắc chắn muốn cập nhật dữ liệu này?')
                             .then(function () {
                                 if (checkField() == true) {
                                     $scope.notice.startDate = $scope.startDateString.split("/").reverse().join("-");
                                     $scope.notice.endDate = $scope.endDateString.split("/").reverse().join("-");
                                     if ($stateParams.id == 0) {
                                         $scope.notice.title = $scope.notice.title;
                                         $scope.notice.departmentId = departmentId;
                                         $scope.notice.description = $scope.notice.description;
                                         $scope.notice.active = $scope.notice.active;
                                         $scope.notice.deleted = 0;
                                         $scope.notice.createdOn = new Date();
                                         $scope.notice.createdBy = $scope.authentication.userId;
                                         $scope.notice.editedOn = new Date();
                                         $scope.notice.editedBy = $scope.authentication.userId;
                                         AddNotice();
                                     }
                                     else {
                                         UpdateNotice();
                                     }
                                 }
                             });
        }
        function UpdateNotice() {
            apiService.put($rootScope.baseUrl + 'api/Notice/Update', $scope.notice,
                function (result) {
                    if (!result.data.isValid) {
                        angular.forEach(result.data.brokenRules, function (value, key) {
                            notificationService.displayError(value.rule);
                        });
                        return;
                    }
                    else if (!result.data.isSuccess) {
                        notificationService.displayError(result.data.message);
                        return;
                    }
                    else {
                        BindList(0);
                        notificationService.displaySuccess('Cập nhật thành công ' + result.data.value.title);
                    }
                }, function (error) {
                    notificationService.displayError('Cập nhật không thành công');
                });
        }
        function AddNotice() {
            apiService.post($rootScope.baseUrl + 'api/Notice/Add', $scope.notice,
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
                        notificationService.displaySuccess('Thêm mới thành công ' + result.data.value.title);
                        BindList(0);
                    }
                }, function (error) {
                    notificationService.displayError('Thêm mới không thành công');
                });
        }
        //Init
        if ($stateParams.id != 0 && $stateParams.id != null) {
            loadNotice();
        }
        function loadNotice() {
            apiService.get($rootScope.baseUrl + 'api/Notice/Get/' + $stateParams.id, null,
                function (result) {
                    $scope.notice = result.data.value;
                    $scope.startDateString = dateformatService.formatToDDMMYY(new Date($scope.notice.startDate));
                    $scope.endDateString = dateformatService.formatToDDMMYY(new Date($scope.notice.endDate));
                },
                function (error) {
                    notificationService.displayError('Không có dữ liệu')
                })
        }
        //Init
    }
})(angular.module('VOfficeApp.notice'));