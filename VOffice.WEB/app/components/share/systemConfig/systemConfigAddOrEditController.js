(function (app) {
    app.controller('systemConfigAddOrEditController', systemConfigAddOrEditController);
    systemConfigAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'notificationService',
                                      'focus',
                                      '$state',
                                      '$stateParams',
                                      '$ngBootbox',
                                      '$rootScope',
                                       'dateformatService']
    function systemConfigAddOrEditController($scope,
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
            $scope.titleForm = "Thêm mới tham số hệ thống";
        }
        else {
            $scope.titleForm = "Cập nhật tham số hệ thống";
        }
        $scope.focusCode = function () {
            focus('title');
        }
        $scope.checkAction = function () {
            if ($stateParams.id == 0)
                return false;
            else return true;
        }
        $scope.systemConfig = {};
        $scope.save = save;
        $scope.arrTypes = [{ name: 'Text', value: 0 }, { name: 'Password', value: 1 }];
        $scope.selectedTypeOfConfig = $scope.arrTypes[0];
        $scope.BindList = BindList;
        function BindList(type) {
            if (type == 1) {
                $state.go('systemConfig', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
            }
            else {
                $ngBootbox.confirm('Bạn chắc chắn muốn hủy?').then(function () {
                               $state.go('systemConfig', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
                           });
            }
        }
        $scope.checkField = checkField;
        function checkField() {
            if ($scope.systemConfig.title == '' || $scope.systemConfig.title == null) {
                notificationService.displayError('Tên tham số không để trống');
                focus('title');
                return false;
                return;
            }
            else
                if ($scope.systemConfig.value == '' || $scope.systemConfig.value == null) {
                    notificationService.displayError('Giá trị tham số không để trống');
                    focus('value');
                    return false;
                    return;
                }
                else
                    return true;
        }
        function save() {
            $ngBootbox.confirm('Bạn chắc chắn muốn cập nhật tham số hệ thống này?')
                             .then(function () {
                                 if (checkField() == true) {
                                     if ($stateParams.id == 0) {
                                         $scope.systemConfig.title = $scope.systemConfig.title;
                                         $scope.systemConfig.value = $scope.systemConfig.value;
                                         $scope.systemConfig.description = $scope.systemConfig.description;
                                         $scope.systemConfig.type = $scope.selectedTypeOfConfig.value;
                                         $scope.systemConfig.allowClientEdit = $scope.systemConfig.allowClientEdit;
                                         $scope.systemConfig.isSystemConfig = $scope.systemConfig.isSystemConfig;
                                         $scope.systemConfig.active = $scope.systemConfig.active;
                                         $scope.systemConfig.deleted = 0;
                                         $scope.systemConfig.createdOn = new Date();
                                         $scope.systemConfig.createdBy = userId;
                                         $scope.systemConfig.editedOn = new Date();
                                         $scope.systemConfig.editedBy = userId;
                                         AddSystemConfig();
                                     }
                                     else {
                                         $scope.systemConfig.type = $scope.selectedTypeOfConfig.value;
                                         UpdateSystemConfig();
                                     }
                                 }
                             });
        }
        function UpdateSystemConfig() {
            apiService.put($rootScope.baseUrl + 'api/SystemConfig/Update', $scope.systemConfig,
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
        function AddSystemConfig() {
            apiService.post($rootScope.baseUrl + 'api/systemConfig/Add', $scope.systemConfig,
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

        function loadSystemConfig() {
            apiService.get($rootScope.baseUrl + 'api/systemConfig/get/' + $stateParams.id, null,
                function (result) {
                    $scope.systemConfig = result.data.value;
                    if ($scope.systemConfig.type == 0) {
                        $scope.selectedTypeOfConfig = { name: 'Text', value: 0 };
                    }
                    else {
                        $scope.selectedTypeOfConfig = { name: 'Password', value: 1 };
                    }
                },
                function (error) {
                    notificationService.displayError('Không có dữ liệu')
                })
        }
        if ($stateParams.id != 0 && $stateParams.id != null) {
            loadSystemConfig();
        }
    }
})(angular.module('VOfficeApp.systemConfig'));