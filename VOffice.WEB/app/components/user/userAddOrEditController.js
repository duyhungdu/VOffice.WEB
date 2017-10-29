(function (app) {
    app.controller('userAddOrEditController', userAddOrEditController);
    userAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'notificationService',
                                      'focus',
                                      '$state',
                                      '$stateParams',
                                      '$ngBootbox',
                                      'dateformatService',
                                      '$rootScope',
                                        '$http', 'fogLoading']

    function userAddOrEditController($scope,
                                    apiService,
                                    notificationService,
                                    focus,
                                    $state,
                                    $stateParams,
                                    $ngBootbox,
                                    dateformatService,
                                    $rootScope, $http, fogLoading) {
        var userId = $scope.authentication.userId;
        var departmentId = $scope.authentication.departmentId;


        $scope.user = {};
        $scope.staffs = [];
        $scope.showPassword = false;
        $scope.disableUserName = false;
        var userUpdateId = '';
        if ($stateParams.id == null)
            $stateParams.id = '0';
        if ($stateParams.id == '0') {
            $scope.titleForm = "Thêm mới người dùng";


        }
        else {
            $scope.titleForm = "Cập nhật người dùng";
            userUpdateId = $stateParams.id;
        }
        $scope.staffId = 0;
        if ($stateParams.staffId != null) {
            $scope.staffId = $stateParams.staffId;
        }

        if ($scope.staffId != 0 && $stateParams.id == '0') {
            apiService.get($rootScope.baseUrl + 'api/Staff/GetById?id=' + $scope.staffId, null, function (result) {
                if (result.data.value != null) {
                    result.data.value.aspNetUserId = result.data.value.userId;
                    if (result.data.value.avatar != null && result.data.value.avatar != '') {
                        result.data.value.avatar = $rootScope.baseUrl + result.data.value.avatar;
                    }
                    else {
                        result.data.value.avatar = $rootScope.baseUrl + 'Uploads/Avatar/no-avatar.jpg'
                    }
                    var listTemp = [];
                    listTemp.push(result.data.value);
                    $scope.staffs = listTemp;
                }
            }, function (error) { });
        }




        $scope.getAspNetUser = function (id) {
            apiService.get($rootScope.baseUrl + 'api/AspNetUser/GetUserByUserId?userId=' + id, null, function (result) {
                if (result.data.isSuccess == false)
                    notificationService.displayError(result.message);
                if (result.data.totalItems == 0)
                    notificationService.displayError("Không tìm thấy bản ghi khả dụng");
                $scope.user = result.data.value;
                $scope.showPassword = true;
                $scope.disableUserName = true;
                $scope.user.password = '1';
                $scope.user.confirmPassword = '1';

                var listStaffs = [];
                //staffs
                apiService.get($rootScope.baseUrl + 'api/Staff/GetStaffByUserId?userId=' + id, null, function (result) {
                    if (result.data.value != null) {
                        result.data.value.aspNetUserId = result.data.value.userId;
                        if (result.data.value.avatar != null && result.data.value.avatar != '') {
                            result.data.value.avatar = $rootScope.baseUrl + result.data.value.avatar;
                        }
                        else {
                            result.data.value.avatar = $rootScope.baseUrl + 'Uploads/Avatar/no-avatar.jpg'
                        }
                        listStaffs.push(result.data.value);
                        $scope.staffs = listStaffs;
                    }
                }, function (error) { });



            }, function () {
                console.log('Loading failure');
            });
        }
        if ($stateParams.id != '0') {
            $scope.getAspNetUser(userUpdateId);
            document.getElementById("googleAccount").focus();
        }
        else {
            document.getElementById("username").focus();
        }


        $scope.save = function () {
            if ($scope.staffs == null || $scope.staffs.length < 1) {
                notificationService.displayError("Vui lòng chọn cán bộ");
                return;
            }
            if (userUpdateId == '0' || userUpdateId == '') {
                apiService.get($rootScope.baseUrl + 'api/AspNetUser/GetUserByUserName?userName=' + $scope.user.userName, null,
                function (result) {
                    if (result.data.isSuccess == true) {
                        if (result.data.value != null) {
                            notificationService.displayError("Tài khoản đã tồn tại");
                            return;
                        }
                        else {
                            apiService.get($rootScope.baseUrl + 'api/AspNetRole/CheckPermission?userId=' + userId + '&roleName=sysadmin', null, function (result) {
                                if (result.data.value == true) {
                                    $scope.sysAdmin = true;
                                }
                                else {
                                    $scope.sysAdmin = false;
                                }
                                if ($scope.sysAdmin == true) {
                                    $scope.user.departmentId = null;
                                }
                                else {
                                    $scope.user.departmentId = $scope.authentication.departmentId;
                                }
                                $scope.user.email = $scope.user.userName;
                                $scope.user.expiryDate = null;
                                $scope.user.deleted = false;
                                $scope.user.createdOn = new Date();
                                $scope.user.createdBy = userId;
                                $scope.user.editedOn = new Date();
                                $scope.user.editedBy = userId;

                                apiService.post($rootScope.baseUrl + 'api/Account/Register', $scope.user, function (result) {
                                    //added user
                                    apiService.get($rootScope.baseUrl + 'api/Staff/GetById?id=' + $scope.staffs[0].id, null,
                function (staffresult) {
                    if (staffresult.data.value != null) {
                        var selectedStaff = staffresult.data.value;
                        //after query a staff by value selected in ng-input staff
                        selectedStaff.userId = result.data.id;
                        selectedStaff.email = result.data.email;
                        apiService.put($rootScope.baseUrl + 'api/Staff/Update', selectedStaff
                , function (resultupdatedStaff) {
                    //Thông báo thành công và quay lại trang danh sách
                    notificationService.displaySuccess('Tạo tài khoản thành công');
                    BindList();

                }, function (error) {

                });
                    }
                }, function (error) { });
                                }, function (error) {
                                    if (error.status == 400) {
                                        notificationService.displayError("Mật khẩu tối thiểu phải 6 kí tự.");
                                        fogLoading('fog-modal', 'none');
                                        return;
                                    }
                                });
                            }, function (error) { });



                        }
                    }
                }, null);
            }
            else {
                $scope.id = userUpdateId;
                $scope.user.editedOn = new Date();
                $scope.user.editedBy = userId;
                apiService.put($rootScope.baseUrl + 'api/AspNetUser/UpdateAspNetUser', $scope.user, function (result) {
                    apiService.get($rootScope.baseUrl + 'api/Staff/GetById?id=' + $scope.staffs[0].id, null,
                    function (staffresult) {
                        if (staffresult.data.value != null) {
                            var selectedStaff = staffresult.data.value;
                            //after query a staff by value selected in ng-input staff
                            selectedStaff.userId = result.data.value.id;
                            selectedStaff.email = result.data.value.email;
                            apiService.put($rootScope.baseUrl + 'api/Staff/UpdateStaffAccount', selectedStaff
                    , function (resultupdatedStaff) {
                        //Thông báo thành công và quay lại trang danh sách
                        notificationService.displaySuccess('Cập nhật tài khoản thành công');
                        BindList();

                    }, function (error) { });
                        }
                    }, function (error) { });


                }, function (error) { });
            }
        }
        $scope.loadStaff = function ($query) {
            return $scope.listStaffs.filter(function (field) {
                if ($query != null) {
                    return field.fullName.toLowerCase().indexOf($query.toLowerCase()) != -1;
                }
            });
        };
        $scope.loadStaffToAssignAccount = function () {
            apiService.get($rootScope.baseUrl + 'api/AspNetRole/CheckPermission?userId=' + userId + '&roleName=sysadmin', null, function (result) {
                if (result.data.value == true) {
                    $scope.sysAdmin = true;
                }
                else {
                    $scope.sysAdmin = false;
                }
                var departmentIdQueryStaffs = $scope.authentication.departmentId;
                if ($scope.sysAdmin == true) {
                    departmentIdQueryStaffs = 0;
                }
                apiService.get($rootScope.baseUrl + 'api/Staff/GetStaffNoAccountByDepartment?departmentId=' + departmentIdQueryStaffs, null,
               function (result) {
                   if (result.data.isSuccess == true) {
                       $scope.listStaffs = result.data.data;
                       angular.forEach($scope.listStaffs, function (value, key) {
                           if (value.avatar == '' || value.avatar == null) {
                               value.avatar = $rootScope.baseUrl + 'Uploads/Avatar/no-avatar.jpg';
                           }
                           else
                               value.avatar = $rootScope.baseUrl + value.avatar;
                       });
                   }
               }, null);

            }, function (error) {
                console.log(error);
            });
        }
        $scope.loadStaffToAssignAccount();
        $scope.forceOneTag = function (tags) {
            if ($scope.staffs != null) {
                var array = $scope.staffs;
                if (array.length > 1) {
                    var objRemove = {};
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].aspNetUserId == tags.aspNetUserId) {
                            objRemove = array[i];
                            array.splice(i, 1);
                        }
                    }
                }
                else {
                    $scope.staffs = array;
                }
            }
            else {

            }
        }
        $scope.BindList = BindList;
        function BindList() {
            $state.go('user', { id: $stateParams.id, groupId: $stateParams.groupId, keyword: $stateParams.keyword, currentPage: $stateParams.curentpage });
        }
    }
})(angular.module('VOfficeApp.user'));