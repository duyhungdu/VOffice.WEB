(function (app) {
    app.controller('externalSendReceiveDivisionAddOrEditController', externalSendReceiveDivisionAddOrEditController);

    externalSendReceiveDivisionAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'focus',
                                      'notificationService',
                                      '$ngBootbox',
                                      '$state',
                                      '$stateParams',
                                      'dateformatService',
                                      '$rootScope']

    function externalSendReceiveDivisionAddOrEditController($scope,
                                    apiService,
                                    focus,
                                    notificationService,
                                    $ngBootbox,
                                    $state,
                                    $stateParams,
                                    dateformatService,
                                    $rootScope) {
        $scope.externalSendReceiveDivision = {};
        $scope.save = save;
        $scope.focusTitle = function () {
            focus('title');
        }
        $scope.BindList = BindList;
        function BindList() {
            $state.go('externalSendReceiveDivision', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
        }
        function save() {
            $ngBootbox.confirm('Bạn chắc chắn muốn cập nhật dữ liệu này?')
                               .then(function () {
                                   var departmentId = $scope.authentication.departmentId;
                                   var userId = $scope.authentication.userId;
                                   if ($stateParams.id == 0) {
                                       $scope.externalSendReceiveDivision.deleted = false;
                                       $scope.externalSendReceiveDivision.departmentId = departmentId;
                                       $scope.externalSendReceiveDivision.receivedDocument = 1;
                                       $scope.externalSendReceiveDivision.createdOn = dateformatService.addMoreHours(new Date());
                                       $scope.externalSendReceiveDivision.createdBy = userId;
                                       $scope.externalSendReceiveDivision.editedOn = dateformatService.addMoreHours(new Date());
                                       $scope.externalSendReceiveDivision.editedBy = userId;
                                       AddExternalSendReceiveDivision();
                                   }
                                   else {
                                       UpdateExternalSendReceiveDivision();
                                   }
                               });
        }
        function UpdateExternalSendReceiveDivision() {
            apiService.put($rootScope.baseUrl + 'api/ExternalSendReceiveDivision/Update', $scope.externalSendReceiveDivision,
                function (result) {
                    if (!result.data.isValid) {
                        angular.forEach(result.data.brokenRules, function (value, key) {
                            notificationService.displayError(value.rule);
                        });
                        return;
                    }
                    notificationService.displaySuccess('Cập nhật thành công ' + result.data.value.title);
                    BindList();
                }, function (error) {
                    notificationService.displayError('Cập nhật không thành công');
                });
        }

        function AddExternalSendReceiveDivision() {
            apiService.post($rootScope.baseUrl + 'api/ExternalSendReceiveDivision/Add', $scope.externalSendReceiveDivision,
                function (result) {
                    if (!result.data.isValid) {
                        angular.forEach(result.data.brokenRules, function (value, key) {
                            notificationService.displayError(value.rule);
                        });
                        return;
                    }
                    
                    notificationService.displaySuccess('Cập nhật thành công ' + result.data.value.title);
                    $state.go('externalSendReceiveDivision');
                }, function (error) {
                    notificationService.displayError('Cập nhật không thành công');
                });
        }

        function loadExternalSendReceiveDivision() {
            apiService.get($rootScope.baseUrl + 'api/ExternalSendReceiveDivision/get/' + $stateParams.id, null,
                function (result) {
                    $scope.externalSendReceiveDivision = result.data.value;
                },
                function (error) {
                    notificationService.displayError('Không có dữ liệu')
                })
        }
        if ($stateParams.id != 0) {
            loadExternalSendReceiveDivision();
        }
        
    }
})(angular.module('VOfficeApp.externalSendReceiveDivision'));