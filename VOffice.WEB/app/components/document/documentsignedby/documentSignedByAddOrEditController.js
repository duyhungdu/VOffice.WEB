
(function (app) {
    app.controller('documentSignedByAddOrEditController', documentSignedByAddOrEditController);

    documentSignedByAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'focus',
                                      'notificationService',
                                      '$ngBootbox',
                                      '$state',
                                      '$stateParams',
                                      'dateformatService',
                                      '$rootScope']

    function documentSignedByAddOrEditController($scope,
                                    apiService,
                                    focus,
                                    notificationService,
                                    $ngBootbox,
                                    $state,
                                    $stateParams,
                                    dateformatService,
                                    $rootScope) {
        $scope.documentSignedBy = {};
        $scope.save = save;
        $scope.focusFullName = function () {
            focus('fullName');
        }
        $scope.BindList = BindList;
        function BindList() {
            $state.go('documentSignedBy', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
        }
        function save() {
            $ngBootbox.confirm('Bạn chắc chắn muốn cập nhật dữ liệu này?')
                              .then(function () {
                                  var departmentId = $scope.authentication.departmentId;
                                  var userId = $scope.authentication.userId;
                                  if ($stateParams.id == 0) {
                                      $scope.documentSignedBy.deleted = false;
                                      $scope.documentSignedBy.departmentId = departmentId;
                                      $scope.documentSignedBy.receivedDocument = 1;
                                      $scope.documentSignedBy.createdOn = dateformatService.addMoreHours(new Date());
                                      $scope.documentSignedBy.createdBy = userId;
                                      $scope.documentSignedBy.editedOn = dateformatService.addMoreHours(new Date());
                                      $scope.documentSignedBy.editedBy = userId;
                                      AddDocumentSignedBy();
                                  }
                                  else {
                                      UpdateDocumentSignedBy();
                                  }
                              });
        }
        function UpdateDocumentSignedBy() {
            apiService.put($rootScope.baseUrl + 'api/DocumentSignedBy/Update', $scope.documentSignedBy,
                function (result) {
                    if (!result.data.isValid) {
                        angular.forEach(result.data.brokenRules, function (value, key) {
                            notificationService.displayError(value.rule);
                        });
                        return;
                    }
                    notificationService.displaySuccess('Cập nhật thành công ' + result.data.value.fullName);
                    BindList();
                }, function (error) {
                    notificationService.displayError('Cập nhật không thành công');
                });
        }

        function AddDocumentSignedBy() {
            apiService.post($rootScope.baseUrl + 'api/DocumentSignedBy/Add', $scope.documentSignedBy,
                function (result) {
                    if (!result.data.isValid) {
                        angular.forEach(result.data.brokenRules, function (value, key) {
                            notificationService.displayError(value.rule);
                        });
                        return;
                    }

                    notificationService.displaySuccess('Thêm mới thành công ' + result.data.value.fullName);
                    $state.go('documentSignedBy');
                }, function (error) {
                    notificationService.displayError('Thêm mới không thành công');
                });
        }

        function loadDocumentSignedBy() {
            apiService.get($rootScope.baseUrl + 'api/DocumentSignedBy/get/' + $stateParams.id, null,
                function (result) {

                    $scope.documentSignedBy = result.data.value;
                },
                function (error) {
                    notificationService.displayError('Không có dữ liệu')
                })
        }
        if ($stateParams.id != 0) {
            loadDocumentSignedBy();
        }

    }
})(angular.module('VOfficeApp.documentSignedBy'));