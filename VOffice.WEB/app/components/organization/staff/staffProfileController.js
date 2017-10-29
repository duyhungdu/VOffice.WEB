(function (app) {
    app.controller('staffProfileController', staffProfileController);

    staffProfileController.$inject = ['loginService', 'localStorageService', 'apiService', '$scope', '$rootScope', 'dateformatService', 'focus', '$http', 'notificationService'];

    function staffProfileController(loginService, localStorageService, apiService, $scope, $rootScope, dateformatService, focus, $http, notificationService) {
        focus('txtFullName');
        $scope.listGender = [{ id: 1, name: "Nam" }, { id: 2, name: "Nữ" }, { id: 3, name: "Khác" }];
        $scope.userInfo = {};

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

        var saveStaff = function () {
            var arrayFullName = $scope.userInfo.fullName.split(" ");
            $scope.staff.firstName = arrayFullName[arrayFullName.length - 1];
            arrayFullName.splice(arrayFullName.length - 1, 1);
            $scope.staff.lastName = arrayFullName.join(" ");
            $scope.staff.fullName = $scope.userInfo.fullName;
            $scope.staff.email = $scope.userInfo.email;
            $scope.staff.phoneNumber = $scope.userInfo.phoneNumber;
            $scope.staff.dateOfBirth = $scope.dateOfBirthString.split("/").reverse().join("-");
            $scope.staff.address = $scope.userInfo.address;
            $scope.staff.gender = $scope.selectedGender.id;
            $scope.staff.editedBy = $scope.authentication.userId;
            $scope.staff.editedOn = new Date();

            apiService.put($rootScope.baseUrl + 'api/Staff/Update', $scope.staff
                , function (result) {
                    if (result.data.isSuccess == true) {
                        //authData.authenticationData.avatar = result.data.value.avatar;
                        //authData.authenticationData.fullName = $scope.userInfo.fullName;
                        localStorageService.set("avatar", result.data.value.avatar);
                        localStorageService.set("fullName", $scope.userInfo.fullName);
                        if (!$scope.checked) {
                            notificationService.displaySuccess("Cập nhật thông tin cá nhân thành công");
                        } else {
                            var passConfig = {
                                oldPassword: $scope.oldPassword,
                                newPassword: $scope.newPassword,
                                confirmPassword: $scope.confirmPassword
                            }
                            apiService.post($rootScope.baseUrl + 'api/Account/ChangePassword', passConfig
                                , function (result) {
                                    /// load lai
                                    loginService.login($scope.authentication.email, $scope.newPassword).then(function (response) {
                                        if (response != null && response.data.error == "invalid_grant") {
                                            $scope.notification = 'Tài khoản hoặc mật khẩu không đúng. ';
                                            focus('form-username')
                                        }
                                        else {
                                            notificationService.displaySuccess("Cập nhật thông tin cá nhân thành công");
                                            window.location.href = 'app/components/login/formAuthentication.html';

                                        }
                                    });
                                }
                                , function (error) {
                                    console.log(error);
                                });
                        }
                    } else {
                        notificationService.displaySuccess("Cập nhật thông tin cá nhân không thành công: " + result.message);
                    }
                }, function (error) {
                    console.log(error);
                });

        }
        var uploadAvatar = function () {
            var files = $('#fileAvatar').get(0).files;
            var folderSave = 'Avatar-';

            if (files.length > 0) {
                var data = new FormData();
                for (i = 0; i < files.length; i++) {
                    data.append(folderSave + i, files[i]);
                    if (files[i].size > 512000) {
                        notificationService.displayError("Dung lượng ảnh vượt quá 500KB.")
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
                            saveStaff();
                        } else {
                            notificationService.displayError(response.data.message);
                        }
                    },
                    function (error) {
                        console.log("Error while invoking the Web API");
                    });
            } else {
                saveStaff();
            }

        }

        $scope.updateProfile = function () {
            apiService.get($rootScope.baseUrl + 'api/Staff/GetStaffByUserId?userId=' + $scope.authentication.userId, null,
                function (result) {
                    if (result.data.isSuccess == true) {
                        $scope.staff = result.data.value;
                        // upload avatar

                        uploadAvatar();
                    } else {
                        console.log(result.message);
                    }
                },
                function (error) {
                    console.log(error);
                });
        }

        $scope.loafProfile = function () {
            apiService.get($rootScope.baseUrl + 'api/Staff/GetStaffProfile?userId=' + $scope.authentication.userId, null,
                function (result) {
                    if (result.data.isSuccess == true) {
                        $scope.userInfo = result.data.value;
                        $scope.dateOfBirthString = dateformatService.formatToDDMMYY(new Date($scope.userInfo.dateOfBirth));
                        var currentGender = $scope.listGender.filter(function (item) {
                            return item.id == $scope.userInfo.gender;
                        });
                        if (currentGender.length > 0) {
                            $scope.selectedGender = currentGender[0];
                        }
                    } else {

                    }
                },
                function (error) {
                    console.log(error);
                });
        }

        $scope.loafProfile();

    }
})(angular.module('VOfficeApp.staff'));