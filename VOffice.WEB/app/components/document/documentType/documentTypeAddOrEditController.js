
(function (app) {
    app.controller('documentTypeAddOrEditController', documentTypeAddOrEditController);

    documentTypeAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'notificationService',
                                      'focus',
                                      '$state',
                                      '$stateParams',
                                      '$rootScope',
                                      'dateformatService',
                                      '$ngBootbox']

    function documentTypeAddOrEditController($scope,
                                    apiService,
                                    notificationService,
                                    focus,
                                    $state,
                                    $stateParams,
                                    $rootScope,
                                    dateformatService,
                                    $ngBootbox) {

        if ($stateParams.id == null)
            $stateParams.id = 0
        if ($stateParams.id == 0) {
            $scope.titleForm = "Thêm mới loại văn bản";
        }
        else {
            $scope.titleForm = "Cập nhật loại văn bản";
        }
        $scope.focusCode = function () {
            focus('code');
        }
        $scope.documentType = {};
        $scope.save = save;
        $scope.BindList = BindList;

        function BindList(checkType) {
            if (checkType == 1) {
                $ngBootbox.confirm('Bạn chắc chắn muốn hủy?').then(function () {
                    $state.go('documentType', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
                });
            }
            else {
                $state.go('documentType', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
            }
        }
        function save() {
            $ngBootbox.confirm('Bạn chắc chắn muốn cập nhật dữ liệu này?')
                             .then(function () {
                                 if ($stateParams.id == 0) {
                                     var userId = $scope.authentication.userId;
                                     $scope.documentType.code = $scope.documentType.code;
                                     $scope.documentType.title = $scope.documentType.title;
                                     $scope.documentType.active = $scope.documentType.active;
                                     $scope.documentType.deleted = 0;
                                     $scope.documentType.createdOn = dateformatService.addMoreHours(new Date());
                                     $scope.documentType.createdBy = userId;
                                     $scope.documentType.editedOn = dateformatService.addMoreHours(new Date());
                                     $scope.documentType.editedBy = userId;
                                     console.log($scope.documentType)
                                     AddDocType();
                                 }
                                 else {
                                     UpdateDocumentType();
                                 }
                             });
        }
        function UpdateDocumentType() {
            apiService.put($rootScope.baseUrl + 'api/DocumentType/Update', $scope.documentType,
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
                        notificationService.displaySuccess('Cập nhật thành công ' + result.data.value.title);
                        BindList(0);
                    }
                }, function (error) {
                    notificationService.displayError('Cập nhật không thành công');
                });
        }

        function AddDocType() {
            apiService.post($rootScope.baseUrl + 'api/DocumentType/Add', $scope.documentType,
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

        function loadDocumentType() {
            apiService.get($rootScope.baseUrl + 'api/DocumentType/Get/' + $stateParams.id, null,
                function (result) {
                    $scope.documentType = result.data.value;
                },
                function (error) {
                    notificationService.displayError('Không có dữ liệu')
                })
        }
        if ($stateParams.id != 0 && $stateParams.id != null) {
            loadDocumentType();
        }

    }
})(angular.module('VOfficeApp.documentType'));