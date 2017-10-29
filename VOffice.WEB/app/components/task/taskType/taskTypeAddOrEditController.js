(function (app) {
    app.controller('taskTypeAddOrEditController', taskTypeAddOrEditController);
    taskTypeAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'notificationService',
                                      'focus',
                                      '$state',
                                      '$stateParams',
                                      '$ngBootbox',
                                      'dateformatService',
                                      '$rootScope']

    function taskTypeAddOrEditController($scope,
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
            $scope.titleForm = "Thêm mới mảng công việc";
        }
        else {
            $scope.titleForm = "Cập nhật mảng công việc";
        }
        $scope.focusCode = function () {
            focus('code');
        }
        $scope.taskType = {};
        $scope.save = save;
        $scope.BindList = BindList;
        var departmentId= $scope.authentication.departmentId;
        function BindList(checkType) {
            if (checkType == 1) {
                $ngBootbox.confirm('Bạn chắc chắn muốn hủy?').then(function () {
                    $state.go('tasktype', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
                });
            }
            else {
                $state.go('tasktype', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
            }
        }
        $scope.checkField = checkField;
        function checkField() {
            if ($scope.taskType.code == '') {
                notificationService.displayError('Mã không để trống');
                focus('code');
                return false;
            }
            else
                if ($scope.taskType.title == '') {
                    notificationService.displayError('Tên mảng không để trống');
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
                                         $scope.taskType.code = $scope.taskType.code;
                                         $scope.taskType.title = $scope.taskType.title;
                                         $scope.taskType.departmentId = departmentId;
                                         $scope.taskType.active = $scope.taskType.active;
                                         $scope.taskType.deleted = 0;
                                         $scope.taskType.createdOn = dateformatService.addMoreHours(new Date());
                                         $scope.taskType.createdBy = $scope.authentication.userId;
                                         $scope.taskType.editedOn = dateformatService.addMoreHours(new Date());
                                         $scope.taskType.editedBy = $scope.authentication.userId;
                                         AddTaskType();
                                     }
                                     else {
                                         UpdateTaskType();
                                     }
                                 }
                             });
        }
        function UpdateTaskType() {
            apiService.put($rootScope.baseUrl + 'api/TaskType/Update', $scope.taskType,
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
        function AddTaskType() {
            apiService.post($rootScope.baseUrl + 'api/TaskType/Add', $scope.taskType,
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
            loadTaskType();
        }
        function loadTaskType() {
            apiService.get($rootScope.baseUrl + 'api/TaskType/Get/' + $stateParams.id, null,
                function (result) {
                    console.log(result.data.value);
                    $scope.taskType = result.data.value;
                },
                function (error) {
                    notificationService.displayError('Không có dữ liệu')
                })
        }
        //Init
    }
})(angular.module('VOfficeApp.tasktype'));