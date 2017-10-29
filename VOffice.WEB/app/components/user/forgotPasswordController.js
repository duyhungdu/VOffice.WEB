(function (app) {
    app.controller('forgotPasswordController', forgotPasswordController);
    forgotPasswordController.$inject = ['$scope', '$rootScope', '$http', 'loginService', '$injector', 'notificationService', '$q', 'authenticationService', 'authData', '$location', 'localStorageService', 'focus', 'fogLoading', 'apiService'];

    function forgotPasswordController($scope, $rootScope, $http, loginService, $injector, notificationService, $q, authenticationService, authData, $location, localStorageService, focus, fogLoading, apiService) {
        $scope.forgotPassword = {
            email: ""
        };
        $scope.resetPassword = function () {
            apiService.post($rootScope.baseUrl + 'api/Account/ForgotPassword', $scope.forgotPassword,
                function (result) {
                    fogLoading('fog-modal', 'none');
                    $scope.notification = ' <p class=\'success-password-notice\'><i class=\'fa fa-exclamation-circle\'></i> Yêu cầu thiết lập lại mật khẩu đã được gửi tới email của bạn. Vui lòng làm theo hướng dẫn trong email bạn nhận được.</p>';
                   // notificationService.displaySuccess("Yêu cầu thiết lập lại mật khẩu đã được gửi tới email của bạn. Vui lòng làm theo hướng dẫn trong email bạn nhận được.");
                   // $state.go('login');

                },
                function (error) {
                    fogLoading('fog-modal', 'none');
                    if (error.status == 400) {
                        $scope.notification = ' <p class=\'wrong-password-notice\'><i class=\'fa fa-exclamation-circle\'></i> Email bạn vừa nhập không tồn tại trong hệ thống, xin vui lòng kiểm tra lại.</p>';
                    }
                })
        }
    }
})(angular.module('VOfficeApp.user'));