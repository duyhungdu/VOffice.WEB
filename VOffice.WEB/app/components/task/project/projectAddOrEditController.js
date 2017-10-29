(function (app) {
    app.controller('projectAddOrEditController', projectAddOrEditController);
    projectAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'notificationService',
                                      'focus',
                                      '$state',
                                      '$stateParams',
                                      '$ngBootbox',
                                      'dateformatService',
                                      '$rootScope']

    function projectAddOrEditController($scope,
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
            $scope.titleForm = "Thêm mới dự án";
        }
        else {
            $scope.titleForm = "Cập nhật dự án";
        }
        $scope.focusCode = function () {
            focus('code');
        }
        $scope.project = {};
        $scope.save = save;
        $scope.BindList = BindList;
        var departmentId= $scope.authentication.departmentId;
        function BindList(checkType) {
            if (checkType == 1) {
                $ngBootbox.confirm('Bạn chắc chắn muốn hủy?').then(function () {
                    $state.go('project', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
                });
            }
            else {
                $state.go('project', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
            }
        }
        $scope.checkField = checkField;
        function checkField() {
            if ($scope.project.code == '') {
                notificationService.displayError('Mã dự án không để trống');
                focus('code');
                return false;
            }
            else
                if ($scope.project.title == '') {
                    notificationService.displayError('Tên dự án không để trống');
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
                                         $scope.project.code = $scope.project.code;
                                         $scope.project.title = $scope.project.title;
                                         $scope.project.managerId = null;
                                         $scope.project.departmentId = departmentId;
                                         $scope.project.active = $scope.project.active;
                                         $scope.project.deleted = 0;
                                         $scope.project.createdOn = dateformatService.addMoreHours(new Date());
                                         $scope.project.createdBy = $scope.authentication.userId;
                                         $scope.project.editedOn = dateformatService.addMoreHours(new Date());
                                         $scope.project.editedBy = $scope.authentication.userId;
                                         AddProject();
                                     }
                                     else {
                                         UpdateProject();
                                     }
                                 }
                             });
        }
        function UpdateProject() {
            apiService.put($rootScope.baseUrl + 'api/Project/Update', $scope.project,
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
        function AddProject() {
            apiService.post($rootScope.baseUrl + 'api/Project/Add', $scope.project,
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
            loadProject();
        }
        function loadProject() {
            apiService.get($rootScope.baseUrl + 'api/Project/Get/' + $stateParams.id, null,
                function (result) {
                    $scope.project = result.data.value;
                },
                function (error) {
                    notificationService.displayError('Không có dữ liệu')
                })
        }
        //Init
    }
})(angular.module('VOfficeApp.project'));