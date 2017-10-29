(function (app) {
    app.controller('staffAddOrEditController', staffAddOrEditController);
    staffAddOrEditController.$inject = ['$scope',
                                      'apiService',
                                      'notificationService',
                                      'focus',
                                      '$state',
                                      '$stateParams',
                                      '$ngBootbox',
                                      'dateformatService',
                                      '$rootScope', '$http']

    function staffAddOrEditController($scope,
                                    apiService,
                                    notificationService,
                                    focus,
                                    $state,
                                    $stateParams,
                                    $ngBootbox,
                                    dateformatService,
                                    $rootScope, $http) {
        var userId = $scope.authentication.userId;
        var departmentId = $scope.authentication.departmentId;
        var departmentStaff = '';
        var departmentStaffText = "";
        $scope.staff = {};
        if ($stateParams.id == 0) {
            $scope.titleForm = "Thêm mới cán bộ";
            departmentStaff = $stateParams.departmentId;
            if ($scope.staff.avatar == undefined || $scope.staff.avatar == '') {
                $scope.staff.avatar = "Uploads/Avatar/no-avatar.jpg";
            }
            getDepartmentOfStaff();
        }
        else {
            $scope.titleForm = "Cập nhật cán bộ";
        }
        $scope.listGender = [{ id: 1, name: "Nam" }, { id: 2, name: "Nữ" }, { id: 3, name: "Khác" }];
        $scope.selectedGender = $scope.listGender[0];
        $scope.getDepartmentOfStaff = getDepartmentOfStaff;
        function getDepartmentOfStaff() {
            apiService.get($rootScope.baseUrl + 'api/Department/FilterDepartmentOrganiz?type=3&departmentId=' + departmentStaff + '&keyword=', null,
               function (result) {
                   angular.forEach(result.data.data, function (val, key) {
                       if (key < result.data.data.length - 1)
                           departmentStaffText += val.name + ' - ';
                       else
                           departmentStaffText += val.name;
                   });
                   $scope.infoDepartment = departmentStaffText;
               });
        };
        var type = 1;
        var avatarStaff = '';
        $scope.CheckPermission = CheckPermission;
        $scope.CheckPermission();
        function CheckPermission() {
            apiService.get($rootScope.baseUrl + 'api/AspNetRole/CheckPermission?userId=' + userId + '&roleName=sysadmin', null, function (result) {
                if (result.data.value == true) {
                    type = 0;
                }
                $scope.checkType = function () {
                    if (type == 0)
                        return true;
                    else return false;
                }
            }, function (error) {
                console.log(error);
            });
        }
        $scope.checkAction = checkAction;
        function checkAction() {
            if ($stateParams.id == 0)
                return true;
            else
                return false;
        }
        $scope.focusLastName = function () {
            focus('lastName');
        }

        $scope.departmentStaff = {};
        $scope.BindList = BindList;
        function BindList(type) {
            if (type == 0) {
                $state.go('department', { departmentSelectedId: $stateParams.departmentId, keyword: $stateParams.keyword });
            }
            else {
                $ngBootbox.confirm('Bạn chắc chắn muốn hủy?').then(function () {
                    $state.go('department', { departmentSelectedId: $stateParams.departmentId, keyword: $stateParams.keyword });
                });
            }
        }
        $scope.selectedFileAvata = function (input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#avatar')
                        .attr('src', e.target.result);
                };
                reader.readAsDataURL(input.files[0]);
            }
        }
        var uploadAvatar = function () {
            var files = $('#fileAvatar').get(0).files;
            var folderSave = 'Avatar-';
            if (files.length > 0) {
                var data = new FormData();
                for (i = 0; i < files.length; i++) {
                    data.append(folderSave + i, files[i]);
                    if (files[i].size > 512000) {
                        notificationService.displayError("Dung lượng ảnh kèm vượt quá 500KB.")
                        return;
                    }
                    var filename = files[i].name.split('.').pop();
                    if (filename == 'jpg' || filename == 'jpeg' || filename == 'png' || filename == 'gif') {
                        allowfileType = true;
                    }
                    else {
                        notificationService.displayError('Định dạng tệp tin không hợp lệ');
                        return;
                    }
                }
                $http.post($rootScope.baseUrl + "api/FileUpload/PostAvatarAsync", data,
                    {
                        headers:
                            { 'Content-Type': undefined }
                    }).then(
                    function (response) {
                        if (response.data.isSuccess == true) {
                            $scope.staff.avatar = response.data.message;
                            save();
                        } else {
                            notificationService.displayError(response.data.message);
                        }
                    },
                    function (error) {
                        console.log("Error while invoking the Web API");
                    });
            } else {
                save();
            }
        }
        function checkField() {
            if ($scope.staff.lastName == '' || $scope.staff.lastName == undefined) {
                notificationService.displayError('Họ, đệm không để trống');
                $scope.focusLastName();
                return false;
                return;
            }
            else if ($scope.staff.firstName == '' || $scope.staff.firstName == undefined) {
                notificationService.displayError('Tên không để trống');
                focus('firstName');
                return false;
                return;
            }
            else if ($scope.staff.phoneNumber == '' || $scope.staff.phoneNumber == undefined) {
                notificationService.displayError('Số điện thoại không để trống');
                focus('phoneNumber');
                return false;
                return;
            }
            else if ($scope.position == '' || $scope.position == undefined) {
                notificationService.displayError('Chức vụ không để trống');
                focus('position');
                return false;
                return;
            }
            else if ($scope.dateOfBirthString == '' || $scope.dateOfBirthString == undefined) {
                notificationService.displayError('Ngày sinh không để trống');
                focus('dateOfbirth');
                return false;
                return;
            }
            else return true;
        }
        $scope.updateProfile = function () {
            uploadAvatar();
        }
        function save() {
            $ngBootbox.confirm('Bạn chắc chắn muốn cập nhật dữ liệu này?')
                             .then(function () {
                                 if (checkField() == true) {
                                     $scope.staff.dateOfBirth = $scope.dateOfBirthString.split("/").reverse().join("-");
                                     $scope.staff.gender = $scope.selectedGender.id;
                                     $scope.staff.fullName = $scope.staff.lastName + ' ' + $scope.staff.firstName;
                                     if ($stateParams.id == 0) {
                                         $scope.staff.staffCode = $scope.staff.staffCode;
                                         $scope.staff.firstName = $scope.staff.firstName;
                                         $scope.staff.lastName = $scope.staff.lastName;
                                         $scope.staff.userId = null;
                                         $scope.staff.email = $scope.staff.email;
                                         $scope.staff.phoneNumber = $scope.staff.phoneNumber;
                                         $scope.staff.address = $scope.staff.address;
                                         $scope.staff.order = $scope.staff.order;
                                         $scope.staff.leader = $scope.staff.leader;
                                         $scope.staff.seniorLeader = $scope.staff.seniorLeader;
                                         $scope.staff.superLeader = $scope.staff.superLeader;
                                         $scope.staff.signedBy = $scope.staff.signedBy;
                                         $scope.staff.active = $scope.staff.active;
                                         $scope.staff.deleted = false;
                                         $scope.staff.createdOn = new Date();
                                         $scope.staff.createdBy = userId;
                                         $scope.staff.editedOn = new Date();
                                         $scope.staff.editedBy = userId;
                                         $scope.staff.departmentId = parseInt(departmentId);
                                         Addstaff();
                                     }
                                     else {
                                         Updatestaff();
                                     }
                                 }
                             });
        }
        function Updatestaff() {
            apiService.put($rootScope.baseUrl + 'api/Staff/Update', $scope.staff,
                function (result) {
                    if (!result.data.isValid) {
                        angular.forEach(result.data.brokenRules, function (value, key) {
                            notificationService.displayError(value.rule);
                        });
                        return;
                    }
                    if (!result.data.isSuccess) {
                        notificationService.displayError(result.data.message);
                        return;
                    }
                    else {
                        AddDepartmentStaff($scope.staff.id);

                    }
                }, function (error) {
                    notificationService.displayError('Cập nhật không thành công');
                });
        }
        function Addstaff() {
            $scope.staff.email = "N/A";
            apiService.post($rootScope.baseUrl + 'api/Staff/Add', $scope.staff, function (result) {
                if (!result.data.isValid) {
                    angular.forEach(result.data.brokenRules, function (value, key) {
                        notificationService.displayError(value.rule);
                    });
                    return;
                }
                if (!result.data.isSuccess) {
                    notificationService.displayError(result.data.message);
                    return;
                }
                else {
                    AddDepartmentStaff(result.data.value);
                }
            }, function (error) {
                notificationService.displayError('Thêm mới không thành công');
            });
        }
        function AddDepartmentStaff(staffId) {
            $scope.departmentStaff.departmentId = parseInt(departmentStaff);
            $scope.departmentStaff.staffId = staffId;
            $scope.departmentStaff.shortPosition = $scope.shortPosition;
            $scope.departmentStaff.position = $scope.position;
            $scope.departmentStaff.mainDepartment = true;
            $scope.departmentStaff.createdOn = new Date();
            $scope.departmentStaff.createdBy = userId;
            $scope.departmentStaff.editedOn = new Date();
            $scope.departmentStaff.editedBy = userId;
            apiService.post($rootScope.baseUrl + 'api/DepartmentStaff/Add', $scope.departmentStaff, function (result) {
                notificationService.displaySuccess('Cập nhật thành công');
                BindList(0);
            });
        }
        //Init
        var codeText = '';
        var codeNumber = '';
        if ($stateParams.id != 0 && $stateParams.id != null) {
            loadstaff();
        }
        else {
            if (type == 1) {
                apiService.get($rootScope.baseUrl + 'api/Department/FilterDepartmentOrganiz?type=3&departmentId=' + $stateParams.departmentId + '&keyword=', null, function (result) {
                    angular.forEach(result.data.data, function (val, key) {
                        if (val.root == 1) {
                            GetCodeStaff(val.id);
                        }
                    });
                });
            }
            else {
                GetCodeStaff(departmentId);
            }
        }
        $scope.GetCodeStaff = GetCodeStaff;
        function GetCodeStaff(departmentTempId)
        {
            apiService.get($rootScope.baseUrl + 'api/SystemConfigDepartment/GetValue?keyword=&departmentId=' + departmentTempId + '&title=STAFFCODE&defaultValue=CB', null, function (result) {
                codeText = result.data.value.value;
                apiService.get($rootScope.baseUrl + 'api/SystemConfigDepartment/GetValue?keyword=&departmentId=' + departmentTempId + '&title=STAFFNUMBER&defaultValue=0', null, function (result) {
                    //Generate staffCode
                    codeNumbertemp = parseInt(result.data.value.value) + 1;
                    if (codeNumbertemp < 10) {
                        codeNumber = '000' + codeNumbertemp;
                    }
                    else
                        if (codeNumbertemp < 100 && codeNumbertemp > 9) {
                            codeNumber = '00' + codeNumbertemp;
                        }
                        else if (codeNumbertemp < 1000 && codeNumbertemp > 99) {
                            codeNumber = '0' + codeNumbertemp;
                        }
                        else {
                            codeNumber = codeNumbertemp;
                        }
                    $scope.staff.staffCode = codeText + codeNumber;
                    //end generate staffCode
                });
            });
        }

        function loadstaff() {
            apiService.get($rootScope.baseUrl + 'api/Staff/GetById/' + $stateParams.id, null,
                function (result) {
                    $scope.staff = result.data.value;
                    $scope.dateOfBirthString = dateformatService.formatToDDMMYY(new Date($scope.staff.dateOfBirth));
                    var currentGender = $scope.listGender.filter(function (item) {
                        return item.id == $scope.staff.gender;
                    });
                    if (currentGender.length > 0) {
                        $scope.selectedGender = currentGender[0];
                    }
                    if ($scope.staff.avatar == null || $scope.staff.avatar == '')
                        $scope.staff.avatar = "Uploads/Avatar/no-avatar.jpg";
                    //lấy ra chức vụ và chức vụ viết tắt của nhân viên (đơn vị chính)
                    $scope.position = $stateParams.position;
                    $scope.shortPosition = $stateParams.shortPosition;
                    //lấy ra đơn vị cha của đơn vị chính
                    apiService.get($rootScope.baseUrl + 'api/Department/GetListDepartmentByStaffId?staffId=' + $stateParams.id, null, function (result) {
                        angular.forEach(result.data.data, function (val, key) {
                            if (val.mainDepartment == true) {
                                departmentStaff = val.id;
                                departmentStaffText += val.name;
                                apiService.get($rootScope.baseUrl + 'api/Department/FilterDepartmentOrganiz?type=3&departmentId=' + val.id + '&keyword=', null, function (result) {
                                    angular.forEach(result.data.data, function (val1, key) {
                                        if (parseInt(val1.id) != val.id) {
                                            departmentStaffText += ' - ' + val1.name;
                                            $scope.infoDepartment = departmentStaffText;
                                        }
                                    });
                                });
                            }
                        });
                    });
                },
                function (error) {
                    notificationService.displayError('Không có dữ liệu')
                })
        }
        //Init
    }
})(angular.module('VOfficeApp.staff'));