(function (app) {
    app.controller('customerAddOrEditController', customerAddOrEditController);
    customerAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'notificationService',
                                      'focus',
                                      '$state',
                                      '$stateParams',
                                      '$ngBootbox',
                                      '$rootScope',
                                       'dateformatService']
    function customerAddOrEditController($scope,
                                    apiService,
                                    notificationService,
                                    focus,
                                    $state,
                                    $stateParams,
                                    $ngBootbox,
                                    $rootScope,
                                    dateformatService) {
        var departmentId = $scope.authentication.departmentId;
        if ($stateParams.id == 0) {
            $scope.titleForm = "Thêm mới khách hàng";
        }
        else {
            $scope.titleForm = "Cập nhật khách hàng";
        }
        $scope.focusCode = function () {
            focus('code');
        }
        $scope.customer = {};
        $scope.save = save;
        $scope.BindList = BindList;
        function BindList() {
            $state.go('customer', { currentPage: $stateParams.currentPage, keyword: $stateParams.keyword });
        }
        $scope.checkField = checkField;
        function checkField() {
            if ($scope.customer.code == '') {
                notificationService.displayError('Mã khách hàng không để trống');
                focus('code');
                return false;
            }
            else
                if ($scope.customer.title == '') {
                    notificationService.displayError('Tên khách hàng không để trống');
                    focus('title');
                    return false;
                }
                else
                    return true;
        }
        function save() {
            $ngBootbox.confirm('Bạn chắc chắn muốn cập nhật khách hàng này?')
                             .then(function () {
                                 if (checkField() == true)
                                 {
                                     if ($stateParams.id == 0) {
                                         $scope.customer.departmentId = departmentId;
                                         $scope.customer.code = $scope.customer.code;
                                         $scope.customer.title = $scope.customer.title;
                                         $scope.customer.shortTitle = $scope.customer.shortTitle;
                                         $scope.customer.order = $scope.customer.order;
                                         $scope.customer.address = $scope.customer.address;
                                         $scope.customer.phoneNumber = $scope.customer.phoneNumber;
                                         $scope.customer.fax = $scope.customer.fax;
                                         $scope.customer.taxNumber = $scope.customer.taxNumber;
                                         $scope.customer.bankName = $scope.customer.bankName;
                                         $scope.customer.active = $scope.customer.active;
                                         $scope.customer.deleted = 0;
                                         $scope.customer.bankAccountNumber = $scope.customer.bankAccountNumber;
                                         $scope.customer.taxNumber = $scope.customer.taxNumber;
                                         $scope.customer.createdOn = dateformatService.addMoreHours(new Date());
                                         $scope.customer.createdBy = $scope.authentication.userId;
                                         $scope.customer.editedOn = dateformatService.addMoreHours(new Date());
                                         $scope.customer.editedBy = $scope.authentication.userId;
                                         console.log($scope.customer);
                                         AddCustomer();
                                     }
                                     else {
                                         UpdateCustomer();
                                     }
                                 }
                             });
        }
        function UpdateCustomer() {
            $scope.customer.departmentId = departmentId;
            apiService.put($rootScope.baseUrl + 'api/Customer/Update', $scope.customer,
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
                        BindList();
                    }
                }, function (error) {
                    notificationService.displayError('Cập nhật không thành công');
                });
        }
        function AddCustomer() {
            apiService.post($rootScope.baseUrl + 'api/Customer/Add', $scope.customer,
                function (result) {
                    console.log(result);
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
                        BindList();
                    }
                    console.log(result.data.value);

                }, function (error) {
                    notificationService.displayError('Thêm mới không thành công');
                });
        }

        function loadCustomer() {
            apiService.get($rootScope.baseUrl + 'api/customer/get/' + $stateParams.id, null,
                function (result) {
                    console.log(result.data.value);
                    $scope.customer = result.data.value;
                },
                function (error) {
                    notificationService.displayError('Không có dữ liệu')
                })
        }
        if ($stateParams.id != 0 && $stateParams.id != null) {
            loadCustomer();
        }

    }
})(angular.module('VOfficeApp.customer'));