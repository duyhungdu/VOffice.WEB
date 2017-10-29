
//var resetPasswordApp = angular.module('resetPasswordApp',[]);
(function (app) {
    app.controller('resetPasswordController', ['$scope', '$rootScope', '$window', '$location', '$state', 'apiService', 'notificationService', 'fogLoading',
        function ($scope, $rootScope, $window, $location, $state, apiService, notificationService, fogLoading) {

            $scope.resetPassword = {
                email: "",
                password: "",
                confirmPassword: "",
                code: ""
            }

            var parseLocation = function (location) {

                var uri_dec = decodeURIComponent(location);
                var pairs = uri_dec.split("&");
                var obj = {};
                var pair;
                var i;

                for (i in pairs) {
                    if (pairs[i] === "") continue;

                    pair = pairs[i].split("=");
                    obj[(pair[0])] = (pair[1]);
                }

                var code = obj['code'];
                $scope.userid = obj['#!/reset-mat-khau?userId']
                var result = code.split(' ').join('+');
                return result + '==';
            };

            $scope.resetPassword.code = parseLocation(window.location.hash);

            $scope.loadEmail = function () {
                apiService.get($rootScope.baseUrl + 'api/Staff/GetStaffByUserId?userId=' + $scope.userid, null,
                    function (success) {
                        if (success.data.isSuccess == true) {
                            $scope.resetPassword.email = success.data.value.email;
                        }
                    },
                    function (error) {
                    })
            }
            $scope.loadEmail();
            $scope.changePassword = function () {

                apiService.post($rootScope.baseUrl + 'api/Account/RestorePassword', $scope.resetPassword,
                    function (result) {
                        
                        $scope.notification = ' <p class=\'fully-success-password-notice\'><i class=\'fa fa-exclamation-circle\'></i> Cập nhật mật khẩu thành công.</p>';
                        fogLoading('fog-modal', 'none');
                        $state.go('login');
                    },
                    function () {
                        fogLoading('fog-modal', 'none');
                        $scope.notification = ' <p class=\'wrong-password-notice\'><i class=\'fa fa-exclamation-circle\'></i> Có lỗi xảy ra. Xin vui lòng thử lại.</p>';
                    });

            }

        }])


})(angular.module('VOfficeApp.user'));
