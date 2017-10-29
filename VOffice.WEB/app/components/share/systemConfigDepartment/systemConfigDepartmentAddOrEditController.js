(function (app) {
    app.controller('systemConfigDepartmentAddOrEditController', systemConfigDepartmentAddOrEditController);
    systemConfigDepartmentAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'notificationService',
                                      'focus',
                                      '$state',
                                      '$stateParams',
                                      '$ngBootbox',
                                      '$rootScope',
                                       'dateformatService']
    function systemConfigDepartmentAddOrEditController($scope,
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
            $scope.titleForm = "Thêm mới tham số hệ thống - đơn vị";
        }
        else {
            $scope.titleForm = "Cập nhật tham số hệ thống - đơn vị";
        }
        $scope.focusCode = function () {
            focus('value');
        }
        $scope.checkAction = function () {
            if ($stateParams.id == 0)
                return false;
            else return true;
        }
        $scope.systemConfig = {};
        $scope.save = save;
        $scope.BindList = BindList;
        function BindList(type) {
            if (type == 1) {
                $state.go('systemConfigDepartment', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
            }
            else {
                $ngBootbox.confirm('Bạn chắc chắn muốn hủy?').then(function () {
                    $state.go('systemConfigDepartment', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
                });
            }
        }
        $scope.checkField = checkField;
        function checkField() {
            if ($scope.systemConfig.value == '' || $scope.systemConfig.value == null) {
                notificationService.displayError('Giá trị tham số không để trống');
                focus('value');
                return false;
                return;
            }
            else
                return true;
        }
        $scope.systemConfigDepartment = {};
        function save() {
            $ngBootbox.confirm('Bạn chắc chắn muốn cập nhật tham số hệ thống này?')
                             .then(function () {
                                 if (checkField() == true) {
                                     $scope.systemConfigDepartment.departmentId = departmentId;
                                     $scope.systemConfigDepartment.value = $scope.systemConfig.value;
                                     $scope.systemConfigDepartment.configId = $stateParams.id;
                                     $scope.systemConfigDepartment.description = $scope.systemConfig.description;
                                     $scope.systemConfigDepartment.createdOn = new Date();
                                     $scope.systemConfigDepartment.createdBy = userId;
                                     $scope.systemConfigDepartment.editedOn = new Date();
                                     $scope.systemConfigDepartment.editedBy = userId;
                                     UpdateSystemConfig();
                                 }
                             });
        }
        function UpdateSystemConfig() {
            apiService.put($rootScope.baseUrl + 'api/SystemConfigDepartment/Update', $scope.systemConfigDepartment,
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

        function loadSystemConfig() {
            apiService.get($rootScope.baseUrl + 'api/SystemConfigDepartment/get?departmentId=' + departmentId + '&configId=' + $stateParams.id, null,
                function (result) {
                    if (result.data.value != null)
                    {
                        $scope.systemConfig = result.data.value;
                    }
                    $scope.systemConfig.title = $stateParams.code;
                },
                function (error) {
                    notificationService.displayError('Không có dữ liệu')
                })
        }
        if ($stateParams.id != 0 && $stateParams.id != null) {
            loadSystemConfig();
        }
    }
})(angular.module('VOfficeApp.systemConfigDepartment'));