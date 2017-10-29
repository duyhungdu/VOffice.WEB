(function (app) {
    app.controller('statusAddOrEditController', statusAddOrEditController);
    statusAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'notificationService',
                                      'focus',
                                      '$state',
                                      '$stateParams',
                                      '$ngBootbox',
                                      'dateformatService',
                                      '$rootScope']

    function statusAddOrEditController($scope,
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
            $scope.titleForm = "Thêm mới trạng thái";
        }
        else {
            $scope.titleForm = "Cập nhật trạng thái";
        }
        $scope.focusCode = function () {
            focus('code');
        }
        $scope.listTypeOfStatus = [
          { name: 'Quản lý văn bản', type: 'DOCUMENT' },
          { name: 'Quản lý công việc', type: 'TASK' },
          { name: 'Quản lý lịch công tác', type: 'CALENDAR' }
        ];
        $scope.selectedTypeOfStatus = $scope.listTypeOfStatus[0];
        $scope.status = {};
        $scope.save = save;
        $scope.BindList = BindList;
        var departmentId = $scope.authentication.departmentId;
        function BindList(checkType) {
            if (checkType == 1) {
                $ngBootbox.confirm('Bạn chắc chắn muốn hủy?').then(function () {
                    $state.go('status', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword, type: $stateParams.type });
                });
            }
            else {
                $state.go('status', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword , type: $stateParams.type});
            }
        }
        $scope.checkField = checkField;
        function checkField() {
            if ($scope.status.code == '' || $scope.status.code == undefined) {
                notificationService.displayError('Mã trạng thái không để trống');
                focus('code');
                return false;
            }
            else
                if ($scope.status.title == '' || $scope.status.title == undefined) {
                    notificationService.displayError('Tên trạng thái không để trống');
                    focus('title');
                    return false;
                }
                else
                    return true;
        }
        function save() {
            $ngBootbox.confirm('Bạn chắc chắn muốn cập nhật dữ liệu này?')
                             .then(function () {
                                 if (checkField() == true) {
                                     if ($stateParams.id == 0) {
                                         $scope.status.code = $scope.status.code;
                                         $scope.status.title = $scope.status.title;
                                         $scope.status.active = $scope.status.active;
                                         $scope.status.type = $scope.selectedTypeOfStatus.type;
                                         $scope.status.deleted = 0;
                                         $scope.status.createdOn = new Date();
                                         $scope.status.createdBy = $scope.authentication.userId;
                                         $scope.status.editedOn = new Date();
                                         $scope.status.editedBy = $scope.authentication.userId;
                                         AddStatus();
                                     }
                                     else {
                                         console.log( $scope.status);
                                         $scope.status.type = $scope.selectedTypeOfStatus.type;
                                         UpdateStatus();
                                     }
                                 }
                             });
        }
        function UpdateStatus() {
            apiService.put($rootScope.baseUrl + 'api/Status/Update', $scope.status,
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
                        BindList(0);
                        notificationService.displaySuccess('Cập nhật thành công ' + result.data.value.title);
                    }
                }, function (error) {
                    notificationService.displayError('Cập nhật không thành công');
                });
        }
        function AddStatus() {
            apiService.post($rootScope.baseUrl + 'api/Status/Add', $scope.status,
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
            loadStatus();
        }
        function loadStatus() {
            apiService.get($rootScope.baseUrl + 'api/Status/Get/' + $stateParams.id, null,
                function (result) {
                    $scope.status = result.data.value;
                    if ($scope.status.type == 'TASK')
                        $scope.selectedTypeOfStatus = { name: 'Quản lý công việc', type: 'TASK' };
                    else if ($scope.status.type == 'CALENDAR')
                        $scope.selectedTypeOfStatus = { name: 'Quản lý lịch công tác', type: 'CALENDAR' };
                },
                function (error) {
                    notificationService.displayError('Không có dữ liệu')
                })
        }
        //Init
    }
})(angular.module('VOfficeApp.status'));