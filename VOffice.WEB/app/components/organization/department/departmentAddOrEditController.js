(function (app) {
    app.controller('departmentAddOrEditController', departmentAddOrEditController);

    departmentAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'notificationService',
                                      'focus',
                                      '$state',
                                      '$stateParams',
                                      '$rootScope',
                                      'dateformatService',
                                      '$ngBootbox']

    function departmentAddOrEditController($scope,
                                    apiService,
                                    notificationService,
                                    focus,
                                    $state,
                                    $stateParams,
                                    $rootScope,
                                    dateformatService,
                                    $ngBootbox) {
        if ($stateParams.action == "add") {
            $scope.titleForm = "Thêm mới phòng ban - đơn vị";
        }
        else {
            $scope.titleForm = "Cập nhật phòng ban - đơn vị";
        }
        $scope.focusCode = function () {
            focus('code');
        }
        $scope.department = {};
        $scope.save = save;
        $scope.BindList = BindList;
        var permission = 0;
        function BindList(checkType) {
            if (checkType == 1) {
                $ngBootbox.confirm('Bạn chắc chắn muốn hủy?').then(function () {
                    $state.go('department', { departmentSelectedId: $stateParams.id, keyword: $stateParams.keyword });
                });
            }
            else {
                $state.go('department', { departmentSelectedId: $stateParams.id, keyword: $stateParams.keyword });
            }
        }
        $scope.checkPermission = checkPermission;
        function checkPermission() {
            if (permission == 0)
                return false;
            else return true;
        }
        $scope.checkPermission();
        $scope.checkAction = checkAction;
        function checkAction() {
            if ($stateParams.action == 'add')
                return false;
            else return true;
        }
        function save() {
            $ngBootbox.confirm('Bạn chắc chắn muốn cập nhật dữ liệu này?')
                             .then(function () {
                                 console.log($scope.department.office);
                                 if ($stateParams.action == 'add') {
                                     var userId = $scope.authentication.userId;
                                     $scope.department.parentId = $stateParams.id;
                                     $scope.department.code = $scope.department.code;
                                     $scope.department.name = $scope.department.name;
                                     $scope.department.shortName = $scope.department.shortName;
                                     $scope.department.order = $scope.department.order;
                                     $scope.department.address = $scope.department.address;
                                     $scope.department.phoneNumber = $scope.department.phoneNumber;
                                     $scope.department.fax = $scope.department.fax;
                                     $scope.department.taxNumber = $scope.department.taxNumber;
                                     $scope.department.bankName = $scope.department.bankName;
                                     $scope.department.bankAccountNumber = $scope.department.bankAccountNumber;
                                     $scope.department.office = $scope.department.office == undefined ? false : $scope.department.office;
                                     $scope.department.root = parseInt($stateParams.root) + 1;
                                     $scope.department.active = $scope.department.active;
                                     $scope.department.deleted = 0;
                                     $scope.department.createdOn = new Date();
                                     $scope.department.createdBy = userId;
                                     $scope.department.editedOn = new Date();
                                     $scope.department.editedBy = userId;
                                     console.log($scope.department)
                                     AddDepartment();
                                 }
                                 else {
                                     UpdateDepartment();
                                 }
                             });
        }
        function UpdateDepartment() {
            apiService.put($rootScope.baseUrl + 'api/Department/Update', $scope.department,
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
                        notificationService.displaySuccess('Cập nhật thành công ' + result.data.value.name);
                        BindList(0);
                    }
                }, function (error) {
                    notificationService.displayError('Cập nhật không thành công');
                });
        }
        function AddDepartment() {
            apiService.post($rootScope.baseUrl + 'api/Department/Add', $scope.department,
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
                        notificationService.displaySuccess('Thêm mới thành công ' + result.data.value.name);
                        BindList(0);
                    }

                }, function (error) {
                    notificationService.displayError('Thêm mới không thành công');
                });
        }
        function loadDepartment() {
            apiService.get($rootScope.baseUrl + 'api/Department/Get/' + $stateParams.id, null, function (result) {
                if ($stateParams.action == 'edit') {
                    $scope.department = result.data.value;
                    apiService.get($rootScope.baseUrl + 'api/Department/FilterDepartmentOrganiz?type=5&departmentId=' + $stateParams.id + '&keyword=', null, function (result) {
                        console.log(result.data.data);
                        if ($stateParams.root == 1) {
                            angular.forEach(result.data.data, function (val, key) {
                                if (val.id != $stateParams.id)
                                    $scope.parentDepartment = val.name;
                            });
                        }
                        else {
                            angular.forEach(result.data.data, function (val, key) {
                                if (key == 0)
                                {
                                    $scope.parentDepartment = val.name ;
                                }
                                else
                                {
                                    $scope.parentDepartment += ' - '+ val.name
                                }
                            });
                        }
                    });
                }
                else {
                    $scope.parentDepartment = result.data.value.name;
                }
            }, function (error) {
                notificationService.displayError('Không có dữ liệu')
            });
        }
        if ($stateParams.id != 0 && $stateParams.id != null) {
            loadDepartment();
        }
    }
})(angular.module('VOfficeApp.department'));