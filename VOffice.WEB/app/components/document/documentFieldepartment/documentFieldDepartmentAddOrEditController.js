
(function (app) {
    app.controller('documentFieldDepartmentAddOrEditController', documentFieldDepartmentAddOrEditController);

    documentFieldDepartmentAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'focus',
                                      'notificationService',
                                      '$state',
                                      '$stateParams',
                                      '$ngBootbox',
                                      'dateformatService',
                                      '$rootScope']

    function documentFieldDepartmentAddOrEditController($scope,
                                    apiService,
                                    focus,
                                    notificationService,
                                    $state,
                                    $stateParams,
                                    $ngBootbox,
                                    dateformatService,
                                    $rootScope) {
        $scope.documentFieldDepartment = {};
        $scope.save = save;
        $scope.focusCode = function () {
            focus('code');
        }
        $scope.BindList = BindList;
        function BindList(action) {
            if (action == 0) {
                $ngBootbox.confirm('Bạn chắc chắn muốn hủy?').then(function () {
                    $state.go('documentFieldDepartment', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
                })
            }
            else {
                $state.go('documentFieldDepartment', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
            }
        }
        $scope.checkField = checkField;
        function checkField() {
            if ($scope.documentFieldDepartment.code == '' ||$scope.documentFieldDepartment.code ==undefined)
            {
                notificationService.displayError('Mã lĩnh vực không để trống');
                focus('code');
                return false;
            }
            else if ($scope.documentFieldDepartment.title == '' || $scope.documentFieldDepartment.title==undefined)
            {
                notificationService.displayError('Tên lĩnh vực không để trống');
                focus('fieldName');
                return false;
            }
            else return true;
        }
        function save() {
            $ngBootbox.confirm('Bạn chắc chắn muốn cập nhật dữ liệu này?')
                             .then(function () {
                                 if (checkField() == true) {
                                     if (($stateParams.type == 'add') || (($stateParams.id == 0 || $stateParams.id == null) && $stateParams.idDocumentField > 0)) {
                                         $scope.documentFieldDepartment.fieldID = $stateParams.idDocumentField;
                                         $scope.documentFieldDepartment.departmentId = $scope.authentication.departmentId;
                                         $scope.documentFieldDepartment.code = $scope.documentFieldDepartment.code;
                                         $scope.documentFieldDepartment.title = $scope.documentFieldDepartment.title;
                                         $scope.documentFieldDepartment.active = $scope.documentFieldDepartment.active;
                                         $scope.documentFieldDepartment.deleted = 0;
                                         $scope.documentFieldDepartment.createdOn = dateformatService.addMoreHours(new Date());
                                         $scope.documentFieldDepartment.createdBy = $scope.authentication.userId;
                                         $scope.documentFieldDepartment.editedOn = dateformatService.addMoreHours(new Date());
                                         $scope.documentFieldDepartment.editedBy = $scope.authentication.userId;
                                         AddDocumentFieldDepartment();
                                     }
                                     else {
                                         UpdateDocumentFieldDepartment();
                                     }
                                 }
                             });
        }
        function UpdateDocumentFieldDepartment() {
            apiService.put($rootScope.baseUrl + 'api/DocumentFieldDepartment/Update', $scope.documentFieldDepartment,
                function (result) {
                    if (!result.data.isValid) {
                        angular.forEach(result.data.brokenRules, function (value, key) {
                            notificationService.displayError(value.rule);
                        });
                        return;
                    }
                    if (result.data.isSuccess == false)
                    {
                        notificationService.displayError(result.data.message);
                    }
                    else
                    {
                        notificationService.displaySuccess('Cập nhật thành công');
                        BindList(1);
                    }
                }, function (error) {
                    notificationService.displayError('Cập nhật không thành công');
                });
        }

        function AddDocumentFieldDepartment() {
            apiService.post($rootScope.baseUrl + 'api/DocumentFieldDepartment/Add', $scope.documentFieldDepartment,
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
                        var notice = "";
                        if ($stateParams.type == 'add') {
                            notice = "Thêm mới";
                        }
                        else {
                            notice = "Cập nhật";
                        }
                        notificationService.displaySuccess(notice + ' thành công');
                        BindList(1);
                    }
                }, function (error) {
                    notificationService.displayError(notice + ' không thành công');
                });
        }

        function loadDocumentFieldDepartment() {
            apiService.get($rootScope.baseUrl + 'api/DocumentFieldDepartment/Get/' + $stateParams.id, null,
                function (result) {
                    $scope.documentFieldDepartment = result.data.value;
                },
                function (error) {
                    notificationService.displayError('Không có dữ liệu')
                })
        }
        if ($stateParams.id != 0 && $stateParams.id != null && $stateParams.type != 'add') {
            loadDocumentFieldDepartment();
        }
    }
})(angular.module('VOfficeApp.documentFieldDepartment'));