(function (app) {
    app.controller('documentFieldAddOrEditController', documentFieldAddOrEditController);
    documentFieldAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'notificationService',
                                      'focus',
                                      '$state',
                                      '$stateParams',
                                      '$ngBootbox',
                                      'dateformatService',
                                      '$rootScope']

    function documentFieldAddOrEditController($scope,
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
            $scope.titleForm = "Thêm mới lĩnh vực";
        }
        else {
            $scope.titleForm = "Cập nhật lĩnh vực";
        }
        $scope.focusCode = function () {
            focus('code');
        }
        $scope.documentField = {};
        $scope.save = save;
        $scope.BindList = BindList;
        function BindList(checkType) {
            if (checkType == 1) {
                $ngBootbox.confirm('Bạn chắc chắn muốn hủy?').then(function () {
                    $state.go('documentField', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
                });
            }
            else {
                $state.go('documentField', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
            }
        }
        $scope.checkField = checkField;
        function checkField() {
            if ($scope.documentField.code == '') {
                notificationService.displayError('Mã lĩnh vực không để trống');
                focus('code');
                return false;
            }
            else
                if ($scope.documentField.title == '') {
                    notificationService.displayError('Tên lĩnh vực không để trống');
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
                                         $scope.documentField.code = $scope.documentField.code;
                                         $scope.documentField.title = $scope.documentField.title;
                                         $scope.documentField.active = $scope.documentField.active;
                                         $scope.documentField.allowClientEdit = $scope.documentField.allowClientEdit;
                                         $scope.documentField.deleted = 0;
                                         $scope.documentField.createdOn = dateformatService.addMoreHours(new Date());
                                         $scope.documentField.createdBy = $scope.authentication.userId;
                                         $scope.documentField.editedOn = dateformatService.addMoreHours(new Date());
                                         $scope.documentField.editedBy = $scope.authentication.userId;
                                         console.log($scope.documentField)
                                         AddDocumentField();
                                     }
                                     else {
                                         $scope.documentDelivereds = []
                                         $scope.documentReceiveds = []
                                         UpdateDocumentField();
                                     }
                                 }
                             });
        }
        function UpdateDocumentField() {
            apiService.put($rootScope.baseUrl + 'api/DocumentField/Update', $scope.documentField,
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
        function AddDocumentField() {
            apiService.post($rootScope.baseUrl + 'api/DocumentField/AddDocumentFieldSystem', $scope.documentField,
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
                    else
                    {
                        notificationService.displaySuccess('Thêm mới thành công ' + result.data.value.title);
                        BindList(0);
                    }
                }, function (error) {
                    notificationService.displayError('Thêm mới không thành công');
                });
        }
        //Init
        if ($stateParams.id != 0 && $stateParams.id != null) {
            loadDocumentField();
        }
        function loadDocumentField() {
            apiService.get($rootScope.baseUrl + 'api/DocumentField/Get/' + $stateParams.id, null,
                function (result) {
                    $scope.documentField = result.data.value;
                },
                function (error) {
                    notificationService.displayError('Không có dữ liệu')
                })
        }
        //Init
    }
})(angular.module('VOfficeApp.documentField'));