
(function (app) {


    app.controller('loginController', ['$scope', '$rootScope', '$http', 'loginService', '$injector', 'notificationService', '$q', 'authenticationService', 'authData', '$location', 'localStorageService', 'focus', 'fogLoading', 'apiService',
        function ($scope, $rootScope, $http, loginService, $injector, notificationService, $q, authenticationService, authData, $location, localStorageService, focus, fogLoading, apiService) {
            var userInfo;
            var deferred;
            $scope.loginData = {
                userName: "",
                password: ""
            };
            focus('form-username')

            $scope.loginSubmit = function () {
                loginService.login($scope.loginData.userName, $scope.loginData.password).then(function (response) {
                    if (response != null) {
                        if (response.data.error == "invalid_grant") {
                            $scope.notification = ' <p class=\'wrong-password-notice\'><i class=\'fa fa-exclamation-circle\'></i> Tài khoản hoặc mật khẩu không đúng.</p>';
                        }
                        else
                            if (response.data.error == "deleted") {
                                $scope.notification = ' <p class=\'wrong-password-notice\'><i class=\'fa fa-exclamation-circle\'></i> Tài khoản không tồn tại hoặc đã bị xóa.</p>';
                            }
                            else
                                if (response.data.error == "locked_out") {
                                    $scope.notification = ' <p class=\'wrong-password-notice\'><i class=\'fa fa-exclamation-circle\'></i> Tài khoản đã bị khóa.</p>';
                                }
                        focus('form-password');
                        var pwd = document.getElementById("form-password");
                        pwd.classList.add('wrong-password');
                        pwd.classList.remove('form-control');
                    }
                    else {

                        var deviceType = '';
                        var isMobile = {
                            Android: function () {
                                return navigator.userAgent.match(/Android/i);
                            },
                            BlackBerry: function () {
                                return navigator.userAgent.match(/BlackBerry/i);
                            },
                            iPhone: function () {
                                return navigator.userAgent.match(/iPhone/i);
                            },
                            iPad: function () {
                                return navigator.userAgent.match(/iPad/i);
                            },
                            Opera: function () {
                                return navigator.userAgent.match(/Opera Mini/i);
                            },
                            Windows: function () {
                                return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
                            },
                            any: function () {
                                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
                            }
                        };

                        var operatingSystem = '';
                        if (bowser.windows != null && bowser.windows == true) {
                            operatingSystem = 'Windows';
                            deviceType = 'PC/Laptop';
                        }
                        if (bowser.android != null && bowser.android == true) {
                            operatingSystem = 'Android';
                            deviceType = 'Android';
                        }
                        if (bowser.ios != null && bowser.ios == true) {
                            operatingSystem = 'iOS';
                            if (isMobile.iPhone()) deviceType = 'iPhone';
                            if (isMobile.iPad()) deviceType = 'iPad';
                        }
                        if (bowser.blackberry != null && bowser.blackberry == true) {
                            operatingSystem = 'BlackBerry';
                            deviceType = 'BlackBerry';
                        }
                        if (bowser.mac != null && bowser.mac == true) {
                            operatingSystem = 'Mac OS';
                            operatingSystem = 'iMac/MacBook';
                        }
                        if (bowser.windowsphone != null && bowser.windowsphone == true) {
                            operatingSystem = 'Windows Phone';
                            deviceType = 'Windows Phone';
                        }
                        if (bowser.linux != null && bowser.linux == true) {
                            operatingSystem = 'Linux';
                            operatingSystem = 'PC/Laptop';
                        }

                        var loginHistory = { id: null, userId: $scope.authentication.userId, oS: operatingSystem, deviceType: deviceType, deviceSerial: '', browserType: bowser.name, userHostAddress: '14.162.169.186', userLocation: 'VN', normalAccess: true, emailSent: true, attempOn: new Date() };

                        apiService.post($rootScope.baseUrl + 'api/LoginHistory/Add', loginHistory,
                                     function (result) {
                                         window.location.href = 'app/components/login/formAuthentication.html';
                                     }, function (error) { });



                    }
                });
            }
        }]);
})(angular.module('VOfficeApp'));













//var isMobile = {
//    Android: function () {
//        return navigator.userAgent.match(/Android/i);
//    },
//    BlackBerry: function () {
//        return navigator.userAgent.match(/BlackBerry/i);
//    },
//    iPhone: function () {
//        return navigator.userAgent.match(/iPhone/i);
//    },
//    iPad: function () {
//        return navigator.userAgent.match(/iPad/i);
//    },
//    Opera: function () {
//        return navigator.userAgent.match(/Opera Mini/i);
//    },
//    Windows: function () {
//        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
//    },
//    any: function () {
//        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
//    }
//};
//if (isMobile.iPhone()) alert('iPhone');
//if (isMobile.iPad()) alert('iPad');
//if (isMobile.Android()) alert('Android');
//if (isMobile.BlackBerry()) alert('BlackBerry');



//alert('browser: ' + bowser.name);
//alert('windows: ' + bowser.windows);
//alert('android: ' + bowser.android);
//alert('ios: ' + bowser.ios);
//alert('blackberry: ' + bowser.blackberry);
//alert('mac: ' + bowser.mac);
//alert('windowsphone: ' + bowser.windowsphone);
//alert('linux: ' + bowser.linux);